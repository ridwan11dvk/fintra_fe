# Spec & Implementation Plan: Master Data ↔ Payable BE API

**Status:** Operational adapters implemented for Segment, Profit Center, KBLI, and Department; local live API verification is pending service reachability.
**FE baseline:** fintra-fe-master-data, branch feat/master-data-prd-slices.
**BE contract snapshot:** msvc_railfinance_payable_be, `origin/development` at `1468055` (merge including `55087aa` Add parent code on Profit Center); includes Segment activate/deactivate routes.

## 1. Implementation snapshot (2026-10-12)

### Completed in FE

- Added a Payable API boundary that uses the shared core Axios auth/refresh interceptors while routing to the configured Payable API origin; it normalizes a trailing `/api` in the configured base URL and unwraps the BE `{ success, message, data }` envelope.
- Implemented KBLI list/search/detail/create/update/activate/deactivate with numeric backend IDs preserved as FE route IDs and client-side paging over the returned result list.
- Implemented Department list/search/detail/create/update/activate/deactivate, mapping `parentCode` to the backend record ID required by the existing FE parent selector.
- Implemented Segment list/search/detail/create/update/status and active parent options, resolving FE business codes to BE numeric IDs for detail/update/status routes.
- Implemented Profit Center list/search/detail/create/update/status, mapping `parentProfitCenterId` to BE `parentCode` and loading Segment options through the BE API. Numeric IDs are retained separately and used for item routes.
- API mode no longer loads fixture Responsible Person choices; the existing optional field is shown without options and may be left blank. An options endpoint/product decision is still needed to pick a person on new records.
- Added typed Cashflow Category list/detail/label-update and Cashflow Group list/search/detail/create/update/status/delete API services. No pages, routes, or nav items were added because product/menu ownership is still unresolved.
- Local `.env.local` now sets `VITE_PAYABLE_API_BASE_URL=http://localhost:8081`; it is git-ignored. Restart Vite to apply the env change. Existing local fixtures remain available only in DEV when the dedicated URL is not set; API failures do not fall back to fixtures.
- List UI pagination exists. Since these BE list endpoints return full arrays, FE currently searches/paginates client-side; it does not request server page/size.

### Verification and remaining status

- `npm run build`: passed.
- `npm run lint`: still flags `sonarjs/no-nested-functions` in the unrelated current UI change `src/features/master-data/dispute-workflow/pages/dispute-workflow-edit.page.tsx:65`; targeted ESLint on all API integration files passes.
- FE build/typecheck and targeted ESLint passed after the new adapters. Full repo lint still flags `sonarjs/no-nested-functions` in an unrelated current Dispute Workflow UI change.
- The OpenClaw shell cannot reach `localhost:8081`, so live GETs, browser CORS, profile `local-bypass`, auth, and UI Network evidence are not verified here. No write request was sent.
- Profit Center code is immutable on BE update (the current service updates name/relations/status but not code); FE rejects an attempted code change explicitly. Responsible Person options and Cashflow screens remain unresolved.

## 2. Objective

Replace fixture-only behavior in the existing Segment, Profit Center, KBLI, and Department FE services with the corresponding Payable BE APIs. Add FE service/UI support for Cashflow Category and Cashflow Group, which do not currently have their own FE modules. Preserve current Master Data interaction patterns and prevent development fixtures from being used silently in deployed environments.

### Success criteria

- Listed FE flows read and mutate records through the Payable service in the configured environment.
- Search, detail, create/update, status changes, label validation, and used-group deletion behavior match the acceptance criteria below.
- API DTOs are mapped deliberately; a business code is never substituted for the backend numeric record ID.
- Authorization, loading/empty/error states, and mutation feedback are verified against the target environment.
- Unit tests and build pass; browser visual/interaction QA is recorded separately. Functional code/build success alone is not visual completion.

## 3. Scope

### Included

