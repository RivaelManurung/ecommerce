 Design System: Admin Dashboard + Customers
markdown
# Design System: Admin Platform

> **Versi:** 1.0.0  
> **Framework:** Next.js + shadcn/ui  
> **Vibe:** Modern, colorful, playful namun profesional — terinspirasi dari Supabase / Railway / Vercel.

---

## 1. Filosofi Desain & Vibe

### Arah Visual
- **Bersih & Lapang** – banyak white space, kardus dengan shadow halus.
- **Warna yang Kuat** – aksen ungu/indigo sebagai primary, coral sebagai accent.
- **Hierarki Tipografi** – judul besar, label kecil, data menonjol.
- **Status yang Jelas** – badge dengan warna semantik (hijau = aktif, merah = diblokir).
- **Mikro-interaksi** – hover, transisi, fokus yang halus dan responsif.

### Aturan Anti-“AI Slop”
| ❌ Jangan | ✅ Pakai |
|-----------|----------|
| Inline styles | CSS variables + `cn()` |
| `bg-gray-100` | `bg-muted` |
| `text-gray-600` | `text-muted-foreground` |
| Hardcoded hex | `--primary`, `--destructive`, dll. |
| Over-shadow | `shadow-sm` untuk kartu, `shadow-md` untuk dropdown |
| Custom table | `<Table>` dari shadcn |
| Manual pagination | `<Pagination>` dari shadcn |
| Div sebagai badge | `<Badge>` dengan variant |

---

## 2. Color Tokens (CSS Variables)

