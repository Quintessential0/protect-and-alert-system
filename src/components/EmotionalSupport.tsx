
import React, { useState } from 'react';
import { Heart, BookOpen, Headphones, PenTool, Users } from 'lucide-react';
import SupportArticles from './SupportArticles';
import MeditationSessions from './MeditationSessions';
import PersonalJournal from './PersonalJournal';
import PersonalStories from './PersonalStories';

const EmotionalSupport = () => {
  const [activeTab, setActiveTab] = useState('articles');

  const tabs = [
    { id: 'articles', label: 'Articles', icon: BookOpen },
    { id: 'meditation', label: 'Meditate', icon: Headphones },
    { id: 'journal', label: 'Journal', icon: PenTool },
    { id: 'stories', label: 'Stories', icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'articles':
        return <SupportArticles />;
      case 'meditation':
        return <MeditationSessions />;
      case 'journal':
        return <PersonalJournal />;
      case 'stories':
        return <PersonalStories />;
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
          Take care of your mental and emotional wellbeing with our support resources.
        </p>

        {/* Tab Navigation */}
        <div className="flex space-x-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
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
