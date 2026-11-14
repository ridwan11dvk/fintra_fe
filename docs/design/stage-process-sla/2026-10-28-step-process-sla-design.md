# Spesifikasi Konfigurasi Step Proses & SLA

> Layer: design. Stage: high-level-design.
> Status: **SIGNED OFF by the user, 2026-10-28.**
> Sumber persetujuan: “oke overall sudah oke spec nya”, dilanjutkan izin implementasi dan verifikasi sampai selesai.
> Persetujuan mencakup aturan konfigurasi; butir yang dinyatakan terbuka tidak otomatis menjadi keputusan produk.
> Tanggal: 2026-10-28.
> Catatan keputusan, bukti, dan pertanyaan teknis: [draft kerja](step-process-sla-DRAFT.md).

## 1. Tujuan dan scope

Administrator mengelola konfigurasi tahap proses dan nilai SLA melalui halaman Setup & Configuration.
Implementasi menggunakan kembali UI yang tersedia di `fintra_fe`.
API berada di `fintra_be`; model, logic bersama, dan migrasi berada di `railfinance-common`.

Tab halaman tetap:

- Process & Reference.
- Compliance FSSC.
- Financial Control Validation.

PDF Figma menjadi referensi visual konten Process & Reference.
Nama dua tab pendamping mengikuti keputusan pengguna dan PRD/QA, bukan label pada ekspor Figma.
Isi fitur dua tab pendamping tidak diperluas menjadi pekerjaan baru dalam slice ini.

Pengaturan hari kerja/kalender berada pada modul pemakai SLA.
Layar ini tidak menyediakan pilihan hari kerja/kalender atau menghitung deadline transaksi.
Implementasi alarm ditunda sampai hasil pemeriksaan pengguna tersedia.
Konfigurasi berhasil disimpan tidak menjadi klaim bahwa integrasi deadline/alarm selesai.

## 2. Daftar tahap dan kategori

- UI membaca data katalog dari backend.
- Jumlah tahap mengikuti data; tidak ada validasi jumlah harus tepat 18.
- Setiap tahap memiliki identitas tetap, kategori, nama, tipe proses, urutan, dan nilai SLA.
- Kategori berarti grup pada layar, misalnya Business Partner, Business Unit, Budgeting, FSSC Service, Finance, dan Treasury.
- Judul kategori tampil di atas kumpulan tahap miliknya.
- Nomor tahap menyesuaikan urutan daftar yang ditampilkan, dari 1 sampai jumlah tahap tersedia.
- Tambah/hapus tahap sementara dikelola melalui database, bukan tombol Add/Delete pada layar ini.
- Tidak ada halaman detail tahap terpisah; data dibaca dan diedit pada tab Process & Reference.

Identitas tahap tidak berasal dari nama, nomor baris, atau ID fixture `STAGE-xx`.
Perubahan nama atau urutan tidak mengganti identitas tahap.
Kategori workflow teknis yang lama tetap dibedakan dari kategori/grup layar.
Pemetaan grup untuk data lama diperiksa sebelum migrasi; tidak ditebak dari kemiripan nama.

## 3. Field dan validasi

### Nama proses

- Nama wajib diisi.
- Pasangan nama proses dan kategori harus unik.
- Nama yang sama pada kategori berbeda diperbolehkan.
- Duplikat pada kumpulan perubahan atau data tersimpan menolak seluruh Save.
- Referensi Approval/Dispute Workflow tetap memakai identitas tahap.

### Tipe proses

- Tipe wajib diisi.
- Nilai bisnis mengikuti Submission, Verification, Approval, dan Execution.
- Tipe tetap melekat pada proses ketika baris dipindahkan urutannya.
- Larangan drag antar-kategori tidak menjadikan field tipe otomatis read-only.
- Tipe teknis workflow, misalnya `kind=USER_TASK`, tidak ditimpa dengan label tipe bisnis.

### SLA

- SLA wajib diisi dan minimal 1 hari.
- Nilai desimal, termasuk 1,5 hari, diperbolehkan.
- Tidak ditambahkan batas maksimum bisnis.
- Nilai kosong, non-angka, atau kurang dari 1 ditolak.
- Nilai desimal tidak dibulatkan atau dipotong menjadi integer saat Save/read-back.
- Nilai awal berasal dari katalog backend; tidak di-reset mengikuti angka contoh pada desain.

Frontend dan backend menerapkan aturan yang sama.
Nilai tampilan lokal seperti `1,5` dipetakan konsisten ke nilai desimal API.
Perubahan tipe SQL menggunakan migrasi baru dan mempertahankan nilai SLA lama.

## 4. Drag dan nomor urut

- Drag hanya boleh dalam kategori yang sama.
- Pointer, keyboard, dan request penyimpanan tidak boleh memindahkan tahap ke kategori lain.
- Drop lintas kategori tidak mengubah daftar atau data tersimpan.
- Reorder mengubah posisi dan nomor tampilan; identitas, kategori, nama, tipe, dan SLA tetap.
- Judul kategori tetap tampil; tidak dibuat judul kategori berulang akibat pencampuran grup.
- Cancel mengembalikan urutan terakhir yang tersimpan.
- Save menyimpan urutan baru bersama perubahan field yang lain.

Urutan katalog tidak secara otomatis mengganti routing atau urutan level workflow transaksi yang sudah dipublikasikan.
Propagasi urutan opsi referensi ditentukan pada kontrak konsumen sebelum perubahan integrasi QA-029.

