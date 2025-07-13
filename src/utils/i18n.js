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
      // Common UI elements
      common: {
        clear: 'Clear',
        profile: 'Profile',
        signOut: 'Sign Out',
        loading: 'Loading...',
        tryAgain: 'Try Again',
        dismiss: 'Dismiss',
        hello: 'Hello',
        save: 'Save',
        saving: 'Saving...',
        backToHome: 'Back to Home',
        clearChat: 'Clear Chat',
        aiHealthAssistant: 'AI Health Assistant',
        tryTheseExamples: 'Try these examples:',
        readyToStart: 'Ready to get started?',
        freeNoRegistration: 'Free • No registration required • Available in 3 languages',
        getStarted: 'Get Started',
        learnMore: 'Learn More',
        tryAvicenna: 'Try Avicenna'
      },
      // Home page
      home: {
        title: 'Avicenna',
        subtitle: 'Symptom Insight AI',
        description: 'Your healthcare companion for symptom analysis in English, Korean, and Uzbek. Designed specifically for foreigners living in South Korea.',
        cta: 'Start Symptom Analysis',
        howCanIHelp: 'How can I help you today?',
        describeSymptoms: 'Describe your symptoms and I\'ll provide personalized health insights in English, Korean, or Uzbek.',
        signInToSave: 'to save your conversations automatically',
        hero: {
          headline: 'Understand your symptoms with trusted AI guidance',
          understandYour: 'Understand your',
          symptoms: 'symptoms',
          withTrustedAI: 'with trusted AI guidance',
          subtitle: 'Your multilingual health companion in English, Korean, and Uzbek — designed for foreigners in South Korea.',
          multilingualCompanion: 'Your multilingual health companion in',
          english: 'English',
          korean: 'Korean',
          uzbek: 'Uzbek',
          designedFor: 'designed for foreigners in South Korea.'
        },
        whyChoose: {
          title: 'Why Choose Avicenna?',
          subtitle: 'Advanced AI technology meets multilingual healthcare support for better health decisions'
        },
        howItWorks: {
          title: 'How Avicenna Works',
          subtitle: 'Simple, secure, and intelligent healthcare guidance in three easy steps',
          step1: {
            title: 'Describe Your Symptoms',
            description: 'Tell us about your health concerns in your preferred language - English, Korean, or Uzbek.'
          },
          step2: {
            title: 'AI Analysis',
            description: 'Our advanced AI analyzes your symptoms and provides personalized health insights.'
          },
          step3: {
            title: 'Get Guidance',
            description: 'Receive clear recommendations and know when to seek professional medical care.'
          }
        },
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
        },
        ctaSection: {
          ready: 'Ready to understand your health better?',
          joinThousands: 'Join thousands of users who trust Avicenna for reliable health guidance. Start your free symptom analysis today.',
          getStarted: 'Get Started Now'
        }
      },
      // About page
      about: {
        title: 'About Avicenna',
        subtitle: 'Your Healthcare AI Companion',
        description: 'Avicenna is designed specifically for foreigners living in South Korea, providing medically-informed symptom analysis in English, Korean, and Uzbek.',
        mission: {
          title: 'Our Mission',
          description: 'Breaking down language barriers in healthcare by providing accessible, AI-powered symptom analysis for the international community in South Korea.'
        },
        values: {
          multilingual: {
            title: 'Multilingual Care',
            description: 'Healthcare guidance in English, Korean, and Uzbek to serve our diverse community.'
          },
          aiPowered: {
            title: 'AI-Powered Insights',
            description: 'Advanced artificial intelligence trained on medical knowledge to provide accurate symptom analysis.'
          },
          accessible: {
            title: 'Accessible Healthcare',
            description: 'Bridging the gap between language barriers and quality healthcare information.'
          }
        },
        disclaimer: {
          title: 'Important Medical Disclaimer',
          subtitle: 'Avicenna is an AI-powered health information tool and is NOT a substitute for professional medical advice, diagnosis, or treatment.',
          seekCare: 'Always seek professional medical care when:',
          conditions: [
            'You have severe, persistent, or worsening symptoms',
            'You experience emergency symptoms (chest pain, difficulty breathing, severe bleeding, etc.)',
            'You have chronic conditions requiring ongoing medical management',
            'You need medication prescriptions or medical procedures'
          ],
          limitations: 'Our AI provides general health information based on symptom analysis. It cannot perform physical examinations, order medical tests, or provide definitive diagnoses. Individual medical circumstances vary significantly.',
          guidance: 'For emergencies, call your local emergency number immediately. For non-urgent concerns, consult with qualified healthcare professionals in your area.'
        },
        cta: {
          title: 'Ready to get started?',
          description: 'Experience personalized health guidance in your preferred language. Start your symptom analysis with Avicenna today.',
          button: 'Start Symptom Analysis'
        },
        features: {
          multilingual: 'Multilingual Support',
          healthcare: 'Healthcare Guidance'
        }
      },
      // Chat page
      chat: {
        title: 'Symptom Analysis Chat',
        description: 'Describe your symptoms in your preferred language',
        placeholder: 'Describe your symptoms in detail...',
        send: 'Send',
        analyzing: 'Analyzing your symptoms...',
        connectionError: 'Connection Error',
        samples: {
          headacheFever: 'I have a headache and fever',
          coughSoreThroat: 'I\'m coughing with sore throat',
          stomachPain: 'Stomach pain after eating',
          dizzyTired: 'I feel dizzy and tired lately'
        }
      },
      // Auth page
      auth: {
        title: 'Welcome Back',
        joinTitle: 'Join Avicenna',
        description: 'Sign in to access your health history',
        joinDescription: 'Create your account to get started',
        email: 'Email',
        password: 'Password',
        signIn: 'Sign In',
        signUp: 'Sign Up',
        noAccount: "Don't have an account?",
        haveAccount: 'Already have an account?',
        placeholders: {
          email: 'Enter your email',
          password: 'Enter your password'
        }
      },
      // Medical History
      medicalHistory: {
        title: 'Medical History',
        symptomAnalysis: 'Symptom Analysis',
        noHistory: 'No medical history found',
        startFirst: 'Start your first symptom analysis',
        viewDetails: 'View Details',
        exportPdf: 'Export PDF'
      },
      // Urgency levels
      urgency: {
        monitor_at_home: 'Monitor at Home',
        see_doctor_soon: 'See Doctor Soon',
        emergency_care: 'Emergency Care'
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
      // Common UI elements
      common: {
        clear: '지우기',
        profile: '프로필',
        signOut: '로그아웃',
        loading: '로딩 중...',
        tryAgain: '다시 시도',
        dismiss: '닫기',
        hello: '안녕하세요',
        save: '저장',
        saving: '저장 중...',
        backToHome: '홈으로 돌아가기',
        clearChat: '채팅 지우기',
        aiHealthAssistant: 'AI 건강 도우미',
        tryTheseExamples: '이 예시들을 시도해보세요:',
        readyToStart: '시작할 준비가 되셨나요?',
        freeNoRegistration: '무료 • 회원가입 불필요 • 3개 언어 지원',
        getStarted: '시작하기',
        learnMore: '자세히 알아보기',
        tryAvicenna: '아비세나 체험하기'
      },
      // Home page
      home: {
        title: '아비세나',
        subtitle: '증상 분석 AI',
        description: '영어, 한국어, 우즈베크어로 증상 분석을 제공하는 의료 AI 동반자입니다. 한국에 거주하는 외국인을 위해 특별히 설계되었습니다.',
        cta: '증상 분석 시작하기',
        howCanIHelp: '오늘 어떤 도움이 필요하신가요?',
        describeSymptoms: '증상을 설명해주시면 영어, 한국어, 우즈베크어로 개인 맞춤형 건강 인사이트를 제공해드리겠습니다.',
        signInToSave: '로그인하여 대화를 자동으로 저장하세요',
        hero: {
          headline: '신뢰할 수 있는 AI 가이드로 증상을 이해하세요',
          understandYour: '신뢰할 수 있는 AI 가이드로',
          symptoms: '증상을',
          withTrustedAI: '이해하세요',
          subtitle: '한국에 거주하는 외국인을 위해 설계된 영어, 한국어, 우즈베크어 지원 다국어 건강 동반자입니다.',
          multilingualCompanion: '다국어 건강 동반자',
          english: '영어',
          korean: '한국어',
          uzbek: '우즈베크어',
          designedFor: '한국 거주 외국인을 위해 설계되었습니다.'
        },
        whyChoose: {
          title: '왜 아비세나를 선택해야 할까요?',
          subtitle: '더 나은 건강 결정을 위한 고급 AI 기술과 다국어 의료 지원의 만남'
        },
        howItWorks: {
          title: '아비세나 작동 방법',
          subtitle: '간단하고 안전하며 지능적인 의료 안내 3단계',
          step1: {
            title: '증상 설명하기',
            description: '영어, 한국어, 우즈베크어로 건강 상태에 대해 말씀해주세요.'
          },
          step2: {
            title: 'AI 분석',
            description: '고급 AI가 증상을 분석하고 개인 맞춤형 건강 인사이트를 제공합니다.'
          },
          step3: {
            title: '가이드 받기',
            description: '명확한 권장 사항을 받고 전문 의료 진료가 필요한 시기를 알아보세요.'
          }
        },
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
        },
        ctaSection: {
          ready: '당신의 건강을 더 잘 이해하기 위해 준비되셨나요?',
          joinThousands: '아비세나를 신뢰하는 수천 명의 사용자와 함께하세요. 오늘 무료 증상 분석을 시작하세요.',
          getStarted: '지금 시작하기'
        }
      },
      // About page
      about: {
        title: '아비세나 소개',
        subtitle: '당신의 의료 AI 동반자',
        description: '아비세나는 한국에 거주하는 외국인을 위해 특별히 설계되어 영어, 한국어, 우즈베크어로 의학적 정보에 기반한 증상 분석을 제공합니다.',
        mission: {
          title: '우리의 사명',
          description: '한국 국제 커뮤니티를 위한 접근 가능한 AI 기반 증상 분석을 제공하여 의료 서비스의 언어 장벽을 허물어 나갑니다.'
        },
        values: {
          multilingual: {
            title: '다국어 의료 서비스',
            description: '다양한 커뮤니티를 위한 영어, 한국어, 우즈베크어 의료 안내.'
          },
          aiPowered: {
            title: 'AI 기반 인사이트',
            description: '정확한 증상 분석을 제공하는 의학 지식으로 훈련된 고급 인공지능.'
          },
          accessible: {
            title: '접근 가능한 의료 서비스',
            description: '언어 장벽과 양질의 의료 정보 사이의 격차를 줄입니다.'
          }
        },
        disclaimer: {
          title: '중요한 의료 면책 조항',
          subtitle: '아비세나는 AI 기반 건강 정보 도구로서 전문 의료 조언, 진단 또는 치료를 대체하지 않습니다.',
          seekCare: '다음의 경우 반드시 전문 의료진의 진료를 받으세요:',
          conditions: [
            '심각하고 지속적이거나 악화되는 증상이 있을 때',
            '응급 증상(가슴 통증, 호흡 곤란, 심한 출혈 등)을 경험할 때',
            '지속적인 의료 관리가 필요한 만성 질환이 있을 때',
            '처방약이나 의료 시술이 필요할 때'
          ],
          limitations: '저희 AI는 증상 분석을 기반으로 한 일반적인 건강 정보를 제공합니다. 신체 검사, 의료 검사 주문, 확정적 진단은 할 수 없습니다. 개인의 의료 상황은 크게 다를 수 있습니다.',
          guidance: '응급상황 시 즉시 응급번호로 전화하세요. 응급하지 않은 경우 해당 지역의 자격을 갖춘 의료진과 상담하세요.'
        },
        cta: {
          title: '시작할 준비가 되셨나요?',
          description: '선호하는 언어로 개인 맞춤형 건강 안내를 경험해보세요. 오늘 아비세나와 함께 증상 분석을 시작하세요.',
          button: '증상 분석 시작하기'
        },
        features: {
          multilingual: '다국어 지원',
          healthcare: '의료 안내'
        }
      },
      // Chat page
      chat: {
        title: '증상 분석 채팅',
        description: '선호하는 언어로 증상을 설명해주세요',
        placeholder: '증상을 자세히 설명해주세요...',
        send: '전송',
        analyzing: '증상을 분석하는 중...',
        connectionError: '연결 오류',
        samples: {
          headacheFever: '머리가 아프고 열이 나요',
          coughSoreThroat: '기침이 나고 목이 아파요',
          stomachPain: '배가 아프고 소화가 안 돼요',
          dizzyTired: '어지럽고 요즘 피곤해요'
        }
      },
      // Auth page
      auth: {
        title: '다시 오신 것을 환영합니다',
        joinTitle: '아비세나 가입하기',
        description: '건강 기록에 액세스하려면 로그인하세요',
        joinDescription: '시작하려면 계정을 만드세요',
        email: '이메일',
        password: '비밀번호',
        signIn: '로그인',
        signUp: '가입하기',
        noAccount: '계정이 없으신가요?',
        haveAccount: '이미 계정이 있으신가요?',
        placeholders: {
          email: '이메일을 입력하세요',
          password: '비밀번호를 입력하세요'
        }
      },
      // Medical History
      medicalHistory: {
        title: '의료 기록',
        symptomAnalysis: '증상 분석',
        noHistory: '의료 기록이 없습니다',
        startFirst: '첫 번째 증상 분석을 시작하세요',
        viewDetails: '세부 정보 보기',
        exportPdf: 'PDF 내보내기'
      },
      // Urgency levels
      urgency: {
        monitor_at_home: '집에서 관찰',
        see_doctor_soon: '곧 의사 방문',
        emergency_care: '응급 치료'
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
      // Common UI elements
      common: {
        clear: 'Tozalash',
        profile: 'Profil',
        signOut: 'Chiqish',
        loading: 'Yuklanmoqda...',
        tryAgain: 'Qayta urining',
        dismiss: 'Yopish',
        hello: 'Salom',
        save: 'Saqlash',
        saving: 'Saqlanmoqda...',
        backToHome: 'Bosh sahifaga qaytish',
        clearChat: 'Suhbatni tozalash',
        aiHealthAssistant: 'AI Salomatlik Yordamchisi',
        tryTheseExamples: 'Ushbu misollarni sinab ko\'ring:',
        readyToStart: 'Boshlashga tayyormisiz?',
        freeNoRegistration: 'Bepul • Ro\'yxatdan o\'tish shart emas • 3 tilda mavjud',
        getStarted: 'Boshlash',
        learnMore: 'Batafsil ma\'lumot',
        tryAvicenna: 'Avicenna\'ni sinab ko\'ring'
      },
      // Home page
      home: {
        title: 'Avicenna',
        subtitle: 'Simptom Tahlil AI',
        description: 'Ingliz, koreys va o\'zbek tillarida simptomlarni tahlil qilish uchun tibbiy AI yordamchisi. Janubiy Koreyada yashovchi chet elliklar uchun maxsus ishlab chiqilgan.',
        cta: 'Simptom tahlilini boshlash',
        howCanIHelp: 'Bugun sizga qanday yordam bera olaman?',
        describeSymptoms: 'Simptomlaringizni tasvirlab bering va men sizga ingliz, koreys yoki o\'zbek tilida shaxsiy salomatlik ma\'lumotlarini taqdim etaman.',
        signInToSave: 'suhbatlaringizni avtomatik saqlash uchun kiring',
        hero: {
          headline: 'Ishonchli AI yo\'riqnomasi bilan simptomlaringizni tushuning',
          understandYour: 'Ishonchli AI yo\'riqnomasi bilan',
          symptoms: 'simptomlaringizni',
          withTrustedAI: 'tushuning',
          subtitle: 'Janubiy Koreyada yashovchi chet elliklar uchun mo\'ljallangan ingliz, koreys va o\'zbek tillarida ko\'p tilli salomatlik yordamchisi.',
          multilingualCompanion: 'Ko\'p tilli salomatlik yordamchisi',
          english: 'Ingliz',
          korean: 'Koreys',
          uzbek: 'O\'zbek',
          designedFor: 'Janubiy Koreyada yashovchi chet elliklar uchun mo\'ljallangan.'
        },
        whyChoose: {
          title: 'Nega Avicenna\'ni tanlash kerak?',
          subtitle: 'Yaxshi salomatlik qarorlari uchun ilg\'or AI texnologiyasi va ko\'p tilli tibbiy yordam'
        },
        howItWorks: {
          title: 'Avicenna qanday ishlaydi',
          subtitle: 'Uchta oson qadamda oddiy, xavfsiz va aqlli tibbiy yo\'riqnoma',
          step1: {
            title: 'Simptomlaringizni tasvirlab bering',
            description: 'O\'zingiz afzal ko\'rgan tilda - ingliz, koreys yoki o\'zbek tilida salomatlik muammolaringiz haqida gapirib bering.'
          },
          step2: {
            title: 'AI tahlili',
            description: 'Bizning ilg\'or AI simptomlaringizni tahlil qiladi va shaxsiy salomatlik ma\'lumotlarini taqdim etadi.'
          },
          step3: {
            title: 'Yo\'riqnoma oling',
            description: 'Aniq tavsiyalar oling va professional tibbiy yordam qachon kerakligini bilib oling.'
          }
        },
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
        },
        ctaSection: {
          ready: 'Sizning sog\'liqingizni yaxshiroq tushunishga tayyormisiz?',
          joinThousands: 'Avicenna\'ni ishonchli salomatlik yo\'riqnomasi bilan, siz bilan birga, 1000dan ortiq foydalanuvchilar bilan. Bugun sizning bepul simptom tahlilingizni boshlang.',
          getStarted: 'Endi boshlash'
        }
      },
      // About page
      about: {
        title: 'Avicenna haqida',
        subtitle: 'Sizning tibbiy AI yordamchingiz',
        description: 'Avicenna Janubiy Koreyada yashovchi chet elliklar uchun maxsus ishlab chiqilgan bo\'lib, ingliz, koreys va o\'zbek tillarida tibbiy ma\'lumotlarga asoslangan simptom tahlilini taqdim etadi.',
        mission: {
          title: 'Bizning vazifamiz',
          description: 'Janubiy Koreyada xalqaro jamiyat uchun qulay AI asosidagi simptom tahlilini taqdim etish orqali sog\'liqni saqlashda til to\'siqlarini yo\'q qilish.'
        },
        values: {
          multilingual: {
            title: 'Ko\'p tilli tibbiy xizmat',
            description: 'Turli jamiyatlarimizga xizmat ko\'rsatish uchun ingliz, koreys va o\'zbek tillarida tibbiy yo\'riqnoma.'
          },
          aiPowered: {
            title: 'AI asosidagi ma\'lumotlar',
            description: 'Aniq simptom tahlilini taqdim etish uchun tibbiy bilim bilan o\'rgatilgan ilg\'or sun\'iy aql.'
          },
          accessible: {
            title: 'Mavjud tibbiy xizmat',
            description: 'Til to\'siqlari va sifatli tibbiy ma\'lumotlar o\'rtasidagi farqni kamaytirish.'
          }
        },
        disclaimer: {
          title: 'Muhim tibbiy ogohlantirish',
          subtitle: 'Avicenna AI asosidagi salomatlik ma\'lumotlari vositasi bo\'lib, professional tibbiy maslahat, tashxis yoki davolanishni almashtirmaydi.',
          seekCare: 'Quyidagi hollarda albatta professional tibbiy yordam so\'rang:',
          conditions: [
            'Og\'ir, davomiy yoki yomonlashayotgan simptomlaringiz bo\'lsa',
            'Shoshilinch simptomlarni boshdan kechirsangiz (ko\'krak og\'rig\'i, nafas olishda qiyinchilik, kuchli qon ketishi va hokazo)',
            'Doimiy tibbiy nazorat talab qiladigan surunkali kasalliklaringiz bo\'lsa',
            'Dori retseptlari yoki tibbiy muolajalar kerak bo\'lsa'
          ],
          limitations: 'Bizning AI simptom tahlili asosida umumiy salomatlik ma\'lumotlarini taqdim etadi. U jismoniy tekshirish, tibbiy testlar buyurtma qilish yoki aniq tashxis qo\'ya olmaydi. Shaxsiy tibbiy vaziyatlar sezilarli darajada farq qiladi.',
          guidance: 'Favqulodda vaziyatlarda darhol favqulodda raqamga qo\'ng\'iroq qiling. Shoshilinch bo\'lmagan holatlar uchun hududingizdagi malakali tibbiy mutaxassislar bilan maslahatlashing.'
        },
        cta: {
          title: 'Boshlashga tayyormisiz?',
          description: 'O\'zingiz afzal ko\'rgan tilda shaxsiy salomatlik yo\'riqnomasini boshdan kechiring. Bugun Avicenna bilan simptom tahlilini boshlang.',
          button: 'Simptom tahlilini boshlash'
        },
        features: {
          multilingual: 'Ko\'p tilli qo\'llab-quvvatlash',
          healthcare: 'Tibbiy yordam'
        }
      },
      // Chat page
      chat: {
        title: 'Simptom tahlil suhbati',
        description: 'O\'zingiz afzal ko\'rgan tilda simptomlaringizni tasvirlab bering',
        placeholder: 'Simptomlaringizni batafsil tasvirlab bering...',
        send: 'Yuborish',
        analyzing: 'Simptomlaringiz tahlil qilinmoqda...',
        connectionError: 'Ulanish xatosi',
        samples: {
          headacheFever: 'Boshim og\'riyapti va isitmam bor',
          coughSoreThroat: 'Yo\'talayapman va tomog\'im og\'riyapti',
          stomachPain: 'Qornim og\'riyapti va hazm qilishda muammo',
          dizzyTired: 'Bosh aylanmoqda va charchayapman'
        }
      },
      // Auth page
      auth: {
        title: 'Xush kelibsiz',
        joinTitle: 'Avicenna\'ga qo\'shiling',
        description: 'Salomatlik tarixingizga kirish uchun tizimga kiring',
        joinDescription: 'Boshlash uchun hisobingizni yarating',
        email: 'Elektron pochta',
        password: 'Parol',
        signIn: 'Kirish',
        signUp: 'Ro\'yxatdan o\'tish',
        noAccount: 'Hisobingiz yo\'qmi?',
        haveAccount: 'Allaqachon hisobingiz bormi?',
        placeholders: {
          email: 'Elektron pochtangizni kiriting',
          password: 'Parolingizni kiriting'
        }
      },
      // Medical History
      medicalHistory: {
        title: 'Tibbiy tarix',
        symptomAnalysis: 'Simptom tahlili',
        noHistory: 'Tibbiy tarix topilmadi',
        startFirst: 'Birinchi simptom tahlilini boshlang',
        viewDetails: 'Tafsilotlarni ko\'rish',
        exportPdf: 'PDF eksport qilish'
      },
      // Urgency levels
      urgency: {
        monitor_at_home: 'Uyda kuzatish',
        see_doctor_soon: 'Tez orada shifokorga',
        emergency_care: 'Shoshilinch yordam'
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