"use client"

import { useEffect, useState } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfile, UserProfileUpdate, UserSubscriptionUpdate } from "@/lib/types"

interface UserFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (user: UserProfileUpdate | UserSubscriptionUpdate, type: 'profile' | 'subscription') => void
  initialData?: UserProfile | null
}

export function UserForm({ open, onOpenChange, onSubmit, initialData }: UserFormProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription'>('profile')
  
  const profileForm = useForm<UserProfileUpdate>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      birthDate: "",
      streetAddress: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      foodPreference: "",
    },
  })

  const subscriptionForm = useForm<UserSubscriptionUpdate>({
    defaultValues: {
      firstName: "",
      lastName: "",
      stripeCustomerId: "",
      subscriptionStatus: "active",
      subscriptionId: "",
      subscriptionType: "monthly",
    },
  })

  useEffect(() => {
    if (initialData && open) {
      // Reset profile form
      profileForm.reset({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        phoneNumber: initialData.phoneNumber || "",
        birthDate: initialData.birthDate || "",
        streetAddress: initialData.streetAddress || "",
        city: initialData.city || "",
        state: initialData.state || "",
        postalCode: initialData.postalCode || "",
        country: initialData.country || "",
        foodPreference: initialData.foodPreference || "",
      })

      // Reset subscription form
      subscriptionForm.reset({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        stripeCustomerId: initialData.stripeCustomerId || "",
        subscriptionStatus: initialData.subscriptionStatus || "active",
        subscriptionId: initialData.subscriptionId || "",
        subscriptionType: initialData.subscriptionType || "monthly",
      })
    } else if (!initialData && open) {
      profileForm.reset()
      subscriptionForm.reset()
    }
  }, [profileForm, subscriptionForm, initialData, open])

  const handleProfileSubmit = (data: UserProfileUpdate) => {
    onSubmit(data, 'profile')
  }

  const handleSubscriptionSubmit = (data: UserSubscriptionUpdate) => {
    onSubmit(data, 'subscription')
  }

  const foodPreferences = [
    "gujarati", "punjabi", "south-indian", "north-indian", "chinese", 
    "italian", "mexican", "american", "mediterranean", "vegetarian", 
    "vegan", "gluten-free", "keto", "paleo"
  ]

  const subscriptionStatuses = [
    "active", "inactive", "expired", "cancelled"
  ]

  const subscriptionTypes = [
    "monthly", "weekly", "daily", "yearly", "custom"
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? `Edit User: ${initialData.firstName} ${initialData.lastName}` : "Add New User"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'profile' | 'subscription')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="subscription">Subscription & Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={profileForm.control}
                  name="phoneNumber"
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
                  control={profileForm.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="streetAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter street address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter state" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter postal code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="foodPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Food Preference</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select food preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {foodPreferences.map((pref) => (
                              <SelectItem key={pref} value={pref}>
                                {pref.charAt(0).toUpperCase() + pref.slice(1).replace('-', ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="submit">Update Profile</Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-4">
            <Form {...subscriptionForm}>
              <form onSubmit={subscriptionForm.handleSubmit(handleSubscriptionSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={subscriptionForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={subscriptionForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={subscriptionForm.control}
                  name="stripeCustomerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stripe Customer ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Stripe Customer ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={subscriptionForm.control}
                    name="subscriptionStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subscription Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subscriptionStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={subscriptionForm.control}
                    name="subscriptionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subscription Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subscriptionTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={subscriptionForm.control}
                    name="subscriptionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subscription ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Subscription ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="submit">Update Subscription</Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 