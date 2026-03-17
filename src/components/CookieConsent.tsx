"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed bottom-0 left-0 right-0 z-[10010] p-4 sm:p-6"
          dir="rtl"
        >
          <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-xl shadow-gray-300/50 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="w-6 h-6 text-[#00BCD4] shrink-0 mt-0.5" />
              <div>
                <p className="text-[#003D47] text-sm font-[family-name:var(--font-heebo)] font-bold mb-1">
                  אתר זה משתמש בעוגיות
                </p>
                <p className="text-gray-500 text-xs font-[family-name:var(--font-heebo)] leading-relaxed">
                  אנו משתמשים בעוגיות לצורך שיפור חוויית הגלישה, ניתוח תנועה באתר והתאמת תוכן.
                  בהתאם לחוק הגנת הפרטיות, התשמ&quot;א-1981 ותקנות התקשורת (בזק ושידורים), התשס&quot;ח-2008.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={handleDecline}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-[family-name:var(--font-heebo)] font-bold hover:bg-gray-200 transition cursor-pointer"
              >
                דחייה
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#00BCD4] text-white text-sm font-[family-name:var(--font-heebo)] font-bold hover:bg-[#00ACC1] transition cursor-pointer"
              >
                אישור
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
