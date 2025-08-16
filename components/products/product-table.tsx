"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Trash, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export interface Product {
  id: number
  name: string
  category: string
  price: number
  description: string
  imgUrl?: string
  isActive: boolean
  stripeProductId?: string
}

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
}

// Image component with fallback handling
function ProductImage({ imgUrl, name }: { imgUrl?: string; name: string }) {
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

  return (
    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
      {imageLoading && !shouldShowPlaceholder && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      {shouldShowPlaceholder ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <img 
            src="/placeholder-product.svg" 
            alt="Product placeholder" 
            className="w-8 h-8 opacity-60"
            onError={(e) => {
              // Fallback to icon if SVG fails
              e.currentTarget.style.display = 'none'
              const icon = e.currentTarget.nextElementSibling as HTMLElement
              if (icon) icon.style.display = 'block'
            }}
          />
          <ImageIcon className="w-6 h-6 text-gray-400 hidden" />
        </div>
      ) : (
        <img
          src={imgUrl}
          alt={name}
          className="w-full h-full object-cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      )}
    </div>
  )
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const totalPages = Math.ceil(products.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage)

  const confirmDelete = (id: number) => {
    setDeleteId(id)
  }

  const handleDelete = () => {
    if (deleteId !== null) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead className="hidden sm:table-cell">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden lg:table-cell">Description</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product, idx) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{startIndex + idx + 1}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <ProductImage imgUrl={product.imgUrl} name={product.name} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{product.name}</span>
                      {product.stripeProductId && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-xs text-blue-600 font-medium flex items-center gap-1 cursor-help">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Stripe Synced
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Stripe Product ID: {product.stripeProductId}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      <span className="text-sm text-gray-500 sm:hidden">{product.category}</span>
                      <span className="text-sm text-gray-500 sm:hidden">${product.price.toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                  <TableCell className="hidden sm:table-cell">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="hidden lg:table-cell max-w-xs truncate">{product.description}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      variant={product.isActive ? "default" : "secondary"}
                      className={product.isActive ? "bg-green-500 hover:bg-green-600" : "bg-slate-500"}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => confirmDelete(product.id)} className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 