import { describe, expect, it } from "vitest";
import { asksForInvestmentAdvice, containsUnsafeInvestmentAdvice, sanitizeInvestmentLanguage } from "@/lib/safety";

describe("investment safety", () => {
  it("detects advice seeking questions", () => {
    expect(asksForInvestmentAdvice("我该不该买贵州茅台？")).toBe(true);
    expect(asksForInvestmentAdvice("明天会不会涨？")).toBe(true);
    expect(asksForInvestmentAdvice("现在能不能抄底？")).toBe(true);
    expect(asksForInvestmentAdvice("推荐一只股票")).toBe(true);
    expect(asksForInvestmentAdvice("今天市场情绪怎么样？")).toBe(false);
  });

  it("detects unsafe advice language", () => {
    expect(containsUnsafeInvestmentAdvice("建议买入这只股票")).toBe(true);
    expect(containsUnsafeInvestmentAdvice("今天更适合理解风险")).toBe(false);
  });

  it("sanitizes unsafe wording", () => {
    expect(sanitizeInvestmentLanguage("建议买入，明天大概率上涨")).not.toContain("建议买入");
  });
});
