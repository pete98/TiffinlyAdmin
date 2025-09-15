"use client";

import { useState } from "react";
import { Edit, Copy, Trash2, Play, Pause, MoreHorizontal, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "./StatusBadge";
import { Promotion } from "@/types/promotions";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PromotionTableProps {
  promotions: Promotion[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onEdit: (promotion: Promotion) => void;
  onDuplicate: (promotion: Promotion) => void;
  onDelete: (promotion: Promotion) => void;
  onStatusToggle: (promotion: Promotion) => void;
}

export function PromotionTable({
  promotions,
  loading,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDuplicate,
  onDelete,
  onStatusToggle,
}: PromotionTableProps) {
  const [sortBy, setSortBy] = useState<string>("-updatedAt");

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const getCategoryLabel = (category: string, freeItemSubType?: string) => {
    switch (category) {
      case "free_item":
        return `Free ${freeItemSubType || "Item"}`;
      case "percent_off":
        return "Percent Off";
      case "amount_off":
        return "Amount Off";
      case "referral":
        return "Referral";
      default:
        return category;
    }
  };

  const getValueDisplay = (promotion: Promotion) => {
    switch (promotion.category) {
      case "free_item":
        return promotion.freeItemSubType || "Item";
      case "percent_off":
        return `${promotion.percentOff}%`;
      case "amount_off":
        return formatCurrency(promotion.amountOffCents || 0);
      case "referral":
        if (promotion.referral?.rewardType === "percent_off") {
          return `${promotion.referral.rewardValue}%`;
        } else if (promotion.referral?.rewardType === "amount_off") {
          return formatCurrency(promotion.referral.rewardValue || 0);
        } else if (promotion.referral?.rewardType === "free_item") {
          return `Free ${promotion.referral.freeItemSubType}`;
        }
        return "Referral";
      default:
        return "-";
    }
  };

  const getScheduleDisplay = (promotion: Promotion) => {
    if (!promotion.startAt && !promotion.endAt) {
      return "No schedule";
    }
    
    const start = promotion.startAt ? format(new Date(promotion.startAt), "MMM d, yyyy") : "No start";
    const end = promotion.endAt ? format(new Date(promotion.endAt), "MMM d, yyyy") : "No end";
    
    return `${start} - ${end}`;
  };

  const getRedemptionsDisplay = (promotion: Promotion) => {
    const current = 0; // TODO: Get actual redemption count from backend
    const max = promotion.maxRedemptions || "∞";
    return `${current}/${max}`;
  };

  const totalPages = Math.ceil(total / pageSize);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code/Type</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Redemptions</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <MoreHorizontal className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No promotions found</h3>
        <p className="text-muted-foreground mb-4">
          Get started by creating your first promotion
        </p>
        <Button onClick={() => onEdit({} as Promotion)}>
          Create Promotion
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code/Type</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Redemptions</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.map((promotion) => (
              <TableRow key={promotion.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{promotion.name}</div>
                    {promotion.description && (
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {promotion.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {promotion.code && (
                      <Badge variant="outline" className="text-xs">
                        {promotion.code}
                      </Badge>
                    )}
                    <div className="text-sm">
                      {getCategoryLabel(promotion.category, promotion.freeItemSubType)}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                      {getValueDisplay(promotion)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {getScheduleDisplay(promotion)}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={promotion.status} />
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {getRedemptionsDisplay(promotion)}
                  </div>
                  {promotion.perUserLimit && (
                    <div className="text-xs text-muted-foreground">
                      {promotion.perUserLimit} per user
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {format(new Date(promotion.updatedAt), "MMM d, yyyy")}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(promotion)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDuplicate(promotion)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusToggle(promotion)}>
                        {promotion.status === "paused" ? (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        ) : (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </>
                        )}
                      </DropdownMenuItem>
                      {promotion.category === "referral" && (
                        <DropdownMenuItem
                          onClick={() => {
                            const link = `${window.location.origin}/r/${promotion.code || promotion.id}`;
                            navigator.clipboard.writeText(link);
                          }}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Copy Referral Link
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => onDelete(promotion)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} promotions
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
