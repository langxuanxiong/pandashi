"use client";

import Link from "next/link";
import { BookOpen, MessageCircle, Moon, Star } from "lucide-react";
import { usePathname } from "next/navigation";

const dockItems = [
  { href: "/", label: "日报", icon: BookOpen, match: (pathname: string) => pathname === "/" || pathname.startsWith("/reports") },
  { href: "/chat", label: "小编", icon: MessageCircle, match: (pathname: string) => pathname.startsWith("/chat") },
  { href: "/after-close", label: "收盘以后", icon: Moon, match: (pathname: string) => pathname.startsWith("/after-close") },
  { href: "/watchlist", label: "自选", icon: Star, match: (pathname: string) => pathname.startsWith("/watchlist") }
] as const;

export function AppDock() {
  const pathname = usePathname();

  return (
    <nav className="app-dock" aria-label="主导航">
      {dockItems.map(({ href, label, icon: Icon, match }) => {
        const active = match(pathname);
        return (
          <Link className={active ? "active" : ""} href={href} key={href} aria-current={active ? "page" : undefined}>
            <span className="dock-marker" />
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
