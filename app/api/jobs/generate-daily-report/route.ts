import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_USER_ID } from "@/lib/config";
import { getChinaDate } from "@/lib/date";
import { generateDailyReport } from "@/lib/services/reportGenerator";
import { getReportByDate, listWatchlist, saveReport } from "@/lib/services/repository";

export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const providedSecret = request.headers.get("x-cron-secret");
  if (secret && secret !== "change-me" && providedSecret !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const userId = body.userId ?? DEFAULT_USER_ID;
  const date = body.date ?? getChinaDate();
  const existing = await getReportByDate(userId, date);
  if (existing) {
    return NextResponse.json({ status: "skipped", report: existing });
  }

  const watchlist = await listWatchlist(userId);
  const report = await generateDailyReport(watchlist, date);
  const row = await saveReport(userId, report);
  return NextResponse.json({ status: "completed", report: row });
}

