# Item 03 - Konfigurasi Administrator tersambung API fintra_fe

Lane: design - form dan alur penyimpanan yang terlihat pengguna berubah.
Status: implemented; 26 focused frontend tests passed. Authenticated browser seam pending existing local login.
Scope hanya repository fintra_fe.
Spec: ../2026-10-28-step-process-sla-design.md. Contract: ../api-contract.md.

## Done when

- Daftar mengikuti backend, tidak terkunci 18; group berasal dari record yang dibaca.
- Form RHF/Zod menerima desimal >=1 dan uniqueness nama/grup; Save atomik tanpa fallback mock.
- Drag pointer/keyboard hanya dalam grup; Cancel, loading, error, empty, dirty, dan save failure benar.
- UI yang tersedia dipakai ulang; tiga tab tetap sesuai spec, tanpa Add/Delete atau alarm.

## Sites

- src/features/master-data/stage-process/data/: types, schema, service, query/mutation, reorder helper, exports.
- src/features/master-data/stage-process/pages/stage-process.page.tsx
- src/features/master-data/stage-process/components/: row/form bila perlu dipisah.
- tests/unit/features/master-data/stage-process/: schema, reorder, API mapping dan form tests.
- src/features/settings/setup-configuration/pages/setup-configuration.page.tsx hanya bila integrasi tab membutuhkan perubahan.

## Correctness

- Red baseline: schema sekarang menolak 1.5 dan jumlah non-18; test memperlihatkan kegagalan sebelum perubahan.
- Unit test: composite uniqueness, jumlah dinamis, decimal parsing, pembatasan reorder, payload/response.
- Form/browser: Save -> reload -> nilai tetap, Cancel, duplicate failure, failed request tetap dirty.
- Lint dan build repo sesuai AGENTS; output di .output.
- Seam: login Administrator, edit melalui klik nyata, baca kembali DB, cek API error tanpa mock.

## Evidence

- [V] Service baseline selalu memilih adapter in-memory pada DEV dan gagal di production.
- [V] Schema baseline .length(18), sequence .max(18), SLA .int().
- [V] Komponen baseline memakai state manual, mengizinkan cross-group reorder dan duplicative validation.
- [V] React Hook Form, Zod resolver, React Query, dan Axios sudah terpasang; tidak perlu dependency baru.

## Constraints

- Grup tetap; reorder hanya mengubah urutan.
- Tidak ada business maximum SLA, batas 18, atau global-unique name.
- Gunakan HTTP/auth instance yang tersedia dan TanStack Query mutation.
- Pertahankan draft ketika Save gagal; reset baseline hanya setelah success atau Cancel.
- Tidak mengubah konfigurasi Vite/TypeScript/package manifest.

## Slice

1. Schema, reorder, dan kontrak API teruji.
2. Form RHF dan mutation terhubung.
3. Seam: browser Administrator dan verifikasi persistensi nyata.

## Report

Implementation complete; authenticated browser verification remains open. See verification-report.md. Baseline branch contains the previously fetched upstream merge; fresh fetch failed DNS.
