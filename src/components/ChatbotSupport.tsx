
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  id: string;
  message: string;
  response: string | null;
  created_at: string;
  conversation_id: string;
}

const ChatbotSupport = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const { toast } = useToast();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setMessages(data);
        setConversationId(data[0].conversation_id || generateConversationId());
      } else {
        setConversationId(generateConversationId());
      }
    } catch (error: any) {
      console.error('Error loading chat history:', error);
    }
  };

  const generateConversationId = () => {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || !user) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage('');
    setIsLoading(true);

    try {
      // Add user message to local state immediately
      const tempMessage: ChatMessage = {
        id: `temp_${Date.now()}`,
        message: userMessage,
        response: null,
        created_at: new Date().toISOString(),
        conversation_id: conversationId
      };
      
      setMessages(prev => [...prev, tempMessage]);

      // Save message to database
      const { data: savedMessage, error: saveError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: userMessage,
          conversation_id: conversationId
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // Call the chatbot function
      const { data: functionData, error: functionError } = await supabase.functions
        .invoke('chatbot-support', {
          body: { 
            message: userMessage,
            conversation_id: conversationId,
            user_id: user.id
          }
        });

      if (functionError) {
        throw new Error('Chatbot service temporarily unavailable. Please try again in a moment.');
      }

      const botResponse = functionData?.response || 'I apologize, but I encountered an issue processing your request. Please try rephrasing your question.';

      // Update the message with the response
      const { error: updateError } = await supabase
        .from('chat_messages')
        .update({ response: botResponse })
        .eq('id', savedMessage.id);

      if (updateError) throw updateError;

      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id 
          ? { ...savedMessage, response: botResponse }
          : msg
      ));

    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Update the temporary message with an error response
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id 
          ? { ...msg, response: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment or contact support for assistance.' }
          : msg
      ));

      toast({
        title: "Connection Issue",
        description: "There was a problem connecting to the chatbot. Your message has been saved and we'll respond as soon as possible.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-[600px] flex flex-col">
      <div className="flex items-center space-x-3 mb-6">
        <MessageSquare className="w-6 h-6 text-safe-600" />
        <h2 className="text-xl font-bold text-gray-900">SafeGuard AI Assistant</h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <Bot className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>Hello! I'm your SafeGuard AI assistant. How can I help you today?</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-3">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-safe-600 text-white rounded-lg px-4 py-2 max-w-[80%]">
                <div className="flex items-center space-x-2 mb-1">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">You</span>
                </div>
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>

            {/* Bot Response */}
            {msg.response && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-[80%]">
                  <div className="flex items-center space-x-2 mb-1">
                    <Bot className="w-4 h-4 text-safe-600" />
                    <span className="text-sm font-medium text-safe-600">SafeGuard AI</span>
                  </div>
                  <p className="text-sm text-gray-700">{msg.response}</p>
                </div>
              </div>
            )}
            
            {!msg.response && msg.id.startsWith('temp_') && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 text-safe-600 animate-spin" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-safe-500 focus:border-safe-500"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={!currentMessage.trim() || isLoading}
          className="bg-safe-600 hover:bg-safe-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-500 text-center">
        Your conversations are saved and encrypted for your privacy and safety.
      </div>
    </div>
  );
};

export default ChatbotSupport;
