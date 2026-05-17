import Link from "next/link";
import { DEFAULT_USER_ID } from "@/lib/config";
import { formatChinaDate } from "@/lib/date";
import { listReports } from "@/lib/services/repository";
import { Disclaimer } from "@/components/Disclaimer";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const reports = await listReports(DEFAULT_USER_ID, 30);

  return (
    <>
      <div className="page-title">
        <div>
          <h2>日报</h2>
          <p className="muted">回看过去的市场故事</p>
        </div>
      </div>

      <section className="panel">
        {reports.length === 0 ? <p className="muted">还没有历史日报。首页会自动生成一份本地演示日报。</p> : null}
        <div className="list">
          {reports.map((report) => (
            <Link className="report-row" href={`/reports/${report.report_date}`} key={report.id}>
              <div className="row-head">
                <strong>{formatChinaDate(report.report_date)}</strong>
                <span className="tag">
                  {report.report_json.market_weather.emoji} {report.report_json.market_weather.label}
                </span>
              </div>
              <p>{report.report_json.editor_brief}</p>
            </Link>
          ))}
        </div>
      </section>

      <Disclaimer />
    </>
  );
}
