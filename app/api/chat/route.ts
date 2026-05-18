import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_USER_ID } from "@/lib/config";
import { getChinaDate } from "@/lib/date";
import { answerEditorQuestion } from "@/lib/services/chat";
import { getReportByDate, listChatMessages, listWatchlist, saveChatMessage } from "@/lib/services/repository";
import { chatCreateSchema, chatQuerySchema, zodErrorMessage } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const parsed = chatQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: zodErrorMessage(parsed.error) }, { status: 400 });

  const userId = parsed.data.userId ?? DEFAULT_USER_ID;
  const messages = await listChatMessages(userId, { date: parsed.data.date, limit: parsed.data.limit });
  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const parsedBody = chatCreateSchema.safeParse(body);
  if (!parsedBody.success) return NextResponse.json({ error: zodErrorMessage(parsedBody.error) }, { status: 400 });

  const userId = parsedBody.data.userId ?? DEFAULT_USER_ID;
  const question = parsedBody.data.question;
  const [watchlist, report] = await Promise.all([listWatchlist(userId), getReportByDate(userId, parsedBody.data.date ?? getChinaDate())]);
  const answer = await answerEditorQuestion({ question, report, watchlist });
  await saveChatMessage(userId, "user", question, report?.id);
  await saveChatMessage(userId, "assistant", answer, report?.id);

  return NextResponse.json({ answer });
}
