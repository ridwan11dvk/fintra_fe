# Step Proses & SLA — Draft Scope dan Keputusan

> Layer: design. Stage: high-level-design. Status: DRAFT, belum disetujui sebagai spesifikasi implementasi.
> Tanggal: 2026-10-28. Acuan: PRD 9.1.9.3, FSSC-PSLA-001–038, dan jawaban pengguna atas pertanyaan PDF.
> Dokumen ini mencatat scope, bukti, usulan, dan pertanyaan. Dokumen ini belum mengizinkan implementasi.

## §1 — Tujuan dan batas pekerjaan

Administrator mengelola Step Proses dan SLA melalui Setup & Configuration → Process & Reference.
Gunakan kembali UI yang tersedia di `fintra_fe`.
Hubungkan konfigurasi ke penyimpanan backend yang konsisten dengan referensi workflow.

Scope saat ini berfokus pada konfigurasi Step Proses dan nilai SLA.
Pengguna menetapkan pengaturan hari kerja/kalender pada modul pemakai; jangan tambahkan pilihan tersebut pada layar ini.
Alarm belum dipastikan tersedia; pengguna akan memeriksa, sehingga implementasi alarm ditunda.
Deadline dan alert tidak diklaim selesai hanya karena konfigurasi berhasil disimpan.
Skenario integrasi PRD/QA tetap dicatat sebagai tanggung jawab modul dan acceptance yang perlu diselaraskan.

### Termasuk

- Tampilan tahap berdasarkan data backend; 18 tahap merupakan kondisi saat ini, bukan jumlah wajib permanen.
- Judul kelompok tetap terlihat; drag hanya boleh dalam grup/kategori yang sama, sesuai keputusan terbaru D20.
- Nama proses, tipe proses, SLA hari, dan urutan tahap.
- Aksi simpan per tab, termasuk Save & Next bila memakai tombol Next; Cancel, validasi, dan state hasil.
- Data katalog, API, dan persistensi konfigurasi.
- Referensi tahap pada Approval Workflow dan Dispute Workflow.
- Kontrak nilai SLA untuk modul pemakai; aturan waktu/perhitungan berada pada modul tersebut.
- Pengujian UI Administrator dan integrasi sesuai skenario QA.

### Tidak termasuk perubahan mandiri

- Membangun ulang UI yang sudah tersedia.
- Mengubah isi fitur Compliance FSSC dan Financial Control Validation.
- Membangun Invoice Variance atau Currency Exchange Rate dari tab pada PDF desain.
- Mengganti stack, dependency, atau konfigurasi build.
- Mengubah alur transaksi lain tanpa kontrak requirement yang disetujui.
- Menambah pilihan hari kerja/kalender pada konfigurasi SLA ini.
- Membuat alarm sebelum hasil pemeriksaan pengguna dan requirement lanjutannya tersedia.
- Membangun layar/tombol Add/Delete Stage Proses sekarang; penambahan/pengurangan sementara melalui database sesuai D15.
- Deploy, push, reset database bersama, atau perubahan data production.

## §2 — Sumber dan baseline pemeriksaan

### Dokumen sumber lokal

1. `/home/venturions/Downloads/PRD-CoreFinanceApp-Master Data Management (1).pdf`
   - Bagian 9.1.9.3, halaman 105–107.
   - SHA-256: `f6cd48964c56865786455aa761fc371f915a2ba9cc0217e6caf38b2d1d3401b1`.
2. `/home/venturions/Downloads/Scenario Test FSSC Master Data - KAI - MD - Step Proses & SLA.pdf`
   - 13 halaman; 38 ID unik, FSSC-PSLA-001–038.
   - SHA-256: `3f52618167c32bdce5c81db87c8014a99dcfdc57c0ed811f0ce805d2c2f38049`.
3. `/home/venturions/Downloads/Setup & Configuration - Process & Reference.pdf`
   - Ekspor Figma satu halaman, 1440 × 2943 pt.
   - SHA-256: `2597271e315b083b996da5a9367088d055f38240446793f83948668ecb5401b2`.

File Downloads bukan dependency runtime dan belum disalin ke repository.
Ekstraksi dan render pemeriksaan tersedia sementara di `.output/reports/`.
Belum ada pembandingan piksel terhadap render halaman Administrator.

### Baseline kode

| Repository | Commit lokal | Status saat drafting |
|---|---|---|
| `fintra_fe` | `8ffb674a` | `development`, ahead 3 / behind 6 terhadap remote-tracking terakhir |
| `fintra_be` | `44496ef5` | `development`, sejajar dengan remote-tracking lokal |
| `railfinance-common` | `ab6f98f` | `development`, sejajar dengan remote-tracking lokal |

Status remote-tracking bukan verifikasi server terbaru.
Pull frontend sebelumnya berhenti karena divergensi; belum ada keputusan merge/rebase.
Tentukan baseline implementasi sebelum membuka perubahan kode atau migrasi.

## §3 — Bukti implementasi saat ini

- UI gabungan: `src/features/settings/setup-configuration/pages/setup-configuration.page.tsx`.
- Komponen tahap: `src/features/master-data/stage-process/pages/stage-process.page.tsx`.
- Fixture 18 tahap: `src/features/master-data/dev/master-data.fixtures.ts`.
- Service dan adapter: `src/features/master-data/stage-process/data/stage-process.{service,dev-adapter}.ts`.
- Route aktif: `/setting/setup-configuration`; bukan route terpisah untuk detail tahap.
- UI memiliki input nama, dropdown tipe, SLA, drag, Save, Cancel, dan konfirmasi perubahan.
- Service memakai data dalam memori saat development dan melempar error di luar development.
- Save belum terhubung ke API; reload penuh mengembalikan fixture.
- Input SLA kosong diubah menjadi `0`; pesan kosong belum dibedakan dari nilai tidak positif.
- Frontend mewajibkan integer dan nama unik; kedua batas tambahan belum diputuskan sebagai requirement bisnis.
- Tombol Save/Cancel disabled ketika tidak ada perubahan; QA-031 meminta aksi klik Cancel tanpa perubahan.

