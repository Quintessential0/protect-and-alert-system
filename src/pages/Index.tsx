
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import EmergencyButton from '@/components/EmergencyButton';
import LocationSharing from '@/components/LocationSharing';
import EmergencyContacts from '@/components/EmergencyContacts';
import AlertSystem from '@/components/AlertSystem';
import Settings from '@/components/Settings';
import { Shield, MapPin, Users, Clock } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const handleEmergencyTrigger = () => {
    console.log('Emergency triggered! Sending alerts...');
    // In a real app, this would trigger the emergency protocol
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'location':
        return <LocationSharing />;
      case 'contacts':
        return <EmergencyContacts />;
      case 'alerts':
        return <AlertSystem />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Shield className="w-8 h-8 text-emergency-600" />
                <h1 className="text-3xl font-bold text-gray-900">SafeGuard</h1>
              </div>
              <p className="text-gray-600 max-w-md mx-auto">
                Your personal safety companion. Stay protected and connected with emergency features designed for your peace of mind.
              </p>
            </div>

            {/* Emergency Button */}
            <div className="flex justify-center mb-8">
              <EmergencyButton onEmergencyTrigger={handleEmergencyTrigger} />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">Active</div>
                <div className="text-sm text-gray-600">Location Tracking</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Users className="w-8 h-8 text-safe-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">2</div>
                <div className="text-sm text-gray-600">Emergency Contacts</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Clock className="w-8 h-8 text-warning-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Active Alerts</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setActiveTab('location')}
                  className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-left"
                >
                  <MapPin className="w-6 h-6 text-blue-600 mb-2" />
                  <div className="font-medium text-gray-900">Share Location</div>
                  <div className="text-sm text-gray-600">Let contacts know where you are</div>
                </button>
                
                <button 
                  onClick={() => setActiveTab('contacts')}
                  className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-left"
                >
                  <Users className="w-6 h-6 text-safe-600 mb-2" />
                  <div className="font-medium text-gray-900">Emergency Contacts</div>
                  <div className="text-sm text-gray-600">Manage your emergency contacts</div>
                </button>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-3">Safety Tip of the Day</h3>
              <p className="text-blue-800">
                Always let someone know your planned route and expected arrival time when traveling alone, especially at night.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto">
        {/* Status Bar Simulation */}
        <div className="bg-white px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-safe-500 rounded-full"></div>
            <span className="text-gray-600">Safe</span>
          </div>
          <div className="text-gray-500">12:34 PM</div>
          <div className="flex items-center space-x-1">
            <div className="text-gray-600">📶</div>
            <div className="text-gray-600">🔋</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-6">
          {renderTabContent()}
        </div>

        {/* Navigation */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;
