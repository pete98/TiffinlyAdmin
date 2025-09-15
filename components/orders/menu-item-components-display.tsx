import { Badge } from "@/components/ui/badge"
import { MenuItemComponent } from "@/lib/types"

interface MenuItemComponentsDisplayProps {
  components: MenuItemComponent[]
  showQuantity?: boolean
  compact?: boolean
}

export function MenuItemComponentsDisplay({ 
  components, 
  showQuantity = true, 
  compact = false 
}: MenuItemComponentsDisplayProps) {
  if (!components || components.length === 0) {
    return null
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "main":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "secondary":
        return "bg-green-100 text-green-800 border-green-200"
      case "side":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "main":
        return "Main"
      case "secondary":
        return "Side"
      case "side":
        return "Dessert"
      default:
        return type
    }
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1">
        {components.map((comp, index) => (
          <span key={index} className="text-xs text-muted-foreground">
            {comp.itemName}
            {showQuantity && comp.quantity > 1 && ` (${comp.quantity})`}
            {index < components.length - 1 && ", "}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {components.map((comp, index) => (
        <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded-md">
          <Badge className={`${getTypeColor(comp.itemType)} border text-xs px-2 py-1`}>
            {getTypeLabel(comp.itemType)}
          </Badge>
          <span className="text-sm font-medium">{comp.itemName}</span>
          {showQuantity && comp.quantity > 1 && (
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              x{comp.quantity}
            </Badge>
          )}
        </div>
      ))}
    </div>
  )
}


