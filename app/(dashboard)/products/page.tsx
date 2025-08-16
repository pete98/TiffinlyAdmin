"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardTitle } from "@/components/dashboard/dashboard-title"
import { ProductTable } from "@/components/products/product-table"
import { ProductForm } from "@/components/products/product-form"
import { useToast } from "@/components/ui/use-toast"
import { apiClient } from "@/lib/api"

const PRODUCT_API = "https://b6b2efcf5d8d.ngrok-free.app/api/products"

interface Product {
  id: number
  name: string
  category: string
  price: number
  description: string
  imgUrl?: string
  isActive: boolean
  stripeProductId?: string
}

export default function ProductsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await apiClient.get<any>(`${PRODUCT_API}`)
      
      // Handle different response structures
      let productsData: Product[] = []
      if (Array.isArray(data)) {
        productsData = data
      } else if (data && Array.isArray(data.data)) {
        productsData = data.data
      } else if (data && Array.isArray(data.products)) {
        productsData = data.products
      } else if (data && Array.isArray(data.items)) {
        productsData = data.items
      } else {
        console.warn('Unexpected API response structure:', data)
        productsData = []
      }
      
      setProducts(productsData)
    } catch (err: any) {
      console.error('Error fetching products:', err)
      toast({
        title: "Error fetching products",
        description: err.message,
        variant: "destructive",
      })
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredProducts = Array.isArray(products) ? products.filter(
    (product) =>
      product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product?.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : []

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0)

  const handleAddProduct = useCallback(async (product: any) => {
    const now = Date.now()
    const timeSinceLastSubmission = now - lastSubmissionTime
    
    console.log('🔄 Product submission attempt:', {
      isSubmitting,
      timeSinceLastSubmission,
      productName: product.name,
      isEdit: !!editingProduct
    })
    
    // Prevent submissions within 2 seconds of each other
    if (timeSinceLastSubmission < 2000) {
      console.log('❌ Preventing rapid successive submissions')
      return
    }
    
    // Prevent double submission
    if (isSubmitting) {
      console.log('❌ Preventing duplicate submission')
      return
    }

    console.log('✅ Proceeding with submission')
    setIsSubmitting(true)
    setLastSubmissionTime(now)
    
    try {
      if (editingProduct) {
        // Update product
        console.log('🔄 Making PUT request to update product:', editingProduct.id)
        const updated = await apiClient.put<Product>(`${PRODUCT_API}/${editingProduct.id}`, product)
        console.log('✅ Product updated successfully:', updated)
        
        // Enhanced success message with Stripe ID if available
        if (updated.stripeProductId) {
          toast({
            title: "Product updated successfully! 🎉",
            description: `${updated.name} has been updated and remains synced with Stripe (ID: ${updated.stripeProductId})`,
          })
        } else {
          toast({
            title: "Product updated",
            description: `${updated.name} has been updated successfully.`,
          })
        }
      } else {
        // Create product
        console.log('🔄 Making POST request to create product:', product.name)
        const created = await apiClient.post<Product>(`${PRODUCT_API}`, product)
        console.log('✅ Product created successfully:', created)
        
        // Enhanced success message with Stripe ID if available
        if (created.stripeProductId) {
          toast({
            title: "Product created successfully! 🎉",
            description: `${created.name} has been added and synced with Stripe (ID: ${created.stripeProductId})`,
          })
        } else {
          toast({
            title: "Product added",
            description: `${created.name} has been added successfully.`,
          })
        }
      }
      setIsFormOpen(false)
      setEditingProduct(null)
      await fetchProducts()
    } catch (err: any) {
      toast({
        title: "Error saving product",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [editingProduct, isSubmitting, lastSubmissionTime, toast, fetchProducts])

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const handleDeleteProduct = async (id: number) => {
    try {
      await apiClient.delete(`${PRODUCT_API}/${id}`)
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully.",
        variant: "destructive",
      })
      await fetchProducts()
    } catch (err: any) {
      toast({
        title: "Error deleting product",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <DashboardTitle title="Product Management" description="Add, edit, and manage your products" />

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null)
            setIsFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading products...</div>
      ) : (
        <ProductTable
          products={filteredProducts}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      )}

      <ProductForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleAddProduct}
        initialData={editingProduct}
      />
    </div>
  )
} 