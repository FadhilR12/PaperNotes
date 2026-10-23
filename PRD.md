# Product Requirements Document (PRD) — PaperNotes

## 1. Informasi Dokumen

| Atribut                   | Keterangan                                               |
| ------------------------- | -------------------------------------------------------- |
| Nama produk               | PaperNotes                                               |
| Jenis produk              | Aplikasi web pencatatan pribadi                          |
| Status dokumen            | PRD berdasarkan implementasi yang tersedia di repository |
| Platform                  | Web                                                      |
| Bahasa antarmuka saat ini | Campuran bahasa Inggris dan Indonesia                    |

Dokumen ini menjelaskan PaperNotes berdasarkan kode, skema, dan konfigurasi yang tersedia saat ini. Dokumen membedakan fitur yang memang telah terlihat diimplementasikan dengan hal-hal yang belum menjadi bagian dari cakupan produk.

## 2. Ringkasan Produk

PaperNotes adalah aplikasi web untuk menulis dan mengelola catatan pribadi. Pengguna dapat membuat akun, masuk, membuat dan mengelola catatan teks, mengelompokkan catatan dengan folder dan tag, mencari catatan berdasarkan judul, isi, atau tag, meninjau riwayat perubahan, memulihkan versi sebelumnya, dan keluar dari akun.

Fokus produk adalah pencatatan individual yang ringan dengan pengorganisasian dan pemulihan perubahan sederhana. PaperNotes bukan aplikasi kolaborasi tim, pengolah dokumen kaya format, kalender, atau sistem manajemen tugas.

### Pernyataan nilai

PaperNotes menyediakan cara sederhana untuk menangkap ide atau informasi singkat, mengelompokkannya secara pribadi, dan menemukannya kembali melalui folder, tag, maupun pencarian.

## 3. Masalah dan Tujuan

### Masalah pengguna

Pengguna membutuhkan tempat yang praktis untuk menyimpan ide, informasi, atau pengingat berbentuk teks. Tanpa tempat terpusat, catatan dapat tersebar dan sulit ditemukan kembali.

### Tujuan produk

1. Memungkinkan pengguna mendaftar dan mengakses ruang catatan pribadi.
2. Mengurangi langkah untuk membuat catatan baru.
3. Menampilkan catatan yang sudah tersimpan dalam urutan terbaru.
4. Membantu pengguna menemukan kembali catatan melalui pencarian judul dan isi.
5. Memungkinkan pengguna mengelompokkan catatan menggunakan folder dan tag pribadi.
6. Memungkinkan pengguna memperbaiki catatan, meninjau versi sebelumnya, dan memulihkan isi terdahulu.
7. Memungkinkan pengguna menghapus catatan tanpa kehilangan catatan lain atau akun.

### Bukan tujuan versi saat ini

- Kolaborasi atau berbagi catatan antar pengguna.
- Pengelolaan tugas, kalender, atau pengingat terjadwal.
- Pengorganisasian dengan kategori bertingkat, favorit/pin, atau arsip.
- Penyuntingan teks kaya, lampiran, atau dukungan offline.
- Berbagi catatan atau folder dengan pengguna lain.

## 4. Aktor dan Pemangku Kepentingan

| Aktor               | Tanggung jawab dan kebutuhan                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Pengguna terdaftar  | Mengelola catatan miliknya: membuat, melihat, mencari, mengubah, dan menghapus. Mengelola sesi dengan login dan logout.               |
| Pengunjung          | Dapat membuka alur pendaftaran, login, syarat layanan, dan kebijakan privasi. Halaman utama catatan memerlukan autentikasi.           |
| Aplikasi PaperNotes | Menyediakan antarmuka, memvalidasi formulir, mengelola sesi, serta meneruskan operasi data ke backend.                                |
| PocketBase          | Menyediakan autentikasi, penyimpanan akun dan catatan, serta layanan backend untuk aplikasi.                                          |
| Operator/developer  | Menjalankan, mengonfigurasi, dan memelihara aplikasi web dan PocketBase. Tidak ada antarmuka peran admin produk yang tampak saat ini. |

Tidak ada indikasi dukungan peran seperti administrator aplikasi, editor, atau anggota workspace. Label “Personal” di menu akun menunjukkan konteks penggunaan individual, bukan fitur workspace kolaboratif.

## 5. Persona dan Kebutuhan Pengguna

### Persona utama: pencatat individual

Orang yang membutuhkan tempat praktis untuk menyimpan informasi teks sehari-hari, misalnya mahasiswa yang mencatat materi kuliah, pekerja yang mencatat hasil rapat, atau pengguna yang ingin menyimpan ide.

### Kebutuhan

