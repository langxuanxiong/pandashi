import { hasDeepSeekConfig } from "@/lib/config";
import type { LLMMessage } from "@/lib/providers/types";

export async function callDeepSeek(messages: LLMMessage[], options?: { json?: boolean }) {
  if (!hasDeepSeekConfig()) return null;

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.DEEPSEEK_MODEL ?? "deepseek-v4-flash",
      messages,
      temperature: 0.4,
      ...(options?.json ? { response_format: { type: "json_object" } } : {})
    })
  });

  if (!response.ok) {
    throw new Error(`DeepSeek request failed: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content as string | undefined;
}
