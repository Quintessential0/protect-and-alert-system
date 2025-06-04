
import React from 'react';
import { MapPin, Users, Video, Phone, Home, BookOpen, AlertTriangle } from 'lucide-react';

interface CoreFeaturesProps {
  onFeatureSelect: (featureId: string) => void;
}

const CoreFeatures = ({ onFeatureSelect }: CoreFeaturesProps) => {
  const coreFeatures = [
    {
      id: 'location',
      title: 'Location Sharing',
      description: 'Share your real-time location',
      icon: MapPin,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'contacts',
      title: 'Emergency Contacts',
      description: 'Manage trusted contacts',
      icon: Users,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'recording',
      title: 'Evidence Recording',
      description: 'Record audio and video',
      icon: Video,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'fakecall',
      title: 'Fake Call',
      description: 'Schedule emergency calls',
      icon: Phone,
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      id: 'safezones',
      title: 'Safe Zones',
      description: 'Find safe locations',
      icon: Home,
      color: 'bg-teal-500 hover:bg-teal-600'
    },
    {
      id: 'resources',
      title: 'Safety Resources',
      description: 'Access safety guides',
      icon: BookOpen,
      color: 'bg-red-500 hover:bg-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Emergency Alert Button */}
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <button
          onClick={() => onFeatureSelect('alerts')}
          className="w-full bg-emergency-600 text-white py-6 px-8 rounded-xl hover:bg-emergency-700 transition-colors"
        >
          <div className="flex items-center justify-center space-x-3">
            <AlertTriangle className="w-8 h-8" />
            <div>
              <h3 className="text-2xl font-bold">Emergency Alert</h3>
              <p className="text-emergency-100">Tap for immediate help</p>
            </div>
          </div>
        </button>
      </div>

      {/* Core Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coreFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <button
              key={feature.id}
              onClick={() => onFeatureSelect(feature.id)}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105 text-left"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 transition-colors`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CoreFeatures;
