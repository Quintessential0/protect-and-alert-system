
import React, { useState, useEffect } from 'react';
import { Shield, Database, CheckCircle, XCircle, Eye, FileText, MapPin, Clock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';

interface DataAccessRequest {
  id: string;
  title: string;
  description: string;
  requested_by: string;
  requested_at: string;
  urgency: string;
  status: string;
  admin_name?: string;
}

interface ZoneRequest {
  id: string;
  location: string;
  reason: string;
  zone_type: string;
  urgency: string;
  center_lat: string;
  center_lng: string;
  radius_meters: string;
  requested_by: string;
  requested_at: string;
  status: string;
  admin_name?: string;
}

const GovernmentRequests = () => {
  const [activeTab, setActiveTab] = useState<'data-access' | 'zone-requests'>('data-access');
  const [dataRequests, setDataRequests] = useState<DataAccessRequest[]>([]);
  const [zoneRequests, setZoneRequests] = useState<ZoneRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile } = useProfile(user);
  
  const userRole = profile?.role || 'user';

  // Mock data for demonstration - in real app, this would come from database
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setDataRequests([
        {
          id: '1',
          title: 'User Safety Data Analysis',
          description: 'Request access to anonymized user location data for safety pattern analysis in downtown area. Need data from past 3 months to identify high-risk zones.',
          requested_by: 'admin-001',
          requested_at: new Date(Date.now() - 86400000).toISOString(),
          urgency: 'medium',
          status: 'pending',
          admin_name: 'Safety Admin Johnson'
        },
        {
          id: '2',
          title: 'Emergency Response Optimization',
          description: 'Access to emergency incident data and response times to optimize emergency service deployment. Critical for improving response efficiency.',
          requested_by: 'admin-002',
          requested_at: new Date(Date.now() - 172800000).toISOString(),
          urgency: 'high',
          status: 'pending',
          admin_name: 'Admin Sarah Chen'
        }
      ]);

      setZoneRequests([
        {
          id: '1',
          location: 'Central Park East Entrance',
          reason: 'Multiple safety incidents reported in the past month. Users have reported feeling unsafe during evening hours. Recommend creating a monitored safe zone.',
          zone_type: 'safe',
          urgency: 'high',
          center_lat: '40.7829',
          center_lng: '-73.9654',
          radius_meters: '300',
          requested_by: 'admin-001',
          requested_at: new Date(Date.now() - 3600000).toISOString(),
          status: 'pending',
          admin_name: 'Safety Admin Johnson'
        },
        {
          id: '2',
          location: 'Industrial District - Warehouse Area',
          reason: 'Recent increase in criminal activity reported. Multiple users have submitted incident reports. Area should be marked as unsafe to warn users.',
          zone_type: 'unsafe',
          urgency: 'urgent',
          center_lat: '40.7589',
          center_lng: '-73.9851',
          radius_meters: '500',
          requested_by: 'admin-003',
          requested_at: new Date(Date.now() - 7200000).toISOString(),
          status: 'pending',
          admin_name: 'Admin Mike Torres'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDataRequestAction = (requestId: string, action: 'approve' | 'deny') => {
    setDataRequests(requests => 
      requests.map(req => 
        req.id === requestId 
          ? { ...req, status: action === 'approve' ? 'approved' : 'denied' }
          : req
      )
    );

    toast({
      title: `Request ${action === 'approve' ? 'Approved' : 'Denied'}`,
      description: `Data access request has been ${action === 'approve' ? 'approved' : 'denied'}.`,
    });
  };

  const handleZoneRequestAction = async (requestId: string, action: 'approve' | 'deny') => {
    if (action === 'approve') {
      const request = zoneRequests.find(req => req.id === requestId);
      if (request) {
        try {
          // Create the actual safe zone
          const { error } = await supabase
            .from('safe_zones')
            .insert({
              name: request.location,
              description: request.reason,
              center_lat: parseFloat(request.center_lat),
              center_lng: parseFloat(request.center_lng),
              radius_meters: parseInt(request.radius_meters),
              zone_type: request.zone_type,
              created_by: user?.id,
              is_active: true
            });

          if (error) throw error;

          toast({
            title: "Zone Created",
            description: `${request.zone_type === 'safe' ? 'Safe' : 'Unsafe'} zone "${request.location}" has been created.`,
          });
        } catch (error) {
          console.error('Error creating zone:', error);
          toast({
            title: "Error",
            description: "Failed to create zone. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }
    }

    setZoneRequests(requests => 
      requests.map(req => 
        req.id === requestId 
          ? { ...req, status: action === 'approve' ? 'approved' : 'denied' }
          : req
      )
    );

    toast({
      title: `Zone Request ${action === 'approve' ? 'Approved' : 'Denied'}`,
      description: `Zone modification request has been ${action === 'approve' ? 'approved and zone created' : 'denied'}.`,
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (userRole !== 'govt_admin') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Access Restricted</h3>
        <p className="text-gray-600">Only Government Officials can access this feature.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Government Admin Dashboard</h2>
        <p className="text-gray-600 mb-6">
          Review and approve requests from administrators for data access and zone modifications.
        </p>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('data-access')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'data-access'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Data Access Requests</span>
          </button>
          
          <button
            onClick={() => setActiveTab('zone-requests')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'zone-requests'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Zone Requests</span>
          </button>
        </div>

        {/* Data Access Requests Tab */}
        {activeTab === 'data-access' && (
          <div className="space-y-4">
            {dataRequests.length === 0 ? (
              <div className="text-center py-8">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Access Requests</h3>
                <p className="text-gray-600">No pending data access requests from administrators.</p>
              </div>
            ) : (
              dataRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{request.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{request.admin_name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(request.requested_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                        request.status === 'pending' ? 'bg-gray-100 text-gray-700' :
                        request.status === 'approved' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{request.description}</p>
                  
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDataRequestAction(request.id, 'approve')}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleDataRequestAction(request.id, 'deny')}
                        className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Deny</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Zone Requests Tab */}
        {activeTab === 'zone-requests' && (
          <div className="space-y-4">
            {zoneRequests.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Zone Requests</h3>
                <p className="text-gray-600">No pending zone modification requests from administrators.</p>
              </div>
            ) : (
              zoneRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{request.location}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{request.admin_name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(request.requested_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                        request.zone_type === 'safe' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {request.zone_type} zone
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                        request.status === 'pending' ? 'bg-gray-100 text-gray-700' :
                        request.status === 'approved' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Coordinates:</span>
                      <p className="text-gray-600">{request.center_lat}, {request.center_lng}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Radius:</span>
                      <p className="text-gray-600">{request.radius_meters} meters</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Type:</span>
                      <p className="text-gray-600 capitalize">{request.zone_type} Zone</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="font-medium text-gray-700">Justification:</span>
                    <p className="text-gray-600 mt-1">{request.reason}</p>
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleZoneRequestAction(request.id, 'approve')}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve & Create Zone</span>
                      </button>
                      <button
                        onClick={() => handleZoneRequestAction(request.id, 'deny')}
                        className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Deny</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GovernmentRequests;
