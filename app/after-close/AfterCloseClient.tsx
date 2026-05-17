"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, RotateCcw, Save } from "lucide-react";

const moods = ["放松", "一般", "焦虑", "生气", "疲惫"] as const;
const reminderOptions = ["明天先看事实，不急着判断", "少看盘半小时", "只复盘自选股相关信息", "把噪音留在今天"];

type AfterCloseRecord = {
  mood: string;
  reflection: string;
  reminder: string;
  savedAt: string;
};

type AfterCloseClientProps = {
  date: string;
};

export function AfterCloseClient({ date }: AfterCloseClientProps) {
  const storageKey = useMemo(() => `panxiaobian-after-close-${date}`, [date]);
  const [record, setRecord] = useState<AfterCloseRecord>({
    mood: "",
    reflection: "",
    reminder: reminderOptions[0],
    savedAt: ""
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return;

    try {
      const saved = JSON.parse(raw) as AfterCloseRecord;
      setRecord({
        mood: saved.mood ?? "",
        reflection: saved.reflection ?? "",
        reminder: saved.reminder ?? reminderOptions[0],
        savedAt: saved.savedAt ?? ""
      });
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  function save() {
    const next = { ...record, savedAt: new Date().toISOString() };
    window.localStorage.setItem(storageKey, JSON.stringify(next));
    setRecord(next);
    setStatus("已保存");
  }

  function reset() {
    window.localStorage.removeItem(storageKey);
    setRecord({ mood: "", reflection: "", reminder: reminderOptions[0], savedAt: "" });
    setStatus("已重置");
  }

  return (
    <section className="diary-panel">
      <div className="section">
        <h3>今晚先把生活还给自己</h3>
        <p>
          今天市场已经结束了。你可以复盘今天发生了什么，但不用反复责怪自己。市场不是每天都会给答案，也不是每一次波动都在否定你的判断。
        </p>
      </div>

      <div className="section">
        <h3>情绪记录</h3>
        <div className="mood-grid">
          {moods.map((mood) => (
            <button
              className={`mood-button ${record.mood === mood ? "active" : ""}`}
              key={mood}
              onClick={() => setRecord((current) => ({ ...current, mood }))}
              type="button"
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <h3>今日复盘</h3>
        <p className="muted">今天真正影响我判断的信息是什么？哪些只是短时间的噪音？</p>
        <textarea
          className="textarea diary-textarea"
          value={record.reflection}
          onChange={(event) => setRecord((current) => ({ ...current, reflection: event.target.value }))}
          placeholder="先写事实，再写感受。"
        />
      </div>

      <div className="section">
        <h3>明日提醒</h3>
        <div className="reminder-grid">
          {reminderOptions.map((reminder) => (
            <button
              className={`reminder-button ${record.reminder === reminder ? "active" : ""}`}
              key={reminder}
              onClick={() => setRecord((current) => ({ ...current, reminder }))}
              type="button"
            >
              {reminder}
            </button>
          ))}
        </div>
        <input
          className="input"
          value={record.reminder}
          onChange={(event) => setRecord((current) => ({ ...current, reminder: event.target.value }))}
          placeholder="或者写一句自己的提醒"
        />
      </div>

      <div className="after-close-actions">
        <button className="btn primary" onClick={save} type="button">
          <Save size={18} />
          保存今日记录
        </button>
        <button className="btn" onClick={reset} type="button">
          <RotateCcw size={18} />
          重置
        </button>
        {status ? <span className="tag">{status}</span> : null}
      </div>

      <div className="today-record-card">
        <div className="row-head">
          <h3>今日记录</h3>
          {record.savedAt ? <Check size={18} /> : null}
        </div>
        <p>
          <strong>情绪：</strong>
          {record.mood || "还没记录"}
        </p>
        <p>
          <strong>复盘：</strong>
          {record.reflection || "还没有写下今天的事实和感受。"}
        </p>
        <p>
          <strong>明日提醒：</strong>
          {record.reminder || "给明天留一句轻一点的话。"}
        </p>
      </div>
    </section>
  );
}
