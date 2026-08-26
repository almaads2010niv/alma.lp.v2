import { NextRequest, NextResponse } from "next/server";
import { fireCAPIEvent } from "@/lib/capi";
import { notifyLead } from "@/lib/leadNotify";

// ─── Types ──────────────────────────────────────────────────────────────────
// Two separate outputs from the same quiz:
//   diagnosis — WHAT we say: the suspected business gap (shown to the user)
//   archetype — HOW we say it: internal communication tone (never shown)
type Archetype = "WINNER" | "STAR" | "DREAMER" | "HEART" | "ANCHOR";

type Diagnosis =
  | "DEMAND_GAP"
  | "LEAD_HANDLING_GAP"
  | "SALES_CONVERSION_GAP"
  | "POSITIONING_GAP"
  | "SYSTEM_GAP"
  | "UNKNOWN";

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
  /** Qualification fields (coded values from the details form) */
  marketingBudget?: string;
  role?: string;
  /** Meta dedup IDs generated client-side, shared with the browser pixel */
  eventId?: string;
  qualifiedEventId?: string;
  /** Match-quality fields */
  visitorId?: string;
  fbc?: string;
  utm?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    fbclid?: string;
    gclid?: string;
  };
}

// ── Qualification criteria (server-side only) ──
// A lead qualifies when there is real marketing spend AND the person
// filling the form can make decisions. This gates the QualifiedLead
// event that Meta campaigns should optimize on.
const QUALIFYING_BUDGETS = new Set(["FROM_5_TO_15K", "FROM_15_TO_50K", "OVER_50K"]);
const QUALIFYING_ROLES = new Set(["OWNER", "PARTNER", "MARKETING_MANAGER"]);

const BUDGET_HEBREW: Record<string, string> = {
  NONE: "אין השקעה קבועה",
  UNDER_5K: "עד 5,000 ₪",
  FROM_5_TO_15K: "5,000-15,000 ₪",
  FROM_15_TO_50K: "15,000-50,000 ₪",
  OVER_50K: "מעל 50,000 ₪",
};

const ROLE_HEBREW: Record<string, string> = {
  OWNER: "בעלים/מנכ\"ל",
  PARTNER: "שותף/ה",
  MARKETING_MANAGER: "מנהל/ת שיווק",
  EMPLOYEE: "עובד/ת",
  OTHER: "אחר",
};

interface DiagnosisResult {
  headline: string;
  tagline: string;
  summary: string;
  firstCheck: string;
  caveat: string;
  nudge: string;
}

// ─── Scoring Weights (server-side only, hidden from client) ─────────────────
// Each answer can contribute to the business diagnosis, the communication
// tone, or both. Weights are intentionally small — 7 answers are a first
// impression, not a verdict, which is why the result copy stays hedged.

const DIAGNOSIS_WEIGHTS: Record<
  number,
  Record<string, Partial<Record<Diagnosis, number>>>
> = {
  1: {
    "א": { LEAD_HANDLING_GAP: 1, SALES_CONVERSION_GAP: 1 },
    "ב": { DEMAND_GAP: 2 },
    "ג": { POSITIONING_GAP: 2 },
    "ד": { SYSTEM_GAP: 2 },
    "ה": { UNKNOWN: 2 },
  },
  2: {
    "א": {},
    "ב": { LEAD_HANDLING_GAP: 2 },
    "ג": { LEAD_HANDLING_GAP: 1, SYSTEM_GAP: 1 },
    "ד": { LEAD_HANDLING_GAP: 2 },
    "ה": { LEAD_HANDLING_GAP: 1, UNKNOWN: 1 },
  },
  3: {
    "א": { LEAD_HANDLING_GAP: 2 },
    "ב": { SALES_CONVERSION_GAP: 2 },
    "ג": { SALES_CONVERSION_GAP: 2 },
    "ד": { LEAD_HANDLING_GAP: 2 },
    "ה": { UNKNOWN: 2 },
  },
  4: {
    "א": {},
    "ב": {},
    "ג": {},
    "ד": {},
    "ה": { SYSTEM_GAP: 2 },
  },
  5: {
    "א": { DEMAND_GAP: 2 },
    "ב": { DEMAND_GAP: 1, POSITIONING_GAP: 2 },
    "ג": { SALES_CONVERSION_GAP: 2 },
    "ד": { SYSTEM_GAP: 2 },
    "ה": { SYSTEM_GAP: 2 },
  },
  6: {
    "א": {},
    "ב": {},
    "ג": { SALES_CONVERSION_GAP: 1 },
    "ד": { SYSTEM_GAP: 1 },
    "ה": { SYSTEM_GAP: 1 },
  },
  7: {
    "א": {},
    "ב": {},
    "ג": {},
    "ד": {},
    "ה": {},
  },
};

