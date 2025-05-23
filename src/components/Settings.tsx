
import React from 'react';
import { Settings as SettingsIcon, Shield, User, Smartphone, MapPin, Bell } from 'lucide-react';

const Settings = () => {
  const settingsGroups = [
    {
      title: 'Safety & Security',
      icon: Shield,
      settings: [
        { name: 'Auto Emergency Detection', description: 'Automatically detect emergencies', enabled: true },
        { name: 'Location Services', description: 'Share location during emergencies', enabled: true },
        { name: 'Audio Recording', description: 'Record audio during SOS activation', enabled: false },
        { name: 'Video Recording', description: 'Record video during SOS activation', enabled: false },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        { name: 'Push Notifications', description: 'Receive safety alerts and updates', enabled: true },
        { name: 'Emergency Alerts', description: 'High priority emergency notifications', enabled: true },
        { name: 'Location Warnings', description: 'Alerts when entering unsafe areas', enabled: true },
        { name: 'Contact Notifications', description: 'Notify when contacts trigger SOS', enabled: true },
      ]
    },
    {
      title: 'Privacy',
      icon: User,
      settings: [
        { name: 'Location History', description: 'Store location history for safety', enabled: true },
        { name: 'Anonymous Reporting', description: 'Report incidents anonymously', enabled: false },
        { name: 'Data Sharing', description: 'Share safety data for community insights', enabled: false },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <SettingsIcon className="w-6 h-6 text-emergency-600" />
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
        </div>

        <div className="space-y-6">
          {settingsGroups.map((group, groupIndex) => {
            const GroupIcon = group.icon;
            return (
              <div key={groupIndex} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                <div className="flex items-center space-x-2 mb-4">
                  <GroupIcon className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{group.title}</h3>
                </div>
                
                <div className="space-y-4">
                  {group.settings.map((setting, settingIndex) => (
                    <div key={settingIndex} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{setting.name}</div>
                        <div className="text-sm text-gray-600">{setting.description}</div>
                      </div>
                      
                      <div className={`w-12 h-6 rounded-full relative transition-all duration-200 ${
                        setting.enabled ? 'bg-safe-500' : 'bg-gray-300'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-all duration-200 ${
                          setting.enabled ? 'right-0.5' : 'left-0.5'
                        }`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Account</h3>
        
        <div className="space-y-4">
          <button className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Profile Information</div>
                <div className="text-sm text-gray-600">Update your personal details</div>
              </div>
              <div className="text-gray-400">›</div>
            </div>
          </button>
          
          <button className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Emergency Plan</div>
                <div className="text-sm text-gray-600">Set up your emergency response plan</div>
              </div>
              <div className="text-gray-400">›</div>
            </div>
          </button>
          
          <button className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Data & Privacy</div>
                <div className="text-sm text-gray-600">Manage your data and privacy settings</div>
              </div>
              <div className="text-gray-400">›</div>
            </div>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Support</h3>
        
        <div className="space-y-3">
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-all duration-200">
            <div className="font-medium text-gray-900">Help Center</div>
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-all duration-200">
            <div className="font-medium text-gray-900">Contact Support</div>
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-all duration-200">
            <div className="font-medium text-gray-900">Report a Bug</div>
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-all duration-200">
            <div className="font-medium text-emergency-600">Emergency Hotlines</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
