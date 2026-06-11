"use client";

import { useCallback, useEffect, useState } from "react";
import { Inbox } from "lucide-react";
import { listInquiries, updateInquiryStatus } from "@/features/inquiries/api";
import type { Inquiry, InquiryStatus, PaginationMeta } from "@/lib/admin-types";
import { ApiError } from "@/lib/api-client";
import { PageHeader } from "@/components/admin/page-header";
import { InquiryStatusBadge } from "@/components/admin/status-badge";
import { ErrorState, EmptyState, TableSkeleton } from "@/components/admin/data-state";
import { PaginationBar } from "@/components/admin/pagination-bar";
import { toast } from "@/components/admin/toast";
import { formatDateTime } from "@/lib/format";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

const LIMIT = 10;
const STATUSES: InquiryStatus[] = ["new", "contacted", "closed"];
const rank: Record<InquiryStatus, number> = { new: 0, contacted: 1, closed: 2 };

export default function InquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, meta } = await listInquiries({ page, limit: LIMIT, status, order: "desc" });
      setItems(data);
      setMeta(meta);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  async function changeStatus(inq: Inquiry, next: InquiryStatus) {
    if (next === inq.status) return;
    setUpdating(inq.id);
    try {
      const updated = await updateInquiryStatus(inq.id, next);
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      toast.success(`Marked ${next}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Inquiries" description="Customer messages from the storefront." />

      <div className="flex">
        <Select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="sm:max-w-[180px]"
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </Select>
      </div>

      <Card>
        {loading ? (
          <div className="p-4">
            <TableSkeleton rows={6} cols={5} />
          </div>
        ) : error ? (
          <div className="p-4">
            <ErrorState message={error} onRetry={load} />
          </div>
        ) : items.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={<Inbox size={28} />}
              title="No inquiries"
              description="Messages submitted from the contact form appear here."
            />
          </div>
        ) : (
          <>
            <Table>
              <THead>
                <TR>
                  <TH>From</TH>
                  <TH>Message</TH>
                  <TH>Status</TH>
                  <TH>Received</TH>
                  <TH className="text-right">Set status</TH>
                </TR>
              </THead>
              <TBody>
                {items.map((i) => (
                  <TR key={i.id}>
                    <TD>
                      <p className="font-medium text-zinc-900">{i.name}</p>
                      <p className="text-xs text-zinc-500">{i.email}</p>
                    </TD>
                    <TD className="max-w-xs">
                      <p className="truncate text-zinc-600" title={i.message}>
                        {i.message}
                      </p>
                    </TD>
                    <TD>
                      <InquiryStatusBadge status={i.status} />
                    </TD>
                    <TD className="text-zinc-500">{formatDateTime(i.createdAt)}</TD>
                    <TD className="text-right">
                      <Select
                        value={i.status}
                        disabled={updating === i.id || i.status === "closed"}
                        onChange={(e) => changeStatus(i, e.target.value as InquiryStatus)}
                        className="ml-auto max-w-[150px]"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s} disabled={rank[s] < rank[i.status]}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </Select>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
            <PaginationBar meta={meta} onPage={setPage} />
          </>
        )}
      </Card>
    </div>
  );
}
