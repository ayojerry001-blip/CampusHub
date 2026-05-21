"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Search } from "lucide-react"
import { EventDialog } from "./event-dialog"
import { useEvents } from "@/lib/event-context"

const categories = ["All", "Technology", "Career", "Cultural", "Academic", "Health", "Business", "Sports"]

export function EventList() {
  const { events, loading, fetchEvents } = useEvents()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    // Fetch events when component mounts
    fetchEvents({ status: "approved" })
  }, [])

  useEffect(() => {
    // Fetch events when search or category changes
    const params: any = { status: "approved" }
    if (searchTerm) params.search = searchTerm
    if (selectedCategory !== "All") params.category = selectedCategory

    const debounceTimer = setTimeout(() => {
      fetchEvents(params)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, selectedCategory])

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
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                className="w-full"
                onClick={() => setSelectedEvent(event)}
                disabled={event.registered_count >= event.capacity}
              >
                {event.registered_count >= event.capacity ? "Event Full" : "View Details"}
              </Button>
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
    </div>
  )
}
