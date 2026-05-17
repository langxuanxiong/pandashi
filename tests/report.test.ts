import { afterEach, describe, expect, it, vi } from "vitest";
import { generateDailyReport } from "@/lib/services/reportGenerator";
import { dailyReportSchema } from "@/lib/validators";

describe("daily report schema", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("validates the V0.1 report contract", () => {
    const parsed = dailyReportSchema.parse({
      date: "2026-05-15",
      market_weather: { emoji: "🌫", label: "震荡观望", reason: "热点轮动较快" },
      editor_brief: "今天市场更像是在试探方向。",
      what_happened: "A 股整体偏震荡。",
      daily_story: { title: "资金还在寻找新的主线", body: "市场没有形成特别统一的方向。" },
      watchlist_updates: [],
      risk_notes: ["不适合只根据一天涨跌做决定。"],
      closing_letter: "今天市场已经收盘了。",
      source_urls: []
    });

    expect(parsed.market_weather.label).toBe("震荡观望");
  });

  it("generates a complete mock report when no model provider is configured", async () => {
    vi.stubEnv("DEEPSEEK_API_KEY", "");
    vi.stubEnv("DASHSCOPE_API_KEY", "");

    const report = await generateDailyReport(
      [{ id: "1", user_id: "u1", code: "600519.SH", name: "贵州茅台", market: "SH", sector: "白酒 / 消费", created_at: "2026-05-15T00:00:00.000Z" }],
      "2026-05-15"
    );

    expect(report.watchlist_updates[0].name).toBe("贵州茅台");
    expect(report.what_happened).toContain("演示数据");
    expect(dailyReportSchema.parse(report).date).toBe("2026-05-15");
  });
});
