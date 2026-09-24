import type { Transaction } from "./csv";
import { findKnownMerchant, type Category, type KnownMerchant } from "./merchants";

export type Cadence = "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";

const CADENCES: { cadence: Cadence; days: number; tolerance: number; perYear: number }[] = [
  { cadence: "weekly", days: 7, tolerance: 2, perYear: 52 },
  { cadence: "biweekly", days: 14, tolerance: 3, perYear: 26 },
  { cadence: "monthly", days: 30.4, tolerance: 5, perYear: 12 },
  { cadence: "quarterly", days: 91, tolerance: 10, perYear: 4 },
  { cadence: "yearly", days: 365, tolerance: 20, perYear: 1 },
];

export interface Subscription {
  id: string;
  name: string;
  category: Category;
  cadence: Cadence;
  /** Most recent charge amount. */
  amount: number;
  yearlyCost: number;
  monthlyCost: number;
  charges: { date: Date; amount: number }[];
  lastCharge: Date;
  nextCharge: Date;
  /** Still being billed as of the end of the statement. */
  active: boolean;
  /** Percentage increase from the first to the latest charge, if any. */
  priceIncreasePct: number | null;
  known?: KnownMerchant;
  confidence: "high" | "medium";
}

export interface Report {
  subscriptions: Subscription[];
  activeYearlyTotal: number;
  activeMonthlyTotal: number;
  priceHikes: Subscription[];
  /** Categories where the user pays for more than one active service. */
  overlaps: { category: Category; subscriptions: Subscription[] }[];
  statementStart: Date;
  statementEnd: Date;
}

const DAY = 86_400_000;

const NOISE = [
  /\b(pos|debit|credit|card|purchase|recurring|payment|pymt|pmt|ach|online|web|autopay|auto pay|bill pay|withdrawal|transaction|visa|mastercard|mc|dda|checkcard|preauthorized|pre-authorized|direct debit|dd|so|fpo)\b/g,
  /\b(sq|tst|pp|paypal|sp|dri|py|in)\s*\*/g,
  /\b(inc|llc|ltd|co|corp|com|www|http|https)\b/g,
  /\b[a-z]{2}\s*$/g, // trailing state code
  /[#*]\S*/g,
  /\d+/g,
  /[^a-z\s]/g,
];

/** Recurring outflows that aren't cancellable subscriptions. */
const NOT_SUBSCRIPTIONS =
  /\b(rent|mortgage|loan|zelle|venmo|cash app|transfer|xfer|payroll|salary|irs|tax|savings|atm|withdrawal|payment thank you|autopay payment|card payment|credit card|student|tuition|child ?care|hoa)\b/i;

/** Reduces a noisy bank description to a stable grouping key. */
export function merchantKey(description: string): string {
  let s = description.toLowerCase();
  for (const re of NOISE) s = s.replace(re, " ");
  const words = s.split(/\s+/).filter((w) => w.length > 1);
  return words.slice(0, 3).join(" ");
}

function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Finds recurring charges in a list of transactions. */
export function detectSubscriptions(transactions: Transaction[]): Report {
  const spending = transactions.filter((t) => t.outflow > 0 && !NOT_SUBSCRIPTIONS.test(t.description));
  const dates = transactions.map((t) => t.date.getTime());
  const statementStart = new Date(Math.min(...dates));
  const statementEnd = new Date(Math.max(...dates));

  const groups = new Map<string, { known?: KnownMerchant; label: string; txs: Transaction[] }>();
  for (const t of spending) {
    const known = findKnownMerchant(t.description);
    const key = known ? `known:${known.name}` : merchantKey(t.description);
    if (!key) continue;
    const g = groups.get(key) ?? { known, label: known?.name ?? titleCase(key), txs: [] };
    g.txs.push(t);
    groups.set(key, g);
  }

  const subscriptions: Subscription[] = [];
  for (const [key, g] of groups) {
    const sub = analyseGroup(key, g.label, g.known, g.txs, statementEnd);
    if (sub) subscriptions.push(sub);
  }

  subscriptions.sort((a, b) => Number(b.active) - Number(a.active) || b.yearlyCost - a.yearlyCost);
  const active = subscriptions.filter((s) => s.active);

  const byCategory = new Map<Category, Subscription[]>();
  for (const s of active) {
    if (s.category === "Other") continue;
    byCategory.set(s.category, [...(byCategory.get(s.category) ?? []), s]);
  }

  return {
    subscriptions,
    activeYearlyTotal: round2(active.reduce((sum, s) => sum + s.yearlyCost, 0)),
    activeMonthlyTotal: round2(active.reduce((sum, s) => sum + s.monthlyCost, 0)),
    priceHikes: active.filter((s) => s.priceIncreasePct !== null),
    overlaps: [...byCategory]
      .filter(([, subs]) => subs.length > 1)
      .map(([category, subs]) => ({ category, subscriptions: subs })),
    statementStart,
    statementEnd,
  };
}

function analyseGroup(
  key: string,
  label: string,
  known: KnownMerchant | undefined,
  txs: Transaction[],
  statementEnd: Date,
): Subscription | null {
  // Merge same-day charges (e.g. split authorisations) into one.
  const byDay = new Map<number, number>();
  for (const t of txs) {
    const day = Math.floor(t.date.getTime() / DAY);
    byDay.set(day, (byDay.get(day) ?? 0) + t.outflow);
  }
  const charges = [...byDay]
    .sort(([a], [b]) => a - b)
    .map(([day, amount]) => ({ date: new Date(day * DAY), amount: round2(amount) }));
  if (charges.length < 2) return null;

  const gaps = charges.slice(1).map((c, i) => (c.date.getTime() - charges[i].date.getTime()) / DAY);
  const typicalGap = median(gaps);
  const match = CADENCES.find((c) => Math.abs(typicalGap - c.days) <= c.tolerance);
  if (!match) return null;

  const regularGaps = gaps.filter((g) => Math.abs(g - match.days) <= match.tolerance).length;
  if (regularGaps / gaps.length < 0.6) return null;

  // Weekly/biweekly patterns are common for groceries and coffee; demand more evidence.
  const minCharges = match.cadence === "weekly" || match.cadence === "biweekly" ? 4 : 2;
  if (charges.length < minCharges) return null;

  const amounts = charges.map((c) => c.amount);
  const typicalAmount = median(amounts);
  // Unknown merchants must bill (nearly) the same amount each time, or a regular
  // grocery run or fill-up looks like a subscription. Known services get more slack
  // for price hikes and tax changes.
  const tolerance = known ? 0.2 : 0.05;
  const consistent = amounts.filter((a) => Math.abs(a - typicalAmount) / typicalAmount <= tolerance).length;
  const amountStable = consistent / amounts.length >= 0.75;
  if (!amountStable) return null;

  const first = charges[0].amount;
  const last = charges[charges.length - 1];
  const increase = (last.amount - first) / first;
  const priceIncreasePct = increase > 0.02 ? Math.round(increase * 1000) / 10 : null;

  const periodMs = match.days * DAY;
  const active = statementEnd.getTime() - last.date.getTime() <= periodMs * 1.5;
  const yearlyCost = round2(last.amount * match.perYear);

  return {
    id: key,
    name: label,
    category: known?.category ?? "Other",
    cadence: match.cadence,
    amount: last.amount,
    yearlyCost,
    monthlyCost: round2(yearlyCost / 12),
    charges,
    lastCharge: last.date,
    nextCharge: new Date(last.date.getTime() + periodMs),
    active,
    priceIncreasePct,
    known,
    confidence: known || (amountStable && charges.length >= 3) ? "high" : "medium",
  };
}
