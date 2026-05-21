"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Users, Edit, Trash2, Eye } from "lucide-react"

const registeredEvents = [
  {
    id: 1,
    title: "Tech Innovation Summit 2024",
    date: "2024-03-15",
    time: "09:00 AM",
    location: "Engineering Building, Room 101",
    category: "Technology",
    status: "upcoming",
  },
  {
    id: 2,
    title: "Spring Career Fair",
    date: "2024-03-20",
    time: "10:00 AM",
    location: "Student Union Center",
    category: "Career",
    status: "upcoming",
  },
  {
    id: 3,
    title: "Winter Workshop Series",
    date: "2024-02-15",
    time: "02:00 PM",
    location: "Library Conference Room",
    category: "Academic",
    status: "attended",
  },
]

const createdEvents = [
  {
    id: 4,
    title: "Photography Club Meetup",
    date: "2024-03-30",
    time: "04:00 PM",
    location: "Art Building, Studio 2",
    category: "Cultural",
    registered: 25,
    capacity: 30,
    status: "active",
  },
  {
    id: 5,
    title: "Coding Bootcamp",
    date: "2024-04-15",
    time: "10:00 AM",
    location: "Computer Lab 3",
    category: "Technology",
    registered: 45,
    capacity: 50,
    status: "active",
  },
]

export function UserDashboard() {
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
      upcoming: "bg-blue-100 text-blue-800",
      attended: "bg-green-100 text-green-800",
      active: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">12</CardTitle>
            <CardDescription>Events Registered</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">5</CardTitle>
            <CardDescription>Events Created</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">8</CardTitle>
            <CardDescription>Events Attended</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="registered" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="registered">My Registrations</TabsTrigger>
          <TabsTrigger value="created">My Events</TabsTrigger>
        </TabsList>

        <TabsContent value="registered" className="space-y-4">
          <div className="grid gap-4">
            {registeredEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <div className="flex gap-2 mt-2">
                        <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                        <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="created" className="space-y-4">
          <div className="grid gap-4">
            {createdEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <div className="flex gap-2 mt-2">
                        <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                        <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {event.registered}/{event.capacity}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
