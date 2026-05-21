"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Users, DollarSign, Plus, Edit, Trash2, Search, Wifi, Projector, Car } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { apiService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { VenueForm } from "./venue-form" // Import the new VenueForm

interface Venue {
  id: number
  name: string
  description: string
  capacity: number
  location: string
  facilities: string[]
  base_price: number
  additional_features: Record<string, number>
}

interface VenueListProps {
  readonly?: boolean
}

export function VenueList({ readonly = false }: VenueListProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showVenueForm, setShowVenueForm] = useState(false)
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null)
  const [deletingVenueId, setDeletingVenueId] = useState<number | null>(null)

  useEffect(() => {
    loadVenues()
  }, [])

  const loadVenues = async () => {
    setLoading(true)
    try {
      const response = await apiService.getVenues()
      setVenues(response.data || response)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load venues",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddVenueClick = () => {
    setEditingVenue(null)
    setShowVenueForm(true)
  }

  const handleEditVenueClick = (venue: Venue) => {
    setEditingVenue(venue)
    setShowVenueForm(true)
  }

  const handleDeleteVenueClick = (venueId: number) => {
    setDeletingVenueId(venueId)
  }

  const confirmDeleteVenue = async () => {
    if (deletingVenueId === null) return

    setLoading(true)
    try {
      await apiService.deleteVenue(deletingVenueId.toString())
      toast({
        title: "Venue Deleted",
        description: "The venue has been successfully deleted.",
      })
      setDeletingVenueId(null)
      loadVenues() // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete venue.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFormSuccess = () => {
    setShowVenueForm(false)
    setEditingVenue(null)
    loadVenues() // Refresh the list
  }

  const handleFormCancel = () => {
    setShowVenueForm(false)
    setEditingVenue(null)
  }

  const filteredVenues = venues.filter(
    (venue) =>
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getFacilityIcon = (facility: string) => {
    const icons = {
      wifi: Wifi,
      projector: Projector,
      parking: Car,
      microphone: Users, // Placeholder, ideally specific icon
      stage: Users, // Placeholder
      lighting: Users, // Placeholder
      whiteboard: Users, // Placeholder
      video_conference: Users, // Placeholder
      computers: Users, // Placeholder
      lab_equipment: Users, // Placeholder
    }
    const IconComponent = icons[facility.toLowerCase().replace(/\s+/g, "_")] || Users
    return <IconComponent className="h-4 w-4" />
  }

  const canManageVenues = user && (user.role === "admin" || user.role === "staff")

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading venues...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search venues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {canManageVenues && !readonly && (
          <Button onClick={handleAddVenueClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add Venue
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVenues.map((venue) => (
          <Card key={venue.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{venue.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {venue.location}
                  </CardDescription>
                </div>
                {canManageVenues && !readonly && (
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => handleEditVenueClick(venue)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteVenueClick(venue.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{venue.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Capacity: {venue.capacity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">₦{venue.base_price}</span>
                </div>
              </div>

              {venue.facilities && venue.facilities.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Facilities:</p>
                  <div className="flex flex-wrap gap-1">
                    {venue.facilities.map((facility, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {getFacilityIcon(facility)}
                        <span className="ml-1 capitalize">{facility.replace(/_/g, " ")}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {venue.additional_features && Object.keys(venue.additional_features).length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Additional Features:</p>
                  <div className="space-y-1">
                    {Object.entries(venue.additional_features).map(([feature, price]) => (
                      <div key={feature} className="flex justify-between text-xs">
                        <span className="capitalize">{feature.replace(/_/g, " ")}</span>
                        <span className="font-medium">+${price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Button variant="outline" className="w-full bg-transparent">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVenues.length === 0 && !loading && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
          <p className="text-gray-500">
            {searchTerm ? "Try adjusting your search criteria." : "No venues available at the moment."}
          </p>
        </div>
      )}

      {/* Venue Form Dialog */}
      <Dialog open={showVenueForm} onOpenChange={setShowVenueForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <VenueForm initialData={editingVenue} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deletingVenueId !== null} onOpenChange={() => setDeletingVenueId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this venue? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingVenueId(null)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteVenue} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
