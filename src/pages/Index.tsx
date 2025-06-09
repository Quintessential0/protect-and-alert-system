
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import AuthForm from '@/components/auth/AuthForm';
import TopNavigation from '@/components/TopNavigation';
import LandingPage from '@/components/LandingPage';
import UserDashboard from '@/components/dashboard/UserDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import GovtAdminDashboard from '@/components/dashboard/GovtAdminDashboard';
import ContentRenderer from '@/components/dashboard/ContentRenderer';
import ScreamDetection from '@/components/ScreamDetection';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { user, loading } = useAuth();
  const { profile } = useProfile(user);
  const [activeTab, setActiveTab] = useState('home');
  const [showAuth, setShowAuth] = useState(false);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const { toast } = useToast();

  const handleEmergencyTrigger = (incidentId: string) => {
    console.log('Emergency triggered with incident ID:', incidentId);
    setIsSOSActive(true);
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

  if (!user && !showAuth) {
    return (
      <LandingPage 
        onGetStarted={() => setShowAuth(true)} 
      />
    );
  }

  if (!user && showAuth) {
    return <AuthForm onAuthSuccess={() => window.location.reload()} />;
  }

  const userRole = profile?.role || 'user';

  const renderContent = () => {
    if (activeTab === 'home') {
      if (userRole === 'admin') {
        return <AdminDashboard onFeatureSelect={setActiveTab} />;
      } else if (userRole === 'govt_admin') {
        return <GovtAdminDashboard onFeatureSelect={setActiveTab} />;
      } else {
        return <UserDashboard onEmergencyTrigger={handleEmergencyTrigger} />;
      }
    }

    return (
      <div className="container mx-auto px-4 py-6">
        <ContentRenderer activeTab={activeTab} userRole={userRole} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emergency-50 to-emergency-100">
      <TopNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {renderContent()}
      </main>
      
      {userRole === 'user' && (
        <ScreamDetection 
          isActive={isSOSActive} 
          onDetection={() => {
            toast({
              title: "Distress Detected",
              description: "Additional alert sent based on audio detection.",
              variant: "destructive",
            });
          }} 
        />
      )}
    </div>
  );
};

export default Index;
