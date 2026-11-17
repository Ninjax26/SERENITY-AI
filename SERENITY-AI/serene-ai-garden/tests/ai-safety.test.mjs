import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { needsImmediateSupport, CRISIS_RESPONSE } from "../src/lib/crisisSupport.ts";
import { classifyMood } from "../src/lib/moodClassifier.ts";
import { handleAIRequest, generateWithFallback } from "../api/ai.ts";
import { GoogleGenerativeAIFetchError } from "@google/generative-ai";

// The Vercel entry point (POST) checks configuration before anything else;
// stub values keep those tests away from the network.
process.env.VITE_SUPABASE_URL ||= "https://stub.supabase.co";
process.env.VITE_SUPABASE_ANON_KEY ||= "stub-anon-key";
process.env.GEMINI_API_KEY ||= "stub-gemini-key";

const PRIMARY_MODEL = "gemini-3.5-flash";
const FALLBACK_MODEL = "gemini-3.5-flash-lite";

function stubDeps(overrides = {}) {
  const calls = { provider: 0, quota: 0 };
  const deps = {
    verifyUser: async (token) => (token === "expired-token" ? null : "user-1"),
    consumeQuota: async () => {
      calls.quota += 1;
      return { ok: true };
    },
    generate: async (request) => {
      calls.provider += 1;
      calls.lastRequest = request;
      return "A gentle reply.";
    },
    ...overrides,
  };
  return { deps, calls };
}

function aiRequest(body, { token = "valid-token", headers } = {}) {
  return new Request("http://localhost/api/ai", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

test("detects explicit current self-harm intent", () => {
  assert.equal(needsImmediateSupport("I want to kill myself"), true);
  assert.equal(needsImmediateSupport("I want to die"), true);
  assert.equal(needsImmediateSupport("I have a plan to end my life"), true);
  assert.equal(needsImmediateSupport("I'm thinking about suicide"), true);
  assert.equal(needsImmediateSupport("I might self-harm"), true);
});

test("does not label ordinary distress as immediate intent", () => {
  assert.equal(needsImmediateSupport("I'm feeling anxious today"), false);
  assert.equal(needsImmediateSupport("I used to feel suicidal years ago"), false);
});

test("does not label negations, past tense, or other people as current risk", () => {
  assert.equal(needsImmediateSupport("I don't want to die, I want help feeling better"), false);
  assert.equal(needsImmediateSupport("My friend mentioned suicide last year and I supported them"), false);
  assert.equal(needsImmediateSupport("I survived a dark period in my life"), false);
});

test("crisis response directs the person to real-world help", () => {
  assert.match(CRISIS_RESPONSE, /emergency services/i);
  assert.match(CRISIS_RESPONSE, /someone you trust/i);
});

test("AI endpoint rejects requests without a session", async () => {
  const response = await handleAIRequest(aiRequest({}, { token: null }), stubDeps().deps);
  assert.equal(response.status, 401);
});

test("AI endpoint rejects an invalid session", async () => {
  const response = await handleAIRequest(aiRequest({ action: "chat", userMessage: "hi" }, { token: "expired-token" }), stubDeps().deps);
  assert.equal(response.status, 401);
});

test("oversized bodies return 413 before the provider is called", async () => {
  const { deps, calls } = stubDeps();
  const response = await handleAIRequest(
    aiRequest({ action: "chat", userMessage: "x".repeat(17_000) }),
    deps
  );
  assert.equal(response.status, 413);
  assert.equal(calls.provider, 0);
});

test("over-quota requests return 429 with Retry-After and skip the provider", async () => {
  const { deps, calls } = stubDeps({
    consumeQuota: async () => ({ ok: false, reason: "quota" }),
  });
  const response = await handleAIRequest(aiRequest({ action: "chat", userMessage: "hello" }), deps);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "60");
  assert.equal(calls.provider, 0);
});

test("limiter failure disables provider calls but keeps the crisis path available", async () => {
  const { deps, calls } = stubDeps({
    consumeQuota: async () => ({ ok: false, reason: "unavailable" }),
  });
  const blocked = await handleAIRequest(aiRequest({ action: "chat", userMessage: "hello" }), deps);
  assert.equal(blocked.status, 503);
  assert.equal(calls.provider, 0);

  const crisis = await handleAIRequest(aiRequest({ action: "chat", userMessage: "I want to die" }), deps);
  assert.equal(crisis.status, 200);
  const payload = await crisis.json();
  assert.equal(payload.crisis, true);
  assert.equal(payload.text, CRISIS_RESPONSE);
  assert.equal(calls.provider, 0);
  assert.equal(calls.quota, 0, "crisis path must not consume quota");
});

test("explicit risk messages take the fixed path with zero provider calls", async () => {
  const { deps, calls } = stubDeps();
  const chat = await handleAIRequest(aiRequest({ action: "chat", userMessage: "I have a plan to kill myself" }), deps);
  assert.equal(chat.status, 200);
  const chatPayload = await chat.json();
  assert.equal(chatPayload.crisis, true);
  assert.equal(chatPayload.text, CRISIS_RESPONSE);

  const mood = await handleAIRequest(aiRequest({ action: "mood", userMessage: "I want to end my life" }), deps);
  assert.deepEqual(await mood.json(), { mood: "distressed" });

  assert.equal(calls.provider, 0);
});

test("an upstream 503 exercises the fallback exactly once", async () => {
  const requestedModels = [];
  let fallbackSignals = 0;
  const stubAI = {
    getGenerativeModel(params) {
      requestedModels.push(params.model);
      if (params.model === PRIMARY_MODEL) {
        return { generateContent: async () => { throw new GoogleGenerativeAIFetchError("upstream down", 503); } };
      }
      return { generateContent: async () => ({ response: { text: () => "Recovered reply." } }) };
    },
  };
  const text = await generateWithFallback(stubAI, { contents: [] }, { onFallback: () => { fallbackSignals += 1; } });
  assert.equal(text, "Recovered reply.");
  assert.deepEqual(requestedModels, [PRIMARY_MODEL, FALLBACK_MODEL]);
  assert.equal(fallbackSignals, 1);
});

test("a non-503 upstream error does not trigger the fallback", async () => {
  const requestedModels = [];
  const stubAI = {
    getGenerativeModel(params) {
      requestedModels.push(params.model);
      return {
        generateContent: async () => { throw new GoogleGenerativeAIFetchError("bad request", 400); },
      };
    },
  };
  await assert.rejects(() => generateWithFallback(stubAI, { contents: [] }));
  assert.deepEqual(requestedModels, [PRIMARY_MODEL]);
});

test("a signed-in happy path makes a single provider call with bounded context", async () => {
  const { deps, calls } = stubDeps();
  const contextMessages = Array.from({ length: 6 }, (_, i) => ({
    role: i % 2 === 0 ? "user" : "ai",
    content: `earlier message ${i}`,
  }));
  const response = await handleAIRequest(
    aiRequest({ action: "chat", userMessage: "hello", contextMessages, mood: "anxious" }),
    deps
  );
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.crisis, false);
  assert.equal(payload.text, "A gentle reply.");
  assert.equal(calls.provider, 1, "one turn must be one provider call");
  // Six context messages plus the new message.
  assert.equal(calls.lastRequest.contents.length, 7);
  assert.match(calls.lastRequest.systemInstruction, /not a clinician/);
  assert.match(calls.lastRequest.systemInstruction, /anxious/);

  // More than six context messages is rejected client-side before sending.
  const tooMany = await handleAIRequest(
    aiRequest({ action: "chat", userMessage: "hello", contextMessages: [...contextMessages, { role: "user", content: "one more" }] }),
    deps
  );
  assert.equal(tooMany.status, 400);
  assert.equal(calls.provider, 1, "rejected requests must not reach the provider");
});

