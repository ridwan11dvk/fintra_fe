# Item 02 - Endpoint Save kolektif fintra_be

Lane: strict - kontrak publik dan transaksi konfigurasi.
Status: implemented; controller, authorization, PostgreSQL transaction tests and package build passed. Scope hanya repository fintra_be.
Spec: ../2026-10-28-step-process-sla-design.md. Contract: ../api-contract.md.

## Done when

- GET memuat field konfigurasi dan desimal; PUT collection menyimpan seluruh konfigurasi melalui service transaksi.
- Permission list/read/update tetap berlaku pada request nyata.
- Payload invalid dan stale tidak menyimpan sebagian data.

## Sites

- src/main/java/com/kai/fintra/masterdata/operational/controller/StageProcessController.java
- src/test/java/com/kai/fintra/masterdata/operational/controller/StageProcessControllerTest.java
- src/test/java/com/kai/fintra/masterdata/operational/controller/: security/integration coverage yang relevan.

## Correctness

- MockMvc: kontrak GET, decimal update, bulk success, request invalid.
- Security chain/API lokal: anonymous ditolak; permission update diperlukan.
- Build backend memakai library lokal item 01; tidak mengubah pom.xml.
- Seam: request melalui Axios frontend menggunakan endpoint yang sama.

## Evidence

- [V] Controller baseline mempunyai GET list/detail dan PUT individual.
- [V] Method security memakai authority stage-process:list/read/update.
- [V] Dua standalone MockMvc test lama tidak menguji security chain.

## Pre-mortem

Risiko: PUT collection salah terpetakan ke path variable. Sinyal: request kolektif 404/405. Uji endpoint nyata.
Rollback: revert controller setelah memastikan frontend tidak lagi mengirim bulk; schema additive tetap aman.

## Slice

1. Endpoint tervalidasi dan test kontrak.
2. Seam: auth, data nyata, dan rollback request.

## Report

Implemented; 11 controller, method-security and real PostgreSQL tests passed; package build passed. Running-app authenticated browser seam remains pending. See verification-report.md.
