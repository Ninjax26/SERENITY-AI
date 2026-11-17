const immediateRiskPatterns = [
  /\bi\s+(?:want|plan|intend|am going|might|will)\s+to\s+(?:die|kill myself|end my life|take my own life|hurt myself|commit suicide)\b/i,
  /\bi\s+have\s+a\s+plan\s+to\s+(?:die|kill myself|end my life|take my own life)\b/i,
  /\bi(?:'m| am)\s+(?:thinking about|considering)\s+(?:suicide|killing myself|ending my life|self[- ]harm)\b/i,
  /\bi(?:'m| am)\s+suicidal\b/i,
  /\bi\s+(?:might|will)\s+(?:self[- ]harm|cut myself)\b/i,
];

export const CRISIS_RESPONSE =
  "I'm sorry you're facing this. Serenity cannot provide emergency help. If you might act on these thoughts or are in immediate danger, contact your local emergency services or go to the nearest emergency department now. Please tell someone you trust and ask them to stay with you.";

// This catches explicit current-risk language; it is not a clinical assessment.
export function needsImmediateSupport(message: string): boolean {
  return immediateRiskPatterns.some((pattern) => pattern.test(message));
}
