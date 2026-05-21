"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEvents } from "@/lib/event-context"
import { useAuth } from "@/lib/auth-context"
import { apiService } from "@/lib/api"

interface EventFormData {
  title: string
  description: string
  event_date: string
  start_time: string
  end_time: string
  venueId: string
  category: string
  capacity: string
}

interface EventFormProps {
  initialData?: any // For editing existing event
  onSuccess?: () => void
  onCancel?: () => void
}

export function EventForm({ initialData, onSuccess, onCancel }: EventFormProps) {
  const { createEvent, updateEvent, loading } = useEvents()
  const { user } = useAuth()
  const [venues, setVenues] = useState([])
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    event_date: "",
    start_time: "",
    end_time: "",
    venueId: "",
    category: "",
    capacity: "",
  })

  useEffect(() => {
    loadVenues()
  }, [])

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        event_date: initialData.event_date || "",
        start_time: initialData.start_time || "",
        end_time: initialData.end_time || "",
        venueId: initialData.venue?.id?.toString() || "", // Use venue.id
        category: initialData.category || "",
        capacity: initialData.capacity?.toString() || "",
      })
    }
  }, [initialData])

  const loadVenues = async () => {
    try {
      const response = await apiService.getVenues()
      setVenues(response.data || response)
    } catch (error) {
      console.error("Failed to load venues:", error)
    }
  }

  const handleInputChange = (field: keyof EventFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    const payload = {
      title: formData.title,
      description: formData.description,
      event_date: formData.event_date,
      start_time: formData.start_time,
      end_time: formData.end_time || null,
      venueId: Number.parseInt(formData.venueId),
      category: formData.category,
      capacity: Number.parseInt(formData.capacity),
    }

    if (initialData) {
      await updateEvent(initialData.id, payload)
    } else {
      await createEvent(payload)
    }

    // Reset form only on successful creation
    if (!initialData) {
      setFormData({
        title: "",
        description: "",
        event_date: "",
        start_time: "",
        end_time: "",
        venueId: "",
        category: "",
        capacity: "",
      })
    }

    onSuccess?.()
  }

  const categories = ["Technology", "Career", "Cultural", "Academic", "Health", "Business", "Sports"]

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Event" : "Create New Event"}</CardTitle>
        <CardDescription>
          {initialData ? "Update the details of this event." : "Fill out the form below to create a new campus event."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your event..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event_date">Date</Label>
              <Input
                id="event_date"
                type="date"
                value={formData.event_date}
                onChange={(e) => handleInputChange("event_date", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => handleInputChange("start_time", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => handleInputChange("end_time", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Select value={formData.venueId} onValueChange={(value) => handleInputChange("venueId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select venue" />
                </SelectTrigger>
                <SelectContent>
                  {venues.map((venue) => (
                    <SelectItem key={venue.id} value={venue.id.toString()}>
                      {venue.name} - {venue.location} (Capacity: {venue.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Expected Attendees</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => handleInputChange("capacity", e.target.value)}
              placeholder="Number of expected attendees"
              min="1"
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (initialData ? "Updating..." : "Creating...") : initialData ? "Update Event" : "Create Event"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
