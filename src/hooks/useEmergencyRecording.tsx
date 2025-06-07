
import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useActivityLogger } from '@/components/ActivityLog';

export const useEmergencyRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const uploadRecording = async (blob: Blob, incidentId: string, type: 'audio' | 'video') => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const fileName = `${user.user.id}/${incidentId}_${Date.now()}.webm`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('emergency-recordings')
        .upload(fileName, blob);

      if (uploadError) {
        const recordingData = {
          incident_id: incidentId,
          user_id: user.user.id,
          file_type: type,
          file_path: fileName,
          file_size: blob.size,
          duration_seconds: 300
        };

        await supabase.from('recordings').insert(recordingData);
        localStorage.setItem(`emergency_recording_${incidentId}`, await blobToBase64(blob));
        
        toast({
          title: "Recording Saved Offline",
          description: "Recording saved locally. Will upload when connection is restored.",
        });
      } else {
        const recordingData = {
          incident_id: incidentId,
          user_id: user.user.id,
          file_type: type,
          file_path: uploadData.path,
          file_size: blob.size,
          duration_seconds: 300
        };

        await supabase.from('recordings').insert(recordingData);
        
        await logActivity('emergency', 'Emergency recording uploaded successfully', { 
          incident_id: incidentId,
          file_path: uploadData.path,
          file_size: blob.size 
        });

        toast({
          title: "Recording Saved",
          description: "Emergency recording has been securely uploaded.",
        });
      }
    } catch (error: any) {
      console.error('Error handling recording:', error);
    }
  };

  const startEmergencyRecording = useCallback(async (incidentId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: true 
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        await uploadRecording(blob, incidentId, 'video');
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }, 5 * 60 * 1000);

      await logActivity('emergency', 'Emergency recording started', { 
        incident_id: incidentId,
        recording_type: 'video',
        duration_planned: 300 
      });

    } catch (error: any) {
      console.error('Error starting emergency recording:', error);
      
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioRecorder = new MediaRecorder(audioStream);
        mediaRecorderRef.current = audioRecorder;
        recordedChunksRef.current = [];

        audioRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        audioRecorder.onstop = async () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
          await uploadRecording(blob, incidentId, 'audio');
          audioStream.getTracks().forEach(track => track.stop());
        };

        audioRecorder.start();
        setIsRecording(true);

        setTimeout(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
          }
        }, 5 * 60 * 1000);

        await logActivity('emergency', 'Emergency audio recording started (fallback)', { 
          incident_id: incidentId,
          recording_type: 'audio' 
        });

      } catch (audioError: any) {
        console.error('Error starting audio recording:', audioError);
        toast({
          title: "Recording Error",
          description: "Could not start emergency recording. Emergency alert will still be sent.",
          variant: "destructive",
        });
      }
    }
  }, [logActivity, toast]);

  return {
    isRecording,
    startEmergencyRecording
  };
};
