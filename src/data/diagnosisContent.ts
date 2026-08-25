// ─── Business Diagnosis Layer ───────────────────────────────────────────────
// The quiz produces two separate values:
//   diagnosis — WHAT we say: the suspected business gap (shown to the user)
//   archetype — HOW we say it: internal communication tone (never shown)
// This file holds client-side content keyed by diagnosis.
// The quiz-result copy itself lives server-side in /api/quiz/score.

export type Diagnosis =
  | "DEMAND_GAP"
  | "LEAD_HANDLING_GAP"
  | "SALES_CONVERSION_GAP"
  | "POSITIONING_GAP"
  | "SYSTEM_GAP"
  | "UNKNOWN";

export interface DiagnosisBlockContent {
  personalizedBlock: {
    header: string;
    body: string;
  };
  guiltRelease: {
    label: string;
    paragraphs: string[];
  };
  whatsappMessage: string;
}

// Shared "why it persists" explanation — the honest, mature version:
// every vendor sees only their part of the chain.
const sharedGuiltParagraphs = [
  "בעלי עסקים בדרך כלל מטפלים בכל חלק בנפרד: קמפיינים אצל משרד אחד, CRM אצל ספק אחר, אנשי מכירות לבד, תוכן אצל מישהו שלישי.",
  "כל רכיב כזה יכול להיות טוב בפני עצמו. אבל אף אחד מהם לא אחראי על השרשרת כולה — ולכן הגיוני שהבעיה נשארת, גם כשכולם עושים את העבודה שלהם.",
];

