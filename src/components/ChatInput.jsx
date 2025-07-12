import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Globe } from 'lucide-react';

const ChatInput = ({ onSendMessage, isLoading, disabled }) => {
  const { t, i18n } = useTranslation();
  const [message, setMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'uz', name: 'O\'zbek', flag: '🇺🇿' }
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

  return (
    <div className="bg-white border-t border-secondary-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Language Selector */}
        <div className="flex items-center space-x-2 mb-3">
          <Globe className="w-4 h-4 text-secondary-500" />
          <span className="text-sm text-secondary-600">Language:</span>
          <div className="flex space-x-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedLanguage === lang.code
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                }`}
              >
                {lang.flag} {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                selectedLanguage === 'ko' 
                  ? '증상을 설명해주세요...' 
                  : selectedLanguage === 'uz'
                  ? 'Simptomlaringizni tasvirlab bering...'
                  : 'Describe your symptoms...'
              }
              className="input-field resize-none"
              rows="3"
              disabled={isLoading || disabled}
              maxLength={1000}
            />
            <div className="mt-1 text-xs text-secondary-500 text-right">
              {message.length}/1000 characters
            </div>
          </div>
          <button
            type="submit"
            disabled={!message.trim() || isLoading || disabled}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
              !message.trim() || isLoading || disabled
                ? 'bg-secondary-200 text-secondary-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-soft hover:shadow-soft-lg'
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span className="hidden sm:inline">
              {isLoading ? 'Analyzing...' : 'Send'}
            </span>
          </button>
        </form>

        {/* Example prompts */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-secondary-500">Try:</span>
          {selectedLanguage === 'ko' ? (
            <>
              <button
                onClick={() => setMessage('머리가 아프고 열이 나요')}
                className="text-xs bg-secondary-100 hover:bg-secondary-200 text-secondary-600 px-2 py-1 rounded-full transition-colors"
                disabled={isLoading || disabled}
              >
                머리가 아프고 열이 나요
              </button>
              <button
                onClick={() => setMessage('기침이 나고 목이 아파요')}
                className="text-xs bg-secondary-100 hover:bg-secondary-200 text-secondary-600 px-2 py-1 rounded-full transition-colors"
                disabled={isLoading || disabled}
              >
                기침이 나고 목이 아파요
              </button>
            </>
          ) : selectedLanguage === 'uz' ? (
            <>
              <button
                onClick={() => setMessage('Boshim og\'riyapti va isitmam bor')}
                className="text-xs bg-secondary-100 hover:bg-secondary-200 text-secondary-600 px-2 py-1 rounded-full transition-colors"
                disabled={isLoading || disabled}
              >
                Boshim og'riyapti va isitmam bor
              </button>
              <button
                onClick={() => setMessage('Yo\'talayapman va tomog\'im og\'riyapti')}
                className="text-xs bg-secondary-100 hover:bg-secondary-200 text-secondary-600 px-2 py-1 rounded-full transition-colors"
                disabled={isLoading || disabled}
              >
                Yo'talayapman va tomog'im og'riyapti
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setMessage('I have a headache and fever')}
                className="text-xs bg-secondary-100 hover:bg-secondary-200 text-secondary-600 px-2 py-1 rounded-full transition-colors"
                disabled={isLoading || disabled}
              >
                I have a headache and fever
              </button>
              <button
                onClick={() => setMessage('I\'m coughing and have a sore throat')}
                className="text-xs bg-secondary-100 hover:bg-secondary-200 text-secondary-600 px-2 py-1 rounded-full transition-colors"
                disabled={isLoading || disabled}
              >
                I'm coughing and have a sore throat
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput; 