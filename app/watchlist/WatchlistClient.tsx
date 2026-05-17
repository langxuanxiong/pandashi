"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { WatchlistItem } from "@/lib/types";

type StockSearchItem = Pick<WatchlistItem, "code" | "name" | "market" | "sector">;

export function WatchlistClient() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [input, setInput] = useState("600519 贵州茅台\n300750 宁德时代\n002594 比亚迪");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StockSearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    const response = await fetch("/api/watchlist");
    const data = await response.json();
    setItems(data.items ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }

    const timer = window.setTimeout(async () => {
      const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(trimmed)}`);
      const data = await response.json();
      setResults(data.stocks ?? []);
    }, 180);

    return () => window.clearTimeout(timer);
  }, [query]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input })
    });
    if (response.ok) {
      setInput("");
      await load();
    } else {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "添加失败，请检查输入。");
    }
  }

  async function remove(id: string) {
    await fetch(`/api/watchlist/${id}`, { method: "DELETE" });
    await load();
  }

  function appendStock(stock: StockSearchItem) {
    const nextLine = `${stock.code} ${stock.name}`;
    setInput((current) => {
      const trimmed = current.trim();
      return trimmed ? `${trimmed}\n${nextLine}` : nextLine;
    });
    setQuery("");
    setResults([]);
  }

  return (
    <div className="grid two">
      <form className="panel" onSubmit={submit}>
        <h3>添加自选股</h3>
        <p className="muted">先用本地股票库支持常见 A 股，后续再接真实数据源。</p>
        <input
          className="input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索名称或代码，例如 招商银行 / 600036"
        />
        {query ? (
          <div className="search-results">
            {results.length > 0 ? (
              results.map((stock) => (
                <button className="search-result" key={stock.code} onClick={() => appendStock(stock)} type="button">
                  <strong>
                    {stock.name} {stock.code}
                  </strong>
                  <span>{stock.sector}</span>
                </button>
              ))
            ) : (
              <p className="muted">本地库里暂时没找到，先换代码或名称试试。</p>
            )}
          </div>
        ) : null}
        <p className="muted">也支持批量粘贴已收录的股票代码或名称。</p>
        <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        {error ? <p className="error-text">{error}</p> : null}
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
              <a className="tag" href={`/chat?question=${encodeURIComponent(`${item.name}今天怎么了？`)}`}>
                向小编询问这只股票
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
