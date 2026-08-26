// ── Direct lead notification fan-out ───────────────────────────────
// Replicates the proven flow from lpfitness.alma-ads.co.il:
//   1. Web3Forms → email to Niv
//   2. Zapier hook ua57pgr → WhatsApp notification to Niv
// This is IN ADDITION to the existing pipeline (Zapier up6xr4o + AMP
// CRM + CAPI) — those store the lead; this makes sure Niv HEARS about
// it. Root cause of months of silent leads: nothing ever notified him.
//
// Server-side only. Always await this in routes — Vercel kills
// fire-and-forget fetches when the function returns.

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

export async function notifyLead(input: LeadNotifyInput): Promise<void> {
  const { name, phone, email, marketingConsent, leadType } = input;

  const results = await Promise.allSettled([
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        name,
        phone,
        email: email || "",
        marketing_consent: marketingConsent ? "כן, מאשר/ת" : "לא אישר/ה",
        lead_type: leadType,
        subject: `ליד חדש מדף הנחיתה של עלמה (${leadType})`,
      }),
    }),
    // Body shape mirrors lpfitness exactly (incl. no Content-Type header)
    // so the existing Zap parses it the same way
    fetch(NOTIFY_ZAPIER_HOOK, {
      method: "POST",
      body: JSON.stringify({
        name,
        phone,
        email: email || "",
        marketing_consent: marketingConsent ? "כן" : "לא",
        lead_type: leadType,
        source: "boost.alma-ads.co.il",
      }),
    }),
  ]);

  results.forEach((r, i) => {
    const target = i === 0 ? "Web3Forms" : "Zapier-notify";
    if (r.status === "rejected") {
      console.error(`Lead notify via ${target} failed:`, r.reason);
    } else if (!r.value.ok) {
      console.error(`Lead notify via ${target} returned HTTP ${r.value.status}`);
    }
  });
}
