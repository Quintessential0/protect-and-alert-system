
import React from 'react';
import { Shield, Home, MapPin, Users, Settings, Bell, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'recording', label: 'Record', icon: FileText },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50 md:left-0 md:top-0 md:bottom-auto md:w-16 md:h-full md:border-r md:border-t-0">
      <div className="flex justify-around items-center max-w-md mx-auto md:flex-col md:h-full md:max-w-none md:space-y-4 md:py-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col md:flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-0",
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
