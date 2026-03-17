"use client";

import { motion } from "framer-motion";

const questions = [
  {
    number: "01",
    text: "הטלפון מצלצל. עוד ליד. לכאורה, ניצחון. בפועל? צוות המכירות שחוק, אין תסריטים מוגדרים, ואתם רודפים אחרי מספרים שלא עונים.",
  },
  {
    number: "02",
    text: "לענות לוואטסאפ ב-22:00 בלילה רק כדי לא לאבד לקוח — זה לא שירות. זה הישרדות.",
  },
  {
    number: "03",
    text: "יש לקוחות שיוצאים. אתם מרגישים בהיי, אבל רגע, הדלתא שלכם לא בטוחה.",
  },
  {
    number: "04",
    text: "אם זה מרגיש לכם מוכר, אתם לא לבד. זה הסטנדרט השבור של התעשייה.",
  },
];

export default function VossBlock() {
  const scrollToQuiz = () => {
    document.getElementById("quiz-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-white">
      {/* Subtle accent line */}
      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-[#00BCD4]/30 to-transparent" />

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
            רגע של אמת
          </span>
          <h2 className="font-[family-name:var(--font-heebo)] font-black text-3xl sm:text-4xl md:text-5xl text-[#003D47]">
            נשמע מוכר?
          </h2>
        </motion.div>

        {/* Question Cards */}
        <div className="space-y-6">
          {questions.map((q, i) => (
            <motion.div
              key={q.number}
              initial={{ opacity: 0, x: i % 2 === 0 ? 60 : -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group"
            >
              <div
                className={`relative bg-gradient-to-br ${
                  i % 2 === 0
                    ? "from-[#00BCD4]/[0.06] to-transparent"
                    : "from-[#6B4FA0]/[0.06] to-transparent"
                } border border-gray-200 rounded-3xl p-8 sm:p-10 overflow-hidden backdrop-blur-sm hover:border-[#00BCD4]/30 transition-all duration-500`}
              >
                {/* Offset shadow effect */}
                <div className="absolute -top-2 -right-2 w-full h-full border border-[#00BCD4]/10 rounded-3xl -z-10 group-hover:top-0 group-hover:right-0 transition-all duration-500" />

                <div className="flex items-start gap-6">
                  {/* Number Badge */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[#00BCD4]/10 flex items-center justify-center group-hover:bg-[#00BCD4] transition-all duration-500">
                    <span className="font-[family-name:var(--font-heebo)] font-black text-xl text-[#00BCD4] group-hover:text-white transition-colors duration-500">
                      {q.number}
                    </span>
                  </div>

                  {/* Question Text */}
                  <p className="font-[family-name:var(--font-heebo)] font-bold text-lg sm:text-xl md:text-2xl text-[#003D47] leading-relaxed pt-2">
                    {q.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quote Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 relative"
        >
          <div className="border-r-4 border-gradient-gold pr-8 py-4" style={{ borderImage: "linear-gradient(to bottom, #6B4FA0, #00BCD4) 1" }}>
            <p className="font-[family-name:var(--font-assistant)] text-xl sm:text-2xl text-gray-600 leading-relaxed italic">
              &ldquo;הבעיה היא לא שאין לידים. הבעיה היא שאין מנגנון שיודע מה לעשות איתם.&rdquo;
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="text-center mt-14"
        >
          <motion.button
            onClick={scrollToQuiz}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 bg-gradient-to-l from-[#00BCD4] to-[#6B4FA0] text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 font-[family-name:var(--font-heebo)] cursor-pointer"
          >
            זה נשמע מוכר מדי
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
