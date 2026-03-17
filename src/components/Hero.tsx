"use client";

import { motion } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";

export default function Hero() {
  const scrollToCheckout = () => {
    document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background: white with subtle grid pattern and teal gradient */}
      <div className="absolute inset-0 bg-white">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#00BCD4 1px, transparent 1px), linear-gradient(90deg, #00BCD4 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Radial teal glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#00BCD4]/[0.04] rounded-full blur-[150px]" />
        {/* Top-to-bottom soft gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00BCD4]/[0.03] via-transparent to-[#00BCD4]/[0.02]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 text-center">
        {/* Animated badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotateX: 90 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            type: "spring",
            stiffness: 150,
            damping: 15,
          }}
          className="mb-8 perspective-[1000px]"
        >
          <div className="inline-block relative group">
            {/* Outer glow ring */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00BCD4] via-[#00ACC1] to-[#00BCD4] rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />

            {/* Main badge */}
            <div className="relative bg-white border border-[#00BCD4]/30 rounded-full px-7 sm:px-9 py-3 overflow-hidden shadow-sm">
              {/* Shimmer effect */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 1.5,
                  }}
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-[#00BCD4]/10 to-transparent skew-x-[-20deg]"
                />
              </div>

              {/* Sparkle icons */}
              <motion.span
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute top-1 right-3 text-[#00BCD4] text-xs"
              >
                <Sparkles className="w-3 h-3" />
              </motion.span>
              <motion.span
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                  rotate: [0, -180, -360],
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
                className="absolute bottom-1 left-3 text-[#00BCD4] text-xs"
              >
                <Sparkles className="w-3 h-3" />
              </motion.span>

              {/* Badge text */}
              <div className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00BCD4]" />
                <span className="font-[family-name:var(--font-heebo)] font-bold text-sm sm:text-base text-[#00838F]">
                  מנגנון לפני פרסום
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-[family-name:var(--font-heebo)] font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-6"
        >
          <span className="block text-[#1a1a1a]">פרסום הוא לא</span>
          <span className="block">
            <span className="text-gradient-red">הבעיה</span>{" "}
            <span className="text-[#1a1a1a]">של העסק שלך</span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="font-[family-name:var(--font-heebo)] text-xl sm:text-2xl text-[#333] max-w-3xl mx-auto mb-6 leading-relaxed font-medium"
        >
          הוא רק המקום שבו זה מתפוצץ לחיוב או לשלילה
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
        >
          עסקים מבוססי לידים רבים מזרימים תקציב, מקבלים לידים, ועדיין עומדים
          במקום. הרעש גדל. השקט לא מגיע
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          onClick={scrollToCheckout}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="cta-glow relative bg-[#00BCD4] hover:bg-[#00ACC1] text-white font-[family-name:var(--font-heebo)] font-bold text-lg sm:text-xl px-10 py-5 rounded-2xl transition-all duration-300 cursor-pointer group"
        >
          <span className="relative z-10">אני רוצה להבין למה</span>
          {/* Shine effect */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </div>
        </motion.button>

        {/* Sub-CTA text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="mt-4 text-sm text-gray-400 font-[family-name:var(--font-heebo)]"
        >
          שיחת אבחון &bull; ללא התחייבות
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown className="w-8 h-8 text-gray-400" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
