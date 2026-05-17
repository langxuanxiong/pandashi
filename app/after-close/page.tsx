import { Disclaimer } from "@/components/Disclaimer";

const moods = ["放松", "一般", "焦虑", "生气", "疲惫"];

export default function AfterClosePage() {
  return (
    <>
      <div className="page-title">
        <div>
          <h2>收盘以后</h2>
          <p className="muted">从市场情绪里慢慢退出来</p>
        </div>
      </div>

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
              <button className="mood-button" key={mood} type="button">
                {mood}
              </button>
            ))}
          </div>
        </div>
        <div className="section">
          <h3>今日复盘问题</h3>
          <p>今天真正影响我判断的信息是什么？哪些只是短时间的噪音？</p>
          <p className="muted">先写事实，再写感受，最后再决定明天要不要继续关注。</p>
        </div>
      </section>

      <Disclaimer />
    </>
  );
}
