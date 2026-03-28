"use client";

import { useState, useCallback, useRef, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ChevronLeft, ChevronDown, Loader2, Building2, ClipboardList,
  UtensilsCrossed, Scissors, ShoppingBag, Dumbbell, Briefcase,
  GraduationCap, Home, Monitor, Hammer, Car, MoreHorizontal, Tag,
} from "lucide-react";
import { trackQuizStart, trackQuizComplete } from "@/lib/analytics";

// ── Business Type Option ──
interface BusinessTypeOption {
  value: string;
  label: string;
  icon: ReactNode;
}

const BUSINESS_TYPES: BusinessTypeOption[] = [
  { value: "מסעדה/בית קפה", label: "מסעדה / בית קפה", icon: <UtensilsCrossed className="w-4 h-4" /> },
  { value: "מכון יופי/ספא", label: "מכון יופי / ספא", icon: <Scissors className="w-4 h-4" /> },
  { value: "חנות/קמעונאות", label: "חנות / קמעונאות", icon: <ShoppingBag className="w-4 h-4" /> },
  { value: "בריאות/כושר", label: "בריאות / כושר", icon: <Dumbbell className="w-4 h-4" /> },
  { value: "שירותים מקצועיים", label: "שירותים מקצועיים", icon: <Briefcase className="w-4 h-4" /> },
  { value: "חינוך/הדרכה", label: "חינוך / הדרכה", icon: <GraduationCap className="w-4 h-4" /> },
  { value: "נדל\"ן", label: "נדל\"ן", icon: <Home className="w-4 h-4" /> },
  { value: "טכנולוגיה", label: "טכנולוגיה", icon: <Monitor className="w-4 h-4" /> },
  { value: "בנייה/שיפוצים", label: "בנייה / שיפוצים", icon: <Hammer className="w-4 h-4" /> },
  { value: "רכב", label: "רכב", icon: <Car className="w-4 h-4" /> },
  { value: "אחר", label: "אחר", icon: <MoreHorizontal className="w-4 h-4" /> },
];

// ============================================
// Adaptive Quiz — 7 Questions x 5 Options
// ============================================
// Questions displayed client-side (visible on screen anyway).
// Scoring, archetype mapping, and personality content
// are ALL server-side in /api/quiz/score — never in the bundle.

interface QuizQuestion {
  id: number;
  question: string;
  options: { id: string; text: string }[];
}

interface AnalysisData {
  name: string;
  tagline: string;
  personality: string;
  painApproach: string;
  tip: string;
  nudge: string;
}

interface QuizResult {
  primary: string;
  secondary: string;
  businessName?: string;
  businessType?: string;
  quizName?: string;
  quizPhone?: string;
}

interface Props {
  onResult: (result: QuizResult) => void;
}

