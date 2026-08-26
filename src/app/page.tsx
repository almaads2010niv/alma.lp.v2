"use client";

import { useState } from "react";
import { useUTM } from "@/lib/utm";
import StickyBar from "@/components/StickyBar";
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
import VideoSection from "@/components/VideoSection";
import RiskReversal from "@/components/RiskReversal";
import HowItWorks from "@/components/HowItWorks";
import CheckoutForm from "@/components/CheckoutForm";
import Footer from "@/components/Footer";

// Removed from the page (kept in the codebase, disabled):
// - NotificationQueue — fabricated user activity (fake FOMO). Re-enable only
//   with a real data source.
// - SpotsCounter — artificial scarcity (spots computed from the calendar).
// - SmartCountdown — countdown to end of month with no real enrollment window.

export default function Home() {
  // diagnosis — WHAT we say (business gap, shown to the user)
  // archetype — HOW we say it (internal tone, never shown)
  const [archetype, setArchetype] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
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
      <ExitIntent archetype={archetype} />
      <AccessibilityWidget />
      <CookieConsent />
      <WhatsAppFloat diagnosis={diagnosis} archetype={archetype} businessName={businessName} quizName={quizName} quizPhone={quizPhone} alreadySubmitted={checkoutSubmitted} />

      {/* ── CLOSER flow ── */}
      {/* Hook: hypothesis, not diagnosis */}
      <Hero />
      <SocialProof />

      {/* Symptoms — recognition, not accusation */}
      <VossBlock />

      {/* C — Clarify: the business diagnosis quiz */}
      <AdaptiveQuiz
        utm={utm}
        onResult={(result) => {
          setArchetype(result.primary);
          setDiagnosis(result.diagnosis);
          setBusinessName(result.businessName || null);
          setBusinessType(result.businessType || null);
          setQuizName(result.quizName || null);
          setQuizPhone(result.quizPhone || null);
        }}
      />

      {/* L + O — Label the gap, explain why it persists */}
      {diagnosis && <PersonalizedBlock diagnosis={diagnosis} />}
      <GuiltRelease diagnosis={diagnosis} />

      {/* Self-evidence: the visitor's own funnel numbers */}
      <LeadsCalculator />

      {/* Why Alma approaches it differently */}
      <ComparisonTable />
      <Testimonials archetype={archetype} />

      {/* S — Sell the vacation: three pillars + the diagnostic call */}
      <PricingTable />

      {/* Content + proof */}
      <YouTubeGallery />
      <VideoSection />

      {/* Process — diagnosis before prescription */}
      <HowItWorks />

      {/* E — Explain away concerns */}
      <RiskReversal archetype={archetype} />

      {/* R — Conversion + reinforce */}
      <CheckoutForm
        archetype={archetype}
        businessName={businessName}
        businessType={businessType}
        quizName={quizName}
        quizPhone={quizPhone}
        utm={utm}
        onSuccess={() => setCheckoutSubmitted(true)}
      />
      <Footer />
    </main>
  );
}
