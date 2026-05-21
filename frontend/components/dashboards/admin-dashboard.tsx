"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, MapPin, Settings, BarChart3, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useEvents } from "@/lib/event-context"
import { apiService } from "@/lib/api"
import { EventList } from "@/components/event-list"
import { VenueList } from "@/components/venue-list"
import { UserManagement } from "@/components/user-management"

export function AdminDashboard() {
  const { user } = useAuth()
  const { fetchEvents, fetchPendingEvents } = useEvents()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    pendingEvents: 0,
    approvedEvents: 0, // Added for admin stats
    rejectedEvents: 0, // Added for admin stats
    totalVenues: 0,
    activeEvents: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    setLoading(true)
    try {
      const dashboardStats = await apiService.getDashboardStats()
      setStats(dashboardStats.stats || dashboardStats)
    } catch (error) {
      console.error("Failed to load dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Complete system administration and oversight</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-red-100 text-red-800">
            <Shield className="h-3 w-3 mr-1" />
            Administrator
          </Badge>
        </div>
      </div>

      {/* Admin Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.totalUsers}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Total Users
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.totalEvents}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Total Events
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.pendingEvents}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Pending Approval
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.totalVenues}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Total Venues
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.activeEvents}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              Active Events
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">All Events</TabsTrigger>
          <TabsTrigger value="venues">Venues</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">New event created</p>
                      <p className="text-sm text-gray-600">Tech Innovation Summit 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">New user registered</p>
                      <p className="text-sm text-gray-600">John Paul (Student)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Venue booking request</p>
                      <p className="text-sm text-gray-600">Main Auditorium - March 15</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current system status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Database Status</span>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>API Response Time</span>
                    <Badge className="bg-green-100 text-green-800">Fast</Badge>
                  </div>
                  {/* <div className="flex justify-between items-center">
                    <span>Storage Usage</span>
                    <Badge className="bg-yellow-100 text-yellow-800">75%</Badge>
                  </div> */}
                  <div className="flex justify-between items-center">
                    <span>Active Sessions</span>
                    <Badge className="bg-blue-100 text-blue-800">9</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events">
          <EventList defaultStatus="all" />
        </TabsContent>

        <TabsContent value="venues">
          <VenueList />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
            <p className="text-gray-500">Detailed analytics and reporting features coming soon.</p>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="text-center py-8">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">System Settings</h3>
            <p className="text-gray-500">Configure system-wide settings and preferences.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
