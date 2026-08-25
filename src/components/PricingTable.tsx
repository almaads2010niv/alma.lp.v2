"use client";

import { motion } from "framer-motion";
import { X, Check, Star, ArrowDown, Rocket } from "lucide-react";

// The product here is a free diagnostic call — not a pricing table.
// The offer is organized around 3 simple pillars (complexity reduction):
// same service for everyone; only the framing elsewhere changes.

const pillars = [
  {
    name: "בהירות",
    description: "לדעת איפה הבעיה, ומה צריך לתקן קודם",
  },
  {
    name: "רצף",
    description: "לחבר בין מסר, שיווק, ליד, מכירה והמשך טיפול",
  },
  {
    name: "שליטה",
    description: "לדעת מה עובד, איפה כסף נופל, ומה משפרים עכשיו",
  },
];

const callIncludes = [
  "מיפוי ראשוני של השרשרת — מהמסר ועד הסגירה",
  "סימון 2–3 נקודות חשודות שכדאי לבדוק",
  "שאלות שתוכלו לבדוק גם לבד — בלי קשר אלינו",
  "החלטה משותפת אם יש בכלל התאמה להמשך",
];

const stayTheSame = [
  "עוד חודש של אותם ניסיונות, בלי לדעת מה מהם עובד",
  "תקציב פרסום שרץ על שרשרת שאף אחד לא בדק",
  "לידים שנופלים בין הכיסאות בלי שאף אחד רואה",
  "החלטות לפי תחושה, לא לפי מספרים",
];

export default function PricingTable() {
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
            הצעד הראשון
          </span>
          <h2 className="font-[family-name:var(--font-heebo)] font-black text-3xl sm:text-4xl md:text-5xl text-[#003D47]">
            מה מקבלים <span className="text-gradient-red">בשיחת האבחון</span>?
          </h2>
          <p className="font-[family-name:var(--font-assistant)] text-gray-600 mt-4 text-lg">
            שיחה אחת, מטרה אחת: להבין איפה המנגנון נשבר — ואם יש טעם להמשיך יחד
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
                {stayTheSame.map((item, i) => (
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
                  עוד חודש עם אותה בעיה
                </p>
              </div>
            </div>
          </motion.div>

          {/* Diagnostic call — Highlighted */}
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
                    ללא עלות
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-500 text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/30 font-[family-name:var(--font-heebo)]">
                    ללא התחייבות
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6 justify-center">
                  <div className="w-10 h-10 rounded-xl bg-[#00BCD4]/15 flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-[#00BCD4]" />
                  </div>
                  <h3 className="font-[family-name:var(--font-heebo)] font-bold text-xl text-[#003D47]">
                    שיחת אבחון עם ניב
                  </h3>
                </div>

                <div className="space-y-4">
                  {callIncludes.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-[#00BCD4] flex-shrink-0" />
                      <span className="text-[#003D47] text-sm font-medium font-[family-name:var(--font-assistant)]">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>

                {/* The three pillars of ongoing work */}
                <div className="mt-8 pt-6 border-t border-[#00BCD4]/20">
                  <p className="text-center text-[#6B4FA0] text-sm font-bold font-[family-name:var(--font-heebo)] mb-4">
                    ואם ממשיכים יחד — הליווי בנוי על שלושה דברים:
                  </p>
                  <div className="space-y-3">
                    {pillars.map((pillar) => (
                      <div key={pillar.name} className="bg-[#00BCD4]/[0.06] rounded-2xl px-5 py-3 border border-[#00BCD4]/15 text-right">
                        <span className="font-[family-name:var(--font-heebo)] font-bold text-[#003D47] text-sm">
                          {pillar.name}
                        </span>
                        <span className="font-[family-name:var(--font-assistant)] text-gray-600 text-sm">
                          {" — "}{pillar.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={scrollToCheckout}
                  className="w-full mt-8 cta-glow bg-gradient-to-l from-[#00BCD4] to-[#6B4FA0] text-white font-[family-name:var(--font-heebo)] font-bold text-lg py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>בואו נאבחן את המנגנון</span>
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
