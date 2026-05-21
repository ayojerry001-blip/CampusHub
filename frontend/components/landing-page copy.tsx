"use client"

import { Header } from "./landing/header"
import { HeroSection } from "./landing/hero-section"
import { FeaturesSection } from "./landing/features-section"
import { StatsSection } from "./landing/stats-section"
import { CtaSection } from "./landing/cta-section"
import { Footer } from "./landing/footer"

interface LandingPageProps {
  onLoginClick: () => void
  onRegisterClick: () => void
}

export function LandingPage({ onLoginClick, onRegisterClick }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onSignInClick={onLoginClick} onGetStartedClick={onRegisterClick} />
      <HeroSection onStartManagingClick={onRegisterClick} onSignInClick={onLoginClick} />
      <FeaturesSection />
      <StatsSection />
      <CtaSection onGetStartedClick={onRegisterClick} onSignInClick={onLoginClick} />
      <Footer />
    </div>
  )
}
