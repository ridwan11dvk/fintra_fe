# Stage Process & SLA implementation review

Reviewer: wave_reviewer, GPT-6. Pass: Stage-R1. Scope: working-tree implementation diffs against HEAD in fintra_fe, fintra_be and railfinance-common, plus new feature files. Upstream changes already in HEAD, generated outputs, credentials and dependencies excluded. No behavior catalog; graded against the item plans, signed design and API contract.

## Stage-R1

No P1/P2 implementation findings after inspection. No remediation changes made.

### Checked and sound

- `StageProcessService.saveConfiguration`, `validateCatalog`, `validateIdentity` and `validateValues`: complete catalog membership, duplicate IDs, immutable category, sequential positions, per-group reorder, normalized composite uniqueness, decimal minimum and stale snapshots are checked before entity mutation. Only name, business process type, SLA and display order are assigned. Stable stage code, workflow category and technical `kind` remain intact.
- `StageCatalogRepository.findAllForConfigurationUpdate`: deterministic code ordering and pessimistic write lock serialize competing catalog updates; entity `@Version` and explicit snapshot comparison reject stale clients. `saveAllAndFlush` runs inside the service transaction, so persistence exceptions roll back earlier row updates.
- `V85__Extend_stage_process_configuration.sql`: additive fields, unconstrained NUMERIC conversion, deterministic backfill, fallback legacy groups, and deferrable composite uniqueness. Name swaps do not fail solely because Hibernate updates rows one at a time. Known business-type backfill leaves technical kind untouched.
- `StageProcessController`: collection PUT is distinct from individual PUT; nested request validation and update authority remain enforced. `StageProcessUpdateDTO` retains individual updates with decimal minimum 1.
- `StageProcessForm`: RHF/Zod drives validity; failure retains entered values and dirty state, while success resets from returned versions and canonical values. `useSaveStageProcesses` updates the stage query cache and invalidates approval/dispute lists. `reorderStages` refuses cross-group moves and unknown identities; field-array moves preserve row IDs and values.
- `StageProcessRow`, schema, service and page: raw decimal text supports Indonesian commas; real Axios calls have no mock fallback; loading/error/retry/empty states are present; stage/group counts are data-driven. Existing three-tab integration and Save/Cancel flow remain. Fixture changes only add required version metadata.
- Shared consumers inspected: `ApprovalWorkflowService` uses stage codes, kind and output-step; `DisputeWorkflowMapper` maps code/name/category. Neither consumes nor converts catalog SLA, so changing its Java type does not truncate downstream values. Source-wide searches found no other production `getSlaDays`/`slaDays()` consumers.

### Test audit

Related set inspected: frontend schema (11), reorder (5), service (3), form (7, being finalized by lead); common existing service (7) and configuration (8); backend controller (4), security (3), PostgreSQL persistence (4). Reviewer inspected test sources; final execution results remain the lead's gate, not asserted as independently rerun here.

- Schema decimal, non-18 counts and same-name/different-group positive cases fail against the original schema. Duplicate-name negative preserves existing rejection, so it is a regression anchor rather than proof of newly fixed behavior. The five invalid-number cases use a one-row list, which the old fixed-18 schema also rejected: these alone do not isolate the old numeric validator. The real form minimum case and backend minimum validation provide independent coverage.
- Reorder boundary/unknown/no-op cases fail if the corresponding helper guard is removed; valid move asserts literal identity/order/sequence and unchanged original data. This helper did not exist in the baseline.
- Service tests fail against baseline DEV fixtures/production-unavailable behavior; expected literal wire payload anchors stable identity, numeric decimal and version mapping. A rejected GET explicitly proves absence of fallback.
- Form tests exercise real component interactions with MSW, including comma parsing, invalid SLA, failed-save draft preservation, keyboard boundary, pointer boundary, discard and empty catalog. They do not establish an authenticated browser-to-running-backend seam. Lead owns final harness corrections and results.
- Existing Java service tests are compatibility checks, not all expected to fail before the change. New bulk tests cannot compile against the old missing API; each assertion anchors a specific validation, identity or dynamic-count condition, and invalid final-row test verifies both no mutation and no repository write.
- Controller decimal request detects Integer incompatibility; new collection endpoint tests fail against missing mapping. Invalid-minimum test anchors status and no service call.
- Security cases anchor real method security with a small test security chain; this proves method authorities, not the complete deployed authentication configuration.
- Persistence tests use a dedicated fixed test database, actual migration, real transactions and fresh reads. The injected second-row trigger distinguishes transaction rollback from mere up-front validation; name swap and stale snapshot cases exercise actual constraints/version increments. The migration test starts from Hibernate's test schema, so full historical Flyway chain compatibility remains a separate migration gate.

