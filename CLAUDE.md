# alma-lp-v2 — דף מכירה אדפטיבי לעלמה

## זהות
- ניב = יועץ אסטרטגי לצמיחה עסקית. **לא סוכנות דיגיטלית!**
- "מנגנון לפני פרסום" — הקו המוביל

## סטאק
- Next.js 16 + React 19 + Tailwind CSS v4 + Framer Motion 12
- Vercel (domain: lpsignals.alma-ads.co.il)
- Leads: Zapier webhook + Meta CAPI + AMP lead-webhook

## ארכיטקטורה
- 24 קומפוננטות, 11 מהן archetype-aware
- קוויז: 7 שאלות → server scoring (/api/quiz/score) → 5 ארכיטיפים
- ANSWER_MAP בצד שרת בלבד — לא לחשוף ללקוח
- ארכיטיפים: WINNER, STAR, DREAMER, HEART, ANCHOR
- אחרי קוויז archetype מתפשט לכל הקומפוננטות דרך props

## קבצי מפתח
- src/data/archetypeContent.ts — כל התוכן ל-5 ארכיטיפים
- src/app/api/quiz/score/route.ts — scoring + ANSWER_MAP
- src/app/api/checkout/route.ts — Zapier + CAPI + AMP webhook
- src/app/api/wa-lead/route.ts — WhatsApp float → AMP בלבד (קל, בלי Zapier)
- src/app/api/exit-lead/route.ts — Exit intent → AMP webhook
- src/app/page.tsx — דף ראשי עם 24 קומפוננטות

## צבעים
- Primary: #00BCD4 (Teal)
- Accent: #6B4FA0 (Purple)
- Heading: #003D47 (Dark teal)
- Text: #333333
- Background: #FFFFFF

## APIs & Webhooks
- Zapier (CRM/אחסון): hooks.zapier.com/hooks/catch/4214758/up6xr4o/
- Zapier (התראת וואטסאפ לניב): hooks.zapier.com/hooks/catch/4214758/ua57pgr/ — אותו flow כמו lpfitness
  - זאפ "ווצאפ דף נחיתה" (339932868): Catch Hook ← WhatsApp אל 972523133297
  - ⚠️ תבנית lead_reminder דורשת שדה email — ליד בלי אימייל חייב placeholder (leadNotify.ts שולח no-email@boost.alma-ads.co.il)
  - הזאפ הישן "(חדש) ווצאפ דף נחיתה" (354718338, hook up6xr4o) נכשל על לידים בלי אימייל — הוחלט להשאיר דלוק (כפילות מקובלת על ניב)
- Web3Forms (מייל לניב): access_key 5e7c6215-2df6-4051-9d19-5a5ea96e0b9c — src/lib/leadNotify.ts
- Signals OS: signals-os.alma-ads.co.il/api/v1/adaptive/score
- Meta CAPI: pixel 660125253756573 (צריך META_CAPI_TOKEN)
- AMP lead-webhook: rxckkozbkrabpjdgyxqm.supabase.co/functions/v1/lead-webhook
  - tenant_id: 00000000-0000-0000-0000-000000000001
  - source: landing_page
  - env var: SENSO_WEBHOOK_KEY
- WhatsApp: 972523133297

## מדידה וסינון
- קוויז אוסף גם השקעה חודשית בשיווק + תפקיד (details stage) — קריטריון סינון בשרת: 5K+/חודש AND בעלים/שותף/מנהל שיווק
- ליד מסונן ← אירוע QualifiedLead (פיקסל+CAPI, event_id משותף) — עליו מאפטמים קמפיינים במטא
- UTM זורם גם במסלול הקוויז; campaign_name ב-AMP = utm_campaign
- הפיקסל נטען דרך PixelLoader (מודע-הסכמה): דחייה בבאנר חוסמת/מבטלת בפועל
- META_CAPI_TOKEN עדיין חסר ב-Vercel — כל אירועי השרת ממתינים לו

## כללים
- עברית בלבד, RTL
- פונטים: Heebo (כותרות) + Assistant (גוף)
- CSS vars ב-globals.css, לא ב-@theme inline
- Framer Motion 12: חובה ease: "easeOut" as const
- שמירה על זהות ניב — ייעוץ/אסטרטגיה/מנגנון, לא "דיגיטל"
