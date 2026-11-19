-- Database Schema & Initial Data untuk SENkanan
CREATE DATABASE IF NOT EXISTS senkanan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE senkanan;

-- 1. Tabel Kategori
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255),
  featured BOOLEAN DEFAULT FALSE,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Produk Sparepart
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(100) PRIMARY KEY,
  tag VARCHAR(100) NULL,
  category VARCHAR(100) NOT NULL,
  title VARCHAR(150) NOT NULL,
  spec VARCHAR(150),
  price INT NOT NULL,
  stock INT NOT NULL DEFAULT 25,
  stock_status ENUM('tersedia', 'terbatas', 'habis') DEFAULT 'tersedia',
  stock_label VARCHAR(50) DEFAULT 'Stok tersedia',
  compatibility TEXT,
  description TEXT,
  image VARCHAR(255),
  art_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Profil Motor Saya (Garasi User)
CREATE TABLE IF NOT EXISTS user_motors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL DEFAULT 'guest-default',
  owner_name VARCHAR(100),
  brand VARCHAR(100) NOT NULL,
  model_year VARCHAR(120) NOT NULL,
  plate_number VARCHAR(30),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_session_motor (session_id)
);

-- 4. Tabel Alamat Pengiriman
CREATE TABLE IF NOT EXISTS user_addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL DEFAULT 'guest-default',
  recipient VARCHAR(120) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(120),
  label VARCHAR(80) DEFAULT 'Rumah • Utama',
  street TEXT NOT NULL,
  note TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_session_address (session_id)
);

-- 5. Tabel Keranjang Belanja (Cart Items)
CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL DEFAULT 'guest-default',
  product_id VARCHAR(100) NOT NULL,
  qty INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_session_product (session_id, product_id),
  CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 6. Tabel Wishlist
CREATE TABLE IF NOT EXISTS wishlists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL DEFAULT 'guest-default',
  product_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_session_wish (session_id, product_id),
  CONSTRAINT fk_wish_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 7. Tabel Pesanan (Orders)
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(40) PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL DEFAULT 'guest-default',
  stage ENUM('dibuat', 'diproses', 'dikirim', 'selesai', 'dibatalkan') DEFAULT 'dibuat',
  courier VARCHAR(80) NOT NULL,
  tracking_number VARCHAR(80),
  estimated_arrival VARCHAR(80),
  subtotal INT NOT NULL,
  shipping_cost INT NOT NULL DEFAULT 0,
  insurance_cost INT NOT NULL DEFAULT 0,
  service_fee INT NOT NULL DEFAULT 0,
  total_amount INT NOT NULL,
  payment_method VARCHAR(100),
  payment_type VARCHAR(30),
  va_number VARCHAR(50) NULL,
  payment_status ENUM('menunggu', 'lunas', 'ditolak') DEFAULT 'menunggu',
  payment_note TEXT NULL,
  confirmed_at VARCHAR(80) NULL,
  paid_at VARCHAR(80),
  recipient_name VARCHAR(120),
  recipient_phone VARCHAR(30),
  recipient_email VARCHAR(120),
  shipping_label VARCHAR(80),
  shipping_street TEXT,
  shipping_note TEXT,
  order_note TEXT,
  created_at_label VARCHAR(80),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 8. Tabel Detail Item Pesanan (Order Items)
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(40) NOT NULL,
  product_id VARCHAR(100) NOT NULL,
  product_title VARCHAR(150) NOT NULL,
  price INT NOT NULL,
  qty INT NOT NULL,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Seed Data Kategori
INSERT IGNORE INTO categories (name, description, featured, icon) VALUES
('Lampu dan sein', 'Terang & lebih terlihat', TRUE, 'bulb'),
('Pengereman', 'Kontrol di setiap jalan', FALSE, 'brake'),
('Kelistrikan', 'Daya untuk perjalanan', FALSE, 'battery'),
('Aksesori motor', 'Detail sesuai gayamu', FALSE, 'handlebar'),
('Mesin dan komponen', 'Jaga performa motor', FALSE, 'gear');

