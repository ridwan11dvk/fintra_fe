# Implementation and verification — Step Proses & SLA

Status: implementation complete; authenticated browser verification pending.

## Delivered

- Shared catalog supports decimal SLA >= 1, dynamic stage/group counts, display order and version snapshots. V85 adds fields and normalized composite uniqueness without changing stable workflow identities or technical kinds.
- Collection PUT validates and saves the complete tab in one transaction. Unknown/missing identities, changed groups, cross-group reorder, duplicates and stale versions are rejected.
- Administrator form uses RHF/Zod, real Axios/TanStack Query calls, data-driven groups, comma decimal input, within-group pointer/keyboard reorder and Save/Cancel. Failed Save preserves the draft. No Add/Delete, alarm or calendar calculation was added.
- Existing catalog groups are preserved; migration does not invent mappings from the legacy catalog to the illustrative PRD groups.

## Executed checks

| Check | Result |
| --- | --- |
| Common focused Java tests | 15 passed |
| Backend controller/security/PostgreSQL tests | 11 passed |
| Frontend schema/reorder/service/form | 26 passed |
| Common local Maven install | Passed |
| Backend Maven package | Passed |
| Frontend production build | Passed; existing configuration/chunk-size/performance warnings investigated |
| V85 on isolated local development database | Passed |
| Whitespace diff check, all three repos | Passed |
| Frontend full lint | 32 errors, 5 warnings; same counts as untouched HEAD baseline; no feature findings |

PostgreSQL tests use a dedicated `fintra_sla_tests` database. They include name swaps, decimal round-trip, stale-snapshot rejection and an injected second-row persistence failure proving rollback of an earlier update.

Frontend interaction tests cover Save with `1,5`, minimum/required errors, draft retention after HTTP 409, within-group keyboard movement, rejected cross-group pointer drops, Cancel/discard and empty catalog. These tests use MSW and do not substitute for the running-app seam.

Review caught stale nested validation-error rendering. Passing primitive error messages to the row fixes it; restoring the exact previous implementation makes the unchanged form test fail, and restoring the fix returns all 26 frontend tests to green. No additional implementation findings remain after review.

## Remaining verification

- Login with an existing authorized local Administrator, inspect layout in the running application and production build, exercise Save/reload and Cancel, and compare persisted values with the local database.
- Actual SonarQube server scan was not run; no scanner/tool is available in this session. Existing ESLint Sonar rules were run.
- Full-repository lint is not green due to baseline violations outside this feature. They were not silently waived or changed.

Automatic approval review rejected creating a privileged QA account without specific authorization. No such account was created. Browser verification waits for an existing session or explicit authorization for a local-only QA account.

Evidence files are local under `.output/tests/`, `.output/build/` and `.output/lint/` and must not be committed. Review details: `review-findings.md`. No push or deployment performed.

## Authenticated browser check (2026-10-28)

- Opened `/setting/setup-configuration` in the controlled Chrome tab after the user logged in.
- Confirmed four data-driven groups and all eight currently configured stage rows loaded from the live API (HTTP 200 observed in the user's screenshot; visible fields verified through browser accessibility state).
- Confirmed editing SLA to `1,5` enables Save. Cancel opens the unsaved-changes prompt; Discard restores the original `3` and disables Save. No configuration was persisted during this check.
- Visual screenshot supplied by the user shows the three controls side-by-side and footer starting to the right of the sidebar.

- Follow-up browser QA: mouse drag reordered stages within Business Layer; Cancel → Discard restored order/numbering. Same-group duplicate Process Name was rejected, while an identical name in another group was allowed; draft restored without saving.