Backend:

- Controller: `fintra_be/src/main/java/com/kai/fintra/masterdata/operational/controller/StageProcessController.java`.
- Service: `railfinance-common/common_package/src/main/java/com/kai/railfinance/common/masterdata/stageprocess/service/StageProcessService.java`.
- Entity: `railfinance-common/common_package/src/main/java/com/kai/railfinance/common/masterdata/workflow/entity/StageCatalog.java`.
- Endpoint tersedia: GET koleksi, GET detail, PUT satu tahap pada `/api/master-data/stage-processes`.
- Update menerima `processType`, `roleCode`, dan `slaDays`; belum mendukung perubahan nama atau urutan.
- Daftar saat ini diurutkan berdasarkan nama; entity belum memiliki field urutan tampilan.
- Database lokal hasil seeder berisi delapan tahap, tipe `USER_TASK`, role kosong, dan SLA tiga hari.
- Kode katalog dipakai sebagai referensi Approval/Dispute Workflow; jangan samakan kode dengan nama yang bisa diedit.
- Pencarian pada kode backend/shared workflow belum menemukan konsumsi `slaDays` untuk deadline atau alert.
- Service transaksi di repository lain belum diperiksa; ketiadaan implementasi di sana belum dapat disimpulkan.

## §4 — Keputusan yang sudah dikonfirmasi

| ID | Keputusan | Status dan sumber |
|---|---|---|
| D01 | Pengguna menangani Step Proses dan SLA; tidak menunggu sumber data dari Raka. | DECIDED — pengguna merelay keputusan PM. |
| D02 | Gunakan ulang UI frontend yang sudah ada. | DECIDED — arah kerja yang disepakati sebelum drafting. |
| D03 | Pertahankan tab Process & Reference, Compliance FSSC, dan Financial Control Validation. | DECIDED — pengguna menyetujui rekomendasi setelah konflik desain dijelaskan. |
| D04 | Gunakan PDF Figma sebagai acuan tampilan Process & Reference. | DECIDED — persetujuan yang sama dengan D03. |
| D05 | Tulis draft scope dan daftar keputusan sebelum implementation plan. | DECIDED — pengguna menjawab “oke setuju”. |
| D06 | Draft tidak menyetujui rekomendasi aturan bisnis secara otomatis. | DECIDED — batas persetujuan telah dijelaskan dalam percakapan. |
| D07 | SLA minimal 1, tanpa batas maksimum bisnis yang ditambahkan. | REFINED BY D19 — desimal diperbolehkan. |
| D08 | Drag boleh lintas grup dan judul grup tetap ada. | SUPERSEDED BY D20 — lintas grup tidak lagi diizinkan. |
| D09 | Setiap tab mempunyai aksi simpan; Next berarti simpan lalu lanjut. | DECIDED — jawaban nomor 4; perilaku klik tab langsung belum dijawab. |
| D10 | Yang unik adalah pasangan nama proses + category, bukan nama secara global. | REFINED BY D17 — category adalah grup pada layar. |
| D11 | Jumlah tahap dapat bertambah atau berkurang dari kondisi sekarang. | REFINED BY D15 — pengelolaan sementara melalui database. |
| D12 | Hari kerja/kalender diatur di modul pemakai; abaikan pilihan tersebut pada konfigurasi ini. | DECIDED — jawaban nomor 7. |
| D13 | Alarm belum dipastikan ada; pengguna akan mengecek. Implementasinya ditunda. | DECIDED — jawaban nomor 8. |
| D14 | Drag lintas grup hanya mengubah urutan; grup asal tahap tetap. | SUPERSEDED BY D20 — drag dibatasi dalam grup yang sama. |
| D15 | Pengelolaan Stage Proses sementara melalui database; layar pengelolaannya tidak dikerjakan sekarang. | DECIDED — pengguna menyebut screen tersedia, tetapi sekarang via DB. |
| D16 | Aturan unik berlaku pada data Stage Proses. | DECIDED — penegasan domain; tidak mengubah pasangan nama + category pada D10. |
| D17 | Category untuk uniqueness adalah grup pada layar, misalnya Finance/Treasury. | DECIDED — pengguna: “Ini grup=kategori”. |
| D18 | Satu baris invalid membatalkan seluruh Save; tidak ada penyimpanan sebagian. | DECIDED — pengguna menjawab “Iya” untuk pembatalan seluruh Save. |
| D19 | SLA boleh desimal, termasuk 1,5 hari, tetap minimal 1 tanpa maksimum bisnis tambahan. | DECIDED — pengguna menjawab “ya bisa” untuk SLA desimal. |
| D20 | Drag hanya dalam grup/kategori yang sama; kategori dan tipe proses tidak berubah akibat drag. | DECIDED — koreksi pengguna dari PM: “di grup aja ya, soalnya itu kan tipe nempel ke process name”. |

Riwayat:

- Kepemilikan sumber katalog oleh Raka: SUPERSEDED BY D01.
- Saran memisahkan deadline/alert menjadi follow-up: usulan urutan kerja, bukan pengurangan scope PRD/QA.
- Spesifikasi untuk review: [dokumen desain](2026-10-28-step-process-sla-design.md); belum mendapat sign-off atau implementation plan final.
- Usulan awal membatasi drag dalam grup: sempat SUPERSEDED BY D08, lalu dikonfirmasi kembali melalui D20.
- Asumsi jumlah tahap harus selalu 18: SUPERSEDED BY D11.
- Usulan tanpa aturan uniqueness nama: REFINED BY D10; uniqueness berlaku pada pasangan dengan category.
- Pemilihan dasar waktu di layar SLA: SUPERSEDED BY D12; aturan berada pada modul pemakai.
- Nomor jawaban pengguna mengikuti PDF klarifikasi, bukan nomor Q internal pada dokumen ini.
- Usulan SLA hanya integer dan QA-025 menolak desimal: SUPERSEDED BY D19.
- Keraguan definisi category pada Q11: RESOLVED BY D17.
- Opsi Save sebagian pada Q5: REJECTED BY D18.
- Izin drag lintas grup pada D08/D14: SUPERSEDED BY D20 berdasarkan koreksi terbaru PM.
- Usulan judul grup berulang untuk urutan campuran lintas kategori: tidak lagi diperlukan setelah D20.

