"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function VideoSection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFFFF] via-[#FAF8F5] to-[#FFFFFF]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00BCD4]/[0.03] rounded-full blur-[180px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-[#00BCD4] text-sm font-bold tracking-widest mb-4 font-[family-name:var(--font-heebo)]">
            <Play className="w-4 h-4" />
            הוכחה מהשטח
          </span>
          <h2 className="font-[family-name:var(--font-heebo)] font-black text-3xl sm:text-4xl md:text-5xl text-[#003D47]">
            ככה ייצרנו{" "}
            <span className="text-gradient-red">חצי מיליון שקל</span>{" "}
            ביום אחד
          </h2>
        </motion.div>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative group"
        >
          {/* Decorative shadow/glow behind the video */}
          <div className="absolute -inset-3 bg-gradient-to-br from-[#00BCD4]/20 via-[#6B4FA0]/10 to-[#00BCD4]/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

          {/* Video wrapper */}
          <div className="relative bg-white border border-gray-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
            <div className="aspect-video">
              <iframe
                src="https://www.youtube.com/embed/0BW40ybeIDQ"
                title="הוכחה מהשטח — עלמה"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-gray-400 text-sm mt-6 font-[family-name:var(--font-heebo)]"
        >
          תוצאות אמיתיות. לקוחות אמיתיים. בלי פילטרים.
        </motion.p>
      </div>
    </section>
  );
}
