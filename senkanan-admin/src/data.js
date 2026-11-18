// Data contoh untuk panel admin SENkanan.

export const STORE_URL = 'http://localhost:5173';

export const PRODUCTS = [
  { id: 'sein-led-sequential', sku: 'SN-LS-001', name: 'Sein LED Sequential Mini', category: 'Lampu dan sein', price: 85000, stock: 24, image: '/images/product-1.jpg' },
  { id: 'kampas-rem-cakram', sku: 'SN-PR-001', name: 'Kampas Rem Cakram Depan', category: 'Pengereman', price: 45000, stock: 42, image: '/images/product-2.jpg' },
  { id: 'spion-bar-end-cnc', sku: 'SN-AK-001', name: 'Spion Bar End CNC', category: 'Aksesori motor', price: 175000, stock: 18, image: '/images/product-3.jpg' },
  { id: 'busi-iridium-performance', sku: 'SN-MS-001', name: 'Busi Iridium Performance', category: 'Mesin dan komponen', price: 95000, stock: 36, image: '/images/product-4.jpg' },
  { id: 'lampu-led-headlight-h4', sku: 'SN-LS-002', name: 'Lampu LED Headlight H4', category: 'Lampu dan sein', price: 125000, stock: 15, image: '/images/product-5.jpg' },
  { id: 'piringan-cakram-220mm', sku: 'SN-PR-002', name: 'Piringan Cakram 220 mm', category: 'Pengereman', price: 185000, stock: 4, image: '/images/product-6.jpg' },
  { id: 'kiprok-regulator-4-pin', sku: 'SN-KL-001', name: 'Kiprok Regulator 4 Pin', category: 'Kelistrikan', price: 78000, stock: 12, image: '/images/product-7.jpg' },
  { id: 'handgrip-karet-sport', sku: 'SN-AK-002', name: 'Handgrip Karet Sport', category: 'Aksesori motor', price: 65000, stock: 28, image: '/images/product-8.jpg' },
];

export const CATEGORIES = ['Lampu dan sein', 'Pengereman', 'Kelistrikan', 'Aksesori motor', 'Mesin dan komponen'];

// Format VA sama dengan di toko: 16 digit = kode perusahaan bank + nomor unik.
export const VA_BANKS = {
  BCA: '80777',
  BNI: '8808',
  Mandiri: '88908',
};

export function stockStatus(stock) {
  if (stock <= 0) return 'habis';
  if (stock <= 5) return 'terbatas';
  return 'tersedia';
}

export function formatRupiah(n) {
  return 'Rp' + Number(n || 0).toLocaleString('id-ID');
}

