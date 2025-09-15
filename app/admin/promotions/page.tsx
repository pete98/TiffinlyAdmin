"use client";

import { useState, useEffect } from "react";
import { Plus, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PromotionToolbar } from "./_components/PromotionToolbar";
import { PromotionTable } from "./_components/PromotionTable";
import { PromotionForm } from "./_components/PromotionForm";
import { DeleteDialog } from "./_components/DeleteDialog";
import { Promotion, PromotionFilters } from "@/types/promotions";
import { api } from "@/lib/http";
import { toast } from "sonner";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<PromotionFilters>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [deletePromotion, setDeletePromotion] = useState<Promotion | null>(null);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.search) params.append("q", filters.search);
      if (filters.status?.length) params.append("status", filters.status.join(","));
      if (filters.category?.length) params.append("category", filters.category.join(","));
      if (filters.freeItemSubType?.length) params.append("freeItemSubType", filters.freeItemSubType.join(","));
      if (filters.dateRange) {
        params.append("start", filters.dateRange.start);
        params.append("end", filters.dateRange.end);
      }
      params.append("page", page.toString());
      params.append("pageSize", pageSize.toString());
      if (filters.sort) params.append("sort", filters.sort);

      const response = await api.get(`/promotions?${params.toString()}`);
      setPromotions(response.data.items);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      toast.error("Failed to fetch promotions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [filters, page, pageSize]);

  const handleCreate = () => {
    setEditingPromotion(null);
    setIsFormOpen(true);
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setIsFormOpen(true);
  };

  const handleDuplicate = async (promotion: Promotion) => {
    try {
      const duplicateData = {
        ...promotion,
        name: `${promotion.name} (Copy)`,
        code: promotion.code ? `${promotion.code}_COPY` : undefined,
        status: "draft" as const,
        maxRedemptions: undefined,
        perUserLimit: undefined,
      };
      
      await api.post("/promotions", duplicateData);
      toast.success("Promotion duplicated successfully");
      fetchPromotions();
    } catch (error) {
      console.error("Error duplicating promotion:", error);
      toast.error("Failed to duplicate promotion");
    }
  };

  const handleDelete = (promotion: Promotion) => {
    setDeletePromotion(promotion);
  };

  const handleConfirmDelete = async () => {
    if (!deletePromotion) return;

    try {
      await api.delete(`/promotions/${deletePromotion.id}`);
      toast.success("Promotion deleted successfully");
      setDeletePromotion(null);
      fetchPromotions();
    } catch (error) {
      console.error("Error deleting promotion:", error);
      toast.error("Failed to delete promotion");
    }
  };

  const handleStatusToggle = async (promotion: Promotion) => {
    try {
      const newStatus = promotion.status === "paused" ? "active" : "paused";
      await api.patch(`/promotions/${promotion.id}/status`, { status: newStatus });
      toast.success(`Promotion ${newStatus === "active" ? "activated" : "paused"} successfully`);
      fetchPromotions();
    } catch (error) {
      console.error("Error toggling promotion status:", error);
      toast.error("Failed to update promotion status");
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingPromotion) {
        await api.put(`/promotions/${editingPromotion.id}`, data);
        toast.success("Promotion updated successfully");
      } else {
        await api.post("/promotions", data);
        toast.success("Promotion created successfully");
      }
      setIsFormOpen(false);
      setEditingPromotion(null);
      fetchPromotions();
    } catch (error) {
      console.error("Error saving promotion:", error);
      toast.error("Failed to save promotion");
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Promotions</h1>
            <p className="text-muted-foreground">
              Manage promotional campaigns and referral programs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Promotions help you attract and retain customers</p>
              </TooltipContent>
            </Tooltip>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              New Promotion
            </Button>
          </div>
        </div>

        {/* Filters */}
        <PromotionToolbar
          filters={filters}
          onFiltersChange={setFilters}
          onExport={() => {
            // TODO: Implement export functionality
            toast.info("Export functionality coming soon");
          }}
        />

        {/* Table */}
        <PromotionTable
          promotions={promotions}
          loading={loading}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          onStatusToggle={handleStatusToggle}
        />

        {/* Form Dialog */}
        <PromotionForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          promotion={editingPromotion}
          onSubmit={handleFormSubmit}
        />

        {/* Delete Dialog */}
        <DeleteDialog
          open={!!deletePromotion}
          onOpenChange={() => setDeletePromotion(null)}
          promotion={deletePromotion}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </TooltipProvider>
  );
}
