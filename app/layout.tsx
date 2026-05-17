import type { Metadata } from "next";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { AppDock } from "@/components/AppDock";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "盘小编",
  description: "AI 市场小编"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="shell">
          <header className="app-header">
            <div className="brand">
              <div>
                <h1>盘小编</h1>
                <p>AI 市场小编</p>
              </div>
              <Link className="account-link" href="/account" aria-label="我的">
                <UserRound size={18} />
              </Link>
            </div>
          </header>
          <main className="main">
            <div className="paper">{children}</div>
          </main>
          <AppDock />
        </div>
      </body>
    </html>
  );
}
