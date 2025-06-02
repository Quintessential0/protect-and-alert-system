
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory } = await req.json();
    console.log('Received request:', { message, historyLength: conversationHistory?.length });

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    // Create the conversation context with safety-focused system prompt
    const messages = [
      {
        role: 'system',
        content: `You are a helpful AI assistant for SafeGuard, a personal safety application. Your role is to:

1. Provide safety advice and tips
2. Help users understand how to use SafeGuard features
3. Offer emotional support during difficult situations
4. Guide users on emergency procedures
5. Answer questions about personal safety, women's safety, and crisis situations

Guidelines:
- Always prioritize user safety
- Be empathetic and supportive
- Provide practical, actionable advice
- If someone mentions being in immediate danger, encourage them to contact emergency services (911) immediately
- Keep responses concise but helpful
- Stay focused on safety-related topics
- Be non-judgmental and understanding

Available SafeGuard features you can help explain:
- Location sharing with emergency contacts
- Audio/video recording for evidence
- Incident reporting
- Emergency contacts management
- Fake call scheduler for exit strategies
- Safe zones and danger zone alerts
- Emotional support resources`
      },
      ...(conversationHistory || []),
      { role: 'user', content: message }
    ];

    // Retry logic with exponential backoff
    let response;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        console.log(`Attempt ${attempts + 1} to call OpenAI API`);
        
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: messages,
            max_tokens: 500,
            temperature: 0.7,
            stream: false,
          }),
        });

        if (response.ok) {
          break; // Success, exit retry loop
        } else if (response.status === 429) {
          // Rate limited
          const retryAfter = response.headers.get('retry-after');
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempts) * 1000;
          console.log(`Rate limited, waiting ${waitTime}ms before retry`);
          await delay(waitTime);
          attempts++;
        } else {
          throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          throw error;
        }
        console.log(`Attempt ${attempts} failed, retrying...`);
        await delay(Math.pow(2, attempts - 1) * 1000);
      }
    }

    if (!response || !response.ok) {
      throw new Error(`OpenAI API error after ${maxAttempts} attempts`);
    }

    const data = await response.json();
    console.log('OpenAI response received successfully');
    
    const aiResponse = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a proper response. Please try again.";

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in chatbot-support function:', error);
    
    let errorMessage = 'Failed to get AI response';
    let statusCode = 500;
    
    if (error.message?.includes('429') || error.message?.includes('rate')) {
      errorMessage = 'AI service is temporarily busy due to high usage';
      statusCode = 429;
    } else if (error.message?.includes('API key')) {
      errorMessage = 'AI service configuration error';
      statusCode = 503;
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error.message,
        retryable: statusCode === 429
      }),
      {
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
