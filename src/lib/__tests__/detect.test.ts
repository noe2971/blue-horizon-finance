import { describe, expect, it } from "vitest";
import { parseAmount, parseDate, parseTransactions, splitCsv } from "../csv";
import { detectSubscriptions, merchantKey } from "../detect";
import { findKnownMerchant } from "../merchants";
import { buildSampleCsv } from "../sample";

describe("csv parsing", () => {
  it("handles quoted fields with commas and escaped quotes", () => {
    expect(splitCsv('a,"b, c","d ""e"""\n1,2,3')).toEqual([
      ["a", "b, c", 'd "e"'],
      ["1", "2", "3"],
    ]);
  });

  it("detects semicolon delimiters", () => {
    expect(splitCsv("a;b;c\n1;2;3")[1]).toEqual(["1", "2", "3"]);
  });

  it("parses common amount formats", () => {
    expect(parseAmount("$1,234.56")).toBe(1234.56);
    expect(parseAmount("-12.00")).toBe(-12);
    expect(parseAmount("(15.49)")).toBe(-15.49);
    expect(parseAmount("1.234,56 €")).toBe(1234.56);
    expect(parseAmount("")).toBeNull();
  });

  it("parses common date formats", () => {
    expect(parseDate("2024-03-05")?.toISOString()).toBe("2024-03-05T00:00:00.000Z");
    expect(parseDate("03/05/2024")?.toISOString()).toBe("2024-03-05T00:00:00.000Z");
    expect(parseDate("03/05/2024", true)?.toISOString()).toBe("2024-05-03T00:00:00.000Z");
    expect(parseDate("25/12/2024")?.toISOString()).toBe("2024-12-25T00:00:00.000Z");
    expect(parseDate("Mar 5, 2024")?.toISOString()).toBe("2024-03-05T00:00:00.000Z");
    expect(parseDate("5 Mar 2024")?.toISOString()).toBe("2024-03-05T00:00:00.000Z");
    expect(parseDate("2024-02-30")).toBeNull();
  });

  it("supports separate debit/credit columns", () => {
    const csv = "Posted Date,Payee,Debit,Credit\n2024-01-01,NETFLIX,15.49,\n2024-01-02,PAYROLL,,1000";
    const { transactions } = parseTransactions(csv);
    expect(transactions.map((t) => t.outflow)).toEqual([15.49, -1000]);
  });

  it("treats positive amounts as spending on credit card exports", () => {
    const csv = "Date,Description,Amount\n2024-01-01,NETFLIX,15.49\n2024-01-05,COFFEE,4.50\n2024-01-09,PAYMENT THANK YOU,-500";
    const { transactions } = parseTransactions(csv);
    expect(transactions.map((t) => t.outflow)).toEqual([15.49, 4.5, -500]);
  });

  it("works without a header row", () => {
    const csv = "2024-01-01,NETFLIX.COM,-15.49\n2024-02-01,NETFLIX.COM,-15.49";
    expect(parseTransactions(csv).transactions).toHaveLength(2);
  });
});

describe("merchant matching", () => {
  it("strips processor noise from descriptions", () => {
    expect(merchantKey("SQ *BLUE BOTTLE COFFEE 12345 CA")).toBe("blue bottle coffee");
    expect(merchantKey("POS DEBIT GYMCO #4432")).toBe("gymco");
  });

  it("prefers the most specific known merchant", () => {
    expect(findKnownMerchant("MICROSOFT*XBOX GAME PASS")?.name).toBe("Xbox Game Pass");
    expect(findKnownMerchant("MICROSOFT*365 PERSONAL")?.name).toBe("Microsoft 365");
  });
});

describe("subscription detection", () => {
  const monthly = (desc: string, amounts: number[], startMonth = 0, day = 5) =>
    amounts.map((a, i) => `2024-${String(startMonth + i + 1).padStart(2, "0")}-${String(day).padStart(2, "0")},${desc},-${a}`);

  const report = (lines: string[]) =>
    detectSubscriptions(parseTransactions(["Date,Description,Amount", ...lines].join("\n")).transactions);

  it("finds a monthly subscription and annualises it", () => {
    const r = report(monthly("SPOTIFY USA", [11.99, 11.99, 11.99, 11.99]));
    expect(r.subscriptions).toHaveLength(1);
    expect(r.subscriptions[0]).toMatchObject({ name: "Spotify", cadence: "monthly", yearlyCost: 143.88, active: true });
  });

  it("finds unknown merchants that recur with a stable amount", () => {
    const r = report(monthly("LOCAL GYM LLC", [30, 30, 30]));
    expect(r.subscriptions[0]).toMatchObject({ name: "Local Gym", cadence: "monthly" });
  });

  it("ignores irregular spending at the same merchant", () => {
    const r = report(["2024-01-03,TRADER JOES,-50", "2024-01-20,TRADER JOES,-82", "2024-03-02,TRADER JOES,-17", "2024-03-09,TRADER JOES,-66"]);
    expect(r.subscriptions).toHaveLength(0);
  });

  it("ignores monthly bills with wildly varying amounts from unknown merchants", () => {
    const r = report(monthly("CITY UTILITIES", [40, 95, 130, 60]));
    expect(r.subscriptions).toHaveLength(0);
  });

  it("ignores same-day monthly purchases with varying amounts", () => {
    const r = report(monthly("SHELL OIL 5744", [38, 45, 52, 41, 57]));
    expect(r.subscriptions).toHaveLength(0);
  });

  it("flags price increases", () => {
    const r = report(monthly("NETFLIX.COM", [15.49, 15.49, 17.99, 17.99]));
    expect(r.priceHikes).toHaveLength(1);
    expect(r.subscriptions[0].priceIncreasePct).toBe(16.1);
  });

  it("marks subscriptions that stopped as inactive", () => {
    const r = report([...monthly("HULU", [7.99, 7.99, 7.99]), "2024-09-01,COFFEE,-4"]);
    expect(r.subscriptions[0].active).toBe(false);
    expect(r.activeYearlyTotal).toBe(0);
  });

  it("detects yearly renewals", () => {
    const r = report(["2023-02-10,NORDVPN,-99", "2024-02-11,NORDVPN,-99"]);
    expect(r.subscriptions[0]).toMatchObject({ cadence: "yearly", yearlyCost: 99, monthlyCost: 8.25 });
  });

  it("reports overlapping services in the same category", () => {
    const r = report([...monthly("NETFLIX.COM", [15.49, 15.49, 15.49]), ...monthly("HULU", [7.99, 7.99, 7.99], 0, 9)]);
    expect(r.overlaps).toHaveLength(1);
    expect(r.overlaps[0].category).toBe("Streaming");
  });

  it("finds the expected subscriptions in the demo statement", () => {
    const end = new Date(Date.UTC(2025, 5, 30));
    const r = detectSubscriptions(parseTransactions(buildSampleCsv(end)).transactions);
    const names = r.subscriptions.map((s) => s.name);
    for (const n of ["Netflix", "Spotify", "Planet Fitness", "Adobe", "ChatGPT Plus", "Disney+", "Hulu"]) {
      expect(names).toContain(n);
    }
    expect(names.some((n) => /trader|shell|chipotle|amazon mkt/i.test(n))).toBe(false);
    expect(names.some((n) => /payroll|rent/i.test(n))).toBe(false);
    expect(r.subscriptions.find((s) => s.name === "Paramount+")?.active).toBe(false);
    expect(r.priceHikes.map((s) => s.name)).toContain("Netflix");
  });
});
