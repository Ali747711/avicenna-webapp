import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';

const ChatInput = ({ onSendMessage, isLoading, disabled }) => {
  const { t, i18n } = useTranslation();
  const [message, setMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', shortName: 'EN' },
    { code: 'ko', name: '한국어', flag: '🇰🇷', shortName: '한국어' },
    { code: 'uz', name: 'O\'zbek', flag: '🇺🇿', shortName: 'O\'zbek' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim(), selectedLanguage);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const getPlaceholder = () => {
    switch (selectedLanguage) {
      case 'ko':
        return '증상을 자세히 설명해주세요...';
      case 'uz':
        return 'Simptomlaringizni batafsil tasvirlab bering...';
      default:
        return 'Describe your symptoms in detail...';
    }
  };

  const getExamplePrompts = () => {
    switch (selectedLanguage) {
      case 'ko':
        return [
          '머리가 아프고 열이 나요',
          '기침이 나고 목이 아파요'
        ];
      case 'uz':
        return [
          'Boshim og\'riyapti va isitmam bor',
          'Yo\'talayapman va tomog\'im og\'riyapti'
        ];
      default:
        return [
          'I have a headache and fever',
          'I\'m coughing and have a sore throat'
        ];
    }
  };

  return (
    <div className="px-3 md:px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="glass-card rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-soft-lg border border-white/20">
          {/* Language Selection Pills - more compact on mobile */}
          <div className="flex items-center justify-center mb-4 md:mb-6">
            <div className="flex bg-white/30 backdrop-blur-sm rounded-full p-0.5 md:p-1 border border-white/20">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`group relative px-3 py-1.5 md:px-4 md:py-2 rounded-full font-medium text-xs md:text-sm transition-all duration-300 flex items-center space-x-1.5 md:space-x-2 ${
                    selectedLanguage === lang.code
                      ? 'bg-primary-500 text-white shadow-lg scale-105'
                      : 'text-secondary-700 hover:bg-white/50 hover:scale-105'
                  }`}
                >
                  <span className="text-sm md:text-lg">{lang.flag}</span>
                  <span className="hidden sm:inline">{lang.shortName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            {/* Main Input Container */}
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={getPlaceholder()}
                className="w-full px-4 py-3 pb-6 md:px-6 md:py-4 md:pb-8 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl md:rounded-2xl text-secondary-900 placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent focus:bg-white/70 transition-all duration-300 resize-none min-h-[100px] md:min-h-[120px] text-sm md:text-base leading-relaxed glow-on-focus"
                disabled={isLoading || disabled}
                maxLength={1000}
              />
              
              {/* Character Count - positioned in bottom right of textarea */}
              <div className="absolute bottom-1.5 right-3 md:bottom-2 md:right-4 text-xs text-secondary-400 pointer-events-none">
                {message.length}/1000
              </div>
            </div>

            {/* Bottom Section - Example Prompts and Send Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
              {/* Example Prompts */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-1.5 md:gap-2 items-center">
                  <span className="text-xs text-secondary-500 font-medium flex-shrink-0">Try:</span>
                  {getExamplePrompts().map((prompt, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setMessage(prompt)}
                      className="text-xs bg-white/50 hover:bg-white/70 text-secondary-600 px-2 py-1 md:px-3 md:py-1.5 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/30 truncate max-w-[150px] md:max-w-[200px]"
                      disabled={isLoading || disabled}
                      title={prompt}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Send Button */}
              <div className="flex-shrink-0 self-end sm:self-auto">
                <button
                  type="submit"
                  disabled={!message.trim() || isLoading || disabled}
                  className={`group relative px-4 py-2.5 md:px-6 md:py-3 rounded-full font-medium transition-all duration-300 flex items-center space-x-1.5 md:space-x-2 shadow-lg text-sm md:text-base ${
                    !message.trim() || isLoading || disabled
                      ? 'bg-white/30 text-secondary-400 cursor-not-allowed backdrop-blur-sm border border-white/20'
                      : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 hover:scale-110 hover:shadow-xl backdrop-blur-sm border border-white/20 glow-on-hover'
                  }`}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-0.5 transition-transform" />
                  )}
                  <span className="hidden sm:inline">
                    {isLoading ? 'Analyzing...' : 'Send'}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInput; 