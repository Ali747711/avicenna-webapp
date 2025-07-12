import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, ArrowLeft, AlertCircle } from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-secondary-200 flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="text-secondary-600 hover:text-primary-600 transition-colors"
                title="Back to Home"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center space-x-2">
                <Heart className="w-8 h-8 text-primary-600" />
                <span className="text-2xl font-display font-bold text-secondary-900">
                  {t('home.title')}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="text-sm text-secondary-600 hover:text-primary-600 transition-colors"
                >
                  Clear Chat
                </button>
              )}
              <Link to="/auth" className="btn-secondary">
                {t('nav.signIn')}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Content */}
      <div className="flex-1 flex flex-col">
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-2xl">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="text-3xl font-display font-bold text-secondary-900 mb-4">
                {t('chat.title')}
              </h1>
              <p className="text-lg text-secondary-600 mb-8">
                {t('chat.description')}
              </p>
              <div className="bg-white rounded-2xl shadow-soft border border-secondary-100 p-6">
                <h3 className="font-semibold text-secondary-900 mb-3">How it works:</h3>
                <div className="space-y-3 text-sm text-secondary-600 text-left">
                  <div className="flex items-start space-x-2">
                    <span className="inline-block w-6 h-6 bg-primary-100 text-primary-600 rounded-full text-xs font-medium flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <span>Describe your symptoms in detail</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="inline-block w-6 h-6 bg-primary-100 text-primary-600 rounded-full text-xs font-medium flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <span>Choose your preferred language</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="inline-block w-6 h-6 bg-primary-100 text-primary-600 rounded-full text-xs font-medium flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <span>Get AI-powered medical insights and recommendations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
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
        )}

        {/* Error Display */}
        {error && (
          <div className="px-6 pb-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-error-50 border border-error-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-error-900">Connection Error</h4>
                  <p className="text-sm text-error-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        disabled={false}
      />
    </div>
  );
};

export default Chat; 