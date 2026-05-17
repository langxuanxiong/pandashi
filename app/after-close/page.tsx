import { Disclaimer } from "@/components/Disclaimer";
import { getChinaDate } from "@/lib/date";
import { AfterCloseClient } from "@/app/after-close/AfterCloseClient";

export default function AfterClosePage() {
  const today = getChinaDate();

  return (
    <>
      <div className="page-title">
        <div>
          <h2>收盘以后</h2>
          <p className="muted">从市场情绪里慢慢退出来</p>
        </div>
      </div>

      <AfterCloseClient date={today} />

      <Disclaimer />
    </>
  );
}
