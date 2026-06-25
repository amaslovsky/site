import { buildSystemPrompt } from "@/lib/twin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "openai/gpt-oss-120b:free";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Server is missing OPENROUTER_API_KEY." }, { status: 500 });
  }

  let messages: ChatMessage[] = [];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const cleaned = messages
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

  if (cleaned.length === 0) {
    return Response.json({ error: "No message provided." }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Oleksii Maslovskyi - Digital Twin",
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        temperature: 0.5,
        messages: [{ role: "system", content: buildSystemPrompt() }, ...cleaned],
      }),
    });
  } catch {
    return Response.json({ error: "Could not reach the AI provider." }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    return Response.json(
      { error: `AI provider error (${upstream.status}).`, detail: detail.slice(0, 500) },
      { status: 502 },
    );
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader();
      let buffer = "";
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const token: string = json?.choices?.[0]?.delta?.content ?? "";
              if (token) controller.enqueue(encoder.encode(token));
            } catch {
              // Ignore keep-alive comments / partial chunks.
            }
          }
        }
        controller.close();
      } catch {
        controller.error(new Error("Stream interrupted."));
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
