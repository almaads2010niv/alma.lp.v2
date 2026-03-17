"use client";

import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#1E1245] text-white overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-l from-[#00BCD4] via-[#6B4FA0] to-[#00BCD4]" />

      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#6B4FA0]/10 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand Column */}
          <div>
            <h3 className="font-[family-name:var(--font-heebo)] font-black text-3xl text-[#00BCD4] mb-4">
              עלמה?
            </h3>
            <p className="font-[family-name:var(--font-heebo)] text-white/60 text-sm leading-relaxed max-w-xs">
              מנגנוני צמיחה לעסקים מבוססי לידים. בונים את הבסיס לפני שלוחצים על הגז.
            </p>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-[family-name:var(--font-heebo)] font-bold text-lg mb-5 text-white/90">
              צרו קשר
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:0557294068"
                  className="flex items-center gap-3 text-white/70 hover:text-[#00BCD4] transition-colors duration-300 group"
                  dir="ltr"
                >
                  <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-white/5 group-hover:bg-[#00BCD4]/20 flex items-center justify-center transition-colors duration-300">
                    <Phone className="w-4 h-4" />
                  </span>
                  <span className="font-[family-name:var(--font-heebo)] text-sm">
                    055-7294068
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:niv@alma-ads.co.il"
                  className="flex items-center gap-3 text-white/70 hover:text-[#00BCD4] transition-colors duration-300 group"
                  dir="ltr"
                >
                  <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-white/5 group-hover:bg-[#00BCD4]/20 flex items-center justify-center transition-colors duration-300">
                    <Mail className="w-4 h-4" />
                  </span>
                  <span className="font-[family-name:var(--font-heebo)] text-sm">
                    niv@alma-ads.co.il
                  </span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-white/70">
                  <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <span className="font-[family-name:var(--font-heebo)] text-sm">
                    הגיא 25, יקנעם עילית
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="font-[family-name:var(--font-heebo)] font-bold text-lg mb-5 text-white/90">
              קישורים
            </h4>
            <ul className="space-y-3">
              <li>
                <button className="text-white/60 hover:text-[#00BCD4] transition-colors duration-300 font-[family-name:var(--font-heebo)] text-sm cursor-pointer">
                  מדיניות פרטיות
                </button>
              </li>
              <li>
                <button className="text-white/60 hover:text-[#00BCD4] transition-colors duration-300 font-[family-name:var(--font-heebo)] text-sm cursor-pointer">
                  תנאי שימוש
                </button>
              </li>
            </ul>

            {/* Social links placeholder */}
            <div className="mt-8">
              <h4 className="font-[family-name:var(--font-heebo)] font-bold text-sm mb-3 text-white/50">
                עקבו אחרינו
              </h4>
              <div className="flex items-center gap-3">
                {/* Facebook placeholder */}
                <span className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#00BCD4]/20 flex items-center justify-center transition-colors duration-300 cursor-pointer text-white/50 hover:text-[#00BCD4]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </span>
                {/* Instagram placeholder */}
                <span className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#00BCD4]/20 flex items-center justify-center transition-colors duration-300 cursor-pointer text-white/50 hover:text-[#00BCD4]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </span>
                {/* LinkedIn placeholder */}
                <span className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#00BCD4]/20 flex items-center justify-center transition-colors duration-300 cursor-pointer text-white/50 hover:text-[#00BCD4]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-14 pt-8 border-t border-white/10">
          <p className="text-center text-white/40 text-sm font-[family-name:var(--font-heebo)]">
            &copy; 2026 &ldquo;עלמה?&rdquo; &mdash; מנגנוני צמיחה לעסקים מבוססי לידים
          </p>
        </div>
      </div>
    </footer>
  );
}
