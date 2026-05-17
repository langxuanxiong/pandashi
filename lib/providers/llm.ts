import { hasDeepSeekConfig, hasQwenConfig } from "@/lib/config";
import { callDeepSeek } from "@/lib/providers/deepseek";
import { callQwen } from "@/lib/providers/qwen";
import type { LLMMessage } from "@/lib/providers/types";

type LLMOptions = {
  json?: boolean;
};

export async function callLLM(messages: LLMMessage[], options?: LLMOptions) {
  const provider = (process.env.LLM_PROVIDER ?? "deepseek").toLowerCase();

  try {
    if (provider === "qwen") {
      return await callQwen(messages);
    }

    if (hasDeepSeekConfig()) {
      return await callDeepSeek(messages, options);
    }

    if (provider === "auto" && hasQwenConfig()) {
      return await callQwen(messages);
    }
  } catch (error) {
    console.warn(error);
    return null;
  }

  return null;
}
