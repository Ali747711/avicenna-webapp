import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';

const ChatInput = ({ onSendMessage, isLoading, disabled }) => {
  const { t, i18n } = useTranslation();
  const [message, setMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');

  // Update selected language when global language changes
  useEffect(() => {
    setSelectedLanguage(i18n.language || 'en');
  }, [i18n.language]);

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

  // When language changes, update the current input language
  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
    i18n.changeLanguage(langCode);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const getPlaceholder = () => {
    return t('chat.placeholder');
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

  const getSampleSymptoms = () => {
    return [
      t('chat.samples.headacheFever'),
      t('chat.samples.coughSoreThroat'),
      t('chat.samples.stomachPain'),
      t('chat.samples.dizzyTired')
    ];
  };

  return (
    <div className="relative">
      {/* Sample Symptoms Display - Hidden on Mobile */}
      {!message.trim() && (
        <div className="mb-3 md:mb-4 px-2 hidden md:block">
          <p className="text-xs text-white/30 mb-2">{t('common.tryTheseExamples')}</p>
          <div className="flex flex-wrap gap-2">
            {getSampleSymptoms().map((symptom, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setMessage(symptom)}
                className="px-3 py-1.5 bg-slate-700/40 hover:bg-slate-700/60 text-white/70 hover:text-white/90 text-xs rounded-full transition-colors border border-white/10 hover:border-white/20"
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="focus-within:border-primary-400 transition-colors">
          <div className="flex items-end space-x-3 md:space-x-4">
            {/* Text Input */}
            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={getPlaceholder()}
                className="w-full bg-transparent text-white placeholder-slate-400 resize-none focus:outline-none text-sm md:text-base leading-relaxed min-h-[32px] max-h-[200px]"
                disabled={isLoading || disabled}
                maxLength={1000}
                rows={1}
                style={{
                  height: 'auto',
                  minHeight: '32px'
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                }}
              />
              
              {/* Bottom Row: Language + Character Count */}
              <div className="flex items-center justify-between mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/10">
                <div className="flex items-center space-x-1 md:space-x-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`px-2 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors ${
                        selectedLanguage === lang.code
                          ? 'bg-primary-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="mr-1">{lang.flag}</span>
                      <span className="hidden sm:inline">{lang.shortName}</span>
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
              className={`p-3 md:p-4 rounded-full transition-all duration-200 flex items-center justify-center min-w-[44px] md:min-w-[52px] self-end ${
                !message.trim() || isLoading || disabled
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700 active:scale-95 shadow-lg'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Send className="w-5 h-5 md:w-6 md:h-6" />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput; 