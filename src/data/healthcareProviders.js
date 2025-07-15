// Healthcare Providers Database - Busan, South Korea
// This contains sample data for Busan healthcare providers
// In a real application, this would be connected to a real healthcare provider API

export const healthcareProviders = {
  // Emergency Care
  emergency: [
    {
      id: 'er-001',
      name: '부산대학교병원 응급실',
      englishName: 'Pusan National University Hospital Emergency Room',
      type: 'Emergency Room',
      specialties: ['Emergency Medicine', 'Trauma Care', 'Critical Care'],
      address: '부산광역시 양산시 물금읍 물금로 20',
      englishAddress: '20 Mulgeum-ro, Mulgeum-eup, Yangsan-si, Busan',
      phone: '+82-51-510-8000',
      hours: '24/7',
      waitTime: '15-30 minutes',
      insurance: ['국민건강보험', '의료급여', 'Private Insurance'],
      languages: ['한국어', 'English'],
      rating: 4.5,
      distance: '2.3 km'
    },
    {
      id: 'er-002',
      name: '부산의료원 응급실',
      englishName: 'Busan Medical Center Emergency Room',
      type: 'Emergency Room',
      specialties: ['Emergency Medicine', 'Pediatric Emergency'],
      address: '부산광역시 동구 중앙대로 196',
      englishAddress: '196 Jungang-daero, Dong-gu, Busan',
      phone: '+82-51-440-8000',
      hours: '24/7',
      waitTime: '20-45 minutes',
      insurance: ['국민건강보험', '의료급여'],
      languages: ['한국어', 'English'],
      rating: 4.2,
      distance: '3.1 km'
    },
    {
      id: 'er-003',
      name: '동아대학교병원 응급실',
      englishName: 'Dong-A University Hospital Emergency Room',
      type: 'Emergency Room',
      specialties: ['Emergency Medicine', 'Cardiac Emergency'],
      address: '부산광역시 서구 동대신동3가 1-3',
      englishAddress: '1-3 Dongdaesin-dong 3-ga, Seo-gu, Busan',
      phone: '+82-51-240-5000',
      hours: '24/7',
      waitTime: '25-40 minutes',
      insurance: ['국민건강보험', 'Private Insurance'],
      languages: ['한국어', 'English'],
      rating: 4.3,
      distance: '4.2 km'
    }
  ],

  // Primary Care
  primaryCare: [
    {
      id: 'pc-001',
      name: '김영수 가정의학과',
      englishName: 'Dr. Kim Young-soo - Family Medicine',
      type: 'Primary Care Physician',
      specialties: ['가정의학과', '예방의학', '만성질환 관리'],
      address: '부산광역시 해운대구 우동 1438-1',
      englishAddress: '1438-1 U-dong, Haeundae-gu, Busan',
      phone: '+82-51-747-1234',
      hours: '월-금 9AM-6PM',
      availability: '다음 예약: 내일',
      insurance: ['국민건강보험', '의료급여'],
      languages: ['한국어', 'English'],
      rating: 4.6,
      distance: '1.8 km',
      education: '의학박사 - 부산대학교 의과대학',
      experience: '15년'
    },
    {
      id: 'pc-002',
      name: '이미영 내과',
      englishName: 'Dr. Lee Mi-young - Internal Medicine',
      type: 'Primary Care Physician',
      specialties: ['내과', '노인의학', '당뇨병 관리'],
      address: '부산광역시 부산진구 부전동 223-15',
      englishAddress: '223-15 Bujeon-dong, Busanjin-gu, Busan',
      phone: '+82-51-806-5678',
      hours: '월-금 8AM-5PM',
      availability: '다음 예약: 이번 주',
      insurance: ['국민건강보험', '의료급여'],
      languages: ['한국어', 'English'],
      rating: 4.4,
      distance: '2.7 km',
      education: '의학박사 - 경북대학교 의과대학',
      experience: '12년'
    }
  ],

  // Cardiology
  cardiology: [
    {
      id: 'card-001',
      name: '박준호 심장내과',
      englishName: 'Dr. Park Jun-ho - Cardiologist',
      type: 'Cardiologist',
      specialties: ['심장내과', '중재적 심장학', '심부전'],
      address: '부산광역시 수영구 광안동 192-1',
      englishAddress: '192-1 Gwangan-dong, Suyeong-gu, Busan',
      phone: '+82-51-756-2345',
      hours: '월-금 9AM-5PM',
      availability: '다음 예약: 다음 주',
      insurance: ['국민건강보험', 'Private Insurance'],
      languages: ['한국어', 'English'],
      rating: 4.7,
      distance: '4.2 km',
      education: '의학박사 - 서울대학교 의과대학',
      experience: '20년'
    },
    {
      id: 'card-002',
      name: '최수진 소아심장과',
      englishName: 'Dr. Choi Su-jin - Pediatric Cardiologist',
      type: 'Pediatric Cardiologist',
      specialties: ['소아심장과', '선천성 심장질환'],
      address: '부산광역시 동래구 온천동 1-1',
      englishAddress: '1-1 Oncheon-dong, Dongnae-gu, Busan',
      phone: '+82-51-555-6789',
      hours: '월-금 9AM-5PM',
      availability: '다음 예약: 이번 주',
      insurance: ['국민건강보험', '의료급여'],
      languages: ['한국어', 'English'],
      rating: 4.6,
      distance: '3.8 km',
      education: '의학박사 - 연세대학교 의과대학',
      experience: '18년'
    }
  ],

  // Neurology
  neurology: [
    {
      id: 'neuro-001',
      name: '정민수 신경과',
      englishName: 'Dr. Jung Min-su - Neurologist',
      type: 'Neurologist',
      specialties: ['신경과', '뇌졸중 치료', '간질', '두통'],
      address: '부산광역시 남구 대연동 1-1',
      englishAddress: '1-1 Daeyeon-dong, Nam-gu, Busan',
      phone: '+82-51-626-3456',
      hours: '월-금 9AM-5PM',
      availability: '다음 예약: 다음 주',
      insurance: ['국민건강보험', 'Private Insurance'],
      languages: ['한국어', 'English'],
      rating: 4.4,
      distance: '4.5 km',
      education: '의학박사 - 고려대학교 의과대학',
      experience: '16년'
    }
  ],

  // Gastroenterology
  gastroenterology: [
    {
      id: 'gastro-001',
      name: '한지영 소화기내과',
      englishName: 'Dr. Han Ji-young - Gastroenterologist',
      type: 'Gastroenterologist',
      specialties: ['소화기내과', '내시경', '염증성 장질환'],
      address: '부산광역시 금정구 구서동 1-1',
      englishAddress: '1-1 Guseo-dong, Geumjeong-gu, Busan',
      phone: '+82-51-580-4567',
      hours: '월-금 9AM-5PM',
      availability: '다음 예약: 다음 주',
      insurance: ['국민건강보험', 'Private Insurance'],
      languages: ['한국어', 'English'],
      rating: 4.3,
      distance: '4.1 km',
      education: '의학박사 - 전남대학교 의과대학',
      experience: '14년'
    }
  ],

  // Orthopedics
  orthopedics: [
    {
      id: 'ortho-001',
      name: '김태현 정형외과',
      englishName: 'Dr. Kim Tae-hyun - Orthopedic Surgeon',
      type: 'Orthopedic Surgeon',
      specialties: ['정형외과', '스포츠의학', '관절치환술'],
      address: '부산광역시 사하구 하단동 1-1',
      englishAddress: '1-1 Hadan-dong, Saha-gu, Busan',
      phone: '+82-51-200-5678',
      hours: '월-금 9AM-5PM',
      availability: '다음 예약: 다음 주',
      insurance: ['국민건강보험', 'Private Insurance'],
      languages: ['한국어', 'English'],
      rating: 4.5,
      distance: '4.3 km',
      education: '의학박사 - 부산대학교 의과대학',
      experience: '17년'
    }
  ],

  // Pediatrics
  pediatrics: [
    {
      id: 'ped-001',
      name: '이소영 소아과',
      englishName: 'Dr. Lee So-young - Pediatrician',
      type: 'Pediatrician',
      specialties: ['소아과', '아동발달', '예방접종'],
      address: '부산광역시 연제구 연산동 1-1',
      englishAddress: '1-1 Yeonsan-dong, Yeonje-gu, Busan',
      phone: '+82-51-860-6789',
      hours: '월-금 9AM-6PM',
      availability: '다음 예약: 내일',
      insurance: ['국민건강보험', '의료급여'],
      languages: ['한국어', 'English'],
      rating: 4.6,
      distance: '3.9 km',
      education: '의학박사 - 부산대학교 의과대학',
      experience: '13년'
    }
  ],

  // Dermatology
  dermatology: [
    {
      id: 'derm-001',
      name: '박지은 피부과',
      englishName: 'Dr. Park Ji-eun - Dermatologist',
      type: 'Dermatologist',
      specialties: ['피부과', '피부암 검진', '미용피부과'],
      address: '부산광역시 강서구 명지동 1-1',
      englishAddress: '1-1 Myeongji-dong, Gangseo-gu, Busan',
      phone: '+82-51-831-7890',
      hours: '월-금 9AM-6PM',
      availability: '다음 예약: 다음 주',
      insurance: ['국민건강보험', 'Private Insurance'],
      languages: ['한국어', 'English'],
      rating: 4.4,
      distance: '4.0 km',
      education: '의학박사 - 경희대학교 의과대학',
      experience: '15년'
    }
  ],

  // Psychiatry
  psychiatry: [
    {
      id: 'psych-001',
      name: '최동현 정신건강의학과',
      englishName: 'Dr. Choi Dong-hyun - Psychiatrist',
      type: 'Psychiatrist',
      specialties: ['정신건강의학과', '우울증', '불안증', 'ADHD'],
      address: '부산광역시 북구 구포동 1-1',
      englishAddress: '1-1 Gupo-dong, Buk-gu, Busan',
      phone: '+82-51-330-8901',
      hours: '월-금 9AM-6PM',
      availability: '다음 예약: 이번 주',
      insurance: ['국민건강보험', '의료급여'],
      languages: ['한국어', 'English'],
      rating: 4.3,
      distance: '3.5 km',
      education: '의학박사 - 부산대학교 의과대학',
      experience: '19년'
    }
  ],

  // Urgent Care
  urgentCare: [
    {
      id: 'uc-001',
      name: '부산종합병원 응급실',
      englishName: 'Busan General Hospital Urgent Care',
      type: 'Urgent Care',
      specialties: ['응급의료', '경미한 외상', '질병 치료'],
      address: '부산광역시 중구 중앙동 1-1',
      englishAddress: '1-1 Jungang-dong, Jung-gu, Busan',
      phone: '+82-51-245-1234',
      hours: '월-일 8AM-10PM',
      waitTime: '15-30 minutes',
      insurance: ['국민건강보험', '의료급여'],
      languages: ['한국어', 'English'],
      rating: 4.1,
      distance: '2.1 km'
    },
    {
      id: 'uc-002',
      name: '해운대의원 응급실',
      englishName: 'Haeundae Medical Center Urgent Care',
      type: 'Urgent Care',
      specialties: ['응급의료', 'X-ray 검사', '검사실'],
      address: '부산광역시 해운대구 중동 1-1',
      englishAddress: '1-1 Jung-dong, Haeundae-gu, Busan',
      phone: '+82-51-747-5678',
      hours: '월-일 8AM-8PM',
      waitTime: '20-40 minutes',
      insurance: ['국민건강보험', '의료급여'],
      languages: ['한국어', 'English'],
      rating: 4.0,
      distance: '2.8 km'
    }
  ]
};

