"use client"

import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, UtensilsCrossed } from "lucide-react"

interface NutritionComponent {
  name: string
  calories: number
}

interface NutritionFacts {
  servingSize: string
  components: NutritionComponent[]
  totalCalories: number
}

interface NutritionFactsDisplayProps {
  nutritionFacts?: NutritionFacts
  variant?: "compact" | "detailed"
  className?: string
}

export function NutritionFactsDisplay({ 
  nutritionFacts, 
  variant = "compact",
  className = "" 
}: NutritionFactsDisplayProps) {
  if (!nutritionFacts) {
    return (
      <div className={`text-gray-400 text-xs ${className}`}>
        No nutrition data
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <div className={`text-xs ${className}`}>
        <div className="font-medium text-gray-900">
          {nutritionFacts.totalCalories} cal
        </div>
        <div className="text-gray-600">
          {nutritionFacts.components?.length || 0} components
        </div>
        <div className="text-gray-500 truncate max-w-24">
          {nutritionFacts.servingSize}
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <Collapsible>
        <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
          <UtensilsCrossed className="h-4 w-4" />
          <span>Nutrition Facts</span>
          <ChevronDown className="h-3 w-3 transition-transform duration-200" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          <div className="text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Serving Size:</span>
              <span className="font-medium">{nutritionFacts.servingSize}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Calories:</span>
              <Badge variant="secondary" className="text-xs">
                {nutritionFacts.totalCalories} cal
              </Badge>
            </div>
          </div>
          
          {nutritionFacts.components && nutritionFacts.components.length > 0 && (
            <div className="border-t pt-2">
              <div className="text-xs font-medium text-gray-700 mb-1">Components:</div>
              <div className="space-y-1">
                {nutritionFacts.components.map((component, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="text-gray-600">{component.name}</span>
                    <span className="font-medium">{component.calories} cal</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
} 