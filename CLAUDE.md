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
- Zapier: hooks.zapier.com/hooks/catch/4214758/up6xr4o/
- Signals OS: signals-os.alma-ads.co.il/api/v1/adaptive/score
- Meta CAPI: pixel 660125253756573 (צריך META_CAPI_TOKEN)
- AMP lead-webhook: rxckkozbkrabpjdgyxqm.supabase.co/functions/v1/lead-webhook
  - tenant_id: 00000000-0000-0000-0000-000000000001
  - source: landing_page
  - env var: SENSO_WEBHOOK_KEY
- WhatsApp: 972523133297

## כללים
- עברית בלבד, RTL
- פונטים: Heebo (כותרות) + Assistant (גוף)
- CSS vars ב-globals.css, לא ב-@theme inline
- Framer Motion 12: חובה ease: "easeOut" as const
- שמירה על זהות ניב — ייעוץ/אסטרטגיה/מנגנון, לא "דיגיטל"
