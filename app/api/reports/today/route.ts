import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_USER_ID } from "@/lib/config";
import { getChinaDate, isTradingDay } from "@/lib/date";
import { getReportByDate, listReports } from "@/lib/services/repository";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId") ?? DEFAULT_USER_ID;
  const date = request.nextUrl.searchParams.get("date") ?? getChinaDate();
  const [report, latest] = await Promise.all([getReportByDate(userId, date), listReports(userId, 1)]);

  if (report?.status === "completed") {
    return NextResponse.json({ status: "completed", report });
  }

  if (!isTradingDay(date)) {
    return NextResponse.json({
      status: "non_trading_day",
      message: "今天不是 A 股交易日。可以回顾一下最近的市场故事。",
      latestReport: latest[0]
    });
  }

  return NextResponse.json({
    status: report?.status === "failed" ? "failed" : "pending",
    message:
      report?.status === "failed"
        ? "今天的日报生成失败了。你可以稍后再试，或查看最近一份日报。"
        : "小编还在整理今天的市场内容。收盘后会为你生成今日日报。",
    latestReport: latest[0]
  });
}

