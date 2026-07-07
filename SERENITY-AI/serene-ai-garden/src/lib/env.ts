const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_GEMINI_API_KEY',
] as const;

const placeholders = [
  'YOUR_SUPABASE_URL_HERE',
  'YOUR_SUPABASE_ANON_KEY_HERE',
  'YOUR_GEMINI_API_KEY_HERE',
  'your_supabase_project_url',
  'your_supabase_anon_key',
  'your_gemini_api_key',
];

function isPlaceholder(value: string): boolean {
  return placeholders.some((p) => value.includes(p));
}

export function validateEnv(): string[] {
  const missing: string[] = [];

  for (const key of requiredEnvVars) {
    const value = import.meta.env[key];
    if (!value || isPlaceholder(value)) {
      missing.push(key);
    }
  }

  return missing;
}

export function getEnvWarnings(): string[] {
  return validateEnv().map(
    (key) => `${key} is missing or still set to a placeholder value`
  );
}
