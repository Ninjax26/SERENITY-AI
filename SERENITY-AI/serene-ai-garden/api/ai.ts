import {
  GoogleGenerativeAI,
  GoogleGenerativeAIFetchError,
  type GenerateContentRequest,
} from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { CRISIS_RESPONSE, needsImmediateSupport } from "../src/lib/crisisSupport.ts";

const PRIMARY_MODEL = "gemini-3.5-flash";
const FALLBACK_MODEL = "gemini-3.5-flash-lite";
const MAX_BODY_BYTES = 16_384;
const MAX_MESSAGE_LENGTH = 2_000;
const CONTEXT_MESSAGE_LIMIT = 6;
const UPSTREAM_TIMEOUT_MS = 20_000;
const RATE_LIMIT_WINDOW_SECONDS = 60;
const DEFAULT_RATE_LIMIT_PER_MINUTE = 10;

type ContextMessage = { role: "user" | "ai"; content: string };

type GenerateFn = (
  request: GenerateContentRequest,
  ctx?: { onFallback?: () => void }
) => Promise<string>;

/**
 * Server-side seams so tests can stub auth, quota and the provider without
 * network access. Production passes realDeps().
 */
export interface AIDeps {
  /** Verifies a Supabase access token; returns the user id, or null. */
  verifyUser(token: string): Promise<string | null>;
  /**
   * Atomic per-user quota shared across function instances. `unavailable`
   * means the quota store itself failed: provider calls stay disabled while
   * the crisis path remains available.
   */
  consumeQuota(
    userId: string,
    token: string
  ): Promise<{ ok: true } | { ok: false; reason: "quota" | "unavailable" }>;
  /** Calls the provider (with the Flash -> Flash-Lite fallback). */
  generate: GenerateFn;
}

function json(data: Record<string, unknown>, status = 200, extra?: Record<string, string>): Response {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store", ...extra } });
}

async function readLimitedBody(request: Request): Promise<string | null> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

function readRateLimit(): number {
  const parsed = Number.parseInt(process.env.AI_RATE_LIMIT_PER_MINUTE ?? "", 10);
  return Number.isFinite(parsed) && parsed >= 1 ? Math.min(parsed, 1_000) : DEFAULT_RATE_LIMIT_PER_MINUTE;
}

export function createDeps(): AIDeps {
  const supabaseUrl = process.env.VITE_SUPABASE_URL!;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
  const geminiKey = process.env.GEMINI_API_KEY!;
  const ai = new GoogleGenerativeAI(geminiKey);
  const rateLimit = readRateLimit();

  return {
    async verifyUser(token) {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data.user) return null;
      return data.user.id;
    },

    async consumeQuota(userId, token) {
      try {
        // Call the quota RPC with the verified user's token so the database
        // sees the real caller: nobody can spend another account's quota.
        const supabase = createClient(supabaseUrl, supabaseKey, {
          auth: { autoRefreshToken: false, persistSession: false },
          global: { headers: { Authorization: `Bearer ${token}` } },
        });
        const { data, error } = await supabase.rpc("consume_model_quota", {
          p_limit: rateLimit,
          p_window_seconds: RATE_LIMIT_WINDOW_SECONDS,
        });
        if (error) return { ok: false, reason: "unavailable" };
        return data === true ? { ok: true } : { ok: false, reason: "quota" };
      } catch {
        return { ok: false, reason: "unavailable" };
      }
    },

    async generate(request, ctx) {
      try {
        const primary = ai.getGenerativeModel({ model: PRIMARY_MODEL }, { timeout: UPSTREAM_TIMEOUT_MS });
        const result = await primary.generateContent(request);
        return result.response.text();
      } catch (error) {
        if (!(error instanceof GoogleGenerativeAIFetchError) || error.status !== 503) throw error;
        ctx?.onFallback?.();
        const fallback = ai.getGenerativeModel({ model: FALLBACK_MODEL }, { timeout: UPSTREAM_TIMEOUT_MS });
        const result = await fallback.generateContent(request);
        return result.response.text();
      }
    },
  };
}

