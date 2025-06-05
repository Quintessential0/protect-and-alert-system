
import React, { useState } from 'react';
import { ClipboardList, Send, AlertCircle, FileText, Users, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const ReviewRequests = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile } = useProfile(user);
  
  const userRole = profile?.role || 'user';

  // Mock data for government official requests
  const [pendingRequests] = useState([
    {
      id: '1',
      requestType: 'user_media',
      requestedBy: 'govt.official@gov.org',
      caseId: 'CASE-2025-001',
      userId: 'user123',
      userName: 'John Doe',
      description: 'Request audio/video recordings for incident investigation on 2025-06-01',
      urgency: 'high',
      requestedAt: '2025-06-02T10:30:00Z',
      status: 'pending'
    },
    {
      id: '2',
      requestType: 'emergency_contacts',
      requestedBy: 'investigator@gov.org',
      caseId: 'CASE-2025-002',
      userId: 'user456',
      userName: 'Jane Smith',
      description: 'Need emergency contact information for welfare check investigation',
      urgency: 'medium',
      requestedAt: '2025-06-02T09:15:00Z',
      status: 'pending'
    }
  ]);

  const handleProvideData = async (requestId: string, dataType: string) => {
    try {
      // In a real app, this would compile and send the requested user data
      console.log(`Providing ${dataType} data for request ${requestId}`);
      
      toast({
        title: "Data Provided",
        description: "User data has been securely transmitted to the government official.",
      });

    } catch (error) {
      console.error('Error providing data:', error);
      toast({
        title: "Error",
        description: "Failed to provide data. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (userRole !== 'admin') {
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Review Data Access Requests</h2>
        <p className="text-gray-600 mb-6">
          Review and respond to data access requests from Government Officials for investigative purposes.
        </p>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'pending'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Pending Requests ({pendingRequests.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'completed'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Completed (0)</span>
          </button>
        </div>

        {/* Pending Requests */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {request.requestType === 'user_media' ? (
                      <FileText className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Users className="w-6 h-6 text-green-600" />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Case: {request.caseId}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Requested by {request.requestedBy} • {new Date(request.requestedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.urgency === 'high' ? 'bg-red-100 text-red-700' :
                      request.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {request.urgency} priority
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Target User</label>
                    <p className="text-gray-900">{request.userName} (ID: {request.userId})</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Data Type Requested</label>
                    <p className="text-gray-900 capitalize">{request.requestType.replace('_', ' ')}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700">Investigation Details</label>
                  <p className="text-gray-900 mt-1">{request.description}</p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleProvideData(request.id, request.requestType)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    <Send className="w-4 h-4" />
                    <span>Provide Requested Data</span>
                  </button>
                  
                  <button
                    className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Request More Details</span>
                  </button>
                </div>
              </div>
            ))}

            {pendingRequests.length === 0 && (
              <div className="text-center py-8">
                <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Requests</h3>
                <p className="text-gray-600">All data access requests have been processed.</p>
              </div>
            )}
          </div>
        )}

        {/* Completed Requests */}
        {activeTab === 'completed' && (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Completed Requests</h3>
            <p className="text-gray-600">Completed requests will appear here.</p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-blue-900">Data Privacy Notice</h4>
        </div>
        <p className="text-blue-800 text-sm">
          All user data transfers are logged and encrypted. Only provide data for legitimate government investigations 
          with proper case identification. Unauthorized data access is strictly prohibited.
        </p>
      </div>
    </div>
  );
};

export default ReviewRequests;
