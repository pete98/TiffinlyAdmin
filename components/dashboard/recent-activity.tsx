import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for recent activity
const activities = [
  { id: 1, action: "New order received", time: "2 minutes ago", user: "John Doe" },
  { id: 2, action: "Store status updated", time: "15 minutes ago", user: "Admin" },
  { id: 3, action: "New kitchen added", time: "1 hour ago", user: "Admin" },
  { id: 4, action: "Menu item updated", time: "3 hours ago", user: "Jane Smith" },
  { id: 5, action: "User registered", time: "5 hours ago", user: "System" },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions in your admin panel</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 rounded-md border p-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">{activity.action}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{activity.time}</span>
                  <span className="mx-1">•</span>
                  <span>{activity.user}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