// Specialist mapping based on conditions and symptoms
export const specialistMapping = {
  // Emergency conditions
  emergency: [
    'chest pain', 'shortness of breath', 'severe bleeding', 'head injury',
    'stroke symptoms', 'heart attack', 'severe allergic reaction',
    'unconsciousness', 'seizure', 'severe trauma',
    '가슴 통증', '호흡곤란', '심한 출혈', '머리 부상',
    '뇌졸중 증상', '심장마비', '심한 알레르기 반응',
    '의식 상실', '경련', '심한 외상'
  ],

  // Cardiology
  cardiology: [
    'chest pain', 'heart palpitations', 'irregular heartbeat', 'shortness of breath',
    'heart disease', 'hypertension', 'high blood pressure', 'heart failure',
    'arrhythmia', 'angina',
    '가슴 통증', '심계항진', '불규칙한 심박', '호흡곤란',
    '심장병', '고혈압', '혈압 상승', '심부전',
    '부정맥', '협심증', '심장', '혈압'
  ],

  // Neurology
  neurology: [
    'headache', 'migraine', 'seizures', 'numbness', 'tingling', 'weakness',
    'memory problems', 'dizziness', 'balance problems', 'stroke symptoms',
    'tremors', 'parkinson', 'alzheimer',
    '두통', '편두통', '경련', '마비', '저림', '약함',
    '기억력 문제', '어지럼증', '균형 문제', '뇌졸중 증상',
    '떨림', '파킨슨', '알츠하이머', '신경', '뇌'
  ],

  // Gastroenterology
  gastroenterology: [
    'stomach pain', 'abdominal pain', 'nausea', 'vomiting', 'diarrhea',
    'constipation', 'acid reflux', 'heartburn', 'bloating', 'gas',
    'blood in stool', 'irritable bowel', 'ulcer',
    '복통', '배 통증', '메스꺼움', '구토', '설사',
    '변비', '위산 역류', '속쓰림', '복부 팽만', '가스',
    '대변에 피', '과민성 장', '궤양', '소화', '위'
  ],

  // Orthopedics
  orthopedics: [
    'joint pain', 'back pain', 'neck pain', 'knee pain', 'shoulder pain',
    'fracture', 'sprain', 'strain', 'arthritis', 'sports injury',
    'bone pain', 'muscle pain',
    '관절 통증', '허리 통증', '목 통증', '무릎 통증', '어깨 통증',
    '골절', '염좌', '근육 긴장', '관절염', '스포츠 상해',
    '뼈 통증', '근육 통증', '정형외과', '관절'
  ],

  // Dermatology
  dermatology: [
    'skin rash', 'acne', 'mole changes', 'skin lesions', 'itching',
    'skin infection', 'psoriasis', 'eczema', 'hives', 'skin cancer',
    'hair loss', 'nail problems',
    '피부 발진', '여드름', '점 변화', '피부 병변', '가려움',
    '피부 감염', '건선', '습진', '두드러기', '피부암',
    '탈모', '손톱 문제', '피부', '발진'
  ],

  // Psychiatry
  psychiatry: [
    'depression', 'anxiety', 'panic attacks', 'mood changes', 'insomnia',
    'stress', 'adhd', 'bipolar', 'schizophrenia', 'eating disorders',
    'substance abuse', 'suicidal thoughts',
    '우울증', '불안증', '공황 발작', '기분 변화', '불면증',
    '스트레스', '주의력 결핍', '조울증', '정신분열증', '섭식 장애',
    '약물 남용', '자살 생각', '정신', '우울', '불안'
  ],

  // Pediatrics
  pediatrics: [
    'child fever', 'child cough', 'child rash', 'child vomiting',
    'child diarrhea', 'child development', 'vaccinations', 'child behavior',
    '아이 열', '아이 기침', '아이 발진', '아이 구토',
    '아이 설사', '아동 발달', '예방접종', '아이 행동',
    '소아', '아동', '아기', '아이'
  ]
};

