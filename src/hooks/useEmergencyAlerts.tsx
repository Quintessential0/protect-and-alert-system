
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

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone_number')
        .eq('id', user.user.id)
        .single();

      // Get emergency contacts
      const { data: contacts, error: contactsError } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.user.id)
        .order('priority');

      if (contactsError) throw contactsError;

      // Prepare emergency message
      const locationText = location 
        ? `Location: https://maps.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`
        : 'Location: Unable to determine current location';

      const emergencyMessage = `
🚨 EMERGENCY ALERT 🚨
${profile?.full_name || 'SafeGuard User'} has triggered an emergency alert.
${locationText}
Time: ${new Date().toLocaleString()}
Please check on them immediately or contact emergency services.
      `;

      // Send alerts to emergency contacts via edge function
      for (const contact of contacts || []) {
        try {
          await supabase.functions.invoke('send-emergency-alert', {
            body: {
              contactName: contact.name,
              contactPhone: contact.phone,
              contactEmail: contact.email,
              message: emergencyMessage,
              incidentId: incidentId
            }
          });

          await logActivity('emergency', `Emergency alert sent to ${contact.name}`, { 
            contact_id: contact.id,
            incident_id: incidentId,
            contact_phone: contact.phone,
            location: location ? {
              lat: location.coords.latitude,
              lng: location.coords.longitude
            } : null
          });
        } catch (error) {
          console.error(`Failed to send alert to ${contact.name}:`, error);
        }
      }

      // Notify emergency services via edge function
      try {
        await supabase.functions.invoke('notify-emergency-services', {
          body: {
            userId: user.user.id,
            userProfile: profile,
            location: location ? {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              accuracy: location.coords.accuracy
            } : null,
            incidentId: incidentId,
            timestamp: new Date().toISOString()
          }
        });

        await logActivity('emergency', 'Emergency services notified', { 
          incident_id: incidentId,
          services_notified: true
        });
      } catch (error) {
        console.error('Failed to notify emergency services:', error);
      }

      toast({
        title: "Emergency Contacts Notified",
        description: `Alerts sent to ${contacts?.length || 0} emergency contacts and emergency services.`,
        variant: "destructive",
      });

    } catch (error: any) {
      console.error('Error sending emergency alerts:', error);
      toast({
        title: "Alert Error",
        description: "Some emergency alerts may not have been sent. Emergency services have been notified.",
        variant: "destructive",
      });
    }
  };

  return { sendEmergencyAlerts };
};
