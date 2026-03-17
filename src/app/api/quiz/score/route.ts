import { NextRequest, NextResponse } from "next/server";
import { fireCAPIEvent } from "@/lib/capi";

// ─── Types ──────────────────────────────────────────────────────────────────
type Archetype = "WINNER" | "STAR" | "DREAMER" | "HEART" | "ANCHOR";

interface QuizAnswer {
  question_id: number;
  option_id: string;
}

interface ScoreRequest {
  answers: QuizAnswer[];
  name?: string;
  phone?: string;
  businessName?: string;
  businessType?: string;
}

interface PersonalityProfile {
  label: string;
  tagline: string;
  personality: string;
  painApproach: string;
  tip: string;
  nudge: string;
}

// ─── Answer Mapping (server-side only, hidden from client) ──────────────────
const ANSWER_MAP: Record<number, Record<string, Archetype>> = {
  1: { "א": "WINNER", "ב": "STAR", "ג": "DREAMER", "ד": "HEART", "ה": "ANCHOR" },
  2: { "א": "WINNER", "ב": "STAR", "ג": "DREAMER", "ד": "HEART", "ה": "ANCHOR" },
  3: { "א": "WINNER", "ב": "STAR", "ג": "DREAMER", "ד": "HEART", "ה": "ANCHOR" },
  4: { "א": "WINNER", "ב": "STAR", "ג": "DREAMER", "ד": "HEART", "ה": "ANCHOR" },
  5: { "א": "WINNER", "ב": "STAR", "ג": "DREAMER", "ד": "HEART", "ה": "ANCHOR" },
  6: { "א": "WINNER", "ב": "STAR", "ג": "DREAMER", "ד": "HEART", "ה": "ANCHOR" },
  7: { "א": "WINNER", "ב": "STAR", "ג": "DREAMER", "ד": "HEART", "ה": "ANCHOR" },
};

