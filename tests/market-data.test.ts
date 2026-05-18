import { describe, expect, it, vi } from "vitest";
import { PublicOfficialMarketEventProvider, stockSourceUrl } from "@/lib/providers/marketData";

describe("public market data provider", () => {
  it("returns traceable events when public sources are reachable", async () => {
    const provider = new PublicOfficialMarketEventProvider(vi.fn(async () => ({ ok: true } as Response)));

    const events = await provider.getEvents(
      [{ id: "1", user_id: "u1", code: "600519.SH", name: "贵州茅台", market: "SH", sector: "白酒 / 消费", created_at: "2026-05-15T00:00:00.000Z" }],
      "2026-05-15"
    );

    expect(events[0].source_urls).toContain("https://www.sse.com.cn/");
    expect(events[1]).toMatchObject({
      type: "stock",
      related_codes: ["600519.SH"],
      source_urls: ["https://www.sse.com.cn/assortment/stock/list/info/company/index.shtml?COMPANY_CODE=600519"]
    });
  });

  it("throws when all public sources are unavailable", async () => {
    const provider = new PublicOfficialMarketEventProvider(vi.fn(async () => ({ ok: false } as Response)));

    await expect(provider.getEvents([], "2026-05-15")).rejects.toThrow("公开市场数据源暂时不可访问。");
  });

  it("builds official source urls by market", () => {
    expect(stockSourceUrl({ code: "600519.SH", market: "SH" })).toContain("COMPANY_CODE=600519");
    expect(stockSourceUrl({ code: "300750.SZ", market: "SZ" })).toContain("code=300750");
    expect(stockSourceUrl({ code: "430047.BJ", market: "BJ" })).toBe("https://www.bse.cn/nq/listedcompany.html");
  });
});
