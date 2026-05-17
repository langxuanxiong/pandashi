import { getSupabaseAdmin } from "@/lib/supabase";
import { createReportRow, memoryStore } from "@/lib/store/memory";
import type { DailyReport, DailyReportRow, WatchlistItem } from "@/lib/types";

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
      .insert({
        user_id: userId,
        report_date: report.date,
        report_json: report,
        status: "completed"
      })
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
) {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("chat_messages").insert({
      user_id: userId,
      role,
      content,
      related_report_id: relatedReportId
    });
    return;
  }

  memoryStore().chats.push({
    id: crypto.randomUUID(),
    user_id: userId,
    role,
    content,
    related_report_id: relatedReportId,
    created_at: new Date().toISOString()
  });
}

