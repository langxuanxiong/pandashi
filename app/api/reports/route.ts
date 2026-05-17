import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_USER_ID } from "@/lib/config";
import { getReportByDate, listReports } from "@/lib/services/repository";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId") ?? DEFAULT_USER_ID;
  const date = request.nextUrl.searchParams.get("date");
  if (date) {
    const report = await getReportByDate(userId, date);
    return report ? NextResponse.json({ report }) : NextResponse.json({ error: "日报不存在。" }, { status: 404 });
  }

  const limit = Number(request.nextUrl.searchParams.get("limit") ?? "20");
  const reports = await listReports(userId, limit);
  return NextResponse.json({ reports });
}
