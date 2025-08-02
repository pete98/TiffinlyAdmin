"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

interface MenuItem {
  mainItem: string
  mainItemQuantity: number
  secondaryItem: string
  secondaryItemQuantity: number
  sideItem: string
  sideItemQuantity: number
  price: number
  imageUrl: string
  description?: string
}

interface MenuTableProps {
  weekdays: string[]
  weekDates: Date[]
  menu: MenuItem[]
  editIndex: number | null
  editForm: Partial<MenuItem>
  onEdit: (idx: number) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSave: () => void
  onCancel: () => void
}

export function MenuTable({
  weekdays,
  weekDates,
  menu,
  editIndex,
  editForm,
  onEdit,
  onChange,
  onSave,
  onCancel,
}: MenuTableProps) {
  return (
    <div className="space-y-4">
      {weekdays.map((day, idx) => (
        <div key={day} className="border rounded-lg p-4 flex flex-col gap-2 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">
              {day} ({weekDates[idx].toLocaleDateString()})
            </div>
            {editIndex === idx ? null : (
              <Button size="sm" onClick={() => onEdit(idx)}>
                Edit
              </Button>
            )}
          </div>
          <Separator className="my-2" />
          {editIndex === idx ? (
            <div className="grid grid-cols-2 gap-2">
              <Input
                name="mainItem"
                value={editForm.mainItem || ""}
                onChange={onChange}
                placeholder="Main Item"
              />
              <Input
                name="mainItemQuantity"
                type="number"
                value={editForm.mainItemQuantity ?? ""}
                onChange={onChange}
                placeholder="Main Item Qty"
              />
              <Input
                name="secondaryItem"
                value={editForm.secondaryItem || ""}
                onChange={onChange}
                placeholder="Secondary Item"
              />
              <Input
                name="sideItem"
                value={editForm.sideItem || ""}
                onChange={onChange}
                placeholder="Side Item"
              />
              <Input
                name="price"
                type="number"
                value={editForm.price ?? ""}
                onChange={onChange}
                placeholder="Price"
              />
              <textarea
                name="description"
                value={editForm.description || ""}
                onChange={onChange}
                placeholder="Description"
                className="col-span-2 border rounded px-3 py-2 min-h-[48px] resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="col-span-2 flex gap-2 mt-2">
                <Button size="sm" onClick={onSave}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2 flex items-center gap-4 mb-2">
                {menu[idx].imageUrl && (
                  <img 
                    src={menu[idx].imageUrl} 
                    alt={menu[idx].mainItem || "Menu item"} 
                    className="w-16 h-16 object-cover rounded-md"
                  />
                )}
                <div className="flex-1">
                  <div className="font-medium text-lg">{menu[idx].mainItem || "-"}</div>
                  <div className="text-sm text-gray-600">${menu[idx].price || 0}</div>
                </div>
              </div>
              <div>
                <span className="font-medium">Main Item Quantity:</span> {menu[idx].mainItemQuantity || 0}
              </div>
              <div>
                <span className="font-medium">Secondary Item:</span> {menu[idx].secondaryItem || "-"}
              </div>
              <div>
                <span className="font-medium">Side Item:</span> {menu[idx].sideItem || "-"}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Description:</span> {menu[idx].description || "-"}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
} 