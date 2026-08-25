"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface TermsModalProps {
  /** Trigger text — defaults to the classic footer-style link */
  triggerLabel?: string;
  /** Trigger styling — override to match the surrounding context (e.g. Footer) */
  triggerClassName?: string;
}

export default function TermsModal({
  triggerLabel = "תנאי השירות",
  triggerClassName = "text-gray-400 hover:text-[#00BCD4] underline underline-offset-4 transition-colors cursor-pointer text-sm",
}: TermsModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className={triggerClassName}>
        {triggerLabel}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
            dir="rtl"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white border border-gray-200 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto z-10"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-[#003D47] transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="font-[family-name:var(--font-heebo)] font-black text-2xl text-[#003D47] mb-6">
                תנאי שירות: שיחת אבחון חינם
              </h2>
              <h3 className="font-[family-name:var(--font-heebo)] font-bold text-lg text-gray-500 mb-6">
                עלמה? | ייעוץ, אסטרטגיה, שיווק, מכירות וצמיחה
              </h3>

              <div className="space-y-6 text-gray-600 text-sm leading-relaxed font-[family-name:var(--font-assistant)]">
                <div>
                  <h4 className="text-[#003D47] font-bold mb-2 font-[family-name:var(--font-heebo)]">1. מהות השירות</h4>
                  <p>
                    שיחת אבחון אסטרטגית חינם עם נציג עלמה?, בת 30 דקות לערך.
                    השיחה כוללת הערכה ראשונית של מצב העסק, זיהוי הזדמנויות לשיפור,
                    והמלצה על מסלול ליווי מותאם.
                  </p>
                </div>

                <div>
                  <h4 className="text-[#003D47] font-bold mb-2 font-[family-name:var(--font-heebo)]">2. זמינות</h4>
                  <p>
                    שיחות האבחון מתואמות בכפוף לזמינות. נחזור אליכם בתוך 1-2 ימי עסקים.
                  </p>
                </div>

                <div>
                  <h4 className="text-[#003D47] font-bold mb-2 font-[family-name:var(--font-heebo)]">3. ללא התחייבות</h4>
                  <p>
                    שיחת האבחון אינה מחייבת את בעל/ת העסק להמשך ליווי או שירות כלשהו.
                    ניתן להחליט בהתאם לשיחה אם להמשיך לתהליך ליווי אסטרטגי.
                  </p>
                </div>

                <div>
                  <h4 className="text-[#003D47] font-bold mb-2 font-[family-name:var(--font-heebo)]">4. פרטיות</h4>
                  <p>
                    הפרטים שנמסרים באתר (שם, טלפון, תשובות האבחון) ישמשו ליצירת קשר, להתאמת
                    התוכן והשירות ולמדידת ביצועי האתר. האתר עושה שימוש בכלי מדידה ובמערכות
                    ניהול פניות, לרבות שירותים של צדדים שלישיים המשמשים לתפעול השירות.
                    הפרטים לא יימכרו ולא ישמשו לדיוור שיווקי ללא הסכמה.
                  </p>
                </div>

                <div>
                  <h4 className="text-[#003D47] font-bold mb-2 font-[family-name:var(--font-heebo)]">5. האבחון העסקי הקצר</h4>
                  <p>
                    תוצאות האבחון באתר הן תמונת מצב ראשונית בלבד, המבוססת על התשובות שנמסרו.
                    הן אינן מהוות ייעוץ עסקי מחייב או אבחון מקצועי מלא, ונועדו לסייע בהתאמת
                    התוכן והשיחה בלבד.
                  </p>
                </div>

                <div>
                  <h4 className="text-[#003D47] font-bold mb-2 font-[family-name:var(--font-heebo)]">6. יצירת קשר</h4>
                  <p>
                    עלמה? | ייעוץ, אסטרטגיה, שיווק, מכירות וצמיחה
                  </p>
                  <p>alma.ads2010@gmail.com</p>
                </div>

                <div>
                  <h4 className="text-[#003D47] font-bold mb-2 font-[family-name:var(--font-heebo)]">7. תנאים כלליים</h4>
                  <p>
                    ט.ל.ח. עלמה? רשאית לשנות את תנאי ההטבה בכל עת.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
