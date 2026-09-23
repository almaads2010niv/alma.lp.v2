// ─── OpenAI (ChatGPT) Ads Measurement Pixel ──────────────────────────────
// Docs: https://developers.openai.com/ads/measurement-pixel
//
// Loaded by PixelLoader under the same consent rules as the Meta Pixel.
// Conversions are mirrored from lib/analytics.ts, so every conversion point
// reports to both platforms from one call site.
//
// Events sent (OpenAI supported-events taxonomy):
//   page_viewed        ← page load
//   lead_created       ← quiz completion / checkout form / exit intent / WhatsApp lead
//   custom qualified_lead   ← quiz lead the server qualified (5K+/month AND owner/partner/marketing manager)
//   custom whatsapp_contact ← WhatsApp opened (Meta's "Contact")
//
// Debug logging ("[oaiq]" in the console) is on in dev, and in production
// only with ?oaiq_debug=1 in the URL — never for regular visitors.

export const OPENAI_PIXEL_ID = "ASzvmAXwyPRiopsTPYtn3b";
const SDK_URL = "https://bzrcdn.openai.com/sdk/oaiq.min.js";

declare global {
  interface Window {
    oaiq?: (...args: unknown[]) => void;
    _almaOaiqLoaded?: boolean;
  }
}

/** The standard OpenAI Ads events this site reports */
export type OpenAIStandardEvent = "page_viewed" | "lead_created";

/** Raw contact details — normalized + SHA-256 hashed here, never sent raw */
export interface OpenAIUserData {
  email?: string;
  phone?: string;
}

function debugEnabled(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  try {
    return new URLSearchParams(window.location.search).has("oaiq_debug");
  } catch {
    return false;
  }
}

function injectSdk(): void {
  /* eslint-disable */
  (function (w: any, d: Document, s: string, u: string) {
    if (w.oaiq) return;
    const q: any = function () {
      q.q.push(arguments);
    };
    q.q = [];
    w.oaiq = q;
    const j = d.createElement(s) as HTMLScriptElement;
    j.async = true;
    j.src = u;
    const f = d.getElementsByTagName(s)[0];
    if (f?.parentNode) f.parentNode.insertBefore(j, f);
    else d.head.appendChild(j);
  })(window, document, "script", SDK_URL);
  /* eslint-enable */
}

/**
 * Inject the SDK once, init with the pixel ID and report the page view.
 * Safe to call again (consent changes, StrictMode double effects).
 */
export function loadOpenAIPixel(): void {
  if (typeof window === "undefined" || window._almaOaiqLoaded) return;
  window._almaOaiqLoaded = true;

  try {
    injectSdk();
    window.oaiq?.("init", {
      pixelId: OPENAI_PIXEL_ID,
      ...(debugEnabled() ? { debug: true } : {}),
    });
    window.oaiq?.("measure", "page_viewed", { type: "contents" });
  } catch {
    // Measurement must never break the page
  }
}

/**
 * Cookie-banner choice → SDK consent. false stops all pings and deletes the
 * pixel's cookies (__oppref / __obref); true lifts a stored denial.
 * Applied immediately (not queued) so a decline wins over pending events.
 */
export function setOpenAIConsent(granted: boolean): void {
  try {
    window.oaiq?.("consent", granted);
  } catch {
    // ignore
  }
}

// ── Ordered command queue ──────────────────────────────────────────────
// Hashing user data is async, so conversion commands run through one
// promise chain: an init({ user }) always lands before the events that
// follow it, and a failure in one step never blocks the rest.
let queue: Promise<void> = Promise.resolve();

function enqueue(task: () => void | Promise<void>): void {
  queue = queue.then(task).catch(() => {});
}

function pixelActive(): boolean {
  return typeof window !== "undefined" && Boolean(window.oaiq);
}

function command(...args: unknown[]): void {
  window.oaiq?.(...args);
}

async function sha256Hex(value: string): Promise<string | undefined> {
  if (typeof crypto === "undefined" || !crypto.subtle) return undefined;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

function normalizeEmail(email?: string): string | undefined {
  const value = email?.trim().toLowerCase();
  return value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : undefined;
}

/**
 * Phone as typed on the site ("052-123 4567", "+972 52…", "00972…") →
 * E.164 digits without "+" ("972521234567"), the same convention as the
 * Meta CAPI hashing in lib/capi.ts. The SDK's own auto-matching drops the
 * leading 0 without adding 972, so explicit hashing matters for Israel.
 */
function normalizePhone(phone?: string): string | undefined {
  if (!phone) return undefined;
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = `972${digits.slice(1)}`;
  return digits.length >= 8 && digits.length <= 15 ? digits : undefined;
}

// Accumulated across the visit — each init({ user }) must carry the full
// object, so a later email doesn't drop the phone from an earlier step.
let knownUser: Record<string, string> = {};

/**
 * Attach hashed contact details (documented Pixel user fields) so OpenAI
 * can match the conversion to a ChatGPT user. Only hashes leave the browser.
 */
export function identifyOpenAIUser(user?: OpenAIUserData): void {
  if (!user || !pixelActive()) return;

  enqueue(async () => {
    const email = normalizeEmail(user.email);
    const phone = normalizePhone(user.phone);
    const [emailHash, phoneHash] = await Promise.all([
      email ? sha256Hex(email) : undefined,
      phone ? sha256Hex(phone) : undefined,
    ]);

    const fields: Record<string, string> = {};
    if (emailHash) fields.email_sha256 = emailHash;
    if (phoneHash) fields.phone_number_sha256 = phoneHash;
    if (Object.keys(fields).length === 0) return;

    knownUser = { ...knownUser, ...fields };
    command("init", { user: knownUser });
  });
}

/** Standard event (data shape per OpenAI supported events) */
export function trackOpenAIEvent(
  event: OpenAIStandardEvent,
  data: Record<string, unknown>,
  eventId?: string
): void {
  if (!pixelActive()) return;
  enqueue(() => {
    if (eventId) {
      command("measure", event, data, { event_id: eventId });
    } else {
      command("measure", event, data);
    }
  });
}

/** Custom event — name: lowercase letters, digits, "_" or "-", 1-64 chars */
export function trackOpenAICustomEvent(name: string, eventId?: string): void {
  if (!pixelActive()) return;
  enqueue(() => {
    command(
      "measure",
      "custom",
      { type: "custom" },
      { custom_event_name: name, ...(eventId ? { event_id: eventId } : {}) }
    );
  });
}
