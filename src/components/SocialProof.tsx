"use client";

import { motion } from "framer-motion";
import { Clock, Users, TrendingUp } from "lucide-react";

// ── Evidence-based social proof ──
// Every fact here is drawn from the real client testimonials that appear
// further down the page (Testimonials.tsx). No invented counters.
// HARD RULE: Niv is presented ONLY as an external advisor/partner.
// Never frame him as an employee or internal manager of any client.

interface ProofCard {
  client: string;
  fact: string;
  source: string;
  icon: React.ReactNode;
  delay: number;
}

const proofCards: ProofCard[] = [
  {
    client: "רשת גרייט שייפ",
    fact: "עבודה משותפת לאורך שנים. אחרי תקופה של מדידת KPIs נרשמה עלייה משמעותית בכמות ובאיכות הלידים, באותו תקציב, והעבודה הורחבה לכל הרשת",
    source: "מתוך ההמלצה של ירון סלע, המנכ״ל, בהמשך הדף",
    icon: <Clock className="w-7 h-7" />,
    delay: 0,
  },
  {
    client: "UFC ISRAEL",
    fact: "חיבור בין אסטרטגיה, שיווק ותפעול, עד תסריטי שיחה לאנשי המכירות",
    source: "מתוך ההמלצה של רוני, מנהלת השיווק הארצית",
    icon: <TrendingUp className="w-7 h-7" />,
    delay: 200,
  },
  {
    client: "קאנטרי נשר",
    fact: "ליווי מלא: תסריטי שיחה, תהליכי מכירה והחיבור בין השיווק לשטח",
    source: "מתוך ההמלצה של עוזי, המנכ״ל",
    icon: <Users className="w-7 h-7" />,
    delay: 400,
  },
];

// Businesses currently in ongoing ליווי — a business fact, NOT testimonials.
// Never attach quotes, stars, results or endorsements to these names.
const currentClients = [
  "קאנטרי קריית השרון",
  "מאיה ספורט",
  "רילקס קלאב",
  "פילאטיס קלאס",
  "איתן מעדני בשר",
];

function ProofCardItem({ client, fact, source, icon, delay }: ProofCard) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      className="relative group"
    >
      <div className="relative h-full bg-gradient-to-br from-[#FFFFFF] to-[#F8F6F3] border border-gray-200 rounded-3xl p-8 sm:p-10 text-center overflow-hidden card-lift">
        {/* Accent corner */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-[#00BCD4]/[0.05] rounded-bl-[60px]" />

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#00BCD4]/10 text-[#00BCD4] mb-5">
          {icon}
        </div>

        {/* Client name */}
        <div className="font-[family-name:var(--font-heebo)] font-black text-2xl sm:text-3xl text-[#1a1a1a] mb-3">
          {client}
        </div>

        {/* Fact */}
        <p className="text-[#1a1a1a] font-[family-name:var(--font-heebo)] font-bold text-base leading-relaxed mb-3">
          {fact}
        </p>

        {/* Source */}
        <p className="text-gray-400 font-[family-name:var(--font-heebo)] text-sm">
          {source}
        </p>
      </div>
    </motion.div>
  );
}

export default function SocialProof() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFFFF] via-[#FAF8F5] to-[#FFFFFF]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00BCD4]/[0.03] rounded-full blur-[200px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-[family-name:var(--font-heebo)] font-black text-3xl sm:text-4xl text-center text-[#1a1a1a] mb-4"
        >
          עסקים שכבר <span className="text-gradient-red">עברו</span> את זה
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 text-center mb-16 text-lg font-[family-name:var(--font-heebo)]"
        >
          לא מספרים באוויר: לקוחות אמיתיים, בשמם המלא, מתוך ההמלצות שבהמשך הדף
        </motion.p>

        {/* Proof cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {proofCards.map((card) => (
            <ProofCardItem key={card.client} {...card} />
          ))}
        </div>

        {/* Current clients — presented as a business fact, not as testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 text-sm font-bold tracking-widest mb-6 font-[family-name:var(--font-heebo)]">
            בין העסקים שאנחנו מלווים כיום
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {currentClients.map((name) => (
              <span
                key={name}
                className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-[#003D47] text-sm font-semibold font-[family-name:var(--font-heebo)] shadow-sm"
              >
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
