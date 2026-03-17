"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Eye, Star } from "lucide-react";

// ── Business names with stars (B2B context) ──
const businessNames = [
  { name: "הסטודיו של דנה", city: "חיפה", stars: 5 },
  { name: "מספרת Top Cut", city: "נשר", stars: 5 },
  { name: "קליניקת ד״ר ליאור", city: "קריית אתא", stars: 5 },
  { name: "פיטנס פלוס", city: "חיפה", stars: 4 },
  { name: "מטבחי הצפון", city: "נהריה", stars: 5 },
  { name: "סטודיו יוגה שלווה", city: "חיפה", stars: 5 },
  { name: "עו״ד שרון ושות׳", city: "קריית מוצקין", stars: 4 },
  { name: "האופטיקה של רון", city: "טירת הכרמל", stars: 5 },
  { name: "מרפאת שיניים סמייל", city: "עכו", stars: 5 },
  { name: "בית קפה רומא", city: "חיפה", stars: 4 },
  { name: "סטודיו לעיצוב נילי", city: "קריית ביאליק", stars: 5 },
  { name: "המוסך של אמיר", city: "נשר", stars: 4 },
];

const actions = [
  "סיימו את השאלון",
  "קבעו שיחת אבחון",
  "התחילו ליווי אסטרטגי",
  "סגרו תוכנית צמיחה",
];

const fakeTimeAgo = () => {
  const mins = Math.floor(Math.random() * 45) + 2;
  return `לפני ${mins} דקות`;
};

// ── Types ──
type NotificationType = "fomo" | "viewers";

interface FomoData {
  businessName: string;
  city: string;
  stars: number;
  action: string;
  time: string;
}

// ── Timing config (ms) ──
const INITIAL_DELAY = 8000;
const DISPLAY_DURATION = 5500;
const GAP_BETWEEN = 2000;

export default function NotificationQueue() {
  const [activeType, setActiveType] = useState<NotificationType | null>(null);
  const [visible, setVisible] = useState(false);

  // FOMO state
  const usedIndicesRef = useRef<Set<number>>(new Set());
  const [fomoData, setFomoData] = useState<FomoData | null>(null);

  // Active Viewers state
  const [viewerCount, setViewerCount] = useState(0);

  // Queue tracking
  const nextTypeRef = useRef<NotificationType>("fomo");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ── Init viewer count ──
  useEffect(() => {
    const base = Math.floor(Math.random() * 6) + 7;
    setViewerCount(base);
  }, []);

  // ── Fluctuate viewer count in background ──
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        if (next < 5) return prev + 1;
        if (next > 18) return prev - 1;
        return next;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // ── Get next FOMO data ──
  const getNextFomo = useCallback((): FomoData => {
    // Reset if all used
    if (usedIndicesRef.current.size >= businessNames.length) {
      usedIndicesRef.current.clear();
    }

    let idx: number;
    do {
      idx = Math.floor(Math.random() * businessNames.length);
    } while (usedIndicesRef.current.has(idx));
    usedIndicesRef.current.add(idx);

    const biz = businessNames[idx];
    const action = actions[Math.floor(Math.random() * actions.length)];

    return {
      businessName: biz.name,
      city: biz.city,
      stars: biz.stars,
      action,
      time: fakeTimeAgo(),
    };
  }, []);

  // ── Show next notification in queue ──
  const showNext = useCallback(() => {
    const type = nextTypeRef.current;

    if (type === "fomo") {
      setFomoData(getNextFomo());
    }

    setActiveType(type);
    setVisible(true);

    nextTypeRef.current = type === "fomo" ? "viewers" : "fomo";

    timerRef.current = setTimeout(() => {
      setVisible(false);

      timerRef.current = setTimeout(() => {
        showNext();
      }, GAP_BETWEEN);
    }, DISPLAY_DURATION);
  }, [getNextFomo]);

  // ── Start the cycle ──
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      showNext();
    }, INITIAL_DELAY);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Dismiss on click ──
  const handleDismiss = () => {
    setVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      showNext();
    }, GAP_BETWEEN);
  };

  // ── Star rating renderer ──
  const renderStars = (count: number) => (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
      ))}
    </div>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-[calc(100vw-3rem)]" dir="rtl">
      <AnimatePresence mode="wait">
        {/* ── FOMO Business Notification ── */}
        {visible && activeType === "fomo" && fomoData && (
          <motion.div
            key={`fomo-${fomoData.businessName}`}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xl shadow-gray-300/50 cursor-pointer max-w-xs"
            onClick={handleDismiss}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#00BCD4]/15 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#00BCD4]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[#003D47] text-sm font-[family-name:var(--font-heebo)] font-bold truncate">
                    {fomoData.businessName}
                  </p>
                  {renderStars(fomoData.stars)}
                </div>
                <p className="text-gray-600 text-xs font-[family-name:var(--font-heebo)]">
                  {fomoData.action} {fomoData.time}
                </p>
                <p className="text-gray-400 text-[10px] font-[family-name:var(--font-heebo)] mt-0.5">
                  {fomoData.city}
                </p>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0 mt-2" />
            </div>
          </motion.div>
        )}

        {/* ── Active Viewers Notification ── */}
        {visible && activeType === "viewers" && (
          <motion.div
            key="viewers"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-xl shadow-gray-300/50 flex items-center gap-2.5 cursor-pointer"
            onClick={handleDismiss}
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#6B4FA0]/15 flex items-center justify-center">
              <Eye className="w-4 h-4 text-[#6B4FA0]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#6B4FA0] text-sm font-[family-name:var(--font-heebo)] font-bold tabular-nums">
                {viewerCount}
              </span>
              <span className="text-gray-600 text-xs font-[family-name:var(--font-heebo)]">
                בעלי עסקים צופים עכשיו
              </span>
            </div>
            <div className="w-2 h-2 bg-[#00BCD4] rounded-full animate-pulse flex-shrink-0" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
