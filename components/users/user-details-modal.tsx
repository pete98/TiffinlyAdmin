"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { UserProfile } from "@/lib/types"
import { Calendar, MapPin, Phone, CreditCard, UtensilsCrossed } from "lucide-react"

interface UserDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserProfile | null
}

export function UserDetailsModal({ open, onOpenChange, user }: UserDetailsModalProps) {
  if (!user) return null

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

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not specified'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
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

  const formatAddress = (address: string | null | undefined) => {
    if (!address) return 'Not specified'
    return address
  }

  const formatCity = (city: string | null | undefined) => {
    if (!city) return 'Not specified'
    return city
  }

  const formatState = (state: string | null | undefined) => {
    if (!state) return 'Not specified'
    return state
  }

  const formatPostalCode = (postalCode: string | null | undefined) => {
    if (!postalCode) return 'Not specified'
    return postalCode
  }

  const formatCountry = (country: string | null | undefined) => {
    if (!country) return 'Not specified'
    return country
  }

  const formatFoodPreference = (pref: string | null | undefined) => {
    if (!pref) return 'Not specified'
    return pref
  }

  const formatStripeId = (id: string | null | undefined) => {
    if (!id) return 'Not specified'
    return id
  }

  const formatSubscriptionId = (id: string | null | undefined) => {
    if (!id) return 'Not specified'
    return id
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-primary">
                {(() => {
                  const name = formatName(user.firstName, user.lastName)
                  return name !== 'Not specified' ? name.substring(0, 2).toUpperCase() : 'U'
                })()}
              </span>
            </div>
            <div>
              <div className="text-xl font-bold">{formatName(user.firstName, user.lastName)}</div>
              <div className="text-sm text-muted-foreground font-normal">{formatAuth0Id(user.auth0Id)}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Phone:</span>
                  <span>{formatPhone(user.phoneNumber)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Birth Date:</span>
                  <span>{formatDate(user.birthDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Food Preference:</span>
                  <Badge variant="outline" className="capitalize">
                    {formatFoodPreference(user.foodPreference)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address Information
            </h3>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Street:</span> {formatAddress(user.streetAddress)}
              </div>
              <div className="text-sm">
                <span className="font-medium">City:</span> {formatCity(user.city)}
              </div>
              <div className="text-sm">
                <span className="font-medium">State:</span> {formatState(user.state)}
              </div>
              <div className="text-sm">
                <span className="font-medium">Postal Code:</span> {formatPostalCode(user.postalCode)}
              </div>
              <div className="text-sm">
                <span className="font-medium">Country:</span> {formatCountry(user.country)}
              </div>
            </div>
          </div>

          <Separator />

          {/* Subscription & Billing */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription & Billing
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Subscription Status:</span>
                  <div className="mt-1">
                    <Badge variant={getSubscriptionStatusColor(user.subscriptionStatus)}>
                      {formatSubscriptionStatus(user.subscriptionStatus)}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Subscription Type:</span>
                  <div className="mt-1">
                    <Badge variant="outline" className="capitalize">
                      {formatSubscriptionType(user.subscriptionType)}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Subscription ID:</span>
                  <div className="mt-1 font-mono text-xs bg-muted p-2 rounded">
                    {formatSubscriptionId(user.subscriptionId)}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Stripe Customer ID:</span>
                  <div className="mt-1 font-mono text-xs bg-muted p-2 rounded">
                    {formatStripeId(user.stripeCustomerId)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
