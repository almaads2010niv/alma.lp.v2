"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Calculator } from "lucide-react";
import { getArchetypeContent } from "@/data/archetypeContent";

interface LeadsCalculatorProps {
  archetype?: string | null;
}

export default function LeadsCalculator({
  archetype,
}: LeadsCalculatorProps) {
  const content = getArchetypeContent(archetype);
  const sectionContent = content?.leadsCalculator;

  const [leadsPerWeek, setLeadsPerWeek] = useState(15);

  // Industry average: without a proper mechanism, ~70% of leads are lost
  const lostLeadsPerYear = Math.round(leadsPerWeek * 52 * 0.7);
  const recoveredLeads = Math.round(lostLeadsPerYear * 0.65); // With mechanism, recover 65% of lost

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
            {sectionContent?.subtitle ?? "בדקו את עצמכם"}
          </span>
          <h2 className="font-[family-name:var(--font-heebo)] font-black text-3xl sm:text-4xl md:text-5xl text-[#003D47]">
            {sectionContent?.header ?? (
              <>
                כמה לידים <span className="text-gradient-red">נופלים</span> לכם
                בשנה?
              </>
            )}
          </h2>
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
            {/* Slider */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <label className="font-[family-name:var(--font-heebo)] font-bold text-lg text-[#003D47]">
                  כמה לידים אתם מקבלים בשבוע?
                </label>
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#00BCD4]" />
                  <span className="font-[family-name:var(--font-heebo)] font-black text-3xl text-[#00BCD4]">
                    {leadsPerWeek}
                  </span>
                </div>
              </div>

              <input
                type="range"
                min={3}
                max={80}
                value={leadsPerWeek}
                onChange={(e) => setLeadsPerWeek(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#00BCD4]
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-6
                  [&::-webkit-slider-thumb]:h-6
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-[#00BCD4]
                  [&::-webkit-slider-thumb]:shadow-lg
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:border-4
                  [&::-webkit-slider-thumb]:border-white"
              />

              <div
                className="flex justify-between text-sm text-gray-400 mt-2 font-[family-name:var(--font-assistant)]"
                dir="ltr"
              >
                <span>3</span>
                <span>80+</span>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {/* Lost leads - WITHOUT mechanism */}
              <motion.div
                key={`lost-${lostLeadsPerYear}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="relative bg-red-50/80 border border-red-200/50 rounded-2xl p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 mb-3">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <motion.p
                  key={lostLeadsPerYear}
                  initial={{ scale: 1.15 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="font-[family-name:var(--font-heebo)] font-black text-4xl sm:text-5xl text-red-500 mb-1"
                >
                  {lostLeadsPerYear.toLocaleString()}
                </motion.p>
                <p className="font-[family-name:var(--font-heebo)] font-bold text-sm text-red-400">
                  לידים אבודים בשנה
                </p>
                <p className="font-[family-name:var(--font-assistant)] text-xs text-red-300 mt-1">
                  בלי מנגנון מכירה מסודר
                </p>
              </motion.div>

              {/* Recovered leads - WITH mechanism */}
              <motion.div
                key={`recovered-${recoveredLeads}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="relative bg-emerald-50/80 border border-emerald-200/50 rounded-2xl p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-500 mb-3">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <motion.p
                  key={recoveredLeads}
                  initial={{ scale: 1.15 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="font-[family-name:var(--font-heebo)] font-black text-4xl sm:text-5xl text-emerald-500 mb-1"
                >
                  +{recoveredLeads.toLocaleString()}
                </motion.p>
                <p className="font-[family-name:var(--font-heebo)] font-bold text-sm text-emerald-500">
                  לידים שאפשר להציל
                </p>
                <p className="font-[family-name:var(--font-assistant)] text-xs text-emerald-400 mt-1">
                  עם מנגנון מכירה מותאם
                </p>
              </motion.div>
            </div>

            {/* Description */}
            <p className="font-[family-name:var(--font-assistant)] text-center text-gray-500 text-base mb-8 leading-relaxed">
              {sectionContent?.resultText ??
                "בממוצע, עסקים בלי תהליך מכירה מסודר מפסידים ~70% מהלידים. מנגנון נכון יכול להחזיר את רובם."}
            </p>

            {/* CTA */}
            <div className="text-center">
              <motion.a
                href="#checkout"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 cta-glow bg-[#00BCD4] hover:bg-[#00ACC1] text-white font-[family-name:var(--font-heebo)] font-bold text-lg px-10 py-4 rounded-2xl transition-all duration-300 cursor-pointer"
              >
                {sectionContent?.ctaTemplate
                  ? sectionContent.ctaTemplate.replace(
                      "{leads}",
                      String(recoveredLeads)
                    )
                  : `אני רוצה להציל ${recoveredLeads} לידים בשנה`}
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
