
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';
import Navigation from '@/components/Navigation';
import EmergencyButton from '@/components/EmergencyButton';
import LocationSharing from '@/components/LocationSharing';
import EmergencyContacts from '@/components/EmergencyContacts';
import AlertSystem from '@/components/AlertSystem';
import Settings from '@/components/Settings';
import RecordingPanel from '@/components/RecordingPanel';
import SafeZoneManager from '@/components/SafeZoneManager';
import FakeCallScheduler from '@/components/FakeCallScheduler';
import IncidentReporting from '@/components/IncidentReporting';
import EmotionalSupport from '@/components/EmotionalSupport';
import { Shield, MapPin, Users, Clock, LogOut, FileText, Phone, AlertTriangle, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [currentIncidentId, setCurrentIncidentId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleEmergencyTrigger = (incidentId: string) => {
    console.log('Emergency triggered! Incident ID:', incidentId);
    setCurrentIncidentId(incidentId);
    setActiveTab('recording');
  };

  const handleAuthSuccess = () => {
    toast({
      title: "Welcome to SafeGuard!",
      description: "Your personal safety companion is ready to protect you.",
    });
  };

  const handleSignOut = async () => {
    await signOut();
    setActiveTab('home');
    toast({
      title: "Signed Out",
      description: "You've been signed out successfully.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-emergency-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading SafeGuard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'location':
        return <LocationSharing />;
      case 'contacts':
        return <EmergencyContacts />;
      case 'alerts':
        return <AlertSystem />;
      case 'settings':
        return <Settings />;
      case 'recording':
        return (
          <RecordingPanel 
            incidentId={currentIncidentId || undefined}
            onRecordingComplete={(data) => {
              toast({
                title: "Evidence Recorded",
                description: `${data.type} recording saved successfully.`,
              });
            }}
          />
        );
      case 'safezones':
        return <SafeZoneManager />;
      case 'fakecall':
        return <FakeCallScheduler />;
      case 'incident-report':
        return <IncidentReporting />;
      case 'support':
        return <EmotionalSupport />;
      default:
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-8 h-8 text-emergency-600" />
                  <h1 className="text-3xl font-bold text-gray-900">SafeGuard</h1>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
              <p className="text-gray-600 max-w-md mx-auto">
                Welcome back! Your personal safety companion is ready to protect you.
              </p>
            </div>

            {/* Emergency Button */}
            <div className="flex justify-center mb-8">
              <EmergencyButton onEmergencyTrigger={handleEmergencyTrigger} />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">Ready</div>
                <div className="text-sm text-gray-600">Location Services</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Users className="w-8 h-8 text-safe-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">Protected</div>
                <div className="text-sm text-gray-600">Emergency Network</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Shield className="w-8 h-8 text-warning-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">Active</div>
                <div className="text-sm text-gray-600">Safety Monitoring</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setActiveTab('location')}
                  className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-left"
                >
                  <MapPin className="w-6 h-6 text-blue-600 mb-2" />
                  <div className="font-medium text-gray-900">Share Location</div>
                  <div className="text-sm text-gray-600">Let contacts know where you are</div>
                </button>
                
                <button 
                  onClick={() => setActiveTab('contacts')}
                  className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-left"
                >
                  <Users className="w-6 h-6 text-safe-600 mb-2" />
                  <div className="font-medium text-gray-900">Emergency Contacts</div>
                  <div className="text-sm text-gray-600">Manage your emergency contacts</div>
                </button>

                <button 
                  onClick={() => setActiveTab('recording')}
                  className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-left"
                >
                  <FileText className="w-6 h-6 text-emergency-600 mb-2" />
                  <div className="font-medium text-gray-900">Record Evidence</div>
                  <div className="text-sm text-gray-600">Capture audio/video evidence</div>
                </button>

                <button 
                  onClick={() => setActiveTab('incident-report')}
                  className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-left"
                >
                  <AlertTriangle className="w-6 h-6 text-warning-600 mb-2" />
                  <div className="font-medium text-gray-900">Report Incident</div>
                  <div className="text-sm text-gray-600">Manual incident reporting</div>
                </button>

                <button 
                  onClick={() => setActiveTab('support')}
                  className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-left"
                >
                  <Heart className="w-6 h-6 text-pink-600 mb-2" />
                  <div className="font-medium text-gray-900">Emotional Support</div>
                  <div className="text-sm text-gray-600">Articles, meditation & community</div>
                </button>

                <button 
                  onClick={() => setActiveTab('fakecall')}
                  className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-left"
                >
                  <Phone className="w-6 h-6 text-safe-600 mb-2" />
                  <div className="font-medium text-gray-900">Fake Call</div>
                  <div className="text-sm text-gray-600">Emergency escape option</div>
                </button>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-3">Safety Tip of the Day</h3>
              <p className="text-blue-800">
                Always let someone know your planned route and expected arrival time when traveling alone, especially at night.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto">
        {/* Status Bar Simulation */}
        <div className="bg-white px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-safe-500 rounded-full"></div>
            <span className="text-gray-600">Protected</span>
          </div>
          <div className="text-gray-500">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
          <div className="flex items-center space-x-1">
            <div className="text-gray-600">📶</div>
            <div className="text-gray-600">🔋</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-6">
          {renderTabContent()}
        </div>

        {/* Navigation */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;
