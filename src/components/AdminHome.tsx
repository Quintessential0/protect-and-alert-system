
import React from 'react';
import { MessageCircle, Users, BookOpen, Bell } from 'lucide-react';

interface AdminHomeProps {
  onFeatureSelect: (featureId: string) => void;
}

const AdminHome = ({ onFeatureSelect }: AdminHomeProps) => {
  const adminFeatures = [
    {
      id: 'chatbot',
      title: 'Chatbot',
      description: 'AI-powered support assistance',
      icon: MessageCircle,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'community',
      title: 'Community',
      description: 'Manage community content and support',
      icon: Users,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'resources',
      title: 'Safety Resources',
      description: 'View and manage safety resources',
      icon: BookOpen,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'alerts',
      title: 'Alerts',
      description: 'View and manage user alerts',
      icon: Bell,
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage user support, community content, and safety resources</p>
      </div>

      {/* Admin Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {adminFeatures.map((feature) => {
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-1">Active Users</h4>
          <p className="text-blue-700 text-sm">Monitor user engagement and activity</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-medium text-orange-900 mb-1">Pending Alerts</h4>
          <p className="text-orange-700 text-sm">Review and respond to user alerts</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-1">Resource Requests</h4>
          <p className="text-green-700 text-sm">Manage safety resource updates</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
