import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_USER_ID } from "@/lib/config";
import { listReports } from "@/lib/services/repository";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId") ?? DEFAULT_USER_ID;
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? "20");
  const reports = await listReports(userId, limit);
  return NextResponse.json({ reports });
}