// Function to get recommended specialists based on symptoms and conditions
export const getRecommendedProviders = (symptoms, conditions = [], urgency = 'see_doctor_soon') => {
  const recommendations = {
    emergency: [],
    specialists: [],
    primaryCare: [],
    urgentCare: []
  };

  // Convert to lowercase for matching
  const symptomsLower = symptoms.toLowerCase();
  const conditionsLower = conditions.map(c => c.toLowerCase());

  // Check for emergency conditions first
  const hasEmergencySymptoms = specialistMapping.emergency.some(symptom => 
    symptomsLower.includes(symptom) || conditionsLower.some(c => c.includes(symptom))
  );

  if (hasEmergencySymptoms || urgency === 'emergency_care') {
    recommendations.emergency = healthcareProviders.emergency;
    return recommendations;
  }

  // Match specialists based on symptoms and conditions
  const matchedSpecialties = [];

  Object.entries(specialistMapping).forEach(([specialty, keywords]) => {
    if (specialty === 'emergency') return; // Skip emergency, already handled

    const hasMatchingSymptoms = keywords.some(keyword => 
      symptomsLower.includes(keyword) || conditionsLower.some(c => c.includes(keyword))
    );

    if (hasMatchingSymptoms) {
      matchedSpecialties.push(specialty);
    }
  });

  // Add matched specialists
  matchedSpecialties.forEach(specialty => {
    if (healthcareProviders[specialty]) {
      recommendations.specialists.push(...healthcareProviders[specialty]);
    }
  });

  // Add primary care if no specialists matched or for general concerns
  if (matchedSpecialties.length === 0 || urgency === 'monitor_at_home') {
    recommendations.primaryCare = healthcareProviders.primaryCare;
  }

  // Add urgent care for moderate urgency
  if (urgency === 'see_doctor_soon') {
    recommendations.urgentCare = healthcareProviders.urgentCare;
  }

  return recommendations;
};

// Function to get provider details by ID
export const getProviderById = (id) => {
  for (const category of Object.values(healthcareProviders)) {
    const provider = category.find(p => p.id === id);
    if (provider) return provider;
  }
  return null;
};

// Function to get providers by specialty
export const getProvidersBySpecialty = (specialty) => {
  return healthcareProviders[specialty] || [];
}; 