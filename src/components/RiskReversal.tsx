"use client";

import { motion } from "framer-motion";
import { Shield, Check } from "lucide-react";
import { getArchetypeContent } from "@/data/archetypeContent";

interface RiskReversalProps {
  archetype?: string | null;
}

// E — Explain Away Concerns: the real objections (they also appear as
// options in quiz Q7), answered honestly. No "אפס סיכון. מקסימום תוצאות".
const concerns = [
  {
    concern: "״אני לא רוצה עוד משרד פרסום.״",
    answer:
      "גם אנחנו לא מתחילים בפרסום. השיחה הראשונה נועדה להבין אם פרסום הוא בכלל מה שצריך לתקן.",
  },
  {
    concern: "״ניסיתי כבר, וזה לא עבד.״",
    answer:
      "זו בדיוק הסיבה שנרצה להבין מה ניסיתם, מה עבד ומה לא — לפני שממליצים על משהו נוסף.",
  },
  {
    concern: "״אין לי זמן לעוד פרויקט.״",
    answer:
      "אם אין בעיה ששווה לפתור — לא ניצור אחת. המטרה היא קודם כול להבין אם יש פער, ורק אחר כך לדבר על עבודה.",
  },
  {
    concern: "״אשלם — ולא אדע מה קיבלתי.״",
    answer:
      "בסוף שיחת האבחון תדעו מה נבדק ומה נמצא, גם אם תחליטו להמשיך לבד. זה שלכם לקחת.",
  },
];

const defaultBadges = ["ללא התחייבות", "שיחה כנה", "אם אין התאמה — נגיד"];

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
            {sectionContent?.header ?? "המטרה של השיחה הראשונה היא לא למכור"}
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
              "היא להבין אם יש בעיה שאנחנו יודעים לפתור. אם נחשוב שאנחנו לא הכתובת — נגיד את זה בכנות."}
          </motion.p>

          {/* Real concerns, real answers */}
          <div className="space-y-4 text-right mb-10 max-w-2xl mx-auto">
            {concerns.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="bg-[#FAF8F5] border border-gray-100 rounded-2xl p-5 sm:p-6"
              >
                <p className="font-[family-name:var(--font-heebo)] font-bold text-[#003D47] mb-1.5">
                  {item.concern}
                </p>
                <p className="font-[family-name:var(--font-assistant)] text-gray-600 leading-relaxed">
                  {item.answer}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4">
            {defaultBadges.map((badge, i) => (
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
