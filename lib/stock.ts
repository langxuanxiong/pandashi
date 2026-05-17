import type { WatchlistItem } from "@/lib/types";

const knownStocks: Record<string, { code: string; name: string; market: WatchlistItem["market"]; sector: string }> = {
  "600519": { code: "600519.SH", name: "贵州茅台", market: "SH", sector: "白酒 / 消费 / 大盘蓝筹" },
  "300750": { code: "300750.SZ", name: "宁德时代", market: "SZ", sector: "新能源 / 动力电池 / 创业板" },
  "002594": { code: "002594.SZ", name: "比亚迪", market: "SZ", sector: "新能源车 / 汽车 / 制造" },
  "601318": { code: "601318.SH", name: "中国平安", market: "SH", sector: "保险 / 金融 / 大盘蓝筹" },
  "000001": { code: "000001.SZ", name: "平安银行", market: "SZ", sector: "银行 / 金融 / 深市主板" }
};

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
      const digits = normalized?.slice(0, 6);
      const known = digits ? knownStocks[digits] : undefined;
      const name = known?.name ?? line.replace(/\d{6}(?:\.(?:SH|SZ|BJ))?/i, "").trim() ?? "待确认股票";
      const market = (normalized?.split(".")[1] ?? known?.market ?? "SZ") as WatchlistItem["market"];

      return {
        code: normalized ?? `${line}.SZ`,
        name: name || known?.name || "待确认股票",
        market,
        sector: known?.sector ?? "待补充板块"
      };
    });
}

