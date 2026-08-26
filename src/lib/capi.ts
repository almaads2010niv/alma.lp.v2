import { createHash } from "crypto";

// ── Meta Conversions API (Server-Side Events) ──────────────────────
// Docs: https://developers.facebook.com/docs/marketing-api/conversions-api
//
// Fires events from the server, bypassing ad blockers.
// Requires META_CAPI_TOKEN env var (set in Vercel dashboard).

const PIXEL_ID = "660125253756573";
const API_VERSION = "v21.0";
const CAPI_ENDPOINT = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`;

function sha256(value: string): string {
  return createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

/** Hash phone to E.164 format (Israeli) then SHA-256 */
function hashPhone(phone: string): string {
  const clean = phone.replace(/[-\s]/g, "");
  // Convert 05x to 9725x
  const e164 = clean.startsWith("0")
    ? `972${clean.slice(1)}`
    : clean.startsWith("+")
      ? clean.slice(1)
      : clean;
  return sha256(e164);
}

interface CAPIUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  clientIp?: string;
  clientUserAgent?: string;
  fbclid?: string;
  /** Full _fbc cookie value from the browser — preferred over rebuilding from fbclid */
  fbc?: string;
  /** Stable per-visitor ID — hashed into external_id for better match quality */
  externalId?: string;
}

interface CAPIEventOptions {
  eventName: "Lead" | "CompleteRegistration" | "Contact" | "ViewContent" | "QualifiedLead";
  eventSourceUrl: string;
  userData: CAPIUserData;
  customData?: Record<string, unknown>;
  /** Deduplication ID — must match the browser pixel's eventID for the same action */
  eventId?: string;
}

/**
 * Fire a server-side event to Meta Conversions API.
 * Non-blocking, fire-and-forget. Logs warnings on failure.
 */
export async function fireCAPIEvent(options: CAPIEventOptions): Promise<void> {
  const { eventName, eventSourceUrl, userData, customData, eventId } = options;
  const source = (customData?.content_name as string) || eventSourceUrl;

  const token = process.env.META_CAPI_TOKEN;
  if (!token) {
    // In production a missing token means server events are silently lost —
    // fail loudly so it shows up in Vercel logs. In dev it's expected.
    if (process.env.NODE_ENV === "production") {
      console.error(
        `CAPI ERROR: event "${eventName}" (source: ${source}) NOT sent — META_CAPI_TOKEN is missing in env`
      );
    } else {
      console.warn(`META_CAPI_TOKEN not set — skipping CAPI event: ${eventName} (${source})`);
    }
    return;
  }

  // Build user_data with hashed PII
  const user_data: Record<string, string> = {};
  if (userData.email) user_data.em = sha256(userData.email);
  if (userData.phone) user_data.ph = hashPhone(userData.phone);
  if (userData.firstName) user_data.fn = sha256(userData.firstName);
  if (userData.clientIp) user_data.client_ip_address = userData.clientIp;
  if (userData.clientUserAgent) user_data.client_user_agent = userData.clientUserAgent;
  if (userData.externalId) user_data.external_id = sha256(userData.externalId);
  // fbc: prefer the browser's _fbc cookie (canonical value incl. original
  // click timestamp); fall back to rebuilding it from the fbclid URL param
  if (userData.fbc) {
    user_data.fbc = userData.fbc;
  } else if (userData.fbclid) {
    user_data.fbc = `fb.1.${Date.now()}.${userData.fbclid}`;
  }

  const payload = {
    // When META_CAPI_TEST_CODE is set (from Events Manager → Test Events),
    // server events appear live in the Test Events tool. Remove after testing!
    ...(process.env.META_CAPI_TEST_CODE
      ? { test_event_code: process.env.META_CAPI_TEST_CODE }
      : {}),
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: eventSourceUrl,
        action_source: "website",
        ...(eventId ? { event_id: eventId } : {}),
        user_data,
        ...(customData ? { custom_data: customData } : {}),
      },
    ],
  };

  try {
    const res = await fetch(`${CAPI_ENDPOINT}?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "unknown");
      console.error(`CAPI ERROR: ${eventName} (source: ${source}) failed (HTTP ${res.status}):`, err);
    }
  } catch (error) {
    console.error(`CAPI ERROR: ${eventName} (source: ${source}) network error:`, error);
  }
}
