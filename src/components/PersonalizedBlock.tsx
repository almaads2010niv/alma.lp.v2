"use client";

import { motion } from "framer-motion";
import { getArchetypeContent } from "@/data/archetypeContent";

interface PersonalizedBlockProps {
  archetype: string;
}

export default function PersonalizedBlock({ archetype }: PersonalizedBlockProps) {
  const content = getArchetypeContent(archetype);
  const sectionContent = content?.personalizedBlock;

  return (
    <section id="personalized" className="relative py-16 sm:py-20 overflow-hidden">
      {/* Background gradient from teal/5 to white */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00BCD4]/[0.05] to-white" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 20,
            duration: 0.8,
          }}
          className="relative bg-white/80 backdrop-blur-sm border border-[#00BCD4]/20 rounded-3xl p-8 sm:p-12 text-center shadow-sm"
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#00BCD4] to-[#6B4FA0] rounded-b-full" />

          {/* Small decorative dot */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
            className="w-3 h-3 rounded-full bg-[#00BCD4] mx-auto mb-6"
          />

          {/* Header */}
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.2 }}
            className="font-[family-name:var(--font-heebo)] font-bold text-2xl sm:text-3xl text-[#003D47] mb-4 leading-relaxed"
          >
            {sectionContent?.header ?? "בהתאם לסגנון שלכם, הנה מה שחשוב לדעת"}
          </motion.h3>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.35 }}
            className="font-[family-name:var(--font-assistant)] text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
          >
            {sectionContent?.body ??
              "בהתאם לסגנון שלכם, הנה מה שחשוב לדעת: אנחנו בונים מנגנונים שעובדים בדיוק בשבילכם."}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
