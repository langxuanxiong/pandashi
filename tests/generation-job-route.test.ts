import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { resetMemoryStore } from "@/lib/store/memory";
import { getGenerationJob, saveReport } from "@/lib/services/repository";

const userId = "00000000-0000-0000-0000-000000000001";

function disableSupabase() {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
  vi.stubEnv("DEEPSEEK_API_KEY", "");
  vi.stubEnv("DASHSCOPE_API_KEY", "");
  vi.stubEnv("MARKET_DATA_PROVIDER", "mock");
}

describe("daily report generation job route", () => {
  afterEach(() => {
    resetMemoryStore();
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("allows manual demo generation without cron secret header", async () => {
    disableSupabase();
    vi.stubEnv("CRON_SECRET", "test-cron-secret");

    const { POST } = await import("@/app/api/jobs/generate-daily-report/route");
    const response = await POST(
      new NextRequest("http://localhost/api/jobs/generate-daily-report", {
        method: "POST",
        body: JSON.stringify({ date: "2026-05-18", source: "manual-demo" })
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ status: "completed" });
    expect((await getGenerationJob(userId, "2026-05-18"))?.status).toBe("completed");
  });

  it("rejects cron generation without the configured secret", async () => {
    disableSupabase();
    vi.stubEnv("CRON_SECRET", "test-cron-secret");

    const { POST } = await import("@/app/api/jobs/generate-daily-report/route");
    const response = await POST(
      new NextRequest("http://localhost/api/jobs/generate-daily-report", {
        method: "POST",
        body: JSON.stringify({ date: "2026-05-18" })
      })
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({ error: "Unauthorized" });
    expect(await getGenerationJob(userId, "2026-05-18")).toBeNull();
  });

  it("allows cron generation with the configured secret", async () => {
    disableSupabase();
    vi.stubEnv("CRON_SECRET", "test-cron-secret");

    const { POST } = await import("@/app/api/jobs/generate-daily-report/route");
    const response = await POST(
      new NextRequest("http://localhost/api/jobs/generate-daily-report", {
        method: "POST",
        headers: { "x-cron-secret": "test-cron-secret" },
        body: JSON.stringify({ date: "2026-05-18" })
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ status: "completed" });
    expect((await getGenerationJob(userId, "2026-05-18"))?.status).toBe("completed");
  });

  it("records completed job warnings when public data falls back", async () => {
    disableSupabase();
    vi.stubEnv("MARKET_DATA_PROVIDER", "official");
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network down"));
    vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const { POST } = await import("@/app/api/jobs/generate-daily-report/route");
    const response = await POST(
      new NextRequest("http://localhost/api/jobs/generate-daily-report", {
        method: "POST",
        body: JSON.stringify({ date: "2026-05-18", source: "manual-demo" })
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ status: "completed" });
    const job = await getGenerationJob(userId, "2026-05-18");
    expect(job?.status).toBe("completed");
    expect(job?.error_message).toContain("公开金融数据源不可用");
  });

  it("skips when a report already exists", async () => {
    disableSupabase();
    await saveReport(userId, {
      date: "2026-05-18",
      market_weather: { emoji: "sun", label: "平稳", reason: "已有日报" },
      editor_brief: "已有日报。",
      what_happened: "已有内容。",
      daily_story: { title: "已有", body: "已有" },
      watchlist_updates: [],
      risk_notes: ["注意风险。"],
      closing_letter: "收盘了。",
      source_urls: []
    });

    const { POST } = await import("@/app/api/jobs/generate-daily-report/route");
    const response = await POST(
      new NextRequest("http://localhost/api/jobs/generate-daily-report", {
        method: "POST",
        body: JSON.stringify({ date: "2026-05-18" })
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ status: "skipped" });
    expect(await getGenerationJob(userId, "2026-05-18")).toBeNull();
  });

  it("writes a completed job after successful generation", async () => {
    disableSupabase();

    const { POST } = await import("@/app/api/jobs/generate-daily-report/route");
    const response = await POST(
      new NextRequest("http://localhost/api/jobs/generate-daily-report", {
        method: "POST",
        body: JSON.stringify({ date: "2026-05-18" })
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ status: "completed" });
    expect((await getGenerationJob(userId, "2026-05-18"))?.status).toBe("completed");
  });

  it("writes a failed job when generation throws", async () => {
    disableSupabase();
    vi.doMock("@/lib/services/reportGenerator", () => ({
      generateDailyReport: vi.fn(async () => {
        throw new Error("mock generation failed");
      })
    }));

    const { POST } = await import("@/app/api/jobs/generate-daily-report/route");
    const response = await POST(
      new NextRequest("http://localhost/api/jobs/generate-daily-report", {
        method: "POST",
        body: JSON.stringify({ date: "2026-05-18" })
      })
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({ error: "mock generation failed" });
    const job = await getGenerationJob(userId, "2026-05-18");
    expect(job?.status).toBe("failed");
    expect(job?.error_message).toBe("mock generation failed");
  });
});
