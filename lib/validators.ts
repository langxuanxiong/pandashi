import { z } from "zod";

export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式应为 YYYY-MM-DD。");

export const userIdSchema = z.string().uuid("userId 必须是 UUID。");

export const optionalUserIdSchema = userIdSchema.optional();

export const limitSchema = z.coerce.number().int().min(1).max(100).default(20);

export const dailyReportSchema = z.object({
  date: z.string(),
  market_weather: z.object({
    emoji: z.string(),
    label: z.string(),
    reason: z.string()
  }),
  editor_brief: z.string(),
  what_happened: z.string(),
  daily_story: z.object({
    title: z.string(),
    body: z.string()
  }),
  watchlist_updates: z.array(
    z.object({
      code: z.string(),
      name: z.string(),
      status: z.string(),
      plain_explanation: z.string(),
      risk_note: z.string()
    })
  ),
  risk_notes: z.array(z.string()),
  closing_letter: z.string(),
  source_urls: z.array(z.string())
});

export const watchlistQuerySchema = z.object({
  userId: optionalUserIdSchema
});

export const watchlistCreateSchema = z.object({
  userId: optionalUserIdSchema,
  input: z.string().trim().min(1, "请输入股票代码、名称或批量列表。").max(5000, "一次添加的内容太长了。")
});

export const watchlistDeleteSchema = z.object({
  userId: optionalUserIdSchema
});

export const reportsQuerySchema = z.object({
  userId: optionalUserIdSchema,
  date: dateSchema.optional(),
  limit: limitSchema
});

export const todayReportQuerySchema = z.object({
  userId: optionalUserIdSchema,
  date: dateSchema.optional()
});

export const chatQuerySchema = z.object({
  userId: optionalUserIdSchema,
  date: dateSchema.optional(),
  limit: limitSchema.default(30)
});

export const chatCreateSchema = z.object({
  userId: optionalUserIdSchema,
  date: dateSchema.optional(),
  question: z.string().trim().min(1, "请输入问题。").max(1000, "问题太长了，先拆成一个小问题吧。")
});

export const generateDailyReportSchema = z.object({
  userId: optionalUserIdSchema,
  date: dateSchema.optional(),
  source: z.string().max(80).optional()
});

export function zodErrorMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "请求参数不正确。";
}
