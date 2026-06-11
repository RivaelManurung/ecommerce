import Link from "next/link";

export function SectionHeading({
  eyebrow,
  title,
  copy,
  href,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  href?: string;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-[#C95F72]">{eyebrow}</p> : null}
        <h2 className="font-serif-display text-4xl leading-none md:text-5xl">{title}</h2>
        {copy ? <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737373]">{copy}</p> : null}
      </div>
      {href ? (
        <Link href={href} className="group text-sm font-bold uppercase tracking-[0.12em] text-[#A9445A]">
          Lihat semua <span className="inline-block transition group-hover:translate-x-1">{`->`}</span>
        </Link>
      ) : null}
    </div>
  );
}
