import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function StaticPage({
  title,
  eyebrow = "Veloura",
  intro,
  lastUpdated,
  children,
  contained = true,
}: {
  title: string;
  eyebrow?: string;
  intro?: string;
  lastUpdated?: string;
  children: React.ReactNode;
  /** wrap children in the default prose card; set false for fully custom content */
  contained?: boolean;
}) {
  return (
    <main className="pb-16">
      {/* Editorial header band */}
      <header className="editorial-surface border-b border-[#EEE7E2]">
        <div className="container-page py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs text-[#9B918A]">
            <Link href="/" className="transition hover:text-[#A9445A]">Beranda</Link>
            <ChevronRight size={13} />
            <span className="font-medium text-[#737373]">{title}</span>
          </nav>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#C95F72]">{eyebrow}</p>
          <h1 className="font-serif-display text-5xl leading-none md:text-6xl">{title}</h1>
          {intro ? <p className="mt-4 max-w-2xl text-base leading-7 text-[#5f5853]">{intro}</p> : null}
          {lastUpdated ? (
            <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[#9B918A]">Terakhir diperbarui · {lastUpdated}</p>
          ) : null}
        </div>
      </header>

      <div className="container-page">
        {contained ? (
          <article className="rich-content mx-auto -mt-px max-w-3xl py-10 md:py-12">{children}</article>
        ) : (
          children
        )}
      </div>
    </main>
  );
}