## §5 — Requirement yang dibawa dari PRD/QA

Keputusan D07–D13 memperbarui requirement sumber yang berbeda; QA perlu menyesuaikan acceptance yang terdampak.

- MUST: tampilkan tahap yang tersedia pada backend; jangan validasi jumlah persis 18.
- MUST: nama, tipe, dan SLA wajib diisi; SLA boleh desimal, minimal 1, tanpa batas maksimum bisnis tambahan.
- MUST: pasangan nama proses + grup/kategori unik; nama yang sama pada grup berbeda diperbolehkan.
- MUST: sediakan pengaturan urutan hanya dalam grup/kategori yang sama, nomor otomatis, dan judul grup.
- MUST: drop lintas kategori tidak mengubah daftar maupun urutan yang tersimpan.
- MUST: drag mempertahankan kategori, nama, tipe, identitas, dan SLA tahap; yang berubah hanya urutan.
- MUST: daftar mengikuti data backend tanpa Add/Delete tahap pada layar ini sekarang.
- MUST: simpan perubahan melalui Save; Cancel mengembalikan nilai terakhir yang tersimpan.
- MUST: seluruh perubahan pada satu Save berhasil bersama atau seluruhnya dibatalkan; jangan simpan sebagian.
- MUST: jangan tampilkan halaman detail terpisah untuk alur konfigurasi ini.
- MUST: sediakan referensi nama tahap pada Approval dan Dispute Workflow.
- MUST: transaksi yang masuk tahap setelah Save memakai SLA terbaru.
- MUST: transaksi yang sudah berada pada tahap mempertahankan deadline sebelumnya.
- MUST: hasil penyimpanan dan validasi terlihat oleh pengguna.
- MUST: setiap tab memiliki aksi simpan; Next menyimpan sebelum berpindah.
- QA-006/009/011/028 memakai katalog tetap 18; ini perlu revisi mengikuti D11.
- D15 menetapkan penambahan/pengurangan tahap melalui database untuk saat ini; jangan membuat Add/Delete di scope UI sekarang.
- QA-025 perlu direvisi: desimal valid seperti 1,5 harus diterima sesuai D19; nilai di bawah 1 tetap ditolak.
- QA-029 menambahkan ekspektasi propagasi urutan; makna urutan belum ditentukan.
- Angka SLA `1` pada desain dan fixture bukan keputusan default bisnis; D07 hanya menetapkan minimum.
- QA-034/036 dibawa sebagai acceptance modul pemakai; hari kerja/kalender tidak dipilih pada layar ini.
- QA-035 ditunda sambil menunggu pemeriksaan alarm oleh pengguna, sesuai D13.

## §6 — Batas kontrak yang diusulkan

Status seluruh bagian ini: PROPOSED. Belum menjadi API contract final.

- Identitas tahap tetap stabil dan terpisah dari nama, posisi, serta label role.
- Respons perlu menyampaikan identitas, nama, tipe, kelompok role, urutan, dan SLA.
- `stageCategory` dan `roleCode` lama tidak otomatis sama dengan enam role group pada PRD.
- Petakan DTO backend ke model frontend secara eksplisit.
- Satu Save menyimpan kumpulan perubahan dalam satu transaksi database, sesuai D18.
- Backend memvalidasi payload sebelum menulis; frontend menampilkan kesalahan per field/baris.
- Gunakan Axios instance yang sudah ada, TanStack Query, React Hook Form, dan Zod.
- Jangan fallback ke mock saat API gagal.
- Invalidasi konfigurasi dan opsi workflow yang terdampak setelah Save berhasil.
- Pertahankan permission yang sudah ada; perubahan otorisasi memerlukan pembahasan terpisah.
- Rute/metode bulk, bentuk error, dan pemeriksaan konflik perubahan ditetapkan setelah Q4, Q5, dan Q7 selesai.
- Jangan menambah endpoint, kolom, versi dependency, atau model versioning spekulatif pada tahap draft.

## §7 — Pertanyaan blocking / structural

### Q1 — Dasar waktu SLA — diserahkan ke modul pemakai

Jenis: resolved by scope allocation. Tidak memblokir konfigurasi; aturan runtime tetap dimiliki modul pemakai.

Taruhan: hasil deadline berbeda menurut kalender, jam mulai, dan zona waktu.
UI dapat menampilkan nilai hari, tetapi runtime tidak boleh menebak aturan tersebut.

- Opsi A: hari kalender, deadline pada jam masuk tahap; sederhana tetapi menghitung hari libur.
- Opsi B: hari kerja menurut kalender resmi, pada jam masuk tahap; memerlukan sumber kalender yang berlaku.
- Opsi C: hari kerja dengan cutoff/jam operasional; lebih rinci dan memerlukan aturan cutoff.

Rekomendasi: B, jika PM menyediakan definisi dan kalender kerja resmi.
Konfirmasi juga zona waktu dan perlakuan transaksi yang masuk pada hari nonkerja.
Status: RESOLVED → D12 untuk scope layar ini.
Opsi dan rekomendasi di atas adalah riwayat; bukan aturan yang diterapkan pada konfigurasi saat ini.

### Q2 — Alert menjelang dan melewati deadline

Jenis: needs external confirmation. Memblokir: QA-035 dan integrasi notifikasi.

Taruhan: kata “mendekati” belum menentukan waktu, penerima, kanal, atau frekuensi.
Jangan mengirim notifikasi berulang tanpa aturan yang disepakati.

- Opsi A: alert saat overdue saja; lebih sederhana tetapi tidak memenuhi bagian “mendekati” tanpa perubahan requirement.
- Opsi B: satu pengingat H-1 dan satu alert overdue melalui notifikasi aplikasi kepada PIC tahap.
- Opsi C: B ditambah email atau eskalasi; memerlukan aturan penerima dan pengulangan tambahan.

