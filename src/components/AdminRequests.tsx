
import React, { useState } from 'react';
import { Shield, Users, FileText, Send, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const AdminRequests = () => {
  const [activeTab, setActiveTab] = useState('zone-request');
  const [zoneRequest, setZoneRequest] = useState({
    location: '',
    reason: '',
    zoneType: 'safe',
    urgency: 'medium'
  });
  const [accessRequest, setAccessRequest] = useState({
    userId: '',
    reason: '',
    dataType: 'recordings'
  });
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile } = useProfile(user);
  
  const userRole = profile?.role || 'user';

  const handleZoneRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log the request (in a real app, this would send to govt admins)
    console.log('Zone Request:', {
      ...zoneRequest,
      requestedBy: user?.id,
      requestedAt: new Date().toISOString()
    });
    
    toast({
      title: "Zone Request Submitted",
      description: "Your request has been sent to government administrators for review.",
    });
    
    setZoneRequest({
      location: '',
      reason: '',
      zoneType: 'safe',
      urgency: 'medium'
    });
  };

  const handleAccessRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log the access request (in a real app, this would create a formal request)
    console.log('Access Request:', {
      ...accessRequest,
      requestedBy: user?.id,
      requestedAt: new Date().toISOString()
    });
    
    toast({
      title: "Access Request Submitted",
      description: "Your request for user data access has been logged for review.",
    });
    
    setAccessRequest({
      userId: '',
      reason: '',
      dataType: 'recordings'
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Administrative Requests</h2>
        <p className="text-gray-600 mb-6">
          Submit requests for zone modifications or user data access verification.
        </p>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('zone-request')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'zone-request'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Zone Request</span>
          </button>
          <button
            onClick={() => setActiveTab('access-request')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'access-request'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Data Access</span>
          </button>
        </div>

        {activeTab === 'zone-request' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Request Zone Creation/Modification</h3>
            <form onSubmit={handleZoneRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location/Area</label>
                <input
                  type="text"
                  value={zoneRequest.location}
                  onChange={(e) => setZoneRequest({...zoneRequest, location: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Main Street Park, Downtown District"
                  required
                />
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

        {activeTab === 'access-request' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4">Request User Data Access</h3>
            <form onSubmit={handleAccessRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID/Email</label>
                <input
                  type="text"
                  value={accessRequest.userId}
                  onChange={(e) => setAccessRequest({...accessRequest, userId: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Enter user ID or email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Type Requested</label>
                <select
                  value={accessRequest.dataType}
                  onChange={(e) => setAccessRequest({...accessRequest, dataType: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="recordings">Audio/Video Recordings</option>
                  <option value="contacts">Emergency Contacts</option>
                  <option value="both">Both Recordings and Contacts</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Reason</label>
                <textarea
                  value={accessRequest.reason}
                  onChange={(e) => setAccessRequest({...accessRequest, reason: e.target.value})}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Provide legal/administrative justification for data access..."
                  required
                />
              </div>

              <button
                type="submit"
                className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                <FileText className="w-4 h-4" />
                <span>Submit Access Request</span>
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
          All requests are logged and require proper authorization. Unauthorized access attempts 
          will be reported to system administrators and may result in account suspension.
        </p>
      </div>
    </div>
  );
};

export default AdminRequests;
