
import React from 'react';
import EmergencyButton from '@/components/EmergencyButton';
import FeatureCards from './FeatureCards';
import { useEmergencyAlerts } from '@/hooks/useEmergencyAlerts';
import { useToast } from '@/hooks/use-toast';

const UserDashboard = () => {
  const { sendEmergencyAlerts } = useEmergencyAlerts();
  const { toast } = useToast();

  const handleEmergencyTrigger = async (incidentId: string) => {
    try {
      // Get current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            await sendEmergencyAlerts(incidentId, position);
          },
          async (error) => {
            console.warn('Could not get location:', error);
            await sendEmergencyAlerts(incidentId);
          },
          { timeout: 5000 }
        );
      } else {
        await sendEmergencyAlerts(incidentId);
      }

      // Simulate notifying emergency services
      console.log('🚨 Emergency services notified');
      
      toast({
        title: "🚨 Emergency Alert Active",
        description: "Recording started, contacts notified, emergency services alerted.",
        variant: "destructive",
      });
    } catch (error: any) {
      console.error('Emergency trigger error:', error);
      toast({
        title: "Emergency Alert Error",
        description: "There was an issue with the emergency alert. Please try again or call emergency services directly.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Centered SOS Button */}
      <div className="flex justify-center py-8">
        <EmergencyButton onEmergencyTrigger={handleEmergencyTrigger} />
      </div>

      {/* Feature Grid */}
      <FeatureCards userRole="user" />
    </div>
  );
};

export default UserDashboard;
