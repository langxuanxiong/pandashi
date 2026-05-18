import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as postChat } from "@/app/api/chat/route";
import { GET as getReports } from "@/app/api/reports/route";
import { GET as getTodayReport } from "@/app/api/reports/today/route";
import { POST as postWatchlist } from "@/app/api/watchlist/route";
import { resetMemoryStore } from "@/lib/store/memory";

function disableSupabase() {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
}

describe("route validation", () => {
  afterEach(() => {
    resetMemoryStore();
    vi.unstubAllEnvs();
  });

  it("rejects empty chat questions", async () => {
    disableSupabase();

    const response = await postChat(
      new NextRequest("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify({ question: "" })
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: "请输入问题。" });
  });

  it("rejects invalid report dates", async () => {
    disableSupabase();

    const response = await getTodayReport(new NextRequest("http://localhost/api/reports/today?date=2026/05/18"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toHaveProperty("error");
  });

  it("rejects invalid report limits", async () => {
    disableSupabase();

    const response = await getReports(new NextRequest("http://localhost/api/reports?limit=999"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toHaveProperty("error");
  });

  it("rejects empty watchlist input", async () => {
    disableSupabase();

    const response = await postWatchlist(
      new NextRequest("http://localhost/api/watchlist", {
        method: "POST",
        body: JSON.stringify({ input: "   " })
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: "请输入股票代码、名称或批量列表。" });
  });
});
