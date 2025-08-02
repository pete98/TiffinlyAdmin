import { Building2, Package, ShoppingBag, Utensils } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    { name: "Add Kitchen", href: "/kitchens", icon: Building2 },
    { name: "Add Store", href: "/stores", icon: ShoppingBag },
    { name: "Add Menu Item", href: "/menu-items", icon: Utensils },
    { name: "View Orders", href: "/orders", icon: Package },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks you can perform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <Button key={action.name} variant="outline" asChild className="h-auto flex-col gap-2 p-4 bg-transparent">
              <Link href={action.href}>
                <action.icon className="h-5 w-5" />
                <span>{action.name}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
