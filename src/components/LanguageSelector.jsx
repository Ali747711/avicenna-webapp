import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ko', name: '한국어' },
    { code: 'uz', name: 'O\'zbek' }
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 text-white/90 hover:text-white font-medium nav-button px-3 py-2 rounded-full">
        <Globe className="w-5 h-5" />
        <span className="text-sm font-medium">
          {languages.find(lang => lang.code === i18n.language)?.name || 'English'}
        </span>
      </button>
      
      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-36 bg-slate-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
        <div className="py-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                i18n.language === lang.code
                  ? 'bg-white/20 text-white font-medium'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector; 