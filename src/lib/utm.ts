"use client";

import { useState, useEffect } from "react";

// ── UTM Parameter Capture ──────────────────────────────────────────
// Reads UTM params from the URL on first visit and stores in
// sessionStorage so they persist through page navigation.

export interface UTMData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
}

const UTM_KEYS: (keyof UTMData)[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
];

const STORAGE_KEY = "alma_utm";

/**
 * React hook that captures UTM params from the URL on mount.
 * Stores in sessionStorage for persistence across in-page navigation.
 * Returns the captured UTM data (or empty object if none).
 */
export function useUTM(): UTMData {
  const [utm, setUtm] = useState<UTMData>({});

  useEffect(() => {
    // Check sessionStorage first (already captured)
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUtm(JSON.parse(stored));
        return;
      } catch {
        // Corrupted — re-capture from URL
      }
    }

    // Capture from URL
    const params = new URLSearchParams(window.location.search);
    const captured: UTMData = {};
    let hasAny = false;

    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) {
        captured[key] = value;
        hasAny = true;
      }
    }

    if (hasAny) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
      setUtm(captured);
    }
  }, []);

  return utm;
}

/**
 * Strip empty UTM fields for clean payloads.
 */
export function cleanUTM(utm: UTMData): Record<string, string> {
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(utm)) {
    if (v) clean[k] = v;
  }
  return clean;
}
