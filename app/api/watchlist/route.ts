import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_USER_ID } from "@/lib/config";
import { addWatchlistItems, listWatchlist } from "@/lib/services/repository";
import { parseWatchlistInput } from "@/lib/stock";
import { watchlistCreateSchema, watchlistQuerySchema, zodErrorMessage } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const parsed = watchlistQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: zodErrorMessage(parsed.error) }, { status: 400 });

  const userId = parsed.data.userId ?? DEFAULT_USER_ID;
  const items = await listWatchlist(userId);
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const parsedBody = watchlistCreateSchema.safeParse(body);
  if (!parsedBody.success) return NextResponse.json({ error: zodErrorMessage(parsedBody.error) }, { status: 400 });

  const userId = parsedBody.data.userId ?? DEFAULT_USER_ID;
  const input = parsedBody.data.input;
  const parsed = parseWatchlistInput(input);

  if (!parsed.length) {
    return NextResponse.json({ error: "请输入股票代码、名称或批量列表。" }, { status: 400 });
  }

  const items = await addWatchlistItems(userId, parsed);
  return NextResponse.json({ items });
}
