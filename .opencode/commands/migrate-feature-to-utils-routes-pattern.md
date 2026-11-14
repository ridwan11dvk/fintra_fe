---
agent: build
description: Migrate a feature module to use the utils+routes pattern (like posting-asset or partner).
---

# Migrate Feature to Utils + Routes Pattern

## Context

This project uses a **utils + routes pattern** for each feature module. The reference implementations are:

- `src/features/monitoring/posting-asset/` — monitoring feature example
- `src/features/master-data/partner/` — master-data feature example

### Pattern Summary

Each feature folder must have:

1. **`data/<feature>.utils.ts`** — URL and permission constants + URL builder functions
2. **`routes.tsx`** — Lazy-loaded `<Route>` tree exported as `<featureName>Routes`
3. **`index.ts`** — Re-exports utils and routes alongside data/components/pages

The parent **app routes file** (e.g. `master-data-routes.tsx`) imports `<featureName>Routes` directly from the feature's `routes.tsx` and uses `{<featureName>Routes}` inline instead of declaring individual `<Route>` elements.

The parent **nav file** (e.g. `master-data.nav.ts`) imports title, base key, and URL constants from the feature's utils file instead of hardcoding strings.

---

## Task

Migrate the feature at **`{{FEATURE_PATH}}`** to follow the utils + routes pattern.

### Step 1 — Create `data/<feature>.utils.ts`

