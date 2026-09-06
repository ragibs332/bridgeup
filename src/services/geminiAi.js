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
 * Supports text, multimodal image analysis, and multilingual translation (EN, HI, MR)
 */
export async function generateGeminiResponse(userPrompt, availableNgos = [], imageBase64 = null, language = 'en') {
  const apiKey = geminiConfig.apiKey || localStorage.getItem('bridgeup_gemini_key');
  if (!apiKey) return null;

  // Create a concise prompt context with registered NGO details
  const ngoSummary = availableNgos.slice(0, 15).map(n => 
    `- ${n.name} (${n.city}, ${n.location}): ${n.focusArea}. Needs: ${n.urgentNeeds?.map(u => u.item).join(', ') || 'General funding'}. Phone: ${n.phone}`
  ).join('\n');

  let langInstruction = 'Answer in English.';
  if (language === 'hi') {
    langInstruction = 'कृपया उत्तर शुद्ध एवं सरल हिन्दी (Hindi) में दें। Provide answer in friendly Hindi.';
  } else if (language === 'mr') {
    langInstruction = 'कृपया उत्तर मराठीत (Marathi) द्या. Provide answer in friendly Marathi.';
  }

  const systemPrompt = `You are BridgeUp AI, an intelligent humanitarian civic assistant in India. 
${langInstruction}
Your purpose is to connect citizens with verified NGOs for hunger relief, child welfare, elder care, animal rescues, medical assistance (cancer/hospice), and emergency disaster response.

If an image is attached, analyze the situation (e.g. injured stray animal, excess food quantity, flood distress, elder shelter need), provide rapid first-aid or safety guidance, and recommend the best matching NGOs.

Available Verified NGOs in database:
${ngoSummary}`;

  const modelsToTry = [
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-flash-latest',
    'gemini-2.5-flash'
  ];
  const trimmedKey = apiKey.trim();

  // Prepare prompt payload parts
  const parts = [];
  if (imageBase64) {
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    parts.push({
      inline_data: {
        mime_type: 'image/jpeg',
        data: cleanBase64
      }
    });
  }
  parts.push({ text: `${systemPrompt}\n\nUser Question/Context: ${userPrompt || 'Analyze this incident photo and recommend verified NGOs.'}` });

  for (const model of modelsToTry) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      const headers = { 
        'Content-Type': 'application/json',
        'x-goog-api-key': trimmedKey
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          contents: [{ parts }]
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

  return null;
}
