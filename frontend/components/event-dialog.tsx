"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, Users, User } from "lucide-react"
import { useEvents } from "@/lib/event-context"

interface Event {
  id: number
  title: string
  description: string
  event_date: string
  start_time: string
  end_time?: string
  category: string
  organizer?: {
    // Made optional
    name: string
  }
  venue?: {
    // Made optional
    name: string
    location: string
  }
  capacity: number
  registered_count: number
  image_path?: string
}

interface EventDialogProps {
  event: Event
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EventDialog({ event, open, onOpenChange }: EventDialogProps) {
  const [isRegistering, setIsRegistering] = useState(false)
  const { registerForEvent } = useEvents()

  const handleRegister = async () => {
    setIsRegistering(true)
    await registerForEvent(event.id)
    setIsRegistering(false)
    onOpenChange(false)
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Technology: "bg-blue-100 text-blue-800",
      Career: "bg-green-100 text-green-800",
      Cultural: "bg-purple-100 text-purple-800",
      Academic: "bg-orange-100 text-orange-800",
      Health: "bg-pink-100 text-pink-800",
      Business: "bg-yellow-100 text-yellow-800",
      Sports: "bg-red-100 text-red-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start gap-4">
            <DialogTitle className="text-xl">{event.title}</DialogTitle>
            <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <img
            src={
              event.image_path
                ? `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/storage/${event.image_path}`
                : "/placeholder.svg?height=300&width=600"
            }
            alt={event.title}
            className="w-full h-64 object-cover rounded-lg"
          />

          <DialogDescription className="text-base">{event.description}</DialogDescription>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Date:</span>
                <span>{formatDate(event.event_date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Time:</span>
                <span>{formatTime(event.start_time)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Location:</span>
                <span>
                  {event.venue?.name} - {event.venue?.location}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Organizer:</span>
                <span>{event.organizer?.name || "N/A"}</span> {/* Added optional chaining and fallback */}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Capacity:</span>
                <span>
                  {event.registered_count}/{event.capacity}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(event.registered_count / event.capacity) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={handleRegister}
            disabled={event.registered_count >= event.capacity || isRegistering}
            className="min-w-24"
          >
            {isRegistering ? "Registering..." : event.registered_count >= event.capacity ? "Event Full" : "Register"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
