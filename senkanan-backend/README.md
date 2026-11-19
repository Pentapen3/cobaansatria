# SENkanan Backend API (Node.js + Express + MySQL)

Backend REST API ini dibuat khusus agar terhubung langsung dengan struktur frontend **SENkanan** (`App.jsx`) dan database MySQL (`senkanan`).

## Struktur Folder
```
senkanan-backend/
├── sql/
│   └── senkanan_full.sql      # Schema lengkap + data awal 8 produk, kategori, alamat & keranjang
├── src/
│   ├── config/
│   │   └── db.js              # Koneksi MySQL Pool (mysql2/promise)
│   ├── routes/
│   │   ├── products.js        # GET /api/products, /api/products/categories, /api/products/:id
│   │   ├── cart.js            # CRUD /api/cart
│   │   ├── wishlist.js        # GET & POST /api/wishlist/toggle
│   │   ├── profile.js         # GET & PUT /api/profile/motor & /api/profile/address
│   │   └── orders.js          # GET, POST (Checkout), & PATCH stage /api/orders
│   └── server.js              # Entry point Express server
├── .env                       # Konfigurasi koneksi MySQL & Port
├── .env.example
└── package.json
```

## Cara Menjalankan Backend

1. **Import Database MySQL**
   - Buka phpMyAdmin (XAMPP) atau MySQL CLI.
   - Import file `sql/senkanan_full.sql` (atau pastikan database `senkanan` sudah tersedia).

2. **Sesuaikan `.env` (jika perlu)**
   - Default konfigurasi menggunakan `DB_HOST=localhost`, `DB_USER=root`, `DB_PASSWORD=` (kosong), `DB_NAME=senkanan`, dan `PORT=5000`.

3. **Install Dependencies & Jalankan Server**
   ```bash
   npm install
   npm run dev
   ```
   Server akan berjalan di `http://localhost:5000`. Cek `http://localhost:5000/api/health` untuk memastikan server & database terhubung.

## Menghubungkan ke Frontend (`belajarsen`)

1. Tambahkan proxy di `vite.config.js` pada folder frontend Anda:
   ```js
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';

   export default defineConfig({
     plugins: [react()],
     server: {
       proxy: {
         '/api': 'http://localhost:5000',
       },
     },
   });
   ```

2. Di `src/App.jsx`, ganti data statis awal dengan pemanggilan API saat aplikasi dimuat:
   - `GET /api/products` -> mengisi state produk katalog
   - `GET /api/cart` & `POST /api/cart` -> sinkronisasi keranjang belanja ke MySQL
   - `PUT /api/profile/motor` -> menyimpan data **Motor Saya** ke MySQL
   - `PUT /api/profile/address` -> menyimpan **Alamat Pengiriman** ke MySQL
   - `POST /api/orders` -> menyimpan transaksi saat tombol **Bayar Sekarang** ditekan