- Saya ingin mendaftar dan masuk agar catatan terkait dengan akun saya.
- Saya ingin membuat catatan dengan cepat agar ide tidak terlupa.
- Saya ingin melihat catatan terbaru agar mudah melanjutkan pekerjaan.
- Saya ingin mencari berdasarkan kata dalam judul atau isi.
- Saya ingin mengubah catatan yang keliru dan menghapus catatan yang tidak diperlukan.
- Saya ingin mengelompokkan catatan dengan folder dan tag pribadi.
- Saya ingin meninjau dan memulihkan versi catatan sebelumnya jika diperlukan.
- Saya ingin keluar dari akun setelah selesai menggunakan aplikasi.

### 5.1 Kelas Pengguna

Kelas berikut dibedakan berdasarkan status akses, pola penggunaan, bagian produk yang digunakan, keahlian teknis, serta hak akses. Profil pendidikan dan pekerjaan adalah contoh konteks penggunaan, bukan persyaratan untuk mendaftar. Produk saat ini tidak menyediakan role atau tingkat hak istimewa yang berbeda di antara pemilik akun.

| Kelas                                          | Profil dan frekuensi penggunaan                                                                                                                                | Peran dan bagian produk yang digunakan                                                                                                                     | Keahlian dan hak akses                                                                                                                                                                        | Requirement yang berkaitan                                                                                 |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Pengunjung / calon pengguna**                | Belum memiliki sesi aktif. Biasanya hanya sesekali mengunjungi aplikasi sebelum mendaftar atau login.                                                          | Membaca syarat layanan dan kebijakan privasi, mendaftar, atau menuju login. Tidak mengelola catatan.                                                       | Tidak memerlukan keahlian teknis khusus. Tidak memiliki hak membaca atau mengubah catatan.                                                                                                    | FR-01, FR-02, FR-03, FR-10                                                                                 |
| **Pengguna individual reguler**                | Kelas pengguna utama. Dapat menggunakan aplikasi setiap hari atau beberapa kali seminggu untuk menyimpan ide, materi, atau catatan kerja.                      | Membuat, mengelompokkan, mencari, memperbarui, memulihkan versi, dan menghapus catatan; mengelola sesi melalui login/logout.                               | Diasumsikan memiliki kemampuan dasar menggunakan web dan formulir. Hanya boleh mengelola catatan, folder, dan tag miliknya; tidak memiliki fungsi admin.                                      | FR-02 sampai FR-09, FR-11 sampai FR-14                                                                     |
| **Pengguna individual sesekali**               | Memiliki akun tetapi menggunakan produk secara berkala, misalnya untuk mencatat informasi tertentu lalu kembali mencarinya beberapa hari atau minggu kemudian. | Memerlukan login yang jelas, daftar catatan, folder, filter tag, riwayat perubahan, dan pengeditan/pemulihan ketika kembali.                               | Kemampuan teknis dasar atau beragam. Memerlukan antarmuka yang mudah dipahami tanpa konfigurasi lanjutan. Hak akses sama dengan pengguna reguler.                                             | FR-02, FR-03, FR-05 sampai FR-09, FR-11 sampai FR-14                                                       |
| **Pengguna intensif / pencatat volume tinggi** | Pengguna yang sering membuat banyak catatan dan menggunakan folder, tag, serta pencarian untuk menemukan catatan lama.                                         | Menggunakan seluruh fungsi catatan pribadi, termasuk pengorganisasian dan pemulihan versi. Paginasi dan filter lanjutan di luar folder/tag belum tersedia. | Dapat memiliki kebiasaan penggunaan web yang lebih tinggi, tetapi tidak memperoleh hak istimewa tambahan. Hak akses dibatasi pada data miliknya sendiri.                                      | FR-04 sampai FR-08, FR-11 sampai FR-14                                                                     |
| **Operator / developer**                       | Bukan pengguna catatan sehari-hari. Mengakses sistem saat instalasi, deployment, konfigurasi, pemantauan, atau pemeliharaan.                                   | Mengelola aplikasi web dan layanan PocketBase melalui sarana operasional, bukan melalui fitur akun pengguna biasa.                                         | Memerlukan keahlian teknis dan akses infrastruktur yang sesuai tugas. Kredensial dan hak operasional harus dipisahkan dari akun pengguna biasa. Antarmuka admin produk tidak tampak tersedia. | Kebutuhan operasional pada bagian 9 dan risiko deployment pada bagian 12; tidak termasuk FR pengguna akhir |

**Catatan pemodelan kelas:** pengguna reguler, sesekali, dan intensif adalah segmen berdasarkan pola pemakaian, bukan tipe akun yang berbeda. Semua pengguna terdaftar menggunakan fungsi dan hak akses yang sama. Persyaratan autentikasi berlaku bagi semua pengguna terdaftar; pengelolaan catatan, folder, tag, dan versi memerlukan sesi aktif.

