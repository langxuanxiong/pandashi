import { DEFAULT_USER_ID } from "@/lib/config";
import { getChinaDate, isTradingDay } from "@/lib/date";
import { getReportByDate, listReports } from "@/lib/services/repository";
import { Disclaimer } from "@/components/Disclaimer";
import { GenerateReportButton } from "@/components/GenerateReportButton";
import { ReportSummaryCard } from "@/components/ReportSummaryCard";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const today = getChinaDate();
  const todayReport = await getReportByDate(DEFAULT_USER_ID, today);
  const reports = await listReports(DEFAULT_USER_ID, 30);
  const featured = todayReport ?? reports[0];
  const historicalReports = reports.filter((report) => report.report_date !== featured?.report_date);

  return (
    <>
      <div className="page-title">
        <div>
          <h2>日报</h2>
          <p className="muted">今日最新文章和往期市场记录</p>
        </div>
      </div>

      {featured ? (
        <section className="daily-front">
          <div className="front-label">
            <span className="eyebrow">{todayReport ? "今日最新" : "最近一篇"}</span>
            {!todayReport ? <GenerateReportButton /> : null}
          </div>
          <ReportSummaryCard report={featured} variant="featured" />
        </section>
      ) : (
        <div className="frontpage-empty">
          <div className="eyebrow">每日头版</div>
          <h3>{isTradingDay(today) ? "小编还在整理今天的市场内容。" : "今天不是 A 股交易日。"}</h3>
          <p className="muted">
            {isTradingDay(today) ? "收盘后会为你生成今日日报。" : "可以回顾一下最近的市场故事。"}
          </p>
          <GenerateReportButton />
        </div>
      )}

      <section className="archive-panel compact-archive">
        <div className="section-heading">
          <div>
            <h3>历史文章</h3>
            <p className="muted">日期、标题和摘要，点开后阅读完整日报。</p>
          </div>
        </div>
        {historicalReports.length === 0 ? <p className="muted">还没有更多历史日报。</p> : null}
        <div className="archive-list">
          {historicalReports.map((report) => (
            <ReportSummaryCard report={report} key={report.id} />
          ))}
        </div>
      </section>

      {todayReport ? (
        <section className="editor-action">
          <div>
            <h3>重新整理今日演示日报</h3>
            <p className="muted">本地演示数据会重新生成一份今日文章。</p>
          </div>
          <GenerateReportButton />
        </section>
      ) : null}

      <Disclaimer />
    </>
  );
}
