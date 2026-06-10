import { StaticPage } from "@/components/static/static-page";

export default function ShippingPage() {
  return (
    <StaticPage
      title="Pengiriman"
      eyebrow="Bantuan"
      intro="Semua pesanan dikemas dengan aman dan dikirim dari Jakarta ke seluruh Indonesia."
    >
      <h2>Pilihan & Estimasi</h2>
      <ul>
        <li><strong>Reguler</strong> — tiba dalam 2–4 hari kerja.</li>
        <li><strong>Express</strong> — tiba dalam 1–2 hari kerja (Rp18.000).</li>
        <li><strong>Same Day</strong> — sampai di hari yang sama untuk area Jabodetabek (Rp25.000).</li>
      </ul>

      <h2>Gratis Ongkir</h2>
      <p>
        Gratis ongkir reguler otomatis aktif untuk pembelian minimum <strong>Rp150.000</strong>. Gunakan kode{" "}
        <strong>VELOURA20</strong> di halaman keranjang.
      </p>

      <h2>Pelacakan</h2>
      <p>
        Nomor resi dikirim via email dan dapat dipantau melalui halaman <a href="/account">Akun</a> setelah pesanan
        diproses.
      </p>
    </StaticPage>
  );
}
