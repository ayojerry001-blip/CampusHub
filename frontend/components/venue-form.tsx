"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Minus } from "lucide-react"
import { apiService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface VenueFormData {
  name: string
  description: string
  capacity: string
  location: string
  facilities: string[]
  base_price: string
  additional_features: { name: string; price: string }[]
}

interface VenueFormProps {
  initialData?: any // For editing existing venue
  onSuccess?: () => void
  onCancel?: () => void
}

export function VenueForm({ initialData, onSuccess, onCancel }: VenueFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<VenueFormData>({
    name: "",
    description: "",
    capacity: "",
    location: "",
    facilities: [],
    base_price: "",
    additional_features: [],
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        capacity: initialData.capacity?.toString() || "",
        location: initialData.location || "",
        facilities: initialData.facilities || [],
        base_price: initialData.base_price?.toString() || "",
        additional_features:
          Object.entries(initialData.additional_features || {}).map(([name, price]) => ({
            name,
            price: price?.toString(),
          })) || [],
      })
    }
  }, [initialData])

  const handleInputChange = (field: keyof VenueFormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFeatureChange = (index: number, field: "name" | "price", value: string) => {
    const newFeatures = [...formData.additional_features]
    newFeatures[index] = { ...newFeatures[index], [field]: value }
    setFormData((prev) => ({ ...prev, additional_features: newFeatures }))
  }

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      additional_features: [...prev.additional_features, { name: "", price: "" }],
    }))
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additional_features: prev.additional_features.filter((_, i) => i !== index),
    }))
  }

  const handleFacilitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData((prev) => ({ ...prev, facilities: value.split(",").map((f) => f.trim()) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        capacity: Number.parseInt(formData.capacity),
        base_price: Number.parseFloat(formData.base_price),
        facilities: formData.facilities.filter((f) => f !== ""), // Remove empty strings
        additional_features: formData.additional_features.reduce((acc, feature) => {
          if (feature.name.trim() && feature.price.trim()) {
            acc[feature.name.trim()] = Number.parseFloat(feature.price)
          }
          return acc
        }, {}),
      }

      if (initialData) {
        await apiService.updateVenue(initialData.id.toString(), payload)
        toast({
          title: "Venue Updated",
          description: `${formData.name} has been updated successfully.`,
        })
      } else {
        await apiService.createVenue(payload)
        toast({
          title: "Venue Created",
          description: `${formData.name} has been created successfully.`,
        })
      }
      onSuccess?.()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${initialData ? "update" : "create"} venue.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Venue" : "Add New Venue"}</CardTitle>
        <CardDescription>
          {initialData ? "Update the details of this venue." : "Fill out the form to add a new venue."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Venue Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Main Auditorium"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Brief description of the venue..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => handleInputChange("capacity", e.target.value)}
                placeholder="e.g., 500"
                min="1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="base_price">Base Price (₦)</Label>
              <Input
                id="base_price"
                type="number"
                value={formData.base_price}
                onChange={(e) => handleInputChange("base_price", e.target.value)}
                placeholder="e.g., 100.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="e.g., 123 University Ave, City"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facilities">Facilities (comma-separated)</Label>
            <Input
              id="facilities"
              value={formData.facilities.join(", ")}
              onChange={handleFacilitiesChange}
              placeholder="e.g., Wifi, Projector, Parking"
            />
          </div>

          <div className="space-y-4">
            <Label>Additional Features</Label>
            {formData.additional_features.map((feature, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`feature-name-${index}`} className="sr-only">
                    Feature Name
                  </Label>
                  <Input
                    id={`feature-name-${index}`}
                    value={feature.name}
                    onChange={(e) => handleFeatureChange(index, "name", e.target.value)}
                    placeholder="Feature name (e.g., Catering)"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`feature-price-${index}`} className="sr-only">
                    Price ($)
                  </Label>
                  <Input
                    id={`feature-price-${index}`}
                    type="number"
                    value={feature.price}
                    onChange={(e) => handleFeatureChange(index, "price", e.target.value)}
                    placeholder="Price"
                    step="0.01"
                    min="0"
                  />
                </div>
                <Button type="button" variant="outline" size="icon" onClick={() => removeFeature(index)}>
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addFeature} className="w-full bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (initialData ? "Updating..." : "Adding...") : initialData ? "Update Venue" : "Add Venue"}
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
