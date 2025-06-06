
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { 
  Home, 
  Users, 
  MapPin, 
  Video, 
  Phone, 
  Shield, 
  MessageSquare, 
  Settings,
  FileSearch,
  BookOpen,
  Activity,
  Bell,
  BarChart3,
  UserCheck,
  Building2,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react';

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TopNavigation = ({ activeTab, onTabChange }: TopNavigationProps) => {
  const { user } = useAuth();
  const { profile } = useProfile(user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const userRole = profile?.role || 'user';

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'home', label: 'Home', icon: Home, roles: ['user', 'admin', 'govt_admin'] },
      { id: 'sos', label: 'SOS', icon: Shield, roles: ['user'] },
      { id: 'contacts', label: 'Contacts', icon: Users, roles: ['user'] },
      { id: 'location', label: 'Location', icon: MapPin, roles: ['user'] },
      { id: 'recording', label: 'Recording', icon: Video, roles: ['user'] },
      { id: 'fakecall', label: 'Fake Call', icon: Phone, roles: ['user'] },
      { id: 'safezones', label: 'Safe Zones', icon: Shield, roles: ['user', 'admin', 'govt_admin'] },
      { id: 'chatbot', label: 'AI Assistant', icon: MessageSquare, roles: ['user', 'admin', 'govt_admin'] },
      { id: 'community', label: 'Community', icon: Users, roles: ['user', 'admin', 'govt_admin'] },
      { id: 'resources', label: 'Resources', icon: BookOpen, roles: ['user', 'admin', 'govt_admin'] },
      { id: 'alerts', label: 'Alerts', icon: Bell, roles: ['user', 'admin', 'govt_admin'] },
      { id: 'activity-log', label: 'Activity Log', icon: Activity, roles: ['admin', 'govt_admin'] },
      { id: 'user-info', label: 'User Info', icon: UserCheck, roles: ['admin', 'govt_admin'] },
      { id: 'admin-requests', label: 'Admin Requests', icon: FileSearch, roles: ['admin'] },
      { id: 'govt-requests', label: 'Govt Requests', icon: Building2, roles: ['govt_admin'] },
      { id: 'review-requests', label: 'Review Requests', icon: FileSearch, roles: ['admin', 'govt_admin'] },
      { id: 'request', label: 'Data Request', icon: BarChart3, roles: ['admin', 'govt_admin'] },
      { id: 'settings', label: 'Settings', icon: Settings, roles: ['user', 'admin', 'govt_admin'] },
    ];

    return baseItems.filter(item => item.roles.includes(userRole));
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-emergency-600" />
            <span className="text-xl font-bold text-gray-900">SafeGuard</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.slice(0, 6).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-emergency-100 text-emergency-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Profile Section - Fixed for mobile */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Profile menu - single icon on mobile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-emergency-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {profile?.full_name || 'User'}
                </span>
              </button>

              {/* Profile dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-3 border-b">
                    <p className="text-sm font-medium text-gray-900">
                      {profile?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {userRole.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => {
                        onTabChange('settings');
                        setShowProfileMenu(false);
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <div className="grid grid-cols-2 gap-2 p-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 p-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? 'bg-emergency-100 text-emergency-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Overlay for profile menu */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </nav>
  );
};

export default TopNavigation;
