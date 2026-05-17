import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_USER_ID } from "@/lib/config";
import { addWatchlistItems, listWatchlist } from "@/lib/services/repository";
import { parseWatchlistInput } from "@/lib/stock";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId") ?? DEFAULT_USER_ID;
  const items = await listWatchlist(userId);
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const userId = body.userId ?? DEFAULT_USER_ID;
  const input = String(body.input ?? "");
  const parsed = parseWatchlistInput(input);

  if (!parsed.length) {
    return NextResponse.json({ error: "请输入股票代码、名称或批量列表。" }, { status: 400 });
  }

  const items = await addWatchlistItems(userId, parsed);
  return NextResponse.json({ items });
}

