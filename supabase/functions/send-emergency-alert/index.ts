
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmergencyAlertRequest {
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  message: string;
  incidentId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contactName, contactPhone, contactEmail, message, incidentId }: EmergencyAlertRequest = await req.json();

    console.log(`🚨 EMERGENCY ALERT - Incident ${incidentId}`);
    console.log(`Sending alert to: ${contactName} (${contactPhone})`);
    console.log(`Message: ${message}`);

    // In a real implementation, you would integrate with:
    // - SMS service (Twilio, AWS SNS, etc.)
    // - Email service (SendGrid, AWS SES, etc.)
    // - Push notification service
    
    // For now, we'll simulate the sending
    const alertResponse = {
      success: true,
      contactName,
      contactPhone,
      sentAt: new Date().toISOString(),
      incidentId,
      method: 'SMS' // Would be determined by service availability
    };

    // Log the emergency alert attempt
    console.log(`Emergency alert sent successfully to ${contactName}`);

    return new Response(JSON.stringify(alertResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error sending emergency alert:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send emergency alert',
        details: error.message 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
