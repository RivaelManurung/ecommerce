"use client";

import { useCallback, useEffect, useState } from "react";
import { Boxes, Search } from "lucide-react";
import { listInventory, adjustStock, type InventoryRow, type StockLevel } from "@/features/admin-inventory/api";
import { ApiError } from "@/lib/api-client";
import { PageHeader } from "@/components/admin/page-header";
import { ErrorState, EmptyState, TableSkeleton } from "@/components/admin/data-state";
import { toast } from "@/components/admin/toast";
import { formatIDR } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

const LEVEL: Record<StockLevel, { tone: "red" | "amber" | "green"; label: string }> = {
  out: { tone: "red", label: "Out of stock" },
  low: { tone: "amber", label: "Low" },
  ok: { tone: "green", label: "In stock" },
};

export default function InventoryPage() {
  const [rows, setRows] = useState<InventoryRow[]>([]);
  const [threshold, setThreshold] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [lowOnly, setLowOnly] = useState(false);
  const [editing, setEditing] = useState<InventoryRow | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { rows, threshold } = await listInventory({ search, low: lowOnly });
      setRows(rows);
      setThreshold(threshold);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }, [search, lowOnly]);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description={`Stock across all variants. Low-stock threshold: ${threshold}.`} />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search products…" className="pl-9" aria-label="Search inventory" />
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-zinc-600">
          <input type="checkbox" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} className="h-4 w-4 accent-zinc-900" />
          Low / out of stock only
        </label>
      </div>

      <Card>
        {loading ? (
          <div className="p-4"><TableSkeleton rows={6} cols={5} /></div>
        ) : error ? (
          <div className="p-4"><ErrorState message={error} onRetry={load} /></div>
        ) : rows.length === 0 ? (
          <div className="p-4"><EmptyState icon={<Boxes size={28} />} title="No variants" description="Inventory will show product variants here." /></div>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Product</TH>
                <TH>Variant</TH>
                <TH className="text-right">Price</TH>
                <TH className="text-right">Stock</TH>
                <TH>Level</TH>
                <TH className="text-right">Adjust</TH>
              </TR>
            </THead>
            <TBody>
              {rows.map((r) => (
                <TR key={r.variantId}>
                  <TD>
                    <p className="font-medium text-zinc-900">{r.productName}</p>
                    <p className="text-xs text-zinc-500">{r.productStatus}</p>
                  </TD>
                  <TD>
                    <p className="text-zinc-800">{r.variantName}</p>
                    {r.sku ? <p className="text-xs text-zinc-500">{r.sku}</p> : null}
                  </TD>
                  <TD className="text-right text-zinc-600">{formatIDR(r.price)}</TD>
                  <TD className="text-right font-semibold text-zinc-900">{r.stock}</TD>
                  <TD><Badge tone={LEVEL[r.level].tone}>{LEVEL[r.level].label}</Badge></TD>
                  <TD className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setEditing(r)}>Adjust</Button>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>

      {editing ? (
        <AdjustModal row={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); void load(); }} />
      ) : null}
    </div>
  );
}

function AdjustModal({ row, onClose, onSaved }: { row: InventoryRow; onClose: () => void; onSaved: () => void }) {
  const [mode, setMode] = useState<"add" | "set">("add");
  const [quantity, setQuantity] = useState("0");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const qty = Number(quantity) || 0;
  const preview = mode === "set" ? Math.max(0, qty) : Math.max(0, row.stock + qty);

  async function save() {
    setSaving(true);
    try {
      await adjustStock(row.productId, row.variantId, { mode, quantity: qty, reason });
      toast.success("Stock updated");
      onSaved();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update stock");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-base font-semibold text-zinc-900">Adjust stock</h2>
        <p className="mt-1 text-sm text-zinc-500">{row.productName} · {row.variantName} (current {row.stock})</p>

        <div className="mt-4 grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="mode">Mode</Label>
              <Select id="mode" value={mode} onChange={(e) => setMode(e.target.value as "add" | "set")}>
                <option value="add">Add / remove (±)</option>
                <option value="set">Set absolute</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="qty">Quantity</Label>
              <Input id="qty" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Input id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Restock, damaged, correction…" />
          </div>
          <p className="rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-600">
            New stock will be <span className="font-semibold text-zinc-900">{preview}</span>.
          </p>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button variant="default" size="sm" onClick={save} disabled={saving}>
            {saving && <Spinner size={14} />} Save
          </Button>
        </div>
      </div>
    </div>
  );
}
