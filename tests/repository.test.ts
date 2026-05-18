import { afterEach, describe, expect, it, vi } from "vitest";
import { resetMemoryStore } from "@/lib/store/memory";
import {
  addWatchlistItems,
  completeGenerationJob,
  failGenerationJob,
  getGenerationJob,
  listChatMessages,
  listWatchlist,
  saveChatMessage,
  saveReport,
  startGenerationJob
} from "@/lib/services/repository";

const userId = "00000000-0000-0000-0000-000000000001";

function disableSupabase() {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
}

describe("repository memory fallback", () => {
  afterEach(() => {
    resetMemoryStore();
    vi.unstubAllEnvs();
  });

  it("persists watchlist items idempotently in memory", async () => {
    disableSupabase();

    const created = await addWatchlistItems(userId, [
      { code: "002594.SZ", name: "比亚迪", market: "SZ", sector: "新能源 / 汽车" }
    ]);
    const duplicated = await addWatchlistItems(userId, [
      { code: "002594.SZ", name: "比亚迪", market: "SZ", sector: "新能源 / 汽车" }
    ]);

    const items = await listWatchlist(userId);
    expect(created[0].id).toBe(duplicated[0].id);
    expect(items.filter((item) => item.code === "002594.SZ")).toHaveLength(1);
  });

  it("persists reports and chat messages in memory", async () => {
    disableSupabase();

    const report = await saveReport(userId, {
      date: "2026-05-18",
      market_weather: { emoji: "sun", label: "平稳", reason: "测试" },
      editor_brief: "今天适合复盘。",
      what_happened: "市场信息整理。",
      daily_story: { title: "测试日报", body: "测试内容" },
      watchlist_updates: [],
      risk_notes: ["注意风险。"],
      closing_letter: "收盘了。",
      source_urls: []
    });

    await saveChatMessage(userId, "user", "今天怎么了？", report.id);
    await saveChatMessage(userId, "assistant", "先看信息。", report.id);

    const messages = await listChatMessages(userId, { date: "2026-05-18" });
    expect(messages.map((message) => message.role)).toEqual(["user", "assistant"]);
    expect(messages[0].related_report_id).toBe(report.id);
  });

  it("tracks generation job lifecycle in memory", async () => {
    disableSupabase();

    await startGenerationJob(userId, "2026-05-18");
    expect((await getGenerationJob(userId, "2026-05-18"))?.status).toBe("running");

    await failGenerationJob(userId, "2026-05-18", "provider failed");
    const failed = await getGenerationJob(userId, "2026-05-18");
    expect(failed?.status).toBe("failed");
    expect(failed?.error_message).toContain("provider failed");

    await startGenerationJob(userId, "2026-05-18");
    await completeGenerationJob(userId, "2026-05-18");
    const completed = await getGenerationJob(userId, "2026-05-18");
    expect(completed?.status).toBe("completed");
    expect(completed?.retry_count).toBe(1);
  });
});