Rekomendasi: B; jika Q1 memilih hari kerja, H-1 juga mengikuti hari kerja.
PM perlu menentukan perilaku pengingat ketika SLA hanya satu hari.
Status: DEFERRED → D13. Pengguna akan memeriksa ketersediaan alarm.
Rekomendasi H-1/overdue di atas belum disetujui dan tidak diimplementasikan sekarang.

### Q4 — Batas drag dan arti urutan

Jenis: needs external confirmation. Memblokir: persistensi urutan dan QA-026–029.

Taruhan: urutan visual tidak sama dengan urutan eksekusi workflow.
Drag lintas role dapat bertentangan dengan pengelompokan enam role yang tetap.

- Opsi A: reorder dalam role yang sama; urutan dipakai untuk tampilan dan referensi.
- Opsi B: reorder lintas role dengan role tetap; perlu definisi nomor global dan urutan kelompok.
- Opsi C: reorder mengubah alur eksekusi; memerlukan desain dampak transaksi/workflow.

Status terkini: RESOLVED → D20, opsi A untuk batas drag: hanya dalam grup/kategori yang sama.
Riwayat: izin lintas grup pada D08/D14 dibatalkan oleh koreksi terbaru pengguna dari PM.
PM menjelaskan tipe melekat pada process name; drag tidak memisahkan atau mengubah data proses tersebut.
Pernyataan itu bukan keputusan baru bahwa field Process Type menjadi read-only; aturan edit field tidak diubah oleh koreksi drag.
Pertahankan judul grup; jangan membuat tampilan judul berulang untuk urutan campuran lintas grup.
Tolak perpindahan lintas kategori pada interaksi pointer, keyboard, dan validasi penyimpanan urutan.
Jangan simpulkan perubahan alur eksekusi workflow dari izin drag.

### Q5 — Save kolektif dan kegagalan

Jenis: needs external confirmation. Memblokir: kontrak update dan QA-018/032/033.

Taruhan: satu tombol Save dapat menulis beberapa baris.
API satu-tahap saat ini tidak menjamin satu transaksi untuk seluruh tab.

- Opsi A: semua perubahan berhasil atau semua dibatalkan; hasil mudah dipahami dan diverifikasi.
- Opsi B: simpan sebagian dengan laporan per baris; pemulihan dan UI lebih rumit.

Rekomendasi A diterima melalui D18; jangan gunakan rangkaian PUT terpisah sebagai pengganti transaksi kolektif.
Status: RESOLVED untuk atomicity → D18. Satu baris invalid membatalkan seluruh Save.
Strategi dua Administrator mengubah data bersamaan tetap merupakan detail kontrak yang perlu ditinjau.
Riwayat: pengguna sebelumnya meminta penjelasan maksud Save banyak tahap, lalu memilih pembatalan seluruh Save.
Contoh: ubah SLA tahap A dan B, lalu klik Save satu kali pada tab yang sama.
Expected result: jika B invalid/gagal, perubahan A juga tidak tersimpan.

### Q7 — Pemetaan katalog lama ke daftar tahap saat ini

Jenis: needs further investigation, lalu external confirmation untuk pemetaan yang ambigu.
Memblokir: migrasi katalog dan integrasi workflow.

Taruhan: delapan kode lama sudah dipakai workflow.
Menghapus atau mengganti kode dapat memutus referensi dan mengubah perilaku transaksi.

- Opsi A: pertahankan kode lama yang semantik tahapnya sama; tambahkan tahap yang belum ada melalui migrasi baru.
- Opsi B: ganti katalog beserta seluruh referensinya; membutuhkan pemetaan lengkap dan migrasi terkoordinasi.

Rekomendasi: A sejauh pemetaan semantik terbukti benar.
Kode seperti `budget-plan-approval` belum mempunyai padanan langsung yang jelas dalam daftar PRD.
Inventarisasi penggunaan setiap kode sebelum meminta keputusan pemetaan kepada PM.
Jangan mengedit migrasi lama atau hanya memperbarui seeder yang sudah pernah dijalankan.
Status: OPEN; bukan izin mengganti ID atau menghapus data lama.
Hasil investigasi lanjutan dan matriks pemetaan tersedia pada §14; pemetaan bisnis belum disetujui.

### Q9 — Pemilik runtime dan lingkungan uji integrasi — handoff modul

Jenis: needs a resource not available here, ditambah further investigation.
Memblokir: QA-034–036 dan penentuan repo untuk implementation plan integrasi.

Taruhan: tiga repo lokal cukup untuk konfigurasi, tetapi belum membuktikan kepemilikan seluruh transaksi.
Kelengkapan fitur memerlukan pembuktian deadline dan alert pada service yang benar-benar menjalankan tahap.

- Opsi A: gunakan service transaksi yang sudah berjalan di environment uji yang disepakati.
- Opsi B: checkout dan jalankan service transaksi yang diperlukan secara lokal.

Rekomendasi: identifikasi service pemilik terlebih dahulu; gunakan B jika perlu mengubah kode runtime-nya.
Frontend Tax/Payable hanya diperlukan untuk pengujian UI transaksi pada modul tersebut.
Status: OPEN untuk handoff integrasi, bukan pemilihan hari kerja/kalender pada layar ini.
Dasar waktu mengikuti modul pemakai (D12); alarm menunggu pemeriksaan (D13).
Kode lokal menunjukkan pengelolaan definisi workflow, bukan runtime perpindahan tahap; detail pada §14.

## §8 — Pertanyaan significant

### Q3 — Integer, batas nilai, dan nilai awal SLA

Jenis: needs external confirmation. Memblokir: validasi dan kontrak SLA final.

- Opsi A: integer minimal satu hari; selaras dengan tipe backend dan frontend saat ini.
- Opsi B: angka positif boleh desimal; memerlukan presisi dan aturan konversi waktu.

