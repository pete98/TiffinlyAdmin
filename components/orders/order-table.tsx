"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Eye, MoreHorizontal, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Order, OrderItem } from "@/lib/types"

interface OrderTableProps {
  orders: Order[]
  onEdit: (order: Order) => void
  onDelete: (id: number) => void
  onStatusUpdate: (id: number, status: Order["status"]) => void
}

const statusConfig = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
    description: "Order received, waiting for confirmation"
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle,
    description: "Order confirmed, preparing to cook"
  },
  PREPARING: {
    label: "Preparing",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: TrendingUp,
    description: "Food is being prepared in the kitchen"
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: TrendingUp,
    description: "Order is on its way to you"
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
    description: "Order has been delivered successfully"
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
    description: "Order has been cancelled"
  }
}

const paymentStatusConfig = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    description: "Payment is pending"
  },
  PAID: {
    label: "Paid",
    color: "bg-green-100 text-green-800 border-green-200",
    description: "Payment has been received"
  },
  FAILED: {
    label: "Failed",
    color: "bg-red-100 text-red-800 border-red-200",
    description: "Payment has failed"
  }
}

export function OrderTable({ orders, onEdit, onDelete, onStatusUpdate }: OrderTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [quickStatusUpdate, setQuickStatusUpdate] = useState<{ id: number; status: Order["status"] } | null>(null)

  // Debug logging to help identify data issues
  useEffect(() => {
    if (orders.length > 0) {
      console.log('Orders data in table:', orders)
      orders.forEach(order => {
        if (isNaN(order.chargedAmount)) {
          console.warn(`Order ${order.id} has NaN chargedAmount:`, order)
        }
      })
    }
  }, [orders])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getSafeChargedAmount = (order: Order) => {
    // If chargedAmount is valid, use it
    if (!isNaN(order.chargedAmount) && order.chargedAmount >= 0) {
      return order.chargedAmount
    }
    
    // Otherwise, calculate it from items
    const calculatedChargedAmount = order.items.reduce((total, item) => {
      const itemCharged = item.isProIncluded ? 0 : (item.subtotal || 0)
      return total + itemCharged
    }, 0)
    
    return calculatedChargedAmount
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  const handleQuickStatusUpdate = (orderId: number, newStatus: Order["status"]) => {
    setQuickStatusUpdate({ id: orderId, status: newStatus })
  }

  const confirmStatusUpdate = async () => {
    if (quickStatusUpdate) {
      await onStatusUpdate(quickStatusUpdate.id, quickStatusUpdate.status)
      setQuickStatusUpdate(null)
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    const IconComponent = statusConfig[status].icon
    return <IconComponent className="h-4 w-4" />
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[1100px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Order ID</TableHead>
                  <TableHead className="w-48">Customer</TableHead>
                  <TableHead className="w-40">Store</TableHead>
                  <TableHead className="w-56">Items</TableHead>
                  <TableHead className="w-24 text-right">Total</TableHead>
                  <TableHead className="w-32">Subscription</TableHead>
                  <TableHead className="w-40">Status</TableHead>
                  <TableHead className="w-28">Payment</TableHead>
                  <TableHead className="w-32">Order Date</TableHead>
                  <TableHead className="w-20 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                        <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{order.storeName}</div>
                      <div className="text-xs text-muted-foreground">ID: {order.storeId}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.items.slice(0, 2).map(item => {
                          if (item.productType === "menu_item_component") {
                            return `${item.productName} (${item.componentType || "component"})`;
                          }
                          return item.productName || item.menuItemName || "Unknown Item";
                        }).join(", ")}
                        {order.items.length > 2 && "..."}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(order.totalAmount)}</TableCell>
                    <TableCell>
                      <Badge className={`${order.subscriptionStatus === "active" ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"} border`}>
                        {order.subscriptionStatus === "active" ? "Active" : order.subscriptionStatus === "inactive" ? "Inactive" : "Expired"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className={`${statusConfig[order.status].color} border`}>
                          {getStatusIcon(order.status)}
                          {statusConfig[order.status].label}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {Object.entries(statusConfig).map(([status, config]) => (
                              <DropdownMenuItem
                                key={status}
                                onClick={() => handleQuickStatusUpdate(order.id, status as Order["status"])}
                                className={order.status === status ? "bg-muted" : ""}
                              >
                                {getStatusIcon(status as Order["status"])}
                                {config.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${paymentStatusConfig[order.paymentStatus].color} border`}>
                        {paymentStatusConfig[order.paymentStatus].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(order.orderDate)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onEdit(order)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Order
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(order.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Status Update Dialog */}
      <Dialog open={!!quickStatusUpdate} onOpenChange={() => setQuickStatusUpdate(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to update the status of Order #{quickStatusUpdate?.id} to <strong>{statusConfig[quickStatusUpdate?.status || "PENDING"].label}</strong>?</p>
            <p className="text-sm text-muted-foreground">
              {statusConfig[quickStatusUpdate?.status || "PENDING"].description}
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setQuickStatusUpdate(null)}>
                Cancel
              </Button>
              <Button onClick={confirmStatusUpdate}>
                Update Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Order Details #{selectedOrder?.id}
              {selectedOrder && (
                <Badge className={`${statusConfig[selectedOrder.status].color} border`}>
                  {getStatusIcon(selectedOrder.status)}
                  {statusConfig[selectedOrder.status].label}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Name</label>
                      <p className="font-medium">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p className="font-medium">{selectedOrder.customerPhone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="font-medium">{selectedOrder.customerEmail}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Delivery Address</label>
                      <p className="font-medium">{selectedOrder.deliveryAddress}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Store Information */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Store Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Store Name</label>
                      <p className="font-medium">{selectedOrder.storeName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Store ID</label>
                      <p className="font-medium">{selectedOrder.storeId}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Pro Included</TableHead>
                        <TableHead className="text-right">Total Price</TableHead>
                        <TableHead className="text-right">Charged</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.productName || item.menuItemName || "Unknown Item"}
                            {item.componentType && (
                              <div className="text-xs text-muted-foreground">
                                ({item.componentType})
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {item.productType === "menu_item_component" ? "Menu Item" : "Add-on"}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                          <TableCell>
                            <Badge className={`${item.isProIncluded ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"} border`}>
                              {item.isProIncluded ? "Yes" : "No"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(item.totalPrice || item.subtotal || 0)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(item.chargedAmount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Subtotal</span>
                      <span className="text-xl font-bold">{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Amount</span>
                      <span className="text-2xl font-bold text-primary">{formatCurrency(selectedOrder.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Amount Charged</span>
                      <span>{formatCurrency(getSafeChargedAmount(selectedOrder))}</span>
                    </div>
                    {(() => {
                      const chargedAmount = getSafeChargedAmount(selectedOrder)
                      if (selectedOrder.totalAmount !== chargedAmount) {
                        return (
                          <div className="flex justify-between items-center text-sm text-green-600">
                            <span>Pro Discount</span>
                            <span>{formatCurrency(selectedOrder.totalAmount - chargedAmount)}</span>
                          </div>
                        )
                      }
                      return null
                    })()}
                  </div>
                </CardContent>
              </Card>

              {/* Order Information */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Order Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Order Date</label>
                        <p className="font-medium">{formatDate(selectedOrder.orderDate)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Delivery Date</label>
                        <p className="font-medium">{formatDate(selectedOrder.deliveryDate)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                        <p className="font-medium capitalize">{selectedOrder.paymentMethod}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
                        <p className="font-medium">{formatCurrency(selectedOrder.totalAmount)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Charged Amount</label>
                        <p className="font-medium">{formatCurrency(selectedOrder.chargedAmount)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Created At</label>
                        <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                      </div>
                      {selectedOrder.fulfillmentMode && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Fulfillment Mode</label>
                          <p className="font-medium capitalize">{selectedOrder.fulfillmentMode}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Order Status</label>
                        <div className="mt-1">
                          <Badge className={`${statusConfig[selectedOrder.status].color} border`}>
                            {getStatusIcon(selectedOrder.status)}
                            {statusConfig[selectedOrder.status].label}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Payment Status</label>
                        <div className="mt-1">
                          <Badge className={`${paymentStatusConfig[selectedOrder.paymentStatus].color} border`}>
                            {paymentStatusConfig[selectedOrder.paymentStatus].label}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Subscription Status</label>
                        <div className="mt-1">
                          <Badge className={`${selectedOrder.subscriptionStatus === "active" ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"} border`}>
                            {selectedOrder.subscriptionStatus === "active" ? "Active" : selectedOrder.subscriptionStatus === "inactive" ? "Inactive" : "Expired"}
                          </Badge>
                        </div>
                      </div>
                      {selectedOrder.stripePaymentIntentId && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Stripe Payment ID</label>
                          <p className="font-medium text-xs font-mono">{selectedOrder.stripePaymentIntentId}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Active</label>
                        <p className="font-medium">{selectedOrder.isActive ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                        <p className="font-medium">{formatDate(selectedOrder.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                  {selectedOrder.notes && (
                    <div className="mt-6">
                      <label className="text-sm font-medium text-muted-foreground">Notes</label>
                      <p className="mt-2 p-3 bg-muted rounded-md">{selectedOrder.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
} 