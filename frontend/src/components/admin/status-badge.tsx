import { Badge, type BadgeTone } from "@/components/ui/badge";
import type { CategoryStatus, InquiryStatus, ProductStatus } from "@/lib/admin-types";

const productTone: Record<ProductStatus, BadgeTone> = {
  draft: "neutral",
  published: "green",
  archived: "amber",
};
const categoryTone: Record<CategoryStatus, BadgeTone> = {
  active: "green",
  inactive: "neutral",
};
const inquiryTone: Record<InquiryStatus, BadgeTone> = {
  new: "blue",
  contacted: "amber",
  closed: "neutral",
};

function label(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return <Badge tone={productTone[status]}>{label(status)}</Badge>;
}
export function CategoryStatusBadge({ status }: { status: CategoryStatus }) {
  return <Badge tone={categoryTone[status]}>{label(status)}</Badge>;
}
export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  return <Badge tone={inquiryTone[status]}>{label(status)}</Badge>;
}
