import Link from "next/link";
import type { DailyReportRow } from "@/lib/types";
import { formatChinaDate } from "@/lib/date";

type ReportSummaryCardProps = {
  report: DailyReportRow;
  variant?: "featured" | "compact";
};

function summaryPoints(report: DailyReportRow) {
  const data = report.report_json;
  const watchlistPoint = data.watchlist_updates[0]
    ? `${data.watchlist_updates[0].name}：${data.watchlist_updates[0].plain_explanation}`
    : data.daily_story.body;

  return [data.what_happened, watchlistPoint, data.risk_notes[0]].filter(Boolean).slice(0, 3);
}

export function ReportSummaryCard({ report, variant = "compact" }: ReportSummaryCardProps) {
  const data = report.report_json;
  const points = summaryPoints(report);

  return (
    <Link className={`report-summary ${variant}`} href={`/reports/${report.report_date}`}>
      <div className="summary-kicker">
        <span>{formatChinaDate(report.report_date)}</span>
        <span className="tag">
          {data.market_weather.emoji} {data.market_weather.label}
        </span>
      </div>
      <h3>{data.daily_story.title}</h3>
      <p>{data.editor_brief}</p>
      {variant === "featured" ? (
        <ul className="summary-points">
          {points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      ) : null}
      <span className="read-link">{variant === "featured" ? "进入完整日报" : "阅读"}</span>
    </Link>
  );
}
