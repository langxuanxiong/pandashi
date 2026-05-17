"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { WatchlistItem } from "@/lib/types";

export function WatchlistClient() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [input, setInput] = useState("600519 贵州茅台\n300750 宁德时代\n002594 比亚迪");
  const [loading, setLoading] = useState(true);

  async function load() {
    const response = await fetch("/api/watchlist");
    const data = await response.json();
    setItems(data.items ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input })
    });
    if (response.ok) {
      setInput("");
      await load();
    }
  }

  async function remove(id: string) {
    await fetch(`/api/watchlist/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="grid two">
      <form className="panel" onSubmit={submit}>
        <h3>添加自选股</h3>
        <p className="muted">支持股票代码、名称和批量粘贴。</p>
        <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        <div style={{ marginTop: 14 }}>
          <button className="btn primary" type="submit">
            <Plus size={18} />
            添加
          </button>
        </div>
      </form>

      <section className="panel">
        <h3>自选池</h3>
        {loading ? <p className="muted">正在读取自选股...</p> : null}
        {!loading && items.length === 0 ? <p className="muted">还没有自选股。先添加几只你关注的股票。</p> : null}
        <div className="list">
          {items.map((item) => (
            <div className="stock-row" key={item.id}>
              <div className="row-head">
                <strong>
                  {item.name} {item.code}
                </strong>
                <button className="btn danger" onClick={() => remove(item.id)} title="删除" type="button">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="tag">{item.sector}</div>
              <p className="muted">小编关注：近期重点关注板块情绪、公告变化和资金偏好的切换。</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

