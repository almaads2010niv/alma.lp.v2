"use client";

import { useState, useCallback, useRef, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ChevronLeft, ChevronDown, Loader2, Building2, ClipboardList,
  UtensilsCrossed, Scissors, ShoppingBag, Dumbbell, Briefcase,
  GraduationCap, Home, Monitor, Hammer, Car, MoreHorizontal, Tag,
} from "lucide-react";
import { generateEventId, getFbc, getVisitorId, trackQuizStart, trackQuizComplete, trackQualifiedLead } from "@/lib/analytics";
import { notifyLeadEmailFromBrowser } from "@/lib/leadNotify";
import type { UTMData } from "@/lib/utm";

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
// Business Diagnosis Quiz — 7 Questions x 5 Options
// ============================================
// Questions displayed client-side (visible on screen anyway).
// Scoring (diagnosis + internal tone archetype) and result copy
// are ALL server-side in /api/quiz/score — never in the bundle.
// Flow: current state → lead handling → where it leaks →
// past attempts → what was missing → dream state → main concern.

interface QuizQuestion {
  id: number;
  question: string;
  options: { id: string; text: string }[];
}

interface AnalysisData {
  headline: string;
  tagline: string;
  summary: string;
  firstCheck: string;
  caveat: string;
  nudge: string;
}

interface QuizResult {
  primary: string;
  secondary: string;
  diagnosis: string;
  businessName?: string;
  businessType?: string;
  quizName?: string;
  quizPhone?: string;
}

interface Props {
  onResult: (result: QuizResult) => void;
  /** Captured UTM params — forwarded so quiz leads keep campaign attribution */
  utm?: UTMData;
}

// Qualification dropdowns (values are internal codes; labels are shown).
// The qualification criteria themselves live server-side in quiz/score.
const BUDGET_OPTIONS = [
  { value: "NONE", label: "אין השקעה קבועה" },
  { value: "UNDER_5K", label: "עד 5,000 ₪ בחודש" },
  { value: "FROM_5_TO_15K", label: "5,000-15,000 ₪ בחודש" },
  { value: "FROM_15_TO_50K", label: "15,000-50,000 ₪ בחודש" },
  { value: "OVER_50K", label: "מעל 50,000 ₪ בחודש" },
];

const ROLE_OPTIONS = [
  { value: "OWNER", label: "בעלים / מנכ\"ל" },
  { value: "PARTNER", label: "שותף/ה בעסק" },
  { value: "MARKETING_MANAGER", label: "מנהל/ת שיווק" },
  { value: "EMPLOYEE", label: "עובד/ת בעסק" },
  { value: "OTHER", label: "אחר" },
];