### 5.2 Pemodelan Goal

Pemodelan berikut menunjukkan bagaimana tujuan utama produk diuraikan menjadi sub-goal, lalu dipenuhi oleh kebutuhan fungsional. Goal menyatakan hasil yang ingin dicapai pengguna atau sistem; FR menyatakan kemampuan produk yang mendukung hasil tersebut.

```text
G0 — Menyediakan layanan pencatatan pribadi yang mudah digunakan dan menjaga catatan tetap berada dalam kendali pemiliknya
|
+-- G1 — Memungkinkan pengguna memperoleh dan mengelola akses ke akun
|   +-- G1.1 Membuat akun dengan input yang valid dan persetujuan yang diperlukan
|   |   +-- FR-01
|   +-- G1.2 Masuk dengan kredensial yang valid
|   |   +-- FR-02
|   +-- G1.3 Membatasi halaman catatan untuk pengguna yang sudah login
|   |   +-- FR-03
|   +-- G1.4 Mengakhiri sesi saat pengguna memilih logout
|       +-- FR-09
|
+-- G2 — Menangkap dan mengelola catatan pribadi
|   +-- G2.1 Membuat catatan dengan cepat
|   |   +-- FR-04
|   +-- G2.2 Melihat catatan yang tersimpan, terutama yang terbaru
|   |   +-- FR-05
|   +-- G2.3 Memperbaiki catatan yang tersimpan
|   |   +-- FR-07
|   +-- G2.4 Menghapus catatan yang tidak diperlukan
|       +-- FR-08
|   +-- G2.5 Mengelompokkan catatan dengan folder dan tag pribadi
|   |   +-- FR-12, FR-13
|   +-- G2.6 Meninjau atau memulihkan isi catatan terdahulu
|       +-- FR-14
|
+-- G3 — Menemukan kembali catatan
|   +-- G3.1 Mencari catatan berdasarkan judul, isi, atau tag
|   |   +-- FR-06, FR-13
|   +-- G3.2 Membatasi daftar berdasarkan folder atau tag
|       +-- FR-12, FR-13
|
+-- G4 — Menjaga privasi dan kepemilikan catatan
|   +-- G4.1 Mengaitkan catatan dengan pemilik yang terautentikasi
|   |   +-- FR-04
|   +-- G4.2 Membatasi catatan, folder, tag, dan versinya kepada pemilik
|       +-- FR-11
|
+-- G5 — Membantu pengguna memahami ketentuan penggunaan dan privasi
    +-- G5.1 Menyediakan akses ke syarat layanan dan kebijakan privasi
        +-- FR-10
```

#### Matriks keterlacakan Goal ke Requirement

| Goal                         | Hasil yang diharapkan                                                                           | Requirement terkait                             | Kelas pengguna utama                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------- |
| G1 — Akses akun              | Pengguna dapat membuat akun, login, mengakses halaman yang sesuai status sesi, dan logout.      | FR-01, FR-02, FR-03, FR-09                      | Pengunjung, pengguna terdaftar                       |
| G2 — Pengelolaan catatan     | Pengguna dapat membuat, mengorganisasi, memperbarui, memulihkan, dan menghapus catatan pribadi. | FR-04, FR-05, FR-07, FR-08, FR-12, FR-13, FR-14 | Pengguna reguler, sesekali, intensif                 |
| G3 — Penemuan catatan        | Pengguna dapat menemukan catatan melalui pencarian teks serta filter folder/tag.                | FR-06, FR-12, FR-13                             | Pengguna reguler, sesekali, intensif                 |
| G4 — Kepemilikan dan privasi | Catatan hanya dapat diakses dan dikelola oleh pemilik yang berwenang.                           | FR-03, FR-04, FR-11                             | Semua pengguna terdaftar; operator untuk konfigurasi |
| G5 — Transparansi penggunaan | Pengunjung dapat membaca ketentuan layanan dan kebijakan privasi.                               | FR-10                                           | Pengunjung, pengguna terdaftar                       |

FR-11 memastikan pembatasan akses berdasarkan pemilik melalui aturan koleksi PocketBase dan pemeriksaan aplikasi. Catatan, folder, tag, relasi tag, dan versi tidak boleh dibaca atau dimutasi lintas pengguna.

## 6. Ruang Lingkup Fitur

### 6.1 Autentikasi dan akun

