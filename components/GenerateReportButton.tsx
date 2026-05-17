"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RefreshCw } from "lucide-react";

export function GenerateReportButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function generate() {
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/jobs/generate-daily-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "manual-demo" })
    });
    const data = await response.json().catch(() => ({}));

    setMessage(response.ok ? "演示日报已整理好。" : data.error ?? "生成失败，请稍后再试。");
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="manual-generate">
      <button className="btn primary" disabled={loading} onClick={generate} type="button">
        <RefreshCw size={18} />
        {loading ? "整理中..." : "生成今日演示日报"}
      </button>
      {message ? <span className="muted">{message}</span> : null}
    </div>
  );
}
