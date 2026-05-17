import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_USER_ID } from "@/lib/config";
import { deleteWatchlistItem } from "@/lib/services/repository";

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const userId = request.nextUrl.searchParams.get("userId") ?? DEFAULT_USER_ID;
  await deleteWatchlistItem(userId, id);
  return NextResponse.json({ ok: true });
}

