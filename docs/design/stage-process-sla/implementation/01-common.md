# Item 01 - Persistensi konfigurasi pada railfinance-common

Lane: strict - tipe data tersimpan, uniqueness, dan transaksi kolektif berubah.
Status: implemented; focused tests and local migration passed. Scope hanya repository railfinance-common.
Spec: ../2026-10-28-step-process-sla-design.md. Contract: ../api-contract.md.

## Done when

- SLA desimal minimal 1 tersimpan tanpa pemotongan; katalog tetap data-driven.
- Save seluruh katalog atomik, menolak duplikat nama/grup, ID tidak cocok, perpindahan grup, dan versi usang.
- Kode, kind, kategori workflow, serta referensi legacy tetap utuh.

## Sites

- database_migration/src/main/resources/db/migration/master: satu migrasi baru, versi tertinggi + 1 saat eksekusi.
- common_package/src/main/java/com/kai/railfinance/common/masterdata/workflow/entity/StageCatalog.java
- common_package/src/main/java/com/kai/railfinance/common/masterdata/workflow/repository/StageCatalogRepository.java
- common_package/src/main/java/com/kai/railfinance/common/masterdata/stageprocess/dto/: response, update, dan DTO Save kolektif.
- common_package/src/main/java/com/kai/railfinance/common/masterdata/stageprocess/service/StageProcessService.java
- common_package/src/test/java/com/kai/railfinance/common/masterdata/stageprocess/service/: unit test dan integration test persistensi.

## Correctness

- Unit test: desimal, minimum, uniqueness composite, ID/group/urutan, validasi sebelum write, konflik versi.
- Integration test: rollback seluruh Save dan round-trip desimal pada database lokal.
- Flyway validate sebelum/sesudah migrate; schema lama tidak diedit.
- Install library lokal, tanpa publish registry atau mengubah versi dependency.

## Evidence

- [V] Entity saat baseline menyimpan Integer SLA dan belum mempunyai urutan/grup/version.
- [V] Service saat baseline hanya update satu tahap dan list diurutkan nama.
- [V] Tujuh test service lama tidak membuktikan Save kolektif/desimal.
- [V] Database lokal berisi delapan tahap; kode referensi tersimpan juga pada JSON workflow.

## Pre-mortem

Risiko: pemetaan kategori mengubah workflow. Sinyal: kind/kategori/kode berubah setelah Save. Cegah dengan regression assertion.
Risiko: validasi terlambat menyimpan sebagian. Sinyal: baris pertama berubah ketika baris terakhir invalid. Uji rollback database.
Rollback: revert aplikasi; pertahankan kolom additive dan NUMERIC. Jangan cast ke integer jika ada data pecahan.
Backfill: hanya group fallback kategori lama dan urutan deterministik; tidak menebak makna kode legacy.

## Slice

1. Decimal-preserving catalog read/update dan migrasi kompatibel.
2. Save kolektif tervalidasi dan atomik.
3. Seam: data nyata lokal, referensi kode, dan regresi consumers.

## Report

Implemented; 15 focused tests passed, common artifact installed locally, and V85 applied on the isolated local development database. PostgreSQL persistence checks passed in backend item 02. See verification-report.md.
