"use client";

import { motion } from "framer-motion";
import { getDiagnosisContent } from "@/data/diagnosisContent";

interface GuiltReleaseProps {
  diagnosis?: string | null;
}

// Mature default — no victim language, no "זה לא באשמתכם".
const defaultParagraphs = [
  "בעלי עסקים בדרך כלל מטפלים בכל חלק בנפרד: קמפיינים אצל משרד אחד, CRM אצל ספק אחר, אנשי מכירות לבד, תוכן אצל מישהו שלישי.",
  "כל אחד מהגורמים האלה יכול לעשות עבודה טובה. אבל ברוב המקרים אין גורם אחד שרואה את התמונה המלאה, ולכן הגיוני שהבעיה נשארת גם כשכולם עושים את שלהם.",
  "כאן נכנס הליווי של עלמה. לא כדי לעשות הכול, אלא כדי להבין קודם איפה המנגנון נשבר.",
];

export default function GuiltRelease({ diagnosis }: GuiltReleaseProps) {
  const content = getDiagnosisContent(diagnosis);
  const sectionContent = content?.guiltRelease;

  const paragraphs = sectionContent?.paragraphs ?? defaultParagraphs;

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Subtle warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5] via-white to-[#FAF8F5]" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00BCD4]/20 to-transparent" />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block text-[#00BCD4] text-sm font-bold tracking-widest mb-4 font-[family-name:var(--font-heebo)]">
            {sectionContent?.label ?? "למה זה קורה כמעט לכולם"}
          </span>
        </motion.div>

        {/* Paragraphs */}
        <div className="space-y-8 text-center">
          {paragraphs.map((paragraph, i) => {
            const isPunchline = i === paragraphs.length - 1;
            return (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: 0.15 + i * 0.2,
                  ease: "easeOut",
                }}
                className={`font-[family-name:var(--font-assistant)] text-xl sm:text-2xl md:text-3xl leading-relaxed ${
                  isPunchline
                    ? "text-[#003D47] font-medium"
                    : "text-gray-600 font-light"
                }`}
              >
                {paragraph}
              </motion.p>
            );
          })}
        </div>

        {/* Empathetic accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 mx-auto w-24 h-1 bg-gradient-to-r from-[#00BCD4] to-[#6B4FA0] rounded-full origin-center"
        />
      </div>
    </section>
  );
}
