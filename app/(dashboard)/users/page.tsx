"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardTitle } from "@/components/dashboard/dashboard-title"
import { UserTable } from "@/components/users/user-table"
import { UserForm } from "@/components/users/user-form"
import { useToast } from "@/components/ui/use-toast"
import { apiClient } from "@/lib/api"

const USER_API = "https://b6b2efcf5d8d.ngrok-free.app/api/users"

export default function UsersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<any[]>([])
  const [editingUser, setEditingUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await apiClient.get<any>(`${USER_API}`)
      
      // Handle different response structures
      let usersData: any[] = []
      if (Array.isArray(data)) {
        usersData = data
      } else if (data && Array.isArray(data.data)) {
        usersData = data.data
      } else if (data && Array.isArray(data.users)) {
        usersData = data.users
      } else if (data && Array.isArray(data.items)) {
        usersData = data.items
      } else {
        console.warn('Unexpected API response structure:', data)
        usersData = []
      }
      
      setUsers(usersData)
    } catch (err: any) {
      console.error('Error fetching users:', err)
      toast({
        title: "Error fetching users",
        description: err.message,
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

  const filteredUsers = Array.isArray(users) ? users.filter(
    (user) =>
      user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.stripeCustomerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.subscriptionStatus?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.subscriptionId?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : []

  const handleAddUser = async (user: any) => {
    try {
      if (editingUser) {
        // Update user
        const updated = await apiClient.put<any>(`${USER_API}/${editingUser.id}`, user)
        toast({
          title: "User updated",
          description: `${updated.name} has been updated successfully.`,
        })
      } else {
        // Create user
        const created = await apiClient.post<any>(`${USER_API}`, user)
        toast({
          title: "User added",
          description: `${created.name} has been added successfully.`,
        })
      }
      setIsFormOpen(false)
      setEditingUser(null)
      await fetchUsers()
    } catch (err: any) {
      toast({
        title: "Error saving user",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const handleEditUser = (user: any) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleDeleteUser = async (id: string) => {
    try {
      await apiClient.delete(`${USER_API}/${id}`)
      toast({
        title: "User deleted",
        description: "The user has been deleted successfully.",
        variant: "destructive",
      })
      await fetchUsers()
    } catch (err: any) {
      toast({
        title: "Error deleting user",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <DashboardTitle title="User Management" description="Add, edit, and manage your users" />

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Button
          onClick={() => {
            setEditingUser(null)
            setIsFormOpen(true)
          }}
        >
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
          onDelete={(id: string) => {
                    const user = users.find((u) => u.id === id)
        if (user) handleDeleteUser(user.id)
          }}
        />
      )}

      <UserForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleAddUser}
        initialData={editingUser}
      />
    </div>
  )
} 