import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, AlertCircle, MessageCircle, Send, User } from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import SunIcon from '../components/SunIcon';
import { analyzeSymptoms } from '../utils/api';

const Chat = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (messageContent, language) => {
    setError(null);
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      content: messageContent,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call our API
      const response = await analyzeSymptoms(messageContent, language);
      
      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        data: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      setError(error.message || 'Failed to analyze symptoms. Please try again.');
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        content: 'I apologize, but I encountered an error while analyzing your symptoms. Please try again in a moment.',
        isUser: false,
        isError: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements - smaller on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-5 w-16 h-16 md:w-32 md:h-32 md:top-20 md:left-10 bg-primary-200/20 rounded-full animate-float"></div>
        <div className="absolute top-20 right-10 w-12 h-12 md:w-24 md:h-24 md:top-40 md:right-20 bg-accent-200/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-10 w-10 h-10 md:w-20 md:h-20 md:bottom-40 md:left-20 bg-blue-200/20 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-10 right-5 w-14 h-14 md:w-28 md:h-28 md:bottom-20 md:right-10 bg-green-200/20 rounded-full animate-float" style={{ animationDelay: '6s' }}></div>
      </div>

      {/* Header - more compact on mobile */}
      <header className="relative z-10 bg-white/30 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-4">
              <Link 
                to="/" 
                className="text-secondary-600 hover:text-primary-600 transition-all duration-300 hover:scale-110 p-1.5 md:p-2 rounded-full hover:bg-white/50"
                title="Back to Home"
              >
                <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
              </Link>
              <div className="flex items-center space-x-2 md:space-x-3">
                <SunIcon className="w-6 h-6 md:w-8 md:h-8 drop-shadow-sm" color="#F59E0B" />
                <span className="text-lg md:text-2xl font-display font-bold text-primary-700">
                  {t('home.title')}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="text-xs md:text-sm text-secondary-600 hover:text-primary-600 transition-all duration-300 hover:scale-105 px-2 md:px-3 py-1 rounded-full hover:bg-white/50"
                >
                  Clear
                </button>
              )}
              <Link 
                to="/auth" 
                className="bg-white/20 backdrop-blur-sm text-secondary-700 border border-white/30 px-3 py-1.5 md:px-4 md:py-2 rounded-full hover:bg-white/30 hover:scale-105 transition-all duration-300 font-medium text-xs md:text-sm"
              >
                {t('nav.signIn')}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - more compact on mobile */}
      <section className="relative z-10 py-6 md:py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-4 md:space-y-6">
            {/* Logo and Heading */}
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center shadow-soft">
                  <SunIcon className="w-7 h-7 md:w-10 md:h-10" color="#F59E0B" />
                </div>
              </div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold text-secondary-900">
                Symptom Analysis Chat
              </h1>
              <p className="text-sm md:text-lg lg:text-xl text-secondary-600 max-w-2xl mx-auto px-4">
                Describe your symptoms in your preferred language
              </p>
            </div>

            {/* Instruction Card - more compact on mobile */}
            <div className="glass-card rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-soft-lg border border-white/20 max-w-2xl mx-auto">
              <div className="flex items-center space-x-2 md:space-x-3 mb-4 md:mb-6">
                <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                <h3 className="text-lg md:text-xl font-semibold text-secondary-900">How it works</h3>
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs md:text-sm">1</span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-secondary-900 text-sm md:text-base">Describe your symptoms</h4>
                    <p className="text-xs md:text-sm text-secondary-600 mt-1">Tell us about your health concerns in detail</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs md:text-sm">2</span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-secondary-900 text-sm md:text-base">Choose your language</h4>
                    <p className="text-xs md:text-sm text-secondary-600 mt-1">Select English, Korean, or Uzbek for personalized care</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs md:text-sm">3</span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-secondary-900 text-sm md:text-base">Get AI-powered insights</h4>
                    <p className="text-xs md:text-sm text-secondary-600 mt-1">Receive medical analysis and doctor recommendations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Container - better mobile spacing */}
      <div className="relative z-10 flex-1 px-4">
        <div className="container mx-auto max-w-4xl">
          {messages.length > 0 ? (
            <div className="chat-container glass-card rounded-2xl md:rounded-3xl shadow-soft-lg border border-white/20 mb-4 md:mb-6 overflow-hidden">
              <div className="chat-messages-wrapper">
                <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-h-[400px] md:max-h-[500px] overflow-y-auto chat-scrollbar">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isUser={message.isUser}
                    />
                  ))}
                  {isLoading && <ChatMessage isLoading={true} />}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>
          ) : null}

          {/* Error Display - more compact on mobile */}
          {error && (
            <div className="mb-4 md:mb-6">
              <div className="bg-error-50/80 backdrop-blur-sm border border-error-200 rounded-xl md:rounded-2xl p-3 md:p-4 flex items-start space-x-3">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-error-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-error-900 text-sm md:text-base">Connection Error</h4>
                  <p className="text-xs md:text-sm text-error-700 mt-1">{error}</p>
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