import { Link } from "react-router-dom";
import { Check, FileSpreadsheet, KeyRound, Layers, ScanSearch, ShieldCheck, Scissors, TrendingUp } from "lucide-react";
import { Logo } from "@/components/Logo";
import { PRO_PRICE } from "@/lib/pro";

const CTA = ({ children = "Scan my statement free" }: { children?: string }) => (
  <Link
    to="/scan"
    className="inline-block rounded-xl bg-emerald-500 px-6 py-3.5 text-lg font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400"
  >
    {children}
  </Link>
);

const steps = [
  { icon: FileSpreadsheet, title: "Export a CSV", body: "Every bank and card lets you download transactions as a CSV. Grab the last 6 to 12 months." },
  { icon: ScanSearch, title: "Drop it in", body: "SubSlayer finds every recurring charge: monthly, yearly, even weekly. It all happens in your browser." },
  { icon: Scissors, title: "Slay them", body: "See the yearly cost, tick the ones you don't need, and use the direct cancel link or letter." },
];

const features = [
  { icon: TrendingUp, title: "Price hike alerts", body: "Spot the services that quietly raised prices on you." },
  { icon: Layers, title: "Overlap detection", body: "Paying for 4 streaming services? You'll see it." },
  { icon: KeyRound, title: "No bank login", body: "We never ask for your bank password. Ever." },
  { icon: ShieldCheck, title: "Nothing uploaded", body: "Your statement never leaves your device. No account needed." },
];

const faqs = [
  {
    q: "Is my data safe?",
    a: "Your statement is read by code running in your own browser tab. It is never sent to a server. Close the tab and it's gone.",
  },
  {
    q: "How is this different from other subscription trackers?",
    a: "Most connect to your bank with your login credentials and charge a monthly fee, which is a subscription to cancel subscriptions. SubSlayer needs neither.",
  },
  {
    q: "Which banks work?",
    a: "Any bank or card that exports CSV. That's nearly all of them. Look for 'Download transactions' or 'Export' on their website.",
  },
  {
    q: "Do you cancel for me?",
    a: "You stay in control. We give you the direct cancel page, step-by-step tips, and a ready-to-send letter for the stubborn ones.",
  },
];

const Landing = () => (
  <div className="min-h-screen bg-slate-950 text-slate-100">
    <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
      <Logo />
      <nav className="flex items-center gap-6 text-sm">
        <a href="#pricing" className="text-slate-400 hover:text-slate-200 hidden sm:inline">Pricing</a>
        <a href="#faq" className="text-slate-400 hover:text-slate-200 hidden sm:inline">FAQ</a>
        <Link to="/scan" className="rounded-lg bg-slate-800 px-4 py-2 font-semibold hover:bg-slate-700">Open app</Link>
      </nav>
    </header>

    <section className="mx-auto max-w-4xl px-4 pt-16 pb-20 text-center">
      <p className="inline-block rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1 text-sm text-emerald-300">
        No bank login · Nothing uploaded · 30 seconds
      </p>
      <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05]">
        You're paying for subscriptions <span className="text-emerald-400">you forgot about.</span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
        Drop in your bank statement. SubSlayer finds every recurring charge, shows what it costs you per year, flags
        sneaky price hikes, and hands you the cancel link.
      </p>
      <div className="mt-10 flex flex-col items-center gap-3">
        <CTA />
        <Link to="/scan?demo" className="text-sm text-slate-500 hover:text-slate-300">or try it with sample data first →</Link>
      </div>
    </section>

    <section className="border-y border-slate-800 bg-slate-900/50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, body }, i) => (
          <div key={title}>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/15 text-emerald-400">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm text-slate-500">Step {i + 1}</span>
            </div>
            <h3 className="mt-4 text-xl font-bold">{title}</h3>
            <p className="mt-2 text-slate-400">{body}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="text-center text-3xl font-extrabold">Built to find the money, not to take it</h2>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <Icon className="h-6 w-6 text-emerald-400" />
            <h3 className="mt-4 font-bold">{title}</h3>
            <p className="mt-1 text-sm text-slate-400">{body}</p>
          </div>
        ))}
      </div>
    </section>

    <section id="pricing" className="mx-auto max-w-4xl px-4 py-20">
      <h2 className="text-center text-3xl font-extrabold">Simple pricing. One time. Obviously.</h2>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h3 className="text-lg font-bold">Free</h3>
          <p className="mt-2 text-4xl font-extrabold">$0</p>
          <ul className="mt-6 space-y-3 text-slate-300">
            {["Find every subscription", "Yearly cost totals", "Price hike & overlap alerts", "3 cancel guides"].map((f) => (
              <li key={f} className="flex gap-2"><Check className="h-5 w-5 text-emerald-400" />{f}</li>
            ))}
          </ul>
          <Link to="/scan" className="mt-8 block rounded-xl border border-slate-600 py-3 text-center font-semibold hover:bg-slate-800">
            Start free
          </Link>
        </div>
        <div className="rounded-2xl border-2 border-emerald-500 bg-slate-900 p-8">
          <h3 className="text-lg font-bold text-emerald-400">Pro</h3>
          <p className="mt-2 text-4xl font-extrabold">{PRO_PRICE}<span className="text-base font-medium text-slate-400"> once</span></p>
          <ul className="mt-6 space-y-3 text-slate-300">
            {["Everything in Free", "Cancel guides for every subscription", "Ready-to-send cancellation letters", "CSV export", "Free updates, forever"].map((f) => (
              <li key={f} className="flex gap-2"><Check className="h-5 w-5 text-emerald-400" />{f}</li>
            ))}
          </ul>
          <Link to="/scan" className="mt-8 block rounded-xl bg-emerald-500 py-3 text-center font-bold text-slate-950 hover:bg-emerald-400">
            Scan first, upgrade if it's worth it
          </Link>
        </div>
      </div>
    </section>

    <section id="faq" className="mx-auto max-w-3xl px-4 py-20">
      <h2 className="text-center text-3xl font-extrabold">Questions</h2>
      <dl className="mt-10 space-y-6">
        {faqs.map(({ q, a }) => (
          <div key={q} className="rounded-xl border border-slate-800 p-6">
            <dt className="font-bold">{q}</dt>
            <dd className="mt-2 text-slate-400">{a}</dd>
          </div>
        ))}
      </dl>
    </section>

    <section className="px-4 py-20 text-center">
      <h2 className="text-3xl font-extrabold">How much are you really paying?</h2>
      <p className="mt-3 text-slate-400">Find out in 30 seconds. Free.</p>
      <div className="mt-8"><CTA>Find my subscriptions</CTA></div>
    </section>

    <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
      © {new Date().getFullYear()} SubSlayer · Your data never leaves your browser.
    </footer>
  </div>
);

export default Landing;