- Pendaftaran menggunakan nama, email, kata sandi, serta persetujuan syarat dan kebijakan privasi.
- Validasi pendaftaran memeriksa nama wajib, format email, kata sandi minimal delapan karakter, dan persetujuan.
- Login menggunakan email dan kata sandi.
- Setelah pendaftaran berhasil, aplikasi mencoba membuat sesi dan membawa pengguna ke halaman utama.
- Sesi disimpan dalam cookie autentikasi `pb_auth` selama tujuh hari. Cookie dikonfigurasi `HttpOnly`, `SameSite=Lax`, dan `Secure` ketika bukan dalam mode development.
- Pengguna dapat logout, yang menghapus sesi dan mengarahkan kembali ke halaman login.
- Jika pengguna belum masuk dan membuka halaman utama, aplikasi mengarahkannya ke login. Pengguna yang sudah masuk diarahkan ke halaman utama jika membuka halaman login atau pendaftaran.

### 6.2 Daftar catatan

- Halaman utama menampilkan catatan milik pengguna yang sedang masuk.
- Catatan ditampilkan sebagai kartu yang berisi judul, cuplikan isi, folder (jika ada), tag, dan label waktu pembuatan.
- Urutan data dari backend adalah terbaru terlebih dahulu.
- Antarmuka menampilkan jumlah catatan pada daftar.
- Daftar dapat difilter dengan memilih satu folder dan/atau satu tag. Filter tersebut dapat dihapus dengan memilih “All notes” atau menonaktifkan tag.

### 6.3 Membuat catatan

- Form pembuatan catatan tersedia langsung dari halaman utama.
- Form dimulai dalam keadaan ringkas dan diperluas ketika pengguna mulai menulis.
- Data utama catatan adalah judul dan isi.
- Jika judul kosong, server mengisi judul dengan “Untitled note”.
- Jika isi kosong, server mengisi isi dengan “A thought captured just now.”
- Jika judul dan isi sama-sama kosong, operasi pembuatan dibatalkan.
- Catatan baru dikaitkan dengan pengguna yang sedang masuk.
- Pengguna dapat menetapkan catatan ke satu folder atau membiarkannya tanpa folder.
- Pengguna dapat memasukkan hingga 10 tag per catatan dalam satu input dipisahkan koma. Tag dinormalisasi menjadi huruf kecil, memiliki panjang maksimal 50 karakter, dan digunakan kembali untuk catatan lain milik pengguna yang sama.
- Saat form diperluas, command dimasukkan melalui kolom deskripsi. Mengetik `/` menampilkan suggestion inline untuk `/newFolder`, `/Folder`, dan `/tags`, dengan `/newFolder` terpilih secara default; suggestion dapat dipilih dengan mouse atau keyboard.
- `/newFolder <nama>` membuat folder. `/Folder <nama-folder> <isi>` menyimpan catatan di folder milik pengguna yang sudah ada; jika folder tidak ditemukan, command tersebut diperlakukan sebagai teks deskripsi biasa. `/tags <nama>` membuat/menggunakan ulang tag. Beberapa command dapat dipadukan pada satu deskripsi; teks setelah argumen command menjadi isi catatan dan catatan akan dikaitkan dengan folder/tag yang dituju. `/newFolder` dan `/tags` tanpa isi catatan hanya membuat folder atau tag, sementara `/Folder` tanpa isi tidak membuat catatan; form tetap terbuka untuk input berikutnya.
- Teks yang diawali `/` tetapi bukan command yang tersedia diperlakukan sebagai isi catatan biasa dan disimpan apa adanya.

### 6.4 Membuka dan memperbarui catatan

- Memilih kartu membuka dialog catatan.
- Pengguna dapat mengubah judul dan isi melalui dialog.
- Pembaruan dikirim ke server dan daftar dimuat ulang setelah operasi berhasil.
- Jika salah satu kolom kosong, server menggunakan nilai bawaan yang sama seperti pada pembuatan catatan.
- Jika judul dan isi sama-sama kosong, pembaruan ditolak.
- Pengguna dapat mengubah atau menghapus folder dan tag catatan.
- Jika judul atau isi berubah, isi sebelumnya disimpan sebagai versi sebelum perubahan ditampilkan sebagai berhasil. Perubahan folder/tag saja tidak membuat versi konten.
- Dialog menyediakan maksimal 3 versi terbaru yang dapat dipulihkan. Saat versi baru membuat jumlahnya melebihi tiga, versi terlama dihapus. Pemulihan menyimpan konten saat ini sebagai versi, lalu mengganti judul dan isi dengan snapshot pilihan; folder dan tag tetap dipertahankan.

### 6.5 Menghapus catatan

- Dialog catatan menyediakan tombol hapus.
- Setelah operasi berhasil, data halaman dimuat ulang agar daftar mencerminkan perubahan.
- Relasi tag dan riwayat versi dihapus bersama catatan melalui relasi cascade PocketBase.

