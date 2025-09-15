import { Promotion, PromotionStatus } from "@/types/promotions";

// In-memory store for development
let promotions: Promotion[] = [
  {
    id: "1",
    name: "Free Drink Friday",
    code: "FREEDRINK",
    description: "Get a free drink with any meal on Fridays",
    category: "free_item",
    freeItemSubType: "drink",
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    maxRedemptions: 1000,
    perUserLimit: 1,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Snack On Us",
    code: "SNACK10",
    description: "Free snack with orders over $20",
    category: "free_item",
    freeItemSubType: "snack",
    startAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
    endAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
    maxRedemptions: 500,
    perUserLimit: 2,
    status: "scheduled",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Sweet Treat",
    code: "SWEET5",
    description: "Free dessert with dinner orders",
    category: "free_item",
    freeItemSubType: "sweet",
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "10% Off Lunch Plan",
    code: "LUNCH10",
    description: "10% discount on all lunch plans",
    category: "percent_off",
    percentOff: 10,
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
    maxRedemptions: 500,
    perUserLimit: 3,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Referral: Get $5 Off",
    code: "REFER5",
    description: "Refer friends and get $5 off your next order",
    category: "referral",
    referral: {
      rewardType: "amount_off",
      rewardValue: 500, // $5.00 in cents
      maxPerReferrer: 10,
      autoApprove: true,
    },
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
    maxRedemptions: 1000,
    perUserLimit: 5,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function computeStatus(promotion: Promotion): PromotionStatus {
  if (promotion.status === "paused" || promotion.status === "draft") {
    return promotion.status;
  }

  const now = new Date();
  const startAt = promotion.startAt ? new Date(promotion.startAt) : null;
  const endAt = promotion.endAt ? new Date(promotion.endAt) : null;

  if (startAt && now < startAt) {
    return "scheduled";
  }

  if (endAt && now > endAt) {
    return "expired";
  }

  return "active";
}

export function getAllPromotions(): Promotion[] {
  return promotions.map(p => ({
    ...p,
    status: computeStatus(p),
  }));
}

export function getPromotionById(id: string): Promotion | null {
  const promotion = promotions.find(p => p.id === id);
  if (!promotion) return null;
  
  return {
    ...promotion,
    status: computeStatus(promotion),
  };
}

export function createPromotion(promotionData: Omit<Promotion, "id" | "createdAt" | "updatedAt">): Promotion {
  const id = (promotions.length + 1).toString();
  const now = new Date().toISOString();
  
  const newPromotion: Promotion = {
    ...promotionData,
    id,
    createdAt: now,
    updatedAt: now,
    status: computeStatus({
      ...promotionData,
      id,
      createdAt: now,
      updatedAt: now,
    }),
  };
  
  promotions.push(newPromotion);
  return newPromotion;
}

export function updatePromotion(id: string, promotionData: Partial<Promotion>): Promotion | null {
  const index = promotions.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  const updatedPromotion = {
    ...promotions[index],
    ...promotionData,
    id, // Ensure ID doesn't change
    updatedAt: new Date().toISOString(),
  };
  
  // Recompute status
  updatedPromotion.status = computeStatus(updatedPromotion);
  
  promotions[index] = updatedPromotion;
  return updatedPromotion;
}

export function deletePromotion(id: string): boolean {
  const index = promotions.findIndex(p => p.id === id);
  if (index === -1) return false;
  
  promotions.splice(index, 1);
  return true;
}

export function searchPromotions(filters: {
  search?: string;
  status?: string[];
  category?: string[];
  freeItemSubType?: string[];
  dateRange?: { start: string; end: string };
  page?: number;
  pageSize?: number;
  sort?: string;
}): { items: Promotion[]; total: number; page: number; pageSize: number; totalPages: number } {
  let filtered = [...promotions];

  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      (p.code && p.code.toLowerCase().includes(searchLower)) ||
      (p.description && p.description.toLowerCase().includes(searchLower))
    );
  }

  // Apply status filter
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter(p => {
      const computedStatus = computeStatus(p);
      return filters.status!.includes(computedStatus);
    });
  }

  // Apply category filter
  if (filters.category && filters.category.length > 0) {
    filtered = filtered.filter(p => filters.category!.includes(p.category));
  }

  // Apply free item sub-type filter
  if (filters.freeItemSubType && filters.freeItemSubType.length > 0) {
    filtered = filtered.filter(p => 
      p.freeItemSubType && filters.freeItemSubType!.includes(p.freeItemSubType)
    );
  }

  // Apply date range filter
  if (filters.dateRange) {
    const startDate = new Date(filters.dateRange.start);
    const endDate = new Date(filters.dateRange.end);
    
    filtered = filtered.filter(p => {
      const pStart = p.startAt ? new Date(p.startAt) : null;
      const pEnd = p.endAt ? new Date(p.endAt) : null;
      
      // Check if promotion overlaps with the date range
      if (pStart && pEnd) {
        return (pStart <= endDate && pEnd >= startDate);
      }
      return true;
    });
  }

  // Apply sorting
  if (filters.sort) {
    const [field, direction] = filters.sort.startsWith("-") 
      ? [filters.sort.slice(1), "desc"] 
      : [filters.sort, "asc"];
    
    filtered.sort((a, b) => {
      let aValue: any = a[field as keyof Promotion];
      let bValue: any = b[field as keyof Promotion];
      
      if (field === "createdAt" || field === "updatedAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (direction === "desc") {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });
  }

  // Apply pagination
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  const items = filtered.slice(startIndex, endIndex).map(p => ({
    ...p,
    status: computeStatus(p),
  }));

  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
  };
}
