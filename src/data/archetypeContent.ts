// ─── Communication Tone Layer (internal) ────────────────────────────────────
// The archetype is an INTERNAL personalization signal: it decides HOW we
// phrase things — testimonial ordering, CTA wording, objection framing.
// It is never shown to the user, and it never changes WHAT we offer.
// The business content itself is keyed by diagnosis (see diagnosisContent.ts).
//
// Trust rule for this file: no invented numbers, no invented services
// (no "community", no "support groups"), no guarantees.

export type Archetype = "WINNER" | "STAR" | "DREAMER" | "HEART" | "ANCHOR";

export interface ArchetypeBlockContent {
  testimonials: {
    label?: string;
    subtitle: string;
    order: number[];
  };
  riskReversal: {
    header: string;
    body: string;
  };
  checkoutForm: {
    subtitle: string;
    header: string;
    ctaText: string;
  };
}

const archetypeContent: Record<Archetype, ArchetypeBlockContent> = {
  // WINNER — analytical, results-first register
  WINNER: {
    testimonials: {
      subtitle: "לקוחות שמדברים על תהליך, מדידה ותוצאה, במילים שלהם.",
      order: [0, 5, 3],
    },
    riskReversal: {
      header: "המטרה של השיחה הראשונה היא לא למכור",
      body:
        "היא להבין אם יש פער שאנחנו יודעים לסגור. מסתכלים יחד על המסלול מהפנייה ועד העסקה, " +
        "מסמנים את הנקודות החשודות, ואומרים ביושר אם יש כאן עבודה בשבילנו, או שלא.",
    },
    checkoutForm: {
      subtitle: "הצעד הבא",
      header: "שיחת אבחון: מסתכלים יחד על המספרים",
      ctaText: "אני רוצה להבין איפה זה נתקע",
    },
  },

  // STAR — social-proof-first register
  STAR: {
    testimonials: {
      subtitle: "בעלי עסקים שהיו באותה נקודה מספרים איך זה נראה מבפנים.",
      order: [2, 3, 6],
    },
    riskReversal: {
      header: "המטרה של השיחה הראשונה היא לא למכור",
      body:
        "היא להבין אם יש פער שאנחנו יודעים לפתור. ההמלצות בדף הזה הן של לקוחות אמיתיים, " +
        "ומה שתשמעו בשיחה יהיה באותה רמת כנות.",
    },
    checkoutForm: {
      subtitle: "הצעד הבא",
      header: "שיחת אבחון, כמו שהתחילו הלקוחות שקראתם עליהם כאן",
      ctaText: "אני רוצה שיחת אבחון",
    },
  },

  // DREAMER — different-angle, thinking-first register
  DREAMER: {
    testimonials: {
      subtitle: "לקוחות שחיפשו שותף לחשיבה, לא עוד ספק ביצוע.",
      order: [5, 1, 4],
    },
    riskReversal: {
      header: "המטרה של השיחה הראשונה היא לא למכור",
      body:
        "היא להבין את העסק שלכם לפני שממליצים על משהו. לא נגיע עם פתרון מוכן מהמדף. " +
        "נגיע עם שאלות. ואם נחשוב שאנחנו לא הכתובת, נגיד את זה.",
    },
    checkoutForm: {
      subtitle: "הצעד הבא",
      header: "שיחת אבחון: מבט אחר על העסק",
      ctaText: "אני רוצה מבט אחר על העסק",
    },
  },

  // HEART — personal, listening-first register
  HEART: {
    testimonials: {
      subtitle: "אנשים שמצאו מישהו שמקשיב קודם ומציע אחר כך.",
      order: [6, 4, 3],
    },
    riskReversal: {
      header: "המטרה של השיחה הראשונה היא לא למכור",
      body:
        "היא שיחה בגובה העיניים על מה שקורה אצלכם באמת. בלי לחץ ובלי תסריט מכירה. " +
        "ואם נרגיש שאנחנו לא הכתובת, נגיד את זה בכנות.",
    },
    checkoutForm: {
      subtitle: "הצעד הבא",
      header: "שיחה כנה על העסק, בלי לחץ",
      ctaText: "בואו נדבר על העסק שלי",
    },
  },

  // ANCHOR — methodical, step-by-step register
  ANCHOR: {
    testimonials: {
      subtitle: "לקוחות שמדברים על תהליך מסודר ועבודה לאורך זמן.",
      order: [0, 5, 3],
    },
    riskReversal: {
      header: "המטרה של השיחה הראשונה היא לא למכור",
      body:
        "היא לבדוק, לפי הסדר, אם יש פער שאנחנו יודעים לפתור. בסוף השיחה תדעו מה נבדק, " +
        "מה נמצא, ומה הצעד הבא, גם אם הוא לא איתנו.",
    },
    checkoutForm: {
      subtitle: "הצעד הבא",
      header: "שיחת אבחון מסודרת, צעד אחר צעד",
      ctaText: "אני רוצה אבחון מסודר",
    },
  },
};

// ─── Helper ─────────────────────────────────────────────────────────────────
export function getArchetypeContent(
  archetype: string | null | undefined
): ArchetypeBlockContent | null {
  if (!archetype) return null;
  return archetypeContent[archetype as Archetype] ?? null;
}

export default archetypeContent;
