import { useState } from "react";
import { Copy, ExternalLink, Lock } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Subscription } from "@/lib/detect";
import { money, shortDate } from "@/lib/format";
import { cancellationLetter, type LetterDetails } from "@/lib/letter";

interface Props {
  sub: Subscription | null;
  pro: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function CancelDialog({ sub, pro, onClose, onUpgrade }: Props) {
  const [details, setDetails] = useState<LetterDetails>({ fullName: "", email: "", accountId: "" });
  if (!sub) return null;

  const letter = cancellationLetter(sub, details);
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(`how to cancel ${sub.name} subscription`)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(letter);
      toast.success("Letter copied. Paste it into an email or support chat.");
    } catch {
      toast.error("Couldn't copy. Select the text and copy it manually.");
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-2xl">Cancel {sub.name}</DialogTitle>
          <DialogDescription className="text-slate-400">
            {money(sub.amount)} {sub.cadence}, which is {money(sub.yearlyCost)} a year. Next charge expected around{" "}
            {shortDate(sub.nextCharge)}.
          </DialogDescription>
        </DialogHeader>

        <section className="space-y-3">
          <h3 className="font-semibold">1. Cancel online</h3>
          {sub.known?.cancelSteps && <p className="text-sm text-amber-300">{sub.known.cancelSteps}</p>}
          <div className="flex flex-wrap gap-2">
            {sub.known?.cancelUrl && (
              <a
                href={sub.known.cancelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Open {sub.name} cancel page <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 hover:bg-slate-800"
            >
              Search cancel instructions <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <p className="text-sm text-slate-400">
            If you subscribed through the App Store or Google Play, cancel in your phone's subscription settings instead.
          </p>
        </section>

        <section className="space-y-3 pt-4">
          <h3 className="font-semibold">2. If they make it hard, send this letter</h3>
          {pro ? (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                {(
                  [
                    ["fullName", "Your name"],
                    ["email", "Account email"],
                    ["accountId", "Account # (optional)"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="space-y-1">
                    <Label htmlFor={key} className="text-xs text-slate-400">
                      {label}
                    </Label>
                    <Input
                      id={key}
                      value={details[key]}
                      onChange={(e) => setDetails({ ...details, [key]: e.target.value })}
                      className="bg-slate-950 border-slate-700"
                    />
                  </div>
                ))}
              </div>
              <pre className="whitespace-pre-wrap rounded-lg bg-slate-950 border border-slate-800 p-4 text-sm text-slate-300 font-sans">
                {letter}
              </pre>
              <button
                onClick={copy}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 hover:bg-slate-800"
              >
                <Copy className="h-4 w-4" /> Copy letter
              </button>
            </>
          ) : (
            <button
              onClick={onUpgrade}
              className="w-full rounded-lg border border-dashed border-slate-600 p-4 text-left hover:bg-slate-800"
            >
              <span className="flex items-center gap-2 font-semibold">
                <Lock className="h-4 w-4 text-emerald-400" /> Cancellation letters are a Pro feature
              </span>
              <span className="text-sm text-slate-400">
                A ready-to-send letter that asks them to stop billing you and confirm in writing.
              </span>
            </button>
          )}
        </section>

        <section className="space-y-2 pt-4">
          <h3 className="font-semibold">3. Still getting charged?</h3>
          <p className="text-sm text-slate-400">
            Call your bank or card issuer and ask them to block recurring payments to this merchant. Keep your
            cancellation confirmation. You can dispute any charge made after you cancelled.
          </p>
        </section>
      </DialogContent>
    </Dialog>
  );
}