const ARCHETYPE_WEIGHTS: Record<
  number,
  Record<string, Partial<Record<Archetype, number>>>
> = {
  1: {},
  2: {
    "א": { ANCHOR: 1 },
    "ה": { WINNER: 1 },
  },
  3: {},
  4: {
    // Choosing an established agency = trusts what other businesses use —
    // the strongest social-proof signal the business questions provide
    "א": { STAR: 2 },
    "ג": { STAR: 1 },
    "ד": { DREAMER: 1 },
  },
  5: {
    "ד": { DREAMER: 1 },
    "ה": { HEART: 1 },
  },
  6: {
    "א": { WINNER: 2 },
    "ב": { ANCHOR: 2 },
    "ג": { WINNER: 1 },
    "ד": { HEART: 1 },
    "ה": { WINNER: 1, ANCHOR: 1 },
  },
  7: {
    "א": { DREAMER: 2 },
    "ב": { WINNER: 2 },
    "ג": { HEART: 2 },
    "ד": { ANCHOR: 2 },
    "ה": { WINNER: 1, ANCHOR: 1 },
  },
};

// ─── Diagnosis Result Copy (server-side only) ───────────────────────────────
// Deliberately hedged: "נראה ש...", "שווה לבדוק..." — never "מצאנו את הבעיה".

const SHARED_CAVEAT =
  "חשוב לומר ביושר: שבע שאלות הן התחלה של אבחון, לא סופו. את התמונה המלאה בודקים על המספרים האמיתיים שלכם, לא על שאלון.";

const SHARED_NUDGE =
  "בהמשך הדף: למה פערים כאלה נשארים גם אצל עסקים טובים, איך נראית בדיקה מסודרת, ומה הצעד הראשון.";

