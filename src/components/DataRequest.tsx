
import React, { useState, useEffect } from 'react';
import { Send, AlertCircle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';

const DataRequest = () => {
  const [dataRequest, setDataRequest] = useState({
    title: '',
    description: '',
    targetUserId: '',
    requestType: 'user_data_access',
    requestData: {}
  });
  
  const [userList, setUserList] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile } = useProfile(user);
  
  const userRole = profile?.role || 'user';

  useEffect(() => {
    if (userRole === 'govt_admin') {
      fetchUsers();
      fetchMyRequests();
    }
  }, [userRole]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone_number')
        .eq('role', 'user')
        .order('full_name');

      if (error) throw error;
      setUserList(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('government_requests')
        .select('*')
        .eq('government_admin_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('government_requests')
        .insert({
          government_admin_id: user.id,
          request_type: dataRequest.requestType,
          title: dataRequest.title,
          description: dataRequest.description,
          target_user_id: dataRequest.targetUserId,
          request_data: dataRequest.requestData
        });

      if (error) throw error;
      
      toast({
        title: "Data Request Submitted",
        description: "Your request has been sent to the Administrator for processing.",
      });
      
      setDataRequest({
        title: '',
        description: '',
        targetUserId: '',
        requestType: 'user_data_access',
        requestData: {}
      });

      fetchMyRequests();
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Error",
        description: "Failed to submit request.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (userRole !== 'govt_admin') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Access Restricted</h3>
        <p className="text-gray-600">Only government officials can access data request features.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Request User Data</h2>
        <p className="text-gray-600 mb-6">
          Submit official requests to Administrators for user data required for investigations.
        </p>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-indigo-900 mb-4">Submit Data Access Request</h3>
          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Request Title</label>
              <input
                type="text"
                value={dataRequest.title}
                onChange={(e) => setDataRequest({...dataRequest, title: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Investigation Case #2025-001"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target User</label>
              <select
                value={dataRequest.targetUserId}
                onChange={(e) => setDataRequest({...dataRequest, targetUserId: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select a user...</option>
                {userList.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.full_name || 'Unnamed User'} - {user.phone_number || 'No phone'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Type Requested</label>
              <select
                value={dataRequest.requestType}
                onChange={(e) => setDataRequest({...dataRequest, requestType: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="user_data_access">Complete User Data Access</option>
                <option value="investigation_data">Investigation-Specific Data</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Investigation Details</label>
              <textarea
                value={dataRequest.description}
                onChange={(e) => setDataRequest({...dataRequest, description: e.target.value})}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Provide detailed explanation of why this data is needed for the investigation..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting...' : 'Submit Data Request'}</span>
            </button>
          </form>
        </div>

        {/* My Requests */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Requests ({myRequests.length})</h3>
          {myRequests.length > 0 ? (
            <div className="space-y-3">
              {myRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{request.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Submitted: {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'fulfilled' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">No requests submitted yet.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <h4 className="font-medium text-red-900">Legal Compliance Notice</h4>
        </div>
        <p className="text-red-800 text-sm">
          All data requests must be supported by valid legal authorization. 
          Requests without proper legal basis will be rejected. All requests are logged and audited for compliance.
        </p>
      </div>
    </div>
  );
};

export default DataRequest;
