import { z } from "zod";

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

