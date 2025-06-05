
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { 
  Home, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Shield,
  AlertTriangle,
  ClipboardList,
  User,
  MessageCircle
} from 'lucide-react';

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TopNavigation = ({ activeTab, onTabChange }: TopNavigationProps) => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile(user);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const userRole = profile?.role || 'user';

  const getNavigationItems = () => {
    if (userRole === 'admin') {
      return [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'incident-report', label: 'Reports', icon: FileText },
        { id: 'user-info', label: 'User Info', icon: User },
        { id: 'admin-requests', label: 'Requests', icon: ClipboardList },
        { id: 'settings', label: 'Settings', icon: Settings }
      ];
    } else if (userRole === 'govt_admin') {
      return [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'incident-report', label: 'Reports', icon: FileText },
        { id: 'review-requests', label: 'Review Requests', icon: ClipboardList },
        { id: 'safezones', label: 'Manage Zones', icon: Shield },
        { id: 'settings', label: 'Settings', icon: Settings }
      ];
    } else {
      return [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'sos', label: 'SOS', icon: AlertTriangle },
        { id: 'community', label: 'Community', icon: Users },
        { id: 'chatbot', label: 'Chat', icon: MessageCircle },
        { id: 'settings', label: 'Settings', icon: Settings }
      ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-emergency-600" />
            <span className="text-xl font-bold text-gray-900">SafeGuard</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-emergency-100 text-emergency-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Profile and Logout */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {profile?.full_name || user.email}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {userRole.replace('_', ' ')}
                  </p>
                </div>
                <div className="w-8 h-8 bg-emergency-100 rounded-full flex items-center justify-center">
                  <span className="text-emergency-600 font-medium text-sm">
                    {(profile?.full_name || user.email || '').charAt(0).toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-emergency-100 text-emergency-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              
              {user && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="px-4 py-2">
                    <p className="text-sm font-medium text-gray-900">
                      {profile?.full_name || user.email}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {userRole.replace('_', ' ')}
                    </p>
                  </div>
                  <button
                    onClick={signOut}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopNavigation;