### Verification boundaries

Authenticated browser persistence and production-build visual inspection are still pending legitimate local login. This is a verification limitation, not a claim of completion. No new account or access change was attempted by the reviewer. Full lint baseline and final builds are owned by the lead.

Stage-R1 closing result: clean implementation inspection; 0 P1, 0 P2, 0 P3 findings; no fixes. User sign-off and remaining verification gates are separate.

## Stage-R2 — validation feedback remediation

### Stage-R2-F1 — P2 — row error messages retained after input changed

Where: `StageProcessForm` error props and `StageProcessRow` error rendering.

Failure: lead observed the unchanged form test fail when SLA was cleared and then changed to `0,5`: the DOM showed the new value while the required-field message remained instead of the minimum-one message. Original implementation passed RHF's mutable nested `errors.items` object to the row and derived nested errors there. This was missed by the initial source-only inspection; the form interaction gate caught it before completion.

Fix: parent now extracts the current primitive error messages (`nameError`, `typeError`, `slaError`) and passes them to the row. Changes in validation text are explicit component inputs, avoiding reliance on nested mutable error-object identity. Reviewer inspected both component changes; no contract change or new dependency.

Test RED: reported by lead on the existing `does not submit any row when another row has an invalid SLA` form test before this fix. The reviewer did not independently witness that original failure and does not treat it as independently reproduced evidence.

Test GREEN: reviewer independently reran all four feature test files with the fixed components: **26/26 pass**, including **7/7 form tests**. Log: `.output/tests/stage-process-review-restored.log`.

Mutation check: reviewer temporarily restored the mutable errors-array prop using two simplified variants (direct nested extraction into primitive local variables; then extraction through `rowErrors` into primitive local variables). Both variants passed 7/7. These are lower-bound simulations, not the exact original direct-nested-JSX implementation, and therefore **do not reproduce or prove the React Compiler root cause**. Both temporary changes were restored from byte-for-byte fixed-file backups; no mutation remains. Logs: `.output/tests/stage-process-review-mutant.log` and `.output/tests/stage-process-review-mutant-row-object.log`.

Outcome: remediation inspected and focused green verified; lead acceptance required. No open P1/P2 defect found in the final primitive-prop implementation. Root-cause attribution remains limited to the observed failing interaction and conservative fix; compiler causality is not asserted as proven.

Stage-R2 closing result: 1 P2 recorded from the lead's interaction finding, fixed by lead; no additional findings. Final source review clean after remediation; authenticated browser gate remains pending.

### Stage-R2 exact-mutation follow-up

Reviewer subsequently restored the **exact original direct nested JSX**: `errors={errors.items}`, local `rowErrors = errors?.[index]`, conditional `rowErrors?.slaDays` and rendered `rowErrors.slaDays.message` (with matching original name/type expressions). The unchanged form test now independently failed at the expected minimum-message assertion after `0,5`: **6 passed, 1 failed**. Log: `.output/tests/stage-process-review-mutant-exact.log`.

Restored both final primitive-prop components and reran the complete feature set: **26/26 passed**. Log: `.output/tests/stage-process-review-final.log`. Therefore the failure is independently reproduced and the fix is falsifiable; the earlier simplified mutants were insufficiently faithful. This establishes the stale nested error-rendering regression and effective remediation, without asserting that compiler internals were directly instrumented. No temporary mutation remains.
