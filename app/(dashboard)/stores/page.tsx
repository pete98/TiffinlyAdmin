"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardTitle } from "@/components/dashboard/dashboard-title"
import { StoreTable } from "@/components/stores/store-table"
import { StoreForm } from "@/components/stores/store-form"
import { useToast } from "@/components/ui/use-toast"
import { apiFetch } from "@/lib/utils"

const STORE_API = "https://b6b2efcf5d8d.ngrok-free.app/api/store"
const KITCHEN_API = "https://b6b2efcf5d8d.ngrok-free.app/api/kitchen"

export default function StoresPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [stores, setStores] = useState<any[]>([])
  const [kitchens, setKitchens] = useState<any[]>([])
  const [editingStore, setEditingStore] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Fetch stores from backend
  const fetchStores = async () => {
    setLoading(true)
    try {
      const data = await apiFetch<any[]>(`${STORE_API}`)
      // Map isActive to status
      setStores(
        data.map(store => ({
          ...store,
          status: store.isActive ? "active" : "inactive",
        }))
      )
    } catch (err: any) {
      toast({
        title: "Error fetching stores",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch kitchens for dropdown
  const fetchKitchens = async () => {
    try {
      const data = await apiFetch<any[]>(`${KITCHEN_API}`)
      setKitchens(data)
    } catch (err: any) {
      toast({
        title: "Error fetching kitchens",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchStores()
    fetchKitchens()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (store.kitchen?.name || "").toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddStore = async (store: any) => {
    try {
      if (editingStore) {
        // Update store
        const updated = await apiFetch<any>(`${STORE_API}/${editingStore.id}`, {
          method: "PUT",
          body: JSON.stringify({
            ...store,
            kitchenId: getKitchenIdByName(store.kitchen),
          }),
        })
        toast({
          title: "Store updated",
          description: `${updated.name} has been updated successfully.`,
        })
      } else {
        // Create store
        const created = await apiFetch<any>(`${STORE_API}`, {
          method: "POST",
          body: JSON.stringify({
            ...store,
            kitchenId: getKitchenIdByName(store.kitchen),
          }),
        })
        toast({
          title: "Store added",
          description: `${created.name} has been added successfully.`,
        })
      }
      setIsFormOpen(false)
      setEditingStore(null)
      await fetchStores()
    } catch (err: any) {
      toast({
        title: "Error saving store",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const handleEditStore = (store: any) => {
    setEditingStore({
      ...store,
      kitchen: store.kitchen?.name || "",
    })
    setIsFormOpen(true)
  }

  const handleDeleteStore = async (id: number) => {
    try {
      await apiFetch(`${STORE_API}/${id}`, { method: "DELETE" })
      toast({
        title: "Store deleted",
        description: "The store has been deleted successfully.",
        variant: "destructive",
      })
      await fetchStores()
    } catch (err: any) {
      toast({
        title: "Error deleting store",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    try {
      const endpoint = `${STORE_API}/${id}/${currentStatus === "active" ? "deactivate" : "activate"}`
      const updated = await apiFetch<any>(endpoint, { method: "PUT" })
      toast({
        title: `Store ${updated.status}`,
        description: `${updated.name} is now ${updated.status}.`,
      })
      await fetchStores()
    } catch (err: any) {
      toast({
        title: "Error updating status",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  // Helper to get kitchenId by name
  const getKitchenIdByName = (kitchenName: string) => {
    const kitchen = kitchens.find((k) => k.name === kitchenName)
    return kitchen ? kitchen.id : null
  }

  return (
    <div className="space-y-6">
      <DashboardTitle title="Store Management" description="Add, edit, and manage your stores" />

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Search stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Button
          onClick={() => {
            setEditingStore(null)
            setIsFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Store
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading stores...</div>
      ) : (
        <StoreTable
          stores={filteredStores}
          onEdit={handleEditStore}
          onDelete={handleDeleteStore}
          onToggleStatus={(id: number) => {
            const store = stores.find((s) => s.id === id)
            if (store) handleToggleStatus(id, store.status)
          }}
        />
      )}

      <StoreForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleAddStore}
        initialData={editingStore}
        kitchens={kitchens}
      />
    </div>
  )
}
