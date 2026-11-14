# Kontrak API Konfigurasi Step Proses & SLA

Stage: impl-planned. Scope: spesifikasi konfigurasi yang sudah disetujui.

## Operasi

- GET `/api/master-data/stage-processes`: envelope ApiResponse dengan array konfigurasi.
- GET `/api/master-data/stage-processes/{stageCode}`: satu konfigurasi.
- PUT `/api/master-data/stage-processes`: satu Save atomik untuk seluruh katalog yang dibaca.
- PUT individual yang sudah ada tetap tersedia; SLA menerima desimal minimal 1.
- Permission tetap `master-data:stage-process:list`, `read`, dan `update` sesuai operasi.

## Record respons

Field lama dipertahankan: `stageCode`, `name`, `stageCategory`, `processType`, `roleCode`, `slaDays`.
Tambahan: `roleGroup` sebagai label kategori konfigurasi, `sequence` positif, dan `version` untuk konflik perubahan.
`slaDays` berupa JSON number desimal; Java memakai BigDecimal dan SQL NUMERIC.
`stageCategory` dan `roleCode` tetap milik kontrak workflow lama.

## Body Save

```json
{
  "items": [
    {
      "stageCode": "financial-control",
      "name": "Financial Control",
      "roleGroup": "Financial",
      "processType": "Approval",
      "slaDays": 1.5,
      "sequence": 1,
      "version": 0
    }
  ]
}
```

Contoh satu record bukan batas jumlah tahap atau pemetaan ulang grup bisnis.
Request harus memuat seluruh ID katalog saat ini, tanpa ID duplikat/hilang/asing.
Group yang dikirim harus sama dengan group tersimpan; hanya urutan dalam grup yang boleh berubah.
Sequence unik dan berurutan pada daftar; kelompok tetap berdekatan sesuai urutan respons.
Version harus sama dengan yang dibaca; konflik menolak seluruh penyimpanan.
Tidak ada create/delete atau perubahan group melalui operasi ini.

## Validasi dan transaksi

- Nama wajib, setelah trim, maksimal panjang kolom database 250.
- Uniqueness memakai nama trim case-insensitive di dalam roleGroup yang sama, mempertahankan normalisasi mock lama.
- SLA finite, minimal 1, boleh desimal; tidak ada maksimum bisnis.
- Tipe bisnis: Submission, Verification, Approval, Execution.
- Validasi seluruh request sebelum mutasi entity; satu transaksi meliputi seluruh Save.
- Konflik versi/data katalog mengembalikan kegagalan, tanpa toast sukses frontend.
- Error memakai envelope GlobalExceptionHandler yang sudah ada; field menunjuk `items[index].field` bila tersedia.

## Kompatibilitas data

- Kode katalog dan kategori workflow lama tidak diganti.
- Field roleGroup baru terpisah; data lama memakai label kategori existing sebagai fallback, bukan tebakan pemetaan enam grup PRD.
- Data group yang lebih rinci dikelola lewat database sesuai keputusan scope; tidak ada rename ID legacy otomatis.
- Konversi tipe bisnis legacy dilakukan hanya pada delapan kode yang artinya eksplisit pada label katalog; kind USER_TASK tetap.
- Tidak ada pemilihan kalender, kalkulasi deadline, atau alarm pada kontrak ini.

## Detail interaksi yang dipertahankan

- Save/Cancel tetap tersedia per tab seperti UI saat ini; tidak menambah alur Next baru.
- Save & Next hanya berlaku bila kontrol Next digunakan; kegagalan tidak memindahkan tab.
- Slice ini mempertahankan perilaku klik tab langsung yang ada; konfirmasi dirty lintas tab belum merupakan requirement yang diputuskan.
- Kontrak tidak menjanjikan angka tak terhingga; nilai di luar representasi transport/runtime ditolak secara eksplisit, bukan dipotong.
