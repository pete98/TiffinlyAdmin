"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Download, RefreshCw, FileText, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardTitle } from "@/components/dashboard/dashboard-title"
import { OrderTable } from "@/components/orders/order-table"
import { OrderForm } from "@/components/orders/order-form"
import { useToast } from "@/components/ui/use-toast"
import { OrderService } from "@/lib/order-service"
import { Order, OrderFilters } from "@/lib/types"
import { exportOrdersToCSV, exportOrdersToExcel, exportDetailedOrdersToCSV } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function OrdersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<OrderFilters>({
    search: "",
    status: undefined,
    paymentStatus: undefined,
    subscriptionStatus: undefined,
    dateRange: undefined,
  })
  const [showFilters, setShowFilters] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [exporting, setExporting] = useState(false)
  const { toast } = useToast()

  // Fetch orders from backend
  const fetchOrders = async () => {
    setLoading(true)
    try {
      const ordersData = await OrderService.getOrders()
      setOrders(ordersData)
      setFilteredOrders(ordersData)
      
      // Calculate statistics
      const orderStats = OrderService.calculateOrderStats(ordersData)
      setStats(orderStats)
    } catch (err: any) {
      console.error('Error fetching orders:', err)
      toast({
        title: "Error fetching orders",
        description: err.message || "Failed to fetch orders. Please try again.",
        variant: "destructive",
      })
      setOrders([])
      setFilteredOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Apply filters when filters change
  useEffect(() => {
    const filtered = OrderService.filterOrders(orders, filters)
    setFilteredOrders(filtered)
  }, [orders, filters])

  const handleAddOrder = async (orderData: any) => {
    try {
      if (editingOrder) {
        // Update order
        const updated = await OrderService.updateOrder(editingOrder.id, orderData)
        toast({
          title: "Order updated",
          description: `Order #${updated.id} has been updated successfully.`,
        })
      } else {
        // Create order
        const created = await OrderService.createOrder(orderData)
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
        description: err.message || "Failed to save order. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order)
    setIsFormOpen(true)
  }

  const handleDeleteOrder = async (id: number) => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      return
    }

    try {
      await OrderService.deleteOrder(id)
      toast({
        title: "Order deleted",
        description: "The order has been deleted successfully.",
      })
      await fetchOrders()
    } catch (err: any) {
      toast({
        title: "Error deleting order",
        description: err.message || "Failed to delete order. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleStatusUpdate = async (id: number, status: Order["status"]) => {
    try {
      await OrderService.updateOrderStatus(id, status)
      toast({
        title: "Status updated",
        description: `Order status has been updated to ${status}.`,
      })
      await fetchOrders()
    } catch (err: any) {
      toast({
        title: "Error updating status",
        description: err.message || "Failed to update order status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExportCSV = () => {
    setExporting(true)
    try {
      const filename = getExportFilename()
      exportOrdersToCSV(filteredOrders, filename)
      toast({
        title: "Export successful",
        description: `Exported ${filteredOrders.length} orders to CSV format.`,
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export orders to CSV. Please try again.",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  const handleExportDetailedCSV = () => {
    setExporting(true)
    try {
      const filename = getExportFilename()
      exportDetailedOrdersToCSV(filteredOrders, `detailed_${filename}`)
      toast({
        title: "Export successful",
        description: `Exported ${filteredOrders.length} orders with detailed items to CSV format.`,
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export detailed orders to CSV. Please try again.",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  const handleExportExcel = async () => {
    setExporting(true)
    try {
      const filename = getExportFilename()
      await exportOrdersToExcel(filteredOrders, filename)
      toast({
        title: "Export successful",
        description: `Exported ${filteredOrders.length} orders to Excel format with multiple sheets.`,
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export orders to Excel. Please try again.",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      status: undefined,
      paymentStatus: undefined,
      subscriptionStatus: undefined,
      dateRange: undefined,
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getExportFilename = () => {
    let filename = "orders"
    
    if (filters.status) {
      filename += `_${filters.status.toLowerCase()}`
    }
    if (filters.paymentStatus) {
      filename += `_${filters.paymentStatus.toLowerCase()}`
    }
    if (filters.dateRange?.start && filters.dateRange?.end) {
      filename += `_${filters.dateRange.start}_to_${filters.dateRange.end}`
    }
    if (filters.search) {
      filename += `_search_${filters.search.substring(0, 20)}`
    }
    
    return filename
  }

  return (
    <div className="space-y-6">
      <DashboardTitle 
        title="Order Management" 
        description="Track, manage, and fulfill customer orders with comprehensive order lifecycle management" 
      />

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">O</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-bold">$</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.averageOrderValue)}</p>
                </div>
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-sm font-bold">A</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                  <p className="text-2xl font-bold">{stats.statusCounts.PENDING || 0}</p>
                </div>
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-sm font-bold">!</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search orders by customer, phone, email, address, status, or store..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              
              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={!filters.search && !filters.status && !filters.paymentStatus && !filters.subscriptionStatus && !filters.dateRange}
              >
                Clear
              </Button>
              
              <Button
                variant="outline"
                onClick={fetchOrders}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              
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
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Order Status
                  </label>
                  <Select
                    value={filters.status || ""}
                    onValueChange={(value) => setFilters({ ...filters, status: value as Order["status"] || undefined })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="PREPARING">Preparing</SelectItem>
                      <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Payment Status
                  </label>
                  <Select
                    value={filters.paymentStatus || ""}
                    onValueChange={(value) => setFilters({ ...filters, paymentStatus: value as Order["paymentStatus"] || undefined })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All payment statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All payment statuses</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Subscription Status
                  </label>
                  <Select
                    value={filters.subscriptionStatus || ""}
                    onValueChange={(value) => setFilters({ ...filters, subscriptionStatus: value as Order["subscriptionStatus"] || undefined })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All subscription statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All subscription statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      placeholder="Start date"
                      value={filters.dateRange?.start || ""}
                      onChange={(e) => setFilters({
                        ...filters,
                        dateRange: {
                          start: e.target.value,
                          end: filters.dateRange?.end || ""
                        }
                      })}
                    />
                    <Input
                      type="date"
                      placeholder="End date"
                      value={filters.dateRange?.end || ""}
                      onChange={(e) => setFilters({
                        ...filters,
                        dateRange: {
                          start: filters.dateRange?.start || "",
                          end: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredOrders.length} of {orders.length} orders
          {filters.search && ` matching "${filters.search}"`}
        </span>
        {filteredOrders.length > 0 && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportCSV}
              disabled={exporting}
              className="flex items-center gap-2"
            >
              <FileText className="mr-2 h-4 w-4" />
              {exporting ? "Exporting..." : "Export CSV"}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportDetailedCSV}
              disabled={exporting}
              className="flex items-center gap-2"
            >
              <FileText className="mr-2 h-4 w-4" />
              {exporting ? "Exporting..." : "Detailed CSV"}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportExcel}
              disabled={exporting}
              className="flex items-center gap-2"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              {exporting ? "Exporting..." : "Export Excel"}
            </Button>
          </div>
        )}
      </div>

      {/* Orders Table */}
      {loading ? (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-4">
                {orders.length === 0 
                  ? "No orders have been created yet. Create your first order to get started."
                  : "No orders match your current filters. Try adjusting your search criteria."
                }
              </p>
              {orders.length === 0 && (
                <Button onClick={() => setIsFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Order
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <OrderTable
          orders={filteredOrders}
          onEdit={handleEditOrder}
          onDelete={handleDeleteOrder}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      {/* Order Form Dialog */}
      <OrderForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleAddOrder}
        initialData={editingOrder}
      />
    </div>
  )
} 