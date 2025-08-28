"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Trash, Eye } from "lucide-react"
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
import { UserProfile } from "@/lib/types"

interface UserTableProps {
  users: UserProfile[]
  onEdit: (user: UserProfile) => void
  onDelete: (id: string) => void
  onView: (user: UserProfile) => void
}

export function UserTable({ users, onEdit, onDelete, onView }: UserTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const totalPages = Math.ceil(users.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage)

  const confirmDelete = (id: string) => {
    setDeleteId(id)
  }

  const handleDelete = () => {
    if (deleteId !== null) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  const getSubscriptionStatusColor = (status: string | null | undefined) => {
    if (!status) return 'secondary'
    
    switch (status.toLowerCase()) {
      case 'active':
        return 'default'
      case 'inactive':
        return 'secondary'
      case 'expired':
        return 'destructive'
      case 'cancelled':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const formatSubscriptionStatus = (status: string | null | undefined) => {
    if (!status) return 'Not specified'
    return status
  }

  const formatSubscriptionId = (id: string | null | undefined) => {
    if (!id) return 'Not specified'
    return id
  }

  const formatStripeId = (id: string | null | undefined) => {
    if (!id) return 'Not specified'
    return id
  }

  const formatFoodPreference = (pref: string | null | undefined) => {
    if (!pref) return 'Not specified'
    return pref
  }

  const formatLocation = (city: string | null | undefined, state: string | null | undefined, postalCode: string | null | undefined) => {
    const cityText = city || 'Not specified'
    const stateText = state || 'Not specified'
    const postalText = postalCode || 'Not specified'
    
    return {
      cityState: `${cityText}, ${stateText}`,
      postalCode: postalText
    }
  }

  const formatName = (firstName: string | null | undefined, lastName: string | null | undefined) => {
    const first = firstName || 'Not specified'
    const last = lastName || 'Not specified'
    return `${first} ${last}`.trim() || 'Not specified'
  }

  const formatPhone = (phone: string | null | undefined) => {
    if (!phone) return 'Not specified'
    return phone
  }

  const formatAuth0Id = (id: string | null | undefined) => {
    if (!id) return 'Not specified'
    return id
  }

  const formatSubscriptionType = (type: string | null | undefined) => {
    if (!type) return 'Not specified'
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Food Preference</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Stripe ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user, idx) => (
                <TableRow key={user.auth0Id || `user-${idx}`}>
                  <TableCell className="font-medium">{startIndex + idx + 1}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{formatName(user.firstName, user.lastName)}</div>
                      <div className="text-sm text-muted-foreground">{formatAuth0Id(user.auth0Id)}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatPhone(user.phoneNumber)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{formatLocation(user.city, user.state, user.postalCode).cityState}</div>
                      <div className="text-muted-foreground">{formatLocation(user.city, user.state, user.postalCode).postalCode}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {formatFoodPreference(user.foodPreference)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Badge variant={getSubscriptionStatusColor(user.subscriptionStatus)}>
                        {formatSubscriptionStatus(user.subscriptionStatus)}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatSubscriptionId(user.subscriptionId)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {formatSubscriptionType(user.subscriptionType)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-mono text-muted-foreground">
                      {formatStripeId(user.stripeCustomerId)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onView(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Subscription
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => confirmDelete(user.auth0Id || '')}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete User
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
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              and remove their data from our servers.
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