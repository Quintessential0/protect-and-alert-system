
import React from 'react';
import { MapPin, Users, Video, Phone, Home, BookOpen, AlertTriangle, Bell } from 'lucide-react';

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
    },
    {
      id: 'alerts',
      title: 'Alerts',
      description: 'View safety alerts',
      icon: Bell,
      color: 'bg-yellow-500 hover:bg-yellow-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* SOS Button - styled like the uploaded image */}
      <div className="flex justify-center">
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={() => onFeatureSelect('sos')}
            className="w-48 h-48 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-2xl transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center group relative"
            aria-label="Emergency SOS Button"
          >
            {/* Outer glow effect */}
            <div className="absolute inset-0 rounded-full bg-red-500 opacity-30 animate-pulse scale-110"></div>
            
            <div className="text-center text-white z-10">
              <AlertTriangle className="w-12 h-12 mx-auto mb-2 group-hover:animate-bounce" />
              <div className="text-2xl font-bold">SOS</div>
              <div className="text-sm opacity-90">Tap for Help</div>
            </div>
          </button>
          
          <p className="text-center text-gray-600 max-w-sm text-sm">
            Press the SOS button to send an emergency alert to your contacts and share your location.
          </p>
        </div>
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
