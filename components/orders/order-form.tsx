"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { X, Plus, Trash2, Calculator, AlertCircle } from "lucide-react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { OrderService } from "@/lib/order-service"
import { StoreService, Store } from "@/lib/store-service"
import { Order, OrderItem, OrderFormData, MenuItem } from "@/lib/types"

const orderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().min(1, "Phone number is required"),
  customerEmail: z.string().email("Valid email is required"),
  deliveryAddress: z.string().min(1, "Delivery address is required"),
  orderDate: z.string().min(1, "Order date is required"),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  paymentMethod: z.enum(["cash", "card", "upi"]),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED"]),
  status: z.enum(["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"]),
  subscriptionStatus: z.enum(["active", "inactive", "expired"]),
  notes: z.string().optional(),
  storeId: z.number().min(1, "Store selection is required"),
  fulfillmentMode: z.enum(["PICKUP", "DELIVERY"]).default("DELIVERY"),
})

interface OrderFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: OrderFormData) => void
  initialData?: Order | null
}

export function OrderForm({ open, onOpenChange, onSubmit, initialData }: OrderFormProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(false)
  const [menuItemsLoading, setMenuItemsLoading] = useState(false)
  const [stores, setStores] = useState<Store[]>([])
  const [storesLoading, setStoresLoading] = useState(false)

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
      paymentStatus: "PENDING",
      status: "PENDING",
      subscriptionStatus: "active",
      notes: "",
      storeId: 0,
      fulfillmentMode: "DELIVERY",
    },
  })

  // Fetch menu items for selection
  useEffect(() => {
    const fetchMenuItems = async () => {
      setMenuItemsLoading(true)
      try {
        const data = await OrderService.getMenuItems()
        setMenuItems(data)
      } catch (error) {
        console.error("Error fetching menu items:", error)
        setMenuItems([])
      } finally {
        setMenuItemsLoading(false)
      }
    }
    
    if (open) {
      fetchMenuItems()
    }
  }, [open])

  // Fetch stores for selection
  useEffect(() => {
    const fetchStores = async () => {
      setStoresLoading(true)
      try {
        const data = await StoreService.getStores()
        setStores(data)
      } catch (error) {
        console.error("Error fetching stores:", error)
        setStores([])
      } finally {
        setStoresLoading(false)
      }
    }

    if (open) {
      fetchStores()
    }
  }, [open])

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
        subscriptionStatus: initialData.subscriptionStatus,
        notes: initialData.notes || "",
        storeId: initialData.storeId,
        fulfillmentMode: initialData.fulfillmentMode,
      })
      
      // Ensure all required fields are properly set for order items
      const processedItems = initialData.items.map(item => {
        const price = Number(item.price) || 0
        const quantity = Number(item.quantity) || 0
        const subtotal = Number(item.subtotal) || (price * quantity)
        const unitPrice = Number(item.unitPrice) || price
        const totalPrice = Number(item.totalPrice) || subtotal
        const chargedAmount = Number(item.chargedAmount) || (item.isProIncluded ? 0 : subtotal)
        
        return {
          ...item,
          price,
          quantity,
          subtotal,
          unitPrice,
          totalPrice,
          chargedAmount,
          isProIncluded: Boolean(item.isProIncluded),
        }
      })
      
      console.log('Processed items:', processedItems) // Debug log
      setSelectedItems(processedItems)
    } else {
      form.reset({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        deliveryAddress: "",
        orderDate: new Date().toISOString().split("T")[0],
        deliveryDate: new Date().toISOString().split("T")[0],
        paymentMethod: "cash",
        paymentStatus: "PENDING",
        status: "PENDING",
        subscriptionStatus: "active",
        notes: "",
        storeId: 0,
        fulfillmentMode: "DELIVERY",
      })
      setSelectedItems([])
    }
  }, [initialData, form])

  const handleAddItem = () => {
    const newItem: OrderItem = {
      id: Date.now(),
      productId: 0,
      productType: "menu_item_component",
      productName: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      chargedAmount: 0,
      isProIncluded: false,
      // Legacy fields for backward compatibility
      menuItemId: 0,
      menuItemName: "",
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
    
    // Ensure value is properly converted for numeric fields
    let processedValue = value
    if (field === 'quantity' || field === 'price') {
      processedValue = Number(value) || 0
    } else if (field === 'isProIncluded') {
      processedValue = Boolean(value)
    }
    
    updatedItems[index] = { ...updatedItems[index], [field]: processedValue }

    // Calculate subtotal when quantity or price changes
    if (field === "quantity" || field === "price") {
      const quantity = Number(updatedItems[index].quantity) || 0
      const price = Number(updatedItems[index].price) || 0
      const subtotal = quantity * price
      
      updatedItems[index].subtotal = subtotal
      updatedItems[index].totalPrice = subtotal
      updatedItems[index].unitPrice = price
      updatedItems[index].chargedAmount = updatedItems[index].isProIncluded ? 0 : subtotal
    }

    // Update menu item name and price when menuItemId changes
    if (field === "menuItemId") {
      const menuItem = menuItems.find(item => item.id === value)
      if (menuItem) {
        const price = Number(menuItem.price) || 0
        const quantity = Number(updatedItems[index].quantity) || 1
        const subtotal = price * quantity
        
        updatedItems[index].productName = menuItem.mainItem || ""
        updatedItems[index].unitPrice = price
        updatedItems[index].totalPrice = subtotal
        updatedItems[index].chargedAmount = updatedItems[index].isProIncluded ? 0 : subtotal
      }
    }

    // Update charged amount when isProIncluded changes
    if (field === "isProIncluded") {
      const subtotal = Number(updatedItems[index].subtotal) || 0
      updatedItems[index].chargedAmount = processedValue ? 0 : subtotal
    }

    console.log('Updated item:', updatedItems[index]) // Debug log
    setSelectedItems(updatedItems)
  }

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      const subtotal = Number(item.subtotal) || 0
      return total + subtotal
    }, 0)
  }

  const calculateChargedAmount = () => {
    return selectedItems.reduce((total, item) => {
      const chargedAmount = Number(item.chargedAmount) || 0
      return total + chargedAmount
    }, 0)
  }

  const validateForm = () => {
    if (selectedItems.length === 0) {
      return "Please add at least one item to the order"
    }

    const invalidItems = selectedItems.filter(item => {
      const productId = Number(item.productId)
      const quantity = Number(item.quantity)
      const price = Number(item.price)
      
      return !productId || quantity <= 0 || price <= 0 || 
             isNaN(price) || isNaN(quantity) || isNaN(productId)
    })

    if (invalidItems.length > 0) {
      return "Please ensure all items have valid product, quantity, and price"
    }

    if (form.watch("storeId") === 0) {
      return "Please select a store"
    }

    return null
  }

  const handleSubmit = async (data: z.infer<typeof orderSchema>) => {
    const validationError = validateForm()
    if (validationError) {
      alert(validationError)
      return
    }

    setLoading(true)
    try {
      const totalAmount = calculateTotal()
      const chargedAmount = calculateChargedAmount()
      
      // Ensure all items have proper values before submission
      const processedItems = selectedItems.map(item => ({
        ...item,
        unitPrice: item.unitPrice || item.price || 0,
        totalPrice: item.totalPrice || item.subtotal || 0,
        chargedAmount: item.chargedAmount || (item.isProIncluded ? 0 : (item.subtotal || 0)),
        subtotal: item.subtotal || 0,
      }))
      
      const orderData: OrderFormData = {
        ...data,
        items: processedItems,
        totalAmount,
        subtotal: totalAmount,
        chargedAmount,
        storeName: stores.find(store => store.id === data.storeId)?.name || "Unknown Store",
      }
      await onSubmit(orderData)
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting order:", error)
    } finally {
      setLoading(false)
    }
  }

  const getMenuItemDisplayName = (menuItem: MenuItem) => {
    const parts = []
    if (menuItem.mainItem) parts.push(menuItem.mainItem)
    if (menuItem.secondaryItem) parts.push(menuItem.secondaryItem)
    if (menuItem.sideItem) parts.push(menuItem.sideItem)
    return parts.join(" + ")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {initialData ? "Edit Order" : "Create New Order"}
            {selectedItems.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                Total: ${calculateTotal().toFixed(2)}
              </Badge>
            )}
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
                      <FormLabel>Customer Name *</FormLabel>
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
                      <FormLabel>Phone Number *</FormLabel>
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
                      <FormLabel>Email Address *</FormLabel>
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
                      <FormLabel>Delivery Address *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter complete delivery address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="storeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store *</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select store" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {storesLoading ? (
                            <SelectItem value="loading" disabled>Loading stores...</SelectItem>
                          ) : (
                            stores.map((store) => (
                              <SelectItem key={store.id} value={store.id.toString()}>
                                {store.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subscriptionStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subscription Status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subscription status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Order Items
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddItem}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No items added yet. Click "Add Item" to start building your order.</p>
                  </div>
                ) : (
                  <>
                    {selectedItems.map((item, index) => (
                      <div key={item.id} className="border rounded-lg p-4 bg-muted/30">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">
                              Menu Item *
                            </label>
                            <Select
                              value={item.productId.toString()}
                              onValueChange={(value) => handleItemChange(index, "productId", parseInt(value))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select menu item" />
                              </SelectTrigger>
                              <SelectContent>
                                {menuItemsLoading ? (
                                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                                ) : (
                                  menuItems.map((menuItem) => (
                                    <SelectItem key={menuItem.id} value={menuItem.id.toString()}>
                                      <div className="flex flex-col">
                                        <span className="font-medium">{getMenuItemDisplayName(menuItem)}</span>
                                        <span className="text-sm text-muted-foreground">
                                          ${menuItem.price.toFixed(2)}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">
                              Quantity *
                            </label>
                            <Input
                              type="number"
                              placeholder="Qty"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 0)}
                              min="1"
                              className="text-center"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">
                              Unit Price *
                            </label>
                            <Input
                              type="number"
                              placeholder="Price"
                              value={item.price}
                              onChange={(e) => handleItemChange(index, "price", parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.01"
                              className="text-center"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`pro-${item.id}`}
                              checked={item.isProIncluded}
                              onChange={(e) => handleItemChange(index, "isProIncluded", e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor={`pro-${item.id}`} className="text-sm font-medium text-muted-foreground">
                              Pro Included
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Subtotal</div>
                              <div className="text-lg font-semibold text-primary">
                                ${item.subtotal.toFixed(2)}
                              </div>
                              {item.isProIncluded && (
                                <div className="text-xs text-green-600">Pro: $0.00</div>
                              )}
                              {!item.isProIncluded && (
                                <div className="text-xs text-muted-foreground">Charged: ${item.chargedAmount.toFixed(2)}</div>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-lg">
                        <span>Total Amount</span>
                        <span className="text-2xl text-primary">${calculateTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Amount Charged</span>
                        <span>${calculateChargedAmount().toFixed(2)}</span>
                      </div>
                      {selectedItems.some(item => item.isProIncluded) && (
                        <div className="flex justify-between items-center text-sm text-green-600">
                          <span>Pro Discount</span>
                          <span>${(calculateTotal() - calculateChargedAmount()).toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </>
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
                      <FormLabel>Order Date *</FormLabel>
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
                      <FormLabel>Delivery Date *</FormLabel>
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
                      <FormLabel>Payment Method *</FormLabel>
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
                      <FormLabel>Payment Status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="PAID">Paid</SelectItem>
                          <SelectItem value="FAILED">Failed</SelectItem>
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
                      <FormLabel>Order Status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select order status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                          <SelectItem value="PREPARING">Preparing</SelectItem>
                          <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
                          <SelectItem value="DELIVERED">Delivered</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subscriptionStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subscription Status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subscription status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
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
                        <Textarea 
                          placeholder="Enter any additional notes, special instructions, or delivery preferences" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || selectedItems.length === 0}>
                {loading ? "Saving..." : initialData ? "Update Order" : "Create Order"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 