export function formatVA(number) {
  return String(number).replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function nowLabel() {
  const d = new Date();
  const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const pad = (v) => String(v).padStart(2, '0');
  return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()} • ${pad(d.getHours())}.${pad(d.getMinutes())} WIB`;
}

const ADDR = {
  'Depok': 'Jl. Melati No. 24, RT 03/RW 05, Sukamaju, Cilodong, Kota Depok, Jawa Barat 16415',
  'Bekasi': 'Jl. Kenanga Raya No. 11, Bekasi Timur, Kota Bekasi, Jawa Barat 17113',
  'Bogor': 'Jl. Pajajaran Indah No. 8, Bogor Tengah, Kota Bogor, Jawa Barat 16143',
  'Jakarta Selatan': 'Jl. Cipete Raya No. 35, Cilandak, Jakarta Selatan, DKI Jakarta 12410',
  'Tangerang': 'Jl. Ciledug Raya No. 90, Karang Tengah, Kota Tangerang, Banten 15157',
  'Bandung': 'Jl. Cihampelas No. 120, Coblong, Kota Bandung, Jawa Barat 40131',
  'Semarang': 'Jl. Pandanaran No. 52, Semarang Tengah, Kota Semarang, Jawa Tengah 50134',
  'Surabaya': 'Jl. Darmo Permai No. 17, Sukomanunggal, Kota Surabaya, Jawa Timur 60187',
  'Yogyakarta': 'Jl. Kaliurang Km 5 No. 9, Depok, Sleman, DI Yogyakarta 55281',
};

function mk(num, time, name, city, items, stage, pay, extra = {}) {
  return {
    id: `SK-261031-${num}`,
    createdAt: `31 Okt 2026 • ${time} WIB`,
    customer: name,
    city,
    email: name.toLowerCase().replace(/[^a-z]+/g, '.') + '@example.com',
    phone: '0812 3456 ' + (7000 + (Number(num) % 1000)),
    address: ADDR[city],
    note: '',
    items,
    shippingCost: 18000,
    courier: 'JNE Reguler',
    stage,
    resi: stage === 'dikirim' ? 'DEMO26103' + num : '',
    estimatedArrival: '3–4 Nov 2026',
    payment: pay,
    ...extra,
  };
}

const pay = (status, bank, va, paidAt, confirmedAt = '') => ({ status, bank, va, paidAt, confirmedAt, note: '' });

// Pesanan 0183, 0181, 0177 menunggu konfirmasi admin; sisanya sudah lunas.
export const INITIAL_ORDERS = [
  mk('0184', '10.24', 'Aditya Pratama', 'Depok', [{ productId: 'kampas-rem-cakram', qty: 2 }, { productId: 'spion-bar-end-cnc', qty: 1 }, { productId: 'busi-iridium-performance', qty: 1 }], 'dibuat',
    pay('lunas', 'BCA', '8077708123457890', '31 Okt 2026 • 10.25 WIB', '31 Okt 2026 • 10.31 WIB'),
    { note: 'Pagar hitam, rumah di sebelah bengkel.' }),
  mk('0183', '10.08', 'Nadia Putri', 'Bekasi', [{ productId: 'spion-bar-end-cnc', qty: 1 }], 'dibuat',
    pay('menunggu', 'BNI', '8808471580114748', '31 Okt 2026 • 10.09 WIB')),
  mk('0182', '09.46', 'Rizky Ramadhan', 'Bogor', [{ productId: 'kampas-rem-cakram', qty: 2 }, { productId: 'busi-iridium-performance', qty: 1 }], 'diproses',
    pay('lunas', 'Mandiri', '8890829084886019', '31 Okt 2026 • 09.47 WIB', '31 Okt 2026 • 09.52 WIB')),
  mk('0181', '09.21', 'Dewi Lestari', 'Jakarta Selatan', [{ productId: 'kampas-rem-cakram', qty: 2 }], 'dibuat',
    pay('menunggu', 'Mandiri', '8890836215049273', '31 Okt 2026 • 09.22 WIB')),
  mk('0180', '08.55', 'Fajar Nugraha', 'Tangerang', [{ productId: 'spion-bar-end-cnc', qty: 1 }, { productId: 'busi-iridium-performance', qty: 1 }], 'diproses',
    pay('lunas', 'BCA', '8077731846209315', '31 Okt 2026 • 08.56 WIB', '31 Okt 2026 • 09.03 WIB')),
  mk('0179', '16.42', 'Sinta Maharani', 'Bandung', [{ productId: 'busi-iridium-performance', qty: 1 }], 'dikirim',
    pay('lunas', 'BNI', '8808529047316682', '30 Okt 2026 • 16.43 WIB', '30 Okt 2026 • 16.50 WIB'), { createdAt: '30 Okt 2026 • 16.42 WIB' }),
  mk('0178', '15.18', 'Bagas Saputra', 'Depok', [{ productId: 'handgrip-karet-sport', qty: 1 }, { productId: 'kiprok-regulator-4-pin', qty: 1 }], 'diproses',
    pay('lunas', 'BCA', '8077794012685537', '30 Okt 2026 • 15.19 WIB', '30 Okt 2026 • 15.24 WIB'), { createdAt: '30 Okt 2026 • 15.18 WIB' }),
  mk('0177', '13.30', 'Aulia Rahma', 'Bekasi', [{ productId: 'handgrip-karet-sport', qty: 1 }], 'dibuat',
    pay('menunggu', 'BCA', '8077750386124409', '30 Okt 2026 • 13.31 WIB'), { createdAt: '30 Okt 2026 • 13.30 WIB' }),
  mk('0176', '11.06', 'Dimas Setiawan', 'Semarang', [{ productId: 'kampas-rem-cakram', qty: 2 }, { productId: 'lampu-led-headlight-h4', qty: 1 }], 'dikirim',
    pay('lunas', 'Mandiri', '8890817359240861', '30 Okt 2026 • 11.07 WIB', '30 Okt 2026 • 11.12 WIB'), { createdAt: '30 Okt 2026 • 11.06 WIB' }),
  mk('0175', '16.10', 'Ratna Puspita', 'Surabaya', [{ productId: 'sein-led-sequential', qty: 2 }], 'dikirim',
    pay('lunas', 'BNI', '8808463829105574', '29 Okt 2026 • 16.11 WIB', '29 Okt 2026 • 16.18 WIB'), { createdAt: '29 Okt 2026 • 16.10 WIB' }),
  mk('0174', '14.32', 'Arif Wibowo', 'Bogor', [{ productId: 'kiprok-regulator-4-pin', qty: 1 }, { productId: 'busi-iridium-performance', qty: 1 }], 'diproses',
    pay('lunas', 'BCA', '8077706543298123', '29 Okt 2026 • 14.33 WIB', '29 Okt 2026 • 14.40 WIB'), { createdAt: '29 Okt 2026 • 14.32 WIB' }),
  mk('0173', '09.15', 'Maya Anggraini', 'Yogyakarta', [{ productId: 'lampu-led-headlight-h4', qty: 1 }], 'dikirim',
    pay('lunas', 'Mandiri', '8890825047193368', '29 Okt 2026 • 09.16 WIB', '29 Okt 2026 • 09.21 WIB'), { createdAt: '29 Okt 2026 • 09.15 WIB' }),
];

export function orderSubtotal(order) {
  return order.items.reduce((sum, it) => {
    const p = PRODUCTS.find((x) => x.id === it.productId);
    return sum + (p ? p.price * it.qty : 0);
  }, 0);
}

export function orderTotal(order) {
  return orderSubtotal(order) + order.shippingCost;
}

export function orderItemCount(order) {
  return order.items.reduce((s, i) => s + i.qty, 0);
}
