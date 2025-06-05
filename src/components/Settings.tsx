
import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Bell, Shield, Volume2, Eye, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile(user);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    location_permissions_granted: false,
    sos_gesture_enabled: true,
    voice_monitoring_enabled: false,
    emergency_notifications: true,
    privacy_mode: false,
    auto_record_sos: true,
    emergency_contacts_visible: true
  });
  const { toast } = useToast();

  const userRole = profile?.role || 'user';

  useEffect(() => {
    if (profile) {
      setSettings({
        location_permissions_granted: profile.location_permissions_granted || false,
        sos_gesture_enabled: profile.sos_gesture_enabled || false,
        voice_monitoring_enabled: profile.voice_monitoring_enabled || false,
        emergency_notifications: true,
        privacy_mode: false,
        auto_record_sos: true,
        emergency_contacts_visible: true
      });
    }
  }, [profile]);

  const logActivity = async (action: string, description: string) => {
    try {
      await supabase
        .from('activity_logs')
        .insert({
          user_id: user?.id,
          action_type: action,
          description: description
        });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const handleSettingChange = async (setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));

    // Handle special cases
    if (setting === 'location_permissions_granted' && value) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => {
            toast({
              title: "Location Access Granted",
              description: "Location services are now enabled for emergency features.",
            });
          },
          () => {
            setSettings(prev => ({
              ...prev,
              location_permissions_granted: false
            }));
            toast({
              title: "Location Access Denied",
              description: "Please enable location services in your browser settings.",
              variant: "destructive",
            });
          }
        );
      }
    }

    if (setting === 'voice_monitoring_enabled' && userRole === 'user') {
      if (value) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop());
          toast({
            title: "Voice Monitoring Enabled",
            description: "Voice monitoring will activate during emergencies.",
          });
        } catch (error) {
          setSettings(prev => ({
            ...prev,
            voice_monitoring_enabled: false
          }));
          toast({
            title: "Microphone Access Denied",
            description: "Please enable microphone access for voice monitoring.",
            variant: "destructive",
          });
          return;
        }
      }
    }

    await logActivity('settings_change', `Changed ${setting} to ${value}`);
  };

  const saveSettings = async () => {
    if (!profile || !updateProfile) return;

    setLoading(true);
    try {
      const success = await updateProfile({
        location_permissions_granted: settings.location_permissions_granted,
        sos_gesture_enabled: settings.sos_gesture_enabled,
        voice_monitoring_enabled: settings.voice_monitoring_enabled
      });

      if (success) {
        await logActivity('settings_save', 'User settings updated successfully');
        toast({
          title: "Settings Saved",
          description: "Your preferences have been updated successfully.",
        });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSettingsForRole = () => {
    const commonSettings = [
      {
        id: 'emergency_notifications',
        title: 'Emergency Notifications',
        description: 'Receive notifications about emergency alerts and updates',
        icon: Bell,
        value: settings.emergency_notifications
      },
      {
        id: 'privacy_mode',
        title: 'Privacy Mode',
        description: 'Enhanced privacy settings for sensitive information',
        icon: Eye,
        value: settings.privacy_mode
      }
    ];

    if (userRole === 'user') {
      return [
        {
          id: 'location_permissions_granted',
          title: 'Location Services',
          description: 'Allow app to access your location for emergency features',
          icon: Shield,
          value: settings.location_permissions_granted
        },
        {
          id: 'sos_gesture_enabled',
          title: 'SOS Gesture',
          description: 'Enable gesture-based emergency activation',
          icon: Phone,
          value: settings.sos_gesture_enabled
        },
        {
          id: 'voice_monitoring_enabled',
          title: 'Voice Monitoring',
          description: 'Monitor for distress sounds during emergencies',
          icon: Volume2,
          value: settings.voice_monitoring_enabled
        },
        {
          id: 'auto_record_sos',
          title: 'Auto-Record on SOS',
          description: 'Automatically start recording when SOS is triggered',
          icon: Shield,
          value: settings.auto_record_sos
        },
        ...commonSettings
      ];
    } else {
      return [
        ...commonSettings,
        {
          id: 'emergency_contacts_visible',
          title: 'Emergency Contacts Access',
          description: 'Allow access to user emergency contact information',
          icon: Phone,
          value: settings.emergency_contacts_visible
        }
      ];
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <SettingsIcon className="w-6 h-6 text-gray-600" />
        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
      </div>

      <div className="space-y-4">
        {getSettingsForRole().map((setting) => {
          const Icon = setting.icon;
          return (
            <div key={setting.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{setting.title}</h3>
                  <p className="text-sm text-gray-600">{setting.description}</p>
                </div>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={setting.value}
                  onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          );
        })}
      </div>

      {userRole === 'user' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-medium text-amber-900 mb-2">Emergency Features</h4>
          <p className="text-amber-800 text-sm">
            These settings control how the app responds during emergencies. 
            Enabling location services and voice monitoring can significantly improve emergency response effectiveness.
          </p>
        </div>
      )}

      <button
        onClick={saveSettings}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
      >
        <Save className="w-4 h-4" />
        <span>{loading ? 'Saving...' : 'Save Settings'}</span>
      </button>
    </div>
  );
};

export default Settings;
