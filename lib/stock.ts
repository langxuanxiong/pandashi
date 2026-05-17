import type { WatchlistItem } from "@/lib/types";
import { findCatalogStock } from "@/lib/stockCatalog";

export function normalizeStockCode(raw: string) {
  const trimmed = raw.trim().toUpperCase();
  const match = trimmed.match(/(\d{6})(?:\.(SH|SZ|BJ))?/);
  if (!match) return null;

  const code = match[1];
  const explicitMarket = match[2] as WatchlistItem["market"] | undefined;
  const market =
    explicitMarket ?? (code.startsWith("6") ? "SH" : code.startsWith("8") || code.startsWith("4") ? "BJ" : "SZ");

  return `${code}.${market}`;
}

export function parseWatchlistInput(input: string) {
  return input
    .split(/\n|,|，|;/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const normalized = normalizeStockCode(line);
      const stock = findCatalogStock(line);
      if (!stock) return null;

      const market = (normalized?.split(".")[1] ?? stock.market) as WatchlistItem["market"];

      return {
        code: normalized ?? stock.code,
        name: stock.name,
        market,
        sector: stock.sector
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}
