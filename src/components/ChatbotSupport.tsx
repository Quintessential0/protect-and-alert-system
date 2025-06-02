
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Send, Bot, User, Shield, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatbotSupport = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your SafeGuard AI assistant. I'm here to help you with safety advice, app features, and provide support. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (retryAttempt = 0) => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage('');
    setIsLoading(true);

    try {
      console.log('Sending message to chatbot:', messageToSend);
      
      // Prepare conversation history for context
      const conversationHistory = messages.slice(-5).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('chatbot-support', {
        body: {
          message: messageToSend,
          conversationHistory
        }
      });

      console.log('Chatbot response:', data, error);

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "I received your message but couldn't generate a proper response. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setRetryCount(0);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Handle rate limiting specifically
      if (error?.message?.includes('429') || error?.message?.includes('rate')) {
        if (retryAttempt < 2) {
          console.log(`Rate limited, retrying in ${(retryAttempt + 1) * 2} seconds...`);
          setTimeout(() => {
            sendMessage(retryAttempt + 1);
          }, (retryAttempt + 1) * 2000);
          return;
        } else {
          toast({
            title: "Rate Limited",
            description: "The AI service is temporarily busy. Please wait a moment before trying again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to send message. Please check your connection and try again.",
          variant: "destructive",
        });
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble responding right now. This might be due to high usage. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
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

  const quickResponses = [
    "How do I use the emergency features?",
    "I need safety advice",
    "How does location sharing work?",
    "What should I do in an emergency?",
  ];

  const handleQuickResponse = (response: string) => {
    setCurrentMessage(response);
  };

  const retryLastMessage = () => {
    if (messages.length >= 2) {
      const lastUserMessage = messages[messages.length - 2];
      if (lastUserMessage.sender === 'user') {
        setCurrentMessage(lastUserMessage.content);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-emergency-50 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="bg-emergency-600 p-2 rounded-full">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">SafeGuard AI Support</h2>
            <p className="text-sm text-gray-600">Your personal safety assistant</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={retryLastMessage}
          className="flex items-center space-x-1"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex max-w-xs lg:max-w-md space-x-2 ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user'
                    ? 'bg-emergency-600'
                    : 'bg-gray-200'
                }`}
              >
                {message.sender === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-gray-600" />
                )}
              </div>
              <div
                className={`px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-emergency-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-emergency-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Responses */}
      {messages.length <= 1 && (
        <div className="px-4 py-2 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickResponses.map((response, index) => (
              <button
                key={index}
                onClick={() => handleQuickResponse(response)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                {response}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="flex-1 min-h-[40px] max-h-[120px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!currentMessage.trim() || isLoading}
            className="bg-emergency-600 hover:bg-emergency-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatbotSupport;
