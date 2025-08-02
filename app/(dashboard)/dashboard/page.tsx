"use client"
import { useEffect, useState } from "react"
import { Building2, Package, ShoppingBag, Users } from "lucide-react"
import { DashboardTitle } from "@/components/dashboard/dashboard-title"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { AccessTokenDisplay } from "@/components/dashboard/access-token-display"
import { BearerTokenTest } from "@/components/dashboard/bearer-token-test"
import { apiClient } from "@/lib/api"

const KITCHEN_API = "https://b6b2efcf5d8d.ngrok-free.app/api/kitchen"
const STORE_API = "https://b6b2efcf5d8d.ngrok-free.app/api/store"

export default function DashboardPage() {
  const [kitchenCount, setKitchenCount] = useState<number | null>(null)
  const [storeCount, setStoreCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // Fetch both APIs in parallel to reduce total time
        const [kitchens, stores] = await Promise.allSettled([
          apiClient.get<any>(KITCHEN_API),
          apiClient.get<any>(STORE_API)
        ])

        // Handle kitchens data
        let kitchenCount = null
        if (kitchens.status === 'fulfilled') {
          const data = kitchens.value
          let kitchensData: any[] = []
          
          if (Array.isArray(data)) {
            kitchensData = data
          } else if (data && Array.isArray(data.data)) {
            kitchensData = data.data
          } else if (data && Array.isArray(data.kitchens)) {
            kitchensData = data.kitchens
          } else if (data && Array.isArray(data.items)) {
            kitchensData = data.items
          } else {
            console.warn('Unexpected kitchens API response structure:', data)
            kitchensData = []
          }
          
          kitchenCount = kitchensData.length
        }
        setKitchenCount(kitchenCount)

        // Handle stores data
        let storeCount = null
        if (stores.status === 'fulfilled') {
          const data = stores.value
          let storesData: any[] = []
          
          if (Array.isArray(data)) {
            storesData = data
          } else if (data && Array.isArray(data.data)) {
            storesData = data.data
          } else if (data && Array.isArray(data.stores)) {
            storesData = data.stores
          } else if (data && Array.isArray(data.items)) {
            storesData = data.items
          } else {
            console.warn('Unexpected stores API response structure:', data)
            storesData = []
          }
          
          storeCount = storesData.length
        }
        setStoreCount(storeCount)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setKitchenCount(null)
        setStoreCount(null)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      <DashboardTitle
        title="Welcome to Tiffin Admin Panel"
        description="Manage your tiffin delivery service from one place"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Kitchens" 
          value={loading ? "..." : (kitchenCount !== null ? kitchenCount.toString() : "-")} 
          icon={Building2} 
          trend="+2 this month" 
          trendUp={true} 
        />
        <StatsCard 
          title="Total Stores" 
          value={loading ? "..." : (storeCount !== null ? storeCount.toString() : "-")} 
          icon={ShoppingBag} 
          trend="+5 this month" 
          trendUp={true} 
        />
        <StatsCard title="Total Users" value="1,234" icon={Users} trend="+123 this month" trendUp={true} />
        <StatsCard title="Active Orders" value="86" icon={Package} trend="-2% from yesterday" trendUp={false} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivity />
        <QuickActions />
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <AccessTokenDisplay />
        <BearerTokenTest />
      </div>
    </div>
  )
}
