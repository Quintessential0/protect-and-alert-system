
import React, { useState, useEffect } from 'react';
import { User, Phone, FileText, Activity, Eye, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const UserInfo = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [userList, setUserList] = useState([]);
  const [userContacts, setUserContacts] = useState([]);
  const [userRecordings, setUserRecordings] = useState([]);
  const [userIncidents, setUserIncidents] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile } = useProfile(user);

  const userRole = profile?.role || 'user';

  useEffect(() => {
    if (userRole === 'admin') {
      fetchUsers();
    }
  }, [userRole]);

  useEffect(() => {
    if (selectedUser) {
      fetchUserData();
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone_number, role')
        .eq('role', 'user')
        .order('full_name');

      if (error) throw error;
      setUserList(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive",
      });
    }
  };

  const fetchUserData = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      // Fetch emergency contacts
      const { data: contacts, error: contactsError } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', selectedUser)
        .order('priority');

      if (contactsError) throw contactsError;
      setUserContacts(contacts || []);

      // Fetch recordings
      const { data: recordings, error: recordingsError } = await supabase
        .from('recordings')
        .select('*')
        .eq('user_id', selectedUser)
        .order('recorded_at', { ascending: false });

      if (recordingsError) throw recordingsError;
      setUserRecordings(recordings || []);

      // Fetch incidents
      const { data: incidents, error: incidentsError } = await supabase
        .from('emergency_incidents')
        .select('*')
        .eq('user_id', selectedUser)
        .order('triggered_at', { ascending: false });

      if (incidentsError) throw incidentsError;
      setUserIncidents(incidents || []);

      // Fetch activity logs
      const { data: logs, error: logsError } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', selectedUser)
        .order('created_at', { ascending: false })
        .limit(50);

      if (logsError) throw logsError;
      setActivityLogs(logs || []);

    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load user data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (action: string, description: string) => {
    try {
      await supabase
        .from('activity_logs')
        .insert({
          user_id: user?.id,
          action_type: action,
          description: description,
          metadata: { target_user: selectedUser }
        });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const handleDataAccess = async (dataType: string) => {
    await logActivity('data_access', `Accessed ${dataType} for user ${selectedUser}`);
    
    toast({
      title: "Data Accessed",
      description: `${dataType} data has been logged for compliance.`,
    });
  };

  if (userRole !== 'admin') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Access Restricted</h3>
        <p className="text-gray-600">Only administrators can access user information.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">User Information Management</h2>
        
        {/* User Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select User to View
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a user...</option>
            {userList.map((user) => (
              <option key={user.id} value={user.id}>
                {user.full_name || 'Unnamed User'} - {user.phone_number || 'No phone'}
              </option>
            ))}
          </select>
        </div>

        {selectedUser && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Emergency Contacts */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-900 flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>Emergency Contacts ({userContacts.length})</span>
                </h3>
                <button
                  onClick={() => handleDataAccess('Emergency Contacts')}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>Log Access</span>
                </button>
              </div>
              
              {userContacts.length > 0 ? (
                <div className="space-y-2">
                  {userContacts.map((contact) => (
                    <div key={contact.id} className="bg-white rounded p-3 border border-blue-200">
                      <p className="font-medium text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.phone}</p>
                      <p className="text-xs text-blue-600">{contact.relationship} • Priority {contact.priority}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-blue-700 text-sm">No emergency contacts found.</p>
              )}
            </div>

            {/* Recordings */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-green-900 flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Recordings ({userRecordings.length})</span>
                </h3>
                <button
                  onClick={() => handleDataAccess('Audio/Video Recordings')}
                  className="flex items-center space-x-1 text-green-600 hover:text-green-800 text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>Log Access</span>
                </button>
              </div>
              
              {userRecordings.length > 0 ? (
                <div className="space-y-2">
                  {userRecordings.slice(0, 5).map((recording) => (
                    <div key={recording.id} className="bg-white rounded p-3 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{recording.file_type}</p>
                          <p className="text-xs text-gray-600">
                            {new Date(recording.recorded_at).toLocaleString()}
                          </p>
                        </div>
                        <Download className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-green-700 text-sm">No recordings found.</p>
              )}
            </div>

            {/* Emergency Incidents */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-red-900 flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Emergency Incidents ({userIncidents.length})</span>
                </h3>
                <button
                  onClick={() => handleDataAccess('Emergency Incidents')}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>Log Access</span>
                </button>
              </div>
              
              {userIncidents.length > 0 ? (
                <div className="space-y-2">
                  {userIncidents.slice(0, 5).map((incident) => (
                    <div key={incident.id} className="bg-white rounded p-3 border border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 capitalize">{incident.status}</p>
                          <p className="text-xs text-gray-600">
                            {new Date(incident.triggered_at).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          incident.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {incident.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-red-700 text-sm">No emergency incidents found.</p>
              )}
            </div>

            {/* Activity Logs */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-4">
                <Activity className="w-5 h-5" />
                <span>Recent Activity ({activityLogs.length})</span>
              </h3>
              
              {activityLogs.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="bg-white rounded p-3 border border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{log.action_type}</p>
                      <p className="text-xs text-gray-600">{log.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700 text-sm">No activity logs found.</p>
              )}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading user data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
