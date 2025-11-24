# Setup Supabase untuk ZaidNet WiFi Billing

## 🔧 Langkah-langkah Koneksi ke Supabase

### 1. Jalankan Migration Database
Buka **Supabase Dashboard** → **SQL Editor** → Paste dan jalankan script dari file `supabase-migration.sql`

Script ini akan menambahkan kolom baru:
- `phone_number` - Nomor WhatsApp pelanggan
- `address` - Alamat lengkap pelanggan  
- `package_name` - Nama paket internet
- `latitude` - Koordinat GPS latitude
- `longitude` - Koordinat GPS longitude
- `photo_url` - URL foto rumah pelanggan

### 2. Verifikasi Koneksi Database
Aplikasi sudah dikonfigurasi untuk terhubung ke:
- **URL**: `https://esfqsxzumeoheaxuijia.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Struktur Tabel yang Didukung
Aplikasi mendukung multiple tabel untuk pembagian wilayah:
- `customer_bills` (tabel utama)
- `tagihan_adede`
- `tagihan_basit`
- `tagihan_bodong`
- `tagihan_datuk`
- `tagihan_juig_karang`
- `tagihan_juig_leuwisari`
- `tagihan_juig_simpang`
- `tagihan_jumbo`
- `tagihan_leuwilisung`
- `tagihan_novi_cisela`
- `tagihan_rompang`
- `tagihan_yeyen`
- `tagihan_yono`
- `tagihan_nia`
- `tagihan_rompang_sarakan`

### 4. Field Mapping Database ke Aplikasi

| Database Column | App Field | Type | Description |
|-----------------|-----------|------|-------------|
| `id` | `id` | UUID | Primary key |
| `name` | `name` | String | Nama pelanggan |
| `amount` | `amount` | Number | Nominal tagihan |
| `status` | `status` | String | 'paid' atau 'pending' |
| `notes` | `notes` | String | Catatan |
| `created_at` | `createdAt` | Date | Tanggal dibuat |
| `due_date` | `dueDate` | Date | Tanggal jatuh tempo |
| `phone_number` | `phoneNumber` | String | **BARU** - No WhatsApp |
| `address` | `address` | String | **BARU** - Alamat lengkap |
| `package_name` | `packageName` | String | **BARU** - Nama paket |
| `latitude` | `latitude` | Number | **BARU** - GPS Latitude |
| `longitude` | `longitude` | Number | **BARU** - GPS Longitude |
| `photo_url` | `photoUrl` | String | **BARU** - URL foto rumah |
| `user_id` | - | UUID | ID user yang menambahkan |

### 5. Fitur Baru yang Memerlukan Kolom Database

#### 📱 WhatsApp Integration
- **Field**: `phone_number`
- **Fungsi**: Tombol WA untuk kirim reminder tagihan

#### 📍 Lokasi GPS  
- **Field**: `latitude`, `longitude`
- **Fungsi**: Map lokasi pelanggan, navigasi Google Maps

#### 📷 Foto Rumah
- **Field**: `photo_url`
- **Fungsi**: Upload dan tampilkan foto rumah pelanggan

#### 📦 Paket Internet
- **Field**: `package_name`
- **Fungsi**: Kategori paket internet pelanggan

#### 🏠 Alamat Lengkap
- **Field**: `address`
- **Fungsi**: Alamat detail untuk navigasi dan kontak

### 6. Testing Koneksi

Setelah migration, coba:
1. **Tambah pelanggan baru** dengan semua field
2. **Upload foto** pelanggan
3. **Set koordinat GPS** via location picker
4. **Kirim WhatsApp** reminder
5. **Lihat di map** lokasi pelanggan

### 7. Troubleshooting

**Error: Column doesn't exist**
- Pastikan migration SQL sudah dijalankan
- Cek apakah semua tabel memiliki kolom baru

**Error: Permission denied**
- Cek RLS policies di Supabase
- Pastikan user sudah login

**WhatsApp tidak berfungsi**
- Pastikan field `phone_number` terisi
- Format nomor: 08xxxxxxxxxx atau 62xxxxxxxxx

**GPS tidak akurat**
- Pastikan browser mengizinkan location access
- Gunakan location picker untuk set manual

### 8. Backup Data

Sebelum migration, backup data dengan:
```sql
-- Export data existing
SELECT * FROM customer_bills;
```

### 9. Performance Tips

- Gunakan index untuk query lokasi GPS
- Compress foto sebelum upload
- Batch WhatsApp reminder untuk performa

## 🚀 Ready to Use!

Setelah migration selesai, semua fitur baru akan berfungsi:
- ✅ WhatsApp reminder dengan template rapi
- ✅ Interactive Google Maps dengan location picker  
- ✅ Upload foto rumah pelanggan
- ✅ Export Excel dengan data lengkap
- ✅ Grafik analitik bulanan
- ✅ Management user dan paket internet

