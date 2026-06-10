import { StaticPage } from "@/components/static/static-page";

export default function TermsPage() {
  return (
    <StaticPage
      title="Syarat & Ketentuan"
      eyebrow="Legal"
      intro="Dengan berbelanja di Veloura Beauty, kamu menyetujui syarat pembelian, pembayaran, pengiriman, dan retur yang berlaku."
      lastUpdated="1 Juni 2026"
    >
      <h2>Pembelian & Pembayaran</h2>
      <p>
        Seluruh harga ditampilkan dalam Rupiah dan sudah termasuk pajak. Pesanan dianggap sah setelah pembayaran
        diterima. Kami berhak membatalkan pesanan jika terjadi kesalahan harga atau stok tidak tersedia.
      </p>

      <h2>Pengiriman</h2>
      <p>
        Estimasi pengiriman bersifat perkiraan dan dapat berubah karena faktor di luar kendali kami. Risiko beralih ke
        pembeli setelah paket diterima.
      </p>

      <h2>Retur & Pengembalian Dana</h2>
      <ul>
        <li>Pengajuan retur maksimal 7 hari setelah pesanan diterima.</li>
        <li>Produk harus dalam kondisi asli, belum dipakai, dan kemasan lengkap.</li>
        <li>Pengembalian dana diproses 3–7 hari kerja setelah produk kami terima.</li>
      </ul>

      <h2>Kontak</h2>
      <p>
        Pertanyaan terkait ketentuan ini dapat dikirim ke <a href="mailto:hello@veloura.beauty">hello@veloura.beauty</a>.
      </p>
    </StaticPage>
  );
}
