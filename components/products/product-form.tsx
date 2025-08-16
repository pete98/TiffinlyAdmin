"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Image as ImageIcon } from "lucide-react"
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
import type { Product } from "./product-table"

interface ProductFormValues {
  name: string
  category: string
  price: number
  description: string
  imgUrl?: string
  isActive: boolean
}

interface ProductFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (product: ProductFormValues) => Promise<void>
  initialData?: Product | null
}

const categories = ["Drinks", "Extras", "Starters", "Main Course", "Desserts", "Beverages"]

// Image preview component
function ImagePreview({ imgUrl, name }: { imgUrl?: string; name: string }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  const shouldShowPlaceholder = !imgUrl || imageError

  if (!imgUrl) {
    return null
  }

  return (
    <div className="mt-2">
      <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
      <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border">
        {imageLoading && !shouldShowPlaceholder && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}
        
        {shouldShowPlaceholder ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
        ) : (
          <img
            src={imgUrl}
            alt={name}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </div>
    </div>
  )
}

export function ProductForm({ open, onOpenChange, onSubmit, initialData }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      description: "",
      imgUrl: "",
      isActive: true,
    },
  })

  const [imgUrl, setImgUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name ?? "",
        category: initialData.category ?? "",
        price: initialData.price ?? 0,
        description: initialData.description ?? "",
        imgUrl: initialData.imgUrl ?? "",
        isActive: initialData.isActive ?? true,
      })
      setImgUrl(initialData.imgUrl ?? "")
    } else {
      form.reset({
        name: "",
        category: "",
        price: 0,
        description: "",
        imgUrl: "",
        isActive: true,
      })
      setImgUrl("")
    }
  }, [form, initialData, open])

  const handleSubmit = async (data: ProductFormValues) => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!isSubmitting) {
        onOpenChange(newOpen)
      }
    }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        
        {/* Show Stripe sync info when editing */}
        {initialData?.stripeProductId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-blue-800">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Synced with Stripe</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Product ID: {initialData.stripeProductId}
            </p>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                rules={{ 
                  required: "Price is required",
                  min: { value: 0, message: "Price must be positive" }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter price" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        min={0}
                        step={0.01}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imgUrl"
                rules={{
                  validate: (value) => {
                    if (!value || value.trim() === '') return true
                    const urlPattern = /^https?:\/\/.+/
                    return urlPattern.test(value) || "Please enter a valid URL starting with http:// or https://"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/image.jpg" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value)
                          setImgUrl(e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Product description" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value === "true")} defaultValue={field.value ? "true" : "false"} value={field.value ? "true" : "false"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Image Preview */}
            <ImagePreview imgUrl={imgUrl} name={form.watch("name") || "Product"} />
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  if (!isSubmitting) {
                    onOpenChange(false)
                  }
                }} 
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {initialData ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  `${initialData ? "Update" : "Add"} Product`
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 