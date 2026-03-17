"use client";

import { motion } from "framer-motion";
import { Shield, Check } from "lucide-react";
import { getArchetypeContent } from "@/data/archetypeContent";

interface RiskReversalProps {
  archetype?: string | null;
}

const defaultBadges = ["ללא התחייבות", "שיחה כנה", "אבחון מקצועי"];

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: 0.5 + i * 0.12,
      ease: "easeOut" as const,
    },
  }),
};

export default function RiskReversal({ archetype }: RiskReversalProps) {
  const content = getArchetypeContent(archetype);
  const sectionContent = content?.riskReversal;

  const badges = sectionContent?.badges ?? defaultBadges;

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FAF8F5] to-white" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-white border border-gray-200 rounded-3xl p-10 sm:p-14 text-center shadow-lg overflow-hidden"
        >
          {/* Teal border accent on top */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00BCD4] via-[#00ACC1] to-[#6B4FA0]" />

          {/* Shield Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.15,
            }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#00BCD4]/10 text-[#00BCD4] mb-8"
          >
            <Shield className="w-10 h-10" />
          </motion.div>

          {/* Header */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-[family-name:var(--font-heebo)] font-black text-3xl sm:text-4xl text-[#003D47] mb-6"
          >
            {sectionContent?.header ?? "בלי סיכון. בלי קטנות."}
          </motion.h2>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-[family-name:var(--font-assistant)] text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10"
          >
            {sectionContent?.body ??
              "שיחת האבחון היא חינם, בלי התחייבות. אם נראה שאנחנו לא מתאימים — נגיד את זה בכנות. אנחנו לא מוכרים חלומות, אנחנו בונים מנגנונים."}
          </motion.p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4">
            {badges.map((badge, i) => (
              <motion.div
                key={badge}
                custom={i}
                variants={badgeVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-[#00BCD4]/[0.08] border border-[#00BCD4]/20 rounded-full px-5 py-2.5"
              >
                <Check className="w-4 h-4 text-[#00BCD4]" />
                <span className="font-[family-name:var(--font-heebo)] font-semibold text-sm text-[#00838F]">
                  {badge}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Decorative corners */}
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#00BCD4]/[0.03] rounded-tl-[60px]" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#6B4FA0]/[0.03] rounded-tr-[40px]" />
        </motion.div>
      </div>
    </section>
  );
}