-- Seed Data 8 Produk Frontend
INSERT IGNORE INTO products (id, tag, category, title, spec, price, stock, stock_status, stock_label, compatibility, description, image, art_type) VALUES
('sein-led-sequential', 'PILIHAN SENKANAN', 'Lampu dan sein', 'Sein LED Sequential Mini', 'Universal • Sepasang • 12V', 85000, 30, 'tersedia', 'Stok tersedia', 'Cocok untuk motor matic, bebek, dan sport dengan dudukan baut sein standar M10.', 'Lampu sein LED model running sequential dengan cahaya amber terang agar sinyal belok lebih mudah terlihat siang maupun malam.', '/images/product-1.jpg', 'sein'),
('kampas-rem-cakram', NULL, 'Pengereman', 'Kampas Rem Cakram Depan', 'Vario 125/150 • Set depan', 45000, 40, 'tersedia', 'Stok tersedia', 'Vario 125, Vario 150, Beat FI, Scoopy, dan kaliper depan 1 piston sejenis.', 'Kampas rem cakram depan dengan daya cengkeram stabil untuk penggunaan harian dalam kota maupun perjalanan jauh.', '/images/product-2.jpg', 'kampas'),
('spion-bar-end-cnc', 'FAVORIT UPGRADE', 'Aksesori motor', 'Spion Bar End CNC', 'Universal • Sepasang • Hitam', 175000, 20, 'tersedia', 'Stok tersedia', 'Stang berlubang diameter dalam 13-18 mm (matic, naked, retro, dan sport).', 'Spion ujung stang berbahan aluminium CNC hitam matte dengan kaca cembung anti-silau untuk tampilan rapi dan visibilitas luas.', '/images/product-3.jpg', 'spion'),
('busi-iridium-performance', NULL, 'Mesin dan komponen', 'Busi Iridium Performance', 'Matic 110-150cc • 1 buah', 95000, 35, 'tersedia', 'Stok tersedia', 'Motor matic 110cc hingga 150cc (Vario, Beat, NMAX, Aerox, PCX, Mio).', 'Elektroda iridium ujung halus membantu pembakaran lebih fokus, tarikan awal responsif, dan umur pakai lebih panjang.', '/images/product-4.jpg', 'busi'),
('lampu-led-headlight-h4', NULL, 'Lampu dan sein', 'Lampu LED Headlight H4', 'Soket H4 • Putih • 12V', 125000, 25, 'tersedia', 'Stok tersedia', 'Motor dengan reflektor utama soket H4 (Vixion, CB150R, Verza, Scoopy karbu, Vespa).', 'Lampu utama LED soket H4 dilengkapi kipas pendingin aluminium dan cut-off cahaya rapi agar tidak menyilaukan pengendara lawan arah.', '/images/product-5.jpg', 'headlight'),
('piringan-cakram-220mm', NULL, 'Pengereman', 'Piringan Cakram 220 mm', 'Vario 125/150 • Stainless', 185000, 6, 'terbatas', 'Stok terbatas', 'Vario 125/150 lubang baut 4 (pemasangan plug and play ukuran standar 220 mm).', 'Rotor cakram floating look berbahan baja tahan karat dengan lubang ventilasi untuk pelepasan panas optimal saat pengereman berulang.', '/images/product-6.jpg', 'cakram'),
('kiprok-regulator-4-pin', NULL, 'Kelistrikan', 'Kiprok Regulator 4 Pin', 'Bebek / matic • 12V', 78000, 22, 'tersedia', 'Stok tersedia', 'Sistem kelistrikan DC/AC 12V soket 4 pin pada motor bebek dan matic harian.', 'Regulator rectifier dengan sirip pendingin tebal untuk menjaga tegangan pengisian aki tetap stabil dan mencegah lampu putus.', '/images/product-7.jpg', 'kiprok'),
('handgrip-karet-sport', NULL, 'Aksesori motor', 'Handgrip Karet Sport', 'Universal • Sepasang • Hitam', 65000, 28, 'tersedia', 'Stok tersedia', 'Semua stang motor ukuran standar 22 mm (kanan selongsong gas, kiri stang).', 'Handgrip tekstur diamond anti-slip dengan cincin ujung aluminium anodized emas untuk genggaman mantap saat hujan maupun panas.', '/images/product-8.jpg', 'handgrip');

-- Seed Alamat Default
INSERT IGNORE INTO user_addresses (session_id, recipient, phone, email, label, street, note) VALUES
('guest-default', 'Aditya Pratama', '0812 3456 7890', 'aditya.pratama@example.com', 'Rumah • Utama', 'Jl. Melati No. 24, RT 03/RW 05, Sukamaju, Cilodong, Kota Depok, Jawa Barat 16415', 'Pagar hitam, rumah di sebelah bengkel.');

-- Seed Cart Default
INSERT IGNORE INTO cart_items (session_id, product_id, qty) VALUES
('guest-default', 'kampas-rem-cakram', 2),
('guest-default', 'spion-bar-end-cnc', 1),
('guest-default', 'busi-iridium-performance', 1);

-- Seed Wishlist Default
INSERT IGNORE INTO wishlists (session_id, product_id) VALUES
('guest-default', 'sein-led-sequential');
