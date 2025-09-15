import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/serverSession";
import { getPromotionById, updatePromotion } from "@/lib/db/mockPromotions";
import { PromotionStatusUpdateSchema } from "@/lib/validation/promotionSchemas";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate status update
    const validatedData = PromotionStatusUpdateSchema.parse(body);

    // Check if promotion exists
    const existingPromotion = getPromotionById(params.id);
    if (!existingPromotion) {
      return NextResponse.json({ error: "Promotion not found" }, { status: 404 });
    }

    // Update promotion status
    const updatedPromotion = updatePromotion(params.id, { status: validatedData.status });
    if (!updatedPromotion) {
      return NextResponse.json({ error: "Failed to update promotion" }, { status: 500 });
    }

    return NextResponse.json(updatedPromotion);
  } catch (error) {
    console.error("Error updating promotion status:", error);
    return NextResponse.json(
      { error: "Failed to update promotion status" },
      { status: 500 }
    );
  }
}
