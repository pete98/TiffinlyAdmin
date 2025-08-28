import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export { apiFetch, clearTokenCache } from "./api"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Export orders to CSV format
 * @param orders - Array of orders to export
 * @param filename - Name of the exported file (without extension)
 */
export function exportOrdersToCSV(orders: any[], filename: string = "orders") {
  if (!orders || orders.length === 0) {
    console.warn("No orders to export")
    return
  }

  // Define CSV headers for main orders
  const headers = [
    "Order ID",
    "Customer Name",
    "Customer Phone",
    "Customer Email",
    "Delivery Address",
    "Store Name",
    "Order Date",
    "Delivery Date",
    "Status",
    "Payment Status",
    "Payment Method",
    "Subscription Status",
    "Total Amount",
    "Charged Amount",
    "Items Count",
    "Notes",
    "Created At",
    "Updated At"
  ]

  // Convert orders to CSV rows
  const csvRows = [headers.join(",")]

  orders.forEach(order => {
    const row = [
      order.id,
      `"${(order.customerName || "").replace(/"/g, '""')}"`,
      order.customerPhone || "",
      order.customerEmail || "",
      `"${(order.deliveryAddress || "").replace(/"/g, '""')}"`,
      `"${(order.storeName || "").replace(/"/g, '""')}"`,
      order.orderDate || "",
      order.deliveryDate || "",
      order.status || "",
      order.paymentStatus || "",
      order.paymentMethod || "",
      order.subscriptionStatus || "",
      order.totalAmount || 0,
      order.chargedAmount || 0,
      order.items?.length || 0,
      `"${(order.notes || "").replace(/"/g, '""')}"`,
      order.createdAt || "",
      order.updatedAt || ""
    ]
    csvRows.push(row.join(","))
  })

  // Create CSV content
  const csvContent = csvRows.join("\n")

  // Create and download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

/**
 * Export orders to Excel format (XLSX) using SheetJS
 * @param orders - Array of orders to export
 * @param filename - Name of the exported file (without extension)
 */
export async function exportOrdersToExcel(orders: any[], filename: string = "orders") {
  try {
    // Dynamic import to avoid bundling issues
    const XLSX = await import('xlsx')
    
    if (!orders || orders.length === 0) {
      console.warn("No orders to export")
      return
    }

    // Prepare data for Excel - Main orders sheet
    const ordersData = orders.map(order => ({
      "Order ID": order.id,
      "Customer Name": order.customerName || "",
      "Customer Phone": order.customerPhone || "",
      "Customer Email": order.customerEmail || "",
      "Delivery Address": order.deliveryAddress || "",
      "Store Name": order.storeName || "",
      "Order Date": order.orderDate || "",
      "Delivery Date": order.deliveryDate || "",
      "Status": order.status || "",
      "Payment Status": order.paymentStatus || "",
      "Payment Method": order.paymentMethod || "",
      "Subscription Status": order.subscriptionStatus || "",
      "Total Amount": order.totalAmount || 0,
      "Charged Amount": order.chargedAmount || 0,
      "Items Count": order.items?.length || 0,
      "Notes": order.notes || "",
      "Created At": order.createdAt || "",
      "Updated At": order.updatedAt || ""
    }))

    // Prepare data for Excel - Order items sheet
    const itemsData: any[] = []
    orders.forEach(order => {
      if (order.items && order.items.length > 0) {
        order.items.forEach((item: any) => {
          itemsData.push({
            "Order ID": order.id,
            "Customer Name": order.customerName || "",
            "Item ID": item.id,
            "Product Name": item.productName || item.menuItemName || "",
            "Product Type": item.productType || "",
            "Component Type": item.componentType || "",
            "Quantity": item.quantity || 0,
            "Unit Price": item.unitPrice || 0,
            "Total Price": item.totalPrice || item.subtotal || 0,
            "Charged Amount": item.chargedAmount || 0,
            "Pro Included": item.isProIncluded ? "Yes" : "No",
            "Order Date": order.orderDate || "",
            "Order Status": order.status || ""
          })
        })
      }
    })

    // Create workbook
    const workbook = XLSX.utils.book_new()

    // Create orders worksheet
    const ordersWorksheet = XLSX.utils.json_to_sheet(ordersData)
    const ordersColumnWidths = Object.keys(ordersData[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }))
    ordersWorksheet['!cols'] = ordersColumnWidths

    // Create items worksheet
    const itemsWorksheet = XLSX.utils.json_to_sheet(itemsData)
    const itemsColumnWidths = Object.keys(itemsData[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }))
    itemsWorksheet['!cols'] = itemsColumnWidths

    // Add worksheets to workbook
    XLSX.utils.book_append_sheet(workbook, ordersWorksheet, "Orders")
    if (itemsData.length > 0) {
      XLSX.utils.book_append_sheet(workbook, itemsWorksheet, "Order Items")
    }

    // Generate filename with date
    const dateStr = new Date().toISOString().split('T')[0]
    const fullFilename = `${filename}_${dateStr}.xlsx`

    // Download file
    XLSX.writeFile(workbook, fullFilename)
  } catch (error) {
    console.error("Error exporting to Excel:", error)
    // Fallback to CSV if Excel export fails
    exportOrdersToCSV(orders, filename)
  }
}

/**
 * Export detailed orders with items to CSV
 * @param orders - Array of orders to export
 * @param filename - Name of the exported file (without extension)
 */
export function exportDetailedOrdersToCSV(orders: any[], filename: string = "detailed_orders") {
  if (!orders || orders.length === 0) {
    console.warn("No orders to export")
    return
  }

  // Create detailed CSV with order items
  const csvRows: string[] = []
  
  orders.forEach(order => {
    // Add order header
    csvRows.push(`Order #${order.id} - ${order.customerName}`)
    csvRows.push(`Customer: ${order.customerName}, Phone: ${order.customerPhone}, Email: ${order.customerEmail}`)
    csvRows.push(`Address: ${order.deliveryAddress}`)
    csvRows.push(`Store: ${order.storeName}`)
    csvRows.push(`Order Date: ${order.orderDate}, Delivery Date: ${order.deliveryDate}`)
    csvRows.push(`Status: ${order.status}, Payment: ${order.paymentStatus} (${order.paymentMethod})`)
    csvRows.push(`Total: $${order.totalAmount}, Charged: $${order.chargedAmount}`)
    csvRows.push(`Subscription: ${order.subscriptionStatus}`)
    if (order.notes) {
      csvRows.push(`Notes: ${order.notes}`)
    }
    
    // Add items
    if (order.items && order.items.length > 0) {
      csvRows.push("Items:")
      csvRows.push("Name,Type,Component,Quantity,Unit Price,Total Price,Charged,Pro Included")
      order.items.forEach((item: any) => {
        csvRows.push(`"${item.productName || item.menuItemName || ""}","${item.productType || ""}","${item.componentType || ""}",${item.quantity},${item.unitPrice},${item.totalPrice || item.subtotal},${item.chargedAmount},${item.isProIncluded ? "Yes" : "No"}`)
      })
    }
    
    csvRows.push("") // Empty line between orders
  })

  // Create CSV content
  const csvContent = csvRows.join("\n")

  // Create and download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
