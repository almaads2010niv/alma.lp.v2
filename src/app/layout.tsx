import type { Metadata } from "next";
import { Heebo, Assistant } from "next/font/google";
import "./globals.css";
import PixelLoader from "@/components/PixelLoader";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  display: "swap",
});

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "עלמה? | מנגנון לפני פרסום",
  description:
    "לא מתחילים מהפתרון, מתחילים מאבחון. עלמה מלווה עסקים בייעוץ, אסטרטגיה, שיווק, מכירות וצמיחה. שיחת אבחון ללא עלות.",
  openGraph: {
    title: "עלמה? | מנגנון לפני פרסום",
    description:
      "לא מתחילים מהפתרון, מתחילים מאבחון. עלמה מלווה עסקים בייעוץ, אסטרטגיה, שיווק, מכירות וצמיחה. שיחת אבחון ללא עלות.",
    url: "https://lpsignals.alma-ads.co.il",
    type: "website",
    locale: "he_IL",
  },
  alternates: {
    canonical: "https://lpsignals.alma-ads.co.il",
  },
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    "theme-color": "#00BCD4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body
        className={`${heebo.variable} ${assistant.variable} font-[family-name:var(--font-assistant)] antialiased`}
      >
        <div className="noise-overlay" />
        {children}

        {/* Facebook Pixel — consent-aware, see PixelLoader */}
        <PixelLoader />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=660125253756573&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
