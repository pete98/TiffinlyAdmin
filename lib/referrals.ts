import { Promotion } from "@/types/promotions";

export function generateReferralLink(promotion: Promotion): string {
  if (promotion.category !== "referral") {
    throw new Error("Promotion must be of type referral");
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tiffin-app.com";
  const code = promotion.code || promotion.id;
  
  return `${baseUrl}/r/${code}`;
}

export function copyReferralLink(promotion: Promotion): Promise<void> {
  const link = generateReferralLink(promotion);
  return navigator.clipboard.writeText(link);
}

export function parseReferralCode(url: string): string | null {
  const match = url.match(/\/r\/([^/?]+)/);
  return match ? match[1] : null;
}
