
import React from 'react';
import { MapPin, Users, FileText, Phone, Shield, Heart } from 'lucide-react';

const FeatureCards = () => {
  const features = [
    {
      title: 'Location Sharing',
      description: 'Share your real-time location',
      detail: 'Keep your contacts informed about your whereabouts',
      icon: MapPin,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-600'
    },
    {
      title: 'Emergency Contacts',
      description: 'Manage trusted contacts',
      detail: 'Add and organize your emergency contact list',
      icon: Users,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-600'
    },
    {
      title: 'Evidence Recording',
      description: 'Capture audio/video evidence',
      detail: 'Discretely record important evidence',
      icon: FileText,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      textColor: 'text-red-600'
    },
    {
      title: 'Fake Call',
      description: 'Emergency escape option',
      detail: 'Schedule fake calls to get out of situations',
      icon: Phone,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-600'
    },
    {
      title: 'Safe Zones',
      description: 'View safe areas nearby',
      detail: 'Find safe locations and avoid danger zones',
      icon: Shield,
      bgColor: 'bg-teal-100',
      iconColor: 'text-teal-600',
      textColor: 'text-teal-600'
    },
    {
      title: 'Share Your Story',
      description: 'Community stories & support',
      detail: 'Share experiences and read inspiring stories',
      icon: Heart,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start space-x-4">
              <div className={`${feature.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${feature.iconColor}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{feature.description}</p>
                <p className={`${feature.textColor} text-sm`}>{feature.detail}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeatureCards;
