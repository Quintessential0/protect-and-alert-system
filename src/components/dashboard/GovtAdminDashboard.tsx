
import React from 'react';
import { MessageSquare, Users, BookOpen, FileSearch } from 'lucide-react';

interface GovtAdminDashboardProps {
  onFeatureSelect: (feature: string) => void;
}

const GovtAdminDashboard = ({ onFeatureSelect }: GovtAdminDashboardProps) => {
  const govFeatures = [
    {
      id: 'chatbot',
      title: 'AI Assistant',
      description: 'Government-level AI support and assistance',
      icon: MessageSquare,
      color: 'bg-blue-600'
    },
    {
      id: 'community',
      title: 'Community Oversight',
      description: 'Monitor community activities and content',
      icon: Users,
      color: 'bg-purple-600'
    },
    {
      id: 'resources',
      title: 'Resource Management',
      description: 'Manage public safety resources and information',
      icon: BookOpen,
      color: 'bg-green-600'
    },
    {
      id: 'govt-requests',
      title: 'Data Requests',
      description: 'Request user information for investigations',
      icon: FileSearch,
      color: 'bg-red-600'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Government Admin Dashboard</h1>
        <p className="text-gray-600">Comprehensive oversight and data management tools</p>
      </div>

      <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
        {govFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <button
              key={feature.id}
              onClick={() => onFeatureSelect(feature.id)}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-center"
            >
              <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-6`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GovtAdminDashboard;