// ── Questions only — NO scoring logic in the client ──
const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "מה גרם לכם לעצור דווקא כאן?",
    options: [
      { id: "א", text: "נכנסות פניות, אבל לא מספיק מהן הופכות לעסקאות" },
      { id: "ב", text: "אין מספיק פניות חדשות" },
      { id: "ג", text: "העסק חי ממבצע למבצע, בלי מבצע אין תנועה" },
      { id: "ד", text: "השיווק לא יציב: חודש טוב, חודש חלש" },
      { id: "ה", text: "משהו לא עובד, ואני לא מצליח/ה לשים עליו את האצבע" },
    ],
  },
  {
    id: 2,
    question: "מה קורה היום מהרגע שנכנסת פנייה חדשה?",
    options: [
      { id: "א", text: "חוזרים מהר, ויש תהליך מסודר" },
      { id: "ב", text: "חוזרים, אבל בלי תסריט קבוע. כל שיחה נראית אחרת" },
      { id: "ג", text: "כל איש מכירות עובד בשיטה של עצמו" },
      { id: "ד", text: "לפעמים חוזרים מאוחר מדי" },
      { id: "ה", text: "האמת? אין לי מושג מה בדיוק קורה שם" },
    ],
  },
  {
    id: 3,
    question: "איפה לתחושתכם הולכות לאיבוד הכי הרבה הזדמנויות?",
    options: [
      { id: "א", text: "עוד לפני שחזרנו אליהם, כשההתעניינות עוד חמה" },
      { id: "ב", text: "בשיחת המכירה עצמה" },
      { id: "ג", text: "אחרי שההצעה נשלחה נהיה שקט" },
      { id: "ד", text: "אין מעקב מסודר אחרי מי שלא סגר" },
      { id: "ה", text: "קשה לי להצביע על שלב מסוים" },
    ],
  },
  {
    id: 4,
    question: "מה כבר ניסיתם עד היום?",
    options: [
      { id: "א", text: "משרד פרסום (אחד או יותר)" },
      { id: "ב", text: "איש/אשת שיווק בתוך העסק" },
      { id: "ג", text: "פרילנסרים וספקים לפי הצורך" },
      { id: "ד", text: "כלים: אוטומציות, CRM, קורסים" },
      { id: "ה", text: "הרבה דברים, בלי מערכת אחת שמחברת ביניהם" },
    ],
  },
  {
    id: 5,
    question: "מה הכי היה חסר במה שניסיתם?",
    options: [
      { id: "א", text: "פשוט יותר פניות" },
      { id: "ב", text: "פניות רלוונטיות יותר" },
      { id: "ג", text: "תהליך מכירה טוב יותר" },
      { id: "ד", text: "חשיבה עסקית רחבה, לא רק ביצוע" },
      { id: "ה", text: "מישהו שמחבר את כל החלקים" },
    ],
  },
  {
    id: 6,
    question: "אם בעוד שנה הדברים עובדים כמו שצריך, מה השתנה?",
    options: [
      { id: "א", text: "יותר הכנסות, עם תמונה ברורה של החזר על כל שקל" },
      { id: "ב", text: "יציבות: הכנסה צפויה, בלי רכבת הרים" },
      { id: "ג", text: "אחוז סגירה גבוה יותר מאותן פניות" },
      { id: "ד", text: "העסק תלוי בי הרבה פחות" },
      { id: "ה", text: "סוף־סוף ברור לי מה עובד ומה לא" },
    ],
  },
  {
    id: 7,
    question: "מה הכי מדאיג אתכם בעבודה עם גורם חיצוני?",
    options: [
      { id: "א", text: "שזה יהיה עוד ספק שמסתכל רק על פרסום" },
      { id: "ב", text: "הרבה דיבורים, מעט תוצאות" },
      { id: "ג", text: "שלא באמת יבינו את העסק שלי" },
      { id: "ד", text: "שאאבד שליטה על מה שקורה אצלי" },
      { id: "ה", text: "שאשלם ולא אדע מה קיבלתי בתמורה" },
    ],
  },
];

