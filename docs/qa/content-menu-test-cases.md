# Content Menu Test Cases

Source: [Scenario Test FSSC Master Data - KAI](https://docs.google.com/spreadsheets/d/19Q2lnxmSpxeF9HeukOHqB66cyg0K6mrARbu79EI906E/edit?gid=1691137169#gid=1691137169), tab `MD - Content (Landing Page)`.

Test cases copied: **43**

Status legend: ✅ Passed · ❌ Failed · ⚠️ Blocked/not verifiable. These emoji labels are plain Markdown text, so they remain visible in previewers that do not render task-list checkboxes.

## DEV API retest attempt — 2026-10-17

**Retest status: ⚠️ Blocked before execution — 0/43 cases re-verified against DEV.** The live Swagger UI and OpenAPI document are reachable and expose the expected Content operations (`GET/POST /api/master-data/contents`, `GET/PUT /api/master-data/contents/{id}`, and activate/deactivate). However, direct requests to the documented Content API path return `404 page not found`; the alternate `/master-data/contents` path, root, and actuator health paths also return 404. An `OPTIONS` preflight from `http://localhost:5173` to the documented path returns 404 as well. Therefore the FE has not been switched from its current local API base, and no DEV data was changed.

**Needed to resume:** the DEV API route must be reachable at the Swagger-documented URL (including CORS for the local FE origin), or the backend team must provide the correct deployed API base URL. The existing 2026-10-16 results below are from the local backend and are not DEV verification.

## Local QA follow-up — 2026-10-17

**Current local rule-case status: ✅ 43/43 passed cumulatively; ❌ 0 failed; ⚠️ 0 unresolved acceptance-rule blockers.** The 39 previously passed local UI cases remain as recorded below. The four former blockers were verified after approval of explicit rules: only one active Content is allowed per section (duplicate Add/Edit/Activate returns `409 Conflict`); if a section has no active Content, keep the section layout but show no Master Content wording or invented fallback copy.

**Evidence for the four cases:** 9 backend Content tests passed (service and HTTP controller); 11 FE Content tests passed, including duplicate Add/Edit conflict display and preview behavior for duplicate active rows and empty sections. The FE production build passed. A fresh authenticated browser retest could not be completed: after reloading the backend, the configured local PostgreSQL credentials were rejected, and the isolated H2 runtime has no login users. Therefore this follow-up is automated local verification, not a new browser E2E pass. DEV remains unverified as noted above.

## Retest after FE API integration — 2026-10-16

**Retest status: ✅ 39 passed; ❌ 0 failed; ⚠️ 4 blocked (43 total).** Retested in the authenticated Chromium tab at `http://localhost:5173/master-data/content`, connected to the local backend on `localhost:8080`. The local backend uses an isolated in-memory/data-only Content fixture; it provides the endpoint contract but intentionally does not implement unresolved business rules. The FE also has a clearly labeled local QA preview at `/master-data/content/preview`; this is not the production landing page.

**Fixes verified:** Content pagination now uses the API's one-based page index correctly; text edits mark the form dirty and can be saved/discarded; pristine Add cancellation no longer reports unsaved changes. Activate/deactivate confirmation, action state, and success toasts were verified. Build passed; lint still reports 4 pre-existing errors and 2 warnings outside the Content feature.

**Historical note (2026-10-16):** FSSC-CNT-015, 025, 041, and 043 were blocked at that time because the required duplicate-active and empty-section rules had not yet been decided. See the 2026-10-17 local QA follow-up above for their current automated results.

## Automated Quality Checks — 2026-10-16

- **Content unit tests:** 10/10 passed across `content.service.test.ts`, `content.schema.test.ts`, and `content-form.page.test.tsx`.
- **Full unit suite:** 5,178 passed and 7 failed out of 5,185. Failures are outside Content: `tests/unit/features/master-data/partner/components/partner-contact-form-modal.test.tsx` (1), `tests/unit/features/treasury/close-payment/pages/close-payment.page.test.tsx` (3), and `tests/unit/features/treasury/open-payment/pages/deposit.page.test.tsx` (3). Reran these three files in isolation; the same 7 failures reproduced.
- **Lint:** Content source files have no lint findings. Repository lint exits non-zero for 4 errors and 2 warnings in unrelated business-unit, chart-of-account, and setup-configuration files.
- **Build:** passed with the existing Vite warning for chunks larger than 500 kB.
- **SonarQube:** not run locally. The repository contains `sonar-project.properties` and a Jenkins Sonar stage, but this environment has no Sonar MCP tool or `sonar-scanner` executable; a CI Sonar run is still required to verify the server-side quality gate.

## Core Admin - Master Data Content (Landing Page)

## List, Search & Pagination

### ✅ PASSED — FSSC-CNT-001 — Positive

```gherkin
Feature: Master Data Content - List, Search & Pagination
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Melihat halaman list Content
  Given User sudah login dan memiliki izin Read Content
  When User membuka menu Master Data > Content
  Then Sistem akan menampilkan halaman list dengan kolom Section Name, Content, dan Actions
  And Sistem akan menampilkan Search dan tombol Add Content
  And Sistem akan menampilkan jumlah All Content serta pagination Previous/Next
```

**Result:** Passed
**Reason / evidence:** Authenticated Chromium runtime showed the expected Section Name, Content, Actions, Search, Add Content, All Content count, and pagination controls.

### ✅ PASSED — FSSC-CNT-002 — Positive

```gherkin
Feature: Master Data Content - List, Search & Pagination
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Menampilkan data list sesuai record tersimpan
  Given User berada pada halaman list Content
  And Tersedia beberapa Content
  When User memeriksa isi baris pada list
  Then Setiap baris menampilkan Section Name dan Content sesuai data tersimpan
  And Kolom Actions tersedia pada setiap baris
```

**Result:** Passed
**Reason / evidence:** Observed list rows matched the API records and each row exposed its expected actions.

### ✅ PASSED — FSSC-CNT-003 — Positive

```gherkin
Feature: Master Data Content - List, Search & Pagination
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Mencari Content berdasarkan kata kunci yang cocok
  Given User berada pada halaman list Content
  And Tersedia Content yang dapat dicari
  When User memasukkan kata kunci yang sesuai Content pada Search
  Then Sistem akan menampilkan Content yang sesuai kata kunci pencarian
```

**Result:** Passed
**Reason / evidence:** Searching `Hero Banner` returned the matching row.

### ✅ PASSED — FSSC-CNT-004 — Negative

```gherkin
Feature: Master Data Content - List, Search & Pagination
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Melakukan pencarian dengan data tidak menemukan
  Given User berada pada halaman list Content
  When User memasukkan kata kunci yang tidak cocok dengan Content mana pun
  Then Sistem akan menampilkan "No Content found"
  And Pesan: Your search "[kata kunci]" did not match any Content. Please try again or add new Content.
  And Opsi Clear search tersedia dan tidak ada baris yang ditampilkan
```

**Result:** Passed
**Reason / evidence:** `no-such-content-qa` displayed “No Content found”, the expected search-help copy, Clear search, and no result rows.

### ✅ PASSED — FSSC-CNT-005 — Positive

```gherkin
Feature: Master Data Content - List, Search & Pagination
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Menghapus pencarian melalui Clear search
  Given User berada pada empty state hasil pencarian tanpa hasil
  When User klik Clear search
  Then Sistem akan menghapus input pencarian
  And Sistem akan menampilkan kembali seluruh daftar
```

**Result:** Passed
**Reason / evidence:** Clear search emptied the query and restored the list.

### ✅ PASSED — FSSC-CNT-006 — Positive

```gherkin
Feature: Master Data Content - List, Search & Pagination
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Menghapus kata kunci pencarian secara manual
  Given User berada pada halaman list Content
  And Search sedang berisi kata kunci
  When User menghapus seluruh kata kunci pada Search
  Then Sistem akan menampilkan kembali daftar sesuai kondisi tanpa search
```

**Result:** Passed
**Reason / evidence:** Manually selected and deleted the complete query; the full list returned.

### ✅ PASSED — FSSC-CNT-007 — Positive

```gherkin
Feature: Master Data Content - List, Search & Pagination
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Melihat jumlah total data dan indikator halaman
  Given User berada pada halaman list Content
  And Tersedia lebih dari satu halaman data
  When User melihat area ringkasan list
  Then Sistem akan menampilkan ringkasan All Content
  And Sistem akan menampilkan indikator halaman serta Previous/Next
```

**Result:** Passed
**Reason / evidence:** With 14 records, summary showed 1–10 of 14 and Previous/Next/page indicators.

### ✅ PASSED — FSSC-CNT-008 — Positive

```gherkin
Feature: Master Data Content - List, Search & Pagination
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Berpindah ke halaman berikutnya
  Given User berada pada halaman list Content
  And Halaman saat ini bukan halaman terakhir
  When User klik Next
  Then Sistem akan menampilkan data halaman berikutnya
  And Indikator halaman bertambah sesuai posisi baru
```

**Result:** Passed
**Reason / evidence:** Next moved to rows 11–14 and showed the updated page summary.

### ✅ PASSED — FSSC-CNT-009 — Positive

```gherkin
Feature: Master Data Content - List, Search & Pagination
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Berpindah ke halaman sebelumnya
  Given User berada pada halaman list Content yang bukan halaman pertama
  When User klik Previous
  Then Sistem akan menampilkan data halaman sebelumnya
  And Indikator halaman berkurang sesuai posisi baru
```

**Result:** Passed
**Reason / evidence:** Previous returned from page 2 to rows 1–10.

### ✅ PASSED — FSSC-CNT-010 — Positive

```gherkin
Feature: Master Data Content - List, Search & Pagination
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Mempertahankan Search saat berpindah halaman
  Given User berada pada halaman list Content
  And Search aktif dan hasilnya multi-halaman
  When User berpindah ke halaman berikutnya lalu kembali ke halaman sebelumnya
  Then Search tetap aktif
  And Data yang ditampilkan tetap sesuai kriteria pencarian
```

**Result:** Passed
**Reason / evidence:** With a multi-page search (`a`), Next retained the query and showed the matching next-page results.

## Add Content

### ✅ PASSED — FSSC-CNT-011 — Positive

```gherkin
Feature: Master Data Content - Add Content
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Membuka form Add Content
  Given User sudah login dan memiliki izin Create Content
  And User berada pada halaman list
  When User klik tombol Add Content
  Then Sistem akan menampilkan form Add Content
  And Field Section Name (dropdown), Content (text area), serta tombol Cancel dan Save tersedia
```

**Result:** Passed
**Reason / evidence:** Add Content opened with Section Name, Content, Status, Cancel, and Save controls.

### ✅ PASSED — FSSC-CNT-012 — Positive

```gherkin
Feature: Master Data Content - Add Content
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Menambahkan Content dengan data valid
  Given User berada pada form Add Content
  And Section Name yang dipilih belum memiliki Content aktif, atau sesuai aturan satu aktif per section
  When User memilih Section Name dan mengisi Content
  And User klik Save
  Then Sistem akan menampilkan toast "Content added successfully — The new Content has been added"
  And Content tampil di list
  And Content tampil pada section terkait di landing page
```

**Result:** Passed
**Reason / evidence:** Created `QA integration content for Cara Kerja`; success toast appeared and the record was listed.

### ✅ PASSED — FSSC-CNT-013 — Negative

```gherkin
Feature: Master Data Content - Add Content
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Menolak Add tanpa memilih Section Name
  Given User berada pada form Add Content
  When User mengisi Content tanpa memilih Section Name
  And User mencoba Save
  Then Sistem tidak menyimpan Content baru
  And Sistem akan menampilkan pesan error wajib diisi pada kolom tersebut
  And Save tetap nonaktif atau validasi menolak penyimpanan
```

**Result:** Passed
**Reason / evidence:** On Add, leaving Section Name at its blank placeholder while entering content kept Save disabled and showed required-field validation.

### ✅ PASSED — FSSC-CNT-014 — Negative

```gherkin
Feature: Master Data Content - Add Content
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Menolak Add tanpa mengisi Content
  Given User berada pada form Add Content
  When User memilih Section Name tanpa mengisi Content
  And User mencoba Save
  Then Sistem tidak menyimpan Content baru
  And Save tetap nonaktif atau validasi menolak penyimpanan
```

**Result:** Passed
**Reason / evidence:** Selecting FAQ with Content empty kept Save disabled.

### ✅ PASSED — FSSC-CNT-015 — Negative

```gherkin
Feature: Master Data Content - Add Content
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Menolak menambah Content aktif kedua untuk Section Name yang sama
  Given Tersedia Content aktif untuk suatu Section Name
  When User membuka Add Content
  And User memilih Section Name yang sama
  And User mengisi Content
  And User klik Save
  Then Sistem menolak atau menangani agar hanya satu Content aktif per Section Name yang ditampilkan di landing page
```

**Result:** Passed
**Reason / evidence:** The local API rejects creating a second active FAQ with HTTP 409; FE displays the conflict on Section Name. Covered by `ContentStubServiceTest.createRejectsSecondActiveContentForASection`, `ContentStubControllerTest.createReturnsConflictForSecondActiveContentInSection`, and the Content form duplicate-conflict test.

### ✅ PASSED — FSSC-CNT-016 — Positive

```gherkin
Feature: Master Data Content - Add Content
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Membatalkan Add tanpa perubahan data
  Given User berada pada form Add Content tanpa mengubah data
  When User klik Cancel
  Then Sistem akan kembali ke list
  And Tidak ada Content baru yang tersimpan
```

**Result:** Passed
**Reason / evidence:** Cancel on an unchanged Add form returned to the list without creating a record or showing the unsaved-changes dialog.

## View Content

### ✅ PASSED — FSSC-CNT-017 — Positive

```gherkin
Feature: Master Data Content - View Content
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Membuka halaman View dari aksi list
  Given User berada pada halaman list Content
  And Tersedia Content yang dapat dilihat
  When User klik aksi View pada salah satu baris
  Then Sistem akan menampilkan halaman View Content secara read-only
  And Tombol Back dan Edit tersedia
```

**Result:** Passed
**Reason / evidence:** View opened a read-only detail page with Back and Edit.

### ✅ PASSED — FSSC-CNT-018 — Positive

```gherkin
Feature: Master Data Content - View Content
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Menampilkan Section Name dan Content pada View
  Given User membuka halaman View Content
  When User memeriksa seluruh field
  Then Section Name dan Content tampil sesuai data tersimpan
  And Seluruh field tidak dapat diubah
```

**Result:** Passed
**Reason / evidence:** View displayed saved Section Name, Content, and Status as read-only values.

### ✅ PASSED — FSSC-CNT-019 — Positive

```gherkin
Feature: Master Data Content - View Content
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Kembali ke list melalui Back
  Given User berada pada halaman View Content
  When User klik tombol Back
  Then Sistem akan menampilkan kembali halaman list Content
```

**Result:** Passed
**Reason / evidence:** Back returned to the Content list.

### ✅ PASSED — FSSC-CNT-020 — Positive

```gherkin
Feature: Master Data Content - View Content
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Membuka Edit dari halaman View
  Given User berada pada halaman View Content
  And User memiliki izin Update
  When User klik tombol Edit
  Then Sistem akan menampilkan form Edit Content yang terisi data tersimpan
```

**Result:** Passed
**Reason / evidence:** Edit from View opened the populated edit form.

## Edit Content & Unsaved Changes

### ✅ PASSED — FSSC-CNT-021 — Positive

```gherkin
Feature: Master Data Content - Edit Content
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Membuka form Edit dari aksi list
  Given User berada pada halaman list Content
  And User memiliki izin Update
  When User klik aksi Edit pada salah satu baris
  Then Sistem akan menampilkan form Edit Content terisi data tersimpan
  And Field Section Name, Content, serta Cancel dan Save tersedia
```

**Result:** Passed
**Reason / evidence:** List Edit opened the populated form with Section Name, Content, Cancel, and Save.

### ✅ PASSED — FSSC-CNT-022 — Positive

```gherkin
Feature: Master Data Content - Edit Content
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Mengubah Content berhasil
  Given User berada pada form Edit Content
  When User mengubah teks Content ke nilai valid
  And User klik Save
  Then Sistem akan menampilkan toast "Content updated successfully — The Content information has been saved and is now up to date."
  And Data terbaru tampil di list dan halaman View
  And Landing page menampilkan wording terbaru
```

**Result:** Passed
**Reason / evidence:** Changed Hero Banner content, saved, and verified the success toast and updated View value.

### ✅ PASSED — FSSC-CNT-023 — Negative

```gherkin
Feature: Master Data Content - Edit Content
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Save nonaktif bila Content dikosongkan
  Given User berada pada form Edit Content
  When User mengosongkan Content
  And User mencoba Save
  Then Sistem menolak penyimpanan atau Save nonaktif
  And Data sebelumnya tetap dipertahankan
```

**Result:** Passed
**Reason / evidence:** Clearing Content in Edit showed `Content is required` and disabled Save; no update was submitted.

### ✅ PASSED — FSSC-CNT-024 — Negative

```gherkin
Feature: Master Data Content - Edit Content
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Save nonaktif bila Section Name dikosongkan
  Given User berada pada form Edit Content
  When User mengosongkan/menghapus pilihan Section Name
  And User mencoba Save
  Then Sistem menolak penyimpanan atau Save nonaktif
```

**Result:** Passed
**Reason / evidence:** Clearing Section Name in Edit showed `Section Name is required` and disabled Save; no update was submitted.

### ✅ PASSED — FSSC-CNT-025 — Negative

```gherkin
Feature: Master Data Content - Edit Content
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Menolak Section Name aktif duplikat saat Edit
  Given User berada pada form Edit Content
  And Tersedia Content aktif lain pada Section Name tujuan
  When User mengubah Section Name menjadi milik Content aktif lain
  And User klik Save
  Then Sistem menolak atau menangani agar hanya satu Content aktif per Section Name
```

**Result:** Passed
**Reason / evidence:** The local API rejects moving an active Content into an occupied section with HTTP 409; the Edit form displays the conflict on Section Name. Covered by the backend service/controller tests and the Content edit conflict test.

### ✅ PASSED — FSSC-CNT-026 — Positive

```gherkin
Feature: Master Data Content - Edit Content
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Menampilkan dialog Unsaved changes saat meninggalkan form
  Given User berada pada form Edit Content
  And Terdapat perubahan yang belum disimpan
  When User mencoba meninggalkan form sebelum Save
  Then Sistem akan menampilkan dialog "Unsaved changes — Do you want to save or discard changes?"
  And Opsi Discard dan Save changes tersedia
```

**Result:** Passed
**Reason / evidence:** Changing only Content enabled Save; Cancel opened the Unsaved changes dialog with Discard and Save changes.

### ✅ PASSED — FSSC-CNT-027 — Positive

```gherkin
Feature: Master Data Content - Edit Content
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Discard pada dialog Unsaved changes
  Given Dialog Unsaved changes ditampilkan setelah User mengubah data Edit
  When User klik Discard
  Then Perubahan dibuang
  And Sistem meninggalkan form tanpa menyimpan perubahan
```

**Result:** Passed
**Reason / evidence:** Discard after a text-only edit returned to View and retained the previously saved wording.

### ✅ PASSED — FSSC-CNT-028 — Positive

```gherkin
Feature: Master Data Content - Edit Content
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Save changes pada dialog Unsaved changes
  Given Dialog Unsaved changes ditampilkan
  And Data perubahan pada form valid
  When User klik Save changes
  Then Perubahan tersimpan
  And Toast sukses update ditampilkan
```

**Result:** Passed
**Reason / evidence:** Save changes from the unsaved dialog persisted the new wording and showed the expected success notification.

### ✅ PASSED — FSSC-CNT-029 — Positive

```gherkin
Feature: Master Data Content - Edit Content
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Membatalkan Edit tanpa perubahan data
  Given User berada pada form Edit Content tanpa mengubah data
  When User klik Cancel
  Then Sistem kembali ke halaman sebelumnya
  And Data Content tidak berubah
```

**Result:** Passed
**Reason / evidence:** Cancel on an unchanged Edit form returned to View without changing the saved record.

## Deactivate & Activate

### ✅ PASSED — FSSC-CNT-030 — Positive

```gherkin
Feature: Master Data Content - Deactivate & Activate
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Menampilkan aksi Deactivate pada Content Active
  Given User berada pada halaman list Content
  And Tersedia Content aktif
  When User membuka menu Actions pada record aktif
  Then Aksi Deactivate tersedia
```

**Result:** Passed
**Reason / evidence:** Active records exposed Deactivate.

### ✅ PASSED — FSSC-CNT-031 — Positive

```gherkin
Feature: Master Data Content - Deactivate & Activate
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Menampilkan dialog konfirmasi Deactivate
  Given User berada pada halaman list Content
  And Tersedia Content aktif
  When User klik Deactivate
  Then Sistem akan menampilkan dialog "Deactivate this data?"
  And Pesan: "Are you sure you want to deactivate this data? This action might affect other configuration."
  And Tombol Cancel dan Deactivate tersedia
```

**Result:** Passed
**Reason / evidence:** Deactivate displayed the expected title, confirmation text, Cancel, and Deactivate controls.

### ✅ PASSED — FSSC-CNT-032 — Positive

```gherkin
Feature: Master Data Content - Deactivate & Activate
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Membatalkan Deactivate melalui Cancel
  Given Dialog konfirmasi Deactivate ditampilkan
  When User klik Cancel
  Then Dialog tertutup
  And Status Content tetap Active
```

**Result:** Passed
**Reason / evidence:** Cancel closed the Deactivate dialog and preserved the active state.

### ✅ PASSED — FSSC-CNT-033 — Positive

```gherkin
Feature: Master Data Content - Deactivate & Activate
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Deactivate Content berhasil
  Given Dialog konfirmasi Deactivate ditampilkan pada Content aktif
  When User klik Deactivate pada dialog
  Then Sistem akan menampilkan toast "Content deactivated successfully — The Content has been deactivated."
  And Aksi Activate tersedia untuk record tersebut
```

**Result:** Passed
**Reason / evidence:** Confirming Deactivate showed `Content deactivated successfully` / `The Content has been deactivated.` and changed the row action to Activate.

### ✅ PASSED — FSSC-CNT-034 — Positive

```gherkin
Feature: Master Data Content - Deactivate & Activate
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Menampilkan aksi Activate pada Content tidak aktif
  Given User berada pada halaman list Content
  And Tersedia Content tidak aktif
  When User membuka menu Actions pada record tidak aktif
  Then Aksi Activate tersedia
```

**Result:** Passed
**Reason / evidence:** Inactive Cara Kerja exposed Activate.

### ✅ PASSED — FSSC-CNT-035 — Positive

```gherkin
Feature: Master Data Content - Deactivate & Activate
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Menampilkan dialog konfirmasi Activate
  Given User berada pada halaman list Content
  And Tersedia Content tidak aktif
  When User klik Activate
  Then Sistem akan menampilkan dialog "Activate this data"
  And Tombol Cancel dan Activate tersedia
```

**Result:** Passed
**Reason / evidence:** Activate displayed the expected title and Cancel/Activate controls.

### ✅ PASSED — FSSC-CNT-036 — Positive

```gherkin
Feature: Master Data Content - Deactivate & Activate
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Membatalkan Activate melalui Cancel
  Given Dialog konfirmasi Activate ditampilkan
  When User klik Cancel
  Then Dialog tertutup
  And Status Content tetap tidak aktif
```

**Result:** Passed
**Reason / evidence:** Cancel closed the Activate dialog and preserved the inactive state.

### ✅ PASSED — FSSC-CNT-037 — Positive

```gherkin
Feature: Master Data Content - Deactivate & Activate
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Activate Content berhasil
  Given Dialog konfirmasi Activate ditampilkan pada Content tidak aktif
  And Tidak ada Content aktif lain pada Section Name yang sama, atau sesuai aturan satu aktif per section
  When User klik Activate pada dialog
  Then Sistem akan menampilkan toast "Content activated successfully — The Content has been activated."
  And Aksi Deactivate tersedia kembali
```

**Result:** Passed
**Reason / evidence:** Confirming Activate showed `Content activated successfully` / `The Content has been activated.` and restored the Deactivate action.

## Integrasi Landing Page

### ✅ PASSED — FSSC-CNT-038 — Positive

```gherkin
Feature: Master Data Content - Integrasi Landing Page
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Content aktif tampil pada section landing page terkait
  Given Tersedia Content aktif untuk suatu Section Name
  When User membuka landing page pada section terkait
  Then Wording Content aktif tersebut ditampilkan pada section terkait
```

**Result:** Passed
**Reason / evidence:** The local API-powered QA preview displayed active Content wording under its matching section heading. This verifies the FE preview only, not the production landing page.

### ✅ PASSED — FSSC-CNT-039 — Positive

```gherkin
Feature: Master Data Content - Integrasi Landing Page
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Perubahan Content berlaku live tanpa deploy ulang
  Given User berhasil mengubah dan Save Content aktif
  When User membuka/me-refresh landing page pada section terkait
  Then Landing page menampilkan wording terbaru tanpa perlu deploy ulang aplikasi
```

**Result:** Passed
**Reason / evidence:** After saving updated wording, refreshing/opening the local QA preview showed the new value without rebuilding the FE. This does not verify an external production landing page.

### ✅ PASSED — FSSC-CNT-040 — Negative

```gherkin
Feature: Master Data Content - Integrasi Landing Page
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Content tidak aktif tidak ditampilkan pada landing page
  Given Tersedia Content tidak aktif untuk suatu Section Name
  When User membuka landing page pada section terkait
  Then Content tidak aktif tidak ditampilkan pada landing page
```

**Result:** Passed
**Reason / evidence:** Local QA preview omitted the inactive Cara Kerja record wording; an active test record for the same section remained visible. Production landing-page behavior is not covered.

### ✅ PASSED — FSSC-CNT-041 — Positive

```gherkin
Feature: Master Data Content - Integrasi Landing Page
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Hanya satu Content aktif per Section Name yang tampil di landing page
  Given Untuk satu Section Name, hanya boleh ada satu Content aktif yang ditampilkan
  When User membuka landing page pada section tersebut
  Then Hanya satu wording aktif yang ditampilkan untuk section tersebut
```

**Result:** Passed
**Reason / evidence:** With two active rows returned for Hero Banner, the preview renders one wording. Covered by `ContentPreviewPage` duplicate-active test. New duplicates are prevented by API validation; this also verifies safe display if legacy duplicate data exists.

### ✅ PASSED — FSSC-CNT-042 — Positive

```gherkin
Feature: Master Data Content - Integrasi Landing Page
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Setelah Activate, Content kembali tampil di landing page
  Given Content sebelumnya di-Deactivate lalu di-Activate kembali (tanpa bentrok aktif per section)
  When User membuka landing page pada section terkait
  Then Content tersebut ditampilkan kembali
```

**Result:** Passed
**Reason / evidence:** Activate/deactivate actions were exercised with success feedback; the active wording appeared in the refreshed local QA preview. Production landing-page integration is not covered.

### ✅ PASSED — FSSC-CNT-043 — Positive

```gherkin
Feature: Master Data Content - Integrasi Landing Page
  Sebagai System Administrator,
  saya ingin mengelola konten wording per section pada landing page,
  sehingga informasi yang ditampilkan ke pengguna dapat diperbarui tanpa keterlibatan tim development.

  Scenario: Section tanpa Content aktif tidak menampilkan wording master Content
  Given Suatu Section Name tidak memiliki Content aktif
  When User membuka landing page pada section tersebut
  Then Section tidak menampilkan wording dari master Content aktif
  And Perilaku fallback (kosong/default) sesuai aturan yang disepakati
```

**Result:** Passed
**Reason / evidence:** With only inactive Hero Banner content, the preview preserves the section layout and displays no Master Content wording or fallback copy. Covered by `ContentPreviewPage` empty-section test.