test("invalid input returns 400", async () => {
  const { deps, calls } = stubDeps();
  const long = await handleAIRequest(aiRequest({ action: "chat", userMessage: "x".repeat(2_001) }), deps);
  assert.equal(long.status, 400);
  const unknown = await handleAIRequest(aiRequest({ action: "hijack", userMessage: "hi" }), deps);
  assert.equal(unknown.status, 400);
  const badContext = await handleAIRequest(
    aiRequest({ action: "chat", userMessage: "hi", contextMessages: [{ role: "user", content: 42 }] }),
    deps
  );
  assert.equal(badContext.status, 400);
  assert.equal(calls.provider, 0);
});

test("responses are not cacheable", async () => {
  const { deps } = stubDeps();
  const response = await handleAIRequest(aiRequest({ action: "chat", userMessage: "hello" }), deps);
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("classifyMood maps common wording to the allowed mood set", () => {
  assert.equal(classifyMood("I feel grateful for my friends"), "grateful");
  assert.equal(classifyMood("such a happy day"), "happy");
  assert.equal(classifyMood("I'm so excited about tomorrow"), "excited");
  assert.equal(classifyMood("feeling anxious about the exam"), "anxious");
  assert.equal(classifyMood("they made me so angry"), "angry");
  assert.equal(classifyMood("totally overwhelmed and burned out"), "stressed");
  assert.equal(classifyMood("feeling sad and lonely"), "sad");
  assert.equal(classifyMood("the weather is cloudy"), "neutral");
});

test("the quota RPC the API calls matches the SQL schema and privilege contract", () => {
  const sql = readFileSync(new URL("../supabase/secure_app_tables.sql", import.meta.url), "utf8");
  const api = readFileSync(new URL("../api/ai.ts", import.meta.url), "utf8");

  const rpcCall = api.match(/supabase\.rpc\(\s*"([^"]+)"/);
  assert.ok(rpcCall, "api/ai.ts must call the quota RPC");
  const fnName = rpcCall[1];

  // PostgREST only exposes the public schema, so the callable function must
  // live there. A function left in another schema makes every quota check
  // fail and, because the API fails closed, every AI request return 503.
  const fnDefinition = sql.match(
    new RegExp(`create\\s+or\\s+replace\\s+function\\s+([a-z_]+)\\.${fnName}\\b`, "i")
  );
  assert.ok(fnDefinition, `SQL must define ${fnName}`);
  assert.equal(
    fnDefinition[1],
    "public",
    `${fnName} must be in the public schema: supabase.rpc() cannot reach other schemas`
  );

  // Narrowly scoped callable: anon must not be able to execute it, and the
  // quota table itself must stay outside the public schema.
  const revokeMatch = sql.match(
    new RegExp(`revoke\\s+all\\s+on\\s+function\\s+public\\.${fnName}\\([^)]*\\)\\s+from\\s+([^;]+);`, "i")
  );
  assert.ok(revokeMatch, `SQL must revoke default privileges on ${fnName}`);
  assert.match(revokeMatch[1], /\banon\b/, `${fnName} must not be executable by anon`);
  assert.match(sql, new RegExp(`grant\\s+execute\\s+on\\s+function\\s+public\\.${fnName}\\b`, "i"), `${fnName} must be granted to authenticated`);
  assert.match(sql, /create\s+table\s+if\s+not\s+exists\s+private\.model_quota_hits/, "quota hits must live in the private schema");
});
