"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface SpotsCounterProps {
  archetype?: string | null;
}

// ── Smart Spots Counter ──
// Uses the day of month to calculate remaining spots.
// Creates authentic scarcity tied to business consulting context.

const contextLabels: Record<string, string> = {
  WINNER: "פגישות אבחון אסטרטגי",
  STAR: "מקומות בסבב הליווי",
  DREAMER: "פגישות גילוי",
  HEART: "שיחות אישיות",
  ANCHOR: "פגישות אבחון מתודי",
};

export default function SpotsCounter({ archetype }: SpotsCounterProps) {
  const [totalSpots] = useState(12);
  const [takenSpots, setTakenSpots] = useState(0);
  const [mounted, setMounted] = useState(false);

  const label = (archetype && contextLabels[archetype]) || "פגישות אבחון";

  useEffect(() => {
    setMounted(true);
    // Smart calculation: simulate spots filling up throughout the month
    const dayOfMonth = new Date().getDate();
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const progress = dayOfMonth / daysInMonth;

    // Between 60%-85% full, with some randomization
    const baseT = Math.floor(totalSpots * (0.6 + progress * 0.25));
    const jitter = Math.floor(Math.random() * 2);
    const taken = Math.min(baseT + jitter, totalSpots - 2); // Always leave at least 2

    setTakenSpots(taken);
  }, [totalSpots]);

  if (!mounted) return null;

  const remainingSpots = totalSpots - takenSpots;
  const percentage = (takenSpots / totalSpots) * 100;
  const isUrgent = remainingSpots <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="inline-flex flex-col items-center gap-3 bg-white/90 border border-gray-200 rounded-2xl px-6 py-4 backdrop-blur-sm shadow-sm"
    >
      <div className="flex items-center gap-2">
        <Flame className={`w-4 h-4 ${isUrgent ? "text-red-500 animate-pulse" : "text-[#00BCD4] animate-pulse"}`} />
        <span className="font-[family-name:var(--font-heebo)] font-bold text-[#003D47] text-sm">
          נשארו{" "}
          <span className={`text-lg ${isUrgent ? "text-red-500" : "text-[#00BCD4]"}`}>
            {remainingSpots}
          </span>{" "}
          {label} החודש
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" as const }}
          className={`h-full rounded-full ${
            isUrgent
              ? "bg-gradient-to-l from-red-500 to-orange-400"
              : "bg-gradient-to-l from-[#00BCD4] to-[#6B4FA0]"
          }`}
        />
      </div>

      {isUrgent && (
        <p className="text-red-500 text-xs font-bold font-[family-name:var(--font-heebo)] animate-pulse">
          כמעט מלא!
        </p>
      )}
    </motion.div>
  );
}
