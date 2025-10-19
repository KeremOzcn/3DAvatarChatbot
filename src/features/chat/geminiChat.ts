import { Message } from "./messages";
import { config } from "@/utils/config";

/**
 * Şimdilik tam cevabı tek seferde akışa koyar (non-stream).
 * İleride token bazlı streaming'e yükseltilebilir.
 */
export async function getGeminiChatResponseStream(messages: Message[]): Promise<ReadableStream> {
  const res = await fetch("/api/geminiChat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, model: config("gemini_model") }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`Gemini chat error (${res.status}): ${err}`);
  }

  const data = (await res.json()) as { text: string };
  const text = data?.text ?? "";

  const stream = new ReadableStream({
    start(controller) {
      if (text) controller.enqueue(text);
      controller.close();
    },
  });

  return stream;
}