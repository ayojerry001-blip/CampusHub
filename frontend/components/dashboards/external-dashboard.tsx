"use client"

import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, ExternalLink, Plus, Clock, Eye, CheckCircle2 } from "lucide-react" // Added CheckCircle2
import { useAuth } from "@/lib/auth-context"
import { useEvents } from "@/lib/event-context"
import { EventList } from "@/components/event-list"
import { VenueList } from "@/components/venue-list"
import { EventForm } from "@/components/event-form"
import { apiService } from "@/lib/api"
import { EventDialog } from "@/components/event-dialog" // Ensure this is imported

export function ExternalDashboard() {
  const { user } = useAuth()
  const { fetchMyEvents, fetchRegisteredEvents } = useEvents() // Added fetchRegisteredEvents
  const [myEvents, setMyEvents] = useState([])
  const [registeredEvents, setRegisteredEvents] = useState([]) // New state for registered events
  const [loadingMyEvents, setLoadingMyEvents] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [totalApprovedEvents, setTotalApprovedEvents] = useState(0)
  const [totalVenues, setTotalVenues] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoadingMyEvents(true)
    try {
      const createdEvents = await fetchMyEvents()
      setMyEvents(createdEvents)

      const registered = await fetchRegisteredEvents() // Fetch registered events
      setRegisteredEvents(registered)

      const approvedEventsResponse = await apiService.getEvents({ status: "approved" })
      setTotalApprovedEvents(approvedEventsResponse.data?.length || approvedEventsResponse.length || 0)

      const venuesResponse = await apiService.getVenues()
      setTotalVenues(venuesResponse.data?.length || venuesResponse.length || 0)
    } catch (error) {
      console.error("Failed to load external dashboard data:", error)
    } finally {
      setLoadingMyEvents(false)
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
          <h1 className="text-2xl font-bold">Welcome to Campus Events</h1>
          <p className="text-gray-600">Discover and register for exciting campus events</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-purple-100 text-purple-800">
            <ExternalLink className="h-3 w-3 mr-1" />
            External User
          </Badge>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      {/* External User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{myEvents.length}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              My Created Events
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{registeredEvents.length}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              My Registered Events
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{totalApprovedEvents}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Available Events
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{totalVenues}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Available Venues
            </CardDescription>
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
          <div className="mb-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <ExternalLink className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">External User Access</p>
                    <p className="text-sm text-blue-700">
                      As an external user, you can browse and register for public campus events. Some events may require
                      payment.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <EventList />
        </TabsContent>

        <TabsContent value="my-events" className="space-y-4">
          {loadingMyEvents ? (
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No events created yet</h3>
                  <p className="text-gray-500">Create your first event to get started!</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* New Tab Content for My Registrations */}
        <TabsContent value="my-registrations" className="space-y-4">
          {loadingMyEvents ? (
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
                        <Button variant="outline" size="sm">
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
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Campus Venues</p>
                    <p className="text-sm text-green-700">
                      Explore our campus venues and their facilities. Contact us for private event bookings.
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
                  loadDashboardData() // Refresh the events list
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
