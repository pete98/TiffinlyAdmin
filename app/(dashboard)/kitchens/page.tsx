"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardTitle } from "@/components/dashboard/dashboard-title"
import { KitchenTable } from "@/components/kitchens/kitchen-table"
import { KitchenForm } from "@/components/kitchens/kitchen-form"
import { useToast } from "@/components/ui/use-toast"
import { apiFetch } from "@/lib/utils"

const API_BASE = "https://b6b2efcf5d8d.ngrok-free.app/api/kitchen"

export default function KitchensPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [kitchens, setKitchens] = useState<any[]>([])
  const [editingKitchen, setEditingKitchen] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Fetch kitchens from backend
  const fetchKitchens = async () => {
    setLoading(true)
    try {
      const data = await apiFetch<any[]>(`${API_BASE}`)
      setKitchens(data)
    } catch (err: any) {
      toast({
        title: "Error fetching kitchens",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKitchens()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredKitchens = kitchens.filter(
    (kitchen) =>
      kitchen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kitchen.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kitchen.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddKitchen = async (kitchen: any) => {
    try {
      if (editingKitchen) {
        // Update kitchen
        const updated = await apiFetch<any>(`${API_BASE}/${editingKitchen.id}`, {
          method: "PUT",
          body: JSON.stringify(kitchen),
        })
        toast({
          title: "Kitchen updated",
          description: `${updated.name} has been updated successfully.`,
        })
      } else {
        // Create kitchen
        const created = await apiFetch<any>(`${API_BASE}`, {
          method: "POST",
          body: JSON.stringify(kitchen),
        })
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
      await apiFetch(`${API_BASE}/${id}`, { method: "DELETE" })
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
