import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_USER_ID } from "@/lib/config";
import { getReportByDate, listReports } from "@/lib/services/repository";
import { reportsQuerySchema, zodErrorMessage } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const parsed = reportsQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: zodErrorMessage(parsed.error) }, { status: 400 });

  const userId = parsed.data.userId ?? DEFAULT_USER_ID;
  const date = parsed.data.date;
  if (date) {
    const report = await getReportByDate(userId, date);
    return report ? NextResponse.json({ report }) : NextResponse.json({ error: "日报不存在。" }, { status: 404 });
  }

  const reports = await listReports(userId, parsed.data.limit);
  return NextResponse.json({ reports });
}
