import { Disclaimer } from "@/components/Disclaimer";
import { WatchlistClient } from "@/app/watchlist/WatchlistClient";

export default function WatchlistPage() {
  return (
    <>
      <div className="page-title">
        <div>
          <h2>自选</h2>
          <p className="muted">维护你想让小编重点关注的股票池</p>
        </div>
      </div>
      <WatchlistClient />
      <Disclaimer />
    </>
  );
}

