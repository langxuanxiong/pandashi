import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Home, MessageCircle, Moon, Star } from "lucide-react";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "盘大师",
  description: "你的 AI 市场小编"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="shell">
          <aside className="sidebar">
            <div className="brand">
              <h1>盘大师</h1>
              <p>你的 AI 市场小编</p>
            </div>
            <nav className="nav">
              <Link href="/">
                <Home size={18} />
                <span>今日</span>
              </Link>
              <Link href="/watchlist">
                <Star size={18} />
                <span>自选</span>
              </Link>
              <Link href="/reports">
                <BookOpen size={18} />
                <span>日报</span>
              </Link>
              <Link href="/chat">
                <MessageCircle size={18} />
                <span>小编</span>
              </Link>
              <Link href="/after-close">
                <Moon size={18} />
                <span>收盘以后</span>
              </Link>
            </nav>
          </aside>
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}

