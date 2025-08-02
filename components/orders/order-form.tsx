"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { X, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

const orderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().min(10, "Valid phone number is required"),
  customerEmail: z.string().email("Valid email is required"),
  deliveryAddress: z.string().min(1, "Delivery address is required"),
  orderDate: z.string().min(1, "Order date is required"),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  paymentMethod: z.enum(["cash", "card", "upi"]),
  paymentStatus: z.enum(["pending", "paid", "failed"]),
  status: z.enum(["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"]),
  notes: z.string().optional(),
})

interface OrderFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
  initialData?: Order | null
}

export function OrderForm({ open, onOpenChange, onSubmit, initialData }: OrderFormProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      deliveryAddress: "",
      orderDate: new Date().toISOString().split("T")[0],
      deliveryDate: new Date().toISOString().split("T")[0],
      paymentMethod: "cash",
      paymentStatus: "pending",
      status: "pending",
      notes: "",
    },
  })

  // Fetch menu items for selection
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("https://b6b2efcf5d8d.ngrok-free.app/api/menu-items")
        const data = await response.json()
        setMenuItems(data)
      } catch (error) {
        console.error("Error fetching menu items:", error)
      }
    }
    fetchMenuItems()
  }, [])

  // Set initial data when editing
  useEffect(() => {
    if (initialData) {
      form.reset({
        customerName: initialData.customerName,
        customerPhone: initialData.customerPhone,
        customerEmail: initialData.customerEmail,
        deliveryAddress: initialData.deliveryAddress,
        orderDate: initialData.orderDate.split("T")[0],
        deliveryDate: initialData.deliveryDate.split("T")[0],
        paymentMethod: initialData.paymentMethod,
        paymentStatus: initialData.paymentStatus,
        status: initialData.status,
        notes: initialData.notes || "",
      })
      setSelectedItems(initialData.items)
    } else {
      form.reset({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        deliveryAddress: "",
        orderDate: new Date().toISOString().split("T")[0],
        deliveryDate: new Date().toISOString().split("T")[0],
        paymentMethod: "cash",
        paymentStatus: "pending",
        status: "pending",
        notes: "",
      })
      setSelectedItems([])
    }
  }, [initialData, form])

  const handleAddItem = () => {
    const newItem: OrderItem = {
      id: Date.now(),
      menuItemId: 0,
      menuItemName: "",
      quantity: 1,
      price: 0,
      subtotal: 0,
    }
    setSelectedItems([...selectedItems, newItem])
  }

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
    const updatedItems = [...selectedItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    // Calculate subtotal when quantity or price changes
    if (field === "quantity" || field === "price") {
      updatedItems[index].subtotal = updatedItems[index].quantity * updatedItems[index].price
    }

    // Update menu item name when menuItemId changes
    if (field === "menuItemId") {
      const menuItem = menuItems.find(item => item.id === value)
      if (menuItem) {
        updatedItems[index].menuItemName = menuItem.mainItem
        updatedItems[index].price = 50 // Default price, you might want to get this from the menu item
        updatedItems[index].subtotal = updatedItems[index].quantity * updatedItems[index].price
      }
    }

    setSelectedItems(updatedItems)
  }

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + item.subtotal, 0)
  }

  const handleSubmit = async (data: z.infer<typeof orderSchema>) => {
    if (selectedItems.length === 0) {
      alert("Please add at least one item to the order")
      return
    }

    setLoading(true)
    try {
      const orderData = {
        ...data,
        items: selectedItems,
        totalAmount: calculateTotal(),
        isActive: true,
      }
      await onSubmit(orderData)
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting order:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Order" : "Create New Order"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deliveryAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter delivery address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedItems.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Select
                        value={item.menuItemId.toString()}
                        onValueChange={(value) => handleItemChange(index, "menuItemId", parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select menu item" />
                        </SelectTrigger>
                        <SelectContent>
                                                     {menuItems.map((menuItem) => (
                             <SelectItem key={menuItem.id} value={menuItem.id.toString()}>
                               {menuItem.mainItem}
                             </SelectItem>
                           ))}
                        </SelectContent>
                      </Select>

                      <Input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 0)}
                        min="1"
                      />

                      <Input
                        type="number"
                        placeholder="Price"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, "price", parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />

                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          ${item.subtotal.toFixed(2)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddItem}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>

                {selectedItems.length > 0 && (
                  <div className="text-right">
                                      <div className="text-lg font-semibold">
                    Total: ${calculateTotal().toFixed(2)}
                  </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="orderDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deliveryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="upi">UPI</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select order status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="preparing">Preparing</SelectItem>
                          <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter any additional notes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : initialData ? "Update Order" : "Create Order"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 