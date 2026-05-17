import { describe, expect, it } from "vitest";
import { searchCatalogStocks } from "@/lib/stockCatalog";
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

  it("accepts known stock names and ignores unknown free text", () => {
    const items = parseWatchlistInput("贵州茅台\n随便写一个名字");
    expect(items).toHaveLength(1);
    expect(items[0].code).toBe("600519.SH");
  });

  it("parses stocks from the local catalog beyond the initial demo list", () => {
    const items = parseWatchlistInput("招商银行\n688981");
    expect(items.map((item) => item.code)).toEqual(["600036.SH", "688981.SH"]);
  });

  it("searches the local catalog by name and code", () => {
    expect(searchCatalogStocks("中芯")[0].code).toBe("688981.SH");
    expect(searchCatalogStocks("600036")[0].name).toBe("招商银行");
  });
});
