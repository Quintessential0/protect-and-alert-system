
import React, { useState, useEffect } from 'react';
import { ClipboardList, Send, AlertCircle, FileText, Users, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';

const ReviewRequests = () => {
  const [activeTab, setActiveTab] = useState<'admin_requests' | 'data_requests'>('admin_requests');
  const [adminRequests, setAdminRequests] = useState([]);
  const [dataRequests, setDataRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile } = useProfile(user);
  
  const userRole = profile?.role || 'user';

  useEffect(() => {
    if (userRole === 'govt_admin') {
      fetchAdminRequests();
    } else if (userRole === 'admin') {
      fetchDataRequests();
    }
  }, [userRole]);

  const fetchAdminRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_requests')
        .select(`
          *,
          profiles!admin_requests_admin_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdminRequests(data || []);
    } catch (error) {
      console.error('Error fetching admin requests:', error);
      toast({
        title: "Error",
        description: "Failed to load admin requests.",
        variant: "destructive",
      });
    }
  };

  const fetchDataRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('government_requests')
        .select(`
          *,
          profiles!government_requests_government_admin_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDataRequests(data || []);
    } catch (error) {
      console.error('Error fetching data requests:', error);
      toast({
        title: "Error",
        description: "Failed to load data requests.",
        variant: "destructive",
      });
    }
  };

  const handleAdminRequestReview = async (requestId: string, action: 'approved' | 'rejected') => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('admin_requests')
        .update({
          status: action,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: `Request ${action}`,
        description: `The admin request has been ${action}.`,
      });

      fetchAdminRequests();
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: "Error",
        description: "Failed to update request.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDataRequestFulfill = async (requestId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('government_requests')
        .update({
          status: 'fulfilled',
          handled_by: user?.id,
          handled_at: new Date().toISOString(),
          response_data: { message: 'Data has been compiled and transmitted securely.' }
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Data Request Fulfilled",
        description: "User data has been securely transmitted to the government official.",
      });

      fetchDataRequests();
    } catch (error) {
      console.error('Error fulfilling request:', error);
      toast({
        title: "Error",
        description: "Failed to fulfill request.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (userRole !== 'admin' && userRole !== 'govt_admin') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Access Restricted</h3>
        <p className="text-gray-600">Only administrators can access request reviews.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {userRole === 'govt_admin' ? 'Review Admin Requests' : 'Review Data Access Requests'}
        </h2>

        {/* Tab Navigation for Government Admins */}
        {userRole === 'govt_admin' && (
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('admin_requests')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'admin_requests'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Admin Requests ({adminRequests.length})</span>
            </button>
          </div>
        )}

        {/* Admin Requests (for Government Admins) */}
        {(userRole === 'govt_admin' && activeTab === 'admin_requests') && (
          <div className="space-y-4">
            {adminRequests.length > 0 ? (
              adminRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                      <p className="text-sm text-gray-600">
                        Submitted by: {request.profiles?.full_name || 'Unknown Admin'}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        Type: {request.request_type.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{request.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Submitted: {new Date(request.created_at).toLocaleDateString()}
                    </span>
                    
                    {request.status === 'pending' && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleAdminRequestReview(request.id, 'approved')}
                          disabled={loading}
                          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        
                        <button
                          onClick={() => handleAdminRequestReview(request.id, 'rejected')}
                          disabled={loading}
                          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Admin Requests</h3>
                <p className="text-gray-600">No requests from administrators at this time.</p>
              </div>
            )}
          </div>
        )}

        {/* Data Requests (for Admins) */}
        {userRole === 'admin' && (
          <div className="space-y-4">
            {dataRequests.length > 0 ? (
              dataRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                      <p className="text-sm text-gray-600">
                        Requested by: {request.profiles?.full_name || 'Government Official'}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        Type: {request.request_type.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'fulfilled' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{request.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Requested: {new Date(request.created_at).toLocaleDateString()}
                    </span>
                    
                    {request.status === 'pending' && (
                      <button
                        onClick={() => handleDataRequestFulfill(request.id)}
                        disabled={loading}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        <span>Provide Data</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Requests</h3>
                <p className="text-gray-600">No data access requests from government officials.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-blue-900">Compliance Notice</h4>
        </div>
        <p className="text-blue-800 text-sm">
          All request reviews and data transfers are logged for compliance and audit purposes. 
          Ensure proper verification before approving requests or providing sensitive data.
        </p>
      </div>
    </div>
  );
};

export default ReviewRequests;
