import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/serverSession";
import { searchPromotions, createPromotion } from "@/lib/db/mockPromotions";
import { PromotionFiltersSchema } from "@/lib/validation/promotionSchemas";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const filters = {
      search: searchParams.get("q") || undefined,
      status: searchParams.get("status")?.split(",").filter(Boolean),
      category: searchParams.get("category")?.split(",").filter(Boolean),
      freeItemSubType: searchParams.get("freeItemSubType")?.split(",").filter(Boolean),
      dateRange: searchParams.get("start") && searchParams.get("end") ? {
        start: searchParams.get("start")!,
        end: searchParams.get("end")!,
      } : undefined,
      page: parseInt(searchParams.get("page") || "1"),
      pageSize: parseInt(searchParams.get("pageSize") || "10"),
      sort: searchParams.get("sort") || undefined,
    };

    // Validate filters
    const validatedFilters = PromotionFiltersSchema.parse(filters);

    // Search promotions
    const result = searchPromotions(validatedFilters);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return NextResponse.json(
      { error: "Failed to fetch promotions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Create promotion
    const newPromotion = createPromotion(body);

    return NextResponse.json(newPromotion, { status: 201 });
  } catch (error) {
    console.error("Error creating promotion:", error);
    return NextResponse.json(
      { error: "Failed to create promotion" },
      { status: 500 }
    );
  }
}
