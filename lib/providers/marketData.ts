import type { WatchlistItem } from "@/lib/types";

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

