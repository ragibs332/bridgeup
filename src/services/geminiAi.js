// Google Gemini AI SDK Service for BridgeUp
// Provides seamless conversational intelligence, smart prompt classification,
// and real-world NGO recommendation generation.

let geminiClient = null;

export const geminiConfig = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || ''
};

/**
 * Initialize the Google Gen AI client if an API key is provided
 */
export async function getGeminiClient() {
  if (geminiClient) return geminiClient;

  const apiKey = geminiConfig.apiKey || localStorage.getItem('bridgeup_gemini_key');
  if (!apiKey) return null;

  try {
    const { GoogleGenAI } = await import('@google/genai');
    geminiClient = new GoogleGenAI({ apiKey });
    return geminiClient;
  } catch (err) {
    console.warn('Gemini SDK load failed or not configured, utilizing built-in semantic fallback engine:', err);
    return null;
  }
}

/**
 * Generate intelligent humanitarian and NGO guidance using Gemini AI
 * Uses @google/genai SDK with automatic REST fallback and multi-model support
 */
export async function generateGeminiResponse(userPrompt, availableNgos = []) {
  const apiKey = geminiConfig.apiKey || localStorage.getItem('bridgeup_gemini_key');
  if (!apiKey) return null;

  // Create a concise prompt context with registered NGO details
  const ngoSummary = availableNgos.slice(0, 15).map(n => 
    `- ${n.name} (${n.city}, ${n.location}): ${n.focusArea}. Needs: ${n.urgentNeeds?.map(u => u.item).join(', ') || 'General funding'}. Phone: ${n.phone}`
  ).join('\n');

  const systemPrompt = `You are BridgeUp AI, an intelligent humanitarian civic assistant in India. 
Your purpose is to connect citizens with verified NGOs for hunger relief, child welfare, elder care, animal rescues, medical assistance (cancer/hospice), and emergency disaster response.
Available Verified NGOs in database:
${ngoSummary}

Answer concisely in friendly markdown. If the user is looking for an NGO, highlight the matching NGOs and what items they need.`;

  // 1. Try Direct Gemini REST Endpoint with Google's latest active models (gemini-3.5-flash, gemini-3.5-flash-lite, gemini-flash-latest)
  const modelsToTry = [
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-flash-latest',
    'gemini-2.5-flash'
  ];
  const trimmedKey = apiKey.trim();
  
  for (const model of modelsToTry) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(trimmedKey)}`;
      const headers = { 
        'Content-Type': 'application/json',
        'x-goog-api-key': trimmedKey
      };
      
      if (trimmedKey.startsWith('AQ.')) {
        headers['Authorization'] = `Bearer ${trimmedKey}`;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `${systemPrompt}\n\nUser Question: ${userPrompt}` }]
            }
          ]
        })
      });

      if (res.ok) {
        const data = await res.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate) return candidate;
      }
    } catch (err) {
      console.warn(`REST call to ${model} failed, trying next:`, err);
    }
  }

  // 2. Try SDK Fallback
  try {
    const ai = await getGeminiClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${userPrompt}` }] }
        ]
      });
      if (response && response.text) return response.text;
    }
  } catch (sdkErr) {
    console.warn('Gemini SDK call fallback:', sdkErr);
  }

  return null;
}
