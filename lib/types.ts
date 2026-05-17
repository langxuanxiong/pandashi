export type MarketWeather = {
  emoji: string;
  label: string;
  reason: string;
};

export type WatchlistItem = {
  id: string;
  user_id: string;
  code: string;
  name: string;
  market: "SH" | "SZ" | "BJ";
  sector: string;
  created_at: string;
};

export type MarketEvent = {
  type: "market" | "sector" | "stock";
  title: string;
  summary: string;
  related_codes: string[];
  related_sectors: string[];
  importance: number;
  sentiment: "positive" | "neutral" | "mixed" | "negative";
  risk_note?: string;
  source_urls: string[];
};

export type DailyReport = {
  date: string;
  market_weather: MarketWeather;
  editor_brief: string;
  what_happened: string;
  daily_story: { title: string; body: string };
  watchlist_updates: Array<{
    code: string;
    name: string;
    status: string;
    plain_explanation: string;
    risk_note: string;
  }>;
  risk_notes: string[];
  closing_letter: string;
  source_urls: string[];
};

export type DailyReportRow = {
  id: string;
  user_id: string;
  report_date: string;
  report_json: DailyReport;
  report_markdown?: string | null;
  status: "completed" | "failed" | "pending";
  created_at: string;
};

export type TodayReportResponse =
  | { status: "completed"; report: DailyReportRow }
  | { status: "pending"; message: string; latestReport?: DailyReportRow }
  | { status: "failed"; message: string; latestReport?: DailyReportRow }
  | { status: "non_trading_day"; message: string; latestReport?: DailyReportRow };

