
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmergencyAlert {
  incident_id: string;
  user_id: string;
  location?: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
  message_type: 'sms' | 'email' | 'both';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { incident_id, user_id, location, message_type = 'both' }: EmergencyAlert = await req.json();

    console.log('Processing emergency alert for incident:', incident_id);

    // Get user profile and emergency contacts
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, phone_number')
      .eq('id', user_id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw new Error('Failed to fetch user profile');
    }

    const { data: contacts, error: contactsError } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', user_id)
      .order('priority');

    if (contactsError) {
      console.error('Error fetching contacts:', contactsError);
      throw new Error('Failed to fetch emergency contacts');
    }

    if (!contacts || contacts.length === 0) {
      console.log('No emergency contacts found for user');
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No emergency contacts to notify',
        contacts_notified: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create emergency message
    const userName = profile.full_name || 'A SafeGuard user';
    const locationText = location 
      ? `Location: https://maps.google.com/?q=${location.lat},${location.lng}`
      : 'Location not available';
    
    const emergencyMessage = `🚨 EMERGENCY ALERT: ${userName} has activated their emergency button and needs immediate assistance. ${locationText}. This is an automated message from SafeGuard Safety App.`;

    // Process each contact
    const results = [];
    for (const contact of contacts) {
      console.log(`Notifying contact: ${contact.name} (${contact.phone})`);
      
      try {
        // For now, we'll simulate sending notifications
        // In a real implementation, you would integrate with services like:
        // - Twilio for SMS
        // - SendGrid/Resend for email
        // - Push notification services
        
        // Log the notification attempt
        await supabase.from('activity_logs').insert({
          user_id,
          action_type: 'emergency_alert',
          description: `Emergency alert sent to ${contact.name}`,
          metadata: {
            incident_id,
            contact_id: contact.id,
            contact_name: contact.name,
            contact_phone: contact.phone,
            contact_email: contact.email,
            message_type,
            location
          }
        });

        results.push({
          contact_id: contact.id,
          contact_name: contact.name,
          status: 'sent',
          methods: []
        });

        // Simulate SMS sending (replace with actual Twilio integration)
        if ((message_type === 'sms' || message_type === 'both') && contact.phone) {
          console.log(`SMS would be sent to ${contact.phone}: ${emergencyMessage}`);
          results[results.length - 1].methods.push('sms');
        }

        // Simulate email sending (replace with actual email service integration)
        if ((message_type === 'email' || message_type === 'both') && contact.email) {
          console.log(`Email would be sent to ${contact.email}: ${emergencyMessage}`);
          results[results.length - 1].methods.push('email');
        }

      } catch (contactError) {
        console.error(`Failed to notify contact ${contact.name}:`, contactError);
        results.push({
          contact_id: contact.id,
          contact_name: contact.name,
          status: 'failed',
          error: contactError.message
        });
      }
    }

    // Update incident with notification status
    await supabase
      .from('emergency_incidents')
      .update({
        notes: `Emergency alerts sent to ${results.filter(r => r.status === 'sent').length} contacts`
      })
      .eq('id', incident_id);

    console.log('Emergency alert processing completed');

    return new Response(JSON.stringify({
      success: true,
      incident_id,
      contacts_notified: results.filter(r => r.status === 'sent').length,
      total_contacts: contacts.length,
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in send-emergency-alerts function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
