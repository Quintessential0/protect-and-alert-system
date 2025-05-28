
import React from 'react';
import { Shield, Home, MapPin, Users, Settings, Bell, FileText, Phone, AlertTriangle, Heart, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const { user } = useAuth();
  const { profile } = useProfile(user);
  const userRole = profile?.role || 'user';

  // Define which features each role can access
  const getNavItemsForRole = (role: string) => {
    const baseItems = [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'settings', label: 'Settings', icon: Settings },
    ];

    if (role === 'user') {
      return [
        ...baseItems,
        { id: 'location', label: 'Location', icon: MapPin },
        { id: 'contacts', label: 'Contacts', icon: Users },
        { id: 'recording', label: 'Record', icon: FileText },
        { id: 'incident-report', label: 'Report', icon: AlertTriangle },
        { id: 'support', label: 'Support', icon: Heart },
        { id: 'fakecall', label: 'Fake Call', icon: Phone },
        { id: 'safezones', label: 'Safe Zones', icon: Shield },
        { id: 'alerts', label: 'Alerts', icon: Bell },
      ];
    }

    if (role === 'admin') {
      return [
        ...baseItems,
        { id: 'user-recordings', label: 'User Media', icon: FileText },
        { id: 'user-contacts', label: 'User Contacts', icon: Users },
        { id: 'admin-requests', label: 'Requests', icon: Zap },
        { id: 'incident-report', label: 'Reports', icon: AlertTriangle },
        { id: 'support', label: 'Support', icon: Heart },
        { id: 'alerts', label: 'Alerts', icon: Bell },
      ];
    }

    if (role === 'govt_admin') {
      return [
        ...baseItems,
        { id: 'safezones', label: 'Manage Zones', icon: Shield },
        { id: 'incident-report', label: 'Reports', icon: AlertTriangle },
        { id: 'support', label: 'Support', icon: Heart },
        { id: 'alerts', label: 'Alerts', icon: Bell },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItemsForRole(userRole);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50 md:left-0 md:top-0 md:bottom-auto md:w-16 md:h-full md:border-r md:border-t-0">
      <div className="flex justify-around items-center max-w-md mx-auto md:flex-col md:h-full md:max-w-none md:space-y-4 md:py-8 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col md:flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-0 flex-shrink-0",
                isActive 
                  ? "text-emergency-600 bg-emergency-50" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
              <span className="text-xs mt-1 font-medium md:text-[9px] truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