// ── Questions only — NO archetype mapping in the client ──
const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "מה הביא אותך לכאן?",
    options: [
      { id: "א", text: "רוצה להכפיל הכנסות בתוך חצי שנה" },
      { id: "ב", text: "שמעתי המלצה ממישהו שעבד איתכם" },
      { id: "ג", text: "מחפש/ת גישה אחרת ממה שניסיתי עד היום" },
      { id: "ד", text: "הרגשתי שהעסק שלי צריך מישהו שבאמת מבין אותי" },
      { id: "ה", text: "רוצה לוודא שיש שיטה מוכחת לפני שאשקיע" },
    ],
  },
  {
    id: 2,
    question: "מה הכי מתסכל אותך בשיווק היום?",
    options: [
      { id: "א", text: "שאני לא רואה ROI ברור על כל שקל" },
      { id: "ב", text: "שהמתחרים נראים הרבה יותר מצליחים ממני" },
      { id: "ג", text: "שהכל נראה אותו דבר — שום דבר לא מקורי" },
      { id: "ד", text: "שאני מרגיש/ה לבד עם הבעיות, בלי מי שבאמת מקשיב" },
      { id: "ה", text: "שאין תהליך מסודר — הכל ניסוי וטעייה" },
    ],
  },
  {
    id: 3,
    question: "מה קורה כשנכנס ליד חדש?",
    options: [
      { id: "א", text: "חוזרים מהר, שולחים הצעה, סוגרים" },
      { id: "ב", text: "מספרים על לקוחות מרוצים ומבקשים לבדוק" },
      { id: "ג", text: "מנסים להבין מה הוא באמת צריך ולהתאים" },
      { id: "ד", text: "יוצרים שיחה אישית ומנסים ליצור קשר אנושי" },
      { id: "ה", text: "עוקבים אחרי פרוטוקול קבוע שלב אחר שלב" },
    ],
  },
  {
    id: 4,
    question: "מה ישכנע אותך לעבוד עם גורם חיצוני?",
    options: [
      { id: "א", text: "מספרים ותוצאות ברורות" },
      { id: "ב", text: "המלצות חמות מבעלי עסקים שאני מכיר/ה" },
      { id: "ג", text: "גישה שונה ומקורית שלא ראיתי קודם" },
      { id: "ד", text: "שארגיש שהם באמת מבינים מה אני עובר/ת" },
      { id: "ה", text: "שיטת עבודה מסודרת עם לוחות זמנים ברורים" },
    ],
  },
  {
    id: 5,
    question: "מה ההגדרה שלך להצלחה?",
    options: [
      { id: "א", text: "להגיע ליעד הכנסות מדויק שהגדרתי" },
      { id: "ב", text: "להיות המותג שכולם ממליצים עליו" },
      { id: "ג", text: "לבנות משהו שונה שאני גאה בו" },
      { id: "ד", text: "לדעת שעזרתי ללקוחות שלי באמת" },
      { id: "ה", text: "שהעסק יעבוד בצורה יציבה וצפויה" },
    ],
  },
  {
    id: 6,
    question: "איך את/ה מקבל/ת החלטות גדולות?",
    options: [
      { id: "א", text: "מנתח/ת נתונים ומחליט/ה מהר" },
      { id: "ב", text: "מתייעץ/ת עם אנשים שאני סומך/ת עליהם" },
      { id: "ג", text: "חוקר/ת אלטרנטיבות עד שמשהו מרגיש נכון" },
      { id: "ד", text: "הולך/ת לפי תחושת בטן ואינטואיציה" },
      { id: "ה", text: "בודק/ת מחקרים וביקורות לפני שפועל/ת" },
    ],
  },
  {
    id: 7,
    question: "מה הכי מדאיג אותך בעבודה עם גורם חיצוני?",
    options: [
      { id: "א", text: "שזה יהיה בזבוז זמן בלי השפעה על השורה התחתונה" },
      { id: "ב", text: "שזה לא יתאים למה שעושים עסקים מצליחים אחרים" },
      { id: "ג", text: "שיתנו לי פתרון גנרי ומשעמם" },
      { id: "ד", text: "שלא באמת יבינו מה אני עובר/ת" },
      { id: "ה", text: "שאין מתודולוגיה ברורה ולא אדע מה קורה" },
    ],
  },
];