### 6.6 Folder dan tag

- Folder dimiliki oleh satu pengguna dan memiliki nama unik per pengguna. Pengguna dapat membuat, mengganti nama, memilih, dan menghapus folder.
- Catatan dapat berada di paling banyak satu folder; folder tidak wajib.
- Menghapus folder melepaskan catatan dari folder tersebut tanpa menghapus catatan.
- Tag dimiliki oleh satu pengguna, digunakan lintas catatan milik pengguna tersebut, dan nama disimpan dalam huruf kecil agar input berulang menggunakan tag yang sama.
- Tag yang dipasang pada catatan dapat diklik untuk memfilter daftar. Tag juga ikut dicari melalui dialog pencarian.
- Folder/tag pengguna lain tidak dapat dipilih, dibaca, atau dikelola.

### 6.7 Pencarian

- Dialog pencarian dibuka dari navigasi utama.
- Pencarian mencocokkan teks pada judul, isi, dan nama tag, tanpa membedakan kapitalisasi.
- Hasil ditampilkan saat pengguna mengetik.
- Memilih hasil menutup dialog pencarian dan membuka catatan tersebut.
- Berdasarkan implementasi yang terlihat, pencarian dilakukan terhadap data catatan yang telah dimuat di aplikasi.

### 6.8 Menu akun dan halaman legal

- Menu akun menampilkan nama, email, inisial pengguna, label workspace “Personal”, dan tombol logout.
- Halaman syarat layanan dan kebijakan privasi tersedia dari alur pendaftaran.
- Isi halaman legal menjelaskan penggunaan layanan dan informasi akun/catatan. Mekanisme mandiri untuk permintaan akses, koreksi, atau penghapusan akun tidak tampak tersedia pada antarmuka.

## 7. Alur Pengguna Utama

### 7.1 Pendaftaran

1. Pengunjung membuka halaman pendaftaran.
2. Pengunjung mengisi nama, email, kata sandi, dan menyetujui syarat serta kebijakan privasi.
3. Aplikasi memvalidasi input.
4. Data akun dikirim ke PocketBase.
5. Jika berhasil, aplikasi mencoba login otomatis dan menyimpan sesi.
6. Pengguna diarahkan ke halaman utama.

### 7.2 Login

1. Pengguna membuka halaman login.
2. Pengguna mengisi email dan kata sandi.
3. Aplikasi memvalidasi format input.
4. PocketBase memverifikasi kredensial.
5. Jika berhasil, sesi disimpan dan pengguna diarahkan ke halaman utama.
6. Jika gagal, aplikasi menampilkan pesan kegagalan.

### 7.3 Membuat catatan

1. Pengguna yang sudah masuk membuka form ringkas di halaman utama.
2. Pengguna mulai mengetik; form menampilkan kolom judul dan isi.
3. Pengguna dapat memilih folder dan memasukkan nama tag yang dipisahkan koma.
4. Pengguna mengirim catatan.
5. Server memeriksa isi form, memastikan folder/tag terkait dimiliki pengguna aktif, dan mengaitkan catatan dengan pengguna tersebut.
6. PocketBase menyimpan catatan dan relasi tag.
7. Halaman memuat data terbaru.

Command cepat dapat digunakan pada kolom deskripsi setelah form diperluas:

- `/newFolder test hallo semua` membuat folder `test` dan catatan berisi `hallo semua` di folder itu.
- `/Folder test hallo semua` menyimpan catatan berisi `hallo semua` di folder `test` yang sudah ada.
- `/Folder tidakAda hallo semua` menyimpan seluruh teks command sebagai deskripsi biasa karena folder `tidakAda` tidak ditemukan.
- `/tags lyrics` membuat atau menggunakan ulang tag `lyrics` tanpa membuat catatan.
- Jika isi ditambahkan setelah nama tag, catatan dibuat dan dikaitkan dengan tag tersebut.
- `/Folder test isi catatan /tags lyrics` menyimpan catatan berisi `isi catatan` di folder `test` dengan tag `lyrics`.
- Teks seperti `/hallo semua aku a` bukan command, sehingga tersimpan sebagai isi catatan tanpa error.

### 7.4 Mencari dan membuka catatan

1. Pengguna membuka dialog pencarian.
2. Pengguna mengetik kata atau frasa.
3. Aplikasi mencocokkan pencarian dengan judul, isi, dan tag.
4. Pengguna memilih hasil.
5. Dialog catatan terbuka.
6. Pengguna dapat membatasi daftar dengan folder dan tag atau mencari nama tag melalui dialog.

