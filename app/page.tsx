import { DEFAULT_USER_ID } from "@/lib/config";
import { getChinaDate, isTradingDay } from "@/lib/date";
import { getReportByDate, listReports } from "@/lib/services/repository";
import { Disclaimer } from "@/components/Disclaimer";
import { GenerateReportButton } from "@/components/GenerateReportButton";
import { ReportView } from "@/components/ReportView";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const today = getChinaDate();
  const report = await getReportByDate(DEFAULT_USER_ID, today);

  const latest = report ? null : (await listReports(DEFAULT_USER_ID, 1))[0];

  return (
    <>
      <div className="page-title">
        <div>
          <h2>今日</h2>
          <p className="muted">收盘后的一份安静市场日报</p>
        </div>
      </div>

      {report ? (
        <ReportView report={report.report_json} />
      ) : (
        <div className="panel">
          <h3>{isTradingDay(today) ? "小编还在整理今天的市场内容。" : "今天不是 A 股交易日。"}</h3>
          <p className="muted">
            {isTradingDay(today) ? "收盘后会为你生成今日日报。" : "可以回顾一下最近的市场故事。"}
          </p>
          <GenerateReportButton />
        </div>
      )}

      {!report && latest ? (
        <section className="section">
          <h3>最近一份日报</h3>
          <ReportView report={latest.report_json} />
        </section>
      ) : null}

      <Disclaimer />
    </>
  );
}
