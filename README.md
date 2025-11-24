# ZaidNet - Aplikasi Manajemen WiFi Billing

Aplikasi berbasis web bisa Online dan Offline untuk offline bisa diinstall di pc/laptop, kalo mau online wajib memiliki domain dan hosting.

## Keterangan Menu

### Fitur Utama:
1. **SETTING USER** : Merubah dan menambah user
2. **PAKET INTERNET** : menambah atau merubah harga paket internet
3. **DATA PELANGGAN** : menambah atau merubah data pelanggan
4. **PEMBAYARAN MASUK** : menampilkan atau mencetak pembayaran masuk sesuai filter tanggal yang dipilih
5. **DASHBOARD** : menampilkan data rekapitulasi realtime
6. **TOMBOL WA PADA TAGIHAN** : mengingatkan tagihan pada pelanggan via chat wa
7. **TOMBOL PRINT PADA TAGIHAN** : mencetak bukti pembayaran tagihan

### Update Versi 2 - Fitur Grafik dan Analitik:
8. Grafik bulanan pelanggan membayar
9. Grafik Bulanan pelanggan belum membayar
10. Grafik bulanan jumlah pembayaran masuk
11. Grafik bulanan tagihan belum terbayar
12. Data tunggakan pembayaran pelanggan
13. Export excel data pembayaran
14. Export excel data tunggakan
15. Pembagian wilayah pelanggan

### Update Versi 3 - Fitur Geolokasi dan Enhanced UX:
1. Foto rumah pelanggan
2. Koordinat Pelanggan
3. Tanggal Jatuh tempo
4. Map semua lokasi pelanggan
5. Format pesan yang lebih rapi

## Cara Menjalankan Aplikasi

### Prerequisites
- Node.js (versi 16 atau lebih baru)
- pnpm package manager

### Instalasi dan Menjalankan

1. **Clone atau Download Project**
2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Jalankan Development Server**
   ```bash
   pnpm dev
   ```

4. **Buka Browser**
   - Aplikasi akan berjalan di: http://localhost:8080/
   - Untuk akses dari perangkat lain di jaringan: http://172.2.64.170:8080/

### Build untuk Production

```bash
# Build aplikasi
pnpm build

# Preview build
pnpm preview
```

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: React Query
- **Database**: Supabase
- **Charts**: Recharts untuk grafik
- **Export**: XLSX untuk Excel export
- **Styling**: Tailwind CSS + shadcn/ui

## Deployment

### Online (Dengan Domain & Hosting)
- Upload build files ke hosting
- Konfigurasi domain
- Setup database Supabase

### Offline (Desktop App)
- Dapat diinstall sebagai PWA di PC/Laptop
- Berfungsi tanpa koneksi internet
- Data tersimpan lokal