### 7.5 Mengubah atau menghapus catatan

1. Pengguna membuka catatan dari daftar atau hasil pencarian.
2. Untuk mengubah, pengguna mengedit judul, isi, folder, atau tag dan menyimpan perubahan.
3. Perubahan judul/isi membuat snapshot konten sebelumnya yang dapat ditinjau dan dipulihkan.
4. Untuk menghapus, pengguna memilih tombol hapus; riwayat dan relasi tag ikut dihapus.
5. Setelah operasi berhasil, daftar dimuat ulang.

### 7.6 Mengelola folder dan versi

1. Pengguna membuat, mengganti nama, atau menghapus folder dari panel folder.
2. Menghapus folder melepaskan catatan yang ada tanpa menghapus catatan.
3. Pengguna membuka riwayat dari dialog catatan dan memilih versi untuk memulihkan judul serta isi.
4. Pemulihan juga menyimpan isi saat ini sebagai versi baru.

### 7.7 Logout

1. Pengguna membuka menu akun.
2. Pengguna memilih “Log out”.
3. Aplikasi menghapus sesi autentikasi.
4. Pengguna diarahkan ke halaman login.

## 8. Kebutuhan Fungsional

| ID    | Kebutuhan                                                                                                                                                   | Prioritas | Status berdasarkan repository                                                                  |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------- |
| FR-01 | Pengunjung dapat membuat akun dengan nama, email, kata sandi, dan persetujuan syarat/privasi.                                                               | Tinggi    | Ada                                                                                            |
| FR-02 | Pengguna dapat login menggunakan email dan kata sandi.                                                                                                      | Tinggi    | Ada                                                                                            |
| FR-03 | Pengguna yang belum login tidak dapat membuka halaman utama catatan.                                                                                        | Tinggi    | Ada pada alur aplikasi; aturan backend perlu diverifikasi terpisah                             |
| FR-04 | Pengguna dapat membuat catatan dengan judul dan isi.                                                                                                        | Tinggi    | Ada                                                                                            |
| FR-05 | Daftar menampilkan catatan terbaru dengan judul, cuplikan isi, waktu, dan jumlah.                                                                           | Tinggi    | Ada                                                                                            |
| FR-06 | Pengguna dapat mencari catatan pada judul dan isi.                                                                                                          | Menengah  | Ada, pencarian lokal pada data yang dimuat                                                     |
| FR-07 | Pengguna dapat membuka dan memperbarui catatan.                                                                                                             | Tinggi    | Ada                                                                                            |
| FR-08 | Pengguna dapat menghapus catatan.                                                                                                                           | Tinggi    | Ada                                                                                            |
| FR-09 | Pengguna dapat logout dan sesi autentikasi dibersihkan.                                                                                                     | Tinggi    | Ada                                                                                            |
| FR-10 | Pengguna dapat membaca syarat layanan dan kebijakan privasi.                                                                                                | Menengah  | Ada                                                                                            |
| FR-11 | Catatan, folder, tag, relasi tag, dan versi hanya dapat diakses atau dikelola oleh pemilik yang terautentikasi; relasi lintas pemilik ditolak oleh backend. | Tinggi    | Diimplementasikan melalui rules PocketBase dan pemeriksaan server; perlu diuji pada deployment |
| FR-12 | Pengguna dapat membuat, mengganti nama, memilih, dan menghapus folder. Penghapusan folder melepas catatan tanpa menghapusnya.                               | Menengah  | Diimplementasikan                                                                              |
| FR-13 | Pengguna dapat menetapkan hingga 10 tag per catatan, menggunakan ulang tag pribadi, memfilter berdasarkan folder/tag, dan mencari nama tag.                 | Menengah  | Diimplementasikan                                                                              |
| FR-14 | Perubahan judul/isi menyimpan snapshot; pengguna dapat melihat hingga 3 versi terbaru dan memulihkan versi. Versi terlama dihapus jika batas terlampaui.    | Menengah  | Diimplementasikan                                                                              |

## 9. Kebutuhan Nonfungsional dan Batas Teknis

### Keamanan dan akses data

- Sesi aplikasi menggunakan cookie dengan atribut keamanan yang terlihat di kode.
- Operasi yang memerlukan akun memeriksa sesi pada server aplikasi.
- Isolasi data lintas pengguna dijamin dengan aturan koleksi PocketBase untuk catatan, folder, tag, relasi tag, dan versi, ditambah pemeriksaan kepemilikan pada server aplikasi.
- Migrasi PocketBase membatasi operasi catatan/folder/tag/relasi/versi menurut pemilik. Migrasi perlu dijalankan pada setiap lingkungan sebelum fitur baru digunakan.
- Versi catatan hanya dapat dibaca dan dibuat oleh pemilik; versi tidak dapat diubah dan hanya pemilik yang dapat menghapus versi miliknya. Aplikasi menghapus versi terlama saat jumlahnya melebihi tiga. Menghapus catatan menghapus seluruh versinya melalui cascade.

