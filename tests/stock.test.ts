import { describe, expect, it } from "vitest";
import { normalizeStockCode, parseWatchlistInput } from "@/lib/stock";

describe("stock parsing", () => {
  it("normalizes A-share market suffixes", () => {
    expect(normalizeStockCode("600519")).toBe("600519.SH");
    expect(normalizeStockCode("300750")).toBe("300750.SZ");
  });

  it("parses pasted watchlist rows", () => {
    const items = parseWatchlistInput("600519 贵州茅台\n300750 宁德时代");
    expect(items).toHaveLength(2);
    expect(items[0].name).toBe("贵州茅台");
    expect(items[1].code).toBe("300750.SZ");
  });
});

