import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ChevronDown,
  Download,
  FileUp,
  Layers,
  Lock,
  ShieldCheck,
  Share2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { CancelDialog } from "@/components/CancelDialog";
import { Logo } from "@/components/Logo";
import { CsvFormatError, parseTransactions } from "@/lib/csv";
import { detectSubscriptions, type Report, type Subscription } from "@/lib/detect";
import { money, shortDate } from "@/lib/format";
import { consumeUnlockParam, FREE_CANCEL_GUIDES, isPro, paymentLink, PRO_PRICE } from "@/lib/pro";
import { buildSampleCsv } from "@/lib/sample";

const CADENCE_LABEL: Record<Subscription["cadence"], string> = {
  weekly: "/wk",
  biweekly: "/2wk",
  monthly: "/mo",
  quarterly: "/qtr",
  yearly: "/yr",
};

const Scan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState("");
  const [dragging, setDragging] = useState(false);
  const [toCancel, setToCancel] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Subscription | null>(null);
  const [showPast, setShowPast] = useState(false);
  const [pro, setPro] = useState(isPro);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (consumeUnlockParam(location.search)) {
      setPro(true);
      toast.success("Pro unlocked. Thanks for your support!");
      navigate("/scan", { replace: true });
    }
  }, [location.search, navigate]);

  const analyse = useCallback((text: string, label: string) => {
    try {
      const { transactions, skipped } = parseTransactions(text);
      if (transactions.length === 0) throw new CsvFormatError("No transactions found in that file.");
      const r = detectSubscriptions(transactions);
      setReport(r);
      setError(null);
      setSource(label);
      setToCancel(new Set());
      if (skipped > 0) toast.message(`Skipped ${skipped} row${skipped === 1 ? "" : "s"} we couldn't read.`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setReport(null);
      setError(e instanceof CsvFormatError ? e.message : "Something went wrong reading that file.");
    }
  }, []);

  useEffect(() => {
    if (new URLSearchParams(location.search).has("demo")) analyse(buildSampleCsv(), "sample statement");
  }, [location.search, analyse]);

  const loadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const texts = await Promise.all([...files].map((f) => f.text()));
    // Several statements are merged; only the first header row is kept.
    const merged = texts
      .map((t, i) => (i === 0 ? t : t.split(/\r?\n/).slice(1).join("\n")))
      .join("\n");
    analyse(merged, files.length === 1 ? files[0].name : `${files.length} files`);
  };

  const upgrade = () => {
    const link = paymentLink();
    if (link) window.location.href = link;
  };

  const active = useMemo(() => report?.subscriptions.filter((s) => s.active) ?? [], [report]);
  const past = useMemo(() => report?.subscriptions.filter((s) => !s.active) ?? [], [report]);
  const savings = active.filter((s) => toCancel.has(s.id)).reduce((sum, s) => sum + s.yearlyCost, 0);
  const guideAllowed = (s: Subscription) => pro || active.indexOf(s) < FREE_CANCEL_GUIDES;

  const toggle = (id: string) =>
    setToCancel((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const share = async () => {
    const amount = money(savings || report!.activeYearlyTotal, false);
    const text = savings
      ? `I just found ${amount}/year in subscriptions I'm cancelling, using SubSlayer. It takes 30 seconds and never sees your bank login:`
      : `I'm paying ${amount}/year in subscriptions 😳. Found them all in 30 seconds with SubSlayer:`;
    const url = window.location.origin;
    if (navigator.share) {
      try {
        await navigator.share({ text, url });
        return;
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return; // user dismissed the sheet
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      toast.success("Copied. Paste it anywhere.");
    } catch {
      toast.error("Couldn't copy automatically. Your total is at the top of the page.");
    }
  };

  const exportCsv = () => {
    if (!report) return;
    const header = "Name,Category,Cadence,Amount,Yearly cost,Last charge,Next charge,Active,Price increase %,Cancel URL";
    const rows = report.subscriptions.map((s) =>
      [
        s.name,
        s.category,
        s.cadence,
        s.amount.toFixed(2),
        s.yearlyCost.toFixed(2),
        s.lastCharge.toISOString().slice(0, 10),
        s.nextCharge.toISOString().slice(0, 10),
        s.active ? "yes" : "no",
        s.priceIncreasePct ?? "",
        s.known?.cancelUrl ?? "",
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "subscriptions.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Logo />
          {pro ? (
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">PRO</span>
          ) : (
            <button onClick={upgrade} className="text-sm font-semibold text-emerald-400 hover:text-emerald-300">
              Unlock Pro · {PRO_PRICE}
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {!report && (
          <section className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Find every subscription you're paying for</h1>
            <p className="mt-3 text-slate-400">
              Download a CSV of the last 6 to 12 months from your bank or card's website, then drop it here.
            </p>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                loadFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInput.current?.click()}
              className={`mt-8 cursor-pointer rounded-2xl border-2 border-dashed p-10 transition ${
                dragging ? "border-emerald-400 bg-emerald-500/10" : "border-slate-700 hover:border-slate-500"
              }`}
            >
              <FileUp className="mx-auto h-10 w-10 text-emerald-400" />
              <p className="mt-3 font-semibold">Drop your statement CSV here, or click to choose</p>
              <p className="text-sm text-slate-500">You can add several files, for example a checking account and a credit card.</p>
              <input
                ref={fileInput}
                type="file"
                accept=".csv,text/csv"
                multiple
                className="hidden"
                onChange={(e) => loadFiles(e.target.files)}
              />
            </div>

            {error && (
              <p className="mt-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-300">{error}</p>
            )}

            <button
              onClick={() => analyse(buildSampleCsv(), "sample statement")}
              className="mt-6 text-sm text-slate-400 underline underline-offset-4 hover:text-slate-200"
            >
              No CSV handy? Try it with a sample statement
            </button>

            <p className="mt-10 flex items-center justify-center gap-2 text-sm text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Your file is processed entirely in your browser. It is never uploaded anywhere.
            </p>
          </section>
        )}

        {report && (
          <>
            <section className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-slate-900 border border-emerald-500/30 p-6 sm:p-8">
              <p className="text-sm text-emerald-300">
                From {source} · {shortDate(report.statementStart)} to {shortDate(report.statementEnd)}
              </p>
              <h1 className="mt-2 text-3xl sm:text-5xl font-extrabold tracking-tight">
                {money(report.activeYearlyTotal, false)}
                <span className="text-slate-400 text-xl sm:text-2xl font-semibold"> / year</span>
              </h1>
              <p className="mt-2 text-slate-300">
                on {active.length} active subscription{active.length === 1 ? "" : "s"} ({money(report.activeMonthlyTotal)} a month).
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={share} className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-400">
                  <Share2 className="h-4 w-4" /> Share my total
                </button>
                <button
                  onClick={pro ? exportCsv : upgrade}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 hover:bg-slate-800"
                >
                  {pro ? <Download className="h-4 w-4" /> : <Lock className="h-4 w-4" />} Export CSV
                </button>
                <button
                  onClick={() => setReport(null)}
                  className="rounded-lg px-4 py-2 text-slate-400 hover:text-slate-200"
                >
                  Scan another file
                </button>
              </div>
            </section>

            {(report.priceHikes.length > 0 || report.overlaps.length > 0) && (
              <section className="mt-6 grid gap-4 sm:grid-cols-2">
                {report.priceHikes.length > 0 && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">
                    <h2 className="flex items-center gap-2 font-semibold text-amber-300">
                      <TrendingUp className="h-5 w-5" /> {report.priceHikes.length} price increase
                      {report.priceHikes.length === 1 ? "" : "s"}
                    </h2>
                    <ul className="mt-2 space-y-1 text-sm text-slate-300">
                      {report.priceHikes.map((s) => (
                        <li key={s.id}>
                          {s.name}: {money(s.charges[0].amount)} to {money(s.amount)} (+{s.priceIncreasePct}%)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {report.overlaps.length > 0 && (
                  <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-5">
                    <h2 className="flex items-center gap-2 font-semibold text-sky-300">
                      <Layers className="h-5 w-5" /> Overlapping services
                    </h2>
                    <ul className="mt-2 space-y-1 text-sm text-slate-300">
                      {report.overlaps.map((o) => (
                        <li key={o.category}>
                          {o.subscriptions.length} {o.category.toLowerCase()} services:{" "}
                          {o.subscriptions.map((s) => s.name).join(", ")} (
                          {money(o.subscriptions.reduce((sum, s) => sum + s.yearlyCost, 0), false)}/yr)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            <section className="mt-8">
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-xl font-bold">Active subscriptions</h2>
                <p className="text-sm text-slate-400">Tick the ones you'll cancel</p>
              </div>

              {active.length === 0 && (
                <p className="mt-4 text-slate-400">
                  No active subscriptions found. Try a longer date range (at least 3 months), or add your credit card statement.
                </p>
              )}

              <ul className="mt-4 space-y-3">
                {active.map((s) => (
                  <li
                    key={s.id}
                    className={`flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border p-4 transition ${
                      toCancel.has(s.id) ? "border-emerald-500/50 bg-emerald-500/5" : "border-slate-800 bg-slate-900"
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Checkbox
                        checked={toCancel.has(s.id)}
                        onCheckedChange={() => toggle(s.id)}
                        className="mt-1 border-slate-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-slate-950"
                        aria-label={`Mark ${s.name} to cancel`}
                      />
                      <div className="min-w-0">
                        <p className="font-semibold truncate">
                          {s.name}
                          {s.priceIncreasePct !== null && (
                            <span className="ml-2 rounded bg-amber-500/15 px-1.5 py-0.5 text-xs text-amber-300">
                              +{s.priceIncreasePct}%
                            </span>
                          )}
                          {s.confidence === "medium" && (
                            <span className="ml-2 rounded bg-slate-700 px-1.5 py-0.5 text-xs text-slate-300">likely</span>
                          )}
                        </p>
                        <p className="text-sm text-slate-400">
                          {s.category} · {s.charges.length} charges · next ~{shortDate(s.nextCharge)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <p className="font-semibold">
                          {money(s.amount)}
                          <span className="text-slate-400 text-sm">{CADENCE_LABEL[s.cadence]}</span>
                        </p>
                        <p className="text-sm text-slate-400">{money(s.yearlyCost, false)}/yr</p>
                      </div>
                      <button
                        onClick={() => (guideAllowed(s) ? setOpen(s) : upgrade())}
                        className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg border border-slate-600 px-3 py-2 text-sm hover:bg-slate-800"
                      >
                        {!guideAllowed(s) && <Lock className="h-3.5 w-3.5" />} How to cancel
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {!pro && active.length > FREE_CANCEL_GUIDES && (
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-emerald-500/30 bg-slate-900 p-5">
                  <div>
                    <p className="flex items-center gap-2 font-semibold">
                      <Sparkles className="h-4 w-4 text-emerald-400" /> Get cancel guides for all {active.length} subscriptions
                    </p>
                    <p className="text-sm text-slate-400">
                      Plus ready-to-send cancellation letters and CSV export. One-time {PRO_PRICE}, no subscription (obviously).
                    </p>
                  </div>
                  <button onClick={upgrade} className="rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-emerald-400">
                    Unlock Pro · {PRO_PRICE}
                  </button>
                </div>
              )}
            </section>

            {past.length > 0 && (
              <section className="mt-8">
                <button onClick={() => setShowPast(!showPast)} className="flex items-center gap-2 text-slate-400 hover:text-slate-200">
                  <ChevronDown className={`h-4 w-4 transition ${showPast ? "rotate-180" : ""}`} />
                  {past.length} subscription{past.length === 1 ? "" : "s"} that stopped billing
                </button>
                {showPast && (
                  <ul className="mt-3 space-y-2 text-sm text-slate-400">
                    {past.map((s) => (
                      <li key={s.id} className="flex justify-between rounded-lg border border-slate-800 px-4 py-2">
                        <span>{s.name}</span>
                        <span>
                          {money(s.amount)}
                          {CADENCE_LABEL[s.cadence]} · last {shortDate(s.lastCharge)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            <p className="mt-10 flex items-start gap-2 text-xs text-slate-500">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Detection is automatic and can miss or misread charges. Check your statement before cancelling anything.
            </p>
          </>
        )}
      </main>

      {report && savings > 0 && (
        <div className="sticky bottom-0 border-t border-emerald-500/30 bg-slate-950/95 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <p>
              Cancelling {toCancel.size} saves you{" "}
              <strong className="text-emerald-400 text-lg">{money(savings, false)}/year</strong>
            </p>
            <button onClick={share} className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300">
              <Share2 className="h-4 w-4" /> Brag
            </button>
          </div>
        </div>
      )}

      <CancelDialog sub={open} pro={pro} onClose={() => setOpen(null)} onUpgrade={upgrade} />
    </div>
  );
};

export default Scan;
