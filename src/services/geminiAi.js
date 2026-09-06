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
 */
export async function generateGeminiResponse(userPrompt, availableNgos = []) {
  try {
    const ai = await getGeminiClient();
    if (!ai) return null;

    // Create a concise prompt context with registered NGO details
    const ngoSummary = availableNgos.slice(0, 15).map(n => 
      `- ${n.name} (${n.city}, ${n.location}): ${n.focusArea}. Needs: ${n.urgentNeeds?.map(u => u.item).join(', ') || 'General funding'}. Phone: ${n.phone}`
    ).join('\n');

    const systemPrompt = `You are BridgeUp AI, an intelligent humanitarian civic assistant in India. 
Your purpose is to connect citizens with verified NGOs for hunger relief, child welfare, elder care, animal rescues, medical assistance (cancer/hospice), and emergency disaster response.
Available Verified NGOs in database:
${ngoSummary}

Answer concisely in friendly markdown. If the user is looking for an NGO, highlight the matching NGOs and what items they need.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${userPrompt}` }] }
      ]
    });

    if (response && response.text) {
      return response.text;
    }
  } catch (error) {
    console.warn('Gemini AI inference error:', error);
  }
  return null;
}