```css
:root {
  /* Latar & Teks Dasar */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 262.1 83.3% 57.8%;

  /* Primary – Ungu/Indigo (Supabase vibe) */
  --primary: 262.1 83.3% 57.8%;
  --primary-foreground: 210 40% 98%;

  /* Secondary */
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;

  /* Accent – Coral hangat */
  --accent: 24 100% 65%;
  --accent-foreground: 222.2 47.4% 11.2%;

  /* Status */
  --success: 142.1 76.2% 36.3%;
  --success-foreground: 355.7 100% 97.3%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --warning: 38 92% 50%;
  --warning-foreground: 48 96% 89%;
}
Warna Status Badge
Status	Background	Text	Border
Active	bg-emerald-50	text-emerald-700	border-emerald-200
Blocked	bg-rose-50	text-rose-700	border-rose-200
Pending	bg-amber-50	text-amber-700	border-amber-200
3. Tipografi
css
--font-sans: Inter, system-ui, -apple-system, sans-serif;

--text-xs: 0.75rem;    /* 12px – badge, helper */
--text-sm: 0.875rem;   /* 14px – sel tabel, teks sekunder */
--text-base: 1rem;     /* 16px – body */
--text-lg: 1.125rem;   /* 18px – judul kartu */
--text-xl: 1.25rem;    /* 20px – judul halaman */
--text-2xl: 1.5rem;    /* 24px – header section */
--text-3xl: 1.875rem;  /* 30px – angka KPI besar */

--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
Aturan:

Judul halaman: text-2xl font-semibold tracking-tight

Angka KPI: text-3xl font-bold

Label tabel: text-xs font-medium uppercase tracking-wider text-muted-foreground

Sel tabel: text-sm font-normal

Badge: text-xs font-medium

4. Pemetaan Komponen ke shadcn/ui
Pola UI	Komponen shadcn	Varian / Props
Container halaman	<div className="container mx-auto p-6">	–
Header halaman	<div className="flex items-center justify-between">	–
Kartu KPI	<Card> + <CardHeader> + <CardContent>	shadow-sm
Search input	<Input type="search" placeholder="..." className="max-w-sm">	–
Filter status	<Select> + <SelectTrigger> + <SelectContent>	–
Tabel data	<Table> + <TableHeader> + <TableBody>	–
Badge status	<Badge variant="outline"> + custom className	variant="outline"
Paginasi	<Pagination>	–
Grafik	recharts (LineChart, BarChart)	–
Tombol aksi	<Button>	variant="default" / outline
5. Inventaris Komponen shadcn (wajib di-install)
bash
npx shadcn-ui@latest add table
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add pagination
npx shadcn-ui@latest add card
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add separator
Props default tiap komponen:

Table – className="w-full"
TableHeader: className="bg-muted/50"
TableRow: className="hover:bg-muted/50 transition-colors"
TableCell: className="py-3"

Badge (status) – variant="outline" + className="rounded-full px-3 py-0.5 text-xs font-medium border"

Input (search) – type="search" + className="max-w-sm h-9"

Select (filter) – <SelectTrigger className="w-[140px] h-9">

Pagination – className="mt-4"
Pakai <PaginationPrevious>, <PaginationNext>, <PaginationLink>

Card – className="shadow-sm border-border"
CardHeader: className="pb-2"
CardTitle: className="text-sm font-medium text-muted-foreground"
CardContent: className="text-3xl font-bold"

6. Tata Letak (Layout)
Halaman Dashboard
text
┌─────────────────────────────────────────────────────────────┐
│  Dashboard                                                 │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────┐ │
│  │ Total Rev  │ │ Subscript  │ │ Sales      │ │ Action  │ │
│  │ $45,231.89 │ │ +2,350     │ │ +12,234    │ │ +573    │ │
│  └────────────┘ └────────────┘ └────────────┘ └─────────┘ │
│                                                             │
│  ┌──────────────────────────┐ ┌──────────────────────────┐ │
│  │  Revenue Chart           │ │  Revenue Chart (Bottom)  │ │
│  │  (Line chart)            │ │  (Bar chart)             │ │
│  │  Legend: Lead, Qualified │ │  Legend: Top-desk, ...   │ │
│  └──────────────────────────┘ └──────────────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Recent Projects (grid 4–6 item)                    │   │
│  │  [1] [2] [3] [4] [5] [6] ...                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
Halaman Customers
text
┌─────────────────────────────────────────────────────────────┐
│  Customers                                                 │
│  Storefront accounts, purchase history, and access control.│
│  ┌───────────────┐  ┌──────────────┐  ┌──────────┐       │
│  │ 🔍 Search...  │  │ ▼ All status │  │ + Add    │       │
│  └───────────────┘  └──────────────┘  └──────────┘       │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Customer   │ Joined      │ Login │ Status           │ │
│  │  Bayu S.   │ 21 Jun 2026 │ Email │ ● Active         │ │
│  │  Aisyah N. │ 19 Jun 2026 │ Email │ ● Active         │ │
│  │  ...       │ ...         │ ...   │ ...              │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  1–10 of 13    ◄ [1] [2] ►                                 │
└─────────────────────────────────────────────────────────────┘
Spacing & Responsive
Padding halaman: p-6 (24px)

Jarak antar kartu KPI: gap-4 (16px)

Jarak filter bar ke tabel: mt-4

Jarak tabel ke paginasi: mt-4

Responsive:

Search bar: max-w-sm di desktop, w-full di mobile

Kartu KPI: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4

Grafik: flex-col lg:flex-row

Tabel: overflow-x-auto di mobile

7. Anti-pattern (JANGAN DILAKUKAN)
❌ Dilarang:

bg-gray-100, text-gray-600 → pakai bg-muted, text-muted-foreground

Inline styles (style={{}})

Hardcoded hex → pakai CSS variables

border tanpa border-border

hover:bg-gray-50 → pakai hover:bg-muted/50

Custom table tanpa <Table>

Badge pakai div → pakai <Badge>

Pagination manual → pakai <Pagination>

Search tanpa <Input>

Filter tanpa <Select>

✅ WAJIB:

cn() utility untuk conditional classes (@/lib/utils)

Import dari @/components/ui

Semua interactive elements pakai transition-colors duration-200

8. Implementasi Contoh
Status Badge Component
tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig = {
  Active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Blocked: "border-rose-200 bg-rose-50 text-rose-700",
  Pending: "border-amber-200 bg-amber-50 text-amber-700",
};

export function StatusBadge({ status }: { status: keyof typeof statusConfig }) {
  return (
    <Badge variant="outline" className={cn("rounded-full px-3 py-0.5 text-xs font-medium", statusConfig[status])}>
      {status}
    </Badge>
  );
}
Kartu KPI
tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function KPICard({ title, value, icon }: { title: string; value: string; icon?: React.ReactNode }) {
  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-3xl font-bold">{value}</CardContent>
    </Card>
  );
}
Filter Bar
tsx
<div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
  <div className="flex flex-1 gap-3">
    <Input type="search" placeholder="Search name or email..." className="max-w-sm h-9" />
    <Select>
      <SelectTrigger className="w-[140px] h-9">
        <SelectValue placeholder="All statuses" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All statuses</SelectItem>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="blocked">Blocked</SelectItem>
      </SelectContent>
    </Select>
  </div>
  <Button>+ Add Customer</Button>
</div>
Tabel Customers
tsx
<Table>
  <TableHeader className="bg-muted/50">
    <TableRow>
      <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Customer</TableHead>
      <TableHead>Joined</TableHead>
      <TableHead>Login</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {customers.map((c) => (
      <TableRow key={c.id} className="hover:bg-muted/50 transition-colors">
        <TableCell className="font-medium">{c.name}</TableCell>
        <TableCell>{formatDate(c.joined)}</TableCell>
        <TableCell>{c.login}</TableCell>
        <TableCell><StatusBadge status={c.status} /></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
Grafik dengan Recharts
tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

<LineChart data={revenueData} className="w-full h-72">
  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="lead" stroke="#8b5cf6" />
  <Line type="monotone" dataKey="qualified" stroke="#3b82f6" />
  <Line type="monotone" dataKey="proposal" stroke="#f59e0b" />
  <Line type="monotone" dataKey="negotiation" stroke="#ef4444" />
</LineChart>
9. Struktur Folder
text
src/
├── app/
│   ├── dashboard/
│   │   └── page.tsx
│   └── customers/
│       └── page.tsx
├── components/
│   ├── dashboard/
│   │   ├── KPICard.tsx
│   │   ├── RevenueChart.tsx
│   │   └── RecentProjects.tsx
│   ├── customers/
│   │   ├── CustomersTable.tsx
│   │   ├── CustomersFilters.tsx
│   │   ├── StatusBadge.tsx
│   │   └── CustomersPagination.tsx
│   └── ui/               # shadcn auto-generated
├── lib/
│   └── utils.ts          # cn()
└── styles/
    └── globals.css       # CSS variables
10. Prompt untuk Agent
"Implementasikan halaman Dashboard dan Customers sesuai dengan design.md ini.
Gunakan shadcn/ui components, ikuti color tokens, typography, dan component mapping yang sudah didefinisikan.
Pastikan semua anti-pattern dihindari.
Untuk data, gunakan mock data yang realistis.
Buat semua komponen terpisah di folder masing-masing."

📌 Catatan Khusus
Dashboard: Kartu KPI harus responsif (grid 4 kolom di desktop, 2 di tablet, 1 di mobile). Grafik menggunakan recharts dengan warna sesuai palette. Recent Projects bisa berupa grid avatar/nama project.

Customers: Tabel dengan status badge yang jelas. Search dan filter harus fungsional (di frontend). Paginasi menunjukkan total data.

Konsistensi: Semua halaman memakai layout yang sama (sidebar kiri + konten utama) jika ada di desain keseluruhan.

Dokumen ini adalah single source of truth untuk seluruh implementasi UI.
Update di sini → re-generate komponen → konsistensi terjamin