"use client"
import { useEffect, useState } from "react"
import { Building2, Package, ShoppingBag, Users } from "lucide-react"
import { DashboardTitle } from "@/components/dashboard/dashboard-title"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { apiFetch } from "@/lib/utils"

const KITCHEN_API = "https://b6b2efcf5d8d.ngrok-free.app/api/kitchen"
const STORE_API = "https://b6b2efcf5d8d.ngrok-free.app/api/store"

export default function DashboardPage() {
  const [kitchenCount, setKitchenCount] = useState<number | null>(null)
  const [storeCount, setStoreCount] = useState<number | null>(null)

  useEffect(() => {
    // Fetch kitchens count
    apiFetch<any[]>(KITCHEN_API)
      .then(data => setKitchenCount(data.length))
      .catch(() => setKitchenCount(null))
    // Fetch stores count
    apiFetch<any[]>(STORE_API)
      .then(data => setStoreCount(data.length))
      .catch(() => setStoreCount(null))
  }, [])

  return (
    <div className="space-y-6">
      <DashboardTitle
        title="Welcome to Tiffin Admin Panel"
        description="Manage your tiffin delivery service from one place"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Kitchens" value={kitchenCount !== null ? kitchenCount.toString() : "-"} icon={Building2} trend="+2 this month" trendUp={true} />
        <StatsCard title="Total Stores" value={storeCount !== null ? storeCount.toString() : "-"} icon={ShoppingBag} trend="+5 this month" trendUp={true} />
        <StatsCard title="Total Users" value="1,234" icon={Users} trend="+123 this month" trendUp={true} />
        <StatsCard title="Active Orders" value="86" icon={Package} trend="-2% from yesterday" trendUp={false} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  )
}
