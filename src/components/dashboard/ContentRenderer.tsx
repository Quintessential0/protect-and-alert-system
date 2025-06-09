
import React from 'react';
import EmergencyContacts from '@/components/EmergencyContacts';
import LocationSharing from '@/components/LocationSharing';
import RecordingPanel from '@/components/RecordingPanel';
import FakeCallScheduler from '@/components/FakeCallScheduler';
import SafeZonesViewOnly from '@/components/SafeZonesViewOnly';
import SafetyResourceDirectory from '@/components/SafetyResourceDirectory';
import AlertSystem from '@/components/AlertSystem';
import Settings from '@/components/Settings';
import ChatbotSupport from '@/components/ChatbotSupport';
import Community from '@/components/Community';
import AdminApprovals from '@/components/AdminApprovals';
import GovernmentRequests from '@/components/GovernmentRequests';
import UserInfo from '@/components/UserInfo';
import SafeZoneManager from '@/components/SafeZoneManager';
import IncidentReporting from '@/components/IncidentReporting';
import EmotionalSupport from '@/components/EmotionalSupport';

interface ContentRendererProps {
  activeTab: string;
  userRole: string;
}

const ContentRenderer = ({ activeTab, userRole }: ContentRendererProps) => {
  // Common components for all users
  if (activeTab === 'chatbot') return <ChatbotSupport />;
  if (activeTab === 'community') return <Community />;
  if (activeTab === 'resources') return <SafetyResourceDirectory />;
  if (activeTab === 'settings') return <Settings />;
  if (activeTab === 'incident-report') return <IncidentReporting />;

  // User-specific components
  if (userRole === 'user') {
    switch (activeTab) {
      case 'emergency-contacts':
        return <EmergencyContacts />;
      case 'location-sharing':
        return <LocationSharing />;
      case 'recording':
        return <RecordingPanel />;
      case 'fake-call':
        return <FakeCallScheduler />;
      case 'safe-zones':
        return <SafeZonesViewOnly />;
      case 'alerts':
        return <AlertSystem />;
      case 'emotional-support':
        return <EmotionalSupport />;
      default:
        return <div className="text-center py-8"><p className="text-gray-600">Feature not found.</p></div>;
    }
  }

  // Admin-specific components
  if (userRole === 'admin') {
    switch (activeTab) {
      case 'review-requests':
        return <AdminApprovals />;
      case 'user-info':
        return <UserInfo />;
      case 'admin-requests':
        return <AdminApprovals />;
      default:
        return <div className="text-center py-8"><p className="text-gray-600">Feature not found.</p></div>;
    }
  }

  // Government Admin-specific components
  if (userRole === 'govt_admin') {
    switch (activeTab) {
      case 'govt-requests':
        return <GovernmentRequests />;
      case 'data-request':
        return <GovernmentRequests />;
      case 'user-info':
        return <UserInfo />;
      case 'safezones':
        return <SafeZoneManager />;
      default:
        return <div className="text-center py-8"><p className="text-gray-600">Feature not found.</p></div>;
    }
  }

  return <div className="text-center py-8"><p className="text-gray-600">Feature not found.</p></div>;
};

export default ContentRenderer;
