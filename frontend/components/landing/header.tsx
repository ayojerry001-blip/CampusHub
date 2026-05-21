"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Award } from "lucide-react"

interface HeaderProps {
  onSignInClick: () => void
  onGetStartedClick: () => void
}

export function Header({ onSignInClick, onGetStartedClick }: HeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Award className="h-8 w-8 text-fountain-green-500" />
          <span className="text-xl font-bold text-gray-900">CampusHub</span>
          <span className="text-sm text-gray-600 hidden md:inline">Campus Event Management</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <Button variant="ghost" onClick={onSignInClick}>
              Sign In
            </Button>
          </div>
          <Button onClick={onGetStartedClick} className="bg-fountain-green-500 hover:bg-fountain-green-600">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
