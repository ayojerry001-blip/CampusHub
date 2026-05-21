"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

interface HomePageProps {
  onLoginClick: () => void
  onRegisterClick: () => void
}

export function HomePage({ onLoginClick, onRegisterClick }: HomePageProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <CardTitle className="text-3xl font-bold text-gray-900">Campus Events</CardTitle>
        <CardDescription className="text-gray-600">Manage and discover campus events</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-gray-700">
          Welcome to the Campus Event Management System! Whether you're a student looking for exciting activities, staff
          organizing an event, or an external user interested in campus happenings, our platform connects you to a
          vibrant community of events.
        </p>
        <div className="flex flex-col gap-2">
          <Button onClick={onLoginClick} className="w-full bg-green-600 hover:bg-green-700">
            Login
          </Button>
          <Button
            variant="outline"
            onClick={onRegisterClick}
            className="w-full border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
          >
            Register
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
