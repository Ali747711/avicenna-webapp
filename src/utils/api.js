// API service for symptom analysis
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'https://avicenna-webapp.vercel.app/api';

export const analyzeSymptoms = async (symptoms, language = 'en') => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze-symptoms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symptoms,
        language,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      // Handle service overload with fallback data
      if (response.status === 503 && errorData?.fallback) {
        console.warn('Service temporarily unavailable, using fallback response');
        return errorData.fallback;
      }
      
      const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to analyze symptoms');
    }

    return data.data;
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw error;
  }
};

// Helper function to get urgency level styling
export const getUrgencyStyle = (urgency) => {
  switch (urgency) {
    case 'monitor_at_home':
      return 'urgency-low';
    case 'see_doctor_soon':
      return 'urgency-medium';
    case 'emergency_care':
      return 'urgency-high';
    default:
      return 'urgency-medium';
  }
};

// Helper function to get urgency level text
export const getUrgencyText = (urgency, language = 'en') => {
  const translations = {
    en: {
      monitor_at_home: 'Monitor at Home',
      see_doctor_soon: 'See Doctor Soon',
      emergency_care: 'Emergency Care'
    },
    ko: {
      monitor_at_home: '집에서 관찰',
      see_doctor_soon: '곧 의사 방문',
      emergency_care: '응급 치료'
    },
    uz: {
      monitor_at_home: 'Uyda kuzatish',
      see_doctor_soon: 'Tez orada shifokorga',
      emergency_care: 'Shoshilinch yordam'
    }
  };

  return translations[language]?.[urgency] || translations.en[urgency];
}; 