const DIAGNOSIS_RESULTS: Record<Diagnosis, DiagnosisResult> = {
  DEMAND_GAP: {
    headline: "נראה שתהליך המכירה שלכם סביר, אבל חסר ביקוש איכותי",
    tagline: "הכיוון לבדיקה: מה שקורה עוד לפני הפרסום",
    summary:
      "מהתשובות שלכם נראה שכשהזדמנות מגיעה, אתם יודעים לטפל בה. צוואר הבקבוק נמצא כנראה מוקדם יותר: לא נכנסות מספיק הזדמנויות, או שהן לא מספיק רלוונטיות. במצב כזה עוד תקציב הוא לא בהכרח התשובה הראשונה. קודם בודקים למי מדברים, מה אומרים, ולמה שיבחרו דווקא בכם.",
    firstCheck:
      "הנקודה שהיינו בודקים קודם: ההצעה והמסר שפוגשים את הקהל שלכם, עוד לפני שמגדילים תקציב פרסום.",
    caveat: SHARED_CAVEAT,
    nudge: SHARED_NUDGE,
  },
  LEAD_HANDLING_GAP: {
    headline: "נראה שהעסק מאבד יותר הזדמנויות אחרי שהפנייה נכנסת מאשר לפניה",
    tagline: "נקודת הבדיקה הראשונה: מה קורה בין הפנייה לשיחה",
    summary:
      "מהתשובות שלכם נראה שפניות כן נכנסות, אבל הדרך מהפנייה ועד שיחה אמיתית לא עקבית: זמני חזרה, תסריט, מעקב. את החלק הזה קל לפספס כשמסתכלים רק על נתוני הקמפיין, והוא משפיע ישירות על כמה מההשקעה בשיווק באמת חוזרת.",
    firstCheck:
      "הנקודה שהיינו בודקים קודם: מה קורה בפועל ביממה הראשונה אחרי שמישהו פונה. מי חוזר, מתי, ומה נאמר.",
    caveat: SHARED_CAVEAT,
    nudge: SHARED_NUDGE,
  },
  SALES_CONVERSION_GAP: {
    headline: "נראה שהפער העיקרי הוא בין שיחות לבין סגירות",
    tagline: "שווה להסתכל קודם על שיחת המכירה ועל ההצעה",
    summary:
      "מהתשובות שלכם נראה שהזדמנויות מגיעות עד שיחה או הצעה, ושם משהו נעצר. במצב כזה עוד פניות בעיקר מגדילות את העומס. השאלות המעניינות הן מה קורה בשיחה עצמה, איך בנויה ההצעה, ומה קורה אחרי שהיא נשלחת.",
    firstCheck:
      "הנקודה שהיינו בודקים קודם: שיחת מכירה אחת אמיתית מההתחלה ועד הסוף, והמסלול של הצעה אחרי שנשלחה.",
    caveat: SHARED_CAVEAT,
    nudge: SHARED_NUDGE,
  },
  POSITIONING_GAP: {
    headline: "נראה שהשאלה היא לא כמה רואים אתכם, אלא מה מבינים כשרואים",
    tagline: "הסימן שעולה מהתשובות: המיצוב וההצעה",
    summary:
      "מהתשובות שלכם עולה תלות במבצעים, או קושי להסביר למה לבחור דווקא בכם. במצב כזה פרסום מגביר את הרעש אבל לא את הבחירה. לפני הקמפיין הבא שווה לחדד מה אתם מציעים, למי, ולמה זה שווה את המחיר המלא.",
    firstCheck:
      "הנקודה שהיינו בודקים קודם: איך נשמעת ההצעה שלכם באוזני לקוח שפוגש אתכם בפעם הראשונה.",
    caveat: SHARED_CAVEAT,
    nudge: SHARED_NUDGE,
  },
  SYSTEM_GAP: {
    headline: "נראה שהבעיה היא לא רכיב אחד, אלא החיבור בין הרכיבים",
    tagline: "מה שעולה מהתשובות: חסר מנגנון אחד שמחבר את החלקים",
    summary:
      "מהתשובות שלכם נראה שיש לא מעט פעילות: פרסום, ספקים, כלים. מה שחסר הוא כנראה מסלול אחד שמחבר מסר, פנייה, שיחה וסגירה. כשכל חלק חי לבד, כל אחד מהם יכול להיות בסדר, והתוצאה הכוללת עדיין לא מגיעה.",
    firstCheck:
      "הנקודה שהיינו בודקים קודם: מיפוי המסלול מקצה לקצה, לראות איפה המספרים נשברים במעבר בין שלב לשלב.",
    caveat: SHARED_CAVEAT,
    nudge: SHARED_NUDGE,
  },
  UNKNOWN: {
    headline: "אין עדיין מספיק מידע כדי להצביע על פער אחד, וזה ממצא חשוב בפני עצמו",
    tagline: "המסקנה הראשונית: לבדוק לפי הסדר, לא לנחש",
    summary:
      "מהתשובות שלכם קשה להצביע על נקודה אחת, וזה בסדר גמור. רוב בעלי העסקים לא אמורים לדעת לבד איפה המערכת נשברת. בשביל זה קיים אבחון. מה שכן ברור: לפני שמשקיעים עוד בפרסום, שווה לדעת איפה הכסף הנוכחי נעצר.",
    firstCheck:
      "הנקודה שהיינו מתחילים בה: מיפוי קצר של המסלול מהפנייה ועד העסקה, לראות איפה יש נתונים ואיפה יש חורים.",
    caveat: SHARED_CAVEAT,
    nudge: SHARED_NUDGE,
  },
};

// ─── Scoring Logic ──────────────────────────────────────────────────────────

// On an exact tie, prefer the more specific/actionable gap over the broad
// systemic one — a tie is ambiguity, not evidence of a systemic problem.
const TIE_PRIORITY: Diagnosis[] = [
  "LEAD_HANDLING_GAP",
  "SALES_CONVERSION_GAP",
  "DEMAND_GAP",
  "POSITIONING_GAP",
  "SYSTEM_GAP",
];

