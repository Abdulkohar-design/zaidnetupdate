-- SQL Script untuk fitur tambahan (Paket Internet, History, Bukti Transfer)

-- 1. Tabel Paket Internet (jika belum ada)
CREATE TABLE IF NOT EXISTS internet_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  speed TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default packages jika kosong
INSERT INTO internet_packages (name, speed, price, description)
SELECT 'Paket Basic', '10 Mbps', 150000, 'Paket internet basic untuk kebutuhan dasar'
WHERE NOT EXISTS (SELECT 1 FROM internet_packages);

INSERT INTO internet_packages (name, speed, price, description)
SELECT 'Paket Premium', '20 Mbps', 250000, 'Paket internet premium untuk kebutuhan berat'
WHERE NOT EXISTS (SELECT 1 FROM internet_packages WHERE name = 'Paket Premium');

INSERT INTO internet_packages (name, speed, price, description)
SELECT 'Paket Ultra', '50 Mbps', 450000, 'Paket internet ultra cepat'
WHERE NOT EXISTS (SELECT 1 FROM internet_packages WHERE name = 'Paket Ultra');


-- 2. Tabel Riwayat Pembayaran (Payment History)
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID, -- Referensi ke ID pelanggan di tabel masing-masing (karena tabel dipisah per wilayah, ini loose reference)
  customer_name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT DEFAULT 'cash', -- 'cash' or 'transfer'
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  proof_url TEXT, -- URL bukti transfer
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tambahkan kolom bukti transfer ke tabel customer_bills dan tabel wilayah lainnya
ALTER TABLE customer_bills ADD COLUMN IF NOT EXISTS proof_url TEXT;

-- Loop untuk tabel wilayah (manual karena SQL standar tidak support loop dynamic table alter dengan mudah di script sederhana)
ALTER TABLE tagihan_adede ADD COLUMN IF NOT EXISTS proof_url TEXT;
ALTER TABLE tagihan_basit ADD COLUMN IF NOT EXISTS proof_url TEXT;
ALTER TABLE tagihan_bodong ADD COLUMN IF NOT EXISTS proof_url TEXT;
ALTER TABLE tagihan_datuk ADD COLUMN IF NOT EXISTS proof_url TEXT;
ALTER TABLE tagihan_juig_karang ADD COLUMN IF NOT EXISTS proof_url TEXT;
ALTER TABLE tagihan_juig_leuwisari ADD COLUMN IF NOT EXISTS proof_url TEXT;
ALTER TABLE tagihan_juig_simpang ADD COLUMN IF NOT EXISTS proof_url TEXT;
ALTER TABLE tagihan_jumbo ADD COLUMN IF NOT EXISTS proof_url TEXT;
ALTER TABLE tagihan_leuwilisung ADD COLUMN IF NOT EXISTS proof_url TEXT;
ALTER TABLE tagihan_novi_cisela ADD COLUMN IF NOT EXISTS proof_url TEXT;
ALTER TABLE tagihan_rompang ADD COLUMN IF NOT EXISTS proof_url TEXT;
ALTER TABLE tagihan_yeyen ADD COLUMN IF NOT EXISTS proof_url TEXT;
ALTER TABLE tagihan_yono ADD COLUMN IF NOT EXISTS proof_url TEXT;
ALTER TABLE tagihan_nia ADD COLUMN IF NOT EXISTS proof_url TEXT;
ALTER TABLE tagihan_rompang_sarakan ADD COLUMN IF NOT EXISTS proof_url TEXT;
