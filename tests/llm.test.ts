import { afterEach, describe, expect, it, vi } from "vitest";
import { callLLM } from "@/lib/providers/llm";

describe("llm provider", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("falls back without calling a paid provider when DeepSeek is not configured", async () => {
    vi.stubEnv("LLM_PROVIDER", "deepseek");
    vi.stubEnv("DEEPSEEK_API_KEY", "");

    await expect(callLLM([{ role: "user", content: "hello" }])).resolves.toBeNull();
  });

  it("falls back when DeepSeek is configured but unavailable", async () => {
    vi.stubEnv("LLM_PROVIDER", "deepseek");
    vi.stubEnv("DEEPSEEK_API_KEY", "test-key");
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => "unauthorized"
    } as Response);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);

    await expect(callLLM([{ role: "user", content: "hello" }])).resolves.toBeNull();
  });
});
