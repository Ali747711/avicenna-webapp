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

    // Simplified Gemini prompt for faster response
    const prompt = `User symptoms: "${symptoms}"

Respond with valid JSON only:
{
  "conditions": [{"name": "Condition Name", "explanation": "Brief explanation"}],
  "urgency": "monitor_at_home|see_doctor_soon|emergency_care",
  "doctor_type": "Type of doctor to consult (e.g., General Practitioner, Dermatologist, Cardiologist, etc.)",
  "recommendations": ["brief advice"],
  "disclaimer": "This is not a medical diagnosis. Consult healthcare professionals for proper medical advice."
}

Language: ${language === 'ko' ? 'Korean' : language === 'uz' ? 'Uzbek' : 'English'}. Return JSON only.`;

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
          conditions: [
            {
              name: "Analysis Available",
              explanation: aiResponse
            }
          ],
          urgency: "see_doctor_soon",
          recommendations: ["Please consult with a healthcare professional for proper diagnosis"],
          disclaimer: "This is not a medical diagnosis. Consult healthcare professionals for proper medical advice."
        };
      }
    }

    // Validate response structure
    if (!parsedResponse.conditions || !parsedResponse.urgency || !parsedResponse.disclaimer) {
      parsedResponse = {
        conditions: parsedResponse.conditions || [{ name: "General Health Concern", explanation: "Based on your symptoms, it's recommended to consult with a healthcare professional." }],
        urgency: parsedResponse.urgency || "see_doctor_soon",
        doctor_type: parsedResponse.doctor_type || "General Practitioner",
        recommendations: parsedResponse.recommendations || ["Consult with a healthcare professional"],
        disclaimer: "This is not a medical diagnosis. Consult healthcare professionals for proper medical advice."
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
          conditions: [
            {
              name: "General Health Concern",
              explanation: "Based on your symptoms, it's recommended to monitor your condition and consult with a healthcare professional if symptoms persist or worsen."
            }
          ],
          urgency: "see_doctor_soon",
          doctor_type: "General Practitioner",
          recommendations: [
            "Monitor your symptoms closely",
            "Stay hydrated and get plenty of rest",
            "Consult with a healthcare professional if symptoms worsen or persist",
            "Seek immediate medical attention if you experience severe symptoms"
          ],
          disclaimer: "This is not a medical diagnosis. Consult healthcare professionals for proper medical advice."
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