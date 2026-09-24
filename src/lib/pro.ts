/**
 * Pro unlock via a Stripe Payment Link (no backend needed).
 *
 * Set up in Stripe: create a Payment Link, and under "After payment" choose
 * "Don't show confirmation page" and redirect to
 *   https://<your-domain>/scan?unlock=<VITE_UNLOCK_CODE>
 *
 * If VITE_STRIPE_PAYMENT_LINK is unset (local dev), everything is unlocked.
 *
 * This is honour-system gating: a determined user could read the code from the
 * bundle. That's fine for launch; see README "Scaling up" for license keys.
 */
const PAYMENT_LINK = import.meta.env.VITE_STRIPE_PAYMENT_LINK as string | undefined;
const UNLOCK_CODE = (import.meta.env.VITE_UNLOCK_CODE as string | undefined) ?? "";
const STORAGE_KEY = "subslayer.pro";

export const PRO_PRICE = (import.meta.env.VITE_PRO_PRICE as string | undefined) ?? "$9";
export const FREE_CANCEL_GUIDES = 3;

export function paymentsConfigured(): boolean {
  return Boolean(PAYMENT_LINK);
}

export function paymentLink(): string | undefined {
  return PAYMENT_LINK;
}

export function isPro(): boolean {
  if (!PAYMENT_LINK) return true;
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Reads ?unlock=... from the URL after Stripe redirects back. Returns true if newly unlocked. */
export function consumeUnlockParam(search: string): boolean {
  const code = new URLSearchParams(search).get("unlock");
  if (!code || !UNLOCK_CODE || code !== UNLOCK_CODE) return false;
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    return false;
  }
  return true;
}
