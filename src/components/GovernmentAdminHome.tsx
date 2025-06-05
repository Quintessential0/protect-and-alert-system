
import React from 'react';
import { MessageCircle, Users, BookOpen, Send } from 'lucide-react';

interface GovernmentAdminHomeProps {
  onFeatureSelect: (featureId: string) => void;
}

const GovernmentAdminHome = ({ onFeatureSelect }: GovernmentAdminHomeProps) => {
  const govAdminFeatures = [
    {
      id: 'chatbot',
      title: 'Chatbot',
      description: 'Communication and guidance support',
      icon: MessageCircle,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'community',
      title: 'Community',
      description: 'Post official and verified support content',
      icon: Users,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'resources',
      title: 'Resources',
      description: 'View and acknowledge resource edit requests from Admins',
      icon: BookOpen,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'request',
      title: 'Request',
      description: 'Request user data from Admins for investigations',
      icon: Send,
      color: 'bg-indigo-500 hover:bg-indigo-600'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Government Admin Dashboard</h1>
        <p className="text-gray-600">Oversee investigations, manage resources, and review administrative requests</p>
      </div>

      {/* Government Admin Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {govAdminFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <button
              key={feature.id}
              onClick={() => onFeatureSelect(feature.id)}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105 text-left"
            >
              <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center mb-6 transition-colors`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </button>
          );
        })}
      </div>

      {/* Quick Stats or Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h4 className="font-medium text-indigo-900 mb-1">Active Investigations</h4>
          <p className="text-indigo-700 text-sm">Ongoing data requests and reviews</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-1">Zone Requests</h4>
          <p className="text-green-700 text-sm">Admin submissions for safe zone updates</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-1">Resource Approvals</h4>
          <p className="text-purple-700 text-sm">Review and acknowledge resource changes</p>
        </div>
      </div>
    </div>
  );
};

export default GovernmentAdminHome;