export async function handleAIRequest(request: Request, deps: AIDeps): Promise<Response> {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();
  let action = "unknown";
  let fallbacks = 0;
  // Metadata only: never log prompts, replies, tokens or user identifiers.
  const respond = (
    outcome: string,
    data: Record<string, unknown>,
    status = 200,
    extra?: Record<string, string>
  ): Response => {
    console.info(JSON.stringify({ requestId, action, outcome, status, latencyMs: Date.now() - startedAt, fallbacks }));
    return json(data, status, extra);
  };

  const token = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return respond("unauthenticated", { error: "Sign in required" }, 401);
  if (Number(request.headers.get("content-length") || 0) > MAX_BODY_BYTES) {
    return respond("oversized", { error: "Request too large" }, 413);
  }

  let userId: string | null;
  try {
    userId = await deps.verifyUser(token);
  } catch {
    return respond("auth-unavailable", { error: "Could not verify your session" }, 503);
  }
  if (!userId) return respond("unauthenticated", { error: "Invalid session" }, 401);

  const raw = await readLimitedBody(request);
  if (raw === null) return respond("oversized", { error: "Request too large" }, 413);
  let input: unknown;
  try {
    input = JSON.parse(raw);
  } catch {
    return respond("invalid", { error: "Invalid JSON" }, 400);
  }
  if (!input || typeof input !== "object") return respond("invalid", { error: "Invalid request" }, 400);
  const body = input as Record<string, unknown>;
  if (body.action !== "affirmation" && body.action !== "mood" && body.action !== "chat") {
    return respond("invalid", { error: "Unknown action" }, 400);
  }
  action = body.action;

  const message = typeof body.userMessage === "string" ? body.userMessage : "";
  if (action !== "affirmation") {
    if (!message.trim() || message.length > MAX_MESSAGE_LENGTH) {
      return respond("invalid", { error: `Message must be 1-${MAX_MESSAGE_LENGTH} characters` }, 400);
    }
    // Safety path first: fixed supportive text with no quota check, no
    // provider call and no database write, so it stays available when the
    // limiter or provider is down.
    if (needsImmediateSupport(message)) {
      return action === "mood"
        ? respond("crisis", { mood: "distressed" })
        : respond("crisis", { text: CRISIS_RESPONSE, crisis: true });
    }
  }

  const quota = await deps.consumeQuota(userId, token);
  if (!quota.ok) {
    if (quota.reason === "quota") {
      return respond(
        "rate-limited",
        { error: "Too many AI requests. Please try again in a minute." },
        429,
        { "Retry-After": String(RATE_LIMIT_WINDOW_SECONDS) }
      );
    }
    // Limiter failure: provider calls stay disabled (fail closed), but the
    // crisis path above never reaches this gate.
    return respond("quota-unavailable", { error: "AI service is temporarily unavailable" }, 503);
  }

  try {
    const generateContext = { onFallback: () => { fallbacks += 1; } };

    if (action === "affirmation") {
      const affirmation = await deps.generate(
        {
          contents: [{ role: "user", parts: [{ text: "Give one short, positive daily affirmation for emotional well-being." }] }],
          systemInstruction: "Respond with one uplifting sentence. Do not make medical claims.",
          generationConfig: { maxOutputTokens: 128 },
        },
        generateContext
      );
      return respond("ok", { affirmation: affirmation.trim() });
    }

    if (action === "mood") {
      const mood = await deps.generate(
        {
          contents: [{ role: "user", parts: [{ text: `Describe the mood in one word:\n${message}` }] }],
          systemInstruction: "Return only one mood word, without diagnosis or explanation.",
          generationConfig: { maxOutputTokens: 32 },
        },
        generateContext
      );
      return respond("ok", { mood: mood.trim().toLowerCase().slice(0, 32) || "neutral" });
    }

    const context = body.contextMessages;
    if (!Array.isArray(context) || context.length > CONTEXT_MESSAGE_LIMIT || !context.every((item): item is ContextMessage =>
      item && typeof item === "object" && (item.role === "user" || item.role === "ai") &&
      typeof item.content === "string" && item.content.length <= MAX_MESSAGE_LENGTH)) {
      return respond("invalid", { error: "Invalid conversation context" }, 400);
    }
    const allowedMoods = new Set(["happy", "sad", "anxious", "excited", "angry", "neutral", "stressed", "upset", "grateful", "distressed"]);
    const mood = typeof body.mood === "string" && allowedMoods.has(body.mood) ? body.mood : "neutral";
    const prior = (context as ContextMessage[]).filter((item) => item.content.trim());
    while (prior[0]?.role === "ai") prior.shift();
    const text = await deps.generate(
      {
        contents: [
          ...prior.map((item) => ({ role: item.role === "ai" ? "model" : "user", parts: [{ text: item.content }] })),
          { role: "user", parts: [{ text: message }] },
        ],
        systemInstruction: `You are a supportive mental wellness companion, not a clinician or emergency service. Be empathetic and concise. Do not diagnose or prescribe. If the user may be at risk of self-harm or suicide, encourage immediate real-world support from local emergency services and a trusted person. The user's reported mood is: ${mood}.`,
        generationConfig: { maxOutputTokens: 1024 },
      },
      generateContext
    );
    return respond("ok", { text, crisis: false });
  } catch (error) {
    const status = error instanceof GoogleGenerativeAIFetchError && error.status === 503 ? 503 : 502;
    return respond(
      status === 503 ? "provider-unavailable" : "provider-error",
      { error: status === 503 ? "AI provider unavailable" : "AI request failed" },
      status
    );
  }
}

export async function POST(request: Request): Promise<Response> {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!supabaseUrl || !supabaseKey || !geminiKey) {
    return json({ error: "AI service is not configured" }, 503);
  }
  return handleAIRequest(request, createDeps());
}
