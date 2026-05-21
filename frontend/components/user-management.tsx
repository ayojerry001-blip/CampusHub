"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Search, Shield, User, GraduationCap, Building, ExternalLink } from "lucide-react"
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
import { UserForm } from "./user-form" // Import the new UserForm

interface AppUser {
  id: number
  name: string
  email: string
  role: "student" | "staff" | "admin" | "external"
  department?: string
  phone?: string
  is_active: boolean
  created_at: string
}

export function UserManagement() {
  const { user: currentUser } = useAuth() // Renamed to currentUser to avoid conflict
  const { toast } = useToast()
  const [users, setUsers] = useState<AppUser[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [showUserForm, setShowUserForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null)
  const [isUserFormReadonly, setIsUserFormReadonly] = useState(false)
  const [confirmToggleUser, setConfirmToggleUser] = useState<AppUser | null>(null)

  useEffect(() => {
    if (currentUser && currentUser.role === "admin") {
      loadUsers()
    }
  }, [currentUser])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await apiService.getUsers()
      setUsers(response.data || response)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewProfile = (user: AppUser) => {
    setSelectedUser(user)
    setIsUserFormReadonly(true)
    setShowUserForm(true)
  }

  const handleEditUser = (user: AppUser) => {
    setSelectedUser(user)
    setIsUserFormReadonly(false)
    setShowUserForm(true)
  }

  const handleToggleUserStatus = (user: AppUser) => {
    if (user.id === currentUser?.id) {
      toast({
        title: "Action Denied",
        description: "You cannot deactivate your own account.",
        variant: "destructive",
      })
      return
    }
    setConfirmToggleUser(user)
  }

  const confirmUserStatusToggle = async () => {
    if (!confirmToggleUser) return

    setLoading(true)
    try {
      await apiService.updateUser(confirmToggleUser.id.toString(), {
        is_active: !confirmToggleUser.is_active,
      })
      toast({
        title: "User Status Updated",
        description: `${confirmToggleUser.name} has been ${confirmToggleUser.is_active ? "deactivated" : "activated"}.`,
      })
      setConfirmToggleUser(null)
      loadUsers() // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user status.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFormSuccess = () => {
    setShowUserForm(false)
    setSelectedUser(null)
    loadUsers() // Refresh the list
  }

  const handleFormCancel = () => {
    setShowUserForm(false)
    setSelectedUser(null)
    setIsUserFormReadonly(false)
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleIcon = (role: string) => {
    const icons = {
      admin: Shield,
      staff: Building,
      student: GraduationCap,
      external: ExternalLink,
    }
    const IconComponent = icons[role] || User
    return <IconComponent className="h-4 w-4" />
  }

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "bg-red-100 text-red-800",
      staff: "bg-blue-100 text-blue-800",
      student: "bg-green-100 text-green-800",
      external: "bg-purple-100 text-purple-800",
    }
    return colors[role] || "bg-gray-100 text-gray-800"
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="text-center py-8">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-500">Only administrators can access user management.</p>
      </div>
    )
  }

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="external">External</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{users.filter((u) => u.role === "student").length}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <GraduationCap className="h-4 w-4" />
              Students
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{users.filter((u) => u.role === "staff").length}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Building className="h-4 w-4" />
              Staff
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{users.filter((u) => u.role === "admin").length}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Admins
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{users.filter((u) => u.role === "external").length}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <ExternalLink className="h-4 w-4" />
              External
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Users List */}
      <div className="grid gap-4">
        {filteredUsers.map((u) => (
          <Card key={u.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {getRoleIcon(u.role)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{u.name}</h3>
                    <p className="text-sm text-gray-600">{u.email}</p>
                    {u.department && <p className="text-sm text-gray-500">{u.department}</p>}
                    <div className="flex gap-2 mt-2">
                      <Badge className={getRoleColor(u.role)}>
                        {getRoleIcon(u.role)}
                        <span className="ml-1 capitalize">{u.role}</span>
                      </Badge>
                      <Badge className={getStatusColor(u.is_active)}>{u.is_active ? "Active" : "Inactive"}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewProfile(u)}>
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditUser(u)}>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={
                      u.is_active
                        ? "text-red-600 hover:bg-red-50 bg-transparent"
                        : "text-green-600 hover:bg-green-50 bg-transparent"
                    }
                    onClick={() => handleToggleUserStatus(u)}
                    disabled={u.id === currentUser?.id} // Disable if it's the current logged-in admin
                  >
                    {u.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">
            {searchTerm || roleFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "No users available."}
          </p>
        </div>
      )}

      {/* User Form Dialog (for View and Edit) */}
      <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedUser && (
            <UserForm
              initialData={selectedUser}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
              readonly={isUserFormReadonly}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm User Status Toggle Dialog */}
      <Dialog open={confirmToggleUser !== null} onOpenChange={() => setConfirmToggleUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm User Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to {confirmToggleUser?.is_active ? "deactivate" : "activate"} "
              {confirmToggleUser?.name}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmToggleUser(null)} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant={confirmToggleUser?.is_active ? "destructive" : "default"}
              onClick={confirmUserStatusToggle}
              disabled={loading}
            >
              {loading ? "Updating..." : confirmToggleUser?.is_active ? "Deactivate" : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
