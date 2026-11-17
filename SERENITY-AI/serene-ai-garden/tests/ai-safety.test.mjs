import assert from "node:assert/strict";
import test from "node:test";
import { needsImmediateSupport, CRISIS_RESPONSE } from "../src/lib/crisisSupport.ts";
import { POST } from "../api/ai.ts";

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

test("crisis response directs the person to real-world help", () => {
  assert.match(CRISIS_RESPONSE, /emergency services/i);
  assert.match(CRISIS_RESPONSE, /someone you trust/i);
});

test("AI endpoint rejects requests without a session", async () => {
  const response = await POST(new Request("http://localhost/api/ai", { method: "POST", body: "{}" }));
  assert.equal(response.status, 401);
});
