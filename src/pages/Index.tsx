
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import AuthForm from '@/components/AuthForm';
import Navigation from '@/components/Navigation';
import RoleGuard from '@/components/RoleGuard';
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
import UserRecordingsView from '@/components/UserRecordingsView';
import UserContactsView from '@/components/UserContactsView';
import SafeZonesViewOnly from '@/components/SafeZonesViewOnly';
import AdminRequests from '@/components/AdminRequests';
import { Shield, MapPin, Users, LogOut, FileText, Phone, AlertTriangle, Heart, Camera, Zap, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const { profile } = useProfile(user);
  const [activeTab, setActiveTab] = useState('home');
  const [currentIncidentId, setCurrentIncidentId] = useState<string | null>(null);
  const { toast } = useToast();

  const userRole = profile?.role || 'user';

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
      // User-only features
      case 'location':
        return (
          <RoleGuard allowedRoles={['user']}>
            <LocationSharing />
          </RoleGuard>
        );
      case 'contacts':
        return (
          <RoleGuard allowedRoles={['user']}>
            <EmergencyContacts />
          </RoleGuard>
        );
      case 'recording':
        return (
          <RoleGuard allowedRoles={['user']}>
            <RecordingPanel 
              incidentId={currentIncidentId || undefined}
              onRecordingComplete={(data) => {
                toast({
                  title: "Evidence Recorded",
                  description: `${data.type} recording saved successfully.`,
                });
              }}
            />
          </RoleGuard>
        );
      case 'fakecall':
        return (
          <RoleGuard allowedRoles={['user']}>
            <FakeCallScheduler />
          </RoleGuard>
        );
      case 'safezones':
        if (userRole === 'user') {
          return (
            <RoleGuard allowedRoles={['user']}>
              <SafeZonesViewOnly />
            </RoleGuard>
          );
        } else {
          return (
            <RoleGuard allowedRoles={['govt_admin']}>
              <SafeZoneManager />
            </RoleGuard>
          );
        }

      // Admin-only features
      case 'user-recordings':
        return (
          <RoleGuard allowedRoles={['admin']}>
            <UserRecordingsView />
          </RoleGuard>
        );
      case 'user-contacts':
        return (
          <RoleGuard allowedRoles={['admin']}>
            <UserContactsView />
          </RoleGuard>
        );
      case 'admin-requests':
        return (
          <RoleGuard allowedRoles={['admin']}>
            <AdminRequests />
          </RoleGuard>
        );

      // Shared features with role-specific views
      case 'incident-report':
        return <IncidentReporting />;
      case 'support':
        return <EmotionalSupport />;
      case 'alerts':
        return <AlertSystem />;
      case 'settings':
        return <Settings />;

      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100">
            {/* Hero Section */}
            <div className="text-center py-16 px-6">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-white rounded-full p-4 shadow-lg">
                  <Shield className="w-12 h-12 text-teal-600" />
                </div>
              </div>
              
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Your Safety, <span className="text-teal-600">Always First</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Empowering women with comprehensive safety tools, community support,
                and instant emergency assistance. You're never alone.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                {userRole === 'user' && (
                  <div className="flex justify-center">
                    <EmergencyButton onEmergencyTrigger={handleEmergencyTrigger} />
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 bg-white border border-teal-200 text-teal-700 px-6 py-3 rounded-lg hover:bg-teal-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>

              <div className="inline-block bg-white rounded-lg px-4 py-2 shadow-sm">
                <span className="text-sm text-gray-600 capitalize">
                  {userRole === 'govt_admin' ? 'Government Official' : userRole} Dashboard
                </span>
              </div>
            </div>

            {/* Features Section */}
            <div className="py-16 px-6">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Comprehensive Safety Features
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Emergency SOS */}
                <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-teal-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Emergency SOS</h3>
                  <p className="text-gray-600">
                    Instant emergency alerts to your trusted contacts and local authorities
                  </p>
                </div>

                {/* Location Tracking */}
                <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Location Tracking</h3>
                  <p className="text-gray-600">
                    Real-time location sharing and safe zone monitoring
                  </p>
                </div>

                {/* AI Assistant */}
                <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">AI Assistant</h3>
                  <p className="text-gray-600">
                    24/7 AI chatbot for guidance and emotional support
                  </p>
                </div>

                {/* Mental Health */}
                <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-pink-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Mental Health</h3>
                  <p className="text-gray-600">
                    Wellness resources, meditation, and community support
                  </p>
                </div>

                {/* Community */}
                <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Community</h3>
                  <p className="text-gray-600">
                    Connect with other women and share safety experiences
                  </p>
                </div>

                {/* Evidence Recording */}
                <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Evidence Recording</h3>
                  <p className="text-gray-600">
                    Discreet audio and video recording for safety documentation
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="py-16 px-6 bg-white">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Quick Actions</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userRole === 'user' && (
                    <>
                      <button 
                        onClick={() => setActiveTab('location')}
                        className="flex items-center p-6 rounded-xl border-2 border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all duration-200 text-left group"
                      >
                        <div className="bg-teal-100 rounded-lg p-3 mr-4 group-hover:bg-teal-200 transition-colors">
                          <MapPin className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Share Location</div>
                          <div className="text-sm text-gray-600">Let contacts know where you are</div>
                        </div>
                      </button>
                      
                      <button 
                        onClick={() => setActiveTab('contacts')}
                        className="flex items-center p-6 rounded-xl border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left group"
                      >
                        <div className="bg-green-100 rounded-lg p-3 mr-4 group-hover:bg-green-200 transition-colors">
                          <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Emergency Contacts</div>
                          <div className="text-sm text-gray-600">Manage your emergency contacts</div>
                        </div>
                      </button>

                      <button 
                        onClick={() => setActiveTab('recording')}
                        className="flex items-center p-6 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 text-left group"
                      >
                        <div className="bg-red-100 rounded-lg p-3 mr-4 group-hover:bg-red-200 transition-colors">
                          <FileText className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Record Evidence</div>
                          <div className="text-sm text-gray-600">Capture audio/video evidence</div>
                        </div>
                      </button>

                      <button 
                        onClick={() => setActiveTab('fakecall')}
                        className="flex items-center p-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group"
                      >
                        <div className="bg-blue-100 rounded-lg p-3 mr-4 group-hover:bg-blue-200 transition-colors">
                          <Phone className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Fake Call</div>
                          <div className="text-sm text-gray-600">Emergency escape option</div>
                        </div>
                      </button>
                    </>
                  )}

                  {userRole === 'admin' && (
                    <>
                      <button 
                        onClick={() => setActiveTab('user-recordings')}
                        className="flex items-center p-6 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left group"
                      >
                        <div className="bg-purple-100 rounded-lg p-3 mr-4 group-hover:bg-purple-200 transition-colors">
                          <FileText className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">User Media</div>
                          <div className="text-sm text-gray-600">Access user recordings</div>
                        </div>
                      </button>

                      <button 
                        onClick={() => setActiveTab('admin-requests')}
                        className="flex items-center p-6 rounded-xl border-2 border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200 text-left group"
                      >
                        <div className="bg-yellow-100 rounded-lg p-3 mr-4 group-hover:bg-yellow-200 transition-colors">
                          <Zap className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Admin Requests</div>
                          <div className="text-sm text-gray-600">Request zone changes & data access</div>
                        </div>
                      </button>

                      <button 
                        onClick={() => setActiveTab('support')}
                        className="flex items-center p-6 rounded-xl border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all duration-200 text-left group"
                      >
                        <div className="bg-pink-100 rounded-lg p-3 mr-4 group-hover:bg-pink-200 transition-colors">
                          <Heart className="w-6 h-6 text-pink-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Support Content</div>
                          <div className="text-sm text-gray-600">Create support resources</div>
                        </div>
                      </button>
                    </>
                  )}

                  {userRole === 'govt_admin' && (
                    <>
                      <button 
                        onClick={() => setActiveTab('safezones')}
                        className="flex items-center p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 text-left group"
                      >
                        <div className="bg-indigo-100 rounded-lg p-3 mr-4 group-hover:bg-indigo-200 transition-colors">
                          <Shield className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Manage Safe Zones</div>
                          <div className="text-sm text-gray-600">Create and update safety zones</div>
                        </div>
                      </button>

                      <button 
                        onClick={() => setActiveTab('incident-report')}
                        className="flex items-center p-6 rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 text-left group"
                      >
                        <div className="bg-orange-100 rounded-lg p-3 mr-4 group-hover:bg-orange-200 transition-colors">
                          <AlertTriangle className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Review Reports</div>
                          <div className="text-sm text-gray-600">Government oversight of reports</div>
                        </div>
                      </button>
                    </>
                  )}
                </div>
              </div>
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
        <div className={activeTab === 'home' ? '' : 'px-4 py-6'}>
          {renderTabContent()}
        </div>

        {/* Navigation */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;
