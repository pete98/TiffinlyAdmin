"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardTitle } from "@/components/dashboard/dashboard-title"
import { OrderTable } from "@/components/orders/order-table"
import { OrderForm } from "@/components/orders/order-form"
import { useToast } from "@/components/ui/use-toast"
import { apiClient } from "@/lib/api"

const ORDERS_API = "https://b6b2efcf5d8d.ngrok-free.app/api/orders"

interface Order {
  id: number
  customerName: string
  customerPhone: string
  customerEmail: string
  deliveryAddress: string
  items: OrderItem[]
  totalAmount: number
  status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled"
  orderDate: string
  deliveryDate: string
  paymentMethod: "cash" | "card" | "upi"
  paymentStatus: "pending" | "paid" | "failed"
  notes: string
  isActive: boolean
}

interface OrderItem {
  id: number
  menuItemId: number
  menuItemName: string
  quantity: number
  price: number
  subtotal: number
}

export default function OrdersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Fetch orders from backend
  const fetchOrders = async () => {
    setLoading(true)
    try {
      const data = await apiClient.get<any>(`${ORDERS_API}`)
      
      // Handle different response structures
      let ordersData: Order[] = []
      if (Array.isArray(data)) {
        ordersData = data
      } else if (data && Array.isArray(data.data)) {
        ordersData = data.data
      } else if (data && Array.isArray(data.orders)) {
        ordersData = data.orders
      } else if (data && Array.isArray(data.items)) {
        ordersData = data.items
      } else {
        console.warn('Unexpected API response structure:', data)
        ordersData = []
      }
      
      setOrders(ordersData)
    } catch (err: any) {
      console.error('Error fetching orders:', err)
      toast({
        title: "Error fetching orders",
        description: err.message,
        variant: "destructive",
      })
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredOrders = Array.isArray(orders) ? orders.filter(
    (order) =>
      order?.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order?.customerPhone?.includes(searchQuery) ||
      order?.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order?.deliveryAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order?.status?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : []

  const handleAddOrder = async (order: any) => {
    try {
      if (editingOrder) {
        // Update order
        const updated = await apiClient.put<Order>(`${ORDERS_API}/${editingOrder.id}`, order)
        toast({
          title: "Order updated",
          description: `Order #${updated.id} has been updated successfully.`,
        })
      } else {
        // Create order
        const created = await apiClient.post<Order>(`${ORDERS_API}`, order)
        toast({
          title: "Order created",
          description: `Order #${created.id} has been created successfully.`,
        })
      }
      setIsFormOpen(false)
      setEditingOrder(null)
      await fetchOrders()
    } catch (err: any) {
      toast({
        title: "Error saving order",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order)
    setIsFormOpen(true)
  }

  const handleDeleteOrder = async (id: number) => {
    try {
      await apiClient.delete(`${ORDERS_API}/${id}`)
      toast({
        title: "Order deleted",
        description: "The order has been deleted successfully.",
        variant: "destructive",
      })
      await fetchOrders()
    } catch (err: any) {
      toast({
        title: "Error deleting order",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const handleStatusUpdate = async (id: number, status: Order["status"]) => {
    try {
      await apiClient.patch(`${ORDERS_API}/${id}/status`, { status })
      toast({
        title: "Status updated",
        description: `Order status has been updated to ${status}.`,
      })
      await fetchOrders()
    } catch (err: any) {
      toast({
        title: "Error updating status",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <DashboardTitle title="Order Management" description="Track, manage, and fulfill customer orders" />

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Button
          onClick={() => {
            setEditingOrder(null)
            setIsFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Order
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading orders...</div>
      ) : (
        <OrderTable
          orders={filteredOrders}
          onEdit={handleEditOrder}
          onDelete={handleDeleteOrder}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      <OrderForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleAddOrder}
        initialData={editingOrder}
      />
    </div>
  )
} 