const diagnosisContent: Record<Diagnosis, DiagnosisBlockContent> = {
  DEMAND_GAP: {
    personalizedBlock: {
      header: "אז למה הפער הזה לא נסגר מעצמו?",
      body: "כשחסר ביקוש איכותי, הפיתוי הוא לקנות עוד חשיפה. אבל בלי לבדוק קודם את הקהל, המסר וההצעה — עוד תקציב בעיקר מגביר את הרעש. בהמשך הדף: איך ניגשים לבדיקה הזו לפי הסדר.",
    },
    guiltRelease: {
      label: "למה זה קורה כמעט לכולם",
      paragraphs: [
        ...sharedGuiltParagraphs,
        "כשחסר ביקוש, כל ספק מציע את הפתרון שהוא מוכר: עוד קמפיין, עוד תוכן, עוד ערוץ. השאלה 'למה שיבחרו דווקא בכם' נשארת בלי בעל בית.",
      ],
    },
    whatsappMessage:
      "היי ניב, עשיתי את האבחון בדף. נראה שהפער אצלי הוא בכמות או באיכות של הלידים. אשמח לשיחת אבחון.",
  },

  LEAD_HANDLING_GAP: {
    personalizedBlock: {
      header: "אז למה הפער הזה לא נסגר מעצמו?",
      body: "מה שקורה בין הפנייה לשיחה לא מופיע באף דוח קמפיין — ולכן אף ספק חיצוני לא רואה אותו. זה בדיוק סוג הפער שנשאר שנים בלי טיפול, למרות שהוא לרוב הזול ביותר לתיקון.",
    },
    guiltRelease: {
      label: "למה זה קורה כמעט לכולם",
      paragraphs: [
        ...sharedGuiltParagraphs,
        "מי שמנהל את הקמפיינים נמדד על לידים שנכנסו. מה שקורה איתם אחר כך — זמני חזרה, תסריט, מעקב — נופל בין הכיסאות, כי הוא לא שייך לאף אחד.",
      ],
    },
    whatsappMessage:
      "היי ניב, עשיתי את האבחון בדף. נראה שאני מאבד הזדמנויות אחרי שהליד כבר נכנס. אשמח לבדוק את זה בשיחת אבחון.",
  },

  SALES_CONVERSION_GAP: {
    personalizedBlock: {
      header: "אז למה הפער הזה לא נסגר מעצמו?",
      body: "כשהפער הוא בין שיחות לסגירות, עוד לידים רק מגדילים את העומס על אותה נקודה. שיחת המכירה וההצעה הן החלק שהכי פחות נבדק בעסקים — כי אין מי שמסתכל עליהן מבחוץ.",
    },
    guiltRelease: {
      label: "למה זה קורה כמעט לכולם",
      paragraphs: [
        ...sharedGuiltParagraphs,
        "שיחת המכירה היא החלק הכי פחות שקוף בשרשרת: אף ספק שיווק לא שומע אותה, ואף דוח לא מראה מה נאמר בה. ולכן דווקא שם הבעיות מחזיקות הכי הרבה זמן.",
      ],
    },
    whatsappMessage:
      "היי ניב, עשיתי את האבחון בדף. נראה שהפער אצלי הוא בין שיחות לבין סגירות. אשמח לשיחת אבחון.",
  },

  POSITIONING_GAP: {
    personalizedBlock: {
      header: "אז למה הפער הזה לא נסגר מעצמו?",
      body: "מיצוב הוא לא עוד קמפיין — הוא ההחלטה מה אומרים ולמי, לפני כל קמפיין. כשהוא לא חד, כל השאר עובד קשה מדי: הפרסום, המבצעים, אנשי המכירות. בהמשך הדף: איך בודקים את זה בפועל.",
    },
    guiltRelease: {
      label: "למה זה קורה כמעט לכולם",
      paragraphs: [
        ...sharedGuiltParagraphs,
        "מיצוב והצעה הם באחריות של אף אחד: המשרד מפרסם את מה שיש, אנשי המכירות מוכרים את מה שאפשר, וההחלטה למה לבחור דווקא בכם נשארת פתוחה.",
      ],
    },
    whatsappMessage:
      "היי ניב, עשיתי את האבחון בדף. נראה שהשאלה אצלי היא במיצוב ובמסר. אשמח לשיחת אבחון.",
  },

  SYSTEM_GAP: {
    personalizedBlock: {
      header: "אז למה הפער הזה לא נסגר מעצמו?",
      body: "כשכל חלק חי לבד, שיפור נקודתי באחד מהם כמעט לא מזיז את התוצאה הכוללת. מה שחסר הוא לא עוד פעילות — אלא חיבור: מסר אחד, מסלול אחד לליד, ומדידה אחת מקצה לקצה.",
    },
    guiltRelease: {
      label: "למה זה קורה כמעט לכולם",
      paragraphs: [
        ...sharedGuiltParagraphs,
        "וזו בדיוק הנקודה: כשכל אחד אחראי על החלק שלו, אין אף אחד שאחראי על החיבור. לא בגלל רשלנות — ככה השוק בנוי.",
      ],
    },
    whatsappMessage:
      "היי ניב, עשיתי את האבחון בדף. נראה שהחלקים אצלי לא מתחברים למערכת אחת. אשמח לשיחת אבחון.",
  },

  UNKNOWN: {
    personalizedBlock: {
      header: "אז מה עושים כשלא ברור איפה הפער?",
      body: "לא מנחשים. ממפים את המסלול מליד ועד עסקה, בודקים איפה יש נתונים ואיפה יש חורים, ורק אז מחליטים במה לגעת. זה כל הרעיון של מנגנון לפני פרסום.",
    },
    guiltRelease: {
      label: "למה זה קורה כמעט לכולם",
      paragraphs: [
        ...sharedGuiltParagraphs,
        "כשאין תמונה אחת של השרשרת, גם קשה לדעת איפה היא נשברת. זה לא חוסר ידע — זה מבנה: אף ספק לא רואה את הכול.",
      ],
    },
    whatsappMessage:
      "היי ניב, עשיתי את האבחון בדף. עדיין לא ברור לי איפה בדיוק הפער — ובגלל זה בדיוק אשמח לשיחת אבחון.",
  },
};

export function getDiagnosisContent(
  diagnosis: string | null | undefined
): DiagnosisBlockContent | null {
  if (!diagnosis) return null;
  return diagnosisContent[diagnosis as Diagnosis] ?? null;
}

export default diagnosisContent;
