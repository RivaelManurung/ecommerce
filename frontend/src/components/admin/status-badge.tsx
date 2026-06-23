import { Badge } from "@/components/ui/badge";
import type { InquiryStatus, ProductStatus, CategoryStatus } from "@/lib/admin-types";
import { cn } from "@/lib/utils/cn";

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <Badge
      className={cn(
        status === "published" && "bg-green-50 text-green-700 border-green-200",
        status === "draft" && "bg-gray-100 text-gray-600 border-gray-200",
        status === "archived" && "bg-red-50 text-red-600 border-red-200",
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export function CategoryStatusBadge({ status }: { status: CategoryStatus }) {
  return (
    <Badge
      className={cn(
        status === "active" && "bg-green-50 text-green-700 border-green-200",
        status === "inactive" && "bg-gray-100 text-gray-500 border-gray-200",
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  return (
    <Badge
      className={cn(
        status === "new" && "bg-blue-50 text-blue-700 border-blue-200",
        status === "contacted" && "bg-amber-50 text-amber-700 border-amber-200",
        status === "closed" && "bg-gray-100 text-gray-600 border-gray-200",
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
