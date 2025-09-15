"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Download, RefreshCw, FileText, FileSpreadsheet, Calendar, CheckCircle, Clock, XCircle, Truck, Package, Printer, CheckSquare } from "lucide-react"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "@/components/ui/calendar"
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns"

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
    storeId: undefined,
  })
  const [showFilters, setShowFilters] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [exporting, setExporting] = useState(false)
  const { toast } = useToast()

  // Quick date filter options
  const quickDateOptions = [
    { label: "Today", value: "today", getDates: () => ({ start: format(new Date(), "yyyy-MM-dd"), end: format(new Date(), "yyyy-MM-dd") }) },
    { label: "Yesterday", value: "yesterday", getDates: () => ({ start: format(subDays(new Date(), 1), "yyyy-MM-dd"), end: format(subDays(new Date(), 1), "yyyy-MM-dd") }) },
    { label: "This Week", value: "thisWeek", getDates: () => ({ start: format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd"), end: format(endOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd") }) },
    { label: "Last Week", value: "lastWeek", getDates: () => ({ start: format(startOfWeek(subDays(new Date(), 7), { weekStartsOn: 1 }), "yyyy-MM-dd"), end: format(endOfWeek(subDays(new Date(), 7), { weekStartsOn: 1 }), "yyyy-MM-dd") }) },
    { label: "This Month", value: "thisMonth", getDates: () => ({ start: format(startOfMonth(new Date()), "yyyy-MM-dd"), end: format(endOfMonth(new Date()), "yyyy-MM-dd") }) },
    { label: "Last Month", value: "lastMonth", getDates: () => ({ start: format(startOfMonth(subDays(new Date(), 30)), "yyyy-MM-dd"), end: format(endOfMonth(subDays(new Date(), 30)), "yyyy-MM-dd") }) },
  ]

  // Quick status filter options
  const quickStatusOptions = [
    { label: "All Orders", value: "all", icon: Package, color: "bg-gray-100 text-gray-700" },
    { label: "Paid Orders", value: "paid", icon: CheckCircle, color: "bg-green-100 text-green-700" },
    { label: "Pending Payment", value: "pending_payment", icon: Clock, color: "bg-yellow-100 text-yellow-700" },
    { label: "Failed Payment", value: "failed_payment", icon: XCircle, color: "bg-red-100 text-red-700" },
    { label: "Out for Delivery", value: "out_for_delivery", icon: Truck, color: "bg-blue-100 text-blue-700" },
    { label: "Delivered", value: "delivered", icon: CheckCircle, color: "bg-green-100 text-green-700" },
  ]



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

  // Get unique stores for filtering
  const uniqueStores = Array.from(new Set(orders.map(order => ({ id: order.storeId, name: order.storeName }))))
    .filter((store, index, self) => self.findIndex(s => s.id === store.id) === index)
    .sort((a, b) => a.name.localeCompare(b.name))

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

  // Print order labels for all filtered orders
  const handlePrintOrderLabels = () => {
    if (filteredOrders.length === 0) {
      toast({
        title: "No orders to print",
        description: "There are no orders to print labels for.",
        variant: "destructive",
      })
      return
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      toast({
        title: "Print blocked",
        description: "Please allow pop-ups to print order labels.",
        variant: "destructive",
      })
      return
    }

    // Generate simple receipt-style label HTML
    const labelsHTML = filteredOrders.map(order => `
      <div style="
        page-break-inside: avoid;
        margin: 10px;
        padding: 15px;
        border: 1px solid #000;
        font-family: 'Courier New', monospace;
        max-width: 300px;
        background: white;
        color: black;
      ">
        <div style="
          text-align: center;
          border-bottom: 1px solid #000;
          padding-bottom: 8px;
          margin-bottom: 10px;
        ">
          <h3 style="margin: 0; font-size: 14px; font-weight: bold;">
            Tiffinly Order Pickup Receipt
          </h3>
        </div>
        
        <div style="margin-bottom: 10px; font-size: 12px;">
          <div style="margin-bottom: 4px;">
            <strong>Order:</strong> ${order.orderNumber || `#${order.id}`}
          </div>
          <div style="margin-bottom: 4px;">
            <strong>Customer:</strong> ${order.customerName || 'N/A'}
          </div>
          <div style="margin-bottom: 4px;">
            <strong>Store:</strong> ${order.storeName || 'N/A'}
          </div>
        </div>

        <div style="
          border-top: 1px solid #000;
          border-bottom: 1px solid #000;
          padding: 8px 0;
          margin-bottom: 10px;
        ">
          <div style="margin-bottom: 4px; font-weight: bold;">ITEMS:</div>
          ${order.items?.map(item => {
            if (item.menuItemComponents && item.menuItemComponents.length > 0) {
              // Display each menu item component separately
              return item.menuItemComponents.map(component => `
                <div style="
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 2px;
                  font-size: 11px;
                ">
                  <span>${component.itemName}</span>
                  <span>x${component.quantity}</span>
                </div>
              `).join('')
            } else {
              // Display regular item
              return `
                <div style="
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 2px;
                  font-size: 11px;
                ">
                  <span>${item.menuItemName || item.productName || 'N/A'}</span>
                  <span>x${item.quantity}</span>
                </div>
              `
            }
          }).join('') || 'No items'}
        </div>

        <div style="
          text-align: center;
          font-size: 10px;
          color: #666;
        ">
          Ready for pickup
        </div>
      </div>
    `).join('')

    // Set the print window content
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Labels - ${filteredOrders.length} Orders</title>
          <style>
            @media print {
              body { margin: 0; }
              div { page-break-inside: avoid; }
            }
            body { 
              font-family: 'Courier New', monospace; 
              background: white;
              color: black;
            }
          </style>
        </head>
        <body>
          ${labelsHTML}
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()

    toast({
      title: "Print labels",
      description: `Preparing to print ${filteredOrders.length} order labels.`,
    })
  }

  // Confirm all filtered orders (mark as ready for pickup)
  const handleConfirmAllOrders = async () => {
    if (filteredOrders.length === 0) {
      toast({
        title: "No orders to confirm",
        description: "There are no orders to confirm.",
        variant: "destructive",
      })
      return
    }

    if (!confirm(`Are you sure you want to mark ${filteredOrders.length} orders as ready for pickup?`)) {
      return
    }

    setLoading(true)
    try {
      // Update all filtered orders to ready for pickup status
      const updatePromises = filteredOrders.map(order => 
        OrderService.updateOrderStatus(order.id, "READY_FOR_PICKUP")
      )
      
      await Promise.all(updatePromises)
      
      toast({
        title: "Orders ready for pickup",
        description: `Successfully marked ${filteredOrders.length} orders as ready for pickup.`,
      })
      
      await fetchOrders()
    } catch (err: any) {
      toast({
        title: "Error updating orders",
        description: err.message || "Failed to update some orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      status: undefined,
      paymentStatus: undefined,
      subscriptionStatus: undefined,
      dateRange: undefined,
      storeId: undefined,
    })
  }

  const applyQuickDateFilter = (option: string) => {
    const selectedOption = quickDateOptions.find(opt => opt.value === option)
    if (selectedOption) {
      setFilters(prev => ({
        ...prev,
        dateRange: selectedOption.getDates()
      }))
    }
  }

  const applyQuickStatusFilter = (option: string) => {
    switch (option) {
      case "paid":
        setFilters(prev => ({
          ...prev,
          paymentStatus: "PAID",
          status: undefined
        }))
        break
      case "pending_payment":
        setFilters(prev => ({
          ...prev,
          paymentStatus: "PENDING",
          status: undefined
        }))
        break
      case "failed_payment":
        setFilters(prev => ({
          ...prev,
          paymentStatus: "FAILED",
          status: undefined
        }))
        break
      case "out_for_delivery":
        setFilters(prev => ({
          ...prev,
          status: "OUT_FOR_DELIVERY",
          paymentStatus: undefined
        }))
        break
      case "delivered":
        setFilters(prev => ({
          ...prev,
          status: "DELIVERED",
          paymentStatus: undefined
        }))
        break
      case "all":
        setFilters(prev => ({
          ...prev,
          status: undefined,
          paymentStatus: undefined
        }))
        break
    }
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

  const getActiveQuickFilters = () => {
    const activeFilters = []
    if (filters.paymentStatus === "PAID") activeFilters.push("paid")
    if (filters.paymentStatus === "PENDING") activeFilters.push("pending_payment")
    if (filters.paymentStatus === "FAILED") activeFilters.push("failed_payment")
    if (filters.status === "OUT_FOR_DELIVERY") activeFilters.push("out_for_delivery")
    if (filters.status === "DELIVERED") activeFilters.push("delivered")
    if (!filters.status && !filters.paymentStatus) activeFilters.push("all")
    return activeFilters
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

      {/* Quick Status Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {quickStatusOptions.map((option) => {
              const Icon = option.icon
              const isActive = getActiveQuickFilters().includes(option.value)
              return (
                <Button
                  key={option.value}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => applyQuickStatusFilter(option.value)}
                  className={`flex items-center gap-2 ${isActive ? option.color : ""}`}
                >
                  <Icon className="h-4 w-4" />
                  {option.label}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>



      {/* Quick Date Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Quick Date Filters:</h3>
            <div className="flex flex-wrap gap-2">
              {quickDateOptions.map((option) => {
                const isActive = filters.dateRange?.start === option.getDates().start && 
                               filters.dateRange?.end === option.getDates().end
                return (
                  <Button
                    key={option.value}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => applyQuickDateFilter(option.value)}
                  >
                    {option.label}
                  </Button>
                )
              })}
            </div>
          </div>
          
          {/* Custom Date Range */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Custom Range:</span>
            </div>
            <div className="flex gap-2">
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
                className="w-40"
              />
              <span className="text-muted-foreground">to</span>
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
                className="w-40"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Advanced Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search orders by order number, customer, phone, email, address, status, or store..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select
                value={filters.storeId?.toString() || "all"}
                onValueChange={(value) => setFilters({ ...filters, storeId: value === "all" ? undefined : parseInt(value) })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Stores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  {uniqueStores.map((store) => (
                    <SelectItem key={store.id} value={store.id.toString()}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Advanced Filters
              </Button>
              
              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={!filters.search && !filters.status && !filters.paymentStatus && !filters.subscriptionStatus && !filters.dateRange && !filters.storeId}
              >
                Clear All
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
                      <SelectItem value="READY_FOR_PICKUP">Ready for Pickup</SelectItem>
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
          {filters.dateRange?.start && filters.dateRange?.end && ` from ${filters.dateRange.start} to ${filters.dateRange.end}`}
          {filters.paymentStatus && ` with ${filters.paymentStatus.toLowerCase()} payment`}
          {filters.status && ` with ${filters.status.toLowerCase()} status`}
          {filters.storeId && ` from store "${orders.find(o => o.storeId === filters.storeId)?.storeName || 'Unknown'}"`}
        </span>
        {filteredOrders.length > 0 && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePrintOrderLabels}
              className="flex items-center gap-2"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Order Labels
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleConfirmAllOrders}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <CheckSquare className="mr-2 h-4 w-4" />
                              {loading ? "Updating..." : "Mark All Ready for Pickup"}
            </Button>
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