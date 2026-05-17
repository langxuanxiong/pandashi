import { describe, expect, it } from "vitest";
import { dailyReportSchema } from "@/lib/validators";

describe("daily report schema", () => {
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
});

