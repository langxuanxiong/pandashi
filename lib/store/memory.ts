import { DEFAULT_USER_ID } from "@/lib/config";
import { getChinaDate } from "@/lib/date";
import type { DailyReport, DailyReportRow, WatchlistItem } from "@/lib/types";

type MemoryState = {
  watchlist: WatchlistItem[];
  reports: DailyReportRow[];
  chats: Array<{ id: string; user_id: string; role: string; content: string; related_report_id?: string; created_at: string }>;
};

const globalStore = globalThis as typeof globalThis & { __pandashiMemory?: MemoryState };

export function memoryStore() {
  if (!globalStore.__pandashiMemory) {
    const now = new Date().toISOString();
    globalStore.__pandashiMemory = {
      watchlist: [
        {
          id: crypto.randomUUID(),
          user_id: DEFAULT_USER_ID,
          code: "600519.SH",
          name: "贵州茅台",
          market: "SH",
          sector: "白酒 / 消费 / 大盘蓝筹",
          created_at: now
        },
        {
          id: crypto.randomUUID(),
          user_id: DEFAULT_USER_ID,
          code: "300750.SZ",
          name: "宁德时代",
          market: "SZ",
          sector: "新能源 / 动力电池 / 创业板",
          created_at: now
        }
      ],
      reports: [],
      chats: []
    };
  }

  return globalStore.__pandashiMemory;
}

export function createReportRow(userId: string, report: DailyReport): DailyReportRow {
  return {
    id: crypto.randomUUID(),
    user_id: userId,
    report_date: report.date || getChinaDate(),
    report_json: report,
    status: "completed",
    created_at: new Date().toISOString()
  };
}

