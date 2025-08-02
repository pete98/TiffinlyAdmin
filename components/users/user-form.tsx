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

interface UserFormValues {
  name: string
  stripeCustomerId: string
  subscriptionStatus: string
  subscriptionId: string
}

interface UserFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (user: UserFormValues) => void
  initialData?: UserFormValues | null
}

export function UserForm({ open, onOpenChange, onSubmit, initialData }: UserFormProps) {
  const form = useForm<UserFormValues>({
    defaultValues: {
      name: "",
      stripeCustomerId: "",
      subscriptionStatus: "",
      subscriptionId: "",
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name ?? "",
        stripeCustomerId: initialData.stripeCustomerId ?? "",
        subscriptionStatus: initialData.subscriptionStatus ?? "",
        subscriptionId: initialData.subscriptionId ?? "",
      })
    } else {
      form.reset({
        name: "",
        stripeCustomerId: "",
        subscriptionStatus: "",
        subscriptionId: "",
      })
    }
  }, [form, initialData, open])

  const handleSubmit = (data: UserFormValues) => {
    onSubmit(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stripeCustomerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stripe Customer ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Stripe Customer ID" {...field} readOnly={!!initialData} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subscriptionStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subscription Status</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Subscription Status" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
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
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{initialData ? "Update" : "Add"} User</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 