Status: RESOLVED untuk domain nilai → D07/D19: desimal boleh, minimum 1, tanpa maksimum bisnis tambahan.
Nilai awal per tahap tetap berasal dari data katalog; belum ada keputusan menggantinya secara massal.
Jangan menambah maximum pada schema frontend; batas representasi tipe data perlu ditangani secara teknis, bukan dianggap batas bisnis.
Nilai satu hari pada desain dan tiga hari pada seeder tidak dianggap keputusan nilai awal.
Backend memakai `Integer` dan kolom SQL `INTEGER`; diperlukan perubahan tipe dan migrasi baru untuk menerima desimal.
Usulan teknis: BigDecimal pada Java dan tipe NUMERIC tanpa pembulatan/truncation ke integer.
Migrasi konversi harus mempertahankan nilai SLA lama; jangan mengedit V69 yang sudah ada.
Input “1,5” pada UI harus mempertahankan nilai desimal, dengan representasi payload API yang konsisten.

### Q6 — Perubahan belum disimpan saat pindah tab/halaman

Jenis: needs external confirmation. Memblokir: alur navigasi draft final.

- Opsi A: konfirmasi Simpan / Buang Perubahan / Tetap Mengedit; mencegah kehilangan data diam-diam.
- Opsi B: pertahankan draft saat pindah tab; navigasi keluar halaman masih memerlukan aturan.
- Opsi C: buang perubahan saat pindah; paling sederhana tetapi berisiko kehilangan input.

Rekomendasi: A; pertahankan draft jika Save gagal.
Status: PARTIALLY RESOLVED → D09: aksi simpan tersedia per tab; Next menyimpan lalu lanjut.
Next tidak boleh berpindah bila penyimpanan gagal.
Perilaku klik judul tab langsung atau keluar halaman dalam kondisi dirty masih terbuka.

## §9 — Pertanyaan minor / penyelarasan QA

### Q8 — Batas validasi dan expected result kontrol

Jenis: external confirmation untuk aturan produk; further investigation untuk detail kontrol.

- Usulkan pesan kosong “SLA wajib diisi”; nilai tidak valid “SLA harus berupa angka positif”.
- Usulkan dropdown hanya empat tipe yang diizinkan; uji payload ilegal juga di backend.
- Tentukan metode QA-016 karena dropdown saat ini tidak menyediakan nilai kosong.
- Nama wajib diisi mengikuti PRD; pasangan nama + category harus unik sesuai D10.
- Nama sama pada category berbeda tidak otomatis ditolak; ID tetap menjadi referensi workflow.
- Category adalah grup layar menurut D17; case sensitivity, whitespace, dan batas panjang masih perlu kontrak yang jelas.
- Selaraskan QA-031 jika Cancel tetap disabled ketika tidak ada perubahan.
- Perbaiki typo desain “Subtantive Approval” mengikuti PRD “Substantive Approval”.
- Jangan simpulkan sticky footer, state loading, atau state disabled dari satu PDF statis.

Status: OPEN; tidak ada perubahan perilaku dari draft ini.

### Q10 — Sumber perubahan jumlah tahap

Jenis: needs external confirmation. Memblokir: keputusan menambah operasi create/delete.
Status awal: PARTIALLY RESOLVED → D11: jumlah tahap tidak tetap.
Opsi A: layar mengikuti seluruh data backend; penambahan/pengurangan dikelola sumber katalog lain.
Opsi B: layar ini menyediakan Add/Delete, dengan aturan penghapusan tahap yang sudah direferensikan.
Status sekarang: RESOLVED → D15, mengikuti opsi A untuk scope saat ini.
Pengguna menyatakan screen pengelolaan tersedia, tetapi operasinya sekarang dilakukan via database.
Ini bukan perintah menjalankan INSERT/DELETE pada database bersama; perubahan data tetap memerlukan tugas yang jelas.

### Q11 — Category untuk uniqueness

Jenis: needs external confirmation. Memblokir: key uniqueness dan validasi duplikat.
Status awal: PARTIALLY RESOLVED → D10: pasangan nama + category unik.
Opsi A: category adalah role group pada layar.
Opsi B: category adalah StageCategory workflow lama.
Keduanya berbeda menurut bukti §14; jangan pilih berdasarkan kesamaan istilah.
Status sekarang: RESOLVED → D17, opsi A: category adalah grup pada layar.
D16 menegaskan domain Stage Proses; D17 melengkapi definisi category.
Drag hanya dalam category/grup yang sama sesuai D20; uniqueness tidak boleh dihitung dari posisi drop.

## §10 — Pemetaan acceptance QA

| Skenario | Bukti selesai yang diperlukan | Dependensi |
|---|---|---|
| 001–005 | Akses Administrator, tiga tab yang disepakati, edit inline tanpa halaman detail. | D03, Q6 untuk kondisi dirty |
| 006–011 | Daftar tahap backend dan judul grup; dataset awal dapat berisi 18. Tanpa Add/Delete UI sekarang. | D11/D15/D20, Q7 |
| 012–019 | Update nama/tipe/SLA via API; unik per grup, Save atomic, reload tetap menyimpan data. | D17–D19, Q8 |
| 020–025 | Nilai di bawah 1 ditolak; desimal valid diterima. QA-025 direvisi sesuai D19. | D07/D19, Q8 |
| 026–029 | Drag dalam grup, tolak lintas kategori, penomoran, Cancel, dan persistensi; jumlah sesuai dataset. | D11/D18/D20, Q7 |
| 030–033 | Save/Cancel konsisten, kegagalan tidak menimpa data lama, pesan hasil benar. | Q5, Q8 |
| 034, 036 | Modul pemakai memakai nilai SLA dan mempertahankan deadline tahap yang sudah berjalan. | D12, handoff Q9 |
| 035 | Ditunda; ketersediaan alarm diperiksa pengguna. Jangan klaim skenario lulus dari konfigurasi. | D13 |
| 037–038 | Approval/Dispute memakai katalog dan ID tahap yang sama. | Q7 dan pemilik konsumen |

Tambahan tes yang diusulkan:

