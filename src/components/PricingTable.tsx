"use client";

import { motion } from "framer-motion";
import { X, Check, Star, ArrowDown, Rocket } from "lucide-react";
import { getArchetypeContent } from "@/data/archetypeContent";

interface PricingTableProps {
  archetype?: string | null;
}

// Archetype-specific pricing context
const pricingContext: Record<string, { header: string; subtitle: string; rightTitle: string; ctaText: string; benefits: string[] }> = {
  WINNER: {
    header: "מה מקבלים בליווי?",
    subtitle: "תראו את ההבדל במספרים",
    rightTitle: "ליווי אסטרטגי עם עלמה?",
    ctaText: "אני רוצה תוצאות ←",
    benefits: [
      "שיחת אבחון אסטרטגי — 30 דקות חינם",
      "מנגנון שיווק ומכירות מותאם אישית",
      "מדידת ROI שבועית עם דוחות ברורים",
      "ליווי אישי צמוד עד לתוצאות",
      "8+ שנות ניסיון עם מאות עסקים",
    ],
  },
  STAR: {
    header: "מה מקבלים בליווי?",
    subtitle: "הצטרפו למשפחה",
    rightTitle: "ליווי + קהילת צמיחה",
    ctaText: "אני רוצה להצטרף ←",
    benefits: [
      "שיחת היכרות אישית — 30 דקות חינם",
      "גישה לקהילת בעלי עסקים מצליחים",
      "מנגנון מותאם עם שיטה מוכחת",
      "שיתופי ידע וחוויות עם לקוחות אחרים",
      "ליווי שמרגיש כמו שותפות אמיתית",
    ],
  },
  DREAMER: {
    header: "מה מקבלים בליווי?",
    subtitle: "לא עוד תבנית",
    rightTitle: "מנגנון ייחודי לעסק שלכם",
    ctaText: "אני רוצה גישה שונה ←",
    benefits: [
      "שיחת גילוי — 30 דקות חינם",
      "אסטרטגיה מותאמת שלא קיימת אצל אף מתחרה",
      "בניית מנגנון מאפס — לא מהמדף",
      "חדשנות ויצירתיות בכל שלב",
      "ליווי שמכבד את הייחודיות שלכם",
    ],
  },
  HEART: {
    header: "מה מקבלים בליווי?",
    subtitle: "מישהו שמקשיב",
    rightTitle: "ליווי אישי ואמיתי",
    ctaText: "אני רוצה שיחה כנה ←",
    benefits: [
      "שיחה כנה — 30 דקות חינם, בלי לחץ",
      "מנגנון שמרגיש כמוכם ומדבר בשפה שלכם",
      "ליווי צמוד עם זמינות מלאה",
      "שיחות קבועות ואישיות",
      "שותף לדרך שבאמת אכפת לו",
    ],
  },
  ANCHOR: {
    header: "מה מקבלים בליווי?",
    subtitle: "שיטה מובנית",
    rightTitle: "תוכנית עבודה מסודרת",
    ctaText: "אני רוצה שיטה שעובדת ←",
    benefits: [
      "אבחון מתודי — 30 דקות חינם",
      "תוכנית עבודה עם אבני דרך ולוחות זמנים",
      "מדידה שבועית ודוחות חודשיים",
      "מתודולוגיה שקופה שלב אחרי שלב",
      "8 שנות ניסיון עם תהליכים מתועדים",
    ],
  },
};

const defaultPricing = pricingContext.WINNER;

export default function PricingTable({ archetype }: PricingTableProps) {
  const pt = (archetype && pricingContext[archetype]) || defaultPricing;

  const scrollToCheckout = () => {
    document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[#00BCD4] text-sm font-bold tracking-widest mb-4 font-[family-name:var(--font-heebo)]">
            {pt.header}
          </span>
          <h2 className="font-[family-name:var(--font-heebo)] font-black text-3xl sm:text-4xl md:text-5xl text-[#003D47]">
            תעשו את <span className="text-gradient-red">ההשוואה</span>
          </h2>
          <p className="font-[family-name:var(--font-assistant)] text-gray-600 mt-4 text-lg">
            {pt.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {/* Without action — Faded */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="h-full bg-white/50 border border-gray-200 rounded-3xl p-8 sm:p-10 opacity-60">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-gray-500" />
                </div>
                <h3 className="font-[family-name:var(--font-heebo)] font-bold text-xl text-gray-600">
                  להמשיך כמו שזה
                </h3>
              </div>

              <div className="space-y-5">
                {[
                  "לידים נכנסים ונופלים — בלי מנגנון",
                  "לשרוף תקציב פרסום בלי ROI ברור",
                  "לנחש מה עובד במקום למדוד",
                  "להתמודד לבד בלי כיוון אסטרטגי",
                  "לראות מתחרים עוקפים אתכם",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <X className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-600 text-sm font-[family-name:var(--font-assistant)]">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <span className="text-gray-500 text-sm font-[family-name:var(--font-heebo)]">
                  העלות האמיתית:
                </span>
                <p className="font-[family-name:var(--font-heebo)] font-black text-2xl text-gray-500 mt-1">
                  הזדמנויות אבודות
                </p>
              </div>
            </div>
          </motion.div>

          {/* With Alma — Highlighted */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="h-full bg-gradient-to-br from-white to-gray-50 border-2 border-[#00BCD4]/40 rounded-3xl p-8 sm:p-10 relative overflow-hidden">
              {/* Corner glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00BCD4]/20 rounded-full blur-[80px]" />

              <div className="relative z-10">
                {/* Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                  <div className="flex items-center gap-2 bg-[#00BCD4] text-white text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-lg shadow-[#00BCD4]/30 font-[family-name:var(--font-heebo)]">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    שיחת אבחון חינם
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-500 text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/30 font-[family-name:var(--font-heebo)]">
                    ללא התחייבות!
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-8 justify-center">
                  <div className="w-10 h-10 rounded-xl bg-[#00BCD4]/15 flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-[#00BCD4]" />
                  </div>
                  <h3 className="font-[family-name:var(--font-heebo)] font-bold text-xl text-[#003D47]">
                    {pt.rightTitle}
                  </h3>
                </div>

                <div className="space-y-5">
                  {pt.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-[#00BCD4] flex-shrink-0" />
                      <span className="text-[#003D47] text-sm font-medium font-[family-name:var(--font-assistant)]">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-[#00BCD4]/20">
                  <div className="bg-[#00BCD4]/10 rounded-2xl p-5 text-center border border-[#00BCD4]/20">
                    <span className="text-[#6B4FA0] text-base font-bold font-[family-name:var(--font-heebo)]">
                      שיחת האבחון:
                    </span>
                    <div className="flex items-baseline gap-3 justify-center mt-2">
                      <p className="font-[family-name:var(--font-heebo)] font-black text-7xl sm:text-8xl text-[#003D47]">
                        0
                      </p>
                      <span className="text-3xl text-[#003D47] font-bold">ש״ח</span>
                    </div>
                    <span className="text-[#6B4FA0] text-sm font-semibold font-[family-name:var(--font-heebo)]">
                      חינם לחלוטין!
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={scrollToCheckout}
                  className="w-full mt-8 cta-glow bg-gradient-to-l from-[#00BCD4] to-[#6B4FA0] text-white font-[family-name:var(--font-heebo)] font-bold text-lg py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{pt.ctaText}</span>
                  <ArrowDown className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
