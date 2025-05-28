
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
import PersonalStories from '@/components/PersonalStories';
import { Shield, MapPin, Users, LogOut, FileText, Phone, AlertTriangle, Heart, Camera, Zap, MessageCircle, Star, BookOpen } from 'lucide-react';
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
          <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-spin" />
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
      case 'incident-report':
        return <IncidentReporting />;
      case 'support':
        return <EmotionalSupport />;
      case 'alerts':
        return <AlertSystem />;
      case 'settings':
        return <Settings />;
      case 'stories':
        return <PersonalStories />;

      default:
        return (
          <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-purple-600 text-white px-6 py-8">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white bg-opacity-20 rounded-lg p-2">
                      <Shield className="w-8 h-8" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">SafeGuard</h1>
                      <p className="text-purple-100 capitalize">
                        {userRole === 'govt_admin' ? 'Government Official' : userRole} Dashboard
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>

                {userRole === 'user' && (
                  <div className="flex justify-center">
                    <EmergencyButton onEmergencyTrigger={handleEmergencyTrigger} />
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-8">
              <div className="max-w-4xl mx-auto">
                {/* Welcome Message */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Welcome to Your Safety Hub
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Your comprehensive safety companion with emergency tools, community support,
                    and instant assistance. Stay protected, stay connected.
                  </p>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {userRole === 'user' && (
                    <>
                      <div 
                        onClick={() => setActiveTab('location')}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
                      >
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="bg-blue-100 rounded-lg p-3">
                            <MapPin className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Location Sharing</h3>
                            <p className="text-sm text-gray-600">Share your real-time location</p>
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-sm text-blue-700">Keep your contacts informed about your whereabouts</p>
                        </div>
                      </div>

                      <div 
                        onClick={() => setActiveTab('contacts')}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
                      >
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="bg-green-100 rounded-lg p-3">
                            <Users className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Emergency Contacts</h3>
                            <p className="text-sm text-gray-600">Manage trusted contacts</p>
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-sm text-green-700">Add and organize your emergency contact list</p>
                        </div>
                      </div>

                      <div 
                        onClick={() => setActiveTab('recording')}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
                      >
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="bg-red-100 rounded-lg p-3">
                            <Camera className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Evidence Recording</h3>
                            <p className="text-sm text-gray-600">Capture audio/video evidence</p>
                          </div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3">
                          <p className="text-sm text-red-700">Discretely record important evidence</p>
                        </div>
                      </div>

                      <div 
                        onClick={() => setActiveTab('fakecall')}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
                      >
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="bg-purple-100 rounded-lg p-3">
                            <Phone className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Fake Call</h3>
                            <p className="text-sm text-gray-600">Emergency escape option</p>
                          </div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3">
                          <p className="text-sm text-purple-700">Schedule fake calls to get out of situations</p>
                        </div>
                      </div>

                      <div 
                        onClick={() => setActiveTab('safezones')}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
                      >
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="bg-teal-100 rounded-lg p-3">
                            <Shield className="w-6 h-6 text-teal-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Safe Zones</h3>
                            <p className="text-sm text-gray-600">View safe areas nearby</p>
                          </div>
                        </div>
                        <div className="bg-teal-50 rounded-lg p-3">
                          <p className="text-sm text-teal-700">Find safe locations and avoid danger zones</p>
                        </div>
                      </div>

                      <div 
                        onClick={() => setActiveTab('stories')}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
                      >
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="bg-orange-100 rounded-lg p-3">
                            <BookOpen className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Share Your Story</h3>
                            <p className="text-sm text-gray-600">Community stories & support</p>
                          </div>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-3">
                          <p className="text-sm text-orange-700">Share experiences and read inspiring stories</p>
                        </div>
                      </div>
                    </>
                  )}

                  {userRole === 'admin' && (
                    <>
                      <div 
                        onClick={() => setActiveTab('user-recordings')}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
                      >
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="bg-purple-100 rounded-lg p-3">
                            <FileText className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">User Media</h3>
                            <p className="text-sm text-gray-600">Access user recordings</p>
                          </div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3">
                          <p className="text-sm text-purple-700">Review and manage user-submitted evidence</p>
                        </div>
                      </div>

                      <div 
                        onClick={() => setActiveTab('admin-requests')}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
                      >
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="bg-yellow-100 rounded-lg p-3">
                            <Zap className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Admin Requests</h3>
                            <p className="text-sm text-gray-600">Request zone changes & data access</p>
                          </div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-3">
                          <p className="text-sm text-yellow-700">Submit requests to Government Officials</p>
                        </div>
                      </div>

                      <div 
                        onClick={() => setActiveTab('support')}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
                      >
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="bg-pink-100 rounded-lg p-3">
                            <Heart className="w-6 h-6 text-pink-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Support Content</h3>
                            <p className="text-sm text-gray-600">Create support resources</p>
                          </div>
                        </div>
                        <div className="bg-pink-50 rounded-lg p-3">
                          <p className="text-sm text-pink-700">Manage emotional support content and articles</p>
                        </div>
                      </div>
                    </>
                  )}

                  {userRole === 'govt_admin' && (
                    <>
                      <div 
                        onClick={() => setActiveTab('safezones')}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
                      >
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="bg-indigo-100 rounded-lg p-3">
                            <Shield className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Manage Safe Zones</h3>
                            <p className="text-sm text-gray-600">Create and update safety zones</p>
                          </div>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-3">
                          <p className="text-sm text-indigo-700">Define safe and unsafe areas for the community</p>
                        </div>
                      </div>

                      <div 
                        onClick={() => setActiveTab('incident-report')}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
                      >
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="bg-orange-100 rounded-lg p-3">
                            <AlertTriangle className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Review Reports</h3>
                            <p className="text-sm text-gray-600">Government oversight of reports</p>
                          </div>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-3">
                          <p className="text-sm text-orange-700">Review and process incident reports</p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Shared Features */}
                  <div 
                    onClick={() => setActiveTab('incident-report')}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-red-100 rounded-lg p-3">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Report Incident</h3>
                        <p className="text-sm text-gray-600">Report safety incidents</p>
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-sm text-red-700">Report incidents to help improve community safety</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab('support')}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-pink-100 rounded-lg p-3">
                        <Heart className="w-6 h-6 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Emotional Support</h3>
                        <p className="text-sm text-gray-600">Get help and resources</p>
                      </div>
                    </div>
                    <div className="bg-pink-50 rounded-lg p-3">
                      <p className="text-sm text-pink-700">Access mental health resources and support</p>
                    </div>
                  </div>
                </div>

                {/* Safety Stats */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white p-8">
                  <h3 className="text-2xl font-bold mb-4">Your Safety Matters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">24/7</div>
                      <div className="text-purple-100">Emergency Support</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">100%</div>
                      <div className="text-purple-100">Privacy Protected</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">∞</div>
                      <div className="text-purple-100">Community Support</div>
                    </div>
                  </div>
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
