import { Badge } from "@/components/ui/badge";

// Active vs blocked customer indicator, using the shared neutral Badge tones.
export function CustomerStatusBadge({ active }: { active: boolean }) {
  return active ? <Badge tone="green">Active</Badge> : <Badge tone="red">Blocked</Badge>;
}
