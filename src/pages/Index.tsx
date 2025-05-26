
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
import { Shield, MapPin, Users, Clock, LogOut, FileText, Phone, AlertTriangle, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const { profile } = useProfile();
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
      case 'location':
        return (
          <RoleGuard allowedRoles={['user']}>
            <LocationSharing />
          </RoleGuard>
        );
      case 'contacts':
        if (userRole === 'user') {
          return (
            <RoleGuard allowedRoles={['user']}>
              <EmergencyContacts />
            </RoleGuard>
          );
        } else {
          return (
            <RoleGuard allowedRoles={['admin']}>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">User Emergency Contacts</h2>
                <p className="text-gray-600">Admin view of all user emergency contacts for emergency response purposes.</p>
                {/* This would show all users' contacts for admin */}
              </div>
            </RoleGuard>
          );
        }
      case 'alerts':
        return <AlertSystem />;
      case 'settings':
        return <Settings />;
      case 'recording':
        if (userRole === 'user') {
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
        } else {
          return (
            <RoleGuard allowedRoles={['admin']}>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">User Recordings</h2>
                <p className="text-gray-600">Admin access to user emergency recordings for investigation purposes.</p>
                {/* This would show all user recordings for admin review */}
              </div>
            </RoleGuard>
          );
        }
      case 'safezones':
        if (userRole === 'user') {
          return (
            <RoleGuard allowedRoles={['user']}>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Safe Zones</h2>
                <p className="text-gray-600">View safe and unsafe zones in your area. Only government administrators can create or modify zones.</p>
                {/* Read-only view for users */}
              </div>
            </RoleGuard>
          );
        } else {
          return (
            <RoleGuard allowedRoles={['govt_admin']}>
              <SafeZoneManager />
            </RoleGuard>
          );
        }
      case 'fakecall':
        return (
          <RoleGuard allowedRoles={['user']}>
            <FakeCallScheduler />
          </RoleGuard>
        );
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
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">SafeGuard</h1>
                    <p className="text-sm text-gray-500 capitalize">{userRole} Dashboard</p>
                  </div>
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
                Welcome back! Your {userRole === 'user' ? 'personal safety companion' : 'administrative dashboard'} is ready.
              </p>
            </div>

            {/* Emergency Button - Only for users */}
            {userRole === 'user' && (
              <div className="flex justify-center mb-8">
                <EmergencyButton onEmergencyTrigger={handleEmergencyTrigger} />
              </div>
            )}

            {/* Role-specific Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {userRole === 'user' && (
                <>
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
                </>
              )}

              {userRole === 'admin' && (
                <>
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <FileText className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">Reports</div>
                    <div className="text-sm text-gray-600">Incident Management</div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <Users className="w-8 h-8 text-safe-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">Users</div>
                    <div className="text-sm text-gray-600">Contact Management</div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <Heart className="w-8 h-8 text-pink-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">Support</div>
                    <div className="text-sm text-gray-600">Content Management</div>
                  </div>
                </>
              )}

              {userRole === 'govt_admin' && (
                <>
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <Shield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">Zones</div>
                    <div className="text-sm text-gray-600">Safety Management</div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <AlertTriangle className="w-8 h-8 text-warning-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">Reports</div>
                    <div className="text-sm text-gray-600">Public Safety</div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <Heart className="w-8 h-8 text-pink-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">Support</div>
                    <div className="text-sm text-gray-600">Community Resources</div>
                  </div>
                </>
              )}
            </div>

            {/* Role-specific Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userRole === 'user' && (
                  <>
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
                      onClick={() => setActiveTab('fakecall')}
                      className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-left"
                    >
                      <Phone className="w-6 h-6 text-safe-600 mb-2" />
                      <div className="font-medium text-gray-900">Fake Call</div>
                      <div className="text-sm text-gray-600">Emergency escape option</div>
                    </button>
                  </>
                )}

                {(userRole === 'admin' || userRole === 'govt_admin') && (
                  <>
                    <button 
                      onClick={() => setActiveTab('incident-report')}
                      className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-left"
                    >
                      <AlertTriangle className="w-6 h-6 text-warning-600 mb-2" />
                      <div className="font-medium text-gray-900">View Reports</div>
                      <div className="text-sm text-gray-600">Review incident reports</div>
                    </button>

                    <button 
                      onClick={() => setActiveTab('support')}
                      className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-left"
                    >
                      <Heart className="w-6 h-6 text-pink-600 mb-2" />
                      <div className="font-medium text-gray-900">Manage Support</div>
                      <div className="text-sm text-gray-600">Create support content</div>
                    </button>
                  </>
                )}

                {userRole === 'govt_admin' && (
                  <button 
                    onClick={() => setActiveTab('safezones')}
                    className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-left"
                  >
                    <Shield className="w-6 h-6 text-blue-600 mb-2" />
                    <div className="font-medium text-gray-900">Manage Safe Zones</div>
                    <div className="text-sm text-gray-600">Create and update safety zones</div>
                  </button>
                )}

                {userRole === 'admin' && (
                  <>
                    <button 
                      onClick={() => setActiveTab('recording')}
                      className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-left"
                    >
                      <FileText className="w-6 h-6 text-emergency-600 mb-2" />
                      <div className="font-medium text-gray-900">View Recordings</div>
                      <div className="text-sm text-gray-600">Access user emergency recordings</div>
                    </button>

                    <button 
                      onClick={() => setActiveTab('contacts')}
                      className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-left"
                    >
                      <Users className="w-6 h-6 text-safe-600 mb-2" />
                      <div className="font-medium text-gray-900">User Contacts</div>
                      <div className="text-sm text-gray-600">Emergency contact management</div>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Safety Tips - Only for users */}
            {userRole === 'user' && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-3">Safety Tip of the Day</h3>
                <p className="text-blue-800">
                  Always let someone know your planned route and expected arrival time when traveling alone, especially at night.
                </p>
              </div>
            )}
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
