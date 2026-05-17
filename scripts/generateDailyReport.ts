import { DEFAULT_USER_ID } from "@/lib/config";
import { getChinaDate } from "@/lib/date";
import { generateDailyReport } from "@/lib/services/reportGenerator";
import { getReportByDate, listWatchlist, saveReport } from "@/lib/services/repository";

async function main() {
  const userId = process.env.USER_ID ?? DEFAULT_USER_ID;
  const date = process.env.REPORT_DATE ?? getChinaDate();
  const existing = await getReportByDate(userId, date);
  if (existing) {
    console.log(`日报已存在：${date} ${existing.id}`);
    return;
  }

  const watchlist = await listWatchlist(userId);
  const report = await generateDailyReport(watchlist, date);
  const row = await saveReport(userId, report);
  console.log(`日报生成完成：${row.report_date} ${row.id}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

