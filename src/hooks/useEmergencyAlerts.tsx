
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useActivityLogger } from '@/components/ActivityLog';

export const useEmergencyAlerts = () => {
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();

  const sendEmergencyAlerts = async (incidentId: string, location?: GeolocationPosition) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      console.log('Sending emergency alerts via edge function...');

      // Call the edge function to send alerts
      const { data, error } = await supabase.functions.invoke('send-emergency-alerts', {
        body: {
          incident_id: incidentId,
          user_id: user.user.id,
          location: location ? {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
            accuracy: location.coords.accuracy
          } : undefined,
          message_type: 'both'
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      console.log('Emergency alerts sent successfully:', data);

      await logActivity('emergency', 'Emergency alerts sent successfully', { 
        incident_id: incidentId,
        contacts_notified: data.contacts_notified,
        total_contacts: data.total_contacts,
        location: location ? {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        } : null
      });

      toast({
        title: "🚨 Emergency Alerts Sent!",
        description: `${data.contacts_notified} emergency contacts have been notified.`,
        variant: "destructive",
      });

    } catch (error: any) {
      console.error('Error sending emergency alerts:', error);
      
      // Fallback: try to get contacts and show local notification
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('Not authenticated');

        const { data: contacts } = await supabase
          .from('emergency_contacts')
          .select('name')
          .eq('user_id', userData.user.id);

        await logActivity('emergency', 'Emergency alert failed, showing local notification', { 
          incident_id: incidentId,
          error: error.message,
          contacts_count: contacts?.length || 0
        });

        toast({
          title: "⚠️ Alert System Error",
          description: `Unable to send alerts automatically. Please contact your ${contacts?.length || 0} emergency contacts manually.`,
          variant: "destructive",
        });
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        toast({
          title: "⚠️ Critical Error",
          description: "Emergency alert system unavailable. Contact emergency services directly.",
          variant: "destructive",
        });
      }
    }
  };

  return { sendEmergencyAlerts };
};
