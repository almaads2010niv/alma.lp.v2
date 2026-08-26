// ── Direct lead notification fan-out ───────────────────────────────
// Replicates the proven flow from lpfitness.alma-ads.co.il:
//   1. Zapier hook ua57pgr → WhatsApp notification to Niv (server-side)
//   2. Web3Forms → email to Niv (CLIENT-side only — the free plan
//      rejects server calls with HTTP 403 "Pro plan is required";
//      lpfitness also calls it from the browser)
// This is IN ADDITION to the existing pipeline (Zapier up6xr4o + AMP
// CRM + CAPI) — those store the lead; this makes sure Niv HEARS about
// it. Root cause of months of silent leads: nothing ever notified him.

const NOTIFY_ZAPIER_HOOK = "https://hooks.zapier.com/hooks/catch/4214758/ua57pgr/";
const WEB3FORMS_ACCESS_KEY = "5e7c6215-2df6-4051-9d19-5a5ea96e0b9c";

interface LeadNotifyInput {
  name: string;
  phone: string;
  email?: string;
  marketingConsent?: boolean;
  /** Human-readable origin, shown in the notification (e.g. "טופס בדף") */
  leadType: string;
}

/**
 * Server-side WhatsApp notification via the lpfitness Zapier hook.
 * Always await this in routes — Vercel kills fire-and-forget fetches.
 * Body shape mirrors lpfitness (incl. no Content-Type header) so the
 * existing Zap parses it unchanged.
 */
export async function notifyLead(input: LeadNotifyInput): Promise<void> {
  const { name, phone, email, marketingConsent, leadType } = input;

  try {
    const res = await fetch(NOTIFY_ZAPIER_HOOK, {
      method: "POST",
      body: JSON.stringify({
        name,
        phone,
        email: email || "",
        marketing_consent: marketingConsent ? "כן" : "לא",
        lead_type: leadType,
        source: "boost.alma-ads.co.il",
      }),
    });
    if (!res.ok) {
      console.error(`Lead notify via Zapier returned HTTP ${res.status}`);
    }
  } catch (error) {
    console.error("Lead notify via Zapier failed:", error);
  }
}

/**
 * Client-side email notification via Web3Forms (browser only — see above).
 * Fire-and-forget with keepalive; never blocks the user flow.
 */
export function notifyLeadEmailFromBrowser(input: LeadNotifyInput): void {
  if (typeof window === "undefined") return;
  const { name, phone, email, marketingConsent, leadType } = input;

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      name,
      phone,
      email: email || "",
      marketing_consent: marketingConsent ? "כן, מאשר/ת" : "לא אישר/ה",
      lead_type: leadType,
      subject: `ליד חדש מדף הנחיתה של עלמה (${leadType})`,
    }),
  }).catch(() => {});
}
