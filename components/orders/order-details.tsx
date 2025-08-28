"use client"

import { useState } from "react"
import { Edit, Phone, Mail, MapPin, Calendar, Clock, DollarSign, Package, Truck, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Order, OrderItem } from "@/lib/types"

interface OrderDetailsProps {
  order: Order
  onEdit: (order: Order) => void
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
    icon: Package,
    description: "Food is being prepared in the kitchen"
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Truck,
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

export function OrderDetails({ order, onEdit, onStatusUpdate }: OrderDetailsProps) {
  const [selectedStatus, setSelectedStatus] = useState<Order["status"] | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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

  const getStatusIcon = (status: Order["status"]) => {
    const IconComponent = statusConfig[status].icon
    return <IconComponent className="h-4 w-4" />
  }

  const handleStatusUpdate = async (newStatus: Order["status"]) => {
    try {
      await onStatusUpdate(order.id, newStatus)
      setSelectedStatus(null)
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const getStatusTimeline = () => {
    const timeline = [
      { status: "PENDING", label: "Order Placed", completed: true },
      { status: "CONFIRMED", label: "Order Confirmed", completed: order.status !== "PENDING" },
      { status: "PREPARING", label: "Food Preparing", completed: ["CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"].includes(order.status) },
      { status: "OUT_FOR_DELIVERY", label: "Out for Delivery", completed: ["OUT_FOR_DELIVERY", "DELIVERED"].includes(order.status) },
      { status: "DELIVERED", label: "Delivered", completed: order.status === "DELIVERED" }
    ]

    if (order.status === "CANCELLED") {
      return timeline.map(item => ({ ...item, completed: false }))
    }

    return timeline
  }

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Order #{order.id}</CardTitle>
              <p className="text-muted-foreground">Placed on {formatDate(order.orderDate)}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${statusConfig[order.status].color} border text-sm px-3 py-1`}>
                {getStatusIcon(order.status)}
                {statusConfig[order.status].label}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => onEdit(order)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Order
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Order Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="flex items-center justify-between">
              {getStatusTimeline().map((step, index) => (
                <div key={step.status} className="flex flex-col items-center relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step.completed 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : "bg-muted border-muted-foreground text-muted-foreground"
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="text-xs text-center mt-2 max-w-20">
                    {step.label}
                  </div>
                  {index < getStatusTimeline().length - 1 && (
                    <div className={`absolute top-4 left-full w-full h-0.5 ${
                      step.completed ? "bg-primary" : "bg-muted"
                    }`} style={{ width: "calc(100vw / 5 - 2rem)" }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="text-lg font-semibold">{order.customerName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-lg">{order.customerPhone}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-lg">{order.customerEmail}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Delivery Address</label>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <p className="text-lg">{order.deliveryAddress}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Store Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Store Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Store Name</label>
                <p className="text-lg font-semibold">{order.storeName}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Store ID</label>
                <p className="text-lg">{order.storeId}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Items ({order.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.menuItemName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatCurrency(item.price)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(item.subtotal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <Separator className="my-4" />
          
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="text-3xl font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Order Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Order Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Order Date</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-lg">{formatDate(order.orderDate)}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Delivery Date</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-lg">{formatDate(order.deliveryDate)}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <p className="text-lg capitalize">{order.paymentMethod}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created At</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-lg">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Order Status</label>
                <div className="mt-1">
                  <Badge className={`${statusConfig[order.status].color} border`}>
                    {getStatusIcon(order.status)}
                    {statusConfig[order.status].label}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {statusConfig[order.status].description}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payment Status</label>
                <div className="mt-1">
                  <Badge className={`${paymentStatusConfig[order.paymentStatus].color} border`}>
                    {paymentStatusConfig[order.paymentStatus].label}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {paymentStatusConfig[order.paymentStatus].description}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Active</label>
                <p className="text-lg">{order.isActive ? "Yes" : "No"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-lg">{formatDate(order.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
          
          {order.notes && (
            <div className="mt-6">
              <label className="text-sm font-medium text-muted-foreground">Notes & Instructions</label>
              <div className="mt-2 p-3 bg-muted rounded-md">
                <p className="text-lg">{order.notes}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Status Update */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Status Update</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(statusConfig).map(([status, config]) => (
              <Button
                key={status}
                variant={order.status === status ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(status as Order["status"])}
                className="flex items-center gap-2"
              >
                {getStatusIcon(status as Order["status"])}
                {config.label}
              </Button>
            ))}
          </div>
          
          {selectedStatus && selectedStatus !== order.status && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm mb-3">
                Are you sure you want to update the status to <strong>{statusConfig[selectedStatus].label}</strong>?
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {statusConfig[selectedStatus].description}
              </p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleStatusUpdate(selectedStatus)}
                >
                  Update Status
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedStatus(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 