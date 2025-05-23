
import React, { useState, useEffect } from 'react';
import { MapPin, Share2, Users, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LocationSharing = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setAccuracy(position.coords.accuracy);
      },
      (error) => {
        toast({
          title: "Location Error",
          description: "Unable to get your current location. Please enable location services.",
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const startSharing = () => {
    setIsSharing(true);
    toast({
      title: "Location Sharing Started",
      description: "Your location is now being shared with your emergency contacts.",
    });
  };

  const stopSharing = () => {
    setIsSharing(false);
    toast({
      title: "Location Sharing Stopped",
      description: "Your location is no longer being shared.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <MapPin className="w-6 h-6 text-emergency-600" />
          <h2 className="text-xl font-bold text-gray-900">Location Sharing</h2>
        </div>

        {location ? (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Current Location:</div>
              <div className="font-mono text-sm">
                <div>Lat: {location.lat.toFixed(6)}</div>
                <div>Lng: {location.lng.toFixed(6)}</div>
                {accuracy && (
                  <div className="text-xs text-gray-500 mt-1">
                    Accuracy: ±{Math.round(accuracy)}m
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              {!isSharing ? (
                <button
                  onClick={startSharing}
                  className="flex-1 bg-safe-600 hover:bg-safe-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Start Sharing</span>
                </button>
              ) : (
                <button
                  onClick={stopSharing}
                  className="flex-1 bg-emergency-600 hover:bg-emergency-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200"
                >
                  <Shield className="w-5 h-5" />
                  <span>Stop Sharing</span>
                </button>
              )}
              
              <button
                onClick={getCurrentLocation}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200"
              >
                <MapPin className="w-5 h-5" />
              </button>
            </div>

            {isSharing && (
              <div className="bg-safe-50 border border-safe-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-safe-500 rounded-full animate-pulse"></div>
                  <span className="text-safe-800 font-medium">Location sharing active</span>
                </div>
                <p className="text-safe-600 text-sm mt-2">
                  Your emergency contacts can see your real-time location.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Getting your location...</p>
            <button
              onClick={getCurrentLocation}
              className="mt-4 bg-emergency-600 hover:bg-emergency-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
            >
              Enable Location
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Users className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Sharing With</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">Emergency Contacts</div>
              <div className="text-sm text-gray-600">3 contacts</div>
            </div>
            <div className={`w-3 h-3 rounded-full ${isSharing ? 'bg-safe-500' : 'bg-gray-300'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSharing;
