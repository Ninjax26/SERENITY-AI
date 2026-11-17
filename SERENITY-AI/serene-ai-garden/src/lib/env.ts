const publicEnvVars = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

const placeholders = [
  'YOUR_SUPABASE_URL_HERE',
  'YOUR_SUPABASE_ANON_KEY_HERE',
  'your_supabase_project_url',
  'your_supabase_anon_key',
];

function isPlaceholder(value: string): boolean {
  return placeholders.some((p) => value.includes(p));
}

export function validateEnv(): string[] {
  const missing: string[] = [];

  for (const [key, value] of Object.entries(publicEnvVars)) {
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