// ─── Personality Analysis Data (server-side only) ───────────────────────────
const PERSONALITY_PROFILES: Record<Archetype, PersonalityProfile> = {
  WINNER: {
    label: "ממוקד/ת תוצאות",
    tagline: "כשאת/ה מחליט/ה — דברים זזים",
    personality:
      "את/ה אדם של תוצאות. כשאת/ה נכנס/ת לפגישה, את/ה כבר יודע/ת מה את/ה רוצה להשיג. " +
      "ההחלטות שלך מבוססות על נתונים, על ROI ברור, ועל יעילות מקסימלית. " +
      "את/ה לא סובל/ת בזבוז זמן ולא מוכן/ה לשלם על משהו שלא ניתן למדוד. " +
      "הגישה הזו היא הכוח הגדול שלך — היא מה שמניע את העסק שלך קדימה.",
    painApproach:
      "את/ה מכיר/ה את התסכול: משקיעים תקציב בפרסום, מקבלים דוחות יפים, " +
      "אבל השורה התחתונה לא זזה. כסף נשפך בלי שקיפות אמיתית על מה עובד ומה לא. " +
      "זה לא חייב להיות ככה — וזה בדיוק מה שאפשר לתקן.",
    tip:
      "הגדירו KPIs ברורים לפני כל קמפיין. אם אי אפשר למדוד את זה — אל תשקיעו בזה. " +
      "תוצאה אמיתית נמדדת בלידים איכותיים ובעלות לסגירה, לא בחשיפות.",
    nudge:
      "בעלמה? אנחנו עובדים בדיוק ככה — עם מספרים על השולחן, מדידה בזמן אמת, " +
      "ומנגנון שבנוי לייצר תוצאות. לא יופי, לא רעש — תוצאות.",
  },
  STAR: {
    label: "מוּנע/ת חברתית",
    tagline: "ההצלחה שלך נמדדת בהמלצות",
    personality:
      "את/ה אדם שהכוח שלו בקשרים. את/ה יודע/ת שעסק חזק נבנה על המלצות, על קהילה, " +
      "ועל אמון אמיתי. כשלקוח מרוצה מספר עליך לחבר — זה שווה יותר מכל קמפיין. " +
      "את/ה מרגיש/ה הכי טוב כשאת/ה רואה שאנשים אחרים מאמינים בך ובשירות שלך. " +
      "היכולת הזו לבנות קהילה סביבך היא נכס עצום.",
    painApproach:
      "את/ה רואה מתחרים שמצליחים, מקבלים ביקורות חמות, ותופסים נתח שוק — " +
      "ושואל/ת את עצמך למה לא אני? ההרגשה שאתם נשארים מאחור בזמן שאחרים זזים היא מתסכלת. " +
      "אבל הבשורה הטובה: מה שעבד להם, יכול לעבוד גם לכם.",
    tip:
      "השקיעו בתוכן המבוסס על סיפורי לקוחות אמיתיים. המלצה אותנטית שווה יותר " +
      "מעשרה פוסטים שיווקיים. תנו ללקוחות שלכם לדבר — הם המשווקים הכי טובים שלכם.",
    nudge:
      "בעלמה? יש לנו רשימה ארוכה של לקוחות שהתחילו בדיוק מאותו מקום. " +
      "הם ישמחו לספר לך מה השתנה — כי ההצלחה שלהם היא גם ההוכחה שלנו.",
  },
  DREAMER: {
    label: "חוקר/ת ומגלה",
    tagline: "את/ה תמיד מחפש/ת את מה שאחרים מפספסים",
    personality:
      "את/ה לא הולך/ת עם הזרם. כשכולם עושים אותו דבר, את/ה מחפש/ת את הזווית האחרת, " +
      "את הפתרון היצירתי, את מה שעוד לא ניסו. את/ה מאמין/ה שלכל עסק יש DNA ייחודי " +
      "וששיווק צריך לשקף את זה — לא להיות עוד עותק של מה שכולם עושים. " +
      "החשיבה החדשנית שלך היא היתרון התחרותי האמיתי.",
    painApproach:
      "את/ה עייף/ה מתבניות גנריות ומפתרונות קופי-פייסט. " +
      "כל פעם שמישהו מציע לך את אותו פאנל שיווקי משומש, את/ה מרגיש/ה שהם פשוט לא מבינים אותך. " +
      "העסק שלך הוא לא עוד עסק — ואת/ה צריך/ה מישהו שרואה את זה.",
    tip:
      "חפשו את המיצוב הייחודי שלכם — מה שרק אתם יכולים לומר. " +
      "אל תתפשרו על שיווק גנרי. השקיעו בלגלות את הסיפור האותנטי שמבדיל אתכם מכולם.",
    nudge:
      "בעלמה? אנחנו לא מאמינים בתבניות. כל מנגנון שאנחנו בונים נתפר בדיוק לעסק שלך — " +
      "לקהל שלך, לשפה שלך, לדרך שלך. כי גישה אחרת דורשת חשיבה אחרת.",
  },
  HEART: {
    label: "רגיש/ה ואמפתי/ת",
    tagline: "את/ה מרגיש/ה הכל — וזו הסופר-פאוור שלך",
    personality:
      "את/ה אדם שמבין אנשים. את/ה קולט/ת דברים שאחרים מפספסים — " +
      "את הטון, את ההיסוס, את מה שלא נאמר. בעסק שלך, הקשר האישי עם הלקוח הוא הכל. " +
      "את/ה יודע/ת שמאחורי כל עסקה יש בן אדם, ושאמון אמיתי הוא הבסיס לכל דבר. " +
      "האינטליגנציה הרגשית שלך היא כלי עוצמתי שמבדיל אותך מכל השאר.",
    painApproach:
      "להתמודד עם אתגרי שיווק לבד זה מרגיש מבודד ומתיש. " +
      "כשאין מי שמבין את החזון שלך ומלווה אותך באמת, ההרגשה היא שאתם צועדים בחושך. " +
      "מה שחסר לך הוא לא עוד ספק שירות — אלא שותף שמקשיב ומבין.",
    tip:
      "השיווק הכי חזק הוא אותנטי. דברו מהלב, ספרו את הסיפור האמיתי שלכם. " +
      "לקוחות מרגישים כשמשהו אמיתי — ומגיבים לזה.",
    nudge:
      "בעלמה? הליווי הוא אישי. לא בוט, לא מערכת טיקטים — אדם אמיתי שמכיר את העסק שלך, " +
      "זמין בשבילך, ובונה איתך ביחד. כי שיווק טוב מתחיל מהקשבה.",
  },
  ANCHOR: {
    label: "יציב/ה ומבוסס/ת",
    tagline: "את/ה סומך/ת על מה שעובד — ובצדק",
    personality:
      "את/ה אדם של שיטה. את/ה לא קופץ/ת על כל טרנד חדש — את/ה רוצה לראות הוכחות, " +
      "תהליכים ברורים, ומתודולוגיה מוכחת. את/ה מאמין/ה שהצלחה עסקית נבנית על יסודות יציבים, " +
      "לא על קיצורי דרך. ברגע שמשהו עובד, את/ה יודע/ת לשכפל ולהרחיב את זה בצורה מבוקרת. " +
      "היציבות הזו היא מה שהופך את העסק שלך לבר-קיימא.",
    painApproach:
      "כאוס בשיווק הוא הדבר שהכי מתסכל אותך. ספקים שמשנים כיוון כל שבוע, " +
      "בלי תהליך ברור, בלי אבני דרך, ובלי שקיפות על מה קורה ולמה. " +
      "את/ה צריך/ה מערכת שעובדת — לא הפתעות.",
    tip:
      "בנו מנגנון שיווקי עם תהליכים מוגדרים ואבני דרך ברורות. " +
      "מערכת שעובדת היא מערכת שאפשר לשכפל, למדוד ולשפר באופן שיטתי.",
    nudge:
      "בעלמה? יש מתודולוגיה מוכחת של 8+ שנים. תהליך עבודה שקוף עם שלבים ברורים, " +
      "דוחות קבועים, ומנגנון שנבנה פעם אחת ועובד לאורך זמן. בדיוק כמו שאתם אוהבים.",
  },
};

