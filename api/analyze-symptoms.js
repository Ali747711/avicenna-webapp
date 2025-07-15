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

    if (!symptoms || symptoms.trim().length === 0) {
      return res.status(400).json({ error: 'Symptoms are required' });
    }

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return res.status(500).json({ error: 'API configuration error' });
    }

    // Advanced Medical AI Prompt with Clinical Reasoning
    const prompt = `You are Avicenna, an advanced medical AI assistant designed for symptom analysis. You possess comprehensive medical knowledge and follow evidence-based clinical reasoning protocols.

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

LANGUAGE: Respond in ${language === 'ko' ? 'Korean (한국어)' : language === 'uz' ? 'Uzbek (O\'zbek tili)' : 'English'}
CRITICAL: Return only valid JSON. No additional text or formatting.`;

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
              maxOutputTokens: 1000,
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
          parsedResponse = JSON.parse(jsonMatch[1].trim());
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
        parsedResponse = {
          primaryAnalysis: {
            presentingSymptoms: ["Symptom analysis requested"],
            clinicalImpression: "AI analysis indicates the need for professional medical evaluation"
          },
          differentialDiagnosis: [
            {
              condition: "Medical Evaluation Needed",
              likelihood: "high",
              explanation: "Based on the symptoms described, professional medical assessment is recommended",
              keyFeatures: ["Patient-reported symptoms require clinical evaluation"]
            }
          ],
          urgencyAssessment: {
            level: "see_doctor_soon",
            reasoning: "Symptoms require professional medical evaluation for proper diagnosis",
            redFlags: ["Worsening symptoms", "New concerning symptoms"],
            timeframe: "within 24-48 hours or sooner if symptoms worsen"
          },
          recommendations: {
            immediate: ["Monitor symptoms closely"],
            monitoring: ["Watch for worsening or new symptoms"],
            lifestyle: ["Rest and maintain good hydration"],
            followUp: ["Schedule appointment with healthcare provider"]
          },
          specialistReferral: {
            recommended: false,
            specialty: "General Practitioner",
            reasoning: "Start with primary care evaluation",
            specificConditions: ["General health concerns"],
            whenToSee: "within 1 week"
          },
          educationalContent: {
            overview: "Professional medical evaluation is recommended for proper symptom assessment",
            whatToExpected: "Healthcare provider will perform thorough evaluation",
            prevention: "Regular health checkups help identify issues early"
          },
          disclaimer: "This AI analysis is for informational purposes only and does not replace professional medical diagnosis or treatment. Seek immediate medical attention for severe symptoms or if condition worsens."
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