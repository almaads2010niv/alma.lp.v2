"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";

interface WhatsAppFloatProps {
  archetype?: string | null;
  businessName?: string | null;
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

export default function WhatsAppFloat({ archetype, businessName }: WhatsAppFloatProps) {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  // Show button after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position
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

  const handleClick = () => {
    // Fire FB Pixel event
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Contact", {
        content_name: "WhatsApp Click",
        archetype: archetype || "none",
      });
    }

    window.open(buildWhatsAppUrl(archetype, businessName), "_blank");
    setShowTooltip(false);
    setTooltipDismissed(true);
  };

  return (
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
  );
}