// ─── Scoring Logic ──────────────────────────────────────────────────────────
function scoreAnswers(answers: QuizAnswer[]): {
  primary: Archetype;
  secondary: Archetype | null;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  scores: Record<Archetype, number>;
} {
  const scores: Record<Archetype, number> = {
    WINNER: 0,
    STAR: 0,
    DREAMER: 0,
    HEART: 0,
    ANCHOR: 0,
  };

  // Count occurrences per archetype
  for (const answer of answers) {
    const questionMap = ANSWER_MAP[answer.question_id];
    if (!questionMap) continue;

    const archetype = questionMap[answer.option_id];
    if (archetype) {
      scores[archetype]++;
    }
  }

  // Sort archetypes by score descending
  const sorted = (Object.entries(scores) as [Archetype, number][]).sort(
    (a, b) => b[1] - a[1]
  );

  const primary = sorted[0][0];
  const primaryScore = sorted[0][1];
  const secondaryScore = sorted[1]?.[1] ?? 0;
  const secondary = secondaryScore > 0 ? sorted[1][0] : null;

  // Confidence levels
  const totalAnswers = answers.length || 1;
  const dominance = primaryScore / totalAnswers;
  const gap = primaryScore - secondaryScore;

  let confidence: "HIGH" | "MEDIUM" | "LOW";
  if (dominance >= 0.6 || gap >= 3) {
    confidence = "HIGH";
  } else if (dominance >= 0.4 || gap >= 2) {
    confidence = "MEDIUM";
  } else {
    confidence = "LOW";
  }

  return { primary, secondary, confidence, scores };
}

// ─── API Handler ────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body: ScoreRequest = await request.json();
    const { answers, name, phone, businessName, businessType } = body;

    // Validate
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid answers array" },
        { status: 400 }
      );
    }

    // Score
    const { primary, secondary, confidence, scores } = scoreAnswers(answers);

    // Get personality profile
    const profile = PERSONALITY_PROFILES[primary];
    const secondaryProfile = secondary
      ? PERSONALITY_PROFILES[secondary]
      : null;

    // ── Signals OS Integration (fire-and-forget) ──
    try {
      fetch("https://signals-os.alma-ads.co.il/api/v1/adaptive/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-slug": "alma",
        },
        body: JSON.stringify({
          questionnaire_slug: "עסקים-אדפטיבי",
          subject: {
            full_name: name || "",
            phone: phone || "",
            business_name: businessName || "",
            business_type: businessType || "",
          },
          answers: answers.map((a) => ({
            question_id: String(a.question_id),
            option_id: a.option_id,
          })),
          lang: "he",
          source: { source_id: "adaptive-landing-alma-v1" },
        }),
      }).catch(() => {
        // Fire-and-forget: silently ignore errors
      });
    } catch {
      // Fire-and-forget: silently ignore errors
    }

    // ── CAPI: CompleteRegistration (fire-and-forget) ──
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
    const clientUserAgent = request.headers.get("user-agent") || "";
    const referer = request.headers.get("referer") || "";

    fireCAPIEvent({
      eventName: "CompleteRegistration",
      eventSourceUrl: referer || "https://alma-lp-v2.vercel.app",
      userData: {
        phone: phone,
        firstName: name,
        clientIp,
        clientUserAgent,
      },
      customData: {
        content_name: "Archetype Quiz",
        archetype: primary,
        confidence,
      },
    }).catch(() => {}); // Silently ignore

    // ── Response ──
    return NextResponse.json({
      primary,
      secondary,
      confidence,
      scores,
      profile: {
        label: profile.label,
        tagline: profile.tagline,
        personality: profile.personality,
        painApproach: profile.painApproach,
        tip: profile.tip,
        nudge: profile.nudge,
      },
      secondaryProfile: secondaryProfile
        ? {
            label: secondaryProfile.label,
            tagline: secondaryProfile.tagline,
          }
        : null,
    });
  } catch (error) {
    console.error("Quiz scoring error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
