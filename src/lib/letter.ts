import type { Subscription } from "./detect";

export interface LetterDetails {
  fullName: string;
  email: string;
  accountId: string;
}

const fmt = (d: Date) =>
  d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

/** A firm, polite cancellation request that also asks the merchant to stop future billing. */
export function cancellationLetter(sub: Subscription, who: LetterDetails, today = new Date()): string {
  const name = who.fullName.trim() || "[Your full name]";
  const email = who.email.trim() || "[Email on the account]";
  const account = who.accountId.trim() || "[Account or membership number, if known]";

  return `${fmt(today)}

To: ${sub.name} Customer Support

Subject: Cancellation of subscription - effective immediately

Hello,

I am writing to cancel my ${sub.name} subscription, effective immediately.

Account holder: ${name}
Account email: ${email}
Account / membership number: ${account}
Most recent charge: $${sub.amount.toFixed(2)} on ${fmt(sub.lastCharge)}

Please:
  1. Cancel the subscription and any auto-renewal on this account.
  2. Stop all future charges to my payment method.
  3. Send written confirmation of the cancellation to ${email}.

I do not authorise any further charges from this date. Any charge made after this notice will be disputed with my card issuer.

Thank you,
${name}`;
}