- Reload dan login ulang tetap membaca konfigurasi tersimpan dari API.
- Kegagalan API mempertahankan draft dan tidak menampilkan toast sukses.
- Pengguna tanpa izin ditolak oleh backend, termasuk request langsung.
- Payload berisi tahap duplikat/hilang/asing ditolak sesuai kontrak final.
- Nama berubah tanpa memutus referensi ID workflow.
- Transaksi lama yang baru masuk tahap setelah Save memakai SLA terbaru pada tahap tersebut.
- Satu baris invalid dalam Save kolektif mengikuti keputusan Q5.
- Dua administrator menyimpan perubahan mengikuti strategi konflik yang disepakati.
- Nama sama pada category berbeda dan pasangan nama/category duplikat mengikuti D10 serta definisi Q11.
- Daftar berjumlah kurang/lebih dari 18 tetap tampil dan dapat disimpan sesuai kontrak final.
- Drag dalam grup mengubah urutan dan penomoran tanpa mengubah nama, tipe, kategori, atau SLA tahap.
- Drop lintas kategori melalui pointer/keyboard tidak mengubah daftar; request urutan yang melanggar aturan ditolak.
- Save & Next berpindah hanya setelah simpan berhasil.
- SLA 1,5 tersimpan dan terbaca kembali tanpa berubah menjadi 1 atau 2.
- SLA 0,5 ditolak meskipun merupakan angka positif, karena minimum yang disepakati adalah 1.
- Duplikat pasangan nama/grup dalam satu Save membatalkan seluruh transaksi penyimpanan.

## §11 — Urutan kerja awal, bukan implementation plan final

Setiap item implementasi final harus memiliki acceptance criterion, daftar lokasi, dan cara verifikasi.
Pisahkan item per repository; jangan menjadikan satu item sebagai perubahan tiga repo sekaligus.

1. Tetapkan baseline branch dan inventaris referensi kode tahap lama.
2. Gunakan D07–D20 beserta status superseded untuk kontrak; lengkapi pemetaan legacy dan detail interaksi yang masih terbuka.
3. Susun slice baca: katalog yang disepakati, API list, dan frontend membaca data nyata.
4. Susun slice simpan: kontrak bulk, validasi, persistensi, dan Save/Cancel frontend.
5. Buktikan perubahan nama dan urutan pada konsumen Approval/Dispute.
6. Cocokkan tampilan Process & Reference dan seluruh state terhadap referensi yang tersedia.
7. Siapkan handoff nilai SLA ke modul pemakai; basis waktu di modul tersebut. Alarm menunggu hasil pemeriksaan pengguna.
8. Jalankan matriks QA konfigurasi dan integrasi; laporkan tiap skenario yang belum dapat dijalankan.

Tidak semua pertanyaan memblokir semua slice.
Q1 tidak lagi memblokir konfigurasi setelah D12; Q2 ditunda sesuai D13.
Konfigurasi selesai tidak boleh diklaim sebagai bukti seluruh integrasi deadline/alarm selesai.

## §12 — Verifikasi, risiko, dan batas otorisasi

- Jalankan lint dan build frontend sesuai aturan repository saat kode frontend berubah.
- Arahkan output pemeriksaan ke `.output/`; jangan commit artefak runtime.
- Gunakan pengujian backend/shared yang relevan serta database lokal untuk migrasi baru.
- Periksa dokumentasi dependency melalui Context7 sebelum implementasi API library; tool belum tersedia pada sesi ini.
- Verifikasi UI Administrator di browser; HTTP 200 saja tidak membuktikan halaman konfigurasi berfungsi.
- Uji visual memerlukan viewport, fixture, font, dan state yang sama dengan referensi.
- Jangan mengklaim kecocokan piksel sebelum bukti perbandingan tersedia.
- Evaluasi konflik branch frontend sebelum menerapkan pekerjaan fitur; jangan merge/rebase tanpa keputusan.
- Jangan mengubah versi dependency untuk mengatasi mismatch snapshot tanpa izin pengguna.
- Jangan menuliskan secret atau nilai environment ke dokumen maupun output tool.

## §13 — Review dan langkah berikut

- 2026-10-28: pengguna menyetujui pembuatan draft scope dan daftar keputusan.
- 2026-10-28: draft disusun dari PRD, QA, ekspor Figma, kode, dan baseline lokal.
- Dokumen ini belum merupakan persetujuan atas opsi A/B/C pada pertanyaan terbuka.
- Belum ada implementasi fitur, migrasi, perubahan API, atau perubahan UI dari draft ini.
- Langkah berikut: susun spesifikasi konfigurasi berdasarkan keputusan aktif hingga D20, dengan review pemetaan legacy dan detail interaksi.
- Setelah keputusan utama selesai, render spesifikasi untuk review pengguna sebelum implementation plan final.
- 2026-10-28: pengguna meminta pengerjaan dilanjutkan; investigasi teknis §14 dan matriks kontrak §15 ditambahkan.
- Pernyataan sebelumnya bahwa jawaban PDF belum tersedia: SUPERSEDED oleh jawaban pengguna nomor 1–8 pada pembaruan berikut.
- 2026-10-28: D07–D13 dicatat; Q3/Q4/Q6/Q8 diperbarui, Q1 dialokasikan ke modul pemakai, Q2 ditunda.
- QA jumlah tetap 18 dan pembatasan drag perlu revisi; operasi Add/Delete belum otomatis disetujui.
- Pertanyaan Save kolektif dijelaskan dengan contoh; keputusan atomicity masih terbuka.
- 2026-10-28: D14–D16 dicatat. Grup asal dipertahankan saat drag; jumlah tahap dikelola melalui database untuk saat ini.
- Penegasan “unik buat di stage proses” dicatat sebagai domain aturan; definisi field category masih memerlukan contoh konkret.
- Pernyataan definisi category masih terbuka: SUPERSEDED BY D17.
- 2026-10-28: D17–D19 dicatat; category adalah grup layar, Save atomic, SLA desimal diperbolehkan.
- QA-025 perlu diperbarui; tipe Integer/INTEGER lama tidak memenuhi requirement desimal.
- 2026-10-28: koreksi terbaru PM dicatat sebagai D20; drag hanya dalam grup, menggantikan D08/D14.
- Alasan PM: tipe melekat pada process name. Drag tidak mengubah tipe atau kategori; tidak ada perubahan aturan edit tipe dari pesan ini.
- 2026-10-28: pengguna mengonfirmasi kembali D20 dan meminta langkah berikut; spesifikasi konfigurasi dirender untuk review, belum signed off.
- Dokumen review: [Spesifikasi Konfigurasi Step Proses & SLA](2026-10-28-step-process-sla-design.md).
- Pertanyaan kontrak yang tersisa tetap pada draft; persetujuan aturan drag bukan persetujuan semua detail teknis atau navigasi.

