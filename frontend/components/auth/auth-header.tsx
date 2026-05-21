"use client"

import { Button } from "@/components/ui/button"
import { Award, ArrowRight } from "lucide-react"

interface AuthHeaderProps {
  currentView: "home" | "login" | "register"
  onNavigate: (view: "home" | "login" | "register") => void
}

export function AuthHeader({ currentView, onNavigate }: AuthHeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 py-6 px-4 sm:px-6 lg:px-8 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Award className="h-8 w-8 text-fountain-green-500" />
          <span className="text-xl font-bold text-gray-900">CampusHub</span>
          <span className="text-sm text-gray-600 hidden md:inline">Campus Event Management</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => onNavigate("home")}>
            Home
          </Button>
          {currentView === "login" && (
            <Button
              onClick={() => onNavigate("register")}
              className="bg-fountain-green-500 hover:bg-fountain-green-600"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {currentView === "register" && (
            <Button onClick={() => onNavigate("login")} className="bg-fountain-green-500 hover:bg-fountain-green-600">
              Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