function scoreDiagnosis(answers: QuizAnswer[]): {
  diagnosis: Diagnosis;
  secondaryDiagnosis: Diagnosis | null;
  diagnosisConfidence: "HIGH" | "MEDIUM" | "LOW";
  diagnosisScores: Record<Diagnosis, number>;
} {
  const scores: Record<Diagnosis, number> = {
    DEMAND_GAP: 0,
    LEAD_HANDLING_GAP: 0,
    SALES_CONVERSION_GAP: 0,
    POSITIONING_GAP: 0,
    SYSTEM_GAP: 0,
    UNKNOWN: 0,
  };

  for (const answer of answers) {
    const weights = DIAGNOSIS_WEIGHTS[answer.question_id]?.[answer.option_id];
    if (!weights) continue;
    for (const [key, value] of Object.entries(weights)) {
      scores[key as Diagnosis] += value ?? 0;
    }
  }

  const ranked = (Object.entries(scores) as [Diagnosis, number][])
    .filter(([key]) => key !== "UNKNOWN")
    .sort((a, b) => b[1] - a[1]);

  const [top, second] = ranked;

  // Not enough signal, or the "I don't know" answers dominate → say so honestly.
  if (scores.UNKNOWN >= 4 || !top || top[1] < 3) {
    return {
      diagnosis: "UNKNOWN",
      secondaryDiagnosis: null,
      diagnosisConfidence: "LOW",
      diagnosisScores: scores,
    };
  }

  const gap = top[1] - (second?.[1] ?? 0);
  let diagnosis = top[0];

  if (gap === 0 && second) {
    // Exact tie: pick the more specific gap, with LOW confidence.
    const tied = ranked.filter(([, v]) => v === top[1]).map(([k]) => k);
    diagnosis = TIE_PRIORITY.find((d) => tied.includes(d)) ?? top[0];
  }

  const secondaryDiagnosis =
    ranked.find(([k, v]) => k !== diagnosis && v > 0)?.[0] ?? null;
  const diagnosisConfidence: "HIGH" | "MEDIUM" | "LOW" =
    gap >= 2 ? "HIGH" : gap === 1 ? "MEDIUM" : "LOW";

  return { diagnosis, secondaryDiagnosis, diagnosisConfidence, diagnosisScores: scores };
}

