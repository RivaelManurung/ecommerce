import { Camera, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

const cols = [
  ["Shop", ["New In", "Makeup", "Skincare", "Lips", "Eyes", "Tools", "Sale"]],
  ["Help", ["Cara Belanja", "Pembayaran", "Pengiriman", "Retur & Refund", "Track Order", "Wishlist"]],
  ["Customer Care", ["Hubungi Kami", "FAQ", "Ulasan & Shade Guide", "Syarat & Ketentuan", "Kebijakan Privasi"]],
];

export function SiteFooter() {
  return (
    <footer className="bg-[#FFFDF9]">
      <div className="container-page grid gap-10 py-10 md:grid-cols-[1.2fr_2fr_1.2fr]">
        <div>
          <Link href="/" className="font-serif-display text-4xl leading-none">veloura</Link>
          <p className="mt-4 max-w-xs text-sm text-[#737373]">Veloura Beauty hadir untuk menemani pancaran dirimu dengan produk berkualitas tinggi dan formula yang aman.</p>
          <div className="mt-4 flex items-center gap-3 text-[#A9445A]">
            <Camera size={18} />
            <span className="text-sm">@veloura.beauty</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          {cols.map(([title, links]) => (
            <div key={title as string}>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em]">{title}</h3>
              <ul className="mt-3 grid gap-2 text-sm text-[#737373]">
                {(links as string[]).map((link) => (
                  <li key={link}>{link}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em]">Hubungi kami</h3>
          <div className="mt-4 grid gap-3 text-sm text-[#737373]">
            <span className="inline-flex gap-2"><Phone size={16} /> +62 812-3456-7890</span>
            <span className="inline-flex gap-2"><Mail size={16} /> hello@veloura.beauty</span>
            <span className="inline-flex gap-2"><MapPin size={16} /> Setiabudi, Jakarta Selatan</span>
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em]">Metode pembayaran</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["BCA", "Mandiri", "BRI", "BNI", "VISA", "OVO", "DANA"].map((item) => (
              <span key={item} className="rounded-md border border-[#EEE7E2] bg-white px-2.5 py-1 text-xs font-bold text-[#3861A8]">{item}</span>
            ))}
          </div>
        </div>
      </div>
      <p className="border-t border-[#EEE7E2] py-5 text-center text-xs text-[#737373]">© 2024 Veloura Beauty. All rights reserved.</p>
    </footer>
  );
}
