import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_USER_ID } from "@/lib/config";
import { deleteWatchlistItem } from "@/lib/services/repository";
import { watchlistDeleteSchema, zodErrorMessage } from "@/lib/validators";

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const parsed = watchlistDeleteSchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: zodErrorMessage(parsed.error) }, { status: 400 });

  const userId = parsed.data.userId ?? DEFAULT_USER_ID;
  await deleteWatchlistItem(userId, id);
  return NextResponse.json({ ok: true });
}
