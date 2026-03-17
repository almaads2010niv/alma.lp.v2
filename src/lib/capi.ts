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
}

interface CAPIEventOptions {
  eventName: "Lead" | "CompleteRegistration" | "Contact" | "ViewContent";
  eventSourceUrl: string;
  userData: CAPIUserData;
  customData?: Record<string, unknown>;
}

/**
 * Fire a server-side event to Meta Conversions API.
 * Non-blocking, fire-and-forget. Logs warnings on failure.
 */
export async function fireCAPIEvent(options: CAPIEventOptions): Promise<void> {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) {
    console.warn("META_CAPI_TOKEN not set — skipping CAPI event:", options.eventName);
    return;
  }

  const { eventName, eventSourceUrl, userData, customData } = options;

  // Build user_data with hashed PII
  const user_data: Record<string, string> = {};
  if (userData.email) user_data.em = sha256(userData.email);
  if (userData.phone) user_data.ph = hashPhone(userData.phone);
  if (userData.firstName) user_data.fn = sha256(userData.firstName);
  if (userData.clientIp) user_data.client_ip_address = userData.clientIp;
  if (userData.clientUserAgent) user_data.client_user_agent = userData.clientUserAgent;
  if (userData.fbclid) user_data.fbc = `fb.1.${Date.now()}.${userData.fbclid}`;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: eventSourceUrl,
        action_source: "website",
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
      console.warn(`CAPI ${eventName} failed (HTTP ${res.status}):`, err);
    }
  } catch (error) {
    console.warn(`CAPI ${eventName} network error:`, error);
  }
}
