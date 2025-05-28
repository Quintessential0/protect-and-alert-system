
import React, { useState } from 'react';
import { Shield, Send, AlertCircle, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const AdminRequests = () => {
  const [zoneRequest, setZoneRequest] = useState({
    location: '',
    reason: '',
    zoneType: 'safe',
    urgency: 'medium',
    center_lat: '',
    center_lng: '',
    radius_meters: '500'
  });
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile } = useProfile(user);
  
  const userRole = profile?.role || 'user';

  const handleZoneRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Zone Request:', {
      ...zoneRequest,
      requestedBy: user?.id,
      requestedAt: new Date().toISOString()
    });
    
    toast({
      title: "Zone Request Submitted",
      description: "Your request has been sent to Government Officials for review.",
    });
    
    setZoneRequest({
      location: '',
      reason: '',
      zoneType: 'safe',
      urgency: 'medium',
      center_lat: '',
      center_lng: '',
      radius_meters: '500'
    });
  };

  if (userRole !== 'admin') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Access Restricted</h3>
        <p className="text-gray-600">Only administrators can access request features.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Zone Modification Requests</h2>
        <p className="text-gray-600 mb-6">
          Submit requests for zone modifications to Government Officials for review.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Request Zone Creation/Modification</h3>
          <form onSubmit={handleZoneRequest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location/Area Name</label>
              <input
                type="text"
                value={zoneRequest.location}
                onChange={(e) => setZoneRequest({...zoneRequest, location: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Main Street Park, Downtown District"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={zoneRequest.center_lat}
                  onChange={(e) => setZoneRequest({...zoneRequest, center_lat: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 40.7128"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={zoneRequest.center_lng}
                  onChange={(e) => setZoneRequest({...zoneRequest, center_lng: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., -74.0060"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Radius (meters)</label>
                <input
                  type="number"
                  value={zoneRequest.radius_meters}
                  onChange={(e) => setZoneRequest({...zoneRequest, radius_meters: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="100"
                  placeholder="500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zone Type</label>
              <select
                value={zoneRequest.zoneType}
                onChange={(e) => setZoneRequest({...zoneRequest, zoneType: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="safe">Safe Zone</option>
                <option value="unsafe">Unsafe Zone</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urgency Level</label>
              <select
                value={zoneRequest.urgency}
                onChange={(e) => setZoneRequest({...zoneRequest, urgency: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low - Routine Update</option>
                <option value="medium">Medium - Important Change</option>
                <option value="high">High - Safety Concern</option>
                <option value="urgent">Urgent - Immediate Action Needed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason/Justification</label>
              <textarea
                value={zoneRequest.reason}
                onChange={(e) => setZoneRequest({...zoneRequest, reason: e.target.value})}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Provide detailed reasoning for this zone request..."
                required
              />
            </div>

            <button
              type="submit"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              <Send className="w-4 h-4" />
              <span>Submit Zone Request</span>
            </button>
          </form>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <h4 className="font-medium text-red-900">Important Notice</h4>
        </div>
        <p className="text-red-800 text-sm">
          All zone modification requests are logged and require Government Official authorization. 
          Requests will be reviewed based on community safety needs and available resources.
        </p>
      </div>
    </div>
  );
};

export default AdminRequests;
