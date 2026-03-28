"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Send, Loader2 } from "lucide-react";

interface WhatsAppFloatProps {
  archetype?: string | null;
  businessName?: string | null;
  quizName?: string | null;
  quizPhone?: string | null;
  alreadySubmitted?: boolean;
}

const WHATSAPP_NUMBER = "972523133297";

// Archetype-specific pre-filled messages
const archetypeMessages: Record<string, string> = {
  WINNER:
    "היי ניב, סיימתי את השאלון ויצאתי ממוקד/ת תוצאות 🎯\nאשמח לשיחת אבחון קצרה לבדוק איך להכפיל את הלידים שלי.",
  STAR:
    "היי ניב, סיימתי את השאלון ויצאתי מוּנע/ת חברתית ⭐\nאשמח לשמוע איך עסקים דומים לשלי הצליחו עם עלמה.",
  DREAMER:
    "היי ניב, סיימתי את השאלון ויצאתי חוקר/ת ומגלה 💡\nאשמח לגלות את הגישה השונה שלכם — מרגיש שזה מה שחסר לי.",
  HEART:
    "היי ניב, סיימתי את השאלון ויצאתי רגיש/ה ואמפתי/ת 💙\nמרגיש שאני צריך/ה מישהו שבאמת מבין. אשמח לשיחה כנה.",
  ANCHOR:
    "היי ניב, סיימתי את השאלון ויצאתי יציב/ה ומבוסס/ת ⚓\nמעניינת אותי השיטה המובנית שלכם. אשמח לשיחת אבחון מסודרת.",
};

const defaultMessage =
  "היי ניב, הגעתי מדף הנחיתה של עלמה 👋\nאשמח לשיחת אבחון חינם לגבי העסק שלי.";

function buildWhatsAppUrl(archetype?: string | null, businessName?: string | null): string {
  let message = (archetype && archetypeMessages[archetype]) || defaultMessage;

  // Append business name if provided
  if (businessName) {
    message += `\nשם העסק: ${businessName}`;
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function WhatsAppFloat({ archetype, businessName, quizName, quizPhone, alreadySubmitted }: WhatsAppFloatProps) {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const [showMiniForm, setShowMiniForm] = useState(false);
  const [miniName, setMiniName] = useState("");
  const [miniPhone, setMiniPhone] = useState("");
  const [miniSubmitting, setMiniSubmitting] = useState(false);

  // Pre-fill from quiz data when available
  useEffect(() => {
    if (quizName && !miniName) setMiniName(quizName);
    if (quizPhone && !miniPhone) setMiniPhone(quizPhone);
  }, [quizName, quizPhone]); // eslint-disable-line react-hooks/exhaustive-deps

  // Show button after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show tooltip bubble after 8 seconds (once)
  useEffect(() => {
    if (tooltipDismissed) return;
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [tooltipDismissed]);

  // Auto-hide tooltip after 6 seconds
  useEffect(() => {
    if (!showTooltip) return;
    const timer = setTimeout(() => {
      setShowTooltip(false);
      setTooltipDismissed(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, [showTooltip]);

  const openWhatsApp = () => {
    // Fire FB Pixel event
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Contact", {
        content_name: "WhatsApp Click",
        archetype: archetype || "none",
      });
    }
    window.open(buildWhatsAppUrl(archetype, businessName), "_blank");
  };

  const handleClick = () => {
    setShowTooltip(false);
    setTooltipDismissed(true);

    // If already submitted checkout — go straight to WhatsApp
    if (alreadySubmitted) {
      openWhatsApp();
      return;
    }

    // Show mini form
    setShowMiniForm(true);
  };

  const handleMiniSubmit = async () => {
    if (!miniName.trim() || !miniPhone.trim()) return;
    setMiniSubmitting(true);

    try {
      // Send lead directly to AMP via lightweight wa-lead route
      await fetch("/api/wa-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: miniName.trim(),
          phone: miniPhone.trim(),
          archetype: archetype || undefined,
          businessName: businessName || undefined,
        }),
      });
    } catch {
      // Non-blocking — still open WhatsApp even if API fails
    }

    setMiniSubmitting(false);
    setShowMiniForm(false);
    openWhatsApp();
  };

  const handleSkip = () => {
    setShowMiniForm(false);
    openWhatsApp();
  };

  return (
    <>
      {/* Mini lead capture popup */}
      <AnimatePresence>
        {showMiniForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            dir="rtl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full border border-[#25D366]/20"
            >
              {/* Close button — skip and open WA */}
              <button
                onClick={handleSkip}
                className="absolute top-3 left-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366]/10 mb-3">
                  <MessageCircle className="w-7 h-7 text-[#25D366]" />
                </div>
                <h3 className="font-[family-name:var(--font-heebo)] font-bold text-xl text-[#003D47]">
                  לפני שנדבר...
                </h3>
                <p className="font-[family-name:var(--font-assistant)] text-gray-500 text-sm mt-1">
                  השאירו פרטים ונוכל להתכונן לשיחה
                </p>
              </div>

              {/* Form fields */}
              <div className="space-y-3 mb-5">
                <input
                  type="text"
                  value={miniName}
                  onChange={(e) => setMiniName(e.target.value)}
                  placeholder="השם שלכם"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 outline-none transition-all font-[family-name:var(--font-assistant)] text-right"
                />
                <input
                  type="tel"
                  value={miniPhone}
                  onChange={(e) => setMiniPhone(e.target.value)}
                  placeholder="טלפון"
                  dir="ltr"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 outline-none transition-all font-[family-name:var(--font-assistant)] text-right"
                />
              </div>

              {/* Submit button */}
              <motion.button
                onClick={handleMiniSubmit}
                disabled={miniSubmitting || !miniName.trim() || !miniPhone.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-[family-name:var(--font-heebo)]"
              >
                {miniSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    שלחו לי בוואטסאפ
                  </>
                )}
              </motion.button>

              {/* Skip link */}
              <button
                onClick={handleSkip}
                className="w-full text-center mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer font-[family-name:var(--font-assistant)]"
              >
                דלגו ופתחו וואטסאפ ישירות →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp button */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 left-6 z-[60] flex flex-col items-start gap-2"
            dir="rtl"
          >
            {/* Tooltip bubble */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="relative bg-white rounded-2xl shadow-xl border border-gray-200 px-4 py-3 max-w-[220px] mr-1"
                >
                  <button
                    onClick={() => {
                      setShowTooltip(false);
                      setTooltipDismissed(true);
                    }}
                    className="absolute -top-2 -left-2 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <p className="font-[family-name:var(--font-heebo)] text-sm text-[#003D47] font-medium leading-relaxed">
                    💬 יש שאלה? דברו איתנו ישירות בוואטסאפ
                  </p>
                  {/* Arrow pointing down to button */}
                  <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-gray-200 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* WhatsApp Button */}
            <motion.button
              onClick={handleClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-16 h-16 bg-[#25D366] hover:bg-[#20BD5A] rounded-full shadow-lg shadow-[#25D366]/30 flex items-center justify-center transition-colors duration-300 cursor-pointer group"
              aria-label="שלחו הודעה בוואטסאפ"
            >
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />

              {/* Icon */}
              <MessageCircle className="w-8 h-8 text-white fill-white relative z-10" />

              {/* SR-only label */}
              <span className="sr-only">פתיחת וואטסאפ</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
