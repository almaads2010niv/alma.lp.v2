"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ChevronDown, ChevronUp } from "lucide-react";
import { getArchetypeContent } from "@/data/archetypeContent";

interface TestimonialsProps {
  archetype?: string | null;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  text: string;
  stars: number;
}

const testimonials: Testimonial[] = [
  {
    name: "ירון סלע",
    company: "רשת גרייט שייפ",
    role: "מנכ\"ל ובעלים",
    text: "It is with great pleasure that I am writing the following paragraphs on behalf of Niv and his work with Great-Shape Health and Fitness clubs. I have been working with Niv for the past 7 years in different capacities. 7 years ago, Niv was the Sales VP for the second largest Country Club in Israel. Within a matter of only a few months, Niv adopted the innovative methods and protocols of our chain, and the sales grew by 25-30%. Working closely with Niv, and seeing his prior knowledge and curiosity regarding Marketing, we decided that Niv and his team would become the Marketing Agency for the Country Club. After 6 months, in which we measured KPIs, the results showed a significant growth both in the number of leads and their quality, that were generated from Social media, at the same budget. We have transferred the account of the whole chain to Niv's Marketing Agency. This act has proven to be one of the most lucrative decisions we have made.",
    stars: 5,
  },
  {
    name: "אלי שוטן",
    company: "B-Cure Laser",
    role: "סמנכ\"ל",
    text: "מהרגע שהתחלנו לעבוד עם \"עלמה?\", הרגשתי שהשיווק של העסק נמצא בידיים הכי טובות שיש. השילוב בין ייעוץ אסטרטגי חכם לבין הבנה עמוקה של השוק נתן לנו את הביטחון לצמוח. מומלץ בחום לכל בעל עסק שמחפש קפיצת מדרגה.",
    stars: 5,
  },
  {
    name: "טל",
    company: "SMOOVEE",
    role: "מנכ\"ל",
    text: "עלמה הוא המשרד פרסום לעסק שלי מהיום הראשון ואנחנו יותר ממרוצים ממנו! השירות מצויין, יצירתיות זה שם המפתח עומד בכל תנאי האופטימיזציה שלנו והכי חשוב תמיד זמין לשגעונות שלנו! ממולץ בחום!",
    stars: 5,
  },
  {
    name: "עוזי",
    company: "קאנטרי נשר",
    role: "מנכ\"ל",
    text: "אנחנו עובדים עם עלמה? בליווי מלא. לא רק פרסום, אלא חשיבה עמוקה על העסק: תסריטי שיחה, תהליכי מכירה והחיבור בין שיווק לשטח. יש תחושה ברורה שיש יד על ההגה.",
    stars: 5,
  },
  {
    name: "אמנון",
    company: "גוסטינו",
    role: "בעלים",
    text: "הליווי של עלמה? הוא מקצה לקצה. מהאסטרטגיה, דרך הפרסום ועד מועדון הלקוחות והתפעול היומיומי. זה מרגיש כמו חלק מהניהול של העסק, לא ספק חיצוני.",
    stars: 5,
  },
  {
    name: "רוני",
    company: "UFC ISRAEL",
    role: "מנהלת שיווק ארצית",
    text: "עבדתי עם ניב בתקופה שבה חיפשנו לא עוד ספק פרסום, אלא מישהו שמבין מערכת: אנשים, מסר, תהליך וקבלת החלטות. מהר מאוד היה ברור שניב לא מגיע \"להרים קמפיין\", אלא לשאול שאלות שלא תמיד נעים לשאול, לחדד כיוונים, ולעזור לנו להבין איפה אנחנו מפזרים אנרגיה ואיפה באמת כדאי להשקיע. העבודה איתו חיברה בין אסטרטגיה, שיווק ותפעול. לא פתרונות קסם, אלא חשיבה מסודרת, הסתכלות רחבה, וירידה לפרטים הקטנים שעושים את ההבדל בשטח. הערך הגדול מבחינתי היה היכולת שלו לראות את התמונה המלאה, ולהפוך רעיונות ותובנות למהלכים פרקטיים שאפשר ליישם. הכל תורגם לתסריטי שיחה ברורים לאנשי המכירות ולקמפיינים ממירים. ממליצה עליו למי שמחפש שותף לחשיבה ולתהליך, לא רק \"עוד משרד פרסום\".",
    stars: 5,
  },
  {
    name: "מאיה",
    company: "אגודת חובבי החתולים בישראל",
    role: "יו\"ר",
    text: "ההיכרות שלנו עם ניב מ\"עלמה?\" היא בת כמה שנים ורק משתבחת עם הזמן. מהרגע הראשון התרשמנו מאיש אמין, מקצועי, רגיש לצרכי הלקוח ומאד מתחשב. תמיד יודע להתאים את הלך המחשבה שלו לזה שלנו ולראות דרכנו במה להתרכז ואיך לקדם אותנו. נגיש בכל עת ובכל מצב ובאמת מעניק שירות איכותי והזדהות מלאה עם המטרה לשמה פנינו אליו. אין עליו, מנסיון...",
    stars: 5,
  },
];

