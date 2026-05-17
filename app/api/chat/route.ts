import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_USER_ID } from "@/lib/config";
import { getChinaDate } from "@/lib/date";
import { answerEditorQuestion } from "@/lib/services/chat";
import { getReportByDate, listWatchlist, saveChatMessage } from "@/lib/services/repository";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const userId = body.userId ?? DEFAULT_USER_ID;
  const question = String(body.question ?? "").trim();
  if (!question) return NextResponse.json({ error: "请输入问题。" }, { status: 400 });

  const [watchlist, report] = await Promise.all([listWatchlist(userId), getReportByDate(userId, body.date ?? getChinaDate())]);
  const answer = await answerEditorQuestion({ question, report, watchlist });
  await saveChatMessage(userId, "user", question, report?.id);
  await saveChatMessage(userId, "assistant", answer, report?.id);

  return NextResponse.json({ answer });
}

