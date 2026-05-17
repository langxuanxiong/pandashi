"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Send } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function ChatClient() {
  const searchParams = useSearchParams();
  const [question, setQuestion] = useState(searchParams.get("question") ?? "宁德时代今天怎么了？");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "我是盘小编。你可以问我日报、自选股、公告和市场情绪，我不会替你做买卖决定。"
    }
  ]);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;

    setMessages((current) => [...current, { role: "user", content: trimmed }]);
    setQuestion("");
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: trimmed })
    });
    const data = await response.json();
    setMessages((current) => [...current, { role: "assistant", content: data.answer ?? "小编刚刚没有组织好语言，请稍后再问一次。" }]);
    setLoading(false);
  }

  return (
    <div className="chat-layout">
      <section className="chat-log" aria-live="polite">
        {messages.map((message, index) => (
          <div className={`message ${message.role}`} key={`${message.role}-${index}`}>
            <div className="tag">{message.role === "user" ? "你" : "小编"}</div>
            <p>{message.content}</p>
          </div>
        ))}
        {loading ? <p className="muted">小编正在整理信息...</p> : null}
      </section>

      <form className="chat-compose" onSubmit={submit}>
        <textarea
          className="textarea chat-input"
          rows={1}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="追问日报、公告或自选股"
        />
        <button className="send-button" aria-label="发送" type="submit">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
