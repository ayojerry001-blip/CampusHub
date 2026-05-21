"use client"

import { useState } from "react"
import { Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { EventProvider } from "@/lib/event-context"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { StudentDashboard } from "@/components/dashboards/student-dashboard"
import { StaffDashboard } from "@/components/dashboards/staff-dashboard"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { ExternalDashboard } from "@/components/dashboards/external-dashboard"
// import { LandingPage } from "@/components/landing-page" // Import the new LandingPage component
import IndependentLandingPage from "@/components/landing-page" // Import the new IndependentLandingPage component
import { AuthHeader } from "@/components/auth/auth-header"

function MainApp() {
  const { user, logout, loading } = useAuth()
  // New state to manage the current view for unauthenticated users
  const [currentAuthView, setCurrentAuthView] = useState<"home" | "login" | "register">("home")

  const handleLoginClick = () => setCurrentAuthView("login")
  const handleRegisterClick = () => setCurrentAuthView("register")
  // This function will be passed to LoginForm and RegisterForm to toggle between them
  const handleToggleAuthForm = () => {
    setCurrentAuthView((prev) => (prev === "login" ? "register" : "login"))
  }

  const renderDashboard = () => {
    if (!user) return null

    switch (user.role) {
      case "admin":
        return <AdminDashboard />
      case "staff":
        return <StaffDashboard />
      case "student":
        return <StudentDashboard />
      case "external":
        return <ExternalDashboard />
      default:
        return (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unknown Role</h3>
            <p className="text-gray-500">Your account role is not recognized. Please contact support.</p>
          </div>
        )
    }
  }

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      admin: "Administrator",
      staff: "Staff Member",
      student: "Student",
      external: "External User",
    }
    return roleNames[role] || role
  }

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "bg-red-100 text-red-800",
      staff: "bg-blue-100 text-blue-800",
      student: "bg-green-100 text-green-800",
      external: "bg-purple-100 text-purple-800",
    }
    return colors[role] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col">
        {currentAuthView !== "home" && <AuthHeader currentView={currentAuthView} onNavigate={setCurrentAuthView} />}
        <div className="flex-1 flex items-center justify-center p-4">
          {currentAuthView === "home" && (
            <IndependentLandingPage onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
          )}
          {currentAuthView === "login" && <LoginForm onToggleMode={handleToggleAuthForm} />}
          {currentAuthView === "register" && <RegisterForm onToggleMode={handleToggleAuthForm} />}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">CampusHub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm text-gray-600">{user.name}</span>
                <span className={`text-xs px-2 py-1 rounded capitalize ${getRoleColor(user.role)}`}>
                  {getRoleDisplayName(user.role)}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderDashboard()}</main>
    </div>
  )
}

export default function CampusEventSystem() {
  return (
    <AuthProvider>
      <EventProvider>
        <MainApp />
      </EventProvider>
    </AuthProvider>
  )
}