### Ketersediaan dan penyimpanan

- Aplikasi web bergantung pada layanan PocketBase untuk autentikasi dan data catatan.
- Repository memiliki konfigurasi Docker Compose untuk menjalankan aplikasi web dan PocketBase.
- Persistensi data pada deployment perlu dipastikan: konfigurasi Compose saat ini mengomentari volume data PocketBase.

### Bahasa dan pengalaman pengguna

- Label UI saat ini banyak menggunakan bahasa Inggris, sementara beberapa pesan server berbahasa Indonesia.
- Antarmuka dirancang untuk desktop dan layar kecil menggunakan layout responsif.

## 10. Model Data Konseptual

### User

| Atribut  | Deskripsi                                                     |
| -------- | ------------------------------------------------------------- |
| ID       | Identitas unik akun yang dikelola PocketBase.                 |
| Name     | Nama tampilan pengguna.                                       |
| Email    | Alamat email untuk login dan identitas akun.                  |
| Password | Kredensial yang dikelola oleh koleksi autentikasi PocketBase. |

### Folder

| Atribut           | Deskripsi                                |
| ----------------- | ---------------------------------------- |
| ID                | Identitas unik folder.                   |
| User              | Pemilik folder.                          |
| Name              | Nama folder, unik untuk setiap pengguna. |
| Created / Updated | Timestamp yang dikelola PocketBase.      |

### Note

| Atribut | Deskripsi                                                    |
| ------- | ------------------------------------------------------------ |
| ID      | Identitas unik catatan.                                      |
| Title   | Judul catatan.                                               |
| Desc    | Isi teks catatan.                                            |
| User    | Relasi pemilik catatan ke akun pengguna.                     |
| Folder  | Relasi opsional ke satu folder milik pengguna.               |
| Created | Waktu pembuatan, digunakan untuk pengurutan dan label waktu. |
| Updated | Waktu pembaruan yang dikelola PocketBase.                    |

### Tag

| Atribut           | Deskripsi                                                                         |
| ----------------- | --------------------------------------------------------------------------------- |
| ID                | Identitas unik tag.                                                               |
| User              | Pemilik tag; tag tidak dibagikan lintas pengguna.                                 |
| Name              | Nama tag maksimal 50 karakter, disimpan dalam huruf kecil, dan unik per pengguna. |
| Created / Updated | Timestamp yang dikelola PocketBase.                                               |

### NoteTag

| Atribut           | Deskripsi                                       |
| ----------------- | ----------------------------------------------- |
| ID                | Identitas record relasi yang dibuat PocketBase. |
| Note ID           | Relasi ke catatan.                              |
| Tag ID            | Relasi ke tag.                                  |
| Created / Updated | Timestamp relasi.                               |

Pasangan Note ID dan Tag ID harus unik. Relasi many-to-many ini hanya dapat dibuat jika catatan dan tag dimiliki pengguna yang sama.

### NoteVersion

| Atribut           | Deskripsi                                        |
| ----------------- | ------------------------------------------------ |
| ID                | Identitas unik snapshot versi.                   |
| Note ID           | Relasi ke catatan yang memiliki snapshot.        |
| Title / Desc      | Snapshot judul dan isi sebelum perubahan konten. |
| Created / Updated | Timestamp versi yang dikelola PocketBase.        |

Hubungan konseptual: **satu pengguna dapat memiliki banyak catatan, folder, dan tag; catatan dapat berada di nol atau satu folder, memiliki banyak tag melalui `note_tags`, dan memiliki banyak versi melalui `note_versions`**. Seluruh tabel dan relasi diterapkan melalui migrasi PocketBase dan didokumentasikan pada [`docs/db_schema.dbml`](./docs/db_schema.dbml).

## 11. Di Luar Cakupan Saat Ini

Fitur berikut berada di luar cakupan implementasi:

- Kategori bertingkat, favorit/pin, dan arsip.
- Berbagi atau kolaborasi antarpengguna.
- Editor rich text dan lampiran berkas.
- Pengingat, tanggal jatuh tempo, atau kalender.
- Mode offline dan sinkronisasi konflik.
- Impor, ekspor, pencadangan, dan pemulihan melalui UI.
- Paginasi atau pemuatan bertahap.
- Pemulihan kata sandi atau pengelolaan profil mandiri.
- Penghapusan akun mandiri.
- Antarmuka admin.

