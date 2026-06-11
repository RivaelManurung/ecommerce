import { Camera, Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { StaticPage } from "@/components/static/static-page";
import { Reveal } from "@/components/shared/reveal";
import { ContactForm } from "@/components/contact/contact-form";

const channels = [
  {
    icon: Mail,
    title: "Email",
    value: "hello@veloura.beauty",
    href: "mailto:hello@veloura.beauty",
    note: "Balasan dalam 1×24 jam",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "+62 812-3456-7890",
    href: "https://wa.me/6281234567890",
    note: "Chat beauty advisor kami",
  },
  {
    icon: MapPin,
    title: "Alamat",
    value: "Setiabudi, Jakarta Selatan",
    href: "/contact",
    note: "Senin–Jumat, dengan janji temu",
  },
  {
    icon: Camera,
    title: "Instagram",
    value: "@veloura.beauty",
    href: "https://instagram.com",
    note: "Tips & inspirasi harian",
  },
];

export default function ContactPage() {
  return (
    <StaticPage
      title="Hubungi Kami"
      eyebrow="Customer Care"
      intro="Punya pertanyaan seputar produk atau pesanan? Tim Veloura siap membantu setiap hari pukul 08.00–20.00 WIB."
      contained={false}
    >
      <div className="grid gap-10 py-10 md:py-12 lg:grid-cols-[1fr_1.1fr]">
        {/* Channels */}
        <div className="grid gap-4 sm:grid-cols-2">
          {channels.map((channel, i) => (
            <Reveal key={channel.title} delay={i * 0.05}>
              <a
                href={channel.href}
                className="focus-ring flex h-full flex-col rounded-2xl border border-[#EEE7E2] bg-white p-6 soft-shadow transition hover:-translate-y-1 hover:border-[#F0C9D2]"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#F8DDE2] text-[#A9445A]">
                  <channel.icon size={19} />
                </span>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-[#9B918A]">{channel.title}</p>
                <p className="mt-1 text-sm font-semibold text-[#262626]">{channel.value}</p>
                <p className="mt-2 text-xs text-[#737373]">{channel.note}</p>
              </a>
            </Reveal>
          ))}
          <div className="rounded-2xl bg-[#F3E6D8]/60 p-6 sm:col-span-2">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#5f5853]">
              <Clock size={16} className="text-[#A9445A]" /> Jam operasional
            </p>
            <p className="mt-1 text-sm text-[#737373]">Setiap hari · 08.00 – 20.00 WIB</p>
          </div>
        </div>

        {/* Contact form — wired to POST /public/inquiries */}
        <Reveal direction="right">
          <ContactForm />
        </Reveal>
      </div>
    </StaticPage>
  );
}
