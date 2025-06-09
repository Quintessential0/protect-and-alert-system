
import React, { useState } from 'react';
import { User, Shield } from 'lucide-react';
import ProfileSettings from './ProfileSettings';
import DataPrivacySettings from './DataPrivacySettings';

const AdminSettings = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const settingsSections = [
    {
      id: 'profile',
      title: 'Profile Information',
      description: 'Update your personal details',
      icon: User,
      component: ProfileSettings
    },
    {
      id: 'privacy',
      title: 'Data & Privacy',
      description: 'Manage your data and privacy settings',
      icon: Shield,
      component: DataPrivacySettings
    }
  ];

  if (activeSection) {
    const section = settingsSections.find(s => s.id === activeSection);
    if (section) {
      const Component = section.component;
      return (
        <div>
          <button
            onClick={() => setActiveSection(null)}
            className="mb-6 text-emergency-600 hover:text-emergency-700 font-medium"
          >
            ← Back to Settings
          </button>
          <Component />
        </div>
      );
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Settings</h1>
      <p className="text-gray-600 mb-8">Manage your administrative account</p>

      <div className="space-y-4">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 cursor-pointer border border-gray-200 hover:border-emergency-300"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emergency-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-emergency-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{section.title}</h3>
                  <p className="text-gray-600">{section.description}</p>
                </div>
                <div className="text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSettings;
