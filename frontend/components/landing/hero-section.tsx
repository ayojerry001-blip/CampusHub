"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck, GraduationCap, LifeBuoy, Award } from "lucide-react"

interface HeroSectionProps {
  onStartManagingClick: () => void
  onSignInClick: () => void
}

export function HeroSection({ onStartManagingClick, onSignInClick }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-fountain-green-50 to-white py-24 sm:py-32 lg:py-40 min-h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%2399e0ad' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0 0V0h2v36h-2v-2zM0 0h2v36H0V0zm0 36h36v2H0v-2zM36 0h2v2H36V0zm0 36h2v2H36v-2zM0 36h2v2H0v-2zM0 0h-2v2H0V0zm60 60h-2v-2h2v2zM60 0h-2v2h2V0zm0 36h-2v2h2v-2zM36 60h-2v-2h2v2zM0 60h-2v-2h2v2zM36 0h-2v-2h2v2zM60 36h-2v-2h2v2zM0 36h-2v-2h2v2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center rounded-full bg-fountain-green-100 px-3 py-1 text-sm font-medium text-fountain-green-700 mb-6">
          <Award className="h-4 w-4 mr-2" />
          Advanced Campus Event Management System
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Transform Your <span className="text-fountain-green-500">Campus Events</span>
        </h1>
        <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
          The comprehensive event management platform designed exclusively for Fountain University. From planning to
          execution, streamline every aspect of your campus events with intelligent automation and seamless
          collaboration.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Button
            size="lg"
            onClick={onStartManagingClick}
            className="bg-fountain-green-500 hover:bg-fountain-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold"
          >
            Start Managing Events
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onSignInClick}
            className="border-fountain-green-500 text-fountain-green-600 hover:bg-fountain-green-50 px-8 py-3 rounded-lg text-lg font-semibold bg-white"
          >
            Sign In to Account
          </Button>
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-gray-700 text-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-fountain-green-500" />
            Secure & Reliable
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-fountain-green-500" />
            University Approved
          </div>
          <div className="flex items-center gap-2">
            <LifeBuoy className="h-5 w-5 text-fountain-green-500" />
            24/7 Support
          </div>
        </div>
      </div>
    </section>
  )
}
