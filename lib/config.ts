export const DEFAULT_USER_ID =
  process.env.NEXT_PUBLIC_DEFAULT_USER_ID ?? "00000000-0000-0000-0000-000000000001";

export const APP_TZ = "Asia/Shanghai";

export function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

export function hasQwenConfig() {
  return Boolean(process.env.DASHSCOPE_API_KEY);
}

