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
 * Fire a Facebook Pixel standard event
 */
export function trackEvent(event: FBStandardEvent, params?: EventParams): void {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, params);
  }
}

/**
 * Fire a Facebook Pixel custom event
 */
export function trackCustomEvent(event: string, params?: EventParams): void {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", event, params);
  }
}

// ─── Predefined Events ───────────────────────────────────────────────────

export function trackQuizStart(archetype?: string): void {
  trackCustomEvent("QuizStart", {
    content_name: "Adaptive Quiz",
    archetype: archetype || "none",
  });
}

export function trackQuizComplete(archetype: string, businessType?: string): void {
  trackEvent("CompleteRegistration", {
    content_name: "Quiz Complete",
    content_category: "Quiz",
    archetype,
    business_type: businessType || "unknown",
  });
}

export function trackLeadSubmit(archetype?: string, businessName?: string): void {
  trackEvent("Lead", {
    content_name: "Checkout Form",
    archetype: archetype || "none",
    business_name: businessName || "",
  });
}

export function trackWhatsAppClick(archetype?: string): void {
  trackEvent("Contact", {
    content_name: "WhatsApp Click",
    archetype: archetype || "none",
  });
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
