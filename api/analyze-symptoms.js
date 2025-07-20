export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { symptoms, language = 'en' } = req.body;

    console.log('Received request:', { symptoms, language });

    if (!symptoms || symptoms.trim().length === 0) {
      return res.status(400).json({ error: 'Symptoms are required' });
    }

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return res.status(500).json({ error: 'API configuration error' });
    }

    // Get language-specific instructions
    const getLanguageInstructions = (lang) => {
      switch(lang) {
        case 'ko':
          return {
            intro: "당신은 증상 분석을 위해 설계된 고급 의료 AI 어시스턴트인 아비센나입니다. 포괄적인 의학 지식을 보유하고 있으며 증거 기반 임상 추론 프로토콜을 따릅니다.",
            languageNote: "중요: 환자가 한국어로 증상을 설명했습니다. 한국어 입력을 이해하고 모든 응답을 한국어로 제공해야 합니다. 한국어를 이해할 수 없더라도 한국어로 응답하세요."
          };
        case 'uz':
          return {
            intro: "Siz simptomlarni tahlil qilish uchun mo'ljallangan ilg'or tibbiy AI yordamchisi Avicennasiz. Keng qamrovli tibbiy bilimga egasiz va dalillarga asoslangan klinik mulohaza protokollariga amal qilasiz.",
            languageNote: "Muhim: Bemor o'zbek tilida simptomlarini tasvirlagan. O'zbek tilini tushunishingiz va barcha javoblarni o'zbek tilida berishingiz kerak. O'zbek tilini tushunmasangiz ham, o'zbek tilida javob bering."
          };
        default:
          return {
            intro: "You are Avicenna, an advanced medical AI assistant designed for symptom analysis. You possess comprehensive medical knowledge and follow evidence-based clinical reasoning protocols.",
            languageNote: "Important: The patient has described symptoms in English. Provide all responses in English."
          };
      }
    };

    const langInstructions = getLanguageInstructions(language);

    console.log('Language instructions:', langInstructions);

    // Advanced Medical AI Prompt with Clinical Reasoning
    const prompt = `${langInstructions.intro}

${langInstructions.languageNote}

PATIENT PRESENTATION: "${symptoms}"

CLINICAL ANALYSIS FRAMEWORK:
1. Perform systematic symptom analysis using differential diagnosis approach
2. Consider common conditions first, but don't ignore serious possibilities
3. Assess urgency based on established medical criteria
4. Provide evidence-based recommendations
5. Use appropriate medical terminology with clear explanations

RESPONSE REQUIREMENTS:
- Be thorough but concise
- Consider patient safety as top priority
- Include red flag symptoms assessment
- Provide actionable guidance
- Explain medical reasoning

Respond with this exact JSON structure:
{
  "primaryAnalysis": {
    "presentingSymptoms": ["list of key symptoms identified"],
    "clinicalImpression": "Professional assessment of symptom pattern"
  },
  "differentialDiagnosis": [
    {
      "condition": "Condition Name",
      "likelihood": "high|moderate|low",
      "explanation": "Clinical reasoning and symptom correlation",
      "keyFeatures": ["Supporting symptoms/signs"]
    }
  ],
  "urgencyAssessment": {
    "level": "monitor_at_home|see_doctor_soon|emergency_care",
    "reasoning": "Clinical justification for urgency level",
    "redFlags": ["Warning signs to watch for"],
    "timeframe": "When to seek care (e.g., 'within 24 hours', 'if worsening')"
  },
  "recommendations": {
    "immediate": ["Actions to take now"],
    "monitoring": ["Signs and symptoms to watch"],
    "lifestyle": ["Self-care measures"],
    "followUp": ["When and why to seek medical care"]
  },
  "specialistReferral": {
    "recommended": true/false,
    "specialty": "Type of specialist if needed",
    "reasoning": "Why this specialist is recommended",
    "specificConditions": ["Specific conditions this specialist treats"],
    "whenToSee": "When to schedule appointment (e.g., 'within 1 week', 'as soon as possible')"
  },
  "educationalContent": {
    "overview": "Brief explanation of most likely condition",
    "whatToExpect": "Natural course and expected timeline",
    "prevention": "How to prevent similar issues"
  },
  "disclaimer": "This AI analysis is for informational purposes only and does not replace professional medical diagnosis or treatment. Seek immediate medical attention for severe symptoms or if condition worsens."
}

CRITICAL INSTRUCTIONS:
- Return only valid JSON. No additional text or formatting.
- ALL text in the JSON response MUST be in the same language as specified above.
- If you cannot understand the symptoms, still respond in the correct language.`;

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    // Try different free Gemini models in order of preference
    const models = [
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash',
      'gemini-1.5-flash-8b'  // Smaller, faster model
    ];
    
    let response;
    let lastError;
    
    for (const model of models) {
      try {
        console.log(`Making request to Gemini API with model: ${model}...`);
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.3,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2000,
            }
          }),
          signal: controller.signal
        });

        if (response.ok) {
          console.log(`Successfully got response from ${model}`);
          break;
        } else {
          const errorText = await response.text();
          lastError = `${model} error: ${response.status} - ${errorText}`;
          console.warn(lastError);
          
          // If the model is overloaded (503), try the next model
          if (response.status === 503) {
            continue;
          } else {
            // For other errors, throw immediately
            throw new Error(lastError);
          }
        }
      } catch (error) {
        lastError = `${model} failed: ${error.message}`;
        console.warn(lastError);
        if (error.name === 'AbortError') {
          throw error; // Don't retry on timeout
        }
        continue;
      }
    }
    
    if (!response || !response.ok) {
      throw new Error(lastError || 'All Gemini models failed');
    }

    clearTimeout(timeoutId);

    console.log('Gemini API response received, parsing...');
    const data = await response.json();
    console.log('Gemini API data:', JSON.stringify(data, null, 2));
    
    const aiResponse = data.candidates[0]?.content?.parts[0]?.text;
    console.log('AI Response text:', aiResponse);

    if (!aiResponse) {
      throw new Error('No response from Gemini');
    }

    // Try to parse JSON response
    let parsedResponse;
    try {
      // First, try parsing directly
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      console.log('Direct JSON parsing failed, trying to extract from markdown...');
      
      // Try to extract JSON from markdown code blocks
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          console.log('Found JSON in markdown, parsing...');
          let jsonText = jsonMatch[1].trim();
          
          // Try to fix incomplete JSON by adding missing closing braces
          if (!jsonText.endsWith('}')) {
            console.log('JSON appears incomplete, attempting to fix...');
            const openBraces = (jsonText.match(/\{/g) || []).length;
            const closeBraces = (jsonText.match(/\}/g) || []).length;
            const missingBraces = openBraces - closeBraces;
            
            // Add missing closing quotes and braces
            if (jsonText.endsWith('"')) {
              // Already ends with quote, just add braces
            } else if (jsonText.match(/[^"}]$/)) {
              // Doesn't end with quote or brace, add quote first
              jsonText += '"';
            }
            
            // Add missing closing braces
            for (let i = 0; i < missingBraces; i++) {
              jsonText += '}';
            }
          }
          
          parsedResponse = JSON.parse(jsonText);
        } catch (extractError) {
          console.log('Failed to parse extracted JSON:', extractError);
          parsedResponse = null;
        }
      }
      
      // If still no valid JSON, try to find any JSON-like content
      if (!parsedResponse) {
        const jsonPattern = /\{[\s\S]*\}/;
        const jsonContentMatch = aiResponse.match(jsonPattern);
        if (jsonContentMatch) {
          try {
            console.log('Found JSON-like content, parsing...');
            parsedResponse = JSON.parse(jsonContentMatch[0]);
          } catch (contentError) {
            console.log('Failed to parse JSON-like content:', contentError);
            parsedResponse = null;
          }
        }
      }
      
      // If all parsing attempts fail, create a structured response
      if (!parsedResponse) {
        console.log('All JSON parsing attempts failed, using fallback structure');
        
        const fallbackMessages = {
          en: {
            impression: "AI analysis indicates the need for professional medical evaluation",
            condition: "Medical Evaluation Needed",
            explanation: "Based on the symptoms described, professional medical assessment is recommended",
            features: ["Patient-reported symptoms require clinical evaluation"],
            urgencyReason: "Symptoms require professional medical evaluation for proper diagnosis",
            redFlags: ["Worsening symptoms", "New concerning symptoms"],
            timeframe: "within 24-48 hours or sooner if symptoms worsen",
            immediate: ["Monitor symptoms closely"],
            monitoring: ["Watch for worsening or new symptoms"],
            lifestyle: ["Rest and maintain good hydration"],
            followUp: ["Schedule appointment with healthcare provider"],
            specialty: "General Practitioner",
            specialtyReason: "Start with primary care evaluation",
            specialtyConditions: ["General health concerns"],
            whenToSeeSpecialist: "within 1 week",
            eduOverview: "Professional medical evaluation is recommended for proper symptom assessment",
            eduExpect: "Healthcare provider will perform thorough evaluation",
            eduPrevention: "Follow medical advice for prevention",
            disclaimer: "This AI analysis is for informational purposes only and does not replace professional medical diagnosis or treatment. Seek immediate medical attention for severe symptoms or if condition worsens."
          },
          ko: {
            impression: "AI 분석 결과 전문적인 의학적 평가가 필요함을 시사합니다",
            condition: "의학적 평가 필요",
            explanation: "제시된 증상을 바탕으로 전문적인 의학적 평가가 권장됩니다",
            features: ["환자가 보고한 증상은 임상적 평가가 필요합니다"],
            urgencyReason: "정확한 진단을 위해 증상에 대한 전문적인 의학적 평가가 필요합니다",
            redFlags: ["증상 악화", "새로운 우려되는 증상"],
            timeframe: "24-48시간 이내 또는 증상이 악화될 경우 더 빨리",
            immediate: ["증상을 면밀히 관찰하십시오"],
            monitoring: ["증상 악화 또는 새로운 증상에 주의하십시오"],
            lifestyle: ["충분한 휴식과 수분 섭취를 유지하십시오"],
            followUp: ["의료 서비스 제공자와 진료 예약을 하십시오"],
            specialty: "일반의",
            specialtyReason: "1차 진료 평가부터 시작하십시오",
            specialtyConditions: ["일반 건강 문제"],
            whenToSeeSpecialist: "1주일 이내",
            eduOverview: "정확한 증상 평가를 위해 전문적인 의학적 평가가 권장됩니다",
            eduExpect: "의료 서비스 제공자가 철저한 평가를 수행할 것입니다",
            eduPrevention: "예방을 위해 의학적 조언을 따르십시오",
            disclaimer: "이 AI 분석은 정보 제공 목적으로만 제공되며 전문적인 의학적 진단이나 치료를 대체하지 않습니다. 심각한 증상이 있거나 상태가 악화될 경우 즉시 의료 지원을 받으십시오."
          },
          uz: {
            impression: "AI tahlili professional tibbiy baholash zarurligini ko'rsatadi",
            condition: "Tibbiy baholash talab etiladi",
            explanation: "Taqdim etilgan alomatlarga asoslanib, professional tibbiy baholash tavsiya etiladi",
            features: ["Bemor tomonidan bildirilgan alomatlar klinik baholashni talab qiladi"],
            urgencyReason: "To'g'ri tashxis qo'yish uchun alomatlar professional tibbiy baholashni talab qiladi",
            redFlags: ["Alomatlarning yomonlashishi", "Yangi tashvishli alomatlar"],
            timeframe: "24-48 soat ichida yoki alomatlar yomonlashsa, undan ham ertaroq",
            immediate: ["Alomatlarni diqqat bilan kuzatib boring"],
            monitoring: ["Alomatlarning yomonlashishi yoki yangi alomatlarga e'tibor bering"],
            lifestyle: ["Dam oling va yetarli suyuqlik iching"],
            followUp: ["Tibbiy yordam ko'rsatuvchi bilan uchrashuv belgilang"],
            specialty: "Umumiy amaliyot shifokori",
            specialtyReason: "Birlamchi tibbiy yordam baholashidan boshlang",
            specialtyConditions: ["Umumiy sog'liq muammolari"],
            whenToSeeSpecialist: "1 hafta ichida",
            eduOverview: "To'g'ri alomatlarni baholash uchun professional tibbiy ko'rikdan o'tish tavsiya etiladi",
            eduExpect: "Tibbiy yordam ko'rsatuvchi provayder to'liq baholashni amalga oshiradi",
            eduPrevention: "Oldini olish uchun tibbiy maslahatlarga rioya qiling",
            disclaimer: "Ushbu AI tahlili faqat ma'lumot berish uchun mo'ljallangan va professional tibbiy diagnostika yoki davolanishni o'rnini bosmaydi. Qattiq alomatlar yoki ahvol yomonlashgan taqdirda darhol tibbiy yordamga murojaat qiling."
          }
        };

        const fb = fallbackMessages[language] || fallbackMessages.en;
        
        parsedResponse = {
          primaryAnalysis: {
            presentingSymptoms: ["Symptom analysis requested"],
            clinicalImpression: fb.impression
          },
          differentialDiagnosis: [
            {
              condition: fb.condition,
              likelihood: "high",
              explanation: fb.explanation,
              keyFeatures: fb.features
            }
          ],
          urgencyAssessment: {
            level: "see_doctor_soon",
            reasoning: fb.urgencyReason,
            redFlags: fb.redFlags,
            timeframe: fb.timeframe
          },
          recommendations: {
            immediate: [fb.immediate],
            monitoring: [fb.monitoring],
            lifestyle: [fb.lifestyle],
            followUp: [fb.followUp]
          },
          specialistReferral: {
            recommended: false,
            specialty: fb.specialty,
            reasoning: fb.specialtyReason,
            specificConditions: fb.specialtyConditions,
            whenToSee: fb.whenToSeeSpecialist
          },
          educationalContent: {
            overview: fb.eduOverview,
            whatToExpect: fb.eduExpect,
            prevention: fb.eduPrevention
          },
          disclaimer: fb.disclaimer
        };
      }
    }

    // Validate response structure
    if (!parsedResponse.primaryAnalysis || !parsedResponse.urgencyAssessment || !parsedResponse.disclaimer) {
      console.log('Response structure validation failed, applying corrections');
      parsedResponse = {
        primaryAnalysis: parsedResponse.primaryAnalysis || {
          presentingSymptoms: ["Symptoms requiring evaluation"],
          clinicalImpression: "Medical assessment recommended"
        },
        differentialDiagnosis: parsedResponse.differentialDiagnosis || [{
          condition: "General Health Concern",
          likelihood: "moderate",
          explanation: "Based on your symptoms, it's recommended to consult with a healthcare professional",
          keyFeatures: ["Patient-reported symptoms"]
        }],
        urgencyAssessment: parsedResponse.urgencyAssessment || {
          level: "see_doctor_soon",
          reasoning: "Symptoms warrant professional medical evaluation",
          redFlags: ["Worsening symptoms"],
          timeframe: "within 24-48 hours"
        },
        recommendations: parsedResponse.recommendations || {
          immediate: ["Monitor symptoms"],
          monitoring: ["Watch for changes"],
          lifestyle: ["Rest and hydration"],
          followUp: ["Consult healthcare professional"]
        },
        specialistReferral: parsedResponse.specialistReferral || {
          recommended: false,
          specialty: "General Practitioner",
          reasoning: "Primary care evaluation recommended",
          specificConditions: ["General health concerns"],
          whenToSee: "within 1 week"
        },
        educationalContent: parsedResponse.educationalContent || {
          overview: "Professional medical evaluation recommended",
          whatToExpected: "Healthcare provider will assess symptoms",
          prevention: "Regular health monitoring"
        },
        disclaimer: "This AI analysis is for informational purposes only and does not replace professional medical diagnosis or treatment. Seek immediate medical attention for severe symptoms or if condition worsens."
      };
    }

    return res.status(200).json({
      success: true,
      data: parsedResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in analyze-symptoms:', error);
    
    // Handle timeout errors
    if (error.name === 'AbortError') {
      return res.status(504).json({
        success: false,
        error: 'Request timeout',
        message: 'The AI analysis took too long to complete. Please try again.',
        timestamp: new Date().toISOString()
      });
    }
    
    // Handle service overload with user-friendly message
    if (error.message.includes('overloaded') || error.message.includes('503')) {
      return res.status(503).json({
        success: false,
        error: 'Service temporarily unavailable',
        message: 'Our AI service is currently experiencing high demand. Please try again in a few moments.',
        fallback: {
          primaryAnalysis: {
            presentingSymptoms: ["Service temporarily unavailable"],
            clinicalImpression: "Professional medical evaluation recommended during service interruption"
          },
          differentialDiagnosis: [
            {
              condition: "General Health Concern",
              likelihood: "moderate",
              explanation: "Based on your symptoms, it's recommended to monitor your condition and consult with a healthcare professional if symptoms persist or worsen",
              keyFeatures: ["Patient-reported symptoms requiring evaluation"]
            }
          ],
          urgencyAssessment: {
            level: "see_doctor_soon",
            reasoning: "Given service limitations, professional evaluation is recommended for proper assessment",
            redFlags: ["Severe symptoms", "Rapidly worsening condition", "Persistent symptoms"],
            timeframe: "within 24-48 hours or sooner if symptoms worsen"
          },
          recommendations: {
            immediate: ["Monitor your symptoms closely", "Stay hydrated and get plenty of rest"],
            monitoring: ["Watch for worsening symptoms", "Note any new symptoms"],
            lifestyle: ["Adequate rest", "Proper hydration", "Avoid strenuous activity"],
            followUp: ["Consult with a healthcare professional if symptoms worsen or persist", "Seek immediate medical attention if you experience severe symptoms"]
          },
          specialistReferral: {
            recommended: false,
            specialty: "General Practitioner",
            reasoning: "Start with primary care evaluation for initial assessment",
            specificConditions: ["General health concerns"],
            whenToSee: "within 1 week"
          },
          educationalContent: {
            overview: "Professional medical evaluation is recommended for proper symptom assessment",
            whatToExpected: "Healthcare provider will perform comprehensive evaluation",
            prevention: "Regular health monitoring and early medical consultation for concerning symptoms"
          },
          disclaimer: "This AI analysis is for informational purposes only and does not replace professional medical diagnosis or treatment. Seek immediate medical attention for severe symptoms or if condition worsens."
        },
        timestamp: new Date().toISOString()
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Failed to analyze symptoms',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
} 