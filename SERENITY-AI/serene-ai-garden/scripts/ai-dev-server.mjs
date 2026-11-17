// Minimal local harness for the /api/ai Vercel function, for development
// without the Vercel CLI. Run from the app root:
//   node --experimental-strip-types scripts/ai-dev-server.mjs
// The frontend itself still needs `npm run dev` (Vite proxies nothing here);
// point the chat client or curl at http://localhost:8787/api/ai.
import { createServer } from "node:http";
import { readFileSync } from "node:fs";

// Load .env quietly. Values are never printed.
for (const line of readFileSync(new URL("../.env", import.meta.url), "utf8").split("\n")) {
  const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (match && process.env[match[1]] === undefined) {
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

const { POST } = await import("../api/ai.ts");

const server = createServer(async (req, res) => {
  if (req.method !== "POST" || !req.url?.startsWith("/api/ai")) {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const request = new Request("http://localhost" + req.url, {
    method: "POST",
    headers: req.headers,
    body: Buffer.concat(chunks),
  });
  const response = await POST(request);
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(await response.text());
});

server.listen(8787, () => {
  console.log("AI function harness listening on http://localhost:8787/api/ai");
});
