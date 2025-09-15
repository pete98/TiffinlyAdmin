export type PromotionCategory =
  | "free_item" // subType: drink | snack | sweet
  | "percent_off"
  | "amount_off"
  | "referral";

export type FreeItemSubType = "drink" | "snack" | "sweet";

export type PromotionStatus = "draft" | "scheduled" | "active" | "expired" | "paused";

export interface Promotion {
  id: string;
  name: string;
  code?: string; // optional coupon code if applicable
  description?: string;
  category: PromotionCategory;
  freeItemSubType?: FreeItemSubType; // required when category === "free_item"
  percentOff?: number; // 1-100 when category === "percent_off"
  amountOffCents?: number; // >= 0 when category === "amount_off"
  referral?: {
    rewardType: "percent_off" | "amount_off" | "free_item";
    rewardValue?: number; // percent or amount cents; required for percent/amount
    freeItemSubType?: FreeItemSubType;
    maxPerReferrer?: number; // usage cap per referrer
    autoApprove?: boolean; // whether to auto-apply reward after referral
  };
  startAt?: string; // ISO
  endAt?: string; // ISO
  maxRedemptions?: number; // global cap
  perUserLimit?: number; // per-user cap
  status: PromotionStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface PromotionFilters {
  search?: string;
  status?: PromotionStatus[];
  category?: PromotionCategory[];
  freeItemSubType?: FreeItemSubType[];
  dateRange?: {
    start: string;
    end: string;
  };
  page?: number;
  pageSize?: number;
  sort?: string;
}

export interface PromotionListResponse {
  items: Promotion[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
