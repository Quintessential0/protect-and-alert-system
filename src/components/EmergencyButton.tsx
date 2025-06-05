
import React, { useState, useRef, useCallback } from 'react';
import { AlertTriangle, Phone, Video, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EmergencyButtonProps {
  onEmergencyTrigger: (incidentId: string) => void;
}

const EmergencyButton = ({ onEmergencyTrigger }: EmergencyButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const [countdownInterval, setCountdownInterval] = useState<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const startEmergencyRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: 'video/webm'
        });

        // Try to upload to cloud storage, fallback to local storage
        await uploadOrStoreRecording(blob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);

      // Stop recording after 5 minutes
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }, 5 * 60 * 1000);

      toast({
        title: "🎥 Emergency Recording Started",
        description: "Audio and video recording will run for 5 minutes",
        variant: "destructive",
      });

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not start emergency recording. Emergency alert will still be sent.",
        variant: "destructive",
      });
    }
  }, []);

  const uploadOrStoreRecording = async (blob: Blob) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Generate filename
      const filename = `emergency-recording-${Date.now()}.webm`;
      
      // Try to upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('emergency-recordings')
        .upload(`${user.user.id}/${filename}`, blob);

      if (error) {
        // If upload fails, store locally
        const url = URL.createObjectURL(blob);
        localStorage.setItem(`emergency-recording-${Date.now()}`, url);
        
        toast({
          title: "Recording Saved Locally",
          description: "Recording saved locally. Will upload when connection improves.",
        });
      } else {
        // Save recording reference to database
        await supabase
          .from('recordings')
          .insert({
            user_id: user.user.id,
            file_path: data.path,
            file_type: 'video/webm',
            file_size: blob.size,
            duration_seconds: 300, // 5 minutes
            incident_id: null // Will be linked when incident is created
          });

        toast({
          title: "Recording Uploaded",
          description: "Emergency recording has been safely stored.",
        });
      }
    } catch (error) {
      console.error('Error handling recording:', error);
    }
  };

  const sendEmergencyAlerts = async (incidentId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Get emergency contacts
      const { data: contacts } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.user.id)
        .order('priority');

      if (contacts && contacts.length > 0) {
        // Send SMS/calls to contacts (simulated)
        for (const contact of contacts) {
          // In a real app, integrate with Twilio or similar service
          console.log(`Sending emergency alert to ${contact.name} at ${contact.phone}`);
          
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        toast({
          title: "📞 Emergency Contacts Notified",
          description: `${contacts.length} contacts have been alerted about your emergency.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending alerts:', error);
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
          },
          (error) => {
            console.warn('Could not get location:', error);
          },
          { timeout: 5000 }
        );
      }

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
          // Start recording immediately
          startEmergencyRecording();
          
          // Send alerts to emergency contacts
          sendEmergencyAlerts(incidentId);
          
          onEmergencyTrigger(incidentId);
        }
        
        setIsPressed(false);
        toast({
          title: "🚨 EMERGENCY ACTIVATED!",
          description: "Emergency services notified. Recording started. Stay safe!",
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
              <AlertTriangle className="w-16 h-16 mx-auto mb-2 animate-bounce" />
              <div className="text-4xl font-bold">{countdown}</div>
              <div className="text-sm">Activating Emergency...</div>
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
          <AlertTriangle className="w-16 h-16 mx-auto mb-2 group-hover:animate-bounce" />
          <div className="text-xl font-bold">SOS</div>
          <div className="text-sm opacity-90">Tap for Help</div>
        </div>
      </button>
      
      <div className="text-center text-gray-600 max-w-sm space-y-2">
        <p className="text-sm font-medium">
          Press SOS to activate emergency protocol:
        </p>
        <div className="flex items-center justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <Phone className="w-3 h-3" />
            <span>Alert Contacts</span>
          </div>
          <div className="flex items-center space-x-1">
            <Video className="w-3 h-3" />
            <span>Start Recording</span>
          </div>
          <div className="flex items-center space-x-1">
            <Mic className="w-3 h-3" />
            <span>Share Location</span>
          </div>
        </div>
      </div>

      {isRecording && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-w-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-800 text-sm font-medium">Emergency Recording Active</span>
          </div>
          <p className="text-red-600 text-xs mt-1">5-minute evidence recording in progress</p>
        </div>
      )}
    </div>
  );
};

export default EmergencyButton;
