"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardTitle } from "@/components/dashboard/dashboard-title"
import { UserTable } from "@/components/users/user-table"
import { UserForm } from "@/components/users/user-form"
import { UserDetailsModal } from "@/components/users/user-details-modal"
import { useToast } from "@/components/ui/use-toast"
import { UserService } from "@/lib/user-service"
import { UserProfile, UserProfileUpdate, UserSubscriptionUpdate } from "@/lib/types"

export default function UsersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<UserProfile[]>([])
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)
  const [viewingUser, setViewingUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const usersData = await UserService.getAllUsers()
      setUsers(usersData)
    } catch (err: any) {
      console.error('Error fetching users:', err)
      toast({
        title: "Error fetching users",
        description: err.message || "Failed to fetch users",
        variant: "destructive",
      })
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.phoneNumber?.includes(searchQuery) ||
      user?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.stripeCustomerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.subscriptionStatus?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.subscriptionType?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUserAction = async (userData: UserProfileUpdate | UserSubscriptionUpdate, type: 'profile' | 'subscription') => {
    if (!editingUser || !editingUser.auth0Id) {
      toast({
        title: "Error",
        description: "Invalid user data",
        variant: "destructive",
      })
      return
    }

    try {
      let updated: UserProfile
      
      if (type === 'profile') {
        // Update user profile using extended-profile endpoint
        updated = await UserService.updateUserProfile(editingUser.auth0Id, userData)
        toast({
          title: "Profile updated",
          description: `${editingUser.firstName || 'User'}'s profile has been updated successfully.`,
        })
      } else {
        // Update user subscription using main user endpoint
        updated = await UserService.updateUserSubscription(editingUser.auth0Id, userData)
        toast({
          title: "Subscription updated",
          description: `${editingUser.firstName || 'User'}'s subscription has been updated successfully.`,
        })
      }

      setIsFormOpen(false)
      setEditingUser(null)
      await fetchUsers()
    } catch (err: any) {
      toast({
        title: "Error updating user",
        description: err.message || "Failed to update user",
        variant: "destructive",
      })
    }
  }

  const handleEditUser = (user: UserProfile) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleViewUser = (user: UserProfile) => {
    setViewingUser(user)
    setIsDetailsOpen(true)
  }

  const handleDeleteUser = async (auth0Id: string) => {
    if (!auth0Id) {
      toast({
        title: "Error",
        description: "Invalid user ID",
        variant: "destructive",
      })
      return
    }

    try {
      await UserService.deleteUser(auth0Id)
      toast({
        title: "User deleted",
        description: "The user has been deleted successfully.",
      })
      await fetchUsers()
    } catch (err: any) {
      toast({
        title: "Error deleting user",
        description: err.message || "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const handleAddUser = () => {
    setEditingUser(null)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <DashboardTitle title="User Management" description="Manage user profiles, subscriptions, and billing information" />

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Search users by name, phone, city, subscription status, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Button onClick={handleAddUser}>
          <Plus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading users...</div>
      ) : (
        <UserTable
          users={filteredUsers}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onView={handleViewUser}
        />
      )}

      <UserForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleUserAction}
        initialData={editingUser}
      />

      <UserDetailsModal
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        user={viewingUser}
      />
    </div>
  )
} 