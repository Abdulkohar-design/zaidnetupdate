-- SQL Script untuk menambahkan kolom paymentMethod ke tabel customer_bills dan tabel tagihan lainnya
-- Jalankan script ini di Supabase SQL Editor

-- 1. Tambahkan kolom paymentMethod ke tabel customer_bills
ALTER TABLE customer_bills ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT DEFAULT 'cash';

-- 2. Tambahkan kolom yang sama ke semua tabel tagihan wilayah
ALTER TABLE tagihan_adede ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT DEFAULT 'cash';
ALTER TABLE tagihan_basit ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT DEFAULT 'cash';
ALTER TABLE tagihan_bodong ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT DEFAULT 'cash';
ALTER TABLE tagihan_datuk ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT DEFAULT 'cash';
ALTER TABLE tagihan_juig_karang ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT DEFAULT 'cash';
ALTER TABLE tagihan_juig_leuwisari ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT DEFAULT 'cash';
ALTER TABLE tagihan_juig_simpang ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT DEFAULT 'cash';
ALTER TABLE tagihan_jumbo ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT DEFAULT 'cash';
ALTER TABLE tagihan_leuwilisung ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT DEFAULT 'cash';
ALTER TABLE tagihan_novi_cisela ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT DEFAULT 'cash';
ALTER TABLE tagihan_rompang ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT DEFAULT 'cash';
ALTER TABLE tagihan_yeyen ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT DEFAULT 'cash';
ALTER TABLE tagihan_yono ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT DEFAULT 'cash';
ALTER TABLE tagihan_nia ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT DEFAULT 'cash';
ALTER TABLE tagihan_rompang_sarakan ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT DEFAULT 'cash';