## §14 — Investigasi referensi katalog dan runtime

Status: EVIDENCE, pemeriksaan read-only pada baseline §2. Ini bukan persetujuan pemetaan atau migrasi.

### Empat kategori workflow berbeda dari enam role group

`StageCategory.java` hanya menerima `BUSINESS_LAYER`, `FSSC_POP`, `FINANCIAL`, dan `TREASURY`.
`ApprovalWorkflowService.getDetailWorkflow()` memanggil `StageCategory.getByKey()`.
`DisputeWorkflowMapper` juga memakai kategori tersebut untuk label respons.
Mengganti kategori menjadi label role group PRD dapat membuat pembacaan workflow gagal.

Rekomendasi teknis: pertahankan makna kategori workflow; representasi role group perlu dipetakan secara eksplisit.
Jangan menganggap `roleCode` berarti role group; kode itu mempunyai makna role yang perlu dipastikan.

### Tipe teknis berbeda dari tipe bisnis

`ApprovalWorkflowService.buildApprovalWorkflowDSL()` mengisi `LevelDSL.type` dari `catalog.getKind()`.
Seeder menetapkan `kind` dan `processType` sebagai `USER_TASK`.
PRD memakai Submission, Verification, Approval, dan Execution untuk tipe bisnis.
Perubahan tipe bisnis tidak boleh mengubah `kind` secara implisit.
Test service saat ini justru mengharapkan `processType=USER_TASK`; test itu belum membuktikan kontrak bisnis PRD.

### Referensi yang bergantung pada kode katalog

| Konsumen | Penyimpanan/pemakaian | Dampak perubahan ID |
|---|---|---|
| Approval Workflow | `LevelDSL.id` dan `LevelDSL.stageCode` pada dokumen JSON workflow | Detail mencari kode ke katalog; penggantian kode dapat membuat resolusi gagal. |
| Dispute Workflow | `c_dispute_workflow_stage_code` | Kode menentukan aturan reject dan aktivasi tahap. |
| Tujuan setelah dispute | `c_dispute_workflow_stage_process` | Nilai dipakai untuk tujuan tahap lain; perlu ikut inventaris referensi. |
| Opsi frontend Approval | `stageProcessOptions(stageCategory)` | Filter kategori lama masih berlaku; role group baru tidak boleh langsung menggantikannya. |
| Daftar frontend Dispute | Respons `StageCatalogDTO` | Nama diturunkan dari katalog, bukan salinan ID frontend `STAGE-01`. |

### Matriks 18 tahap PRD terhadap katalog lama

“Nama cocok” hanya membuktikan kesamaan label pada snapshot lokal, bukan keputusan migrasi data bersama.
“Kandidat” harus divalidasi terhadap proses bisnis sebelum kode dipakai ulang.
“Belum ada” berarti belum ditemukan dalam delapan entri katalog lokal, bukan ketiadaan service transaksi.

| No. | Tahap PRD | Bukti/kandidat kode lama | Status |
|---|---|---|---|
| 1 | Partner Submission | Belum ada | Perlu identitas tahap baru sesuai kontrak final. |
| 2 | Update/Revise Invoice Submission | Belum ada | Perlu identitas tahap baru sesuai kontrak final. |
| 3 | Business Unit Submission | Belum ada | Perlu identitas tahap baru sesuai kontrak final. |
| 4 | Accountability Report | Belum ada | Perlu identitas tahap baru sesuai kontrak final. |
| 5 | Business Unit Verification | Belum ada | Perlu identitas tahap baru sesuai kontrak final. |
| 6 | Substantive Approval | `substantive-approval` | Nama cocok. |
| 7 | Budget Availability Request | Tidak ada padanan yang terbukti | Jangan otomatis memakai `budget-approval`. |
| 8 | Budget Availability Approval | `budget-approval` / `budget-plan-approval` | Dua kandidat ambigu; jangan digabung tanpa keputusan. |
| 9 | Payment Readiness Check | `fssc-verification` | Kandidat; nama dan makna perlu konfirmasi. |
| 10 | Dispute & Resolution | Belum ada | Enum tujuan dispute bukan entri katalog tahap. |
| 11 | Reconciliation | Belum ada | Perlu identitas tahap baru sesuai kontrak final. |
| 12 | Financial Control | `financial-control` | Nama cocok. |
| 13 | Financial Authority | `financial-approval` | Kandidat; nama dan makna perlu konfirmasi. |
| 14 | Set Source of Fund | Belum ada | Perlu identitas tahap baru sesuai kontrak final. |
| 15 | Payment Preparation | Belum ada | Perlu identitas tahap baru sesuai kontrak final. |
| 16 | Cashout Verification | `cashout-verification` | Nama cocok. |
| 17 | Cashout Authorization | `cashout-approval` | Kandidat; nama dan makna perlu konfirmasi. |
| 18 | Payment Execution | Belum ada | Perlu identitas tahap baru sesuai kontrak final. |

Lima kode lama belum memiliki pemetaan PRD yang pasti.
Tiga kode memiliki label yang sama dengan tahap PRD.
Jangan menyimpulkan bahwa menambah sepuluh entri otomatis menghasilkan katalog 18 tahap yang benar.
Kebijakan terhadap entri legacy yang tidak mendapat padanan harus ditetapkan sebelum migrasi.

### Bukti database lokal

