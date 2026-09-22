# Serenity AI

**A quieter space to check in, write, and reflect.**

Serenity AI is a React and TypeScript wellness app with an AI conversation interface, mood tracking, private journaling views, mindfulness exercises, and a community area. The product is designed for reflection and everyday wellbeing—not diagnosis, treatment, or emergency response.

[Explore the deployed app](https://serenityai-ten.vercel.app/) · [Run locally](#run-locally) · [Read the safety notes](#privacy-and-safety)

| Talk | Notice | Reflect |
| :--- | :--- | :--- |
| An AI companion for supportive conversation. | Mood check-ins and insight views for spotting patterns. | A journal, mindfulness tools, and a community forum. |

## What is in this repository

The application lives in [`SERENITY-AI/serene-ai-garden`](SERENITY-AI/serene-ai-garden). Its pages and components include:

- **AI Companion** — conversational UI, mood-aware prompts, and voice-related browser features.
- **Mood Tracker and Wellness Insights** — check-ins and visual summaries.
- **Smart Journaling** — writing, review, and export-oriented interfaces.
- **Mindfulness** — breathing and sound-based exercises.
- **Community** — posts and votes backed by Supabase.
- **Crisis Resources** — links and phone numbers for finding human help.

The stack is React 18, TypeScript, Vite, Tailwind CSS, Radix UI, Supabase, and Google's Generative AI client. This is a client-side app; there is no API server or `/api/ai/*` implementation in this repository.

## Run locally

```bash
git clone https://github.com/Ninjax26/SERENITY-AI.git
cd SERENITY-AI/SERENITY-AI/serene-ai-garden
npm install
cp .env.example .env
npm run dev
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env` for the Supabase-backed features. The current AI integration also reads `VITE_GEMINI_API_KEY` from the Vite client environment.

For a production deployment, do **not** put a private or billable Gemini credential in a `VITE_` variable: Vite embeds those values in browser-delivered JavaScript. Move AI calls behind a server-side endpoint and store the key only in server environment variables. Supabase data access also depends on correctly configured Row Level Security policies; this repository alone does not establish those policies.

Run `npm run build` to check the production frontend bundle and `npm run lint` for the repository's ESLint checks.

## Privacy and safety

- This is a software project, not a clinical service. AI responses can be wrong or inappropriate and should not be treated as medical advice.
- Do not assume messages or journal entries are end-to-end encrypted. No such guarantee is established by the checked-in code.
- The repository includes a crisis-resource page, but it does not provide monitored emergency intervention. In immediate danger, contact local emergency services or a qualified professional directly.
- Verify your own Supabase authentication, access policies, data retention, and any AI-provider data handling before accepting real users' sensitive information.

## Project map

```text
SERENITY-AI/serene-ai-garden/
├── src/pages/          # routes and page-level composition
├── src/components/     # chat, journal, mood, mindfulness, and UI components
├── src/aii.tsx         # current browser-side AI integration
├── src/supabaseClient.ts
└── public/             # static assets and exercise sounds
```

## License

[MIT](LICENSE).
