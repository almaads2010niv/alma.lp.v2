"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Send, Loader2, Phone, MessageCircle, Clock, Sparkles, ArrowLeft } from "lucide-react";
import { getArchetypeContent } from "@/data/archetypeContent";
import { trackLeadSubmit } from "@/lib/analytics";
import type { UTMData } from "@/lib/utm";

interface CheckoutFormProps {
  archetype?: string | null;
  businessName?: string | null;
  businessType?: string | null;
  utm?: UTMData;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  consent: boolean;
  antiSpam: string;
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function CheckoutForm({ archetype, businessName, businessType, utm }: CheckoutFormProps) {
  const content = getArchetypeContent(archetype);
  const sectionContent = content?.checkoutForm;

  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    consent: false,
    antiSpam: "",
  });

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!formData.name.trim()) {
      setError("נא להזין שם");
      return;
    }
    if (!formData.phone.trim()) {
      setError("נא להזין טלפון");
      return;
    }

    // Anti-spam validation
    if (formData.antiSpam.trim() !== "5") {
      setError("התשובה לשאלת האבטחה שגויה");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || "",
          marketing_consent: formData.consent,
          archetype: archetype || undefined,
          businessName: businessName || undefined,
          businessType: businessType || undefined,
          ...(utm && Object.keys(utm).length > 0 ? { utm } : {}),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      // Fire Facebook Pixel Lead event
      trackLeadSubmit(archetype || undefined, businessName || undefined);

      setStep(2);
    } catch {
      setError("משהו השתבש. נסו שוב או צרו קשר ישירות.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="checkout" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#00BCD4]/[0.04] to-white" />

      <div className="relative z-10 max-w-xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block text-[#00BCD4] text-sm font-bold tracking-widest mb-4 font-[family-name:var(--font-heebo)]">
            {sectionContent?.subtitle ?? "בואו נתחיל"}
          </span>
          <h2 className="font-[family-name:var(--font-heebo)] font-black text-3xl sm:text-4xl text-[#003D47]">
            {sectionContent?.header ?? "מוכנים לבנות מנגנון שעובד?"}
          </h2>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-white border border-gray-200 rounded-3xl shadow-lg overflow-hidden"
        >
          {/* Teal accent on top */}
          <div className="h-1.5 bg-gradient-to-r from-[#00BCD4] via-[#00ACC1] to-[#6B4FA0]" />

          <div className="p-8 sm:p-10">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="checkout-name"
                      className="block font-[family-name:var(--font-heebo)] font-semibold text-sm text-[#003D47] mb-2"
                    >
                      שם מלא <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="checkout-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="השם שלכם"
                      className="w-full border border-gray-300 rounded-xl px-5 py-3.5 text-base font-[family-name:var(--font-assistant)] text-[#003D47] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/40 focus:border-[#00BCD4] transition-all duration-200"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="checkout-phone"
                      className="block font-[family-name:var(--font-heebo)] font-semibold text-sm text-[#003D47] mb-2"
                    >
                      טלפון <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      required
                      dir="ltr"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="050-0000000"
                      className="w-full border border-gray-300 rounded-xl px-5 py-3.5 text-base font-[family-name:var(--font-assistant)] text-[#003D47] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/40 focus:border-[#00BCD4] transition-all duration-200 text-left"
                    />
                  </div>

                  {/* Email (optional) */}
                  <div>
                    <label
                      htmlFor="checkout-email"
                      className="block font-[family-name:var(--font-heebo)] font-semibold text-sm text-[#003D47] mb-2"
                    >
                      אימייל{" "}
                      <span className="text-gray-400 font-normal">(לא חובה)</span>
                    </label>
                    <input
                      id="checkout-email"
                      type="email"
                      dir="ltr"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="name@email.com"
                      className="w-full border border-gray-300 rounded-xl px-5 py-3.5 text-base font-[family-name:var(--font-assistant)] text-[#003D47] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/40 focus:border-[#00BCD4] transition-all duration-200 text-left"
                    />
                  </div>

                  {/* Marketing Consent */}
                  <div className="flex items-start gap-3">
                    <input
                      id="checkout-consent"
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) => handleChange("consent", e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-[#00BCD4] focus:ring-[#00BCD4] cursor-pointer accent-[#00BCD4]"
                    />
                    <label
                      htmlFor="checkout-consent"
                      className="font-[family-name:var(--font-assistant)] text-sm text-gray-500 cursor-pointer leading-relaxed"
                    >
                      אני מסכים/ה לקבל חומרים שיווקיים ועדכונים מעלמה
                    </label>
                  </div>

                  {/* Anti-spam */}
                  <div>
                    <label
                      htmlFor="checkout-antispam"
                      className="block font-[family-name:var(--font-heebo)] font-semibold text-sm text-[#003D47] mb-2"
                    >
                      כמה זה 2 ועוד 3? <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="checkout-antispam"
                      type="text"
                      required
                      dir="ltr"
                      value={formData.antiSpam}
                      onChange={(e) => handleChange("antiSpam", e.target.value)}
                      placeholder="?"
                      className="w-full border border-gray-300 rounded-xl px-5 py-3.5 text-base font-[family-name:var(--font-assistant)] text-[#003D47] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/40 focus:border-[#00BCD4] transition-all duration-200 text-left max-w-[120px]"
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm font-[family-name:var(--font-heebo)] font-semibold"
                    >
                      {error}
                    </motion.p>
                  )}

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="w-full cta-glow bg-[#00BCD4] hover:bg-[#00ACC1] disabled:bg-gray-400 text-white font-[family-name:var(--font-heebo)] font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>שולח...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>{sectionContent?.ctaText ?? "שליחת פרטים"}</span>
                      </>
                    )}
                  </motion.button>

                  {/* Privacy note */}
                  <p className="text-center text-xs text-gray-400 font-[family-name:var(--font-assistant)]">
                    הפרטים שלכם מאובטחים ולא יועברו לגורם שלישי
                  </p>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 20,
                  }}
                  className="text-center py-6"
                >
                  {/* Success checkmark animation */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: 0.15,
                    }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mb-5"
                  >
                    <Check className="w-10 h-10" strokeWidth={3} />
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-[family-name:var(--font-heebo)] font-bold text-2xl text-[#003D47] mb-2"
                  >
                    {businessName ? `תודה, ${formData.name}! 🎉` : "תודה! הפרטים התקבלו 🎉"}
                  </motion.h3>

                  {businessName && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 }}
                      className="font-[family-name:var(--font-assistant)] text-[#00BCD4] font-semibold text-lg mb-4"
                    >
                      כבר מתכוננים לדבר על {businessName}
                    </motion.p>
                  )}

                  {/* What happens next — 3 steps */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-right space-y-3 my-6"
                  >
                    <p className="font-[family-name:var(--font-heebo)] font-bold text-sm text-[#6B4FA0] tracking-wide text-center mb-3">
                      מה קורה עכשיו?
                    </p>
                    {[
                      { icon: <Phone className="w-4 h-4" />, text: "ניצור איתכם קשר תוך 24 שעות" },
                      { icon: <Clock className="w-4 h-4" />, text: "נקבע שיחת אבחון חינם של 30 דקות" },
                      { icon: <Sparkles className="w-4 h-4" />, text: "נבנה יחד מנגנון שעובד בשביל העסק" },
                    ].map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00BCD4]/10 text-[#00BCD4] flex items-center justify-center font-bold text-sm">
                          {step.icon}
                        </div>
                        <p className="font-[family-name:var(--font-assistant)] text-gray-700 text-sm">
                          {step.text}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* WhatsApp CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="space-y-3"
                  >
                    <p className="font-[family-name:var(--font-assistant)] text-gray-500 text-sm">
                      לא רוצים לחכות? דברו איתנו עכשיו:
                    </p>
                    <a
                      href={`https://wa.me/972557294068?text=${encodeURIComponent(
                        businessName
                          ? `היי ניב, השארתי פרטים בדף הנחיתה 👋\nשם העסק: ${businessName}\nאשמח לקבוע שיחת אבחון.`
                          : "היי ניב, השארתי פרטים בדף הנחיתה 👋\nאשמח לקבוע שיחת אבחון."
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-[family-name:var(--font-heebo)] font-bold px-6 py-3 rounded-xl transition-colors duration-300"
                    >
                      <MessageCircle className="w-5 h-5 fill-white" />
                      שלחו הודעה בוואטסאפ
                      <ArrowLeft className="w-4 h-4" />
                    </a>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
