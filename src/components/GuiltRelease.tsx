"use client";

import { motion } from "framer-motion";
import { getArchetypeContent } from "@/data/archetypeContent";

interface GuiltReleaseProps {
  archetype?: string | null;
}

const defaultParagraphs = [
  "אם זה מרגיש מוכר, אתם לא לבד. רוב העסקים שמגיעים אלינו היו בדיוק באותו מקום.",
  "הבעיה היא כמעט אף פעם לא הפרסום עצמו. הבעיה היא במה שקורה לפניו ואחריו.",
];

export default function GuiltRelease({ archetype }: GuiltReleaseProps) {
  const content = getArchetypeContent(archetype);
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
            {sectionContent?.label ?? "רגע של כנות"}
          </span>
        </motion.div>

        {/* Paragraphs */}
        <div className="space-y-8 text-center">
          {paragraphs.map((paragraph, i) => (
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
              className="font-[family-name:var(--font-assistant)] text-xl sm:text-2xl md:text-3xl text-gray-600 leading-relaxed font-light"
            >
              {paragraph}
            </motion.p>
          ))}
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
