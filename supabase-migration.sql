-- SQL Script untuk menambahkan kolom baru ke tabel customer_bills dan tabel tagihan lainnya
-- Jalankan script ini di Supabase SQL Editor

-- 1. Tambahkan kolom baru ke tabel customer_bills
ALTER TABLE customer_bills ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE customer_bills ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE customer_bills ADD COLUMN IF NOT EXISTS package_name TEXT;
ALTER TABLE customer_bills ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE customer_bills ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE customer_bills ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- 2. Tambahkan kolom yang sama ke semua tabel tagihan wilayah
-- Daftar tabel yang perlu diupdate:
ALTER TABLE tagihan_adede ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE tagihan_adede ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE tagihan_adede ADD COLUMN IF NOT EXISTS package_name TEXT;
ALTER TABLE tagihan_adede ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE tagihan_adede ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE tagihan_adede ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE tagihan_basit ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE tagihan_basit ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE tagihan_basit ADD COLUMN IF NOT EXISTS package_name TEXT;
ALTER TABLE tagihan_basit ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE tagihan_basit ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE tagihan_basit ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE tagihan_bodong ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE tagihan_bodong ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE tagihan_bodong ADD COLUMN IF NOT EXISTS package_name TEXT;
ALTER TABLE tagihan_bodong ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE tagihan_bodong ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE tagihan_bodong ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE tagihan_datuk ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE tagihan_datuk ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE tagihan_datuk ADD COLUMN IF NOT EXISTS package_name TEXT;
ALTER TABLE tagihan_datuk ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE tagihan_datuk ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE tagihan_datuk ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE tagihan_juig_karang ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE tagihan_juig_karang ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE tagihan_juig_karang ADD COLUMN IF NOT EXISTS package_name TEXT;
ALTER TABLE tagihan_juig_karang ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE tagihan_juig_karang ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE tagihan_juig_karang ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE tagihan_juig_leuwisari ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE tagihan_juig_leuwisari ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE tagihan_juig_leuwisari ADD COLUMN IF NOT EXISTS package_name TEXT;
ALTER TABLE tagihan_juig_leuwisari ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE tagihan_juig_leuwisari ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE tagihan_juig_leuwisari ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE tagihan_juig_simpang ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE tagihan_juig_simpang ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE tagihan_juig_simpang ADD COLUMN IF NOT EXISTS package_name TEXT;
ALTER TABLE tagihan_juig_simpang ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE tagihan_juig_simpang ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE tagihan_juig_simpang ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE tagihan_jumbo ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE tagihan_jumbo ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE tagihan_jumbo ADD COLUMN IF NOT EXISTS package_name TEXT;
ALTER TABLE tagihan_jumbo ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE tagihan_jumbo ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE tagihan_jumbo ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE tagihan_leuwilisung ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE tagihan_leuwilisung ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE tagihan_leuwilisung ADD COLUMN IF NOT EXISTS package_name TEXT;
ALTER TABLE tagihan_leuwilisung ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE tagihan_leuwilisung ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE tagihan_leuwilisung ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE tagihan_novi_cisela ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE tagihan_novi_cisela ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE tagihan_novi_cisela ADD COLUMN IF NOT EXISTS package_name TEXT;
ALTER TABLE tagihan_novi_cisela ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE tagihan_novi_cisela ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE tagihan_novi_cisela ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE tagihan_rompang ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE tagihan_rompang ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE tagihan_rompang ADD COLUMN IF NOT EXISTS package_name TEXT;
ALTER TABLE tagihan_rompang ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE tagihan_rompang ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE tagihan_rompang ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE tagihan_yeyen ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE tagihan_yeyen ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE tagihan_yeyen ADD COLUMN IF NOT EXISTS package_name TEXT;
ALTER TABLE tagihan_yeyen ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE tagihan_yeyen ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE tagihan_yeyen ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE tagihan_yono ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE tagihan_yono ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE tagihan_yono ADD COLUMN IF NOT EXISTS package_name TEXT;
ALTER TABLE tagihan_yono ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE tagihan_yono ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE tagihan_yono ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE tagihan_nia ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE tagihan_nia ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE tagihan_nia ADD COLUMN IF NOT EXISTS package_name TEXT;
ALTER TABLE tagihan_nia ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE tagihan_nia ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE tagihan_nia ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE tagihan_rompang_sarakan ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE tagihan_rompang_sarakan ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE tagihan_rompang_sarakan ADD COLUMN IF NOT EXISTS package_name TEXT;
ALTER TABLE tagihan_rompang_sarakan ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE tagihan_rompang_sarakan ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE tagihan_rompang_sarakan ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- 3. Tambahkan index untuk performance query lokasi
CREATE INDEX IF NOT EXISTS idx_customer_bills_location ON customer_bills (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_customer_bills_phone ON customer_bills (phone_number);

-- 4. Buat tabel untuk menyimpan paket internet (opsional)
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

-- 5. Insert beberapa paket default
INSERT INTO internet_packages (name, speed, price, description) VALUES
('Paket Basic', '10 Mbps', 150000, 'Paket internet basic untuk kebutuhan dasar'),
('Paket Premium', '20 Mbps', 250000, 'Paket internet premium untuk kebutuhan berat'),
('Paket Ultra', '50 Mbps', 450000, 'Paket internet ultra cepat')
ON CONFLICT DO NOTHING;

-- 6. Tambahkan RLS (Row Level Security) policies jika diperlukan
-- ALTER TABLE customer_bills ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view own data" ON customer_bills FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY "Users can insert own data" ON customer_bills FOR INSERT WITH CHECK (auth.uid() = user_id);
-- CREATE POLICY "Users can update own data" ON customer_bills FOR UPDATE USING (auth.uid() = user_id);
-- CREATE POLICY "Users can delete own data" ON customer_bills FOR DELETE USING (auth.uid() = user_id);

