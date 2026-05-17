import Link from "next/link";
import { notFound } from "next/navigation";
import { DEFAULT_USER_ID } from "@/lib/config";
import { formatChinaDate } from "@/lib/date";
import { getReportByDate } from "@/lib/services/repository";
import { Disclaimer } from "@/components/Disclaimer";
import { ReportView } from "@/components/ReportView";

export const dynamic = "force-dynamic";

export default async function ReportDetailPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const report = await getReportByDate(DEFAULT_USER_ID, date);
  if (!report) notFound();

  return (
    <>
      <div className="page-title">
        <div>
          <h2>{formatChinaDate(report.report_date)}</h2>
          <p className="muted">这一日的市场小编记录</p>
        </div>
        <Link className="btn" href="/">
          返回日报
        </Link>
      </div>

      <ReportView report={report.report_json} />
      <Disclaimer />
    </>
  );
}
