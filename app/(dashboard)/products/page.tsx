"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardTitle } from "@/components/dashboard/dashboard-title"
import { ProductTable } from "@/components/products/product-table"
import { ProductForm } from "@/components/products/product-form"
import { useToast } from "@/components/ui/use-toast"
import { apiFetch } from "@/lib/utils"

const PRODUCT_API = "https://b6b2efcf5d8d.ngrok-free.app/api/products"

interface Product {
  id: number
  name: string
  category: string
  price: number
  description: string
  isActive: boolean
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
      const data = await apiFetch<Product[]>(`${PRODUCT_API}`)
      setProducts(data)
    } catch (err: any) {
      toast({
        title: "Error fetching products",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddProduct = async (product: any) => {
    try {
      if (editingProduct) {
        // Update product
        const updated = await apiFetch<Product>(`${PRODUCT_API}/${editingProduct.id}`, {
          method: "PUT",
          body: JSON.stringify(product),
        })
        toast({
          title: "Product updated",
          description: `${updated.name} has been updated successfully.`,
        })
      } else {
        // Create product
        const created = await apiFetch<Product>(`${PRODUCT_API}`, {
          method: "POST",
          body: JSON.stringify(product),
        })
        toast({
          title: "Product added",
          description: `${created.name} has been added successfully.`,
        })
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
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const handleDeleteProduct = async (id: number) => {
    try {
      await apiFetch(`${PRODUCT_API}/${id}`, { method: "DELETE" })
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