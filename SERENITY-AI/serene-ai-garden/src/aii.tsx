import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;

if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE' || apiKey === 'your_gemini_api_key') {
  console.error('Gemini API key is missing or not configured. Please check your .env file.');
}

const ai = new GoogleGenerativeAI(apiKey);

// Helper to detect mood from a message using Gemini
export async function detectMood(userMessage: string): Promise<string> {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `Analyze the following message and return only the user's mood as one word (e.g., happy, sad, anxious, excited, angry, neutral, etc.):\n${userMessage}` }] }],
      systemInstruction: "You are a mood detection assistant. Only return the mood word, nothing else."
    });
    return result.response.text().trim().toLowerCase();
  } catch (error) {
    console.error('Error detecting mood:', error);
    throw new Error('Failed to detect mood. Please check your API key and connection.');
  }
}

// Main chat response with context and mood
export async function getGeminiAIResponse({
  userMessage,
  contextMessages,
  mood
}: {
  userMessage: string,
  contextMessages: { role: 'user' | 'ai', content: string }[],
  mood?: string
}): Promise<string> {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    // Build context for Gemini
    const contents = [
      ...contextMessages.map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      { role: "user", parts: [{ text: userMessage }] }
    ];
    // Adaptive system prompt
    let systemInstruction = `You are a compassionate and emotionally intelligent psychiatrist.You are an empathetic, non-judgmental mental wellness assistant for Indian youth. Keep answers short, kind, and supportive. Suggest healthy coping strategies. Never replace a doctor. Your role is to support users through thoughtful conversation, help them process their emotions, and provide comfort, encouragement, or advice based on their current mood. Always respond with empathy, patience, and kindness.\n`;
    if (mood) {
      systemInstruction += `The user's current mood is: ${mood}.\n`;
      if (["sad", "anxious", "angry", "stressed", "upset"].includes(mood)) {
        systemInstruction += `Focus on listening, validation, and gentle guidance to clarity or calm.\n`;
      } else if (["happy", "excited", "grateful"].includes(mood)) {
        systemInstruction += `Celebrate with the user and encourage them to explore their positive experiences.\n`;
      }
    }
    systemInstruction += `Do not diagnose or prescribe. Instead, focus on active listening, motivational interviewing techniques, and therapeutic conversation. Use gentle, emotionally sensitive language. Tailor your tone based on the user's emotional state. Always make the user feel heard, safe, and supported.`;
    const result = await model.generateContent({
      contents,
      systemInstruction
    });
    return result.response.text();
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw new Error('Failed to get AI response. Please check your API key and connection.');
  }
}

// Daily affirmation generator
export async function getDailyAffirmation(): Promise<string> {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: "Give me a short, positive daily affirmation for emotional well-being." }] }],
      systemInstruction: "You are an affirmation generator. Respond with a single, uplifting affirmation sentence."
    });
    return result.response.text().trim();
  } catch (error) {
    console.error('Error getting daily affirmation:', error);
    throw new Error('Failed to get daily affirmation. Please check your API key and connection.');
  }
}
