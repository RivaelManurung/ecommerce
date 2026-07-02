import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import type { Category, Setting } from "@/lib/admin-types";
import { Stagger, StaggerItem } from "@/components/shared/stagger";
import { FOOTER_CARE_LINKS, FOOTER_HELP_LINKS } from "@/lib/site-config";
import { waLink } from "@/lib/wa";

export function SiteFooter({
  settings,
  categories,
}: {
  settings: Setting;
  categories: Category[];
}) {
  const year = new Date().getFullYear();
  const { instagram, facebook, tiktok } = settings.socials ?? { instagram: "", facebook: "", tiktok: "" };

  return (
    <footer className="border-t border-[#EEE7E2] bg-[#FFFDF9]">
      <Stagger className="container-page grid gap-10 py-12 md:grid-cols-[1.3fr_2fr_1.3fr]">
        <StaggerItem>
          <Link href="/" className="font-serif-display text-4xl leading-none">{settings.companyName}</Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[#737373]">
            {settings.tagline || "Katalog produk pilihan kami. Temukan favoritmu dan tanyakan langsung ke tim kami."}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {settings.whatsapp ? (
              <a href={waLink(settings.whatsapp, "Halo, saya ingin bertanya tentang produk Anda.")} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="focus-ring grid h-9 w-9 place-items-center rounded-full border border-[#EEE7E2] bg-white text-[#0E7A53] transition hover:bg-[#E3F2EA]">
                <MessageCircle size={17} />
              </a>
            ) : null}
            {instagram ? <SocialPill href={`https://instagram.com/${instagram}`}>Instagram</SocialPill> : null}
            {facebook ? <SocialPill href={`https://facebook.com/${facebook}`}>Facebook</SocialPill> : null}
            {tiktok ? <SocialPill href={`https://tiktok.com/@${tiktok}`}>TikTok</SocialPill> : null}
          </div>
        </StaggerItem>

        <StaggerItem className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          <FooterCol title="Katalog">
            <FooterLink href="/catalog">Semua Produk</FooterLink>
            {categories.slice(0, 6).map((c) => (
              <FooterLink key={c.id} href={`/catalog?category=${c.slug}`}>{c.name}</FooterLink>
            ))}
          </FooterCol>
          <FooterCol title="Bantuan">
            {FOOTER_HELP_LINKS.map((l) => (
              <FooterLink key={l.label} href={l.href}>{l.label}</FooterLink>
            ))}
          </FooterCol>
          <FooterCol title="Perusahaan">
            {FOOTER_CARE_LINKS.map((l) => (
              <FooterLink key={l.label} href={l.href}>{l.label}</FooterLink>
            ))}
          </FooterCol>
        </StaggerItem>

        <StaggerItem>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em]">Hubungi Kami</h3>
          <div className="mt-4 grid gap-3 text-sm text-[#737373]">
            {settings.phone ? <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 hover:text-[#A9445A]"><Phone size={16} /> {settings.phone}</a> : null}
            {settings.email ? <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2 hover:text-[#A9445A]"><Mail size={16} /> {settings.email}</a> : null}
            {settings.address ? <span className="inline-flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /> {settings.address}</span> : null}
          </div>
          <Link href="/contact" className="mt-5 inline-flex rounded-full border border-[#C95F72] px-5 py-2 text-sm font-semibold text-[#A9445A] transition hover:bg-[#FFF1F3]">
            Kirim Pertanyaan
          </Link>
        </StaggerItem>
      </Stagger>
      <p className="border-t border-[#EEE7E2] py-5 text-center text-xs text-[#737373]">
        © {year} {settings.companyName}. Hak cipta dilindungi.
      </p>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.18em]">{title}</h3>
      <ul className="mt-3 grid gap-2 text-sm text-[#737373]">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="transition hover:text-[#A9445A]">{children}</Link>
    </li>
  );
}

function SocialPill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring inline-flex h-9 items-center rounded-full border border-[#EEE7E2] bg-white px-3 text-xs font-semibold text-[#262626] transition hover:bg-[#FAF4EF] hover:text-[#A9445A]"
    >
      {children}
    </a>
  );
}
