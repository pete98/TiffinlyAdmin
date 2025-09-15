import { z } from "zod";
import { PromotionCategory, FreeItemSubType, PromotionStatus } from "@/types/promotions";

const freeItemSubTypeSchema = z.enum(["drink", "snack", "sweet"]);

const referralSchema = z.object({
  rewardType: z.enum(["percent_off", "amount_off", "free_item"]),
  rewardValue: z.number().min(0).optional(),
  freeItemSubType: freeItemSubTypeSchema.optional(),
  maxPerReferrer: z.number().min(1).optional(),
  autoApprove: z.boolean().optional(),
}).refine((data) => {
  if (data.rewardType === "percent_off" || data.rewardType === "amount_off") {
    return data.rewardValue !== undefined && data.rewardValue > 0;
  }
  if (data.rewardType === "free_item") {
    return data.freeItemSubType !== undefined;
  }
  return true;
}, {
  message: "Invalid referral configuration",
});

export const PromotionFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  code: z.string().max(20, "Code too long").optional(),
  description: z.string().max(500, "Description too long").optional(),
  category: z.enum(["free_item", "percent_off", "amount_off", "referral"]),
  freeItemSubType: freeItemSubTypeSchema.optional(),
  percentOff: z.number().min(1).max(100).optional(),
  amountOffCents: z.number().min(0).optional(),
  referral: referralSchema.optional(),
  startAt: z.string().optional(),
  endAt: z.string().optional(),
  maxRedemptions: z.number().min(1).optional(),
  perUserLimit: z.number().min(1).optional(),
  status: z.enum(["draft", "scheduled", "active", "expired", "paused"]).optional(),
}).refine((data) => {
  // Validate category-specific fields
  if (data.category === "free_item") {
    return data.freeItemSubType !== undefined;
  }
  if (data.category === "percent_off") {
    return data.percentOff !== undefined && data.percentOff > 0;
  }
  if (data.category === "amount_off") {
    return data.amountOffCents !== undefined && data.amountOffCents > 0;
  }
  if (data.category === "referral") {
    return data.referral !== undefined;
  }
  return true;
}, {
  message: "Invalid category configuration",
}).refine((data) => {
  // Validate date range
  if (data.startAt && data.endAt) {
    return new Date(data.startAt) < new Date(data.endAt);
  }
  return true;
}, {
  message: "Start date must be before end date",
});

export const PromotionUpsertSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  code: z.string().max(20, "Code too long").optional(),
  description: z.string().max(500, "Description too long").optional(),
  category: z.enum(["free_item", "percent_off", "amount_off", "referral"]),
  freeItemSubType: freeItemSubTypeSchema.optional(),
  percentOff: z.number().min(1).max(100).optional(),
  amountOffCents: z.number().min(0).optional(),
  referral: referralSchema.optional(),
  startAt: z.string().optional(),
  endAt: z.string().optional(),
  maxRedemptions: z.number().min(1).optional(),
  perUserLimit: z.number().min(1).optional(),
  status: z.enum(["draft", "scheduled", "active", "expired", "paused"]).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}).refine((data) => {
  // Validate category-specific fields
  if (data.category === "free_item") {
    return data.freeItemSubType !== undefined;
  }
  if (data.category === "percent_off") {
    return data.percentOff !== undefined && data.percentOff > 0;
  }
  if (data.category === "amount_off") {
    return data.amountOffCents !== undefined && data.amountOffCents > 0;
  }
  if (data.category === "referral") {
    return data.referral !== undefined;
  }
  return true;
}, {
  message: "Invalid category configuration",
}).refine((data) => {
  // Validate date range
  if (data.startAt && data.endAt) {
    return new Date(data.startAt) < new Date(data.endAt);
  }
  return true;
}, {
  message: "Start date must be before end date",
});

export const PromotionStatusUpdateSchema = z.object({
  status: z.enum(["draft", "scheduled", "active", "expired", "paused"]),
});

export const PromotionFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.array(z.enum(["draft", "scheduled", "active", "expired", "paused"])).optional(),
  category: z.array(z.enum(["free_item", "percent_off", "amount_off", "referral"])).optional(),
  freeItemSubType: z.array(freeItemSubTypeSchema).optional(),
  dateRange: z.object({
    start: z.string(),
    end: z.string(),
  }).optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
  sort: z.string().optional(),
});

export type PromotionFormValues = z.infer<typeof PromotionFormSchema>;
export type PromotionUpsertValues = z.infer<typeof PromotionUpsertSchema>;
export type PromotionStatusUpdateValues = z.infer<typeof PromotionStatusUpdateSchema>;
export type PromotionFiltersValues = z.infer<typeof PromotionFiltersSchema>;
