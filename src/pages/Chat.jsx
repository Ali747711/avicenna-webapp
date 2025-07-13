import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, AlertCircle, MessageCircle, Send, User, Save, Menu, X } from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import SunIcon from '../components/SunIcon';
import { analyzeSymptoms } from '../utils/api';
import { useAuth } from '../contexts/FirebaseAuthContext';

const Chat = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, userProfile, signOut, saveMedicalEntry } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentConversationId] = useState(() => Date.now()); // Unique ID for this conversation
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Close sidebar on escape key and prevent body scroll
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isSidebarOpen]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Circular Hamburger Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 w-12 h-12 md:w-14 md:h-14 md:top-6 md:left-6 bg-slate-900/30 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-slate-900/50 transition-all duration-200 shadow-lg"
      >
        <Menu className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sliding Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-72 md:w-80 bg-slate-900/95 backdrop-blur-md border-r border-white/10 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 md:p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center space-x-2 md:space-x-3">
              <SunIcon className="w-6 h-6 md:w-8 md:h-8" color="#F59E0B" />
              <span className="text-lg md:text-xl font-semibold text-white">
                Avicenna
              </span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2">
            <Link 
              to="/" 
              className="flex items-center space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white text-sm md:text-base"
              onClick={() => setIsSidebarOpen(false)}
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span>{t('common.backToHome')}</span>
            </Link>
            
            {messages.length > 0 && (
              <button
                onClick={() => {
                  clearChat();
                  setIsSidebarOpen(false);
                }}
                className="flex items-center space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white w-full text-left text-sm md:text-base"
              >
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                <span>{t('common.clearChat')}</span>
              </button>
            )}

            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white text-sm md:text-base"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <User className="w-4 h-4 md:w-5 md:h-5" />
                  <span>{t('common.profile')}</span>
                </Link>
                
                <div className="flex items-center space-x-3 px-3 md:px-4 py-2 md:py-3 text-white/60 text-xs md:text-sm">
                  {isSaving && (
                    <>
                      <Save className="w-4 h-4 animate-spin" />
                      <span>{t('common.saving')}</span>
                    </>
                  )}
                </div>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="flex items-center space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white text-sm md:text-base"
                onClick={() => setIsSidebarOpen(false)}
              >
                <User className="w-4 h-4 md:w-5 md:h-5" />
                <span>{t('nav.signIn')}</span>
              </Link>
            )}
          </nav>

          {/* Footer */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-white/40 text-center">
              {t('common.aiHealthAssistant')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area with Top and Bottom Padding */}
      <div className="flex flex-col min-h-screen pt-6 md:pt-8 pb-44 md:pb-56">
        {/* Welcome Message for Empty Chat */}
        {messages.length === 0 && !isLoading && (
          <div className="flex-1 flex items-center justify-center px-4 md:px-6">
            <div className="text-center max-w-3xl">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 border border-accent-400/30">
                <SunIcon className="w-6 h-6 md:w-8 md:h-8" color="#F59E0B" />
              </div>
              <h1 className="text-xl md:text-2xl xl:text-3xl font-semibold text-white mb-3 md:mb-4">
                {t('home.howCanIHelp')}
              </h1>
              <p className="text-white/60 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
                {t('home.describeSymptoms')}
              </p>
              
              {/* Sample Inquiry Buttons - Hidden on Mobile */}
              <div className="mb-6 md:mb-8 space-y-3 hidden md:block">
                <p className="text-sm text-white/40 mb-4">{t('common.tryTheseExamples')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleSendMessage(t('chat.samples.headacheFever'), i18n.language)}
                    className="p-4 bg-slate-800/40 border border-white/10 rounded-2xl text-left hover:bg-slate-800/60 hover:border-white/20 transition-all duration-200 group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-white/80 text-sm group-hover:text-white">{t('chat.samples.headacheFever')}</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => handleSendMessage(t('chat.samples.coughSoreThroat'), i18n.language)}
                    className="p-4 bg-slate-800/40 border border-white/10 rounded-2xl text-left hover:bg-slate-800/60 hover:border-white/20 transition-all duration-200 group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-white/80 text-sm group-hover:text-white">{t('chat.samples.coughSoreThroat')}</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => handleSendMessage(t('chat.samples.stomachPain'), i18n.language)}
                    className="p-4 bg-slate-800/40 border border-white/10 rounded-2xl text-left hover:bg-slate-800/60 hover:border-white/20 transition-all duration-200 group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-white/80 text-sm group-hover:text-white">{t('chat.samples.stomachPain')}</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => handleSendMessage(t('chat.samples.dizzyTired'), i18n.language)}
                    className="p-4 bg-slate-800/40 border border-white/10 rounded-2xl text-left hover:bg-slate-800/60 hover:border-white/20 transition-all duration-200 group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-white/80 text-sm group-hover:text-white">{t('chat.samples.dizzyTired')}</span>
                    </div>
                  </button>
                </div>
              </div>
              
              {/* Quick Auth Prompt */}
              {!isAuthenticated && (
                <div className="mb-6 p-3 md:p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl">
                  <p className="text-xs md:text-sm text-blue-200">
                    💡 <Link to="/auth" className="font-medium text-blue-300 hover:text-blue-100 underline transition-colors">{t('nav.signIn')}</Link> {t('home.signInToSave')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Chat Container */}
        {messages.length > 0 && (
          <div className="flex-1 flex flex-col px-4 md:px-6">
            <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
              {/* Messages Area - Full Height */}
              <div className="flex-1 overflow-y-auto py-2 md:py-4 space-y-4 md:space-y-6">
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
                <div ref={messagesEndRef} className="h-4 md:h-8" />
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="px-4 md:px-6 pb-6 md:pb-8">
            <div className="max-w-5xl mx-auto">
              <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-3 md:p-4 flex items-start space-x-3">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-200 text-xs md:text-sm mb-1">{t('chat.connectionError')}</h4>
                  <p className="text-xs text-red-300/80">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="mt-2 text-xs text-red-300 hover:text-red-200 underline"
                  >
                    {t('common.dismiss')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Chat Input Section */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-900/30 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              disabled={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat; 