"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface MenuItemFormValues {
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

interface MenuItemFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (menuItem: MenuItemFormValues) => void
  initialData?: MenuItemFormValues | null
}

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function MenuItemForm({ open, onOpenChange, onSubmit, initialData }: MenuItemFormProps) {
  const form = useForm<MenuItemFormValues>({
    defaultValues: {
      mainItem: "",
      mainItemQuantity: 1,
      secondaryItem: "",
      secondaryItemQuantity: 1,
      sideItem: "",
      sideItemQuantity: 1,
      price: 0,
      imageUrl: "",
      description: "",
      weekday: "",
      weekDate: new Date().toISOString().split('T')[0], // Today's date as default
      isActive: true,
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        mainItem: initialData.mainItem ?? "",
        mainItemQuantity: initialData.mainItemQuantity ?? 1,
        secondaryItem: initialData.secondaryItem ?? "",
        secondaryItemQuantity: initialData.secondaryItemQuantity ?? 1,
        sideItem: initialData.sideItem ?? "",
        sideItemQuantity: initialData.sideItemQuantity ?? 1,
        price: initialData.price ?? 0,
        imageUrl: initialData.imageUrl ?? "",
        description: initialData.description ?? "",
        weekday: initialData.weekday ?? "",
        weekDate: initialData.weekDate ?? new Date().toISOString().split('T')[0],
        isActive: initialData.isActive ?? true,
      })
    } else {
      form.reset({
        mainItem: "",
        mainItemQuantity: 1,
        secondaryItem: "",
        secondaryItemQuantity: 1,
        sideItem: "",
        sideItemQuantity: 1,
        price: 0,
        imageUrl: "",
        description: "",
        weekday: "",
        weekDate: new Date().toISOString().split('T')[0], // Today's date as default
        isActive: true,
      })
    }
  }, [form, initialData, open])

  const handleSubmit = (data: MenuItemFormValues) => {
    onSubmit(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mainItem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Item *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter main item name" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mainItemQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Item Quantity *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter main item quantity" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        required 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter image URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="secondaryItem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Item *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter secondary item" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="secondaryItemQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Item Quantity *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter secondary item quantity" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        required 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sideItem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Side Item *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter side item" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sideItemQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Side Item Quantity *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter side item quantity" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        required 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter price" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        required 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weekday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekday *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a weekday" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {weekdays.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="weekDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Week Date *</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      placeholder="Select week date" 
                      {...field} 
                      required 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter description" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{initialData ? "Update" : "Add"} Menu Item</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 