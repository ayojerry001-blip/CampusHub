"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "./auth-context"
import { apiService } from "./api"

interface Event {
  id: number
  title: string
  description: string
  event_date: string
  start_time: string
  end_time?: string
  location?: string
  category: string
  organizer: {
    id: number
    name: string
    email: string
  }
  venue: {
    id: number
    name: string
    location: string
    capacity: number
  }
  capacity: number
  registered_count: number
  status: "draft" | "pending_approval" | "approved" | "rejected" | "cancelled"
  rejection_reason?: string
  additional_features?: string[]
  total_cost: number
  image_path?: string
  approved_by?: number
  approved_at?: string
  created_at: string
  updated_at: string
}

interface EventContextType {
  events: Event[]
  loading: boolean
  createEvent: (eventData: any) => Promise<void>
  updateEvent: (eventId: number, eventData: any) => Promise<void>
  deleteEvent: (eventId: number) => Promise<void>
  approveEvent: (eventId: number) => Promise<void>
  rejectEvent: (eventId: number, reason: string) => Promise<void>
  registerForEvent: (eventId: number) => Promise<void>
  fetchEvents: (params?: any) => Promise<Event[]>
  fetchMyEvents: () => Promise<Event[]>
  fetchPendingEvents: () => Promise<Event[]>
  fetchRegisteredEvents: () => Promise<Event[]> // New: Fetch events user has registered for
}

const EventContext = createContext<EventContextType | undefined>(undefined)

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const fetchEvents = useCallback(
    async (params?: any): Promise<Event[]> => {
      setLoading(true)
      try {
        const response = await apiService.getEvents(params)
        const fetchedEvents = response.data || response
        setEvents(fetchedEvents)
        return fetchedEvents
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch events",
          variant: "destructive",
        })
        return []
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setEvents, toast],
  )

  const createEvent = useCallback(
    async (eventData: any) => {
      if (!user) return

      setLoading(true)
      try {
        const response = await apiService.createEvent({
          ...eventData,
          venue_id: eventData.venueId,
        })

        toast({
          title: "Event Created",
          description:
            user.role === "admin"
              ? "Your event has been created and approved."
              : "Your event has been submitted for approval.",
        })

        await fetchEvents()
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to create event",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [user, setLoading, toast, fetchEvents],
  )

  const updateEvent = useCallback(
    async (eventId: number, eventData: any) => {
      if (!user) return

      setLoading(true)
      try {
        const response = await apiService.updateEvent(eventId.toString(), {
          ...eventData,
          venue_id: eventData.venueId,
        })

        toast({
          title: "Event Updated",
          description: "The event has been updated successfully.",
        })

        setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, ...response.data } : event)))
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to update event",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [user, setLoading, setEvents, toast],
  )

  const deleteEvent = useCallback(
    async (eventId: number) => {
      if (!user) return

      setLoading(true)
      try {
        await apiService.deleteEvent(eventId.toString())

        toast({
          title: "Event Deleted",
          description: "The event has been successfully deleted.",
          variant: "destructive",
        })

        setEvents((prev) => prev.filter((event) => event.id !== eventId))
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete event",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [user, setLoading, setEvents, toast],
  )

  const approveEvent = useCallback(
    async (eventId: number) => {
      if (!user || (user.role !== "staff" && user.role !== "admin")) return

      setLoading(true)
      try {
        await apiService.approveEvent(eventId.toString())

        toast({
          title: "Event Approved",
          description: "The event has been approved and is now live.",
        })

        setEvents((prev) =>
          prev.map((event) =>
            event.id === eventId
              ? { ...event, status: "approved" as const, approved_by: user.id, approved_at: new Date().toISOString() }
              : event,
          ),
        )
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to approve event",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [user, setLoading, setEvents, toast],
  )

  const rejectEvent = useCallback(
    async (eventId: number, reason: string) => {
      if (!user || (user.role !== "staff" && user.role !== "admin")) return

      setLoading(true)
      try {
        await apiService.rejectEvent(eventId.toString(), reason)

        toast({
          title: "Event Rejected",
          description: "The event has been rejected.",
          variant: "destructive",
        })

        setEvents((prev) =>
          prev.map((event) =>
            event.id === eventId ? { ...event, status: "rejected" as const, rejection_reason: reason } : event,
          ),
        )
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to reject event",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [user, setLoading, setEvents, toast],
  )

  const registerForEvent = useCallback(
    async (eventId: number) => {
      if (!user) return

      setLoading(true)
      try {
        await apiService.registerForEvent(eventId.toString())

        toast({
          title: "Registration Successful",
          description: "You have been registered for this event.",
        })

        setEvents((prev) =>
          prev.map((event) =>
            event.id === eventId ? { ...event, registered_count: event.registered_count + 1 } : event,
          ),
        )
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to register for event",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [user, setLoading, setEvents, toast],
  )

  const fetchMyEvents = useCallback(async (): Promise<Event[]> => {
    try {
      const response = await apiService.getMyEvents()
      return response.data || response
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch your events",
        variant: "destructive",
      })
      return []
    }
  }, [toast])

  const fetchPendingEvents = useCallback(async (): Promise<Event[]> => {
    try {
      const response = await apiService.getPendingEvents()
      return response.data || response
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch pending events",
        variant: "destructive",
      })
      return []
    }
  }, [toast])

  // New: Fetch events the current user has registered for
  const fetchRegisteredEvents = useCallback(async (): Promise<Event[]> => {
    try {
      const response = await apiService.getRegisteredEvents()
      return response.data || response
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch registered events",
        variant: "destructive",
      })
      return []
    }
  }, [toast])

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        createEvent,
        updateEvent,
        deleteEvent,
        approveEvent,
        rejectEvent,
        registerForEvent,
        fetchEvents,
        fetchMyEvents,
        fetchPendingEvents,
        fetchRegisteredEvents, // Added to context
      }}
    >
      {children}
    </EventContext.Provider>
  )
}

export function useEvents() {
  const context = useContext(EventContext)
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventProvider")
  }
  return context
}
