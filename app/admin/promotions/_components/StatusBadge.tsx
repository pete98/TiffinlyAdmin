import { Badge } from "@/components/ui/badge";
import { PromotionStatus } from "@/types/promotions";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: PromotionStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: PromotionStatus) => {
    switch (status) {
      case "draft":
        return {
          label: "Draft",
          variant: "secondary" as const,
          className: "bg-gray-100 text-gray-800",
        };
      case "scheduled":
        return {
          label: "Scheduled",
          variant: "outline" as const,
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "active":
        return {
          label: "Active",
          variant: "default" as const,
          className: "bg-green-100 text-green-800",
        };
      case "expired":
        return {
          label: "Expired",
          variant: "destructive" as const,
          className: "bg-red-100 text-red-800",
        };
      case "paused":
        return {
          label: "Paused",
          variant: "secondary" as const,
          className: "bg-yellow-100 text-yellow-800",
        };
      default:
        return {
          label: status,
          variant: "secondary" as const,
          className: "",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant={config.variant}
      className={cn("text-xs font-medium", config.className)}
    >
      {config.label}
    </Badge>
  );
}
