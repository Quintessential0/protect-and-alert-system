
import React from 'react';
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
import ChatbotSupport from '@/components/ChatbotSupport';
import MeditationSessions from '@/components/MeditationSessions';
import ScreamDetection from '@/components/ScreamDetection';
import AnonymousJournal from '@/components/AnonymousJournal';
import SafetyResourceDirectory from '@/components/SafetyResourceDirectory';
import ActivityHistory from '@/components/ActivityHistory';
import VoiceCommands from '@/components/VoiceCommands';

interface ContentRendererProps {
  activeTab: string;
  userRole: string;
}

const ContentRenderer = ({ activeTab, userRole }: ContentRendererProps) => {
  switch (activeTab) {
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
    case 'chatbot':
      return <ChatbotSupport />;
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
    case 'meditation':
      return <MeditationSessions />;
    case 'scream-detection':
      return <ScreamDetection />;
    case 'journal':
      return <AnonymousJournal />;
    case 'resources':
      return <SafetyResourceDirectory />;
    case 'activity':
      return <ActivityHistory />;
    case 'voice-commands':
      return <VoiceCommands />;
    default:
      return (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900">Feature Coming Soon</h2>
          <p className="text-gray-600 mt-2">This feature is under development.</p>
        </div>
      );
  }
};

export default ContentRenderer;
