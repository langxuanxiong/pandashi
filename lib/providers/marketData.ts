import type { MarketEvent, WatchlistItem } from "@/lib/types";

export type MarketSnapshot = {
  date: string;
  headline: string;
  mood: "calm" | "mixed" | "risk_off";
  activeSectors: string[];
  summary: string;
};

export type StockNews = {
  code: string;
  name: string;
  title: string;
  summary: string;
  source_url: string;
};

export interface MarketDataProvider {
  getMarketSnapshot(date: string): Promise<MarketSnapshot>;
}

export interface NewsProvider {
  getStockNews(watchlist: WatchlistItem[]): Promise<StockNews[]>;
}

export class PublicMockMarketDataProvider implements MarketDataProvider {
  async getMarketSnapshot(date: string): Promise<MarketSnapshot> {
    return {
      date,
      headline: "A 股全天震荡，资金在消费、新能源和金融之间轮动",
      mood: "mixed",
      activeSectors: ["消费", "新能源", "金融"],
      summary:
        "公开信息显示，市场缺少单一强主线，部分板块有修复动作，但成交和情绪仍偏谨慎。V0.1 暂用可替换公开数据层，后续可接入 Tushare、AkShare 或 iFinD。"
    };
  }
}

export class PublicMockNewsProvider implements NewsProvider {
  async getStockNews(watchlist: WatchlistItem[]): Promise<StockNews[]> {
    return watchlist.map((item) => ({
      code: item.code,
      name: item.name,
      title: `${item.name}相关信息进入今日自选股观察`,
      summary: `${item.name}今日主要跟随所属板块波动，暂未发现需要单独放大的重大公开事件。`,
      source_url: "https://www.sse.com.cn/"
    }));
  }
}

type FetchLike = typeof fetch;

const PUBLIC_MARKET_SOURCES = [
  {
    name: "上海证券交易所",
    url: "https://www.sse.com.cn/",
    sectors: ["上证市场", "主板", "科创板"]
  },
  {
    name: "深圳证券交易所",
    url: "https://www.szse.cn/",
    sectors: ["深证市场", "创业板"]
  },
  {
    name: "中证指数有限公司",
    url: "https://www.csindex.com.cn/",
    sectors: ["指数", "市场基准"]
  }
];

export class PublicOfficialMarketEventProvider {
  constructor(private readonly fetcher: FetchLike = fetch) {}

  async getEvents(watchlist: WatchlistItem[], date: string): Promise<MarketEvent[]> {
    const reachableSources = await this.checkSources(PUBLIC_MARKET_SOURCES.map((source) => source.url));
    if (reachableSources.length === 0) {
      throw new Error("公开市场数据源暂时不可访问。");
    }

    const sourceUrls = PUBLIC_MARKET_SOURCES.map((source) => source.url);
    const events: MarketEvent[] = [
      {
        type: "market",
        title: `${date} A 股公开市场信息源已接入`,
        summary:
          "已接入上交所、深交所和中证指数等公开来源作为日报信息底座。本阶段先做公开来源可追溯整理，不替代实时行情终端。",
        related_codes: [],
        related_sectors: Array.from(new Set(PUBLIC_MARKET_SOURCES.flatMap((source) => source.sectors))),
        importance: 4,
        sentiment: "mixed",
        risk_note: "公开页面可能存在延迟，重要事项仍应以交易所公告和公司公告原文为准。",
        source_urls: sourceUrls
      },
      ...watchlist.map((item) => this.createWatchlistEvent(item))
    ];

    return events;
  }

  private async checkSources(urls: string[]) {
    const checks = await Promise.allSettled(urls.map((url) => this.isReachable(url)));
    return urls.filter((_url, index) => checks[index].status === "fulfilled" && checks[index].value);
  }

  private async isReachable(url: string) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    try {
      const response = await this.fetcher(url, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "User-Agent": "PandashiMarketDataBot/0.1"
        }
      });
      return response.ok;
    } catch {
      return false;
    } finally {
      clearTimeout(timeout);
    }
  }

  private createWatchlistEvent(item: WatchlistItem): MarketEvent {
    return {
      type: "stock",
      title: `${item.name}进入公开信息观察池`,
      summary: `${item.name}（${item.code}）已纳入今日自选股观察。本阶段优先关联交易所公开页面、公司信息页和板块标签，后续可替换为更细的公告/新闻接口。`,
      related_codes: [item.code],
      related_sectors: item.sector.split("/").map((sector) => sector.trim()).filter(Boolean),
      importance: 3,
      sentiment: "neutral",
      risk_note: "个股公开信息需要结合公告原文、行业变化和市场整体风险偏好一起理解。",
      source_urls: [stockSourceUrl(item)]
    };
  }
}

export function stockSourceUrl(item: Pick<WatchlistItem, "code" | "market">) {
  const code = item.code.slice(0, 6);
  if (item.market === "SH") {
    return `https://www.sse.com.cn/assortment/stock/list/info/company/index.shtml?COMPANY_CODE=${code}`;
  }
  if (item.market === "SZ") {
    return `https://www.szse.cn/certificate/individual/index.html?code=${code}`;
  }
  return "https://www.bse.cn/nq/listedcompany.html";
}
