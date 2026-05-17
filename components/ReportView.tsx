import type { DailyReport } from "@/lib/types";
import { formatChinaDate } from "@/lib/date";

export function ReportView({ report }: { report: DailyReport }) {
  return (
    <article className="panel">
      <div className="section">
        <div className="weather">
          <div className="weather-icon">{report.market_weather.emoji}</div>
          <div>
            <div className="tag">{formatChinaDate(report.date)}</div>
            <h3>{report.market_weather.label}</h3>
            <p className="muted">{report.market_weather.reason}</p>
          </div>
        </div>
      </div>

      <div className="section">
        <p className="brief">{report.editor_brief}</p>
      </div>

      <div className="section">
        <h3>今天发生了什么</h3>
        <p>{report.what_happened}</p>
      </div>

      <div className="section">
        <h3>{report.daily_story.title}</h3>
        <p>{report.daily_story.body}</p>
      </div>

      <div className="section">
        <h3>我的自选股重点</h3>
        <div className="list">
          {report.watchlist_updates.map((item) => (
            <div className="stock-row" key={item.code}>
              <div className="row-head">
                <strong>
                  {item.name} {item.code}
                </strong>
                <span className="tag">{item.status}</span>
              </div>
              <p>{item.plain_explanation}</p>
              <p className="muted">{item.risk_note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h3>风险提醒</h3>
        <div className="list">
          {report.risk_notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      </div>

      <div className="section">
        <h3>收盘以后</h3>
        <p>{report.closing_letter}</p>
      </div>

      {report.source_urls.length > 0 ? (
        <div className="section">
          <h3>信息来源</h3>
          <div className="list">
            {report.source_urls.map((url) => (
              <a className="muted" href={url} key={url} target="_blank" rel="noreferrer">
                {url}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

