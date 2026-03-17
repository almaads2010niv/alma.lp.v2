"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, Users, TrendingUp } from "lucide-react";

interface CounterProps {
  end: number;
  prefix?: string;
  suffix?: string;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  delay: number;
}

function AnimatedCounter({
  end,
  prefix = "",
  suffix = "",
  label,
  subtitle,
  icon,
  delay,
}: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const timeout = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = end / steps;
      let current = 0;

      intervalId = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          if (intervalId) clearInterval(intervalId);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isInView, end, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      className="relative group"
    >
      <div className="relative bg-gradient-to-br from-[#FFFFFF] to-[#F8F6F3] border border-gray-200 rounded-3xl p-8 sm:p-10 text-center overflow-hidden card-lift">
        {/* Accent corner */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-[#00BCD4]/[0.05] rounded-bl-[60px]" />

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#00BCD4]/10 text-[#00BCD4] mb-5">
          {icon}
        </div>

        {/* Number */}
        <div className="font-[family-name:var(--font-heebo)] font-black text-5xl sm:text-6xl text-[#1a1a1a] mb-2 counter-number">
          {prefix}
          {count.toLocaleString()}
          <span className="text-[#00BCD4]">{suffix}</span>
        </div>

        {/* Label */}
        <p className="text-[#1a1a1a] font-[family-name:var(--font-heebo)] font-bold text-lg mb-1">
          {label}
        </p>

        {/* Subtitle */}
        <p className="text-gray-400 font-[family-name:var(--font-heebo)] text-sm">
          {subtitle}
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
          למה <span className="text-gradient-red">עלמה?</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 text-center mb-16 text-lg font-[family-name:var(--font-heebo)]"
        >
          המספרים מדברים בעד עצמם
        </motion.p>

        {/* Counters grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <AnimatedCounter
            end={8}
            suffix="+"
            label="שנות ניסיון"
            subtitle="בבניית מנגנונים"
            icon={<Clock className="w-7 h-7" />}
            delay={0}
          />
          <AnimatedCounter
            end={100}
            suffix="+"
            label="לקוחות מרוצים"
            subtitle="שעברו מספקים לשיטה"
            icon={<Users className="w-7 h-7" />}
            delay={200}
          />
          <AnimatedCounter
            end={500}
            prefix="₪"
            suffix="K"
            label="יום מכירות שיא"
            subtitle="תוצאה אמיתית מהשטח"
            icon={<TrendingUp className="w-7 h-7" />}
            delay={400}
          />
        </div>
      </div>
    </section>
  );
}
