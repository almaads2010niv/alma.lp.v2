// ── WhatsApp deep-link helper ──────────────────────────────────────
// wa.me 302s to api.whatsapp.com/send, which on DESKTOP shows an
// interstitial page ("להמשיך לצ'אט" → WhatsApp Web) before the chat.
// web.whatsapp.com/send skips that page and lands straight in the
// conversation, so we pick the URL per device:
//   mobile  → wa.me (deep-links into the WhatsApp app)
//   desktop → web.whatsapp.com/send (straight into WhatsApp Web)

export const WHATSAPP_NUMBER = "972523133297";

function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return true; // SSR-safe default
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function whatsappUrl(message: string): string {
  const text = encodeURIComponent(message);
  return isMobileDevice()
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
    : `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${text}`;
}
