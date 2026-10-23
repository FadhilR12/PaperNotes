# PaperNotes

## Menjalankan secara lokal

Pastikan Node.js dan npm sudah terpasang. Buka dua terminal di folder project.

1. Di terminal pertama, jalankan PocketBase:

   ```powershell
   cd pb
   .\pocketbase.exe serve (windows)
   .\pocketbase serve (mac)
   ```

2. Di terminal kedua, install dependency (cukup sekali), lalu jalankan aplikasi:

   ```powershell
   npm install
   npm run dev
   ```

3. Buka aplikasi di [http://localhost:5173](http://localhost:5173). Biarkan kedua terminal tetap berjalan.

4. Akun demo dan password untuk login tersedia di fixture `pb/pb_hooks/seed.pb.js`.

## Mengisi data demo PocketBase

Data demo PocketBase didefinisikan langsung di `pb/pb_hooks/seed.pb.js`. Command seed tidak membaca `data_ori.json`.

### Database yang sudah memakai migration proyek

Jalankan dari direktori `pb` pada database development/test:

```powershell
.\pocketbase.exe migrate up
.\pocketbase.exe seed
```

### Instalasi PocketBase baru dengan satu migration

Migration proyek yang sudah ada tetap dipertahankan sebagai riwayat upgrade. PocketBase menyediakan collection autentikasi `users` secara bawaan; baseline di `pb/pb_migrations_baseline/1793000000_create_complete_papernotes_schema.js` membuat collection catatan, folder, tag, relasi, dan versi dalam satu migration. Baseline ini hanya untuk database baru. Contoh berikut memakai data directory sementara, terpisah dari `pb/pb_data`:

```powershell
$dataDir = Join-Path $env:TEMP 'papernotes-pb-baseline'
.\pocketbase.exe migrate up --dir $dataDir --migrationsDir .\pb_migrations_baseline
.\pocketbase.exe seed --dir $dataDir --hooksDir .\pb_hooks --migrationsDir .\pb_migrations_baseline
.\pocketbase.exe serve --dir $dataDir --hooksDir .\pb_hooks --migrationsDir .\pb_migrations_baseline
```

Jangan jalankan baseline tersebut pada database yang sudah memakai migration proyek: baseline membuat collection dari awal. Untuk tugas yang meminta sintaks **MySQL/MariaDB**, gunakan [papernotes_mysql_schema_seed.sql](./docs/papernotes_mysql_schema_seed.sql). Skrip tersebut membuat database `papernotes`, enam tabel, indeks, relasi foreign key, dan lima baris contoh per tabel; password contoh berupa hash. Jika tugas meminta SQLite, versi yang setara ada di [papernotes_sqlite_schema_seed.sql](./docs/papernotes_sqlite_schema_seed.sql). Kedua skrip SQL itu merupakan model relasional untuk tugas dan bukan migration PocketBase, jadi jangan jalankan terhadap file database PocketBase.

Command `seed` PocketBase bersifat destruktif: command ini menghapus semua record pada collection aplikasi `users`, `notes`, `folders`, `tags`, `note_tags`, dan `note_versions`, lalu mengisinya kembali dengan lima record per collection. Jangan jalankan pada database produksi atau database yang berisi data pengguna yang ingin dipertahankan.
