"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { apiService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

interface UserFormData {
  name: string
  email: string
  role: "student" | "staff" | "admin" | "external"
  department: string
  phone: string
  is_active: boolean
}

interface UserFormProps {
  initialData?: any // For editing existing user
  onSuccess?: () => void
  onCancel?: () => void
  readonly?: boolean // To display form in read-only mode
}

export function UserForm({ initialData, onSuccess, onCancel, readonly = false }: UserFormProps) {
  const { toast } = useToast()
  const { user: currentUser } = useAuth() // Current logged-in user
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    role: "student",
    department: "",
    phone: "",
    is_active: true,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        role: initialData.role || "student",
        department: initialData.department || "",
        phone: initialData.phone || "",
        is_active: initialData.is_active ?? true,
      })
    }
  }, [initialData])

  const handleInputChange = (field: keyof UserFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        phone: formData.phone,
        // Only allow admin to change role and active status
        ...(currentUser?.role === "admin" && {
          role: formData.role,
          is_active: formData.is_active,
        }),
      }

      await apiService.updateUser(initialData.id.toString(), payload)
      toast({
        title: "User Updated",
        description: `${formData.name}'s profile has been updated successfully.`,
      })
      onSuccess?.()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const isEditable = !readonly && currentUser?.role === "admin"

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{readonly ? "User Profile" : "Edit User"}</CardTitle>
        <CardDescription>{readonly ? "View user details." : "Update user information and roles."}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="John Doe"
              required
              disabled={!isEditable}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="user@example.com"
              required
              disabled={!isEditable}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange("role", value as UserFormData["role"])}
                disabled={!isEditable}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="external">External User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange("department", e.target.value)}
                placeholder="e.g., Computer Science"
                disabled={!isEditable}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="e.g., +1 (555) 123-4567"
              disabled={!isEditable}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="is_active">Account Status</Label>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange("is_active", checked)}
              disabled={!isEditable || initialData?.id === currentUser?.id} // Prevent admin from deactivating self
            />
            <span className="text-sm text-gray-600">{formData.is_active ? "Active" : "Inactive"}</span>
          </div>

          {!readonly && (
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
            </div>
          )}
          {readonly && (
            <div className="flex justify-end">
              <Button type="button" variant="outline" onClick={onCancel}>
                Close
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
