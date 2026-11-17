// Local keyword classifier for the message emotion tag. It replaces a paid
// provider call per chat turn; the tag only shapes saved metadata and the
// tone hint sent with the next request. It is not a safety mechanism —
// explicit current-risk language is handled by crisisSupport on the server.
const moodKeywords: Array<[mood: string, patterns: RegExp[]]> = [
  ["grateful", [/\b(thank you|thanks|grateful|appreciate|blessed)\b/i]],
  ["happy", [/\b(happy|glad|joyful|wonderful|amazing|proud|cheerful|delighted)\b/i]],
  ["excited", [/\b(excited|thrilled|can't wait|cant wait|hyped|eager)\b/i]],
  ["anxious", [/\b(anxious|worried|nervous|panic|panicking|scared|afraid|tense|overthinking|restless)\b/i]],
  ["angry", [/\b(angry|furious|mad|annoyed|irritated|frustrated|rage|outraged)\b/i]],
  ["stressed", [/\b(stressed|overwhelmed|burnt? out|exhausted|too much|swamped|under pressure)\b/i]],
  ["sad", [/\b(sad|down|lonely|unhappy|depressed|hopeless|gloomy|miserable|crying|tears)\b/i]],
];

// The result stays within the server's allowed mood set; unrecognized
// messages are neutral, matching the previous provider-based default.
export function classifyMood(message: string): string {
  for (const [mood, patterns] of moodKeywords) {
    if (patterns.some((pattern) => pattern.test(message))) return mood;
  }
  return "neutral";
}
