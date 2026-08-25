"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface ComparisonRow {
  regular: string;
  alma: string;
}

// Not "רגיל VS עלמה" — that keeps us in the same category.
// The comparison is between two ways of approaching the same problem,
// without a straw man: the other approach isn't wrong, it's narrower.
const defaultRows: ComparisonRow[] = [
  {
    regular: "רוצים יותר לידים",
    alma: "בודקים קודם איפה הלידים הקיימים נופלים",
  },
  {
    regular: "מודדים עלות לליד",
    alma: "מודדים מהליד ועד ההכנסה",
  },
  {
    regular: "מחליפים קריאייטיב כשהתוצאות יורדות",
    alma: "בודקים איפה בשרשרת נוצרה הבעיה",
  },
  {
    regular: "כל ספק אחראי על החלק שלו",
    alma: "מנגנון אחד שמחבר מסר, ליד, שיחה וסגירה",
  },
  {
    regular: "מתחילים מהפתרון",
    alma: "מתחילים מהשאלה מה בכלל צריך תיקון",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function ComparisonTable() {
  const rows = defaultRows;

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FAF8F5] to-white" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-[#00BCD4] text-sm font-bold tracking-widest mb-4 font-[family-name:var(--font-heebo)]">
            שתי דרכים לגשת לאותה בעיה
          </span>
          <h2 className="font-[family-name:var(--font-heebo)] font-black text-3xl sm:text-4xl md:text-5xl text-[#003D47]">
            מה <span className="text-gradient-red">ההבדל</span> האמיתי?
          </h2>
        </motion.div>

        {/* Comparison Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-white border border-gray-200 rounded-3xl shadow-lg overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-2 border-b border-gray-200">
            <div className="p-5 sm:p-6 text-center bg-gray-50/80">
              <span className="font-[family-name:var(--font-heebo)] font-bold text-base sm:text-lg text-gray-500">
                גישה שמתחילה בפרסום
              </span>
            </div>
            <div className="p-5 sm:p-6 text-center bg-[#00BCD4]/[0.06]">
              <span className="font-[family-name:var(--font-heebo)] font-bold text-base sm:text-lg text-[#00838F]">
                גישה שמתחילה באבחון
              </span>
            </div>
          </div>

          {/* Rows */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {rows.map((row, i) => (
              <motion.div
                key={i}
                variants={rowVariants}
                className={`grid grid-cols-2 ${
                  i < rows.length - 1 ? "border-b border-gray-100" : ""
                } group hover:bg-[#00BCD4]/[0.02] transition-colors duration-300`}
              >
                {/* Regular agency */}
                <div className="p-5 sm:p-6 flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <X className="w-3.5 h-3.5 text-red-500" />
                  </div>
                  <span className="font-[family-name:var(--font-assistant)] text-sm sm:text-base text-gray-500 leading-relaxed">
                    {row.regular}
                  </span>
                </div>

                {/* Alma */}
                <div className="p-5 sm:p-6 flex items-start gap-3 bg-[#00BCD4]/[0.03]">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="font-[family-name:var(--font-assistant)] text-sm sm:text-base text-[#003D47] font-semibold leading-relaxed">
                    {row.alma}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Anti-straw-man note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-gray-400 text-sm mt-6 font-[family-name:var(--font-assistant)]"
        >
          זה לא אומר שהגישה הראשונה לא עובדת אף פעם — זה אומר שהשאלה שאנחנו שואלים קודם רחבה יותר.
        </motion.p>
      </div>
    </section>
  );
}
