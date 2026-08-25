"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, Search, Calculator } from "lucide-react";

// ── Mini Funnel Calculator ──
// Built ONLY on the visitor's own numbers — no invented industry averages.
// (Removed: hardcoded "70% of leads are lost" / "65% recoverable" claims.)
// The visitor estimates their own funnel; we show where THEIR biggest
// drop-off is, and that becomes the thing worth diagnosing first.

const sliderClass = `w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#00BCD4]
  [&::-webkit-slider-thumb]:appearance-none
  [&::-webkit-slider-thumb]:w-6
  [&::-webkit-slider-thumb]:h-6
  [&::-webkit-slider-thumb]:rounded-full
  [&::-webkit-slider-thumb]:bg-[#00BCD4]
  [&::-webkit-slider-thumb]:shadow-lg
  [&::-webkit-slider-thumb]:cursor-pointer
  [&::-webkit-slider-thumb]:border-4
  [&::-webkit-slider-thumb]:border-white`;

export default function LeadsCalculator() {
  const [leadsPerMonth, setLeadsPerMonth] = useState(60);
  const [talkRate, setTalkRate] = useState(50); // % of leads that become a real conversation
  const [closeRate, setCloseRate] = useState(20); // % of conversations that close

  const conversations = Math.round((leadsPerMonth * talkRate) / 100);
  const deals = Math.round((conversations * closeRate) / 100);
  const lostBeforeTalk = leadsPerMonth - conversations;
  const lostInSale = conversations - deals;

  const biggestGapStage =
    lostBeforeTalk >= lostInSale ? "בין הפנייה לשיחה" : "בין השיחה לסגירה";
  const biggestGapCount = Math.max(lostBeforeTalk, lostInSale);

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#00BCD4]/[0.04] to-white" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-[#00BCD4] text-sm font-bold tracking-widest mb-4 font-[family-name:var(--font-heebo)]">
            המספרים שלכם
          </span>
          <h2 className="font-[family-name:var(--font-heebo)] font-black text-3xl sm:text-4xl md:text-5xl text-[#003D47]">
            איפה המשפך שלכם <span className="text-gradient-red">נשבר</span>?
          </h2>
          <p className="font-[family-name:var(--font-assistant)] text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            הזינו הערכה של המספרים שלכם — ותראו באיזה שלב הולכות לאיבוד הכי הרבה הזדמנויות
          </p>
        </motion.div>

        {/* Calculator Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Top accent */}
          <div className="h-1.5 bg-gradient-to-r from-[#00BCD4] via-[#00ACC1] to-[#6B4FA0]" />

          <div className="p-8 sm:p-12">
            {/* Slider: leads per month */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label className="font-[family-name:var(--font-heebo)] font-bold text-lg text-[#003D47]">
                  כמה לידים נכנסים בחודש?
                </label>
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#00BCD4]" />
                  <span className="font-[family-name:var(--font-heebo)] font-black text-3xl text-[#00BCD4]">
                    {leadsPerMonth}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min={10}
                max={300}
                step={5}
                value={leadsPerMonth}
                onChange={(e) => setLeadsPerMonth(Number(e.target.value))}
                className={sliderClass}
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2 font-[family-name:var(--font-assistant)]" dir="ltr">
                <span>10</span>
                <span>300+</span>
              </div>
            </div>

            {/* Slider: talk rate */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label className="font-[family-name:var(--font-heebo)] font-bold text-lg text-[#003D47]">
                  כמה מהם מגיעים לשיחה אמיתית?
                </label>
                <span className="font-[family-name:var(--font-heebo)] font-black text-3xl text-[#00BCD4]">
                  {talkRate}%
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={talkRate}
                onChange={(e) => setTalkRate(Number(e.target.value))}
                className={sliderClass}
              />
            </div>

            {/* Slider: close rate */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <label className="font-[family-name:var(--font-heebo)] font-bold text-lg text-[#003D47]">
                  כמה מהשיחות נסגרות לעסקה?
                </label>
                <span className="font-[family-name:var(--font-heebo)] font-black text-3xl text-[#00BCD4]">
                  {closeRate}%
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={closeRate}
                onChange={(e) => setCloseRate(Number(e.target.value))}
                className={sliderClass}
              />
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {/* Biggest gap */}
              <motion.div
                key={`gap-${biggestGapStage}-${biggestGapCount}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="relative bg-red-50/80 border border-red-200/50 rounded-2xl p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 mb-3">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <motion.p
                  key={biggestGapCount}
                  initial={{ scale: 1.15 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="font-[family-name:var(--font-heebo)] font-black text-4xl sm:text-5xl text-red-500 mb-1"
                >
                  {biggestGapCount.toLocaleString()}
                </motion.p>
                <p className="font-[family-name:var(--font-heebo)] font-bold text-sm text-red-400">
                  הזדמנויות בחודש נעצרות {biggestGapStage}
                </p>
                <p className="font-[family-name:var(--font-assistant)] text-xs text-red-300 mt-1">
                  לפי ההערכה שלכם
                </p>
              </motion.div>

              {/* What it means */}
              <motion.div
                key={`deals-${deals}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="relative bg-[#00BCD4]/[0.06] border border-[#00BCD4]/20 rounded-2xl p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#00BCD4]/15 text-[#00BCD4] mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <p className="font-[family-name:var(--font-heebo)] font-black text-2xl sm:text-3xl text-[#003D47] mb-1 leading-snug">
                  {biggestGapStage}
                </p>
                <p className="font-[family-name:var(--font-heebo)] font-bold text-sm text-[#00838F]">
                  זה השלב שהיינו בודקים קודם
                </p>
                <p className="font-[family-name:var(--font-assistant)] text-xs text-gray-400 mt-1">
                  {leadsPerMonth} לידים ← {conversations} שיחות ← {deals} עסקאות
                </p>
              </motion.div>
            </div>

            {/* Description */}
            <p className="font-[family-name:var(--font-assistant)] text-center text-gray-500 text-base mb-8 leading-relaxed">
              אלה לא נתוני תעשייה — אלה המספרים שלכם, כמו שאתם מעריכים אותם.
              בשיחת אבחון בודקים אותם מול מה שקורה בפועל — ולפעמים שם מגיעה ההפתעה.
            </p>

            {/* CTA */}
            <div className="text-center">
              <motion.a
                href="#checkout"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 cta-glow bg-[#00BCD4] hover:bg-[#00ACC1] text-white font-[family-name:var(--font-heebo)] font-bold text-lg px-10 py-4 rounded-2xl transition-all duration-300 cursor-pointer"
              >
                בואו נבדוק את השלב הזה יחד
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
