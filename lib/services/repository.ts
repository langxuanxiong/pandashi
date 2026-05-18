import { getSupabaseAdmin } from "@/lib/supabase";
import { createReportRow, memoryStore } from "@/lib/store/memory";
import type {
  ChatMessageRow,
  DailyReport,
  DailyReportRow,
  GenerationJobRow,
  WatchlistItem
} from "@/lib/types";

export async function listWatchlist(userId: string): Promise<WatchlistItem[]> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("watchlist_items")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  return memoryStore().watchlist.filter((item) => item.user_id === userId);
}

export async function addWatchlistItems(
  userId: string,
  items: Array<Omit<WatchlistItem, "id" | "user_id" | "created_at">>
) {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("watchlist_items")
      .upsert(
        items.map((item) => ({ ...item, user_id: userId })),
        { onConflict: "user_id,code" }
      )
      .select("*");
    if (error) throw error;
    return data ?? [];
  }

  const store = memoryStore();
  const created = items.map((item) => {
    const existing = store.watchlist.find((candidate) => candidate.user_id === userId && candidate.code === item.code);
    if (existing) return existing;

    const next: WatchlistItem = {
      ...item,
      id: crypto.randomUUID(),
      user_id: userId,
      created_at: new Date().toISOString()
    };
    store.watchlist.push(next);
    return next;
  });

  return created;
}

export async function deleteWatchlistItem(userId: string, id: string) {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("watchlist_items").delete().eq("user_id", userId).eq("id", id);
    if (error) throw error;
    return;
  }

  const store = memoryStore();
  store.watchlist = store.watchlist.filter((item) => item.user_id !== userId || item.id !== id);
}

export async function getReportByDate(userId: string, date: string): Promise<DailyReportRow | null> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("daily_reports")
      .select("*")
      .eq("user_id", userId)
      .eq("report_date", date)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  return memoryStore().reports.find((report) => report.user_id === userId && report.report_date === date) ?? null;
}

export async function listReports(userId: string, limit = 20): Promise<DailyReportRow[]> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("daily_reports")
      .select("*")
      .eq("user_id", userId)
      .order("report_date", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  }

  return memoryStore()
    .reports.filter((report) => report.user_id === userId)
    .sort((a, b) => b.report_date.localeCompare(a.report_date))
    .slice(0, limit);
}

export async function saveReport(userId: string, report: DailyReport): Promise<DailyReportRow> {
  const existing = await getReportByDate(userId, report.date);
  if (existing) return existing;

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("daily_reports")
      .upsert({
        user_id: userId,
        report_date: report.date,
        report_json: report,
        status: "completed"
      }, { onConflict: "user_id,report_date" })
      .select("*")
      .single();
    if (error) throw error;
    return data;
  }

  const row = createReportRow(userId, report);
  memoryStore().reports.push(row);
  return row;
}

export async function saveChatMessage(
  userId: string,
  role: "user" | "assistant",
  content: string,
  relatedReportId?: string
): Promise<ChatMessageRow> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        user_id: userId,
        role,
        content,
        related_report_id: relatedReportId
      })
      .select("*")
      .single();
    if (error) throw error;
    return data;
  }

  const row: ChatMessageRow = {
    id: crypto.randomUUID(),
    user_id: userId,
    role,
    content,
    related_report_id: relatedReportId ?? null,
    created_at: new Date().toISOString()
  };
  memoryStore().chats.push(row);
  return row;
}

export async function listChatMessages(
  userId: string,
  { date, limit = 30 }: { date?: string; limit?: number } = {}
): Promise<ChatMessageRow[]> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    let query = supabase
      .from("chat_messages")
      .select("*, daily_reports!chat_messages_related_report_id_fkey(report_date)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (date) {
      query = query.eq("daily_reports.report_date", date);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? [])
      .filter((row) => !date || row.daily_reports)
      .map((row) => {
        const message = { ...row };
        delete (message as { daily_reports?: unknown }).daily_reports;
        return message;
      })
      .reverse();
  }

  const reportsById = new Map(memoryStore().reports.map((report) => [report.id, report]));
  return memoryStore()
    .chats.filter((message) => {
      if (message.user_id !== userId) return false;
      if (!date) return true;
      const report = message.related_report_id ? reportsById.get(message.related_report_id) : null;
      return report?.report_date === date;
    })
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .slice(-limit);
}

export async function getGenerationJob(userId: string, date: string): Promise<GenerationJobRow | null> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("generation_jobs")
      .select("*")
      .eq("user_id", userId)
      .eq("job_date", date)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  return memoryStore().generationJobs.find((job) => job.user_id === userId && job.job_date === date) ?? null;
}

export async function startGenerationJob(userId: string, date: string): Promise<GenerationJobRow> {
  const existing = await getGenerationJob(userId, date);
  const now = new Date().toISOString();
  const retryCount = existing ? existing.retry_count + (existing.status === "failed" ? 1 : 0) : 0;

  return upsertGenerationJob({
    id: existing?.id ?? crypto.randomUUID(),
    user_id: userId,
    job_date: date,
    status: "running",
    error_message: null,
    retry_count: retryCount,
    started_at: now,
    finished_at: null,
    created_at: existing?.created_at ?? now
  });
}

export async function completeGenerationJob(userId: string, date: string): Promise<GenerationJobRow> {
  const existing = await getGenerationJob(userId, date);
  const now = new Date().toISOString();

  return upsertGenerationJob({
    id: existing?.id ?? crypto.randomUUID(),
    user_id: userId,
    job_date: date,
    status: "completed",
    error_message: null,
    retry_count: existing?.retry_count ?? 0,
    started_at: existing?.started_at ?? now,
    finished_at: now,
    created_at: existing?.created_at ?? now
  });
}

export async function failGenerationJob(userId: string, date: string, errorMessage: string): Promise<GenerationJobRow> {
  const existing = await getGenerationJob(userId, date);
  const now = new Date().toISOString();

  return upsertGenerationJob({
    id: existing?.id ?? crypto.randomUUID(),
    user_id: userId,
    job_date: date,
    status: "failed",
    error_message: errorMessage.slice(0, 1000),
    retry_count: existing?.retry_count ?? 0,
    started_at: existing?.started_at ?? now,
    finished_at: now,
    created_at: existing?.created_at ?? now
  });
}

async function upsertGenerationJob(job: GenerationJobRow): Promise<GenerationJobRow> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("generation_jobs")
      .upsert(
        {
          user_id: job.user_id,
          job_date: job.job_date,
          status: job.status,
          error_message: job.error_message,
          retry_count: job.retry_count,
          started_at: job.started_at,
          finished_at: job.finished_at
        },
        { onConflict: "user_id,job_date" }
      )
      .select("*")
      .single();
    if (error) throw error;
    return data;
  }

  const store = memoryStore();
  const index = store.generationJobs.findIndex((candidate) => candidate.user_id === job.user_id && candidate.job_date === job.job_date);
  if (index >= 0) {
    store.generationJobs[index] = job;
  } else {
    store.generationJobs.push(job);
  }
  return job;
}
