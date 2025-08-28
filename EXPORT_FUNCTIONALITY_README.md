# Order Export Functionality

This document describes the export functionality available for orders in the Tiffin Admin dashboard.

## Overview

The orders page now includes comprehensive export capabilities that allow administrators to download order data in multiple formats for analysis, reporting, and record-keeping purposes.

## Export Options

### 1. Export CSV
- **Format**: Standard CSV file with order summary information
- **Content**: Basic order details including customer info, store info, dates, status, payment info, and totals
- **Use Case**: Quick data export for basic analysis or import into other systems

### 2. Detailed CSV
- **Format**: Comprehensive CSV with detailed order breakdown
- **Content**: Complete order information including individual order items with quantities, prices, and component details
- **Use Case**: Detailed analysis, inventory tracking, and comprehensive reporting

### 3. Export Excel
- **Format**: Multi-sheet Excel workbook (.xlsx)
- **Content**: 
  - **Orders Sheet**: Summary of all orders
  - **Order Items Sheet**: Detailed breakdown of all items across all orders
- **Use Case**: Advanced analysis, pivot tables, and professional reporting

## Features

### Smart Filenaming
Export files are automatically named based on current filters:
- `orders_2024-01-15_to_2024-01-31.xlsx` (for date range filters)
- `orders_pending.csv` (for status filters)
- `orders_search_john.xlsx` (for search filters)

### Filter-Aware Export
- Exports respect all current filters (search, status, payment status, date range)
- Only exports visible/filtered orders
- Maintains data consistency with what's displayed on screen

### Loading States
- Export buttons show "Exporting..." during processing
- Buttons are disabled during export to prevent multiple simultaneous exports
- Toast notifications confirm successful exports or report errors

## Technical Implementation

### Dependencies
- **SheetJS (xlsx)**: For Excel export functionality
- **Native Browser APIs**: For CSV export (no additional dependencies)

### Export Functions
Located in `lib/utils.ts`:
- `exportOrdersToCSV()`: Basic CSV export
- `exportDetailedOrdersToCSV()`: Detailed CSV export
- `exportOrdersToExcel()`: Excel export with multiple sheets

### Data Structure
Exported data includes:
- **Order Information**: ID, customer details, delivery info, dates, status
- **Financial Data**: Total amount, charged amount, payment status
- **Item Details**: Product names, quantities, prices, component types
- **Metadata**: Creation/update timestamps, notes, subscription status

## Usage Instructions

1. Navigate to the Orders page (`/orders`)
2. Apply any desired filters (search, status, date range, etc.)
3. Click the appropriate export button:
   - **Export CSV**: For basic order summary
   - **Detailed CSV**: For comprehensive order breakdown
   - **Export Excel**: For multi-sheet Excel workbook
4. Wait for the export to complete
5. File will automatically download with appropriate filename

## File Formats

### CSV Format
- Comma-separated values
- UTF-8 encoding
- Properly escaped text fields
- Headers in first row

### Excel Format
- XLSX format (modern Excel)
- Auto-sized columns
- Multiple worksheets
- Compatible with Excel, Google Sheets, and other spreadsheet applications

## Error Handling

- Graceful fallback from Excel to CSV if SheetJS fails to load
- Toast notifications for success/failure states
- Console logging for debugging
- Validation of order data before export

## Performance Considerations

- Export processing is done client-side for immediate response
- Large datasets (>1000 orders) may take a few seconds to process
- Memory usage scales with order count and item complexity
- Export buttons are disabled during processing to prevent conflicts

## Future Enhancements

Potential improvements for future versions:
- Export to PDF format
- Scheduled/automated exports
- Email delivery of export files
- Custom field selection for export
- Export templates for different use cases
- Integration with external reporting systems 