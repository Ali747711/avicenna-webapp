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
    <div className="min-h-screen bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-indigo-900/95 relative overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        {/* Gradient Overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-600/20 via-transparent to-accent-600/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 md:w-40 md:h-40 bg-primary-400/20 rounded-full animate-float blur-xl"></div>
        <div className="absolute top-32 right-16 w-16 h-16 md:w-32 md:h-32 bg-accent-400/20 rounded-full animate-float blur-xl" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 md:w-24 md:h-24 bg-blue-400/20 rounded-full animate-float blur-xl" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 md:w-48 md:h-48 bg-green-400/20 rounded-full animate-float blur-xl" style={{ animationDelay: '6s' }}></div>
        
        {/* Subtle Particles */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-accent-300/30 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-primary-300/30 rounded-full animate-pulse" style={{ animationDelay: '5s' }}></div>
      </div>

      {/* Enhanced Glassmorphism Header */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6">
        <div className="container mx-auto max-w-6xl">
          <nav className="navbar-glass rounded-full px-6 md:px-8 py-3 md:py-4 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 md:space-x-4">
                <Link 
                  to="/" 
                  className="text-white/80 hover:text-white transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-white/10"
                  title="Back to Home"
                >
                  <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 drop-shadow-sm" />
                </Link>
                <div className="flex items-center space-x-2 md:space-x-3 hover:scale-105 transition-transform duration-300">
                  <SunIcon className="w-6 h-6 md:w-8 md:h-8 drop-shadow-lg" color="#F59E0B" />
                  <span className="text-lg md:text-xl font-display font-bold text-white drop-shadow-sm">
                    {t('home.title')} Chat
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 md:space-x-4">
                {/* Save Status Indicator */}
                {isAuthenticated && isSaving && (
                  <div className="flex items-center space-x-1 text-xs text-white/70">
                    <Save className="w-3 h-3 animate-spin" />
                    <span className="hidden md:inline">Saving...</span>
                  </div>
                )}
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="text-xs md:text-sm text-white/80 hover:text-white transition-all duration-300 hover:scale-105 px-2 md:px-3 py-1 rounded-full hover:bg-white/10"
                  >
                    Clear
                  </button>
                )}
                {isAuthenticated ? (
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="hidden md:block text-white/80 text-sm">
                      Hello, {userProfile?.name || user?.displayName || 'User'}
                    </div>
                    <Link 
                      to="/profile" 
                      className="nav-button bg-white/10 backdrop-blur-sm text-white border border-white/20 px-3 py-2 md:px-4 md:py-2 rounded-full hover:bg-white/20 hover:border-white/30 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium text-xs md:text-sm"
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={signOut}
                      className="nav-button bg-white/10 backdrop-blur-sm text-white border border-white/20 px-3 py-2 md:px-4 md:py-2 rounded-full hover:bg-white/20 hover:border-white/30 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium text-xs md:text-sm"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/auth" 
                    className="nav-button bg-white/10 backdrop-blur-sm text-white border border-white/20 px-4 py-2 md:px-6 md:py-2.5 rounded-full hover:bg-white/20 hover:border-white/30 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium text-xs md:text-sm"
                  >
                    {t('nav.signIn')}
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <div className="relative z-10 text-center pt-24 md:pt-32 pb-6 md:pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Enhanced Glass Card for Hero Content */}
          <div className="enhanced-glass-card rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-3 md:mb-4 animate-fade-in">
              AI Health <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-600">Analysis</span>
            </h1>
            <p className="text-sm md:text-lg lg:text-xl text-white/90 mb-6 md:mb-8 leading-relaxed animate-slide-up delay-200">
              Describe your symptoms and get instant AI-powered health insights
            </p>
            
            {/* Authentication Status Message */}
            {!isAuthenticated && messages.length === 0 && (
              <div className="mb-6 p-4 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-xl max-w-2xl mx-auto animate-fade-in delay-300">
                <p className="text-sm text-blue-200">
                  ✨ <Link to="/auth" className="font-medium text-blue-300 hover:text-blue-100 underline transition-colors">Sign in</Link> to automatically save your medical history and conversations
                </p>
              </div>
            )}
            
            {/* Enhanced Stats Display */}
            <div className="flex justify-center space-x-6 md:space-x-12 mb-6 animate-fade-in delay-400">
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm border border-primary-400/30">
                  <span className="text-lg md:text-2xl font-bold text-primary-300">24/7</span>
                </div>
                <div className="text-xs md:text-sm text-white/70 font-medium">Available</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm border border-accent-400/30">
                  <span className="text-lg md:text-2xl font-bold text-accent-300">3</span>
                </div>
                <div className="text-xs md:text-sm text-white/70 font-medium">Languages</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm border border-green-400/30">
                  <span className="text-lg md:text-2xl font-bold text-green-300">{isAuthenticated ? '✓' : '✨'}</span>
                </div>
                <div className="text-xs md:text-sm text-white/70 font-medium">{isAuthenticated ? 'Auto-Save' : 'Free'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Messages Container */}
      <div className="relative z-10 flex-1 px-3 md:px-4">
        <div className="container mx-auto max-w-4xl">
          {messages.length > 0 ? (
            <div className="enhanced-glass-card rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 mb-4 md:mb-6 overflow-hidden">
              {/* Chat Header */}
              <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-4 md:px-6 py-3 md:py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white/90 font-medium text-sm md:text-base">AI Analysis Active</span>
                  </div>
                  {isAuthenticated && (
                    <div className="flex items-center space-x-2 text-xs text-white/70">
                      <Save className={`w-3 h-3 ${isSaving ? 'animate-spin' : ''}`} />
                      <span className="hidden md:inline">{isSaving ? 'Saving...' : 'Auto-saved'}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Messages Area */}
              <div className="chat-messages-wrapper">
                <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-h-[50vh] md:max-h-[500px] overflow-y-auto mobile-scroll">
                  {messages.map((message, index) => (
                    <div 
                      key={message.id}
                      className="animate-slide-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
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
          ) : (
            /* Welcome Message for Empty Chat */
            <div className="enhanced-glass-card rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 mb-4 md:mb-6 text-center animate-fade-in">
              <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-accent-400/30">
                <MessageCircle className="w-8 h-8 text-accent-300" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Ready to Help</h3>
              <p className="text-white/70 text-sm md:text-base">
                Start by describing your symptoms below and I'll provide personalized health insights
              </p>
            </div>
          )}

          {/* Enhanced Error Display */}
          {error && (
            <div className="mb-4 md:mb-6 animate-shake">
              <div className="enhanced-glass-card bg-red-500/20 border-red-400/30 rounded-2xl p-4 md:p-6 flex items-start space-x-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-red-200 text-sm md:text-base mb-1">Connection Error</h4>
                  <p className="text-xs md:text-sm text-red-300/80 leading-relaxed">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="mt-3 text-xs text-red-300 hover:text-red-200 underline transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Input Section - optimized for mobile */}
      <div className="relative z-10 pb-4 md:pb-6">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          disabled={false}
        />
      </div>
    </div>
  );
};

export default Chat; 