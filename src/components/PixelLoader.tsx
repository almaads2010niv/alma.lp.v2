"use client";

import { useEffect } from "react";

// ── Consent-aware Meta Pixel loader ────────────────────────────────
// The pixel used to load unconditionally in layout.tsx, which made the
// cookie banner's "דחייה" button cosmetic. Now:
//   - stored "declined"  → the pixel is never injected
//   - stored "accepted" or no choice yet → pixel loads as before
//   - decline mid-session → CookieConsent fires alma-consent-changed and
//     we call fbq('consent','revoke') to stop further events
//   - accept mid-session (incl. after a previous decline) → pixel is
//     injected on the spot / consent granted

const PIXEL_ID = "660125253756573";
const CONSENT_KEY = "cookie-consent";
export const CONSENT_EVENT = "alma-consent-changed";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _almaPixelLoaded?: boolean;
  }
}

function injectPixel(): void {
  if (window._almaPixelLoaded) return;
  window._almaPixelLoaded = true;

  /* eslint-disable */
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode?.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  window.fbq?.("init", PIXEL_ID);
  window.fbq?.("track", "PageView");
}

export default function PixelLoader() {
  useEffect(() => {
    const consent = (() => {
      try {
        return localStorage.getItem(CONSENT_KEY);
      } catch {
        return null;
      }
    })();

    if (consent !== "declined") {
      injectPixel();
    }

    const onConsentChange = (e: Event) => {
      const value = (e as CustomEvent<string>).detail;
      if (value === "accepted") {
        if (window._almaPixelLoaded) {
          window.fbq?.("consent", "grant");
        } else {
          injectPixel();
        }
      } else if (value === "declined") {
        window.fbq?.("consent", "revoke");
      }
    };

    window.addEventListener(CONSENT_EVENT, onConsentChange);
    return () => window.removeEventListener(CONSENT_EVENT, onConsentChange);
  }, []);

  return null;
}
