// ─── Facebook Pixel Event Tracking ────────────────────────────────────────
// Pixel ID: 660125253756573 (loaded in layout.tsx)
// This utility provides type-safe event firing throughout the app.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type FBStandardEvent =
  | "PageView"
  | "Lead"
  | "Contact"
  | "CompleteRegistration"
  | "ViewContent"
  | "InitiateCheckout"
  | "Schedule";

interface EventParams {
  content_name?: string;
  content_category?: string;
  archetype?: string;
  business_name?: string;
  business_type?: string;
  value?: number;
  currency?: string;
  [key: string]: unknown;
}

/**
 * Generate a unique event ID for Meta deduplication.
 * The same ID must go to the browser pixel (eventID) and to the
 * Conversions API (event_id) so Meta counts the event once.
 */
export function generateEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

const VISITOR_ID_KEY = "alma_visitor_id";

/**
 * Stable per-visitor ID (persisted in localStorage), sent to the server
 * as Meta external_id — hashed there before reaching CAPI.
 */
export function getVisitorId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = generateEventId();
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return undefined; // localStorage blocked (private mode)
  }
}

/** Read the Meta _fbc cookie (set by the pixel when the visitor arrives with fbclid) */
export function getFbc(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(/(?:^|;\s*)_fbc=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Fire a Facebook Pixel standard event
 */
export function trackEvent(event: FBStandardEvent, params?: EventParams, eventId?: string): void {
  if (typeof window !== "undefined" && window.fbq) {
    if (eventId) {
      window.fbq("track", event, params, { eventID: eventId });
    } else {
      window.fbq("track", event, params);
    }
  }
}

/**
 * Fire a Facebook Pixel custom event
 */
export function trackCustomEvent(event: string, params?: EventParams, eventId?: string): void {
  if (typeof window !== "undefined" && window.fbq) {
    if (eventId) {
      window.fbq("trackCustom", event, params, { eventID: eventId });
    } else {
      window.fbq("trackCustom", event, params);
    }
  }
}

// ─── Predefined Events ───────────────────────────────────────────────────

export function trackQuizStart(archetype?: string): void {
  trackCustomEvent("QuizStart", {
    content_name: "Adaptive Quiz",
    archetype: archetype || "none",
  });
}

export function trackQuizComplete(archetype: string, businessType?: string, eventId?: string): void {
  trackEvent(
    "CompleteRegistration",
    {
      content_name: "Quiz Complete",
      content_category: "Quiz",
      archetype,
      business_type: businessType || "unknown",
    },
    eventId
  );
}

/**
 * Qualified quiz completion — the event Meta campaigns should optimize on.
 * Qualification criteria live server-side; the browser fires this only when
 * the score API says the lead qualified, sharing the event ID for dedup.
 */
export function trackQualifiedLead(eventId: string): void {
  trackCustomEvent(
    "QualifiedLead",
    {
      content_name: "Qualified Quiz Lead",
      content_category: "Quiz",
    },
    eventId
  );
}

export function trackLeadSubmit(archetype?: string, businessName?: string, eventId?: string): void {
  trackEvent(
    "Lead",
    {
      content_name: "Checkout Form",
      archetype: archetype || "none",
      business_name: businessName || "",
    },
    eventId
  );
}

export function trackWhatsAppClick(archetype?: string, eventId?: string): void {
  trackEvent(
    "Contact",
    {
      content_name: "WhatsApp Click",
      archetype: archetype || "none",
    },
    eventId
  );
}

export function trackExitLead(archetype?: string, eventId?: string): void {
  trackEvent(
    "Lead",
    {
      content_name: "Exit Intent",
      archetype: archetype || "none",
    },
    eventId
  );
}

export function trackExitIntentSubmit(archetype?: string): void {
  trackCustomEvent("ExitIntentLead", {
    content_name: "Exit Intent Popup",
    archetype: archetype || "none",
  });
}

export function trackCTAClick(ctaName: string, archetype?: string): void {
  trackCustomEvent("CTAClick", {
    content_name: ctaName,
    archetype: archetype || "none",
  });
}
