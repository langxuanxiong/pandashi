import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_USER_ID } from "@/lib/config";
import { getChinaDate } from "@/lib/date";
import { generateDailyReport } from "@/lib/services/reportGenerator";
import {
  completeGenerationJob,
  failGenerationJob,
  getReportByDate,
  listWatchlist,
  saveReport,
  startGenerationJob
} from "@/lib/services/repository";
import { generateDailyReportSchema, zodErrorMessage } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const providedSecret = request.headers.get("x-cron-secret");
  if (secret && secret !== "change-me" && providedSecret !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsedBody = generateDailyReportSchema.safeParse(body);
  if (!parsedBody.success) return NextResponse.json({ error: zodErrorMessage(parsedBody.error) }, { status: 400 });

  const userId = parsedBody.data.userId ?? DEFAULT_USER_ID;
  const date = parsedBody.data.date ?? getChinaDate();
  const existing = await getReportByDate(userId, date);
  if (existing) {
    return NextResponse.json({ status: "skipped", report: existing });
  }

  await startGenerationJob(userId, date);

  try {
    const watchlist = await listWatchlist(userId);
    const report = await generateDailyReport(watchlist, date);
    const row = await saveReport(userId, report);
    await completeGenerationJob(userId, date);
    return NextResponse.json({ status: "completed", report: row });
  } catch (error) {
    const message = error instanceof Error ? error.message : "日报生成失败。";
    await failGenerationJob(userId, date, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
