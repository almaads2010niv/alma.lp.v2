"use client";

import { motion } from "framer-motion";
import { getArchetypeContent } from "@/data/archetypeContent";

interface HowItWorksProps {
  archetype?: string | null;
}

interface Step {
  title: string;
  description: string;
}

const defaultSteps: Step[] = [
  {
    title: "שיחת אבחון",
    description: "נבין את המצב, נאתר את הפערים, ונגדיר יעדים",
  },
  {
    title: "בניית מנגנון",
    description: "נבנה תהליך מכירה, זהות ברורה, ומערכת שיווק",
  },
  {
    title: "צמיחה מבוקרת",
    description: "נפעיל קמפיינים על בסיס יציב — ונמדוד כל שקל",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const numbers = ["01", "02", "03"];

export default function HowItWorks({ archetype }: HowItWorksProps) {
  const content = getArchetypeContent(archetype);
  const sectionContent = content?.howItWorks;
  const steps = sectionContent?.steps ?? defaultSteps;

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-white" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#00BCD4]/[0.03] rounded-full blur-[200px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[#00BCD4] text-sm font-bold tracking-widest mb-4 font-[family-name:var(--font-heebo)]">
            {sectionContent?.label ?? "איך זה עובד"}
          </span>
          <h2 className="font-[family-name:var(--font-heebo)] font-black text-3xl sm:text-4xl md:text-5xl text-[#003D47]">
            שלושה <span className="text-gradient-red">צעדים</span> לתוצאות
          </h2>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-[72px] right-[calc(16.66%+30px)] left-[calc(16.66%+30px)] h-0.5 bg-gradient-to-l from-[#00BCD4]/30 via-[#00BCD4]/50 to-[#00BCD4]/30 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={stepVariants}
                className="relative z-10"
              >
                <div className="bg-gradient-to-br from-white to-[#FAF8F5] border border-gray-200 rounded-3xl p-8 sm:p-10 text-center h-full hover:border-[#00BCD4]/30 transition-all duration-500 card-lift">
                  {/* Numbered Circle */}
                  <div className="relative mx-auto mb-7">
                    <div className="w-[72px] h-[72px] rounded-full bg-[#00BCD4]/10 flex items-center justify-center mx-auto border-2 border-[#00BCD4]/20">
                      <span className="font-[family-name:var(--font-heebo)] font-black text-2xl text-[#00BCD4]">
                        {numbers[i]}
                      </span>
                    </div>
                  </div>

                  {/* Step Title */}
                  <h3 className="font-[family-name:var(--font-heebo)] font-bold text-xl sm:text-2xl text-[#003D47] mb-3">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="font-[family-name:var(--font-assistant)] text-base sm:text-lg text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Vertical connecting line (mobile only) */}
                {i < steps.length - 1 && (
                  <div className="md:hidden w-0.5 h-8 bg-[#00BCD4]/30 mx-auto" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
