"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MenuItem } from "@/lib/types";
import Image from "next/image";

interface MenuItemCardProps {
  menuItem: MenuItem;
}

export function MenuItemCard({ menuItem }: MenuItemCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {/* Image */}
      <div className="w-full h-40 sm:h-48 relative overflow-hidden flex-shrink-0">
        <Image
          src={menuItem.imageUrl}
          alt={`${menuItem.mainItem} with ${menuItem.secondaryItem}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        {/* Weekday Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-white/90 text-gray-900">
            {menuItem.weekday}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 flex flex-col flex-grow">
        {/* Main Title */}
        <h3 className="font-semibold text-gray-900 mb-3 text-lg line-clamp-2 min-h-[3.5rem]">
          {menuItem.mainItem} with {menuItem.secondaryItem}
        </h3>

        {/* Items with Quantities */}
        <div className="space-y-1 flex-grow">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">{menuItem.mainItem}</span>
            <span className="font-medium text-gray-900">{menuItem.mainItemQuantity}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">{menuItem.secondaryItem}</span>
            <span className="font-medium text-gray-900">{menuItem.secondaryItemQuantity}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">{menuItem.sideItem}</span>
            <span className="font-medium text-gray-900">{menuItem.sideItemQuantity}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
