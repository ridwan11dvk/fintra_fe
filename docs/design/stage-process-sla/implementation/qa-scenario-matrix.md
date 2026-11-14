# QA scenario mapping — FSSC Master Data Step Proses & SLA

Source: `Scenario Test FSSC Master Data - KAI - MD - Step Proses & SLA.pdf` (38 IDs).

This file maps the original QA cases to the **latest signed-off decisions** and evidence. `Automated` means covered by feature-specific unit/integration tests; it is not a claim that the original PDF case was manually executed end-to-end. `Browser` means exercised in the authenticated local app without persisting data. Authenticated Chrome control was available for this run. Browser and automated evidence are distinguished per row.

| ID | Result / mapping | Evidence or reason |
|---|---|---|
| 001 | Browser verified | Page opened after authorized login; tabs visible. |
| 002 | Browser verified | Process & Reference content and Save/Cancel visible. |
| 003 | Browser verified | Inline editor; no separate detail route/control in tab. |
| 004 | PASS — browser | Compliance FSSC tab opened and rendered its content. |
| 005 | PASS — browser | Financial Control Validation tab opened and rendered its content. |
| 006 | Superseded | Exact 18 and numbering 1–18 are not requirements; catalog is dynamic. |
| 007 | Superseded | Hard-coded six PRD groups are not required; existing persisted groups are data-driven. |
| 008 | Browser verified | Three required fields and required markers present; screenshot shows three columns. |
| 009 | Superseded | Default 18 names/types are not to be seeded by this UI task; stage catalog is DB-managed. |
| 010 | Browser verified | Drag handles visible. |
| 011 | Superseded | No Add is present, but rationale “outside 18 standard” conflicts with dynamic count/DB-managed catalog. |
| 012 | PASS — browser | Saved temporary SLA 1.5; success toast appeared; restored SLA 3 and verified after reload. |
| 013 | PASS — browser | Saved a temporary unique process name; success toast appeared; restored original name and verified after reload. |
| 014 | PASS — browser | Changed Process Type to Execution, saved successfully, then restored Approval and verified after reload. |
| 015 | PASS — browser + automated | Blank Process Name displayed the required-field error and disabled Save. |
| 016 | PASS — browser + automated | Select exposes only the four allowed values; selected a valid value and saved. |
| 017 | PASS — browser + automated | Empty SLA displayed required-field error and disabled Save. |
| 018 | PASS — browser + automated | Browser saved changes to multiple fields in one collection request; transaction atomicity separately passed PostgreSQL test. |
| 019 | PASS — browser + automated | UI limits selection to allowed values; backend rejects out-of-enum values. |
| 020 | PASS — browser + automated | SLA 0 showed minimum-1 error, Save stayed disabled; backend validation also passed. |
| 021 | PASS — browser + automated | SLA -2 showed minimum-1 error, Save stayed disabled; backend validation also passed. |
| 022 | PASS — browser + automated | Text SLA showed numeric error and Save stayed disabled. |
| 023 | PASS — automated | SLA value 1 accepted by schema/form and backend validation tests. |
| 024 | PASS — browser + automated | SLA 1.5 saved and read back as 1.5; restored to 3. |
| 025 | Superseded | PDF assumes integer-only SLA; approved requirement accepts decimals >=1. |
| 026 | PASS — browser + automated | Keyboard ArrowUp moved stage 2 within Business Layer; ArrowDown restored the original order. Automated helper tests cover persisted sequence values. Pointer drag/save remains untested manually. |
| 027 | PASS — browser | Dragged stage 2 below stage 3 within its group, then Cancel → Discard; the original order and numbering 1–3 were restored. |
| 028 | Revised; PASS — browser + automated | Cross-group keyboard move from FSSC Pop to Business Layer was a no-op; order and clean state remained unchanged. Automated tests cover pointer-boundary helper behavior. |
| 029 | Out of scope / pending consuming-module integration | New consumer behavior and ordering in other modules were not approved for this setup UI slice. |
| 030 | PASS — browser + automated | Discard/reload showed original value 3. |
| 031 | PASS — browser | After discard, Cancel and Save were disabled. |
| 032 | PASS — browser + automated | Browser Save succeeded and values persisted through reload; PostgreSQL test verified collection rollback semantics. |
| 033 | PASS — automated | Invalid payload and injected second-row failure both left persisted catalog unchanged. |
| 034 | Out of scope | Due-date calculation belongs to consuming modules; calendar/working-day behavior deferred. |
| 035 | Out of scope / decision pending | Alert behavior is deferred pending PM confirmation. |
| 036 | Out of scope / pending module verification | Existing transaction due-date impact is in consuming-module scope, not this setup UI change. |
| 037 | Automated integration evidence | Existing Approval Workflow references were inspected; stage code/name mapping preserved. Live option refresh after a rename not browser-tested. |
| 038 | Automated integration evidence | Existing Dispute Workflow references were inspected; stable stage identity and name mapping preserved. Live option refresh after a rename not browser-tested. |

## Executed this browser session

- Authenticated Setup & Configuration page loaded with four data-driven groups and eight current rows; Process & Reference plus both companion tabs were opened.
- Verified required markers, inline fields, drag controls, disabled clean-form actions and absence of a detail route in this tab.
- Verified invalid name, empty SLA, SLA `0`, negative SLA and nonnumeric SLA errors; invalid values kept Save disabled.
- Saved temporary changes to name, type and SLA `1,5`; success toast appeared. Restored original name, type and SLA `3`, saved, and reloaded to verify original values.
- Saved SLA `1` and restored `3` with a second success toast.
- Keyboard moved stage 2 up and back down within its group. Attempting to move FSSC Pop stage 4 above the Business Layer boundary had no effect.
- Dragged stage 2 below stage 3 within its group, then Cancel → Discard; verified original order and numbering restored.
- Entered a duplicate name within Business Layer; uniqueness error appeared. Entered the same name as a stage in another group; no duplicate error appeared. Restored the original name without saving.

The applicable as-written set has **25 cases**, not 24: IDs 001–005, 008, 010, 012–024, 027, 030–033. **25 passed** across browser checks and feature-specific automated tests. Superseded, revised and out-of-scope rows are not counted as passes against the old PDF expectation. This is not a full 38-case pass; consuming-module due date and alert scenarios remain outside this setup UI scope.

Automated evidence is summarized in `verification-report.md`: 15 common, 11 backend, and 26 frontend tests passed. These test counts are not the 38 PDF scenarios.
