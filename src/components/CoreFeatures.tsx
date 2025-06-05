
import React from 'react';
import { 
  MapPin, 
  Phone, 
  Users, 
  FileText, 
  PhoneCall, 
  Shield, 
  MessageCircle, 
  BookOpen,
  AlertTriangle
} from 'lucide-react';

interface CoreFeaturesProps {
  onFeatureSelect: (featureId: string) => void;
}

const CoreFeatures = ({ onFeatureSelect }: CoreFeaturesProps) => {
  const features = [
    {
      id: 'location',
      title: 'Location Sharing',
      description: 'Share your location with trusted contacts',
      icon: MapPin,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'contacts',
      title: 'Emergency Contacts',
      description: 'Manage your emergency contact list',
      icon: Phone,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'community',
      title: 'Community',
      description: 'Connect with support community',
      icon: Users,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'incident-report',
      title: 'Report Incident',
      description: 'Report safety incidents in your area',
      icon: FileText,
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      id: 'fakecall',
      title: 'Fake Call',
      description: 'Schedule or trigger fake emergency calls',
      icon: PhoneCall,
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      id: 'safezones',
      title: 'Safe Zones',
      description: 'View safe areas and danger zones',
      icon: Shield,
      color: 'bg-teal-500 hover:bg-teal-600'
    },
    {
      id: 'alerts',
      title: 'Alerts',
      description: 'Emergency alerts and notifications',
      icon: AlertTriangle,
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      id: 'chatbot',
      title: 'Support Chat',
      description: 'Get help from our AI assistant',
      icon: MessageCircle,
      color: 'bg-cyan-500 hover:bg-cyan-600'
    },
    {
      id: 'resources',
      title: 'Safety Resources',
      description: 'Access safety resources and services',
      icon: BookOpen,
      color: 'bg-amber-500 hover:bg-amber-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <button
            key={feature.id}
            onClick={() => onFeatureSelect(feature.id)}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105 text-left group"
          >
            <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 transition-colors`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {feature.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default CoreFeatures;
