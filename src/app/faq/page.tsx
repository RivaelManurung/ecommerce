import Link from "next/link";
import { StaticPage } from "@/components/static/static-page";
import { FaqAccordion, type FaqItem } from "@/components/static/faq-accordion";

const faqs: FaqItem[] = [
  {
    question: "Apakah produk Veloura aman dan terdaftar BPOM?",
    answer:
      "Ya. Seluruh produk Veloura terdaftar BPOM, cruelty-free, dan melalui kontrol kualitas ketat. Aman digunakan sesuai instruksi pada kemasan.",
  },
  {
    question: "Bagaimana cara memilih shade yang tepat?",
    answer:
      "Gunakan panduan shade di setiap halaman produk, atau cocokkan dengan warna leher/rahang untuk hasil paling natural. Beauty advisor kami juga siap membantu via WhatsApp.",
  },
  {
    question: "Berapa lama estimasi pengiriman?",
    answer:
      "Reguler 2–4 hari kerja, Express 1–2 hari kerja, dan Same Day untuk area Jabodetabek. Nomor resi dikirim via email setelah pesanan diproses.",
  },
  {
    question: "Apakah ada gratis ongkir?",
    answer:
      "Gratis ongkir reguler otomatis aktif untuk pembelian minimum Rp150.000. Gunakan kode VELOURA20 di halaman keranjang.",
  },
  {
    question: "Bagaimana kebijakan retur?",
    answer:
      "Pengajuan retur maksimal 7 hari setelah pesanan diterima untuk produk rusak atau tidak sesuai. Produk harus dalam kondisi asli dengan kemasan lengkap.",
  },
  {
    question: "Metode pembayaran apa saja yang tersedia?",
    answer:
      "Kami menerima transfer bank (BCA, Mandiri, BRI, BNI), e-wallet (OVO, DANA, GoPay, ShopeePay), serta kartu kredit/debit Visa & Mastercard.",
  },
];

export default function FaqPage() {
  return (
    <StaticPage
      title="Pertanyaan Umum"
      eyebrow="Bantuan"
      intro="Temukan jawaban cepat seputar produk, pengiriman, dan pesananmu di Veloura Beauty."
      contained={false}
    >
      <div className="py-10 md:py-12">
        <FaqAccordion items={faqs} />
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-[#737373]">
          Masih ada pertanyaan?{" "}
          <Link href="/contact" className="font-bold text-[#A9445A] hover:underline">
            Hubungi tim kami
          </Link>
          .
        </p>
      </div>
    </StaticPage>
  );
}
