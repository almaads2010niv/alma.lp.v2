# 🧠 MEMORY — alma-adaptive

## Project: Adaptive Selling Page for Alma Ads
- **Local path**: `C:\Users\Natali Eini\Downloads\Cursor\alma-adaptive`
- **Stack**: Next.js 16.1.6 + React 19 + Tailwind CSS v4 + Framer Motion 12
- **Dev server**: `npx next dev --port 3005` → http://localhost:3005
- **Sessions completed**: 6

---

## 🔑 User: Niv (Alma Ads)
- Email: `alma.ads2010@gmail.com`
- YouTube: `@Alma.Marketing.Israel` (channel ID: `UCSE4N0pQzmUhzme4E27cbkg`)
- Facebook: https://www.facebook.com/people/עלמה/100064074121688/
- Website: https://alma-ads.co.il
- **CRITICAL IDENTITY**: NOT a digital agency (סוכנות דיגיטלית)!
  He is a **business growth strategist** — ייעוץ | אסטרטגיה | שיווק | צמיחה
  Key phrase: "מנגנון לפני פרסום" (mechanism before advertising)
- Prefers Hebrew communication, builds Hebrew RTL pages
- Communicates in short Hebrew messages, direct and to the point

---

## 🏗️ Architecture

### Adaptive Quiz System
- 7 questions × 5 options (client-side display only)
- Server-side scoring in `/api/quiz/score` (ANSWER_MAP hidden from bundle)
- 5 archetypes: WINNER, STAR, DREAMER, HEART, ANCHOR
- Signals OS integration: fire-and-forget POST to `signals-os.alma-ads.co.il/api/v1/adaptive/score`
- After quiz → `archetype` state propagates to ALL page sections

### Page Component Order (24 total)
```
Overlays: StickyBar, NotificationQueue, ExitIntent, AccessibilityWidget, CookieConsent
Hero + Trust: Hero, SocialProof
Persuasion: VossBlock, AdaptiveQuiz
Personalized: PersonalizedBlock, ComparisonTable, Testimonials
Value: GuiltRelease, PricingTable, LeadsCalculator
Content: YouTubeGallery, SmartCountdown
Trust: VideoSection, RiskReversal, HowItWorks
Conversion: CheckoutForm, Footer
```

### Key Data Files
- `src/data/archetypeContent.ts` — All content per archetype (interface + 5 configs)
- `src/components/YouTubeGallery.tsx` — 7 real video IDs mapped to quiz questions
- `src/components/Testimonials.tsx` — 7 real client testimonials with "read more"

---

## 🎨 Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#00BCD4` | Teal — CTAs, accents, links |
| Accent | `#6B4FA0` | Purple — secondary, gradients |
| Heading | `#003D47` | Dark teal — all headings |
| Text | `#333333` | Body text |
| Background | `#FFFFFF` | White base |
| Cream | `#FAF8F5` | Card backgrounds |

---

## 📺 YouTube Videos (mapped to quiz questions)
| # | Video ID | Title | Quiz Question |
|---|----------|-------|---------------|
| 1 | `-HdIJaIEBdY` | מה זו זהות עסקית? | מה הביא אותך לכאן? |
| 2 | `QX5kHW3PqSU` | דוגמה למשפך שיווקי | מה מתסכל בשיווק? |
| 3 | `B_C4BtExcBY` | מה קורה לליד שלכם? | מה קורה כשנכנס ליד? |
| 4 | `uM4bPyrdHNs` | מה זה מסגור במכירה? | מה ישכנע אותך? |
| 5 | `w2uTr4R4EUI` | איך מתכננים גיוס לקוחות? | הגדרת הצלחה |
| 6 | `NYu2rx4G69U` | למה המוח צריך "לא"? | איך מקבלים החלטות? |
| 7 | `ovbPs7tOp9c` | למה תוכנית עסקית קריטית? | מה מדאיג בגורם חיצוני? |

---

## 💬 Real Testimonials (7)
1. **ירון סלע** — רשת גרייט שייפ (מנכ"ל, English, 7 years)
2. **אלי שוטן** — B-Cure Laser (סמנכ"ל)
3. **טל** — SMOOVEE (מנכ"ל)
4. **עוזי** — קאנטרי נשר (מנכ"ל)
5. **אמנון** — גוסטינו (בעלים)
6. **רוני** — UFC ISRAEL (מנהלת שיווק ארצית)
7. **מאיה** — אגודת חובבי החתולים (יו"ר)

Archetype-based ordering:
- WINNER: [0,1,5] — numbers, ROI, systems
- STAR: [2,3,6] — community, partnership
- DREAMER: [5,1,4] — unique approach
- HEART: [6,4,3] — empathy, personal
- ANCHOR: [0,5,3] — methodology, process

---

## ⚡ Important Technical Notes
- **Tailwind v4**: Colors as raw CSS vars, NOT in `@theme inline` (build conflict)
- **Framer Motion 12**: `ease: "easeOut" as const` required for strict typing
- **No Supabase**: Leads go through Web3Forms + Zapier webhook
- **Facebook Pixel**: 660125253756573 (blocked by ad blockers in dev — normal)
- **Fonts**: Heebo (headings) + Assistant (body) via `next/font/google`
- **SpotsCounter**: Ready component, not yet placed in page layout

---

## 📊 Current State (Session 6)
- [x] 24 components built and integrated
- [x] Quiz flow working (7 questions → server scoring → archetype)
- [x] All 5 archetypes with personalized content
- [x] 7 real YouTube videos mapped to quiz questions
- [x] 7 real testimonials with "read more" toggle
- [x] FOMO notifications with business names + stars
- [x] Exit intent popup (archetype-aware)
- [x] Smart countdown + spots counter
- [x] Pricing table + Leads calculator
- [x] Accessibility widget (Israeli legal)
- [x] Cookie consent + Terms modal
- [x] Build passes clean
- [ ] Not deployed to Vercel yet
- [ ] No GitHub repo created yet
- [ ] SpotsCounter not placed in page layout
- [ ] Web3Forms key needs to be set in ExitIntent