Use this template (replace `<FEATURE>` with the feature's name in the appropriate case):

```typescript
/**
 * <Feature Display Name> - Utility functions and constants
 */

// ============================================================================
// URL CONSTANTS
// ============================================================================

export const <FEATURE>_LIST_PAGE_TITLE = "<Display Title>";
export const <FEATURE>_BASE = "<url-segment>";          // e.g. "partner", "invoice"
export const <FEATURE>_URL = "/<parent-segment>/" + <FEATURE>_BASE; // e.g. "/master-data/partner"

// Add additional page title constants as needed, e.g.:
// export const <FEATURE>_CREATE_PAGE_TITLE = "Create <Feature>";
// export const <FEATURE>_UPDATE_PAGE_TITLE = "Edit <Feature>";
// export const <FEATURE>_DETAIL_PAGE_TITLE = "<Feature> Detail";

// Add URL builder functions for sub-routes, e.g.:
// export const <feature>CreateUrl = (): string => `${<FEATURE>_URL}/create`;
// export const <feature>DetailUrl = (id: number | string): string => `${<FEATURE>_URL}/${id}/show`;
// export const <feature>EditUrl = (id: number | string): string => `${<FEATURE>_URL}/${id}/edit`;

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const <FEATURE>_PERMISSION = "<module>:<resource>:";
export const <FEATURE>_LIST_PERMISSION = <FEATURE>_PERMISSION + "list";
export const <FEATURE>_READ_PERMISSION = <FEATURE>_PERMISSION + "read";
export const <FEATURE>_CREATE_PERMISSION = <FEATURE>_PERMISSION + "create";
export const <FEATURE>_UPDATE_PERMISSION = <FEATURE>_PERMISSION + "update";
export const <FEATURE>_DELETE_PERMISSION = <FEATURE>_PERMISSION + "delete";
```

Rules:

- Derive URL segment and base from the **existing routes** in the app routes file — do NOT change the actual URL paths.
- Derive permission strings from the **existing `permission` props** in the feature's page components.

---

### Step 2 — Create `routes.tsx`

```tsx
/**
 * <Feature Display Name> Feature Routes
 */

import { lazy } from "react";
import { Route } from "react-router";
import { <FEATURE>_BASE } from "./data/<feature>.utils";

// One lazy import per page component:
const <FeatureName>ListPage = lazy(() =>
  import("./pages/<feature>-list.page").then((mod) => ({
    default: mod.<FeatureName>ListPage,
  })),
);

// ... repeat for CreatePage, UpdatePage, ShowPage, DetailPage, etc.

export const <featureName>Routes = (
  <Route>
    <Route path={<FEATURE>_BASE} element={<<FeatureName>ListPage />} />
    {/* add sub-routes that existed in the app routes file */}
  </Route>
);
```

Rules:

- The `<Route>` paths inside must exactly reproduce what was previously defined inline in the app routes file.
- Import page components using **relative paths from the feature root** (not from `@/features/...`).

---

### Step 3 — Update `index.ts`

Add the following exports (after the existing data exports, before components):

```typescript
export * from "./data/<feature>.utils";

// Routes
export * from "./routes";
```

---

### Step 4 — Update the parent app routes file

In the relevant app routes file (e.g. `src/app/routes/master-data-routes.tsx`):

1. Add import at the top:
   ```typescript
   import { <featureName>Routes } from "@/features/<domain>/<feature>/routes";
   ```
2. Remove all individual lazy imports for this feature's pages.
3. Replace the individual inline `<Route>` elements for this feature with:
   ```tsx
   {<featureName>Routes}
   ```

---

### Step 5 — Update the parent nav file

In the relevant nav file (e.g. `src/layouts/main/nav-items/master-data.nav.ts`):

1. Add import:
   ```typescript
   import {
     <FEATURE>_BASE,
     <FEATURE>_LIST_PAGE_TITLE,
     <FEATURE>_URL,
   } from "@/features/<domain>/<feature>/data/<feature>.utils";
   ```
2. Replace the hardcoded `title`, `key`, and `url` values in the nav item with the imported constants.

---

### Step 6 — Update pages and components to use utils constants

In **every page** (`pages/*.page.tsx`) and any component that contains hardcoded URL strings or permission strings:

#### 6a — Update imports

Add the relevant constants to the existing feature import block (import from `@/features/<domain>` or the feature module root, not from `./data/...`):

```typescript
import {
  // URL constants
  <FEATURE>_URL,
  // Page title constants
  <FEATURE>_CREATE_PAGE_TITLE,
  <FEATURE>_UPDATE_PAGE_TITLE,
  <FEATURE>_DETAIL_PAGE_TITLE,
  // Permission constants
  <FEATURE>_LIST_PERMISSION,
  <FEATURE>_READ_PERMISSION,
  <FEATURE>_CREATE_PERMISSION,
  <FEATURE>_UPDATE_PERMISSION,
  <FEATURE>_DELETE_PERMISSION,
  // URL builder functions
  <feature>CreateUrl,
  <feature>DetailUrl,
  <feature>EditUrl,
  // ... other imports
} from "@/features/<domain>";
```

Only import what is actually used in that file.

#### 6b — Replace hardcoded strings

| Pattern to replace                                          | Replacement                                |
| ----------------------------------------------------------- | ------------------------------------------ |
| `navigate("/path/to/feature")`                              | `navigate(<feature>Url())`                 |
| `navigate(\`/path/to/${id}/show\`)`                         | `navigate(<feature>DetailUrl(id))`         |
| `navigate(\`/path/to/${id}/edit\`)`                         | `navigate(<feature>EditUrl(id))`           |
| `permission="module:resource:action"`                       | `permission={<FEATURE>_ACTION_PERMISSION}` |
| `url: "/path/to/feature"` in breadcrumbs                    | `url: <FEATURE>_URL`                       |
| `url: \`/path/to/${id}/show\`` in breadcrumbs               | `url: <feature>DetailUrl(id)`              |
| `title="Create Feature"` in `<MainLayout>` / `<PageHeader>` | `title={<FEATURE>_CREATE_PAGE_TITLE}`      |
| `title="Edit Feature"` in `<MainLayout>` / `<PageHeader>`   | `title={<FEATURE>_UPDATE_PAGE_TITLE}`      |

Rules:

- Search all files in `pages/` and `components/` for hardcoded strings matching the feature URL path and permission prefix.
- Do NOT change labels or user-visible text that are intentionally different from the constants (e.g. `description` props).
- Use `{CONSTANT}` (JSX expression) when replacing string literal props.

#### 6c — Add breadcrumbs to pages that are missing them

Every page that renders `<MainLayout>` **must** have a `breadcrumbs` prop. Check each page:

| Page type   | Required breadcrumbs                                                                                                                                                   |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| List page   | `[{ title: "Parent Section", url: "#" }, { title: <FEATURE>_LIST_PAGE_TITLE, url: <FEATURE>_URL }]`                                                                    |
| Create page | `[{ title: "Parent Section", url: "#" }, { title: <FEATURE>_LIST_PAGE_TITLE, url: <FEATURE>_URL }, { title: <FEATURE>_CREATE_PAGE_TITLE, url: <feature>CreateUrl() }]` |
| Update page | `[{ title: "Parent Section", url: "#" }, { title: <FEATURE>_LIST_PAGE_TITLE, url: <FEATURE>_URL }]`                                                                    |
| Show page   | `[{ title: <FEATURE>_LIST_PAGE_TITLE, url: <FEATURE>_URL }, { title: record.name, url: <feature>DetailUrl(record.id) }]`                                               |

Use constants from utils for **all breadcrumb titles and URLs** — never hardcode strings.

#### 6d — Add `permission` to all `<ActionButton>` and `<Visibility>` components

Every `<ActionButton>` and `<Visibility>` component that triggers a protected action must have a `permission` prop using the appropriate constant:

**Main feature pages** (list, create, update, show):

| Button `variant` | Required `permission` prop      |
| ---------------- | ------------------------------- |
| `"add"`          | `{<FEATURE>_CREATE_PERMISSION}` |
| `"edit"`         | `{<FEATURE>_UPDATE_PERMISSION}` |
| `"delete"`       | `{<FEATURE>_DELETE_PERMISSION}` |
| `"show"`         | `{<FEATURE>_READ_PERMISSION}`   |

**Derived/child data sub-components** (e.g. branches, erp codes, taxes, documents, transaction accounts — data that belongs to and is managed as part of the parent record):

| Button `variant` | Required `permission` prop      |
| ---------------- | ------------------------------- |
| `"add"`          | `{<FEATURE>_UPDATE_PERMISSION}` |
| `"edit"`         | `{<FEATURE>_UPDATE_PERMISSION}` |
| `"delete"`       | `{<FEATURE>_UPDATE_PERMISSION}` |
| `"show"`         | `{<FEATURE>_READ_PERMISSION}`   |

> Derived data components only need `<FEATURE>_UPDATE_PERMISSION` and `<FEATURE>_READ_PERMISSION` in their imports. Do **not** import `<FEATURE>_CREATE_PERMISSION` or `<FEATURE>_DELETE_PERMISSION` for sub-components.

This applies to **all files** in `pages/` and `components/` — including sub-components that render inline tables with action columns.

For components that import from `@/features/<domain>`, add the permission constants to the same import block. For components that only import from a local types path (e.g. `./data/<feature>.types`), add a separate import from `./data/<feature>.utils`.

---

## Step 7 — Lint and SonarQube Scan (MANDATORY)

After all code changes are complete, scan every modified file for quality and security issues and fix them before considering the migration done.

### 7a — Run ESLint

```bash
npm run lint
```

Fix all errors and warnings reported. No lint errors are permitted.

### 7b — Run SonarQube analysis

Use the `sonarqube_analyze_file` tool on **every file** you created or modified. Then call `get_errors` on the feature folder to surface all remaining diagnostics:

```
sonarqube_analyze_file(<file>)   # repeat for each file
get_errors(["src/features/<domain>/<feature>"])
```

### Common issues to fix

| Issue                                                        | Fix                                                                                                                                                                                                            |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Move this component definition out of the parent component" | Extract `column` definitions to a module-level factory function `createXxxColumns({ onEdit, onDelete, ... })` that accepts handler callbacks. Call it inside the component. Pattern: see `partner-columns.tsx` |
| `String(info.getValue() ?? "")` — object stringification     | Use `row.original.<field>` instead of `info.getValue()` for typed access                                                                                                                                       |
| `value as Type` — unnecessary assertion                      | Remove the cast; use the value directly or via `row.original.<field>`                                                                                                                                          |
| `value!` — unnecessary non-null                              | Remove the `!`; fix the guard condition if needed                                                                                                                                                              |
| `a && a.b` — prefer optional chain                           | Replace with `a?.b`                                                                                                                                                                                            |

### Column factory function pattern

```tsx
// OUTSIDE the component — module-level
interface XxxColumnsConfig {
  onEdit: (item: XxxType) => void;
  onDelete: (item: XxxType) => void;
}

function createXxxColumns({
  onEdit,
  onDelete,
}: Readonly<XxxColumnsConfig>): ColumnDef<XxxType>[] {
  return [
    // ... column definitions with JSX cell renderers
  ];
}

// INSIDE the component
const columns = createXxxColumns({
  onEdit: handleOpenEditFormModal,
  onDelete: handleOpenDeleteModal,
});
```

> This pattern is mandatory for any component that defines TanStack Table columns with JSX cell renderers inside the component body.

---

## Validation Checklist

After completing all steps:

- [ ] `data/<feature>.utils.ts` created with all URL + permission constants
- [ ] `routes.tsx` created exporting `<featureName>Routes`
- [ ] `index.ts` exports utils and routes
- [ ] App routes file no longer has inline lazy imports or `<Route>` elements for this feature
- [ ] Nav file uses imported constants instead of hardcoded strings
- [ ] All pages and components use utils constants — no hardcoded URL paths or permission strings remain
- [ ] All `<ActionButton>` and `<Visibility>` components have `permission` props using constants
- [ ] All `<MainLayout>` renders have a `breadcrumbs` prop with titles from utils constants
- [ ] All table column definitions with JSX cells are extracted to module-level factory functions
- [ ] `sonarqube_analyze_file` run on all modified files — no issues remain
- [ ] `get_errors` on the feature folder returns no errors
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` passes with no errors

---

## Reference Files

| File                                                                | Role                         |
| ------------------------------------------------------------------- | ---------------------------- |
| `src/features/master-data/partner/data/partner.utils.ts`            | Utils template               |
| `src/features/master-data/partner/routes.tsx`                       | Routes template              |
| `src/features/master-data/partner/index.ts`                         | Index export template        |
| `src/features/master-data/partner/pages/partner-list.page.tsx`      | Page using utils (list)      |
| `src/features/master-data/partner/pages/partner-create.page.tsx`    | Page using utils (create)    |
| `src/features/master-data/partner/pages/partner-update.page.tsx`    | Page using utils (update)    |
| `src/features/master-data/partner/pages/partner-show.page.tsx`      | Page using utils (show)      |
| `src/app/routes/master-data-routes.tsx`                             | App routes consumer template |
| `src/layouts/main/nav-items/master-data.nav.ts`                     | Nav consumer template        |
| `src/features/monitoring/posting-asset/data/posting-asset.utils.ts` | Monitoring utils reference   |
| `src/features/monitoring/posting-asset/routes.tsx`                  | Monitoring routes reference  |
