import { callQwen } from "@/lib/providers/qwen";
import { asksForInvestmentAdvice, safeAlternative, sanitizeInvestmentLanguage } from "@/lib/safety";
import type { DailyReportRow, WatchlistItem } from "@/lib/types";

export async function answerEditorQuestion({
  question,
  report,
  watchlist
}: {
  question: string;
  report?: DailyReportRow | null;
  watchlist: WatchlistItem[];
}) {
  if (asksForInvestmentAdvice(question)) {
    return safeAlternative();
  }

  const qwenContent = await callQwen([
    {
      role: "system",
      content:
        "你是冷静、温柔、克制、说人话的 A 股市场小编。你不荐股、不预测收益、不提供买卖建议，只解释信息、整理风险和帮助用户复盘。请用简洁中文回答。"
    },
    {
      role: "user",
      content: `用户问题：${question}\n今日日报：${JSON.stringify(report?.report_json ?? null)}\n自选股：${JSON.stringify(watchlist)}`
    }
  ]);

  if (qwenContent) return sanitizeInvestmentLanguage(qwenContent);

  const stock = watchlist.find((item) => question.includes(item.name) || question.includes(item.code.slice(0, 6)));
  if (stock) {
    return `${stock.name}可以先从三件事理解：它今天是否跟随所属板块波动，是否有新的公告或新闻，以及市场风险偏好有没有变化。我不能给买卖建议，但可以帮你把相关信息拆开看。`;
  }

  if (report) {
    return `今天的重点是：${report.report_json.editor_brief} 风险上，${report.report_json.risk_notes[0]} 我们先把信息看清楚，不急着把一天的波动放大成结论。`;
  }

  return "小编现在还没有拿到今日日报。你可以先添加自选股，或手动生成一份收盘日报，我再帮你继续追问。";
}

