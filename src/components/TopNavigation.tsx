
import React, { useState } from 'react';
import { Shield, User, ChevronDown, Settings, LogOut, Clock, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TopNavigation = ({ activeTab, onTabChange }: TopNavigationProps) => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile(user);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const userRole = profile?.role || 'user';

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getNavItemsForRole = (role: string) => {
    const baseItems = [
      { id: 'home', label: 'Home' },
      { id: 'incident-report', label: 'Report' },
      { id: 'chatbot', label: 'Chatbot' },
    ];

    if (role === 'user') {
      return [
        ...baseItems,
        { id: 'community', label: 'Community' },
      ];
    }

    if (role === 'admin') {
      return [
        ...baseItems,
        { id: 'user-recordings', label: 'User Media' },
        { id: 'user-contacts', label: 'User Contacts' },
        { id: 'admin-requests', label: 'Requests' },
      ];
    }

    if (role === 'govt_admin') {
      return [
        ...baseItems,
        { id: 'govt-requests', label: 'Review Requests' },
        { id: 'safezones', label: 'Manage Zones' },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItemsForRole(userRole);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-emergency-600" />
          <h1 className="text-xl font-bold text-gray-900">SafeGuard</h1>
        </div>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-emergency-100 text-emergency-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="hidden sm:block">{profile?.full_name || user?.email || 'Profile'}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="py-1">
                <button
                  onClick={() => {
                    onTabChange('settings');
                    setShowProfileMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => {
                    onTabChange('activity');
                    setShowProfileMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  <Clock className="w-4 h-4" />
                  <span>Activity Log</span>
                </button>
                <hr className="my-1" />
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <User className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden mt-4 border-t pt-4">
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-emergency-100 text-emergency-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;
