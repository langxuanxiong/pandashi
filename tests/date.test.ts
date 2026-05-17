import { describe, expect, it } from "vitest";
import { isTradingDay } from "@/lib/date";

describe("trading day", () => {
  it("treats weekdays as trading days for V0.1", () => {
    expect(isTradingDay("2026-05-15")).toBe(true);
    expect(isTradingDay("2026-05-17")).toBe(false);
  });
});

