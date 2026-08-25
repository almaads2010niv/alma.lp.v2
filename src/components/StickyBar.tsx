"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone } from "lucide-react";
import BrandName from "@/components/BrandName";

export default function StickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const threshold = window.innerHeight * 0.8;

    const handleScroll = () => {
      setVisible(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Leads to the diagnosis quiz — the page's main path, not straight to the form
  const scrollToQuiz = () => {
    document.getElementById("quiz-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b-2 border-[#00BCD4]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-4">
            {/* Logo + tagline */}
            <div className="flex items-center gap-3 min-w-0">
              <BrandName className="text-lg sm:text-2xl flex-shrink-0" />
              <span className="hidden sm:inline text-sm text-gray-500 font-[family-name:var(--font-heebo)] truncate">
                מנגנון לפני פרסום
              </span>
            </div>

            {/* Right side: phone + CTA */}
            <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
              {/* Phone - visible on desktop */}
              <a
                href="tel:0557294068"
                className="hidden md:flex items-center gap-2 text-[#003D47] hover:text-[#00BCD4] transition-colors duration-300 font-[family-name:var(--font-heebo)]"
                dir="ltr"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">055-7294068</span>
              </a>

              {/* CTA Button */}
              <motion.button
                onClick={scrollToQuiz}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white font-[family-name:var(--font-heebo)] font-bold text-sm sm:text-base px-4 py-2 sm:px-7 sm:py-2.5 rounded-xl transition-colors duration-300 cursor-pointer shadow-md shadow-[#00BCD4]/20"
              >
                לאבחון הקצר
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
