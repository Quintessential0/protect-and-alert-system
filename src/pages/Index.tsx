
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import AuthForm from '@/components/AuthForm';
import Navigation from '@/components/Navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import UserDashboard from '@/components/dashboard/UserDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import ContentRenderer from '@/components/dashboard/ContentRenderer';
import AlertSystem from '@/components/AlertSystem';
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
    if (activeTab === 'home') {
      return (
        <div className="space-y-8">
          <DashboardHeader userRole={userRole} />
          
          {userRole === 'user' && <UserDashboard onEmergencyTrigger={handleEmergencyTrigger} />}
          <AdminDashboard userRole={userRole} />
          <AlertSystem />
        </div>
      );
    }

    return <ContentRenderer activeTab={activeTab} userRole={userRole} />;
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
