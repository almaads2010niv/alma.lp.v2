"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Zap } from "lucide-react";
import { trackExitIntentSubmit } from "@/lib/analytics";

interface ExitIntentProps {
  archetype?: string | null;
}

// Archetype-specific exit messages
const exitMessages: Record<string, { headline: string; body: string; cta: string }> = {
  WINNER: {
    headline: "רגע — לפני שעוזבים",
    body: "30 דקות של שיחת אבחון חינם שיראו לכם בדיוק כמה כסף אתם משאירים על השולחן. בלי סיכון.",
    cta: "אני רוצה לראות את המספרים",
  },
  STAR: {
    headline: "חכו רגע!",
    body: "עשרות בעלי עסקים כבר עברו את התהליך ורואים תוצאות. השאירו טלפון ותשמעו איך.",
    cta: "אני רוצה לשמוע מלקוחות",
  },
  DREAMER: {
    headline: "לפני שהולכים...",
    body: "יש לנו גישה שונה מכל מה שניסיתם. 30 דקות שיראו לכם שיווק מזווית אחרת לגמרי.",
    cta: "אני רוצה לגלות גישה חדשה",
  },
  HEART: {
    headline: "רגע אישי",
    body: "לפעמים כל מה שצריך זה שיחה אחת כנה עם מישהו שמבין. 30 דקות, בלי לחץ, רק הקשבה.",
    cta: "אני רוצה שיחה כנה",
  },
  ANCHOR: {
    headline: "עוד צעד אחד",
    body: "שיחת אבחון מובנית עם מתודולוגיה ברורה — תדעו בדיוק מה הצעד הבא. ללא התחייבות.",
    cta: "אני רוצה תוכנית ברורה",
  },
};

const defaultMessage = {
  headline: "לפני שעוזבים!",
  body: "שיחת אבחון חינם של 30 דקות שתראה לכם בדיוק מה צריך לשנות. ללא התחייבות.",
  cta: "השאירו טלפון — נחזור אליכם",
};

export default function ExitIntent({ archetype }: ExitIntentProps) {
  const [show, setShow] = useState(false);
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const msg = (archetype && exitMessages[archetype]) || defaultMessage;

  useEffect(() => {
    if (dismissed) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShow(true);
      }
    };

    // Wait 15 seconds before activating exit-intent
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 15000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [dismissed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    try {
      // Web3Forms or Zapier integration
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "5e7c6215-2df6-4051-9d19-5a5ea96e0b9c",
          subject: "ליד Exit Intent — עלמה Adaptive",
          phone,
          source: "exit_intent",
          archetype: archetype || "unknown",
          from_name: "עלמה? Adaptive LP — Exit Intent",
        }),
      });

      // Fire FB Pixel event
      trackExitIntentSubmit(archetype || undefined);
    } catch {
      // silent — still show success
    }
    setSubmitted(true);
    setTimeout(() => {
      setShow(false);
      setDismissed(true);
    }, 3000);
  };

  const handleClose = () => {
    setShow(false);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
          dir="rtl"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-gradient-to-br from-white to-gray-50 border border-[#00BCD4]/30 rounded-[32px] p-8 sm:p-10 max-w-md w-full z-10 overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-[#003D47] hover:bg-gray-200 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Accent glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00BCD4]/20 rounded-full blur-[80px]" />
            <div className="absolute -bottom-10 -left-10 w-30 h-30 bg-[#6B4FA0]/15 rounded-full blur-[60px]" />

            {!submitted ? (
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00BCD4]/15 to-[#6B4FA0]/15 mb-6">
                  <Zap className="w-8 h-8 text-[#00BCD4]" />
                </div>

                <h3 className="font-[family-name:var(--font-heebo)] font-black text-2xl sm:text-3xl text-[#003D47] mb-3">
                  {msg.headline}
                </h3>
                <p className="font-[family-name:var(--font-assistant)] text-gray-600 mb-6 leading-relaxed">
                  {msg.body}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      type="tel"
                      placeholder="050-1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border-2 border-gray-200 focus:border-[#00BCD4] rounded-2xl py-4 pr-12 pl-4 text-[#003D47] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/20 transition-all font-[family-name:var(--font-heebo)]"
                      dir="ltr"
                      autoFocus
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full cta-glow bg-gradient-to-l from-[#00BCD4] to-[#6B4FA0] text-white font-[family-name:var(--font-heebo)] font-bold text-lg py-4 rounded-2xl transition-all cursor-pointer"
                  >
                    {msg.cta}
                  </motion.button>
                </form>

                <p className="font-[family-name:var(--font-assistant)] text-gray-400 text-xs mt-4">
                  בלי ספאם, בלי התחייבות — רק שיחה אחת
                </p>
              </div>
            ) : (
              <div className="relative z-10 text-center py-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className="text-4xl mb-4"
                >
                  ✅
                </motion.div>
                <h3 className="font-[family-name:var(--font-heebo)] font-bold text-xl text-[#003D47]">
                  תודה! נחזור אליכם בהקדם
                </h3>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