## 5. Save, Cancel, dan navigasi tab

- Setiap tab mempunyai aksi simpan untuk datanya sendiri.
- Process & Reference mempertahankan tombol Save dan Cancel pada UI yang tersedia.
- Satu klik Save menyimpan seluruh perubahan valid pada tab Process & Reference.
- Save menggunakan satu transaksi: semuanya berhasil atau seluruhnya batal.
- Kegagalan satu baris tidak menyimpan baris lain secara sebagian.
- Kegagalan Save mempertahankan draft pengguna dan menampilkan pesan kegagalan.
- Toast sukses tampil hanya setelah backend menyatakan penyimpanan berhasil.
- Cancel membatalkan perubahan field dan urutan yang belum tersimpan.
- Jika memakai tombol Next, aksinya adalah Save & Next.
- Next berpindah hanya setelah penyimpanan tab aktif berhasil; jika gagal, pengguna tetap pada tab aktif.

Detail interaksi klik tab langsung saat dirty, penulisan pesan, dan normalisasi nama tetap menjadi butir review pada draft.
Dokumen ini tidak menganggap rekomendasi yang belum dijawab sebagai keputusan pengguna.

## 6. Batas kontrak backend dan frontend

- Pembacaan memakai katalog nyata, bukan fixture development.
- Kegagalan API tidak beralih diam-diam ke mock.
- Respons menyertakan identitas tetap dan kategori/grup yang jelas untuk setiap tahap.
- Kontrak memuat nama, tipe bisnis, urutan, dan nilai SLA desimal.
- API Save kolektif memvalidasi seluruh payload sebelum menulis.
- Backend menolak ID yang tidak dikenal, identitas duplikat, pasangan nama/kategori duplikat, dan reorder lintas kategori.
- Kontrak tidak menambahkan create/delete tahap pada slice UI ini.
- Kesalahan dihubungkan ke baris/field agar pengguna dapat memperbaiki input.
- HTTP menggunakan Axios instance yang sudah tersedia.
- Server state dan mutation menggunakan TanStack Query.
- Form memakai React Hook Form dengan Zod sebagai sumber validasi frontend.
- Permission backend tetap berlaku; penyembunyian kontrol frontend bukan pengganti otorisasi.

Nama field wire, endpoint bulk, format error, dan strategi update bersamaan ditulis pada kontrak API setelah review desain.
Implementasi tidak mengubah versi dependency, package manifest, atau konfigurasi build.

## 7. Data lama dan referensi workflow

- Kode katalog lama tidak diganti atau dihapus hanya untuk menyamakan label desain.
- Kolom kategori workflow lama tidak dianggap otomatis sama dengan grup bisnis pada layar.
- Referensi kode pada JSON Approval Workflow dan aturan Dispute diinventarisasi sebelum migrasi.
- Perubahan nama tidak memutus resolusi referensi berdasarkan kode.
- Konversi tipe SLA integer ke desimal mempertahankan nilai lama.
- Migrasi historis tidak diedit; perubahan dilakukan melalui migrasi baru.
- Data lokal baru yang belum memiliki workflow bukan bukti bahwa environment bersama tidak memiliki referensi.

## 8. Acceptance konfigurasi

1. Administrator membaca daftar tahap backend dengan kategori dan urutan yang benar.
2. Dataset berjumlah kurang atau lebih dari 18 tidak ditolak hanya karena jumlahnya.
3. Perubahan nama, tipe, SLA, dan urutan terbaca kembali setelah reload.
4. SLA 1 dan 1,5 diterima; 0,5, 0, negatif, kosong, dan non-angka ditolak.
5. Nama sama pada kategori berbeda diterima; pasangan nama/kategori duplikat membatalkan seluruh Save.
6. Drag dalam kategori mengubah urutan; drag lintas kategori tidak mengubah daftar.
7. Cancel memulihkan field dan urutan terakhir yang tersimpan.
8. Satu baris invalid/gagal tidak menyimpan sebagian perubahan.
9. Save gagal mempertahankan draft dan tidak menampilkan toast sukses.
10. Next hanya berpindah setelah Save berhasil, jika kontrol Next digunakan.
11. Pengguna tanpa izin ditolak oleh backend, termasuk request langsung.
12. Referensi Approval/Dispute tetap dapat menyelesaikan kode tahap setelah perubahan nama/urutan.

QA-025 diperbarui untuk menerima desimal valid.
QA-006/009/011/028 diperbarui agar membedakan dataset awal dari batas jumlah tahap.
QA-026–029 menegaskan larangan drag lintas kategori.
QA-034/036 menjadi handoff modul pemakai; QA-035 ditunda, bukan dinyatakan lulus.

## 9. Tahap sesudah review

1. Selesaikan butir review desain dan pemetaan data yang tercatat pada draft.
2. Catat persetujuan spesifikasi secara eksplisit.
3. Tetapkan baseline branch frontend; divergensi development tidak diselesaikan dengan reset otomatis.
4. Tulis kontrak API dan implementation plan per repository, dengan acceptance dan verifikasi tiap item.
5. Implementasikan bertahap, lalu uji frontend, backend, migrasi lokal, dan skenario QA yang diperbarui.

Tidak ada perubahan aplikasi yang dinyatakan selesai oleh dokumen desain ini.
