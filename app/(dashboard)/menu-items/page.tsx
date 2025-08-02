"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardTitle } from "@/components/dashboard/dashboard-title"
import { MenuItemTable } from "@/components/menu-items/menu-item-table"
import { MenuItemForm } from "@/components/menu-items/menu-item-form"
import { useToast } from "@/components/ui/use-toast"
import { apiClient } from "@/lib/api"

const MENU_API = "https://b6b2efcf5d8d.ngrok-free.app/api/menu-items"

interface MenuItem {
  id: number
  mainItem: string
  mainItemQuantity: number
  secondaryItem: string
  secondaryItemQuantity: number
  sideItem: string
  sideItemQuantity: number
  price: number
  imageUrl: string
  description: string
  weekday: string
  weekDate: string
  isActive: boolean
}

export default function MenuItemsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Fetch menu items from backend
  const fetchMenuItems = async () => {
    setLoading(true)
    try {
      const data = await apiClient.get<any>(`${MENU_API}`)
      
      // Handle different response structures
      let menuItemsData: MenuItem[] = []
      if (Array.isArray(data)) {
        menuItemsData = data
      } else if (data && Array.isArray(data.data)) {
        menuItemsData = data.data
      } else if (data && Array.isArray(data.menuItems)) {
        menuItemsData = data.menuItems
      } else if (data && Array.isArray(data.items)) {
        menuItemsData = data.items
      } else {
        console.warn('Unexpected API response structure:', data)
        menuItemsData = []
      }
      
      setMenuItems(menuItemsData)
    } catch (err: any) {
      console.error('Error fetching menu items:', err)
      toast({
        title: "Error fetching menu items",
        description: err.message,
        variant: "destructive",
      })
      setMenuItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMenuItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredMenuItems = Array.isArray(menuItems) ? menuItems.filter(
    (item) =>
      (item?.mainItem?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item?.secondaryItem?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item?.sideItem?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item?.description?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item?.weekday?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  ) : []

  const handleAddMenuItem = async (menuItem: any) => {
    try {
      if (editingMenuItem) {
        // Update menu item
        const updated = await apiClient.put<MenuItem>(`${MENU_API}/${editingMenuItem.id}`, menuItem)
        toast({
          title: "Menu item updated",
          description: `${updated.mainItem} has been updated successfully.`,
        })
      } else {
        // Create menu item
        const created = await apiClient.post<MenuItem>(`${MENU_API}`, menuItem)
        toast({
          title: "Menu item added",
          description: `${created.mainItem} has been added successfully.`,
        })
      }
      setIsFormOpen(false)
      setEditingMenuItem(null)
      await fetchMenuItems()
    } catch (err: any) {
      toast({
        title: "Error saving menu item",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const handleEditMenuItem = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem)
    setIsFormOpen(true)
  }

  const handleDeleteMenuItem = async (id: number) => {
    try {
      await apiClient.delete(`${MENU_API}/${id}`)
      toast({
        title: "Menu item deleted",
        description: "The menu item has been deleted successfully.",
        variant: "destructive",
      })
      await fetchMenuItems()
    } catch (err: any) {
      toast({
        title: "Error deleting menu item",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <DashboardTitle title="Menu Management" description="Add, edit, and manage your menu items" />

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Button
          onClick={() => {
            setEditingMenuItem(null)
            setIsFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Menu Item
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading menu items...</div>
      ) : (
        <MenuItemTable
          menuItems={filteredMenuItems}
          onEdit={handleEditMenuItem}
          onDelete={handleDeleteMenuItem}
        />
      )}

      <MenuItemForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleAddMenuItem}
        initialData={editingMenuItem}
      />
    </div>
  )
} 