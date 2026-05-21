"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Calendar, Clock, MapPin, Eye, GraduationCap, CheckCircle2 } from "lucide-react" // Added CheckCircle2
import { useAuth } from "@/lib/auth-context"
import { useEvents } from "@/lib/event-context"
import { EventForm } from "@/components/event-form"
import { EventList } from "@/components/event-list"
import { VenueList } from "@/components/venue-list"
import { EventDialog } from "@/components/event-dialog"

export function StudentDashboard() {
  const { user } = useAuth()
  const { fetchMyEvents, fetchRegisteredEvents } = useEvents() // Added fetchRegisteredEvents
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [myEvents, setMyEvents] = useState([])
  const [registeredEvents, setRegisteredEvents] = useState([]) // New state for registered events
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMyEvents()
  }, [])

  const loadMyEvents = async () => {
    setLoading(true)
    try {
      const createdEvents = await fetchMyEvents()
      setMyEvents(createdEvents)

      const registered = await fetchRegisteredEvents() // Fetch registered events
      setRegisteredEvents(registered)
    } catch (error) {
      console.error("Failed to load events:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  const getStatusColor = (status: string) => {
    const colors = {
      pending_approval: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
      draft: "bg-blue-100 text-blue-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getStatusText = (status: string) => {
    const texts = {
      pending_approval: "Pending Approval",
      approved: "Approved",
      rejected: "Rejected",
      cancelled: "Cancelled",
      draft: "Draft",
    }
    return texts[status] || status
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-green-100 text-green-800">
            <GraduationCap className="h-3 w-3 mr-1" />
            Student
          </Badge>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{myEvents.length}</CardTitle>
            <CardDescription>My Created Events</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{registeredEvents.length}</CardTitle>
            <CardDescription>My Registered Events</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{myEvents.filter((e) => e.status === "approved").length}</CardTitle>
            <CardDescription>Approved Created Events</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{myEvents.filter((e) => e.status === "pending_approval").length}</CardTitle>
            <CardDescription>Pending Created Events</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Browse Events</TabsTrigger>
          <TabsTrigger value="my-events">My Created Events</TabsTrigger>
          <TabsTrigger value="my-registrations">My Registrations</TabsTrigger> {/* New Tab */}
          <TabsTrigger value="venues">Venues</TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          <EventList />
        </TabsContent>

        <TabsContent value="my-events" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid gap-4">
              {myEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge className={getStatusColor(event.status)}>{getStatusText(event.status)}</Badge>
                        </div>
                        {event.status === "rejected" && event.rejection_reason && (
                          <p className="text-sm text-red-600 mt-2">
                            <strong>Rejection reason:</strong> {event.rejection_reason}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedEvent(event)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(event.start_time)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.venue?.name}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {myEvents.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                  <p className="text-gray-500">Create your first event to get started!</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* New Tab Content for My Registrations */}
        <TabsContent value="my-registrations" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid gap-4">
              {registeredEvents.map((event) => (
                <Card key={event.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge className="bg-blue-100 text-blue-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Registered
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedEvent(event)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(event.start_time)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.venue?.name}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {registeredEvents.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No registered events</h3>
                  <p className="text-gray-500">You haven't registered for any events yet.</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="venues">
          <div className="mb-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Campus Venues</p>
                    <p className="text-sm text-blue-700">
                      Browse available venues for your events. Check capacity, facilities, and pricing.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <VenueList readonly={true} />
        </TabsContent>
      </Tabs>

      {selectedEvent && (
        <EventDialog event={selectedEvent} open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)} />
      )}

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create New Event</h2>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
              <EventForm
                onSuccess={() => {
                  setShowCreateForm(false)
                  loadMyEvents() // Refresh the events list
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
