import { getChinaDate } from "@/lib/date";
import { PublicMockMarketDataProvider, PublicMockNewsProvider } from "@/lib/providers/marketData";
import { callQwen } from "@/lib/providers/qwen";
import { containsUnsafeInvestmentAdvice, sanitizeInvestmentLanguage } from "@/lib/safety";
import { dailyReportSchema } from "@/lib/validators";
import type { DailyReport, MarketEvent, WatchlistItem } from "@/lib/types";

const systemPrompt = `你是一个冷静、温柔、克制、说人话的 A 股市场小编。你只整理市场信息、解释新闻、提醒风险、降低焦虑。禁止荐股、买卖建议、预测收益或鼓励频繁交易。`;

export async function extractEvents(watchlist: WatchlistItem[], date = getChinaDate()): Promise<MarketEvent[]> {
  const marketProvider = new PublicMockMarketDataProvider();
  const newsProvider = new PublicMockNewsProvider();
  const [market, stockNews] = await Promise.all([
    marketProvider.getMarketSnapshot(date),
    newsProvider.getStockNews(watchlist)
  ]);

  const qwenContent = await callQwen([
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `请把以下市场信息提取为 JSON，键名为 events。市场：${JSON.stringify(market)} 自选股新闻：${JSON.stringify(stockNews)}`
    }
  ]);

  if (qwenContent) {
    try {
      const parsed = JSON.parse(qwenContent) as { events?: MarketEvent[] };
      if (Array.isArray(parsed.events)) return parsed.events;
    } catch {
      // Fall back to deterministic events below.
    }
  }

  return [
    {
      type: "market",
      title: market.headline,
      summary: market.summary,
      related_codes: [],
      related_sectors: market.activeSectors,
      importance: 4,
      sentiment: "mixed",
      risk_note: "热点轮动较快，不适合只根据一天涨跌下结论。",
      source_urls: ["https://www.sse.com.cn/", "https://www.szse.cn/"]
    },
    ...stockNews.map((news): MarketEvent => ({
      type: "stock",
      title: news.title,
      summary: news.summary,
      related_codes: [news.code],
      related_sectors: [],
      importance: 3,
      sentiment: "neutral",
      risk_note: "个股信息需要结合公告、行业和市场情绪一起理解。",
      source_urls: [news.source_url]
    }))
  ];
}

export async function generateDailyReport(watchlist: WatchlistItem[], date = getChinaDate()): Promise<DailyReport> {
  const events = await extractEvents(watchlist, date);
  const qwenContent = await callQwen([
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `请根据以下事件和自选股生成 A 股市场小编日报 JSON。必须包含 date, market_weather, editor_brief, what_happened, daily_story, watchlist_updates, risk_notes, closing_letter, source_urls。不要荐股，不要预测涨跌，不要买卖建议。日期：${date}。自选股：${JSON.stringify(watchlist)}。事件：${JSON.stringify(events)}`
    }
  ]);

  if (qwenContent) {
    try {
      const parsed = dailyReportSchema.parse(JSON.parse(qwenContent));
      return sanitizeReport(parsed);
    } catch {
      // Fall back to deterministic report below.
    }
  }

  return sanitizeReport({
    date,
    market_weather: {
      emoji: "🌫",
      label: "震荡观望",
      reason: "热点轮动较快，资金还没有形成特别统一的主线。"
    },
    editor_brief: "今天市场更像是在试探方向，而不是给出一个很明确的答案。",
    what_happened:
      "A 股整体偏震荡，消费、新能源和金融方向都有资金关注，但持续性仍需要观察。今天更适合先理解信息，而不是急着下结论。",
    daily_story: {
      title: "资金还在寻找新的确定性",
      body:
        "今天的主线不是全面反攻，而是资金在几个方向之间试探。对普通投资者来说，重点不是追每一个热点，而是看清哪些变化和自己的自选股真正相关。"
    },
    watchlist_updates: watchlist.map((item) => ({
      code: item.code,
      name: item.name,
      status: "平稳观察",
      plain_explanation: `${item.name}今日主要跟随${item.sector.split("/")[0].trim()}方向波动，暂未发现需要单独放大的重大公开事件。`,
      risk_note: "后续仍需要关注行业消息、公告变化和市场风险偏好的切换。"
    })),
    risk_notes: ["热点切换较快，不适合只因为一天涨跌改变全部判断。", "公开信息可能存在滞后，重要事项应以交易所公告和公司公告为准。"],
    closing_letter:
      "今天市场已经收盘了。可以复盘，但不用把每一次波动都当成对自己的否定。今晚先把生活还给自己，明天再慢慢看。",
    source_urls: Array.from(new Set(events.flatMap((event) => event.source_urls)))
  });
}

function sanitizeReport(report: DailyReport): DailyReport {
  const text = JSON.stringify(report);
  const cleaned = containsUnsafeInvestmentAdvice(text)
    ? JSON.parse(sanitizeInvestmentLanguage(text))
    : report;
  return dailyReportSchema.parse(cleaned);
}

