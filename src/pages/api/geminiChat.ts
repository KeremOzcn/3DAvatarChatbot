import type { NextApiRequest, NextApiResponse } from "next";

type Message = { role: "assistant" | "system" | "user"; content: string };

function toGeminiRole(role: Message["role"]): "user" | "model" {
  return role === "assistant" ? "model" : "user";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "Missing GEMINI_API_KEY in server environment" });
  }

  try {
    const { messages, model } = req.body as { messages: Message[]; model?: string };
    const selectedModel = model || "gemini-1.5-flash";

    const systemMsg = messages.find((m) => m.role === "system");
    const contentMessages = messages.filter((m) => m.role !== "system");

    const contents = contentMessages.map((m) => ({
      role: toGeminiRole(m.role),
      parts: [{ text: m.content }],
    }));

    const body: any = {
      contents,
      ...(systemMsg
        ? { systemInstruction: { role: "system", parts: [{ text: systemMsg.content }] } }
        : {}),
      generationConfig: { temperature: 0.8, maxOutputTokens: 512 },
    };

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        selectedModel,
      )}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    if (!r.ok) {
      const errBody = await r.text().catch(() => "");
      return res.status(r.status).json({ error: `Gemini error: ${r.statusText}`, details: errBody });
    }

    const json = await r.json();
    const text =
      json?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text || "").join("") || "";

    return res.status(200).json({ text });
  } catch (e: any) {
    return res.status(500).json({ error: "Gemini proxy failed", details: String(e) });
  }
}