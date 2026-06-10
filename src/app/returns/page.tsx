import { StaticPage } from "@/components/static/static-page";

export default function ReturnsPage() {
  return (
    <StaticPage
      title="Retur & Refund"
      eyebrow="Bantuan"
      intro="Kepuasanmu adalah prioritas kami. Jika ada yang tidak sesuai, kami bantu prosesnya dengan mudah."
    >
      <h2>Syarat Retur</h2>
      <ul>
        <li>Ajukan maksimal 7 hari setelah pesanan diterima.</li>
        <li>Berlaku untuk produk rusak, cacat, atau tidak sesuai pesanan.</li>
        <li>Produk dalam kondisi asli dengan kemasan dan segel lengkap.</li>
      </ul>

      <h2>Cara Mengajukan</h2>
      <ol>
        <li>Hubungi kami di <a href="mailto:hello@veloura.beauty">hello@veloura.beauty</a> dengan nomor pesanan.</li>
        <li>Sertakan foto produk dan deskripsi singkat masalah.</li>
        <li>Tim kami akan mengirim instruksi pengembalian dalam 1×24 jam.</li>
      </ol>

      <h2>Pengembalian Dana</h2>
      <p>Refund diproses dalam 3–7 hari kerja setelah produk kami terima dan diverifikasi.</p>
    </StaticPage>
  );
}
