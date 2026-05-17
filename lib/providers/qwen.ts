import { hasQwenConfig } from "@/lib/config";
import type { LLMMessage } from "@/lib/providers/types";

export async function callQwen(messages: LLMMessage[]) {
  if (!hasQwenConfig()) return null;

  const response = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DASHSCOPE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.QWEN_MODEL ?? "qwen-plus",
      messages,
      temperature: 0.4,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    throw new Error(`Qwen request failed: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content as string | undefined;
}