export default function AdaptiveQuiz({ onResult }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{ question_id: number; option_id: string }[]>([]);
  const [stage, setStage] = useState<"idle" | "intro" | "quiz" | "details" | "loading" | "result">("idle");
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setTypeDropdownOpen(false);
      }
    };
    if (typeDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [typeDropdownOpen]);

  const questions = QUIZ_QUESTIONS;

  const handleAnswer = useCallback(
    (optionId: string) => {
      const q = questions[currentIndex];
      const newSelected = [...selectedOptions, { question_id: q.id, option_id: optionId }];
      setSelectedOptions(newSelected);

      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setStage("details");
      }
    },
    [currentIndex, questions, selectedOptions]
  );

  const handleSubmit = useCallback(async () => {
    if (!name.trim() || !phone.trim()) return;

    setStage("loading");
    setError(null);

    try {
      const res = await fetch("/api/quiz/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: selectedOptions,
          name: name.trim(),
          phone: phone.trim(),
          businessName: businessName.trim() || undefined,
          businessType: businessType || undefined,
        }),
      });

      if (!res.ok) {
        setError("אירעה שגיאה. נסו שוב.");
        setStage("details");
        return;
      }

      const data = await res.json();

      if (data.primary && data.profile) {
        setAnalysis({
          name: data.profile.label,
          tagline: data.profile.tagline,
          personality: data.profile.personality,
          painApproach: data.profile.painApproach,
          tip: data.profile.tip,
          nudge: data.profile.nudge,
        });
        setStage("result");

        // Fire FB Pixel event
        trackQuizComplete(data.primary, businessType);

        // Notify parent with archetype + business info for page personalization
        onResult({
          primary: data.primary,
          secondary: data.secondary || "",
          businessName: businessName.trim() || undefined,
          businessType: businessType || undefined,
          quizName: name.trim() || undefined,
          quizPhone: phone.trim() || undefined,
        });
      } else {
        setError("אירעה שגיאה. נסו שוב.");
        setStage("details");
      }
    } catch {
      setError("אירעה שגיאה בחיבור. נסו שוב.");
      setStage("details");
    }
  }, [name, phone, businessName, businessType, selectedOptions, onResult]);

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedOptions((prev) => prev.slice(0, -1));
    }
  }, [currentIndex]);

  const startQuiz = useCallback(() => {
    trackQuizStart();
    setStage("intro");
  }, []);

  // ── IDLE ──
  if (stage === "idle") {
    return (
      <section id="quiz-section" className="relative py-20 sm:py-28 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-[#6B4FA0] text-sm font-bold tracking-widest mb-4 font-[family-name:var(--font-heebo)]">
              בדקו את עצמכם
            </span>
            <h2 className="font-[family-name:var(--font-heebo)] font-black text-3xl sm:text-4xl md:text-5xl text-[#003D47] mb-6">
              איך אתם באמת מנהלים את העסק?
            </h2>
            <p className="font-[family-name:var(--font-assistant)] text-lg text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
              ענו על 7 שאלות קצרות שיחשפו את הדרך שבה אתם מקבלים החלטות, מתמודדים עם אתגרים ומובילים את העסק — ויעזרו לנו להתאים לכם מנגנון צמיחה מדויק.
            </p>
            <p className="font-[family-name:var(--font-assistant)] text-base text-[#6B4FA0] font-semibold mb-10 max-w-2xl mx-auto">
              בתום השאלון תקבלו פרופיל אישי עם תובנות מעשיות לניהול העסק שלכם
            </p>
            <motion.button
              onClick={startQuiz}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 bg-gradient-to-l from-[#00BCD4] to-[#6B4FA0] text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 font-[family-name:var(--font-heebo)] cursor-pointer"
            >
              <ClipboardList className="w-5 h-5" />
              בואו נתחיל
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    );
  }

  // ── INTRO ──
  if (stage === "intro") {
    return (
      <section id="quiz-section" className="relative py-20 sm:py-28 overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-gray-200 rounded-3xl p-10 sm:p-14 shadow-xl"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00BCD4] to-[#6B4FA0] flex items-center justify-center mx-auto mb-8">
              <ClipboardList className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-[family-name:var(--font-heebo)] font-black text-2xl sm:text-3xl text-[#003D47] mb-4">
              ככה זה עובד
            </h3>
            <p className="font-[family-name:var(--font-assistant)] text-gray-600 text-lg mb-3">
              בכל שאלה יופיעו 5 אפשרויות — בחרו את זו שהכי מרגישה לכם נכונה.
            </p>
            <p className="font-[family-name:var(--font-assistant)] text-gray-600 text-lg mb-8">
              אין תשובות נכונות או לא נכונות — רק מה שמתאים לכם.
            </p>
            <motion.button
              onClick={() => setStage("quiz")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-[#00BCD4] text-white font-bold text-lg px-12 py-4 rounded-2xl shadow-lg hover:bg-[#00ACC1] transition-colors duration-300 font-[family-name:var(--font-heebo)] cursor-pointer"
            >
              הבנתי, בואו נתחיל
            </motion.button>
          </motion.div>
        </div>
      </section>
    );
  }

  // ── QUIZ ──
  if (stage === "quiz") {
    const q = questions[currentIndex];
    if (!q) {
      // Safety: reset if index out of bounds (can happen on Hot Reload)
      setStage("idle");
      setCurrentIndex(0);
      setSelectedOptions([]);
      return null;
    }
    const progress = (currentIndex / questions.length) * 100;

    return (
      <section id="quiz-section" className="relative py-20 sm:py-28 overflow-hidden">
        <div className="max-w-3xl mx-auto px-6">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="font-[family-name:var(--font-assistant)] text-sm text-gray-500">
                שאלה {currentIndex + 1} מתוך {questions.length}
              </span>
              {currentIndex > 0 && (
                <button
                  onClick={goBack}
                  className="flex items-center gap-1 text-sm text-[#00BCD4] hover:text-[#00838F] transition-colors font-[family-name:var(--font-assistant)] cursor-pointer"
                >
                  חזרה
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                </button>
              )}
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-l from-[#00BCD4] to-[#6B4FA0] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.35 }}
            >
              <h3 className="font-[family-name:var(--font-heebo)] font-bold text-2xl sm:text-3xl text-[#003D47] mb-8 text-center">
                {q.question}
              </h3>

              <div className="space-y-3">
                {q.options.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-right bg-white border-2 border-gray-200 hover:border-[#00BCD4] rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-lg group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-9 h-9 rounded-full border-2 border-gray-300 group-hover:border-[#00BCD4] group-hover:bg-[#00BCD4]/10 flex items-center justify-center text-gray-400 group-hover:text-[#00BCD4] transition-all duration-300 font-bold text-sm">
                        {option.id}
                      </div>
                      <p className="font-[family-name:var(--font-assistant)] text-base sm:text-lg text-gray-700 group-hover:text-[#003D47] transition-colors duration-300">
                        {option.text}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    );
  }

  // ── DETAILS FORM ──
  if (stage === "details") {
    const phoneRegex = /^0\d{8,9}$/;
    const isValid = name.trim().length >= 2 && phoneRegex.test(phone.replace(/[-\s]/g, ""));

    const selectedType = BUSINESS_TYPES.find((bt) => bt.value === businessType);

    return (
      <section id="quiz-section" className="relative py-20 sm:py-28 overflow-hidden">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-xl text-center"
          >
            <div className="w-16 h-16 rounded-full bg-[#00BCD4]/10 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">&#10004;&#65039;</span>
            </div>
            <h3 className="font-[family-name:var(--font-heebo)] font-black text-2xl sm:text-3xl text-[#003D47] mb-3">
              סיימתם! כל הכבוד
            </h3>
            <p className="font-[family-name:var(--font-assistant)] text-gray-600 mb-8">
              השאירו פרטים כדי לגלות את התוצאה שלכם
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-6 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4 text-right mb-8">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 font-[family-name:var(--font-assistant)]">
                  שם מלא <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="השם שלך"
                  className="w-full px-5 py-3 rounded-xl border-2 border-gray-200 focus:border-[#00BCD4] focus:ring-2 focus:ring-[#00BCD4]/20 outline-none text-lg font-[family-name:var(--font-assistant)] transition-all duration-300"
                  dir="rtl"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 font-[family-name:var(--font-assistant)]">
                  טלפון <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="050-1234567"
                  className="w-full px-5 py-3 rounded-xl border-2 border-gray-200 focus:border-[#00BCD4] focus:ring-2 focus:ring-[#00BCD4]/20 outline-none text-lg font-[family-name:var(--font-assistant)] transition-all duration-300"
                  dir="ltr"
                />
              </div>

              {/* Business Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 font-[family-name:var(--font-assistant)]">
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#00BCD4]" />
                    שם העסק
                  </span>
                  <span className="text-gray-400 font-normal mr-1">(לא חובה)</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="למשל: הסטודיו של דנה"
                  className="w-full px-5 py-3 rounded-xl border-2 border-gray-200 focus:border-[#00BCD4] focus:ring-2 focus:ring-[#00BCD4]/20 outline-none text-lg font-[family-name:var(--font-assistant)] transition-all duration-300"
                  dir="rtl"
                />
              </div>

              {/* Business Type — Custom Dropdown */}
              <div ref={dropdownRef} className="relative">
                <label className="block text-sm font-bold text-gray-700 mb-1 font-[family-name:var(--font-assistant)]">
                  <span className="inline-flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-[#00BCD4]" />
                    תחום העסק
                  </span>
                  <span className="text-gray-400 font-normal mr-1">(לא חובה)</span>
                </label>

                {/* Trigger */}
                <button
                  type="button"
                  onClick={() => setTypeDropdownOpen((prev) => !prev)}
                  className={`w-full flex items-center justify-between gap-3 px-5 py-3 rounded-xl border-2 text-lg font-[family-name:var(--font-assistant)] transition-all duration-300 bg-white cursor-pointer text-right ${
                    typeDropdownOpen
                      ? "border-[#00BCD4] ring-2 ring-[#00BCD4]/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {selectedType ? (
                    <span className="flex items-center gap-2.5 text-[#003D47]">
                      <span className="text-[#00BCD4]">{selectedType.icon}</span>
                      {selectedType.label}
                    </span>
                  ) : (
                    <span className="text-gray-400">בחרו תחום</span>
                  )}
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                      typeDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Panel */}
                <AnimatePresence>
                  {typeDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute z-50 top-full mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden"
                    >
                      <div className="max-h-[260px] overflow-y-auto py-1.5 custom-scrollbar">
                        {/* Clear option */}
                        {businessType && (
                          <button
                            type="button"
                            onClick={() => {
                              setBusinessType("");
                              setTypeDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-right text-sm text-gray-400 hover:bg-gray-50 transition-colors duration-150 cursor-pointer font-[family-name:var(--font-assistant)]"
                          >
                            <span className="w-5 h-5 flex items-center justify-center text-gray-300">✕</span>
                            ניקוי בחירה
                          </button>
                        )}

                        {BUSINESS_TYPES.map((bt) => {
                          const isActive = businessType === bt.value;
                          return (
                            <button
                              key={bt.value}
                              type="button"
                              onClick={() => {
                                setBusinessType(bt.value);
                                setTypeDropdownOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-right transition-all duration-150 cursor-pointer font-[family-name:var(--font-assistant)] ${
                                isActive
                                  ? "bg-[#00BCD4]/8 text-[#003D47] font-semibold"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              <span
                                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 ${
                                  isActive
                                    ? "bg-[#00BCD4]/15 text-[#00BCD4]"
                                    : "bg-gray-100 text-gray-400 group-hover:text-gray-500"
                                }`}
                              >
                                {bt.icon}
                              </span>
                              <span className="text-[15px]">{bt.label}</span>
                              {isActive && (
                                <span className="mr-auto text-[#00BCD4]">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <motion.button
              onClick={handleSubmit}
              disabled={!isValid}
              whileHover={isValid ? { scale: 1.03 } : {}}
              whileTap={isValid ? { scale: 0.97 } : {}}
              className={`w-full py-4 rounded-2xl font-bold text-lg font-[family-name:var(--font-heebo)] transition-all duration-300 cursor-pointer ${
                isValid
                  ? "bg-gradient-to-l from-[#00BCD4] to-[#6B4FA0] text-white shadow-lg hover:shadow-xl"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              גלו את הפרופיל שלכם
            </motion.button>

            <p className="text-xs text-gray-400 mt-4 font-[family-name:var(--font-assistant)]">
              הפרטים שלכם מאובטחים ולא יועברו לצד שלישי
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  // ── LOADING ──
  if (stage === "loading") {
    return (
      <section id="quiz-section" className="relative py-20 sm:py-28 overflow-hidden">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-gray-200 rounded-3xl p-12 shadow-xl"
          >
            <Loader2 className="w-16 h-16 text-[#00BCD4] animate-spin mx-auto mb-6" />
            <h3 className="font-[family-name:var(--font-heebo)] font-bold text-2xl text-[#003D47] mb-2">
              מנתחים את התשובות שלכם...
            </h3>
            <p className="font-[family-name:var(--font-assistant)] text-gray-500">
              עוד רגע קט
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  // ── RESULT ──
  if (stage === "result" && analysis) {
    return (
      <section id="quiz-section" className="relative py-20 sm:py-28 overflow-hidden">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="bg-gradient-to-br from-white to-[#00BCD4]/5 border border-[#00BCD4]/20 rounded-3xl p-8 sm:p-12 shadow-xl"
          >
            {/* Header */}
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="inline-block text-[#6B4FA0] text-sm font-bold tracking-widest mb-2 font-[family-name:var(--font-heebo)]">
                  הפרופיל שלכם
                </span>
                <h3 className="font-[family-name:var(--font-heebo)] font-black text-3xl sm:text-4xl text-[#003D47] mb-2">
                  {analysis.name}
                </h3>
                <p className="font-[family-name:var(--font-assistant)] text-lg text-[#00BCD4] font-semibold mb-6">
                  {analysis.tagline}
                </p>
              </motion.div>
            </div>

            {/* Personality Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-right space-y-5 mb-8"
            >
              {/* About You */}
              <div className="bg-white/80 rounded-2xl p-5 sm:p-6 border border-gray-100">
                <h4 className="font-[family-name:var(--font-heebo)] font-bold text-lg text-[#003D47] mb-2">
                  קצת עליכם
                </h4>
                <p className="font-[family-name:var(--font-assistant)] text-gray-700 leading-relaxed">
                  {analysis.personality}
                </p>
              </div>

              {/* Pain Approach */}
              <div className="bg-white/80 rounded-2xl p-5 sm:p-6 border border-gray-100">
                <h4 className="font-[family-name:var(--font-heebo)] font-bold text-lg text-[#003D47] mb-2">
                  אתגר המכירות שלכם
                </h4>
                <p className="font-[family-name:var(--font-assistant)] text-gray-700 leading-relaxed">
                  {analysis.painApproach}
                </p>
              </div>

              {/* Tip */}
              <div className="bg-gradient-to-l from-[#6B4FA0]/5 to-[#00BCD4]/5 rounded-2xl p-5 sm:p-6 border border-[#6B4FA0]/10">
                <p className="font-[family-name:var(--font-assistant)] text-gray-800 leading-relaxed font-medium">
                  {analysis.tip}
                </p>
              </div>
            </motion.div>

            {/* Nudge — invite to scroll through personalized content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <div className="bg-white rounded-2xl p-5 sm:p-6 mb-6 border border-[#00BCD4]/20">
                <p className="font-[family-name:var(--font-assistant)] text-gray-700 text-lg leading-relaxed">
                  {analysis.nudge}
                </p>
              </div>

              <motion.button
                onClick={() => {
                  document.getElementById("personalized")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 text-[#00BCD4] font-semibold text-lg px-8 py-3 rounded-2xl border-2 border-[#00BCD4]/30 hover:border-[#00BCD4]/60 hover:bg-[#00BCD4]/5 transition-all duration-300 font-[family-name:var(--font-heebo)] cursor-pointer"
              >
                גלו מה הכנו בשבילכם
                <motion.span
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" as const }}
                >
                  ↓
                </motion.span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  return null;
}
