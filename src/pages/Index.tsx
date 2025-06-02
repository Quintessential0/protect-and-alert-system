
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import AuthForm from '@/components/AuthForm';
import Navigation from '@/components/Navigation';
import LocationSharing from '@/components/LocationSharing';
import EmergencyContacts from '@/components/EmergencyContacts';
import Settings from '@/components/Settings';
import RecordingPanel from '@/components/RecordingPanel';
import IncidentReporting from '@/components/IncidentReporting';
import EmotionalSupport from '@/components/EmotionalSupport';
import FakeCallScheduler from '@/components/FakeCallScheduler';
import SafeZoneManager from '@/components/SafeZoneManager';
import SafeZonesViewOnly from '@/components/SafeZonesViewOnly';
import AlertSystem from '@/components/AlertSystem';
import UserRecordingsView from '@/components/UserRecordingsView';
import UserContactsView from '@/components/UserContactsView';
import AdminRequests from '@/components/AdminRequests';
import GovernmentRequests from '@/components/GovernmentRequests';

const Index = () => {
  const { user, loading } = useAuth();
  const { profile } = useProfile(user);
  const [activeTab, setActiveTab] = useState('home');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emergency-50 to-emergency-100 flex items-center justify-center">
        <div className="animate-pulse text-emergency-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const userRole = profile?.role || 'user';

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to SafeGuard
              </h1>
              <p className="text-gray-600">
                Your personal safety companion. Stay connected, stay safe.
              </p>
            </div>
            <AlertSystem />
          </div>
        );
      case 'location':
        return <LocationSharing />;
      case 'contacts':
        return <EmergencyContacts />;
      case 'recording':
        return <RecordingPanel />;
      case 'incident-report':
        return <IncidentReporting />;
      case 'support':
        return <EmotionalSupport />;
      case 'fakecall':
        return <FakeCallScheduler />;
      case 'safezones':
        return userRole === 'govt_admin' ? <SafeZoneManager /> : <SafeZonesViewOnly />;
      case 'alerts':
        return <AlertSystem />;
      case 'settings':
        return <Settings />;
      case 'user-recordings':
        return <UserRecordingsView />;
      case 'user-contacts':
        return <UserContactsView />;
      case 'admin-requests':
        return <AdminRequests />;
      case 'govt-requests':
        return <GovernmentRequests />;
      default:
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900">Feature Coming Soon</h2>
            <p className="text-gray-600 mt-2">This feature is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emergency-50 to-emergency-100">
      <div className="container mx-auto px-4 py-6 pb-20 md:pb-6 md:pl-20">
        <main>
          {renderContent()}
        </main>
      </div>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
