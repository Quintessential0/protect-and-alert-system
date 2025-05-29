
import React, { useState } from 'react';
import { Shield, Send, AlertCircle, MapPin, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const AdminRequests = () => {
  const [activeTab, setActiveTab] = useState<'zone-request' | 'data-access'>('zone-request');
  const [zoneRequest, setZoneRequest] = useState({
    location: '',
    reason: '',
    zoneType: 'safe',
    urgency: 'medium',
    center_lat: '',
    center_lng: '',
    radius_meters: '500'
  });
  
  const [dataAccessRequest, setDataAccessRequest] = useState({
    title: '',
    description: '',
    urgency: 'medium',
    dataType: 'user_locations',
    timeframe: '30_days'
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

  const handleDataAccessRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Data Access Request:', {
      ...dataAccessRequest,
      requestedBy: user?.id,
      requestedAt: new Date().toISOString()
    });
    
    toast({
      title: "Data Access Request Submitted",
      description: "Your request has been sent to Government Officials for review.",
    });
    
    setDataAccessRequest({
      title: '',
      description: '',
      urgency: 'medium',
      dataType: 'user_locations',
      timeframe: '30_days'
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Requests</h2>
        <p className="text-gray-600 mb-6">
          Submit requests to Government Officials for zone modifications and data access.
        </p>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('zone-request')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'zone-request'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Zone Requests</span>
          </button>
          
          <button
            onClick={() => setActiveTab('data-access')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'data-access'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Data Access</span>
          </button>
        </div>

        {/* Zone Request Tab */}
        {activeTab === 'zone-request' && (
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
        )}

        {/* Data Access Request Tab */}
        {activeTab === 'data-access' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Request Data Access</h3>
            <form onSubmit={handleDataAccessRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Request Title</label>
                <input
                  type="text"
                  value={dataAccessRequest.title}
                  onChange={(e) => setDataAccessRequest({...dataAccessRequest, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Safety Analysis for Downtown Area"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Type</label>
                  <select
                    value={dataAccessRequest.dataType}
                    onChange={(e) => setDataAccessRequest({...dataAccessRequest, dataType: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="user_locations">User Location Data</option>
                    <option value="incident_reports">Incident Reports</option>
                    <option value="emergency_incidents">Emergency Incidents</option>
                    <option value="recordings">Audio/Video Recordings</option>
                    <option value="aggregated_stats">Aggregated Statistics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
                  <select
                    value={dataAccessRequest.timeframe}
                    onChange={(e) => setDataAccessRequest({...dataAccessRequest, timeframe: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="7_days">Last 7 days</option>
                    <option value="30_days">Last 30 days</option>
                    <option value="90_days">Last 90 days</option>
                    <option value="6_months">Last 6 months</option>
                    <option value="1_year">Last year</option>
                    <option value="all_time">All time</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urgency Level</label>
                <select
                  value={dataAccessRequest.urgency}
                  onChange={(e) => setDataAccessRequest({...dataAccessRequest, urgency: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="low">Low - Research/Analysis</option>
                  <option value="medium">Medium - Operational Need</option>
                  <option value="high">High - Safety Critical</option>
                  <option value="urgent">Urgent - Emergency Response</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose & Justification</label>
                <textarea
                  value={dataAccessRequest.description}
                  onChange={(e) => setDataAccessRequest({...dataAccessRequest, description: e.target.value})}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Explain why you need access to this data, how it will be used, and what safety benefits it will provide..."
                  required
                />
              </div>

              <button
                type="submit"
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                <Send className="w-4 h-4" />
                <span>Submit Data Access Request</span>
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <h4 className="font-medium text-red-900">Important Notice</h4>
        </div>
        <p className="text-red-800 text-sm">
          All requests are logged and require Government Official authorization. 
          Requests will be reviewed based on community safety needs, data privacy requirements, and available resources.
        </p>
      </div>
    </div>
  );
};

export default AdminRequests;
