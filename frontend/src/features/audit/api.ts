import { api } from "@/lib/api-client";
import type { AuditLog } from "@/lib/admin-types";

export type AuditListParams = {
  page?: number;
  limit?: number;
  action?: string;
  entity?: string;
};

export function listAuditLogs(params: AuditListParams = {}) {
  return api.get<AuditLog[]>("/admin/audit-logs", { query: { ...params } });
}
