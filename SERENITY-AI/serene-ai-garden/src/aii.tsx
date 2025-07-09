import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY as string);

// Helper to detect mood from a message using Gemini
export async function detectMood(userMessage: string): Promise<string> {
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: `Analyze the following message and return only the user's mood as one word (e.g., happy, sad, anxious, excited, angry, neutral, etc.):\n${userMessage}` }] }],
    systemInstruction: "You are a mood detection assistant. Only return the mood word, nothing else."
  });
  return result.response.text().trim().toLowerCase();
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
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
  // Build context for Gemini
  const contents = [
    ...contextMessages.map(m => ({
      role: m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: m.content }]
    })),
    { role: "user", parts: [{ text: userMessage }] }
  ];
  // Adaptive system prompt
  let systemInstruction = `You are a compassionate and emotionally intelligent psychiatrist. Your role is to support users through thoughtful conversation, help them process their emotions, and provide comfort, encouragement, or advice based on their current mood. Always respond with empathy, patience, and kindness.\n`;
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
}

// Daily affirmation generator
export async function getDailyAffirmation(): Promise<string> {
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: "Give me a short, positive daily affirmation for emotional well-being." }] }],
    systemInstruction: "You are an affirmation generator. Respond with a single, uplifting affirmation sentence."
  });
  return result.response.text().trim();
}
