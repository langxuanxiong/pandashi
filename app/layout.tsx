import type { Metadata } from "next";
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
              <h1>盘小编</h1>
              <p>AI 市场小编</p>
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
