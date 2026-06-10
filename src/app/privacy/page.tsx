import { StaticPage } from "@/components/static/static-page";

export default function PrivacyPage() {
  return (
    <StaticPage
      title="Kebijakan Privasi"
      eyebrow="Legal"
      intro="Kami menjaga data pelanggan dan hanya menggunakannya untuk memproses pesanan, layanan pelanggan, serta komunikasi promosi yang disetujui."
      lastUpdated="1 Juni 2026"
    >
      <h2>Data yang Kami Kumpulkan</h2>
      <ul>
        <li>Informasi kontak: nama, email, nomor telepon, dan alamat pengiriman.</li>
        <li>Riwayat pesanan dan preferensi produk untuk personalisasi.</li>
        <li>Data teknis dasar seperti perangkat dan halaman yang dikunjungi.</li>
      </ul>

      <h2>Cara Kami Menggunakannya</h2>
      <p>
        Data digunakan untuk memproses pesanan, memberikan dukungan pelanggan, dan—jika kamu menyetujui—mengirim promosi
        yang relevan. Kami tidak menjual data pribadimu kepada pihak ketiga.
      </p>

      <h2>Hak Kamu</h2>
      <p>
        Kamu dapat meminta akses, koreksi, atau penghapusan data kapan saja dengan menghubungi{" "}
        <a href="mailto:hello@veloura.beauty">hello@veloura.beauty</a>. Kamu juga bisa berhenti berlangganan email kapan
        pun melalui tautan di setiap email.
      </p>
    </StaticPage>
  );
}