Daftar ini adalah batas cakupan berdasarkan implementasi yang ditinjau, bukan komitmen roadmap.

## 12. Risiko dan Hal yang Perlu Dikonfirmasi

1. **Pendaftaran akun:** perilaku kegagalan pembuatan akun dan login otomatis perlu diuji untuk memastikan pengguna selalu menerima hasil yang benar.
2. **Aturan akses deployment:** migrasi terbaru memasang aturan kepemilikan pada catatan, folder, tag, relasi, dan versi. Pastikan migrasi diterapkan pada instance yang digunakan dan penolakan lintas pemilik diuji.
3. **Konfigurasi alamat backend:** helper PocketBase kini membaca `POCKETBASE_URL` dan memakai `http://127.0.0.1:8090` sebagai fallback lokal; pastikan nilai production menunjuk ke service yang benar.
4. **Persistensi deployment:** volume data PocketBase di Compose dikomentari. Tanpa volume persisten yang sesuai, data berisiko tidak bertahan sebagaimana diharapkan saat container diganti.
5. **Kebijakan privasi dan kemampuan aplikasi:** kebijakan menyebut permintaan akses, koreksi, atau penghapusan informasi, tetapi alur self-service untuk permintaan tersebut belum tampak.
6. **Konsistensi operasi multi-record:** penyimpanan catatan, relasi tag, dan snapshot versi memakai beberapa permintaan PocketBase; kegagalan jaringan di tengah rangkaian dapat memerlukan perbaikan data.

## 13. Kriteria Penerimaan Produk

- Pengunjung dapat mendaftar dengan data valid dan menerima feedback jika input tidak valid.
- Pengguna dapat login dan logout.
- Pengguna yang belum login diarahkan ke login ketika membuka halaman utama.
- Pengguna yang sudah login dapat membuat catatan dan melihatnya pada daftar.
- Catatan terbaru tampil lebih dahulu.
- Pencarian mencocokkan teks pada judul, isi, maupun tag tanpa membedakan kapitalisasi.
- Pengguna dapat membuka catatan, menyimpan perubahan, dan melihat hasil perubahan pada daftar.
- Pengguna dapat menghapus catatan dan melihatnya hilang dari daftar.
- Pengguna dapat membuat, mengganti nama, memfilter, dan menghapus folder; penghapusan folder tidak menghapus catatan.
- Pengguna dapat menetapkan beberapa tag, memfilter berdasarkan tag, dan menemukan tag melalui pencarian.
- Perubahan judul/isi membuat versi sebelumnya; pengguna dapat melihat dan memulihkan versi, dengan konten saat ini tersimpan sebagai snapshot.
- Pengujian akses memastikan pengguna tidak dapat membaca, mengubah, atau menghapus catatan, folder, tag, relasi, maupun versi milik pengguna lain, termasuk melalui request langsung ke backend.
- Data tetap tersedia setelah proses restart deployment yang memang dijanjikan mempertahankan data.

## 14. Arsitektur dan Referensi Implementasi

- Frontend dan server web: SvelteKit, Svelte, dan TypeScript.
- Styling: Tailwind CSS.
- Validasi formulir: Zod.
- Backend, autentikasi, dan penyimpanan: PocketBase.
- Deployment: Docker Compose.

Referensi implementasi utama:

- Halaman utama: [`src/routes/+page.svelte`](./src/routes/+page.svelte)
- Aksi halaman utama: [`src/routes/+page.server.ts`](./src/routes/+page.server.ts)
- Navigasi akun: [`src/lib/components/navbar.svelte`](./src/lib/components/navbar.svelte)
- Dialog catatan: [`src/lib/components/note_dialog.svelte`](./src/lib/components/note_dialog.svelte)
- Pencarian: [`src/lib/components/search_dialog.svelte`](./src/lib/components/search_dialog.svelte)
- Autentikasi: [`src/lib/repository/auth.ts`](./src/lib/repository/auth.ts)
- Operasi penyimpanan catatan: [`src/lib/repository/storage.ts`](./src/lib/repository/storage.ts)
- Validasi pengguna: [`src/lib/validation/user.ts`](./src/lib/validation/user.ts)
- Hook sesi dan proteksi rute: [`src/hooks.server.ts`](./src/hooks.server.ts)
- Skema konseptual: [`docs/db_schema.dbml`](./docs/db_schema.dbml)
- Migrasi koleksi dan aturan kepemilikan: [`pb/pb_migrations/1792760000_add_note_organization_and_versions.js`](./pb/pb_migrations/1792760000_add_note_organization_and_versions.js)
- Konfigurasi deployment: [`deploy/ec2/docker-compose.yml`](./deploy/ec2/docker-compose.yml)
