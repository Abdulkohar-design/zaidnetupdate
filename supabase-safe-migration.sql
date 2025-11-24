-- SAFE MIGRATION: Tambah kolom baru tanpa mengubah data existing
-- Script ini aman untuk production - tidak akan menghapus atau mengubah data yang sudah ada

-- ===============================================
-- STEP 1: Backup data existing (optional tapi recommended)
-- ===============================================
-- Uncomment jika ingin backup dulu:
-- CREATE TABLE customer_bills_backup AS SELECT * FROM customer_bills;

-- ===============================================
-- STEP 2: Tambah kolom baru dengan DEFAULT NULL
-- ===============================================

-- Tambah kolom baru ke customer_bills
ALTER TABLE customer_bills 
ADD COLUMN IF NOT EXISTS phone_number TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS package_name TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT NULL;

-- Untuk semua tabel tagihan wilayah (hanya yang ada)
-- Periksa dulu tabel mana yang ada di database Anda

-- Jika tabel tagihan_adede ada:
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tagihan_adede') THEN
        ALTER TABLE tagihan_adede 
        ADD COLUMN IF NOT EXISTS phone_number TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS package_name TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT NULL;
    END IF;
END $$;

-- Jika tabel tagihan_basit ada:
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tagihan_basit') THEN
        ALTER TABLE tagihan_basit 
        ADD COLUMN IF NOT EXISTS phone_number TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS package_name TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT NULL;
    END IF;
END $$;

-- Jika tabel tagihan_bodong ada:
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tagihan_bodong') THEN
        ALTER TABLE tagihan_bodong 
        ADD COLUMN IF NOT EXISTS phone_number TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS package_name TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT NULL;
    END IF;
END $$;

-- Jika tabel tagihan_datuk ada:
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tagihan_datuk') THEN
        ALTER TABLE tagihan_datuk 
        ADD COLUMN IF NOT EXISTS phone_number TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS package_name TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT NULL;
    END IF;
END $$;

-- Jika tabel tagihan_juig_karang ada:
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tagihan_juig_karang') THEN
        ALTER TABLE tagihan_juig_karang 
        ADD COLUMN IF NOT EXISTS phone_number TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS package_name TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT NULL;
    END IF;
END $$;

-- Jika tabel tagihan_juig_leuwisari ada:
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tagihan_juig_leuwisari') THEN
        ALTER TABLE tagihan_juig_leuwisari 
        ADD COLUMN IF NOT EXISTS phone_number TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS package_name TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT NULL;
    END IF;
END $$;

-- Jika tabel tagihan_juig_simpang ada:
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tagihan_juig_simpang') THEN
        ALTER TABLE tagihan_juig_simpang 
        ADD COLUMN IF NOT EXISTS phone_number TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS package_name TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT NULL;
    END IF;
END $$;

-- Jika tabel tagihan_jumbo ada:
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tagihan_jumbo') THEN
        ALTER TABLE tagihan_jumbo 
        ADD COLUMN IF NOT EXISTS phone_number TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS package_name TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT NULL;
    END IF;
END $$;

-- Jika tabel tagihan_leuwilisung ada:
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tagihan_leuwilisung') THEN
        ALTER TABLE tagihan_leuwilisung 
        ADD COLUMN IF NOT EXISTS phone_number TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS package_name TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT NULL;
    END IF;
END $$;

-- Jika tabel tagihan_novi_cisela ada:
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tagihan_novi_cisela') THEN
        ALTER TABLE tagihan_novi_cisela 
        ADD COLUMN IF NOT EXISTS phone_number TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS package_name TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT NULL;
    END IF;
END $$;

-- Jika tabel tagihan_rompang ada:
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tagihan_rompang') THEN
        ALTER TABLE tagihan_rompang 
        ADD COLUMN IF NOT EXISTS phone_number TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS package_name TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT NULL;
    END IF;
END $$;

-- Jika tabel tagihan_yeyen ada:
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tagihan_yeyen') THEN
        ALTER TABLE tagihan_yeyen 
        ADD COLUMN IF NOT EXISTS phone_number TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS package_name TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT NULL;
    END IF;
END $$;

-- Jika tabel tagihan_yono ada:
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tagihan_yono') THEN
        ALTER TABLE tagihan_yono 
        ADD COLUMN IF NOT EXISTS phone_number TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS package_name TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT NULL;
    END IF;
END $$;

-- Jika tabel tagihan_nia ada:
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tagihan_nia') THEN
        ALTER TABLE tagihan_nia
        ADD COLUMN IF NOT EXISTS phone_number TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS package_name TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT NULL;
    END IF;
END $$;

-- Jika tabel tagihan_rompang_sarakan ada:
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tagihan_rompang_sarakan') THEN
        ALTER TABLE tagihan_rompang_sarakan 
        ADD COLUMN IF NOT EXISTS phone_number TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS package_name TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT NULL;
    END IF;
END $$;

-- ===============================================
-- STEP 3: Tambah index untuk performance
-- ===============================================

-- Index untuk pencarian berdasarkan nomor HP
CREATE INDEX IF NOT EXISTS idx_customer_bills_phone ON customer_bills (phone_number);

-- Index untuk pencarian berdasarkan lokasi GPS  
CREATE INDEX IF NOT EXISTS idx_customer_bills_location ON customer_bills (latitude, longitude);

-- Index untuk pencarian berdasarkan paket
CREATE INDEX IF NOT EXISTS idx_customer_bills_package ON customer_bills (package_name);

-- ===============================================
-- STEP 4: Buat tabel paket internet (optional)
-- ===============================================

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

-- Insert paket default hanya jika tabel kosong
INSERT INTO internet_packages (name, speed, price, description) 
SELECT 'Paket Basic', '10 Mbps', 150000, 'Paket internet basic untuk kebutuhan dasar'
WHERE NOT EXISTS (SELECT 1 FROM internet_packages WHERE name = 'Paket Basic');

INSERT INTO internet_packages (name, speed, price, description) 
SELECT 'Paket Premium', '20 Mbps', 250000, 'Paket internet premium untuk kebutuhan berat'
WHERE NOT EXISTS (SELECT 1 FROM internet_packages WHERE name = 'Paket Premium');

INSERT INTO internet_packages (name, speed, price, description) 
SELECT 'Paket Ultra', '50 Mbps', 450000, 'Paket internet ultra cepat'
WHERE NOT EXISTS (SELECT 1 FROM internet_packages WHERE name = 'Paket Ultra');

-- ===============================================
-- STEP 5: Verifikasi hasil migration
-- ===============================================

-- Cek kolom yang berhasil ditambahkan
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'customer_bills' 
AND column_name IN ('phone_number', 'address', 'package_name', 'latitude', 'longitude', 'photo_url')
ORDER BY table_name, column_name;

-- Cek jumlah data existing (harusnya tetap sama)
SELECT 
    'customer_bills' as table_name,
    COUNT(*) as total_records
FROM customer_bills;

-- ===============================================
-- SELESAI!
-- ===============================================
-- Data existing tetap aman
-- Kolom baru akan bernilai NULL untuk data lama
-- Data baru akan menggunakan kolom baru
-- Aplikasi akan tetap berfungsi untuk data lama dan baru