Pemeriksaan dilakukan pada container `fintra-dev-postgres`, database `fintra_dev`, pengguna `fintra_dev`.
Hasil: 8 entri katalog, 0 definisi workflow, 0 aturan dispute, dan 0 referensi `levels[].stageCode`.
Tidak ditemukan foreign key menuju tabel katalog pada database lokal tersebut.
Hasil nol pada database baru tidak membuktikan bahwa environment bersama tidak memiliki referensi.
Referensi JSON juga tidak otomatis dilindungi foreign key database.

Query read-only yang dapat diulang setelah masuk ke database lokal:

```sql
SELECT c_stage_catalog_code, c_stage_catalog_category, c_stage_catalog_name
FROM finance_finalink.finalink_t_stage_catalog
ORDER BY c_stage_catalog_code;

SELECT 'workflow_definitions' AS source, count(*) AS row_count
FROM finance_finalink.finalink_t_workflow_definition
UNION ALL
SELECT 'dispute_rules', count(*)
FROM finance_finalink.finalink_t_dispute_workflow;

SELECT conname, conrelid::regclass AS source_table
FROM pg_constraint
WHERE contype = 'f'
  AND confrelid = 'finance_finalink.finalink_t_stage_catalog'::regclass;

SELECT count(*) AS workflow_stage_references
FROM finance_finalink.finalink_t_workflow_definition w
CROSS JOIN LATERAL jsonb_array_elements(
  COALESCE(w.c_workflow_definition_document->'levels', '[]'::jsonb)
) l
WHERE l->>'stageCode' IS NOT NULL;
```

### Batas bukti runtime

`WorkflowService` menyimpan dan membaca definisi JSON berversi dengan checksum.
`ApprovalWorkflowDSL.LevelDSL` belum menyimpan SLA, waktu masuk tahap, atau deadline.
Pencarian `getSlaDays`, `setSlaDays`, `slaDays`, dan `sla_days` pada source Java lokal hanya menemukan katalog/konfigurasi.
Belum ditemukan konsumen SLA pada runtime transaksi di dua repository Java yang tersedia.
Seeder navigasi memuat menu Payable untuk financial control, payment preparation, dan payment execution.
Menu tersebut adalah petunjuk lokasi proses, bukan bukti implementasi atau kepemilikan backend.
Enum hari kalender/kerja ditemukan pada Term of Payment; enum itu tidak membuktikan adanya kalender atau kalkulator SLA.

Langkah lanjutan Q9: dapatkan lokasi repository/backend transaksi terkait, lalu telusuri event masuk tahap dan kepemilikan notifikasi.
Jangan membangun runtime transaksi baru di `fintra_be` hanya karena service pemiliknya belum tersedia lokal.

### Batas bukti pengujian

- `StageProcessServiceTest` memiliki tujuh unit test untuk pencarian, update SLA, dan nilai SLA tidak valid.
- `StageProcessControllerTest` memiliki dua test dengan `MockMvcBuilders.standaloneSetup`.
- Standalone controller test tersebut belum membuktikan permission `@PreAuthorize` berjalan melalui security chain.
- Belum ditemukan file test bernama stage-process/setup-configuration pada `src` dan `tests` frontend.
- Pencarian nama file itu bukan bukti bahwa tidak ada pengujian generik yang menyentuh layar ini.
- Tidak ada test baru atau pengulangan suite dalam investigasi read-only ini.

## §15 — Matriks kesiapan kontrak konfigurasi

Status: PROPOSED / belum ada perubahan API. Matriks memisahkan fakta kontrak saat ini dari kebutuhan desain.

| Data/perilaku | Kontrak saat ini | Kebutuhan dan keputusan tersisa |
|---|---|---|
| Identitas tahap | `stageCode`; frontend mock memakai `id=STAGE-xx` | Pertahankan ID backend; pemetaan legacy menunggu Q7. |
| Nama | Respons `name`; payload update tidak memiliki nama | Unik bersama grup layar (D10/D17); batas panjang/normalisasi perlu kontrak Q8. |
| Tipe bisnis | `processType` string opsional; seeder `USER_TASK` | Empat tipe PRD; jangan ubah tipe teknis `kind`. |
| Kelompok role | Respons `stageCategory` dan `roleCode` | Enam kelompok PRD belum dipetakan; jangan gunakan kategori lama secara langsung. |
| Urutan | Tidak ada field respons/entity; list diurutkan nama | Drag hanya dalam grup/kategori (D20); tolak lintas kategori dan simpan urutan tanpa mengubah data tahap. |
| SLA | Integer positif pada DTO backend dan kolom INTEGER | Desimal minimal 1 (D19); ubah tipe tanpa kehilangan presisi, dengan migrasi baru. |
| Jumlah tahap | Fixture dan schema frontend mewajibkan persis 18 | Data-driven sesuai D11/D15; pengelolaan sementara via DB, tanpa Add/Delete UI. |
| Navigasi tab | Tiap tab memiliki Save; belum ada kontrak Next bersama | Next berarti Save & Next (D09); direct-tab dirty behavior menunggu Q6. |
| Save seluruh tab | PUT satu tahap tersedia | Atomicity disetujui D18; bulk transaction diperlukan, strategi konflik perlu review. |
| Referensi Approval | Opsi berdasarkan empat kategori workflow | Pertahankan kontrak kategori sampai pemetaan disepakati. |
| Referensi Dispute | Mencari katalog dari kode tahap | Pertahankan resolusi ID; uji perubahan label tanpa kehilangan aturan. |

HTTP frontend sudah memiliki `apiClient` dari `@railfinance/core/lib` pada service Approval Workflow.
Gunakan boundary autentikasi yang sudah tersedia; jangan membuat Axios instance baru khusus fitur ini.
Lokasi service/query/mutation harus mengikuti aturan repository dan kontrak final.
Penyesuaian Zod dan React Hook Form dilakukan setelah bentuk payload disepakati.

Tidak ada perubahan file fitur Step Proses/Setup Configuration pada diff merge-base terhadap remote-tracking frontend terakhir.
Divergensi branch tetap ada dan tetap perlu diselesaikan sebelum implementasi; hasil diff terbatas itu bukan izin merge/rebase.
