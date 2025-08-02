"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardTitle } from "@/components/dashboard/dashboard-title"
import { StoreTable } from "@/components/stores/store-table"
import { StoreForm } from "@/components/stores/store-form"
import { useToast } from "@/components/ui/use-toast"
import { apiClient } from "@/lib/api"

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

  // Fetch all data in parallel
  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch both APIs in parallel to reduce total time and token requests
      const [storesResult, kitchensResult] = await Promise.allSettled([
        apiClient.get<any>(`${STORE_API}`),
        apiClient.get<any>(`${KITCHEN_API}`)
      ])

      // Handle stores data
      if (storesResult.status === 'fulfilled') {
        let storesData: any[] = []
        const data = storesResult.value
        
        if (Array.isArray(data)) {
          storesData = data
        } else if (data && Array.isArray(data.data)) {
          storesData = data.data
        } else if (data && Array.isArray(data.stores)) {
          storesData = data.stores
        } else if (data && Array.isArray(data.items)) {
          storesData = data.items
        } else {
          console.warn('Unexpected stores API response structure:', data)
          storesData = []
        }
        
        setStores(
          storesData.map(store => ({
            ...store,
            status: store.isActive ? "active" : "inactive",
          }))
        )
      } else {
        toast({
          title: "Error fetching stores",
          description: "Failed to load stores data",
          variant: "destructive",
        })
      }

      // Handle kitchens data
      if (kitchensResult.status === 'fulfilled') {
        let kitchensData: any[] = []
        const data = kitchensResult.value
        
        if (Array.isArray(data)) {
          kitchensData = data
        } else if (data && Array.isArray(data.data)) {
          kitchensData = data.data
        } else if (data && Array.isArray(data.kitchens)) {
          kitchensData = data.kitchens
        } else if (data && Array.isArray(data.items)) {
          kitchensData = data.items
        } else {
          console.warn('Unexpected kitchens API response structure:', data)
          kitchensData = []
        }
        
        setKitchens(kitchensData)
      } else {
        toast({
          title: "Error fetching kitchens",
          description: "Failed to load kitchens data",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      console.error('Error fetching data:', err)
      toast({
        title: "Error fetching data",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
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
        const updated = await apiClient.put<any>(`${STORE_API}/${editingStore.id}`, {
          ...store,
          kitchenId: getKitchenIdByName(store.kitchen),
        })
        toast({
          title: "Store updated",
          description: `${updated.name} has been updated successfully.`,
        })
      } else {
        // Create store
        const created = await apiClient.post<any>(`${STORE_API}`, {
          ...store,
          kitchenId: getKitchenIdByName(store.kitchen),
        })
        toast({
          title: "Store added",
          description: `${created.name} has been added successfully.`,
        })
      }
      setIsFormOpen(false)
      setEditingStore(null)
      await fetchData() // Refresh all data
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
      await apiClient.delete(`${STORE_API}/${id}`)
      toast({
        title: "Store deleted",
        description: "The store has been deleted successfully.",
        variant: "destructive",
      })
      await fetchData() // Refresh all data
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
      const updated = await apiClient.put<any>(endpoint)
      toast({
        title: `Store ${updated.status}`,
        description: `${updated.name} is now ${updated.status}.`,
      })
      await fetchData() // Refresh all data
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
