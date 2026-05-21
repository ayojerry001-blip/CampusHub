"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface CtaSectionProps {
  onGetStartedClick: () => void
  onSignInClick: () => void
}

export function CtaSection({ onGetStartedClick, onSignInClick }: CtaSectionProps) {
  return (
    <section className="py-20 bg-fountain-green-500 text-white">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to Transform Your Campus Events?</h2>
        <p className="text-lg mb-10 opacity-90">
          Join the Fountain University community in revolutionizing campus event management with our comprehensive,
          user-friendly platform designed for academic excellence.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            onClick={onGetStartedClick}
            className="bg-white text-fountain-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onSignInClick}
            className="border-white text-white hover:bg-white hover:text-fountain-green-600 px-8 py-3 rounded-lg text-lg font-semibold bg-transparent"
          >
            Sign In to Account
          </Button>
        </div>
      </div>
    </section>
  )
}
