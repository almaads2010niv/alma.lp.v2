import type { Metadata } from "next";
import { Heebo, Assistant } from "next/font/google";
import Script from "next/script";
import "./globals.css";

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
  title: "עלמה? | מנגנון לפני פרסום — לעסקים מבוססי לידים",
  description:
    "פרסום בלי מנגנון הוא בזבוז כסף. אנחנו בונים מנגנוני שיווק ומכירות שעובדים — לפני שלוחצים על הגז. שיחת אבחון חינם.",
  openGraph: {
    title: "עלמה? | מנגנון לפני פרסום — לעסקים מבוססי לידים",
    description:
      "פרסום בלי מנגנון הוא בזבוז כסף. אנחנו בונים מנגנוני שיווק ומכירות שעובדים — לפני שלוחצים על הגז. שיחת אבחון חינם.",
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

        {/* Facebook Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '660125253756573');
            fbq('track', 'PageView');
          `}
        </Script>
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
