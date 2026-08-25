// ─── Business Diagnosis Layer ───────────────────────────────────────────────
// The quiz produces two separate values:
//   diagnosis — WHAT we say: the suspected business gap (shown to the user)
//   archetype — HOW we say it: internal communication tone (never shown)
// This file holds client-side content keyed by diagnosis.
// The quiz-result copy itself lives server-side in /api/quiz/score.
//
// Copy rules: hedged claims only (no sweeping "אף אחד"/"תמיד" statements),
// no em dashes in user-visible text, human professional Hebrew.

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

// Shared "why it persists" explanation. Mature framing, no victim language,
// no absolute claims about what "no vendor ever" does.
const sharedGuiltParagraphs = [
  "בעלי עסקים בדרך כלל מטפלים בכל חלק בנפרד: קמפיינים אצל משרד אחד, CRM אצל ספק אחר, אנשי מכירות לבד, תוכן אצל מישהו שלישי.",
  "כל אחד מהגורמים האלה יכול לעשות עבודה טובה. אבל ברוב המקרים אין גורם אחד שרואה את התמונה המלאה, ולכן הגיוני שהבעיה נשארת גם כשכולם עושים את שלהם.",
];

const diagnosisContent: Record<Diagnosis, DiagnosisBlockContent> = {
  DEMAND_GAP: {
    personalizedBlock: {
      header: "אז למה הפער הזה לא נסגר מעצמו?",
      body: "כשחסר ביקוש איכותי, הפיתוי הוא לקנות עוד חשיפה. אבל בלי לבדוק קודם את הקהל, המסר וההצעה, תקציב נוסף בעיקר מגביר את הרעש. בהמשך הדף נראה איך ניגשים לבדיקה כזו לפי הסדר.",
    },
    guiltRelease: {
      label: "למה זה קורה כמעט לכולם",
      paragraphs: [
        ...sharedGuiltParagraphs,
        "כשחסר ביקוש, כל ספק מציע את הפתרון שהוא מוכר: עוד קמפיין, עוד תוכן, עוד ערוץ. והשאלה למה שלקוח יבחר דווקא בכם נשארת פתוחה.",
      ],
    },
    whatsappMessage:
      "היי, עשיתי את האבחון בדף של עלמה? נראה שהפער אצלי הוא בכמות או באיכות של הפניות. אשמח לשיחת אבחון.",
  },

  LEAD_HANDLING_GAP: {
    personalizedBlock: {
      header: "אז למה הפער הזה לא נסגר מעצמו?",
      body: "מה שקורה בין הפנייה לשיחה בדרך כלל לא מופיע בדוחות הקמפיין, ולכן קל לפספס אותו כשמסתכלים רק על נתוני הפרסום. ככה פער כזה יכול להישאר הרבה זמן בלי טיפול.",
    },
    guiltRelease: {
      label: "למה זה קורה כמעט לכולם",
      paragraphs: [
        ...sharedGuiltParagraphs,
        "מי שמנהל את הקמפיינים נמדד על כמות הפניות שנכנסו. מה שקורה איתם אחר כך, כמו זמני חזרה, תסריט ומעקב, נופל לא פעם בין הכיסאות.",
      ],
    },
    whatsappMessage:
      "היי, עשיתי את האבחון בדף של עלמה? נראה שאני מאבד הזדמנויות אחרי שהפנייה כבר נכנסת. אשמח לבדוק את זה בשיחת אבחון.",
  },

  SALES_CONVERSION_GAP: {
    personalizedBlock: {
      header: "אז למה הפער הזה לא נסגר מעצמו?",
      body: "כשהפער הוא בין שיחות לסגירות, עוד פניות בעיקר מגדילות את העומס על אותה נקודה. שיחת המכירה וההצעה הן מהחלקים שהכי פחות זוכים למבט חיצוני בעסק, ולכן דווקא שם בעיות מחזיקות מעמד הרבה זמן.",
    },
    guiltRelease: {
      label: "למה זה קורה כמעט לכולם",
      paragraphs: [
        ...sharedGuiltParagraphs,
        "שיחת המכירה היא החלק הכי פחות שקוף במסלול: לא מעט פעמים מי שמנהל את הפרסום בכלל לא נחשף לשיחות עצמן, ודוחות קמפיין לא מראים מה נאמר בהן.",
      ],
    },
    whatsappMessage:
      "היי, עשיתי את האבחון בדף של עלמה? נראה שהפער אצלי הוא בין שיחות לבין סגירות. אשמח לשיחת אבחון.",
  },

  POSITIONING_GAP: {
    personalizedBlock: {
      header: "אז למה הפער הזה לא נסגר מעצמו?",
      body: "מיצוב הוא לא עוד קמפיין. הוא ההחלטה מה אומרים ולמי, עוד לפני הקמפיין. כשהוא לא חד, כל השאר עובד קשה מדי: הפרסום, המבצעים ואנשי המכירות. בהמשך הדף נראה איך בודקים את זה בפועל.",
    },
    guiltRelease: {
      label: "למה זה קורה כמעט לכולם",
      paragraphs: [
        ...sharedGuiltParagraphs,
        "מיצוב והצעה נשארים הרבה פעמים בלי בעל בית: המשרד מפרסם את מה שיש, אנשי המכירות מוכרים את מה שאפשר, והשאלה למה לבחור דווקא בכם נשארת פתוחה.",
      ],
    },
    whatsappMessage:
      "היי, עשיתי את האבחון בדף של עלמה? נראה שהשאלה אצלי היא במיצוב ובמסר. אשמח לשיחת אבחון.",
  },

  SYSTEM_GAP: {
    personalizedBlock: {
      header: "אז למה הפער הזה לא נסגר מעצמו?",
      body: "כשכל חלק חי לבד, שיפור נקודתי באחד מהם כמעט לא מזיז את התוצאה הכוללת. מה שחסר הוא בדרך כלל לא עוד פעילות אלא חיבור: מסר אחד, מסלול ברור לכל פנייה, ומדידה אחת מקצה לקצה.",
    },
    guiltRelease: {
      label: "למה זה קורה כמעט לכולם",
      paragraphs: [
        ...sharedGuiltParagraphs,
        "כשכל גורם אחראי על החלק שלו, החיבור בין החלקים נשאר הרבה פעמים בלי אחראי. לא בגלל רשלנות. ככה השוק בנוי.",
      ],
    },
    whatsappMessage:
      "היי, עשיתי את האבחון בדף של עלמה? נראה שהחלקים אצלי לא מתחברים למערכת אחת. אשמח לשיחת אבחון.",
  },

  UNKNOWN: {
    personalizedBlock: {
      header: "אז מה עושים כשלא ברור איפה הפער?",
      body: "לא מנחשים. ממפים את המסלול מהפנייה ועד העסקה, בודקים איפה יש נתונים ואיפה יש חורים, ורק אז מחליטים במה לגעת. זה הרעיון שמאחורי מנגנון לפני פרסום.",
    },
    guiltRelease: {
      label: "למה זה קורה כמעט לכולם",
      paragraphs: [
        ...sharedGuiltParagraphs,
        "כשאין תמונה אחת של כל המסלול, קשה לדעת איפה הוא נשבר. זה לא חוסר ידע של בעל העסק. זה פשוט מבנה העבודה הנפוץ, שבו כל גורם רואה רק חלק.",
      ],
    },
    whatsappMessage:
      "היי, עשיתי את האבחון בדף של עלמה? ועדיין לא ברור לי איפה הפער. בדיוק בשביל זה אשמח לשיחת אבחון.",
  },
};

export function getDiagnosisContent(
  diagnosis: string | null | undefined
): DiagnosisBlockContent | null {
  if (!diagnosis) return null;
  return diagnosisContent[diagnosis as Diagnosis] ?? null;
}

export default diagnosisContent;
