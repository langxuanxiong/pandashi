import Link from "next/link";
import { LogOut, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { DEFAULT_USER_ID, hasDeepSeekConfig, hasSupabaseConfig } from "@/lib/config";
import { listReports, listWatchlist } from "@/lib/services/repository";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const [watchlist, reports] = await Promise.all([listWatchlist(DEFAULT_USER_ID), listReports(DEFAULT_USER_ID, 20)]);
  const hasDeepSeek = hasDeepSeekConfig();
  const hasSupabase = hasSupabaseConfig();

  return (
    <>
      <Link className="back-link exit-link" href="/" aria-label="退出本地体验">
        <LogOut size={20} />
      </Link>

      <div className="page-title">
        <div>
          <h2>我的</h2>
          <p className="muted">盘小编的本地设置和安全边界</p>
        </div>
      </div>

      <section className="account-hero">
        <div className="avatar-mark">
          <UserRound size={28} />
        </div>
        <div>
          <div className="eyebrow">本地体验账号</div>
          <h3>单用户演示模式</h3>
          <p className="muted">现在先验证产品体验，登录、多端同步和推送会放到后续阶段。</p>
        </div>
      </section>

      <section className="settings-list">
        <div className="settings-row">
          <div>
            <span className="tag">模型</span>
            <h3>{hasDeepSeek ? "DeepSeek 已接入" : "Mock 文案模式"}</h3>
            <p className="muted">{hasDeepSeek ? "日报生成和小编追问会优先使用 DeepSeek。" : "没有检测到 DeepSeek key 时，会回退到本地演示文案。"}</p>
          </div>
          <Sparkles size={20} />
        </div>

        <div className="settings-row">
          <div>
            <span className="tag">数据</span>
            <h3>{hasSupabase ? "Supabase 数据同步" : "本地轻量数据"}</h3>
            <p className="muted">{hasSupabase ? "已检测到 Supabase 配置，可用于真实落库。" : "当前不强依赖云端数据库，适合低成本打磨产品闭环。"}</p>
          </div>
          <span className="stat-pill">{watchlist.length} 自选</span>
        </div>

        <div className="settings-row">
          <div>
            <span className="tag">日报</span>
            <h3>{reports.length} 篇历史记录</h3>
            <p className="muted">日报详情、历史目录和追问能力会围绕这些内容展开。</p>
          </div>
          <span className="stat-pill">V0.1</span>
        </div>

        <div className="settings-row">
          <div>
            <span className="tag">安全</span>
            <h3>不荐股，不预测，不给买卖建议</h3>
            <p className="muted">盘小编只做市场信息整理、新闻解释、风险提醒和情绪陪伴。</p>
          </div>
          <ShieldCheck size={20} />
        </div>
      </section>

      <section className="roadmap-note">
        <h3>后续会放在这里</h3>
        <p>登录、多设备同步、收盘推送、长期记忆、数据导出和通知设置。</p>
        <p className="muted">当前未接入真实登录，左上角退出只会回到日报页，不会清空本地演示数据。</p>
      </section>
    </>
  );
}