export default function AdaptiveQuiz({ onResult, utm }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{ question_id: number; option_id: string }[]>([]);
  const [stage, setStage] = useState<"idle" | "intro" | "quiz" | "details" | "loading" | "result">("idle");
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [marketingBudget, setMarketingBudget] = useState("");
  const [role, setRole] = useState("");
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
    if (!name.trim() || !phone.trim() || !marketingBudget || !role) return;

    setStage("loading");
    setError(null);

    // Dedup IDs shared between browser pixel and server CAPI
    const eventId = generateEventId();
    const qualifiedEventId = generateEventId();

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
          marketingBudget,
          role,
          eventId,
          qualifiedEventId,
          visitorId: getVisitorId(),
          fbc: getFbc(),
          ...(utm && Object.keys(utm).length > 0 ? { utm } : {}),
        }),
      });

      if (!res.ok) {
        setError("אירעה שגיאה. נסו שוב.");
        setStage("details");
        return;
      }

      const data = await res.json();

      if (data.diagnosis && data.result) {
        setAnalysis({
          headline: data.result.headline,
          tagline: data.result.tagline,
          summary: data.result.summary,
          firstCheck: data.result.firstCheck,
          caveat: data.result.caveat,
          nudge: data.result.nudge,
        });
        setStage("result");

        // Fire FB Pixel events — CompleteRegistration always (deduped vs
        // server), QualifiedLead only when the server says the lead passed
        // the qualification criteria (the event Meta should optimize on)
        trackQuizComplete(data.primary, businessType, eventId);
        if (data.qualified) {
          trackQualifiedLead(qualifiedEventId);
        }

        // Email notification to Niv — browser-side only (Web3Forms free plan)
        notifyLeadEmailFromBrowser({
          name: `${name.trim()} (מילא אבחון${data.qualified ? " - מתאים" : ""})`,
          phone: phone.trim(),
          leadType: data.qualified ? "מילא אבחון - מתאים" : "מילא אבחון",
        });

        // Notify parent: diagnosis (what we say) + archetype (how we say it)
        onResult({
          primary: data.primary,
          secondary: data.secondary || "",
          diagnosis: data.diagnosis,
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
  }, [name, phone, businessName, businessType, marketingBudget, role, utm, selectedOptions, onResult]);

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
              אבחון עסקי קצר
            </span>
            <h2 className="font-[family-name:var(--font-heebo)] font-black text-3xl sm:text-4xl md:text-5xl text-[#003D47] mb-6">
              איפה העסק שלכם מאבד הזדמנויות?
            </h2>
            <p className="font-[family-name:var(--font-assistant)] text-lg text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
              7 שאלות קצרות על מה שקורה היום בעסק, מהרגע שמישהו פונה ועד הסגירה. אין תשובות נכונות ואין ציון.
            </p>
            <p className="font-[family-name:var(--font-assistant)] text-base text-[#6B4FA0] font-semibold mb-10 max-w-2xl mx-auto">
              בסוף תקבלו תמונת מצב ראשונית: איפה כנראה נמצא הפער, ומה שווה לבדוק קודם
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
              בכל שאלה יופיעו 5 אפשרויות. בחרו את זו שהכי מרגישה לכם נכונה.
            </p>
            <p className="font-[family-name:var(--font-assistant)] text-gray-600 text-lg mb-8">
              אין תשובות נכונות או לא נכונות, רק מה שמתאים לכם.
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
    const isValid =
      name.trim().length >= 2 &&
      phoneRegex.test(phone.replace(/[-\s]/g, "")) &&
      marketingBudget !== "" &&
      role !== "";

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
              סיימתם. עוד רגע התוצאה
            </h3>
            <p className="font-[family-name:var(--font-assistant)] text-gray-600 mb-8">
              השאירו פרטים כדי לקבל את תמונת המצב הראשונית שלכם
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

              {/* Marketing budget — qualification */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 font-[family-name:var(--font-assistant)]">
                  כמה אתם משקיעים היום בשיווק? <span className="text-red-400">*</span>
                </label>
                <select
                  value={marketingBudget}
                  onChange={(e) => setMarketingBudget(e.target.value)}
                  className={`w-full px-5 py-3 rounded-xl border-2 border-gray-200 focus:border-[#00BCD4] focus:ring-2 focus:ring-[#00BCD4]/20 outline-none text-lg font-[family-name:var(--font-assistant)] transition-all duration-300 bg-white cursor-pointer ${marketingBudget ? "text-[#003D47]" : "text-gray-400"}`}
                  dir="rtl"
                >
                  <option value="" disabled>בחרו טווח</option>
                  {BUDGET_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="text-[#003D47]">{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Role — qualification */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 font-[family-name:var(--font-assistant)]">
                  מה התפקיד שלך בעסק? <span className="text-red-400">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`w-full px-5 py-3 rounded-xl border-2 border-gray-200 focus:border-[#00BCD4] focus:ring-2 focus:ring-[#00BCD4]/20 outline-none text-lg font-[family-name:var(--font-assistant)] transition-all duration-300 bg-white cursor-pointer ${role ? "text-[#003D47]" : "text-gray-400"}`}
                  dir="rtl"
                >
                  <option value="" disabled>בחרו תפקיד</option>
                  {ROLE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="text-[#003D47]">{o.label}</option>
                  ))}
                </select>
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
              קבלו את תמונת המצב
            </motion.button>

            <p className="text-xs text-gray-500 mt-4 font-[family-name:var(--font-assistant)]">
              הפרטים ישמשו ליצירת קשר ולהצגת התוצאה, בהתאם למדיניות הפרטיות
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
                  תמונת מצב ראשונית
                </span>
                <h3 className="font-[family-name:var(--font-heebo)] font-black text-2xl sm:text-3xl text-[#003D47] mb-2 leading-snug">
                  {analysis.headline}
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
              {/* What the answers suggest */}
              <div className="bg-white/80 rounded-2xl p-5 sm:p-6 border border-gray-100">
                <h4 className="font-[family-name:var(--font-heebo)] font-bold text-lg text-[#003D47] mb-2">
                  מה עולה מהתשובות שלכם
                </h4>
                <p className="font-[family-name:var(--font-assistant)] text-gray-700 leading-relaxed">
                  {analysis.summary}
                </p>
              </div>

              {/* First thing to check */}
              <div className="bg-white/80 rounded-2xl p-5 sm:p-6 border border-gray-100">
                <h4 className="font-[family-name:var(--font-heebo)] font-bold text-lg text-[#003D47] mb-2">
                  מה היינו בודקים קודם
                </h4>
                <p className="font-[family-name:var(--font-assistant)] text-gray-700 leading-relaxed">
                  {analysis.firstCheck}
                </p>
              </div>

              {/* Honest caveat */}
              <div className="bg-gradient-to-l from-[#6B4FA0]/5 to-[#00BCD4]/5 rounded-2xl p-5 sm:p-6 border border-[#6B4FA0]/10">
                <p className="font-[family-name:var(--font-assistant)] text-gray-800 leading-relaxed font-medium">
                  {analysis.caveat}
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
                אז מה עושים עם זה?
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
