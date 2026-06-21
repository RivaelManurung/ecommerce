"use client";

import { useCallback, useEffect, useState } from "react";
import { Star, MessageSquare, Check, X, Trash2 } from "lucide-react";
import { listReviews, moderateReview, deleteReview, type Review, type ReviewStatus } from "@/features/admin-reviews/api";
import type { PaginationMeta } from "@/lib/admin-types";
import { ApiError } from "@/lib/api-client";
import { PageHeader } from "@/components/admin/page-header";
import { ErrorState, EmptyState, TableSkeleton } from "@/components/admin/data-state";
import { PaginationBar } from "@/components/admin/pagination-bar";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "@/components/admin/toast";
import { formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

const LIMIT = 10;
const TONE: Record<ReviewStatus, "amber" | "green" | "red"> = { pending: "amber", approved: "green", rejected: "red" };

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex" aria-label={`${rating} of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={14} className={n <= rating ? "fill-amber-400 text-amber-400" : "text-zinc-300"} />
      ))}
    </span>
  );
}

export default function ReviewsPage() {
  const [items, setItems] = useState<Review[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, meta } = await listReviews({ page, limit: LIMIT, status });
      setItems(data);
      setMeta(meta);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  async function moderate(r: Review, next: ReviewStatus) {
    setBusy(r.id);
    try {
      const updated = await moderateReview(r.id, next);
      setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      toast.success(`Review ${next}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update");
    } finally {
      setBusy(null);
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteReview(toDelete.id);
      toast.success("Review deleted");
      setToDelete(null);
      void load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Reviews" description="Moderate customer product reviews." />

      <div className="flex">
        <Select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }} className="sm:max-w-[180px]" aria-label="Filter by status">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </Select>
      </div>

      <Card>
        {loading ? (
          <div className="p-4"><TableSkeleton rows={6} cols={5} /></div>
        ) : error ? (
          <div className="p-4"><ErrorState message={error} onRetry={load} /></div>
        ) : items.length === 0 ? (
          <div className="p-4"><EmptyState icon={<MessageSquare size={28} />} title="No reviews" description="Customer reviews will appear here for moderation." /></div>
        ) : (
          <>
            <Table>
              <THead>
                <TR>
                  <TH>Author</TH>
                  <TH>Rating</TH>
                  <TH>Comment</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {items.map((r) => (
                  <TR key={r.id}>
                    <TD>
                      <p className="font-medium text-zinc-900">{r.authorName}</p>
                      <p className="text-xs text-zinc-500">{formatDateTime(r.createdAt)}</p>
                    </TD>
                    <TD><Stars rating={r.rating} /></TD>
                    <TD className="max-w-sm"><p className="line-clamp-2 text-zinc-600" title={r.comment}>{r.comment}</p></TD>
                    <TD><Badge tone={TONE[r.status]}>{r.status}</Badge></TD>
                    <TD className="text-right">
                      <div className="inline-flex items-center gap-1">
                        {r.status !== "approved" ? (
                          <Button variant="ghost" size="icon" aria-label="Approve" disabled={busy === r.id} onClick={() => moderate(r, "approved")}>
                            <Check size={15} className="text-emerald-600" />
                          </Button>
                        ) : null}
                        {r.status !== "rejected" ? (
                          <Button variant="ghost" size="icon" aria-label="Reject" disabled={busy === r.id} onClick={() => moderate(r, "rejected")}>
                            <X size={15} className="text-amber-600" />
                          </Button>
                        ) : null}
                        <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => setToDelete(r)}>
                          <Trash2 size={15} className="text-red-600" />
                        </Button>
                      </div>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
            <PaginationBar meta={meta} onPage={setPage} />
          </>
        )}
      </Card>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this review?"
        description="This permanently removes the review."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
