
import React, { useState } from 'react';
import { Heart, BookOpen, Headphones, PenTool, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import SupportArticles from './SupportArticles';
import MeditationSessions from './MeditationSessions';
import PersonalJournal from './PersonalJournal';
import PersonalStories from './PersonalStories';
import RoleGuard from './RoleGuard';

const EmotionalSupport = () => {
  const [activeTab, setActiveTab] = useState('articles');
  const { user } = useAuth();
  const { profile } = useProfile(user);
  const userRole = profile?.role || 'user';

  const tabs = [
    { id: 'articles', label: 'Articles', icon: BookOpen },
    { id: 'meditation', label: 'Meditate', icon: Headphones },
    { id: 'journal', label: 'Journal', icon: PenTool },
    { id: 'stories', label: 'Stories', icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'articles':
        if (userRole === 'user') {
          return (
            <RoleGuard allowedRoles={['user']}>
              <SupportArticles />
            </RoleGuard>
          );
        } else {
          return (
            <RoleGuard allowedRoles={['admin', 'govt_admin']}>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Manage Support Articles</h2>
                <p className="text-gray-600 mb-4">Create and manage support articles for users.</p>
                <SupportArticles />
              </div>
            </RoleGuard>
          );
        }
      case 'meditation':
        return (
          <RoleGuard allowedRoles={['user', 'admin', 'govt_admin']}>
            <MeditationSessions />
          </RoleGuard>
        );
      case 'journal':
        return (
          <RoleGuard allowedRoles={['user']}>
            <PersonalJournal />
          </RoleGuard>
        );
      case 'stories':
        return (
          <RoleGuard allowedRoles={['user', 'admin', 'govt_admin']}>
            <PersonalStories />
          </RoleGuard>
        );
      default:
        return <SupportArticles />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Heart className="w-6 h-6 text-pink-600" />
          <h1 className="text-2xl font-bold text-gray-900">Emotional Support</h1>
        </div>
        
        <p className="text-gray-600 mb-6">
          {userRole === 'user' 
            ? 'Take care of your mental and emotional wellbeing with our support resources.'
            : 'Manage support resources and help users with their emotional wellbeing.'}
        </p>

        {/* Tab Navigation */}
        <div className="flex space-x-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            // Hide journal tab for non-users
            if (tab.id === 'journal' && userRole !== 'user') {
              return null;
            }
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default EmotionalSupport;
