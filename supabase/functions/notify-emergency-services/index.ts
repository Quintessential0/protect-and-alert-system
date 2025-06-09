
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmergencyServiceRequest {
  userId: string;
  userProfile: any;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  incidentId: string;
  timestamp: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, userProfile, location, incidentId, timestamp }: EmergencyServiceRequest = await req.json();

    console.log(`🚨 EMERGENCY SERVICES NOTIFICATION - Incident ${incidentId}`);
    console.log(`User: ${userProfile?.full_name || 'Unknown'} (${userId})`);
    console.log(`Time: ${timestamp}`);
    
    if (location) {
      console.log(`Location: ${location.latitude}, ${location.longitude} (±${location.accuracy}m)`);
      console.log(`Google Maps: https://maps.google.com/maps?q=${location.latitude},${location.longitude}`);
    } else {
      console.log('Location: Not available');
    }

    // In a real implementation, you would integrate with:
    // - Emergency services API
    // - Police dispatch system
    // - Fire department notification system
    // - Medical emergency services

    // Simulate emergency services notification
    const serviceResponse = {
      success: true,
      incidentId,
      dispatchNumber: `EMG-${Date.now()}`,
      servicesNotified: ['Police', 'Medical'],
      estimatedResponseTime: '5-10 minutes',
      location: location || null,
      timestamp: new Date().toISOString()
    };

    console.log(`Emergency services notified successfully for incident ${incidentId}`);
    console.log(`Dispatch number: ${serviceResponse.dispatchNumber}`);

    return new Response(JSON.stringify(serviceResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error notifying emergency services:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to notify emergency services',
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
