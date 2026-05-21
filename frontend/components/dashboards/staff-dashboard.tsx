"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check, X, Calendar, Clock, MapPin, User, Eye, Plus, Building } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useEvents } from "@/lib/event-context"
import { EventForm } from "@/components/event-form"
import { VenueList } from "@/components/venue-list"

export function StaffDashboard() {
  const { user } = useAuth()
  const { approveEvent, rejectEvent, loading, fetchPendingEvents, fetchEvents } = useEvents()
  const [pendingEvents, setPendingEvents] = useState([])
  const [approvedEvents, setApprovedEvents] = useState([])
  const [rejectedEvents, setRejectedEvents] = useState([])
  const [rejectDialog, setRejectDialog] = useState({ open: false, eventId: null, reason: "" })
  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setDashboardLoading(true)
    try {
      const pending = await fetchPendingEvents()
      setPendingEvents(pending)

      // Correctly capture the returned data from fetchEvents
      const approved = await fetchEvents({ status: "approved" })
      setApprovedEvents(approved) // Now 'approved' will be the array of events

      const rejected = await fetchEvents({ status: "rejected" })
      setRejectedEvents(rejected) // Now 'rejected' will be the array of events
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setDashboardLoading(false)
    }
  }

  if (!user) return null

  const handleApprove = async (eventId: number) => {
    await approveEvent(eventId)
    loadDashboardData()
  }

  const handleReject = async () => {
    if (!rejectDialog.eventId || !rejectDialog.reason.trim()) return

    await rejectEvent(rejectDialog.eventId, rejectDialog.reason)
    setRejectDialog({ open: false, eventId: null, reason: "" })
    loadDashboardData()
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

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Staff Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-blue-100 text-blue-800">
            <Building className="h-3 w-3 mr-1" />
            Staff Member
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
            <CardTitle className="text-2xl">{pendingEvents.length}</CardTitle>
            <CardDescription>Pending Approval</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{approvedEvents.length}</CardTitle>
            <CardDescription>Approved Events</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{rejectedEvents.length}</CardTitle>
            <CardDescription>Rejected Events</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              {pendingEvents.length + approvedEvents.length + rejectedEvents.length}
            </CardTitle>
            <CardDescription>Total Events</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending Approval ({pendingEvents.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="venues">Venues</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4">
            {pendingEvents.map((event) => (
              <Card key={event.id} className="border-l-4 border-l-yellow-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>
                      </div>
                      {event.rejection_reason && (
                        <p className="text-sm text-red-600 mt-2">
                          <strong>Rejection reason:</strong> {event.rejection_reason}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:bg-green-50 bg-transparent"
                        onClick={() => handleApprove(event.id)}
                        disabled={loading}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50 bg-transparent"
                        onClick={() => setRejectDialog({ open: true, eventId: event.id, reason: "" })}
                        disabled={loading}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-gray-600">
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
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{event.organizer?.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {pendingEvents.length === 0 && (
              <div className="text-center py-8">
                <Check className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending events</h3>
                <p className="text-gray-500">All events have been reviewed.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <div className="grid gap-4">
            {approvedEvents.map((event) => (
              <Card key={event.id} className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-green-100 text-green-800">Approved</Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-gray-600">
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
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{event.organizer?.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {approvedEvents.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No approved events</h3>
                <p className="text-gray-500">There are no approved events to display.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <div className="grid gap-4">
            {rejectedEvents.map((event) => (
              <Card key={event.id} className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                      </div>
                      {event.rejection_reason && (
                        <p className="text-sm text-red-600 mt-2">
                          <strong>Reason:</strong> {event.rejection_reason}
                        </p>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-gray-600">
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
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{event.organizer?.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {rejectedEvents.length === 0 && (
              <div className="text-center py-8">
                <X className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No rejected events</h3>
                <p className="text-gray-500">There are no rejected events to display.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="venues">
          <div className="mb-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Campus Venues</p>
                    <p className="text-sm text-blue-700">Manage and view all campus venues.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <VenueList />
        </TabsContent>
      </Tabs>

      {/* Reject Event Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog({ ...rejectDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Event</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this event. This will be sent to the organizer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Enter the reason for rejection..."
                value={rejectDialog.reason}
                onChange={(e) => setRejectDialog({ ...rejectDialog, reason: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog({ open: false, eventId: null, reason: "" })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectDialog.reason.trim() || loading}>
              {loading ? "Rejecting..." : "Reject Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
