import { supabase } from "./supabaseClient";

interface ChatResult {
  text: string;
  crisis: boolean;
}

async function requestAI<T>(body: Record<string, unknown>): Promise<T> {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session?.access_token) {
    throw new Error("Please sign in before using the AI Companion.");
  }

  const response = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(response.status === 503
      ? "The AI service is temporarily unavailable. Please try again shortly."
      : "The AI service could not complete your request.");
  }
  return response.json() as Promise<T>;
}

export async function detectMood(userMessage: string): Promise<string> {
  const result = await requestAI<{ mood: string }>({ action: "mood", userMessage });
  return result.mood;
}

export async function getGeminiAIResponse({
  userMessage,
  contextMessages,
  mood,
}: {
  userMessage: string;
  contextMessages: { role: "user" | "ai"; content: string }[];
  mood?: string;
}): Promise<ChatResult> {
  return requestAI<ChatResult>({ action: "chat", userMessage, contextMessages, mood });
}

export async function getDailyAffirmation(): Promise<string> {
  const result = await requestAI<{ affirmation: string }>({ action: "affirmation" });
  return result.affirmation;
}