function scoreArchetype(answers: QuizAnswer[]): {
  primary: Archetype;
  secondary: Archetype | null;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  scores: Record<Archetype, number>;
} {
  // Declaration order doubles as the tie-break (stable sort): rarer tones
  // first, so WINNER/ANCHOR don't win every tie by alphabet accident.
  const scores: Record<Archetype, number> = {
    STAR: 0,
    DREAMER: 0,
    HEART: 0,
    WINNER: 0,
    ANCHOR: 0,
  };

  for (const answer of answers) {
    const weights = ARCHETYPE_WEIGHTS[answer.question_id]?.[answer.option_id];
    if (!weights) continue;
    for (const [key, value] of Object.entries(weights)) {
      scores[key as Archetype] += value ?? 0;
    }
  }

  const sorted = (Object.entries(scores) as [Archetype, number][]).sort(
    (a, b) => b[1] - a[1]
  );

  // No tone signal at all → default to the calm, methodical register.
  const primary = sorted[0][1] > 0 ? sorted[0][0] : "ANCHOR";
  const primaryScore = sorted[0][1];
  const secondaryScore = sorted[1]?.[1] ?? 0;
  const secondary = secondaryScore > 0 ? sorted[1][0] : null;

  const total = sorted.reduce((sum, [, v]) => sum + v, 0) || 1;
  const dominance = primaryScore / total;
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

// Hebrew labels for the AMP/CRM notes — the enum stays internal
const DIAGNOSIS_HEBREW: Record<Diagnosis, string> = {
  DEMAND_GAP: "ביקוש",
  LEAD_HANDLING_GAP: "טיפול בפניות",
  SALES_CONVERSION_GAP: "המרת מכירה",
  POSITIONING_GAP: "מיצוב",
  SYSTEM_GAP: "חיבור המערכת",
  UNKNOWN: "לא חד-משמעי",
};

// ─── API Handler ────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body: ScoreRequest = await request.json();
    const { answers, name, phone, businessName, businessType, marketingBudget, role, utm } = body;

    // Validate
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid answers array" },
        { status: 400 }
      );
    }

    // Score both layers
    const { diagnosis, secondaryDiagnosis, diagnosisConfidence, diagnosisScores } =
      scoreDiagnosis(answers);
    const { primary, secondary, confidence, scores } = scoreArchetype(answers);
    const result = DIAGNOSIS_RESULTS[diagnosis];

    // Qualification: real marketing spend + decision-making role
    const qualified =
      QUALIFYING_BUDGETS.has(marketingBudget || "") &&
      QUALIFYING_ROLES.has(role || "");

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

    // ── Quiz completion IS a lead: create it in AMP + notify Niv ──
    // Completers used to go only to Signals OS — invisible to Niv unless
    // they later hit checkout/WhatsApp. Both calls are awaited (Vercel
    // kills fire-and-forget) and never fail the quiz result.
    if (name && phone) {
      const ampWebhookKey = process.env.SENSO_WEBHOOK_KEY;
      if (ampWebhookKey) {
        try {
          const ampRes = await fetch(
            `https://rxckkozbkrabpjdgyxqm.supabase.co/functions/v1/lead-webhook?tenant_id=00000000-0000-0000-0000-000000000001&source=landing_page`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-api-key": ampWebhookKey,
              },
              body: JSON.stringify({
                name,
                phone,
                business_name: businessName || "",
                // Real campaign attribution when the visitor came from an ad
                campaign_name: utm?.utm_campaign || "Alma LP - Quiz",
                notes: `מילא אבחון${qualified ? " (מסונן: מתאים)" : ""}. אבחנה: ${DIAGNOSIS_HEBREW[diagnosis]}, ארכיטיפ: ${primary}, סוג עסק: ${businessType || "לא צוין"}, השקעה בשיווק: ${BUDGET_HEBREW[marketingBudget || ""] || "לא צוין"}, תפקיד: ${ROLE_HEBREW[role || ""] || "לא צוין"}, קמפיין: ${utm?.utm_campaign || "ישיר/אורגני"}, מקור: שאלון אבחון בדף`,
              }),
            }
          );
          const ampResult = await ampRes.json().catch(() => ({}));
          console.log("AMP quiz-lead response:", ampRes.status, ampResult);
        } catch (ampError) {
          console.error("AMP quiz-lead error:", ampError);
        }
      }

      // WhatsApp alert. The Zap's template renders only name/phone/email,
      // so the "מילא אבחון" annotation rides on the name field.
      // "מתאים" marks leads that passed the qualification criteria.
      await notifyLead({
        name: `${name} (מילא אבחון${qualified ? " - מתאים" : ""})`,
        phone,
        leadType: qualified ? "מילא אבחון - מתאים" : "מילא אבחון",
      });
    }

    // ── CAPI: CompleteRegistration (fire-and-forget) ──
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
    const clientUserAgent = request.headers.get("user-agent") || "";
    const referer = request.headers.get("referer") || "";

    const capiUserData = {
      phone: phone,
      firstName: name,
      clientIp,
      clientUserAgent,
      fbclid: body.utm?.fbclid,
      fbc: body.fbc,
      externalId: body.visitorId,
    };

    fireCAPIEvent({
      eventName: "CompleteRegistration",
      eventSourceUrl: referer || "https://boost.alma-ads.co.il",
      eventId: body.eventId,
      userData: capiUserData,
      customData: {
        content_name: "Archetype Quiz",
        archetype: primary,
        confidence,
        utm_source: utm?.utm_source || "",
        utm_campaign: utm?.utm_campaign || "",
      },
    }).catch(() => {}); // Silently ignore

    // QualifiedLead — the high-intent signal for Meta optimization,
    // fired only when the lead passed the qualification criteria
    if (qualified) {
      fireCAPIEvent({
        eventName: "QualifiedLead",
        eventSourceUrl: referer || "https://boost.alma-ads.co.il",
        eventId: body.qualifiedEventId,
        userData: capiUserData,
        customData: {
          content_name: "Qualified Quiz Lead",
          marketing_budget: marketingBudget || "",
          role: role || "",
          utm_source: utm?.utm_source || "",
          utm_campaign: utm?.utm_campaign || "",
        },
      }).catch(() => {}); // Silently ignore
    }

    // ── Response ──
    return NextResponse.json({
      diagnosis,
      secondaryDiagnosis,
      diagnosisConfidence,
      diagnosisScores,
      primary,
      secondary,
      confidence,
      scores,
      result,
      qualified,
    });
  } catch (error) {
    console.error("Quiz scoring error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