// Character limit before "read more" kicks in
const CHAR_LIMIT = 150;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
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

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1" dir="ltr">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4 fill-[#FBBC04] text-[#FBBC04]"
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = testimonial.text.length > CHAR_LIMIT;
  const displayText = isLong && !expanded
    ? testimonial.text.slice(0, CHAR_LIMIT).trimEnd() + "..."
    : testimonial.text;

  // Detect English text for LTR alignment
  const isEnglish = /^[A-Za-z]/.test(testimonial.text.trim());

  return (
    <motion.div variants={cardVariants} className="group">
      <div className="relative bg-gradient-to-br from-white to-[#FAF8F5] border border-gray-200 rounded-3xl p-7 sm:p-8 h-full flex flex-col overflow-hidden hover:border-[#00BCD4]/30 transition-all duration-500 card-lift">
        {/* Quote icon */}
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#00BCD4]/10 text-[#00BCD4]">
            <Quote className="w-5 h-5" />
          </div>
        </div>

        {/* Stars */}
        <div className="mb-3">
          <StarRating count={testimonial.stars} />
        </div>

        {/* Testimonial Text */}
        <div className="flex-grow mb-5">
          <p
            className={`font-[family-name:var(--font-assistant)] text-sm sm:text-base text-gray-600 leading-relaxed ${
              isEnglish ? "text-left" : ""
            }`}
            dir={isEnglish ? "ltr" : "rtl"}
          >
            &ldquo;{displayText}&rdquo;
          </p>

          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 mt-3 text-[#00BCD4] text-sm font-bold font-[family-name:var(--font-heebo)] hover:text-[#00838F] transition-colors cursor-pointer"
            >
              {expanded ? (
                <>
                  הצג פחות
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  קרא עוד
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="w-10 h-0.5 bg-[#00BCD4]/30 mb-4" />

        {/* Author */}
        <div>
          <p className="font-[family-name:var(--font-heebo)] font-bold text-[#003D47] text-sm">
            {testimonial.name}
          </p>
          <p className="font-[family-name:var(--font-assistant)] text-xs text-gray-400 mt-0.5">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 left-0 w-14 h-14 bg-[#00BCD4]/[0.04] rounded-br-[32px]" />
      </div>
    </motion.div>
  );
}

export default function Testimonials({ archetype }: TestimonialsProps) {
  const content = getArchetypeContent(archetype);
  const sectionContent = content?.testimonials;

  // Reorder first 3 based on archetype, then show all
  const order = sectionContent?.order ?? [0, 1, 2];

  // Build ordered list: first the archetype-preferred ones, then the rest
  const prioritized = new Set(order);
  const rest = testimonials
    .map((_, i) => i)
    .filter((i) => !prioritized.has(i));
  const fullOrder = [...order, ...rest];
  const orderedTestimonials = fullOrder.map((idx) => testimonials[idx]);

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-white" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00BCD4]/[0.03] rounded-full blur-[200px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-[#00BCD4] text-sm font-bold tracking-widest mb-4 font-[family-name:var(--font-heebo)]">
            {sectionContent?.label ?? "מה אומרים עלינו"}
          </span>
          <h2 className="font-[family-name:var(--font-heebo)] font-black text-3xl sm:text-4xl md:text-5xl text-[#003D47]">
            לקוחות <span className="text-gradient-red">מספרים</span>
          </h2>
          {sectionContent?.subtitle && (
            <p className="font-[family-name:var(--font-assistant)] text-lg text-gray-500 mt-4 max-w-2xl mx-auto">
              {sectionContent.subtitle}
            </p>
          )}
        </motion.div>

        {/* Testimonial Cards Grid — 3 columns on desktop, 2 on tablet, 1 on mobile */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {orderedTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name + testimonial.company} testimonial={testimonial} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
