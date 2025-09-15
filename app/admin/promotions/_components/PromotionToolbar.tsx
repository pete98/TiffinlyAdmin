"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { PromotionFilters, PromotionCategory, PromotionStatus, FreeItemSubType } from "@/types/promotions";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PromotionToolbarProps {
  filters: PromotionFilters;
  onFiltersChange: (filters: PromotionFilters) => void;
  onExport: () => void;
}

const statusOptions: { value: PromotionStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
  { value: "paused", label: "Paused" },
];

const categoryOptions: { value: PromotionCategory; label: string }[] = [
  { value: "free_item", label: "Free Item" },
  { value: "percent_off", label: "Percent Off" },
  { value: "amount_off", label: "Amount Off" },
  { value: "referral", label: "Referral" },
];

const freeItemSubTypeOptions: { value: FreeItemSubType; label: string }[] = [
  { value: "drink", label: "Drink" },
  { value: "snack", label: "Snack" },
  { value: "sweet", label: "Sweet" },
];

export function PromotionToolbar({ filters, onFiltersChange, onExport }: PromotionToolbarProps) {
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: filters.dateRange?.start ? new Date(filters.dateRange.start) : undefined,
    to: filters.dateRange?.end ? new Date(filters.dateRange.end) : undefined,
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchValue || undefined });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleStatusChange = (status: PromotionStatus, checked: boolean) => {
    const currentStatuses = filters.status || [];
    const newStatuses = checked
      ? [...currentStatuses, status]
      : currentStatuses.filter(s => s !== status);
    
    onFiltersChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const handleCategoryChange = (category: PromotionCategory, checked: boolean) => {
    const currentCategories = filters.category || [];
    const newCategories = checked
      ? [...currentCategories, category]
      : currentCategories.filter(c => c !== category);
    
    onFiltersChange({
      ...filters,
      category: newCategories.length > 0 ? newCategories : undefined,
    });
  };

  const handleFreeItemSubTypeChange = (subType: FreeItemSubType, checked: boolean) => {
    const currentSubTypes = filters.freeItemSubType || [];
    const newSubTypes = checked
      ? [...currentSubTypes, subType]
      : currentSubTypes.filter(s => s !== subType);
    
    onFiltersChange({
      ...filters,
      freeItemSubType: newSubTypes.length > 0 ? newSubTypes : undefined,
    });
  };

  const handleDateRangeChange = (from?: Date, to?: Date) => {
    setDateRange({ from, to });
    onFiltersChange({
      ...filters,
      dateRange: from && to ? {
        start: from.toISOString(),
        end: to.toISOString(),
      } : undefined,
    });
  };

  const clearFilters = () => {
    setSearchValue("");
    setDateRange({});
    onFiltersChange({});
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.status?.length ||
    filters.category?.length ||
    filters.freeItemSubType?.length ||
    filters.dateRange
  );

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search promotions..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {[
                    filters.status?.length || 0,
                    filters.category?.length || 0,
                    filters.freeItemSubType?.length || 0,
                    filters.dateRange ? 1 : 0,
                  ].reduce((a, b) => a + b, 0)}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filters</h4>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 px-2"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={filters.status?.includes(option.value) || false}
                        onChange={(e) => handleStatusChange(option.value, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Category</Label>
                <div className="grid grid-cols-2 gap-2">
                  {categoryOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={filters.category?.includes(option.value) || false}
                        onChange={(e) => handleCategoryChange(option.value, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Free Item Sub-Type Filter */}
              {filters.category?.includes("free_item") && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Free Item Type</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {freeItemSubTypeOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={filters.freeItemSubType?.includes(option.value) || false}
                          onChange={(e) => handleFreeItemSubTypeChange(option.value, e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Date Range Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Date Range</Label>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">From</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !dateRange.from && "text-muted-foreground"
                            )}
                          >
                            {dateRange.from ? format(dateRange.from, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateRange.from}
                            onSelect={(date) => handleDateRangeChange(date, dateRange.to)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">To</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !dateRange.to && "text-muted-foreground"
                            )}
                          >
                            {dateRange.to ? format(dateRange.to, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateRange.to}
                            onSelect={(date) => handleDateRangeChange(dateRange.from, date)}
                            disabled={(date) => dateRange.from ? date < dateRange.from : false}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button variant="outline" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.search}
              <button
                onClick={() => {
                  setSearchValue("");
                  onFiltersChange({ ...filters, search: undefined });
                }}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.status?.map((status) => (
            <Badge key={status} variant="secondary" className="gap-1">
              {statusOptions.find(s => s.value === status)?.label}
              <button
                onClick={() => handleStatusChange(status, false)}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.category?.map((category) => (
            <Badge key={category} variant="secondary" className="gap-1">
              {categoryOptions.find(c => c.value === category)?.label}
              <button
                onClick={() => handleCategoryChange(category, false)}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.freeItemSubType?.map((subType) => (
            <Badge key={subType} variant="secondary" className="gap-1">
              {freeItemSubTypeOptions.find(s => s.value === subType)?.label}
              <button
                onClick={() => handleFreeItemSubTypeChange(subType, false)}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.dateRange && (
            <Badge variant="secondary" className="gap-1">
              {format(new Date(filters.dateRange.start), "MMM d")} - {format(new Date(filters.dateRange.end), "MMM d")}
              <button
                onClick={() => {
                  setDateRange({});
                  onFiltersChange({ ...filters, dateRange: undefined });
                }}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
