import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, AlertCircle, MessageCircle, Send, User, Save } from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import SunIcon from '../components/SunIcon';
import { analyzeSymptoms } from '../utils/api';
import { useAuth } from '../contexts/FirebaseAuthContext';

const Chat = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user, userProfile, signOut, saveMedicalEntry } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentConversationId] = useState(() => Date.now()); // Unique ID for this conversation
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Save conversation entry to Firebase
  const saveConversationEntry = async (userMessage, aiResponse = null, language = 'en') => {
    if (!isAuthenticated || !userMessage) return;

    setIsSaving(true);
    try {
      const entry = {
        conversationId: currentConversationId,
        userMessage: userMessage.content,
        aiResponse: aiResponse ? {
          analysis: aiResponse.data,
          timestamp: aiResponse.timestamp
        } : null,
        language: language,
        symptoms: userMessage.content,
        type: 'symptom_analysis'
      };

      const result = await saveMedicalEntry(entry);
      if (!result.success) {
        console.error('Failed to save conversation:', result.error);
      }
    } catch (err) {
      console.error('Error saving conversation:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle message sending
  const handleSendMessage = async (messageContent, language) => {
    if (!messageContent.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      content: messageContent,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await analyzeSymptoms(messageContent, language);
      
      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        data: response,
        isUser: false,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Save complete conversation entry to Firebase if user is authenticated
      if (isAuthenticated) {
        await saveConversationEntry(userMessage, aiMessage, language);
      }
    } catch (err) {
      console.error('Error analyzing symptoms:', err);
      setError(err.message || 'Failed to analyze symptoms. Please try again.');
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        content: 'I apologize, but I encountered an error while analyzing your symptoms. Please try again in a moment.',
        isUser: false,
        isError: true,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Save user message even if AI response failed (for authenticated users)
      if (isAuthenticated) {
        await saveConversationEntry(userMessage, null, language);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative flex flex-col">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Minimal Clean Header */}
      <header className="relative z-10 border-b border-white/10 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Back + Title */}
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
                title="Back to Home"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-2">
                <SunIcon className="w-6 h-6" color="#F59E0B" />
                <span className="text-lg font-semibold text-white">
                  Avicenna
                </span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2">
              {/* Clear Chat */}
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="text-white/60 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 text-sm"
                >
                  Clear
                </button>
              )}
              
              {/* User Menu */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  {isSaving && (
                    <div className="flex items-center space-x-1 text-xs text-white/50">
                      <Save className="w-3 h-3 animate-spin" />
                    </div>
                  )}
                  <Link 
                    to="/profile" 
                    className="text-white/60 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 text-sm"
                  >
                    Profile
                  </Link>
                </div>
              ) : (
                <Link 
                  to="/auth" 
                  className="text-white/60 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 text-sm"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Message for Empty Chat */}
      {messages.length === 0 && !isLoading && (
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-2xl">
            <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent-400/30">
              <SunIcon className="w-8 h-8" color="#F59E0B" />
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white mb-4">
              How can I help you today?
            </h1>
            <p className="text-white/60 mb-8 leading-relaxed">
              Describe your symptoms and I'll provide personalized health insights in English, Korean, or Uzbek.
            </p>
            
            {/* Quick Auth Prompt */}
            {!isAuthenticated && (
              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl">
                <p className="text-sm text-blue-200">
                  💡 <Link to="/auth" className="font-medium text-blue-300 hover:text-blue-100 underline transition-colors">Sign in</Link> to save your conversations automatically
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Chat Container */}
      {messages.length > 0 && (
        <div className="flex-1 flex flex-col px-4">
          <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
            {/* Messages Area - Full Height */}
            <div className="flex-1 overflow-y-auto py-4 space-y-6">
              {messages.map((message, index) => (
                <div 
                  key={message.id}
                  className="animate-slide-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ChatMessage
                    message={message}
                    isUser={message.isUser}
                  />
                </div>
              ))}
              {isLoading && (
                <div className="animate-slide-in">
                  <ChatMessage isLoading={true} />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="px-4 pb-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-red-200 text-sm mb-1">Connection Error</h4>
                <p className="text-xs text-red-300/80">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="mt-2 text-xs text-red-300 hover:text-red-200 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Input Section */}
      <div className="relative z-10 px-4 pb-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat; 