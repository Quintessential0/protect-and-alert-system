
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
import ChatbotSupport from '@/components/ChatbotSupport';
import EmergencyButton from '@/components/EmergencyButton';
import { Shield, MapPin, Users, FileText, Phone, AlertTriangle, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { user, loading } = useAuth();
  const { profile } = useProfile(user);
  const [activeTab, setActiveTab] = useState('home');
  const { toast } = useToast();

  const handleEmergencyTrigger = (incidentId: string) => {
    console.log('Emergency triggered with incident ID:', incidentId);
    toast({
      title: "Emergency Alert Sent!",
      description: "Your emergency contacts have been notified.",
      variant: "destructive",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emergency-50 to-emergency-100 flex items-center justify-center">
        <div className="animate-pulse text-emergency-600 text-lg">Loading SafeGuard...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={() => window.location.reload()} />;
  }

  const userRole = profile?.role || 'user';

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-12 h-12 text-emergency-600 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">SafeGuard</h1>
                  <p className="text-gray-600">
                    {userRole === 'user' && 'User Dashboard'}
                    {userRole === 'admin' && 'Admin Dashboard'}
                    {userRole === 'govt_admin' && 'Government Admin Dashboard'}
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Button - Only for regular users */}
            {userRole === 'user' && (
              <>
                <div className="flex justify-center mb-8">
                  <EmergencyButton onEmergencyTrigger={handleEmergencyTrigger} />
                </div>

                {/* Alert text */}
                <div className="text-center mb-8">
                  <p className="text-gray-600 text-lg">
                    Press the SOS button to send an emergency alert to your contacts and share your location.
                  </p>
                </div>
              </>
            )}

            {/* Role-specific welcome message */}
            {userRole === 'admin' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-blue-900 mb-2">Admin Dashboard</h2>
                <p className="text-blue-700">
                  Manage user data, review requests, and oversee safety operations.
                </p>
              </div>
            )}

            {userRole === 'govt_admin' && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-purple-900 mb-2">Government Admin Dashboard</h2>
                <p className="text-purple-700">
                  Review government requests, manage safe zones, and oversee incident reports.
                </p>
              </div>
            )}

            {/* Feature Cards Grid - Only for regular users */}
            {userRole === 'user' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location Sharing */}
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Sharing</h3>
                      <p className="text-gray-600 text-sm mb-2">Share your real-time location</p>
                      <p className="text-blue-600 text-sm">Keep your contacts informed about your whereabouts</p>
                    </div>
                  </div>
                </div>

                {/* Emergency Contacts */}
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Contacts</h3>
                      <p className="text-gray-600 text-sm mb-2">Manage trusted contacts</p>
                      <p className="text-green-600 text-sm">Add and organize your emergency contact list</p>
                    </div>
                  </div>
                </div>

                {/* Evidence Recording */}
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Evidence Recording</h3>
                      <p className="text-gray-600 text-sm mb-2">Capture audio/video evidence</p>
                      <p className="text-red-600 text-sm">Discretely record important evidence</p>
                    </div>
                  </div>
                </div>

                {/* Fake Call */}
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Phone className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Fake Call</h3>
                      <p className="text-gray-600 text-sm mb-2">Emergency escape option</p>
                      <p className="text-purple-600 text-sm">Schedule fake calls to get out of situations</p>
                    </div>
                  </div>
                </div>

                {/* Safe Zones */}
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="bg-teal-100 p-3 rounded-lg">
                      <Shield className="w-6 h-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Safe Zones</h3>
                      <p className="text-gray-600 text-sm mb-2">View safe areas nearby</p>
                      <p className="text-teal-600 text-sm">Find safe locations and avoid danger zones</p>
                    </div>
                  </div>
                </div>

                {/* Share Your Story */}
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Heart className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Your Story</h3>
                      <p className="text-gray-600 text-sm mb-2">Community stories & support</p>
                      <p className="text-orange-600 text-sm">Share experiences and read inspiring stories</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
