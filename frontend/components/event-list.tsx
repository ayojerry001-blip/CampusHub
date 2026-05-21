"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Search, Check, X, Edit, Trash2 } from "lucide-react" // Added Edit, Trash2
import { EventDialog } from "./event-dialog"
import { useEvents } from "@/lib/event-context"
import { useAuth } from "@/lib/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { EventForm } from "./event-form" // Import EventForm

const categories = ["All", "Technology", "Career", "Cultural", "Academic", "Health", "Business", "Sports"]

interface EventListProps {
  defaultStatus?: "approved" | "all" | "pending_approval" | "rejected" | "cancelled" | "draft"
}

export function EventList({ defaultStatus = "approved" }: EventListProps) {
  const { events, loading, fetchEvents, approveEvent, rejectEvent, deleteEvent, updateEvent } = useEvents() // Added deleteEvent, updateEvent
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [rejectDialog, setRejectDialog] = useState({ open: false, eventId: null, reason: "" })
  const [editingEvent, setEditingEvent] = useState(null) // State for event being edited
  const [deletingEventId, setDeletingEventId] = useState(null) // State for event being deleted

  useEffect(() => {
    const initialParams: any = {}
    if (defaultStatus !== "all") {
      initialParams.status = defaultStatus
    }
    fetchEvents(initialParams)
  }, [defaultStatus, fetchEvents])

  useEffect(() => {
    const params: any = {}
    if (defaultStatus !== "all") {
      params.status = defaultStatus
    }
    if (searchTerm) params.search = searchTerm
    if (selectedCategory !== "All") params.category = selectedCategory

    const debounceTimer = setTimeout(() => {
      fetchEvents(params)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, selectedCategory, defaultStatus, fetchEvents])

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

  const handleApprove = async (eventId: number) => {
    await approveEvent(eventId)
    // Re-fetch events to update the list after approval
    const currentParams: any = {}
    if (defaultStatus !== "all") {
      currentParams.status = defaultStatus
    }
    if (searchTerm) currentParams.search = searchTerm
    if (selectedCategory !== "All") currentParams.category = selectedCategory
    fetchEvents(currentParams)
  }

  const handleReject = async () => {
    if (!rejectDialog.eventId || !rejectDialog.reason.trim()) return

    await rejectEvent(rejectDialog.eventId, rejectDialog.reason)
    setRejectDialog({ open: false, eventId: null, reason: "" })
    // Re-fetch events to update the list after rejection
    const currentParams: any = {}
    if (defaultStatus !== "all") {
      currentParams.status = defaultStatus
    }
    if (searchTerm) currentParams.search = searchTerm
    if (selectedCategory !== "All") currentParams.category = selectedCategory
    fetchEvents(currentParams)
  }

  const handleEditClick = (event: any) => {
    setEditingEvent(event)
  }

  const handleDeleteClick = (eventId: number) => {
    setDeletingEventId(eventId)
  }

  const confirmDeleteEvent = async () => {
    if (deletingEventId === null) return

    await deleteEvent(deletingEventId)
    setDeletingEventId(null)
    // No need to manually fetch, deleteEvent in context updates state
  }

  const handleFormSuccess = () => {
    setEditingEvent(null) // Close edit dialog
    // fetchEvents() // Context's updateEvent already handles state update
  }

  const handleFormCancel = () => {
    setEditingEvent(null) // Close edit dialog
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading events...</p>
        </div>
      </div>
    )
  }

  const canManageEvents = user && (user.role === "admin" || user.role === "staff")
  const canAdministerEvents = user && user.role === "admin" && defaultStatus === "all"

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="p-0">
              <img
                src={
                  event.image_path
                    ? `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/storage/${event.image_path}`
                    : "/placeholder.svg?height=200&width=400"
                }
                alt={event.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
              </div>
              <CardDescription className="line-clamp-2 mb-3">{event.description}</CardDescription>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(event.event_date)}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{formatTime(event.start_time)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">
                    {event.venue.name} - {event.venue.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {event.registered_count}/{event.capacity} registered
                  </span>
                </div>
              </div>
              {canManageEvents && (
                <div className="flex gap-2 mt-3">
                  <Badge className={getStatusColor(event.status)}>{getStatusText(event.status)}</Badge>
                  {event.status === "rejected" && event.rejection_reason && (
                    <span className="text-sm text-red-600">Reason: {event.rejection_reason}</span>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="p-4 pt-0 flex flex-col gap-2">
              <Button
                className="w-full"
                onClick={() => setSelectedEvent(event)}
                disabled={event.registered_count >= event.capacity && !canAdministerEvents}
              >
                {event.registered_count >= event.capacity && !canAdministerEvents ? "Event Full" : "View Details"}
              </Button>
              {canAdministerEvents && (
                <div className="flex gap-2 w-full">
                  {event.status === "pending_approval" ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-green-600 hover:bg-green-50 bg-transparent"
                        onClick={() => handleApprove(event.id)}
                        disabled={loading}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-red-600 hover:bg-red-50 bg-transparent"
                        onClick={() => setRejectDialog({ open: true, eventId: event.id, reason: "" })}
                        disabled={loading}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => handleEditClick(event)}
                        disabled={loading}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-red-600 hover:bg-red-50 bg-transparent"
                        onClick={() => handleDeleteClick(event.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {events.length === 0 && !loading && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {selectedEvent && (
        <EventDialog event={selectedEvent} open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)} />
      )}

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

      {/* Edit Event Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <EventForm initialData={editingEvent} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deletingEventId !== null} onOpenChange={() => setDeletingEventId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingEventId(null)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteEvent} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
