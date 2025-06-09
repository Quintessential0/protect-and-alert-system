
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import UserSettings from '@/components/settings/UserSettings';
import AdminSettings from '@/components/settings/AdminSettings';
import GovtAdminSettings from '@/components/settings/GovtAdminSettings';

const Settings = () => {
  const { user } = useAuth();
  const { profile } = useProfile(user);

  if (!user || !profile) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to access settings.</p>
        </div>
      </div>
    );
  }

  const userRole = profile.role || 'user';

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {userRole === 'admin' && <AdminSettings />}
        {userRole === 'govt_admin' && <GovtAdminSettings />}
        {userRole === 'user' && <UserSettings />}
      </div>
    </div>
  );
};

export default Settings;
