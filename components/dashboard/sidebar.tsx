"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, ChevronLeft, ChevronRight, Home, Package, ShoppingBag, Utensils, Users, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DashboardSidebar({ open, onOpenChange }: SidebarProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        onOpenChange(false)
      } else {
        onOpenChange(true)
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [onOpenChange])

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Kitchens", href: "/kitchens", icon: Building2 },
    { name: "Stores", href: "/stores", icon: ShoppingBag },
    { name: "Users", href: "/users", icon: Users },
    { name: "Menu Items", href: "/menu-items", icon: Utensils },
    { name: "Orders", href: "/orders", icon: Package },
    { name: "Products", href: "/products", icon: Package },
    { name: "Auth Demo", href: "/auth-demo", icon: Shield },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && open && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full flex-col bg-slate-900 text-white transition-all duration-300",
          open ? "w-64" : "w-[70px]",
          isMobile && !open && "w-0",
          isMobile && open && "w-64",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <div className={cn("flex items-center", !open && "justify-center w-full", isMobile && !open && "hidden")}>
            <span className={cn("text-xl font-bold", !open && "hidden")}>Tiffin Admin</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(!open)}
            className={cn("text-white hover:bg-slate-800", isMobile && !open && "hidden")}
          >
            {open ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white",
                  !open && "justify-center px-3",
                  isMobile && !open && "hidden",
                )}
              >
                <item.icon className={cn("h-5 w-5", open && "mr-3")} />
                {open && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}
