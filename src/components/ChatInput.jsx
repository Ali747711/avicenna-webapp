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
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 focus-within:border-primary-500 transition-colors shadow-lg">
          <div className="flex items-end space-x-4">
            {/* Text Input */}
            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={getPlaceholder()}
                className="w-full bg-transparent text-white placeholder-slate-400 resize-none focus:outline-none text-base leading-relaxed min-h-[24px] max-h-[200px]"
                disabled={isLoading || disabled}
                maxLength={1000}
                rows={1}
                style={{
                  height: 'auto',
                  minHeight: '24px'
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                }}
              />
              
              {/* Bottom Row: Language + Character Count */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
                <div className="flex items-center space-x-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setSelectedLanguage(lang.code)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedLanguage === lang.code
                          ? 'bg-primary-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      <span className="mr-1">{lang.flag}</span>
                      {lang.shortName}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-slate-500">{message.length}/1000</span>
              </div>
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!message.trim() || isLoading || disabled}
              className={`p-3 rounded-xl transition-all duration-200 flex items-center justify-center min-w-[48px] self-end ${
                !message.trim() || isLoading || disabled
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700 active:scale-95 shadow-lg'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput; 