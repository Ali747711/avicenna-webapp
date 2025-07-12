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

    // Enhanced Gemini prompt for healthcare analysis
    const prompt = `You are a medical information assistant. A user reported: "${symptoms}"

Please respond with exactly this JSON format:
{
  "conditions": [
    {
      "name": "Condition Name",
      "explanation": "Simple explanation in plain language"
    }
  ],
  "urgency": "monitor_at_home|see_doctor_soon|emergency_care",
  "recommendations": ["practical advice"],
  "disclaimer": "This is not a medical diagnosis. Consult healthcare professionals for proper medical advice."
}

Provide 2-3 most likely conditions. Use simple language appropriate for non-medical people. 
If symptoms are severe or life-threatening, always recommend emergency care.
Important: Always include the medical disclaimer.
Respond in ${language === 'ko' ? 'Korean' : language === 'uz' ? 'Uzbek' : 'English'}.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
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
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates[0]?.content?.parts[0]?.text;

    if (!aiResponse) {
      throw new Error('No response from Gemini');
    }

    // Try to parse JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      // If JSON parsing fails, create a structured response
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

    // Validate response structure
    if (!parsedResponse.conditions || !parsedResponse.urgency || !parsedResponse.disclaimer) {
      parsedResponse = {
        conditions: parsedResponse.conditions || [{ name: "General Health Concern", explanation: "Based on your symptoms, it's recommended to consult with a healthcare professional." }],
        urgency: parsedResponse.urgency || "see_doctor_soon",
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
    
    return res.status(500).json({
      success: false,
      error: 'Failed to analyze symptoms',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
} 