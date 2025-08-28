"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardTitle } from "@/components/dashboard/dashboard-title"
import { KitchenTable } from "@/components/kitchens/kitchen-table"
import { KitchenForm } from "@/components/kitchens/kitchen-form"
import { useToast } from "@/components/ui/use-toast"
import { apiClient } from "@/lib/api"
import { API_ENDPOINTS } from "@/lib/constants"

  const API_BASE = API_ENDPOINTS.KITCHEN

export default function KitchensPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [kitchens, setKitchens] = useState<any[]>([])
  const [editingKitchen, setEditingKitchen] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Fetch kitchens from backend
  const fetchKitchens = async () => {
    console.log('fetchKitchens function called')
    setLoading(true)
    try {
      console.log('About to make API call to:', `${API_BASE}`)
      const data = await apiClient.get<any>(`${API_BASE}`)
      console.log('API call completed, response:', data)
      
      // Handle different response structures
      let kitchensData: any[] = []
      if (Array.isArray(data)) {
        kitchensData = data
      } else if (data && Array.isArray(data.data)) {
        kitchensData = data.data
      } else if (data && Array.isArray(data.kitchens)) {
        kitchensData = data.kitchens
      } else if (data && Array.isArray(data.items)) {
        kitchensData = data.items
      } else {
        console.warn('Unexpected API response structure:', data)
        kitchensData = []
      }
      
      console.log('Kitchen data:', kitchensData)
      setKitchens(kitchensData)
    } catch (err: any) {
      console.error('Error fetching kitchens:', err)
      console.error('Error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        url: err.config?.url
      })
      toast({
        title: "Error fetching kitchens",
        description: err.message,
        variant: "destructive",
      })
      setKitchens([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('Kitchens page useEffect triggered')
    fetchKitchens()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredKitchens = Array.isArray(kitchens) ? kitchens.filter(
    (kitchen) =>
      kitchen?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kitchen?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kitchen?.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  ) : []

  const handleAddKitchen = async (kitchen: any) => {
    try {
      if (editingKitchen) {
        // Update kitchen
        const updated = await apiClient.put<any>(`${API_BASE}/${editingKitchen.id}`, kitchen)
        toast({
          title: "Kitchen updated",
          description: `${updated.name} has been updated successfully.`,
        })
      } else {
        // Create kitchen
        const created = await apiClient.post<any>(`${API_BASE}`, kitchen)
        toast({
          title: "Kitchen added",
          description: `${created.name} has been added successfully.`,
        })
      }
      setIsFormOpen(false)
      setEditingKitchen(null)
      fetchKitchens()
    } catch (err: any) {
      toast({
        title: "Error saving kitchen",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const handleEditKitchen = (kitchen: any) => {
    setEditingKitchen(kitchen)
    setIsFormOpen(true)
  }

  const handleDeleteKitchen = async (id: number) => {
    try {
      await apiClient.delete(`${API_BASE}/${id}`)
      toast({
        title: "Kitchen deleted",
        description: "The kitchen has been deleted successfully.",
        variant: "destructive",
      })
      await fetchKitchens()
    } catch (err: any) {
      toast({
        title: "Error deleting kitchen",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <DashboardTitle title="Kitchen Management" description="Add, edit, and manage your kitchens" />

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Search kitchens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Button
          onClick={() => {
            setEditingKitchen(null)
            setIsFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Kitchen
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading kitchens...</div>
      ) : (
        <KitchenTable kitchens={filteredKitchens} onEdit={handleEditKitchen} onDelete={handleDeleteKitchen} />
      )}

      <KitchenForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleAddKitchen}
        initialData={editingKitchen}
      />
    </div>
  )
}
