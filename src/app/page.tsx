"use client";

import { useState } from "react";
import { useUTM } from "@/lib/utm";
import StickyBar from "@/components/StickyBar";
import NotificationQueue from "@/components/NotificationQueue";
import ExitIntent from "@/components/ExitIntent";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import CookieConsent from "@/components/CookieConsent";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import VossBlock from "@/components/VossBlock";
import AdaptiveQuiz from "@/components/AdaptiveQuiz";
import PersonalizedBlock from "@/components/PersonalizedBlock";
import ComparisonTable from "@/components/ComparisonTable";
import Testimonials from "@/components/Testimonials";
import GuiltRelease from "@/components/GuiltRelease";
import PricingTable from "@/components/PricingTable";
import LeadsCalculator from "@/components/LeadsCalculator";
import YouTubeGallery from "@/components/YouTubeGallery";
import SmartCountdown from "@/components/SmartCountdown";
import SpotsCounter from "@/components/SpotsCounter";
import VideoSection from "@/components/VideoSection";
import RiskReversal from "@/components/RiskReversal";
import HowItWorks from "@/components/HowItWorks";
import CheckoutForm from "@/components/CheckoutForm";
import Footer from "@/components/Footer";

export default function Home() {
  const [archetype, setArchetype] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [businessType, setBusinessType] = useState<string | null>(null);
  const [quizName, setQuizName] = useState<string | null>(null);
  const [quizPhone, setQuizPhone] = useState<string | null>(null);
  const [checkoutSubmitted, setCheckoutSubmitted] = useState(false);
  const utm = useUTM();

  return (
    <main>
      {/* ── Overlays (fixed/floating) ── */}
      <StickyBar />
      <NotificationQueue />
      <ExitIntent archetype={archetype} />
      <AccessibilityWidget />
      <CookieConsent />
      <WhatsAppFloat archetype={archetype} businessName={businessName} quizName={quizName} quizPhone={quizPhone} alreadySubmitted={checkoutSubmitted} />

      {/* ── Hero + Trust ── */}
      <Hero />
      <SocialProof />

      {/* ── Persuasion + Quiz ── */}
      <VossBlock />
      <AdaptiveQuiz
        onResult={(result) => {
          setArchetype(result.primary);
          setBusinessName(result.businessName || null);
          setBusinessType(result.businessType || null);
          setQuizName(result.quizName || null);
          setQuizPhone(result.quizPhone || null);
        }}
      />

      {/* ── Personalized Content (after quiz) ── */}
      {archetype && <PersonalizedBlock archetype={archetype} />}
      <ComparisonTable archetype={archetype} />
      <Testimonials archetype={archetype} />

      {/* ── Emotional + Value ── */}
      <GuiltRelease archetype={archetype} />
      <PricingTable archetype={archetype} />
      <LeadsCalculator archetype={archetype} />

      {/* ── Content + Urgency ── */}
      <YouTubeGallery />
      <SmartCountdown archetype={archetype} />
      <SpotsCounter archetype={archetype} />

      {/* ── Trust + Process ── */}
      <VideoSection />
      <RiskReversal archetype={archetype} />
      <HowItWorks archetype={archetype} />

      {/* ── Conversion ── */}
      <CheckoutForm
        archetype={archetype}
        businessName={businessName}
        businessType={businessType}
        utm={utm}
        onSuccess={() => setCheckoutSubmitted(true)}
      />
      <Footer />
    </main>
  );
}
