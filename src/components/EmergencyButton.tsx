
import React, { useState } from 'react';
import { AlertTriangle, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EmergencyButtonProps {
  onEmergencyTrigger: (incidentId: string) => void;
}

const EmergencyButton = ({ onEmergencyTrigger }: EmergencyButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();
  const [countdownInterval, setCountdownInterval] = useState<number | null>(null);

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
          onEmergencyTrigger(incidentId);
        }
        
        setIsPressed(false);
        toast({
          title: "🚨 Emergency Alert Sent!",
          description: "Your emergency contacts have been notified and your location has been shared.",
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
      
      <div className="text-center text-gray-600 max-w-sm">
        <p className="text-sm">
          Press the SOS button to send an emergency alert to your contacts and share your location.
        </p>
      </div>
    </div>
  );
};

export default EmergencyButton;
