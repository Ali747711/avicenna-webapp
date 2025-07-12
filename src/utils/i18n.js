import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation files
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        home: 'Home',
        about: 'About',
        signIn: 'Sign In',
        chat: 'Chat'
      },
      // Home page
      home: {
        title: 'Avicenna',
        subtitle: 'Symptom Insight AI',
        description: 'Your healthcare companion for symptom analysis in English, Korean, and Uzbek. Designed specifically for foreigners living in South Korea.',
        cta: 'Start Symptom Analysis',
        features: {
          multilingual: {
            title: 'Multilingual Support',
            description: 'Get help in English, Korean, or Uzbek language with natural conversation'
          },
          ai: {
            title: 'AI-Powered Analysis',
            description: 'Advanced symptom analysis with urgency assessment and clear explanations'
          },
          privacy: {
            title: 'Privacy First',
            description: 'Your health information is secure and private. Optional account creation'
          }
        }
      },
      // About page
      about: {
        title: 'About Avicenna',
        subtitle: 'Your Healthcare AI Companion',
        description: 'Avicenna is designed specifically for foreigners living in South Korea, providing medically-informed symptom analysis in English, Korean, and Uzbek.',
        features: {
          multilingual: 'Multilingual Support',
          healthcare: 'Healthcare Guidance'
        }
      },
      // Chat page
      chat: {
        title: 'Symptom Analysis Chat',
        description: 'Describe your symptoms in your preferred language',
        placeholder: 'Describe your symptoms...',
        send: 'Send',
        comingSoon: 'Chat interface will be implemented here'
      },
      // Auth page
      auth: {
        title: 'Welcome Back',
        description: 'Sign in to save your chat history (optional)',
        email: 'Email',
        password: 'Password',
        signIn: 'Sign In',
        noAccount: "Don't have an account?",
        signUp: 'Sign up',
        placeholders: {
          email: 'Enter your email',
          password: 'Enter your password'
        }
      }
    }
  },
  ko: {
    translation: {
      // Navigation
      nav: {
        home: '홈',
        about: '소개',
        signIn: '로그인',
        chat: '채팅'
      },
      // Home page
      home: {
        title: '아비세나',
        subtitle: '증상 분석 AI',
        description: '영어, 한국어, 우즈베크어로 증상 분석을 제공하는 의료 AI 동반자입니다. 한국에 거주하는 외국인을 위해 특별히 설계되었습니다.',
        cta: '증상 분석 시작하기',
        features: {
          multilingual: {
            title: '다국어 지원',
            description: '영어, 한국어, 우즈베크어로 자연스러운 대화를 통해 도움을 받으세요'
          },
          ai: {
            title: 'AI 기반 분석',
            description: '긴급도 평가와 명확한 설명이 포함된 고급 증상 분석'
          },
          privacy: {
            title: '개인정보 보호 우선',
            description: '귀하의 건강 정보는 안전하고 비공개입니다. 선택적 계정 생성'
          }
        }
      },
      // About page
      about: {
        title: '아비세나 소개',
        subtitle: '당신의 의료 AI 동반자',
        description: '아비세나는 한국에 거주하는 외국인을 위해 특별히 설계되어 영어, 한국어, 우즈베크어로 의학적 정보에 기반한 증상 분석을 제공합니다.',
        features: {
          multilingual: '다국어 지원',
          healthcare: '의료 안내'
        }
      },
      // Chat page
      chat: {
        title: '증상 분석 채팅',
        description: '선호하는 언어로 증상을 설명해주세요',
        placeholder: '증상을 설명해주세요...',
        send: '전송',
        comingSoon: '채팅 인터페이스가 곧 구현됩니다'
      },
      // Auth page
      auth: {
        title: '다시 오신 것을 환영합니다',
        description: '채팅 기록을 저장하려면 로그인하세요 (선택사항)',
        email: '이메일',
        password: '비밀번호',
        signIn: '로그인',
        noAccount: '계정이 없으신가요?',
        signUp: '가입하기',
        placeholders: {
          email: '이메일을 입력하세요',
          password: '비밀번호를 입력하세요'
        }
      }
    }
  },
  uz: {
    translation: {
      // Navigation
      nav: {
        home: 'Bosh sahifa',
        about: 'Haqida',
        signIn: 'Kirish',
        chat: 'Suhbat'
      },
      // Home page
      home: {
        title: 'Avicenna',
        subtitle: 'Simptom Tahlil AI',
        description: 'Ingliz, koreys va o\'zbek tillarida simptomlarni tahlil qilish uchun tibbiy AI yordamchisi. Janubiy Koreyada yashovchi chet elliklar uchun maxsus ishlab chiqilgan.',
        cta: 'Simptom tahlilini boshlash',
        features: {
          multilingual: {
            title: 'Ko\'p tilli qo\'llab-quvvatlash',
            description: 'Ingliz, koreys yoki o\'zbek tilida tabiiy suhbat orqali yordam oling'
          },
          ai: {
            title: 'AI asosidagi tahlil',
            description: 'Shoshilinch darajasini baholash va aniq tushuntirishlar bilan ilg\'or simptom tahlili'
          },
          privacy: {
            title: 'Maxfiylik birinchi o\'rinda',
            description: 'Sizning sog\'liq ma\'lumotlaringiz xavfsiz va maxfiy. Ixtiyoriy hisob yaratish'
          }
        }
      },
      // About page
      about: {
        title: 'Avicenna haqida',
        subtitle: 'Sizning tibbiy AI yordamchingiz',
        description: 'Avicenna Janubiy Koreyada yashovchi chet elliklar uchun maxsus ishlab chiqilgan bo\'lib, ingliz, koreys va o\'zbek tillarida tibbiy ma\'lumotlarga asoslangan simptom tahlilini taqdim etadi.',
        features: {
          multilingual: 'Ko\'p tilli qo\'llab-quvvatlash',
          healthcare: 'Tibbiy yordam'
        }
      },
      // Chat page
      chat: {
        title: 'Simptom tahlil suhbati',
        description: 'O\'zingiz afzal ko\'rgan tilda simptomlaringizni tasvirlab bering',
        placeholder: 'Simptomlaringizni tasvirlab bering...',
        send: 'Yuborish',
        comingSoon: 'Suhbat interfeysi tez orada amalga oshiriladi'
      },
      // Auth page
      auth: {
        title: 'Xush kelibsiz',
        description: 'Suhbat tarixini saqlash uchun kiring (ixtiyoriy)',
        email: 'Elektron pochta',
        password: 'Parol',
        signIn: 'Kirish',
        noAccount: 'Hisobingiz yo\'qmi?',
        signUp: 'Ro\'yxatdan o\'tish',
        placeholders: {
          email: 'Elektron pochtangizni kiriting',
          password: 'Parolingizni kiriting'
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n; 