| Domain | BE endpoint root | FE baseline |
|---|---|---|
| Segment | /api/master-data/segments | Existing fixture-backed service and pages |
| Profit Center | /api/master-data/profit-centers | Existing fixture-backed service and pages |
| KBLI | /api/master-data/kbli | Existing fixture-backed service and pages |
| Department | /api/master-data/departments | Existing fixture-backed service and pages |
| Cashflow Category | /api/master-data/cashflow-categories | No distinct Cashflow Category module found |
| Cashflow Group | /api/master-data/cashflow-groups | No Cashflow Group module found |

The existing FE Lookup Value module calls /master/lookup-value and models type/code/name/module fields. It is not the Payable BE Cashflow Category API; do not silently repoint it. Treat ticket 9.1.9.6 as Cashflow Category pending product confirmation.

### Excluded

- Integrating other Master Data features without corresponding endpoints in this Payable BE scope.
- Backend schema/endpoint changes as part of FE implementation. Contract gaps below must be resolved with BE owners before dependent FE work.
- Replacing the existing generic Category feature.

## 4. Current evidence and assumptions

- Segment, Profit Center, KBLI, and Department services select HTTP adapters when `VITE_PAYABLE_API_BASE_URL` is configured or outside DEV; otherwise only local DEV selects fixtures.
- `src/app/provider.tsx` configures `VITE_PAYABLE_API_BASE_URL`; the shared core client does not select that custom URL for these base-page screens, so the implemented boundary routes absolute requests through this configured origin while retaining core auth/refresh interceptors.
- Backend operational list endpoints return arrays (not the FE's current paged result). Search is supported on Segment, Profit Center, KBLI, Department, and Cashflow Group; Cashflow Category list has no search parameter.
- Backend DTOs use numeric id, business code, and boolean active; FE models use string identifiers and ACTIVE/INACTIVE status.
- No Cashflow-specific FE service/pages were found. New pages should follow existing Master Data table/detail/form patterns, subject to PRD/Figma confirmation.
- Fixture adapters remain available only for explicit local development use. They must never be a silent production or API-error fallback.

## 5. API contract and mapping

Paths below include the backend controller's /api prefix. Deployment/gateway routing and exact base URL are environment configuration, not hard-coded feature logic.

| Flow | API operations | Contract/UI mapping |
|---|---|---|
| Segment add/search miss/status | GET /segments, GET /segments/{id}, POST /segments, PUT /segments/{id}, POST /{id}/activate, POST /{id}/deactivate | FE segmentId is business code → BE code; segmentName → name; parentSegmentId → parentCode; status ↔ active. FE resolves numeric IDs for item routes. |
| Profit Center create/edit/view/search/status | GET /profit-centers, GET /profit-centers/{id}, POST /profit-centers, PUT /profit-centers/{id}, POST /{id}/activate, POST /{id}/deactivate | profitCenterId → code; parentProfitCenterId → parentCode; fields map to name, active, businessUnitId, segmentCode, responsiblePerson. Preserve numeric id separately from code. |
| KBLI list/detail/create/edit/status | GET /kbli?search=…, GET /kbli/{id}, POST /kbli, PUT /kbli/{id}, POST /{id}/activate, POST /{id}/deactivate | FE id carries BE numeric ID as a string for routes; code, category, businessFieldName map directly; status ↔ active. |
| Department list/detail/create/edit/status | GET /departments?search=…, GET /departments/{id}, POST /departments, PUT /departments/{id}, POST /{id}/activate, POST /{id}/deactivate | Preserve numeric ID as string for FE routes. FE parentDepartmentId resolves to/from BE parentCode; status ↔ active. |
| Cashflow Category label | GET /cashflow-categories, GET /cashflow-categories/{id}, PUT /cashflow-categories/{id} | Response has id, code, label, active; update body is { label }. @NotBlank rejects empty/whitespace labels. |
| Cashflow Group CRUD/status/used-delete | GET /cashflow-groups?search=…, GET /cashflow-groups/{id}, POST /cashflow-groups, PUT /cashflow-groups/{id}, POST /{id}/activate, POST /{id}/deactivate, DELETE /{id} | Body: { code, name, categoryCode, active? }; response includes canDelete. A referenced group cannot be deleted; show the BE validation message and retain the record. |

### Contract gaps / decisions required before affected slices

1. **Responsible Person options (BE/product):** current contract accepts/stores a string but has no options API. Decide an existing source, add an endpoint, or approve free text.
2. **Profit Center code edit semantics (BE/product):** current update service does not persist `code`. Confirm that code is immutable and FE should lock it on edit, or update BE to support code changes. FE currently returns a clear error if the user changes it.
3. **Pagination scale (BE/product):** UI pagination exists but runs client-side after fetching full arrays. Confirm expected row limits or add server-side pagination before volumes grow.
4. **Permissions/runtime proof:** BE dev confirms `master-data:operational:list/create/update/delete` and local `local-bypass`; authenticated/authorized browser requests still need proof against the running app.
5. **Cashflow UI ownership:** confirm whether tickets 9.1.9.6/9.1.9.7 require distinct screens/menu entries, labels/navigation placement, and page permissions.
6. **Local connectivity:** FE is configured for `http://localhost:8081`, but that port is not reachable from the OpenClaw shell. Restart Vite after env change and verify through the user's browser/runtime.

### Blockers to communicate

1. **BE/product — Responsible Person options:** confirm a people source/endpoint or approve free text. The optional value may be blank for now.
2. **BE/product — Profit Center code edit:** confirm whether code is immutable; current BE `update` does not persist a changed code.
3. **BE/product — pagination:** confirm client-side pagination over full arrays is acceptable for current volume or provide server-side paging contract.
4. **Product — Cashflow navigation/UI:** confirm separate Cashflow Category and Group screens, labels, navigation, and permissions. API service adapters exist; pages/routes do not.
5. **Runtime validation:** local URL/profile/CORS were supplied, but `localhost:8081` is not reachable from this agent shell. Confirm Vite restart and browser GETs to prove the live wiring.

## 6. Architecture decisions (implemented/proposed)

- Keep UI-facing service signatures feature-specific; add typed HTTP adapters behind them, alongside existing dev adapters.
- Select fixtures only through explicit development configuration. In production/staging, always use HTTP and show API errors; never silently fall back to fixtures.
- Centralize response-envelope unwrapping and error normalization only where behavior is common. Keep endpoint paths and DTO mapping within each feature adapter.
- Invalidate affected list/detail queries after successful writes.
- Retain local pagination/search presentation while BE lists are unpaged, subject to the record-volume decision above.
- Use BE numeric IDs for read/update/status/delete URLs; display/search business codes as data, not substituted primary keys.

## 7. Remaining implementation plan

Tasks are ordered by dependency. Execute sequentially and keep each task focused; independently supported slices above are implemented, while dependent slices should wait for decisions in section 5.

### Phase A — contract and shared foundation

1. **Confirm deployment/auth contract — pending**
   - Agree Payable base URL, gateway prefix, token forwarding, permissions, and error envelope with BE/DevOps.
   - Local API URL, CORS origin, `local-bypass` profile, operational scopes, and response envelope were supplied by BE; runtime access/auth are still unverified from this shell.
   - Confirm Responsible Person options, Profit Center code immutability, list volume/pagination, and Cashflow menu placement.
   - Verify authenticated read-only GETs to each endpoint in an isolated/dev environment; document sample success/error payloads. No mutation to shared data.

2. **Add shared Payable request/response boundary — implemented; live routing/auth proof pending**
   - Establish supported Payable API client selection using existing app configuration.
   - Add typed ApiResponse unwrapping/error mapping if current client does not already provide it.
   - Keep fixture selection explicit and development-only.
   - Acceptance: client test proves Payable base routing, auth propagation, envelope unwrapping, and no production fixture fallback.

### Phase B — existing fixture-backed screens, one vertical slice at a time

3. **Segment API adapter — implemented; live acceptance pending**
   - List/search/detail/create/update/status and active parent options map through the updated BE contract; numeric IDs are resolved for item routes.

4. **Profit Center API adapter — implemented; live acceptance pending**
   - Integrate list/search/detail/create/update/activate/deactivate; use Segment API for Segment options.
   - Parent code now maps to/from the updated BE DTO. The optional Responsible Person choice list has no BE endpoint and stays empty in API mode.
   - Code changes on edit are rejected because BE does not persist them.
   - Acceptance: create/edit/view/search/status flows use BE records and numeric IDs; relation fields round-trip correctly.

5. **KBLI API adapter — implemented; live acceptance pending**
   - Integrate list/search/detail/create/update/activate/deactivate; map numeric IDs and boolean status.
   - Acceptance: KBLI 01/03/04/05 flows pass against API; server validation appears at the relevant field or as a clear form error.

6. **Department API adapter — implemented; live acceptance pending**
   - Integrate list/search/detail/create/update/activate/deactivate; resolve parent selection to/from parentCode.
   - Acceptance: Department 01–05 flows pass; parent mapping and status survive reload.

### Phase C — Cashflow endpoints and UI

7. **Cashflow Category service and edit flow — service implemented; UI blocked on product/menu decision**
   - Add approved query hooks and label-edit UI; do not modify existing generic Category endpoint/model.
   - Acceptance: existing label loads, successful edit persists after reload, blank/whitespace label is rejected without losing the draft.

8. **Cashflow Group service and CRUD flow — service implemented; UI blocked on product/menu decision**
   - Add approved query hooks, load Cashflow Category options, and build list/detail/form UI after menu placement is approved. The current typed service maps `canDelete` and refuses known in-use deletion.
   - Acceptance: create/edit/list/search/status work; unused group deletes; used group stays visible and shows a clear error.

### Phase D — integrated verification and release readiness

9. **Sequential verification and browser QA**
   - Run targeted unit tests after each slice; then npm run lint, npm run build, npm run test:unit:run, and relevant npm run test:e2e flows sequentially.
   - Smoke-test against an isolated Payable BE environment with disposable records, not shared/prod data.
   - Browser-check loading, empty/search-miss, validation, mutation success/failure, and responsive layouts. Compare to approved Figma/PRD references and record status per screen.
   - Acceptance: all criteria pass; deployed mode never uses fixtures; visual QA passes separately before calling UI complete.

## 8. Test strategy

- Adapter unit tests: endpoint/method/query/body, response mapping, error cases, numeric-ID handling, active/status conversion, parent-code mapping, pagination, and canDelete behavior.
- Service/query tests: cache keys and invalidation after writes; loading/error/empty states.
- Component tests: form validation, preserved draft on server error, status/delete confirmation, and search miss.
- Integration smoke: authenticated GET/POST/PUT/activate/deactivate/delete against an isolated backend environment with cleanup.
- Sequential checks: npm run lint; npm run build; npm run test:unit:run; relevant npm run test:e2e.
- Do not report backend integration or visual completion from a build alone.

## 9. Boundaries

- **Always:** preserve current uncommitted FE work; keep fixtures explicitly development-only; surface API errors rather than masking with fixtures; test in isolated environments.
- **Confirm first:** BE DTO/endpoint changes, permissions, shared API-client behavior, database/data migration, or removal of the Profit Center parent/responsible-person UI.
- **Never:** map parent Profit Center to Business Unit by assumption; run test writes against production/shared data; silently repoint generic Category to Cashflow Category.

## 10. Open questions for approval

1. Should Segment retain its Activate/Deactivate control? If yes, can BE add explicit status endpoints?
2. What is the correct BE representation/source for Profit Center parent and Responsible Person options?
3. Are backend list sizes small enough for client-side pagination, or should BE add pageable responses before integration?
4. Should Cashflow Category and Cashflow Group appear as distinct menu items, and what are their labels/permissions?
5. Which environment will provide the Payable API URL, credentials/role, seeded data, and safe write-test access?
