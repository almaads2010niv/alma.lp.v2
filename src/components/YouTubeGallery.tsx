"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronLeft, ChevronRight, Youtube } from "lucide-react";

// ── YouTube Videos mapped to Quiz calibrating questions ──
// Each video corresponds to a topic from the adaptive quiz.
// Update the videoId fields with actual YouTube video IDs from @Alma.Marketing.Israel

interface VideoItem {
  videoId: string; // YouTube video ID (the part after v= or /shorts/)
  title: string;
  quizQuestion: string; // The calibrating question this video addresses
  thumbnail?: string; // Optional custom thumbnail
}

const videos: VideoItem[] = [
  {
    // Q1: מה הביא אותך לכאן? → זהות עסקית = למה אתה כאן
    videoId: "-HdIJaIEBdY",
    title: "מה זו זהות עסקית?",
    quizQuestion: "מה הביא אותך לכאן?",
  },
  {
    // Q2: מה מתסכל בשיווק? → משפך שיווקי = הפתרון לתסכול
    videoId: "QX5kHW3PqSU",
    title: "דוגמה למשפך שיווקי",
    quizQuestion: "מה הכי מתסכל אותך בשיווק היום?",
  },
  {
    // Q3: מה קורה כשנכנס ליד? → בדיוק השאלה הזו!
    videoId: "B_C4BtExcBY",
    title: "מה קורה לליד שלכם רגע אחרי שהשאיר את הפנייה?",
    quizQuestion: "מה קורה כשנכנס ליד חדש?",
  },
  {
    // Q4: מה ישכנע אותך? → מסגור = איך לשכנע נכון
    videoId: "uM4bPyrdHNs",
    title: "מה זה מסגור במכירה?",
    quizQuestion: "מה ישכנע אותך לעבוד עם גורם חיצוני?",
  },
  {
    // Q5: הגדרת הצלחה → תכנון גיוס = הדרך להצלחה
    videoId: "w2uTr4R4EUI",
    title: "איך מתכננים גיוס לקוחות?",
    quizQuestion: "מה ההגדרה שלך להצלחה?",
  },
  {
    // Q6: איך מקבלים החלטות? → המוח והמילה "לא" = פסיכולוגיית החלטות
    videoId: "NYu2rx4G69U",
    title: 'למה המוח שלנו צריך את המילה "לא"?',
    quizQuestion: "איך את/ה מקבל/ת החלטות גדולות?",
  },
  {
    // Q7: מה מדאיג בגורם חיצוני? → תוכנית עסקית מפחיתה חשש
    videoId: "ovbPs7tOp9c",
    title: "למה תוכנית עסקית היא קריטית עבורכם?",
    quizQuestion: "מה הכי מדאיג אותך בעבודה עם גורם חיצוני?",
  },
];

export default function YouTubeGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const video = videos[activeIndex];
  const hasRealVideos = !video.videoId.startsWith("REPLACE_");

  const next = () => {
    setPlaying(false);
    setActiveIndex((prev) => (prev + 1) % videos.length);
  };

  const prev = () => {
    setPlaying(false);
    setActiveIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#003D47]/[0.02] to-white" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-[#6B4FA0] text-sm font-bold tracking-widest mb-4 font-[family-name:var(--font-heebo)]">
            <Youtube className="w-4 h-4" />
            תכנים מהשטח
          </span>
          <h2 className="font-[family-name:var(--font-heebo)] font-black text-3xl sm:text-4xl md:text-5xl text-[#003D47] mb-4">
            השאלות שבעלי עסקים שואלים — <span className="text-gradient-red">והתשובות</span>
          </h2>
          <p className="font-[family-name:var(--font-assistant)] text-lg text-gray-600 max-w-2xl mx-auto">
            כל סרטון עונה על אחת השאלות המכיילות מהשאלון. צפו וגלו תובנות שישנו את הדרך שאתם מנהלים את העסק.
          </p>
        </motion.div>

        {/* Video Player */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          {/* Main video area */}
          <div className="bg-[#003D47] rounded-3xl overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-video"
              >
                {playing && hasRealVideos ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer group relative"
                    onClick={() => hasRealVideos && setPlaying(true)}
                  >
                    {/* Thumbnail or placeholder */}
                    {hasRealVideos ? (
                      <img
                        src={video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#003D47] to-[#00BCD4]/30" />
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all" />

                    {/* Play button */}
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl"
                      >
                        <Play className="w-8 h-8 text-[#003D47] mr-[-2px]" fill="#003D47" />
                      </motion.div>
                      {!hasRealVideos && (
                        <p className="text-white/70 text-sm font-[family-name:var(--font-heebo)]">
                          הסרטון יתווסף בקרוב
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Bottom info bar */}
            <div className="bg-[#003D47] px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-[family-name:var(--font-heebo)] font-bold text-white text-base sm:text-lg truncate">
                  {video.title}
                </h3>
              </div>

              {/* Navigation arrows */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="text-white/60 text-sm font-[family-name:var(--font-heebo)] min-w-[50px] text-center">
                  {activeIndex + 1} / {videos.length}
                </span>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Video thumbnails strip */}
          <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {videos.map((v, i) => (
              <button
                key={i}
                onClick={() => {
                  setPlaying(false);
                  setActiveIndex(i);
                }}
                className={`relative rounded-xl overflow-hidden aspect-video cursor-pointer transition-all duration-300 ${
                  i === activeIndex
                    ? "ring-2 ring-[#00BCD4] scale-105 shadow-lg"
                    : "opacity-60 hover:opacity-100 hover:scale-102"
                }`}
              >
                {hasRealVideos ? (
                  <img
                    src={`https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg`}
                    alt={v.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#003D47] to-[#00BCD4]/40 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white/70" />
                  </div>
                )}
                {i === activeIndex && (
                  <div className="absolute inset-0 border-2 border-[#00BCD4] rounded-xl" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
