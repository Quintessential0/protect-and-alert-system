
import React from 'react';
import EmergencyButton from '@/components/EmergencyButton';
import FeatureCards from './FeatureCards';

interface UserDashboardProps {
  onEmergencyTrigger: (incidentId: string) => void;
}

const UserDashboard = ({ onEmergencyTrigger }: UserDashboardProps) => {
  return (
    <>
      <div className="flex justify-center mb-8">
        <EmergencyButton onEmergencyTrigger={onEmergencyTrigger} />
      </div>

      <div className="text-center mb-8">
        <p className="text-gray-600 text-lg">
          Press the SOS button to send an emergency alert to your contacts and share your location.
        </p>
      </div>

      <FeatureCards />
    </>
  );
};

export default UserDashboard;
