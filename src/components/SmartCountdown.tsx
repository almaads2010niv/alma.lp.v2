"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, TrendingUp } from "lucide-react";

// ── Smart Countdown ──
// Instead of a static date, we generate a rolling deadline:
// - End of current month for "strategy sessions"
// - Rolling 48h window for "diagnostic calls"
// This creates authentic urgency tied to business context.

interface SmartCountdownProps {
  archetype?: string | null;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Archetype-specific context messages
const contextMessages: Record<string, { label: string; urgency: string }> = {
  WINNER: {
    label: "מספר פגישות האבחון החודש מוגבל",
    urgency: "בעלי עסקים ממוקדי תוצאות לא מחכים — הם פועלים",
  },
  STAR: {
    label: "ההרשמה לסבב הליווי הנוכחי נסגרת בעוד",
    urgency: "עשרות בעלי עסקים כבר נרשמו — אל תישארו מאחור",
  },
  DREAMER: {
    label: "החלון לפגישות גילוי החודש נסגר בעוד",
    urgency: "הזדמנות ייחודית לחשוב אחרת על העסק שלכם",
  },
  HEART: {
    label: "מקומות השיחה האישית החודש מוגבלים",
    urgency: "כי כל בעל עסק מגיע לו מישהו שמקשיב",
  },
  ANCHOR: {
    label: "סבב האבחון המתודי הנוכחי נסגר בעוד",
    urgency: "מקומות מוגבלים — כדי לשמור על איכות התהליך",
  },
};

const defaultContext = {
  label: "ההצעה לשיחת אבחון חינם נסגרת בעוד",
  urgency: "מספר הפגישות החודש מוגבל",
};

// Calculate end of current month
function getEndOfMonth(): Date {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return end;
}

export default function SmartCountdown({ archetype }: SmartCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  const ctx = (archetype && contextMessages[archetype]) || defaultContext;
  const targetTime = useMemo(() => getEndOfMonth().getTime(), []);

  useEffect(() => {
    setMounted(true);

    const calculate = () => {
      const difference = targetTime - Date.now();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  if (!mounted) return null;

  const blocks = [
    { value: timeLeft.days, label: "ימים" },
    { value: timeLeft.hours, label: "שעות" },
    { value: timeLeft.minutes, label: "דקות" },
    { value: timeLeft.seconds, label: "שניות" },
  ];

  const scrollToCheckout = () => {
    document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#003D47]/[0.03] via-white to-white" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-white to-gray-50 border border-[#00BCD4]/20 rounded-3xl p-8 sm:p-12 text-center shadow-lg"
        >
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#00BCD4]/10 mb-6">
            <Clock className="w-7 h-7 text-[#00BCD4]" />
          </div>

          {/* Context label */}
          <p className="font-[family-name:var(--font-heebo)] font-bold text-[#003D47] text-lg sm:text-xl mb-8">
            {ctx.label}
          </p>

          {/* Timer blocks */}
          <div className="flex gap-3 sm:gap-4 justify-center mb-8" dir="ltr">
            {blocks.map((block) => (
              <div key={block.label} className="flex flex-col items-center">
                <motion.div
                  key={block.value}
                  initial={{ rotateX: -90, opacity: 0 }}
                  animate={{ rotateX: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-16 h-16 sm:w-20 sm:h-20 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm"
                >
                  <div className="absolute top-0 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-[#00BCD4] to-transparent" />
                  <span className="font-[family-name:var(--font-heebo)] font-black text-2xl sm:text-3xl text-[#003D47] counter-number">
                    {String(block.value).padStart(2, "0")}
                  </span>
                </motion.div>
                <span className="text-xs text-gray-500 mt-2 font-[family-name:var(--font-heebo)]">
                  {block.label}
                </span>
              </div>
            ))}
          </div>

          {/* Urgency message */}
          <p className="font-[family-name:var(--font-assistant)] text-gray-500 text-sm mb-6">
            {ctx.urgency}
          </p>

          {/* CTA */}
          <motion.button
            onClick={scrollToCheckout}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 bg-gradient-to-l from-[#00BCD4] to-[#6B4FA0] text-white font-bold text-base sm:text-lg px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-[family-name:var(--font-heebo)] cursor-pointer"
          >
            <TrendingUp className="w-5 h-5" />
            תפסו מקום עכשיו
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
