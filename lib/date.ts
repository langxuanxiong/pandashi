import { APP_TZ } from "@/lib/config";

export function getChinaDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(now);
}

export function isTradingDay(dateISO = getChinaDate()) {
  const day = new Date(`${dateISO}T00:00:00+08:00`).getDay();
  return day >= 1 && day <= 5;
}

export function formatChinaDate(dateISO: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: APP_TZ,
    month: "long",
    day: "numeric",
    weekday: "long"
  }).format(new Date(`${dateISO}T00:00:00+08:00`));
}

