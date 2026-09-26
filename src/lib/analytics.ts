// ─── Ad Pixel Event Tracking (Meta + OpenAI) ──────────────────────────────
// Meta Pixel 660125253756573 + OpenAI (ChatGPT) Ads pixel — both loaded
// consent-aware by PixelLoader. The conversion helpers below report to both;
// the OpenAI side (event mapping, hashing) lives in lib/openaiAds.ts.
// This utility provides type-safe event firing throughout the app.

import {
  identifyOpenAIUser,
  trackOpenAICustomEvent,
  trackOpenAIEvent,
  type OpenAIUserData,
} from "@/lib/openaiAds";

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
 * OpenAI dedups by pixel + event name + event_id. One ID per visitor per
 * event type means a person counts once — finishing the quiz AND the form
 * is still one lead. The server can rebuild it from the visitorId it
 * already receives (for a future OpenAI CAPI). Falls back to the action's
 * own ID when localStorage is blocked.
 */
function openAIVisitorEventId(kind: string, fallbackId?: string): string | undefined {
  const visitorId = getVisitorId();
  return visitorId ? `${kind}-${visitorId}` : fallbackId;
}

/** Every lead source reports the same OpenAI conversion: lead_created */
function reportLeadToOpenAI(eventId?: string, user?: OpenAIUserData): void {
  identifyOpenAIUser(user);
  trackOpenAIEvent("lead_created", { type: "customer_action" }, openAIVisitorEventId("lead", eventId));
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

/**
 * Fired once per question actually answered (1..7) — lets us see in Meta
 * Events Manager exactly how far people get before abandoning the quiz,
 * instead of only knowing "started" vs "completed". Meta-only funnel
 * signal, same as QuizStart — not a conversion, so not mirrored to OpenAI.
 */
export function trackQuizQuestionAnswered(questionNumber: number): void {
  trackCustomEvent("QuizQuestionAnswered", {
    content_name: "Adaptive Quiz",
    question_number: questionNumber,
  });
}

export function trackQuizComplete(
  archetype: string,
  businessType?: string,
  eventId?: string,
  user?: OpenAIUserData
): void {
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
  // OpenAI: the quiz hands over name + phone, so there it counts as a lead
  reportLeadToOpenAI(eventId, user);
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
  trackOpenAICustomEvent("qualified_lead", openAIVisitorEventId("qualified", eventId));
}

export function trackLeadSubmit(
  archetype?: string,
  businessName?: string,
  eventId?: string,
  user?: OpenAIUserData
): void {
  trackEvent(
    "Lead",
    {
      content_name: "Checkout Form",
      archetype: archetype || "none",
      business_name: businessName || "",
    },
    eventId
  );
  reportLeadToOpenAI(eventId, user);
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
  trackOpenAICustomEvent("whatsapp_contact", openAIVisitorEventId("whatsapp", eventId));
}

/**
 * Lead captured through the WhatsApp button (mini form / quiz details) —
 * OpenAI only: Meta already gets Contact for it (browser + server CAPI).
 */
export function trackWhatsAppLead(eventId: string, user?: OpenAIUserData): void {
  reportLeadToOpenAI(eventId, user);
}

export function trackExitLead(archetype?: string, eventId?: string, user?: OpenAIUserData): void {
  trackEvent(
    "Lead",
    {
      content_name: "Exit Intent",
      archetype: archetype || "none",
    },
    eventId
  );
  reportLeadToOpenAI(eventId, user);
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
