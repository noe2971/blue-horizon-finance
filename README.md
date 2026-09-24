# SubSlayer

**Find and cancel the subscriptions you forgot about.** Drop in a bank statement CSV and SubSlayer shows every recurring charge, its yearly cost, price hikes and overlapping services, plus how to cancel each one.

- **No bank login.** Users download a CSV from their bank. Nothing like Plaid, no credentials.
- **Nothing uploaded.** All parsing and detection runs in the browser. There's no backend, so no server costs and no data liability.
- **One-time price.** Free tier finds everything. Pro ($9 once) unlocks all cancel guides, cancellation letters and CSV export.

## Run it

```sh
npm install
npm run dev      # http://localhost:8080
npm test         # detection + CSV parsing tests
npm run build    # static site in dist/
```

Try `/scan?demo` for a built-in sample statement.

## Take payments (15 minutes)

1. Create a [Stripe](https://stripe.com) account and a **Payment Link** for a one-time $9 product.
2. In the Payment Link's settings, under **After payment**, choose "Don't show confirmation page" and redirect to
   `https://YOUR-DOMAIN/scan?unlock=YOUR_SECRET_CODE`
3. Set these environment variables on your host (see `.env.example`):
   - `VITE_STRIPE_PAYMENT_LINK`: the Payment Link URL
   - `VITE_UNLOCK_CODE`: the same secret code as in step 2
   - `VITE_PRO_PRICE`: optional price label, e.g. `$9`

With no payment link set, every feature is unlocked (handy for development).

> **Heads-up:** this is honour-system gating. The unlock code ships in the JS bundle, so a technical user could find it. That's a fine trade-off at launch, because the people who'd dig for it weren't going to pay. Once there's real revenue, switch to license keys (Lemon Squeezy or Gumroad have license-key APIs you can check from a tiny serverless function).

## Deploy (free)

It's a static site. Push to GitHub and import it on **Vercel**, **Netlify** or **Cloudflare Pages** with build command `npm run build` and output folder `dist`. SPA routing is already configured (`vercel.json`, `public/_redirects`). Buy a domain (~$10/yr).

## Launch plan

The hard part isn't the code; it's getting people to see it. What tends to work for this kind of product:

1. **Lead with the shock number.** The app's core loop is "you're paying $2,183/year" plus a **Share my total** button. Post your own real result (screenshot the total and blur the details) on Reddit (r/personalfinance, r/povertyfinance, r/Frugal, r/SideProject; read each sub's self-promo rules first), X/Threads and TikTok. Short videos of "I found $X in forgotten subscriptions" are a proven format.
2. **Launch on Product Hunt and Hacker News** ("Show HN"). The privacy angle ("no bank login, nothing leaves your browser") is the hook for technical audiences.
3. **SEO pages.** People search "how to cancel [Service]" constantly. Add a page per service in `src/lib/merchants.ts` (`/cancel/netflix` etc.) with cancel steps and a CTA to scan. That's 50+ pages of free, evergreen traffic.
4. **Time it.** January (New Year budgets) and right after big streaming price hikes are the best moments to post.
5. **Measure.** Add privacy-friendly analytics (Plausible or Umami) to see how many visitors scan, and how many of those upgrade.

**Realistic expectations:** most apps make little or nothing. A useful, well-marketed tool like this could earn a few hundred to a few thousand dollars a month if it catches on, and that depends almost entirely on distribution. Treat it as a fast, cheap experiment: launch in a week, and if nobody bites after a real marketing push, move on to the next one.

## Ideas to grow revenue

- **Affiliate "switch & save"** suggestions (cheaper phone plans, bundles). Only recommend ones you'd actually use.
- **Annual re-scan reminder** by email (collect emails with consent). Recurring engagement means recurring upsells.
- **Price-hike watch:** a paid tier that re-checks when users upload new statements.
- **B2B:** the same engine for small businesses auditing SaaS spend, which is a higher price point.

## Code map

| Path | What it does |
| --- | --- |
| `src/lib/csv.ts` | Parses bank CSVs: delimiter/column detection, US/EU amounts and dates, debit/credit columns |
| `src/lib/detect.ts` | Groups charges by merchant and detects cadence (weekly to yearly), price hikes, overlaps, and active vs. stopped |
| `src/lib/merchants.ts` | ~55 known services with categories and direct cancel links. **Add more; it improves detection and SEO.** |
| `src/lib/letter.ts` | Cancellation letter generator |
| `src/lib/pro.ts` | Stripe Payment Link unlock |
| `src/pages/Landing.tsx` / `Scan.tsx` | Marketing page / the app |
