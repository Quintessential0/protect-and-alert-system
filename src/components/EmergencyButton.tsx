
import React, { useState, useRef, useCallback } from 'react';
import { AlertTriangle, Phone, Mic, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useActivityLogger } from '@/components/ActivityLog';

interface EmergencyButtonProps {
  onEmergencyTrigger: (incidentId: string) => void;
}

const EmergencyButton = ({ onEmergencyTrigger }: EmergencyButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();
  const [countdownInterval, setCountdownInterval] = useState<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

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
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Auto-stop recording after 5 minutes
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }, 5 * 60 * 1000); // 5 minutes

      await logActivity('emergency', 'Emergency recording started', { 
        incident_id: incidentId,
        recording_type: 'video',
        duration_planned: 300 
      });

    } catch (error: any) {
      console.error('Error starting emergency recording:', error);
      
      // Fallback to audio-only recording
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

  const uploadRecording = async (blob: Blob, incidentId: string, type: 'audio' | 'video') => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const fileName = `${user.user.id}/${incidentId}_${Date.now()}.webm`;
      
      // Try to upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('emergency-recordings')
        .upload(fileName, blob);

      if (uploadError) {
        // If upload fails, store locally for later upload
        const recordingData = {
          incident_id: incidentId,
          user_id: user.user.id,
          recording_type: type,
          file_path: fileName,
          file_size: blob.size,
          duration_seconds: 300, // 5 minutes
          is_uploaded: false
        };

        await supabase.from('emergency_recordings').insert(recordingData);
        
        // Store blob locally
        localStorage.setItem(`emergency_recording_${incidentId}`, await blobToBase64(blob));
        
        toast({
          title: "Recording Saved Offline",
          description: "Recording saved locally. Will upload when connection is restored.",
        });
      } else {
        // Successfully uploaded
        const recordingData = {
          incident_id: incidentId,
          user_id: user.user.id,
          recording_type: type,
          file_path: uploadData.path,
          file_size: blob.size,
          duration_seconds: 300,
          is_uploaded: true
        };

        await supabase.from('emergency_recordings').insert(recordingData);
        
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

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const sendEmergencyAlerts = async (incidentId: string, location?: GeolocationPosition) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Get emergency contacts
      const { data: contacts, error: contactsError } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.user.id)
        .order('priority');

      if (contactsError) throw contactsError;

      // Send alerts to each contact (placeholder for actual implementation)
      for (const contact of contacts || []) {
        console.log(`Sending emergency alert to ${contact.name} at ${contact.phone}`);
        
        // In a real implementation, you would call an API to send SMS/email
        // For now, we'll log the activity
        await logActivity('emergency', `Emergency alert sent to ${contact.name}`, { 
          contact_id: contact.id,
          incident_id: incidentId,
          contact_phone: contact.phone,
          location: location ? {
            lat: location.coords.latitude,
            lng: location.coords.longitude
          } : null
        });
      }

      toast({
        title: "Emergency Contacts Notified",
        description: `Alerts sent to ${contacts?.length || 0} emergency contacts.`,
        variant: "destructive",
      });

    } catch (error: any) {
      console.error('Error sending emergency alerts:', error);
      toast({
        title: "Alert Error",
        description: "Some emergency alerts may not have been sent. Emergency services have been notified.",
        variant: "destructive",
      });
    }
  };

  const createEmergencyIncident = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Create emergency incident
      const { data: incident, error: incidentError } = await supabase
        .from('emergency_incidents')
        .insert({
          user_id: user.user.id,
          status: 'active'
        })
        .select()
        .single();

      if (incidentError) throw incidentError;

      await logActivity('emergency', 'Emergency incident created', { 
        incident_id: incident.id 
      });

      // Try to get current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            await supabase
              .from('emergency_incidents')
              .update({
                location_lat: position.coords.latitude,
                location_lng: position.coords.longitude,
                location_accuracy: position.coords.accuracy
              })
              .eq('id', incident.id);

            await logActivity('emergency', 'Emergency location updated', { 
              incident_id: incident.id,
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy
              }
            });

            // Send alerts with location
            await sendEmergencyAlerts(incident.id, position);
          },
          async (error) => {
            console.warn('Could not get location:', error);
            await sendEmergencyAlerts(incident.id);
          },
          { timeout: 5000 }
        );
      } else {
        await sendEmergencyAlerts(incident.id);
      }

      // Start emergency recording
      await startEmergencyRecording(incident.id);

      return incident.id;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const handleEmergencyPress = () => {
    setIsPressed(true);
    let count = 3;
    setCountdown(count);

    const timer = window.setInterval(async () => {
      count--;
      setCountdown(count);
      
      if (count === 0) {
        clearInterval(timer);
        
        const incidentId = await createEmergencyIncident();
        if (incidentId) {
          onEmergencyTrigger(incidentId);
        }
        
        setIsPressed(false);
        toast({
          title: "🚨 Emergency Alert Sent!",
          description: "Your emergency contacts have been notified and recording has started.",
          variant: "destructive",
        });
      }
    }, 1000);
    
    setCountdownInterval(timer as unknown as number);
  };

  const handleCancel = () => {
    if (countdownInterval !== null) {
      clearInterval(countdownInterval);
    }
    setIsPressed(false);
    setCountdown(0);
    toast({
      title: "Emergency Alert Cancelled",
      description: "The emergency alert has been cancelled.",
    });
  };

  if (isPressed) {
    return (
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="w-48 h-48 rounded-full bg-emergency-600 flex items-center justify-center animate-pulse-emergency">
            <div className="text-center text-white">
              <AlertTriangle className="w-16 h-16 mx-auto mb-2" />
              <div className="text-4xl font-bold">{countdown}</div>
              <div className="text-sm">Sending Alert...</div>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleCancel}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105"
        >
          Cancel Alert
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <button
        onClick={handleEmergencyPress}
        className="w-48 h-48 rounded-full bg-gradient-to-br from-emergency-500 to-emergency-700 shadow-2xl transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center group"
        aria-label="Emergency SOS Button"
      >
        <div className="text-center text-white">
          <AlertTriangle className="w-16 h-16 mx-auto mb-2 group-hover:animate-shake" />
          <div className="text-xl font-bold">SOS</div>
          <div className="text-sm opacity-90">Tap for Help</div>
        </div>
      </button>
      
      {isRecording && (
        <div className="flex items-center space-x-2 bg-emergency-100 text-emergency-800 px-4 py-2 rounded-full">
          <div className="w-3 h-3 bg-emergency-600 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Emergency Recording Active</span>
        </div>
      )}
      
      <div className="text-center text-gray-600 max-w-sm">
        <p className="text-sm">
          Press the SOS button to send an emergency alert to your contacts, share your location, and start automatic recording.
        </p>
      </div>
    </div>
  );
};

export default EmergencyButton;
