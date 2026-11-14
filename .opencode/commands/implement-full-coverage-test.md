---
agent: build
description: Implement full unit test coverage for any feature module — flexible for any structure (data layer + components + pages). Reference: partner (complex) and bank (simple). Follows TanStack Query v5 testing best practices.
---

# Implement Full Coverage Unit Tests for a Feature

## Context

> **Skill:** Always activate the `vitest` skill before writing any test code. It provides up-to-date API references for test/describe/mock/coverage utilities.

This project uses **Vitest v4** + **MSW v2** + **@testing-library/react** + **TanStack Query v5** for unit tests.

Follow the official [TanStack Query Testing Guide](https://tanstack.com/query/latest/docs/framework/react/guides/testing) for authoritative guidance on query/mutation testing patterns.

### Reference Implementations

- **partner** — complex module with sub-components, multiple pages, and child form modals:
  - `tests/unit/features/master-data/partner/data/` — data layer tests
  - `tests/unit/features/master-data/partner/components/` — 12 component tests (columns, form, 5 sub-panels, 5 sub-form-modals)
  - `tests/unit/features/master-data/partner/pages/` — 4 page tests
- **bank** — simple module with one component and one page:
  - `tests/unit/features/master-data/bank/data/` — data layer tests
  - `tests/unit/features/master-data/bank/components/` — component tests
- `tests/unit/mocks/handlers.ts` — global MSW request handlers

### Testing Infrastructure (already set up — DO NOT modify)

| File                                       | Purpose                                                                                |
| ------------------------------------------ | -------------------------------------------------------------------------------------- |
| `vitest.config.ts`                              | Vitest config — jsdom, globals, coverage via V8                                        |
| `tests/unit/setup.ts`                           | MSW lifecycle, jest-dom matchers, stubs                                                |
| `tests/unit/mocks/server.ts`                    | MSW Node server                                                                        |
| `tests/unit/mocks/handlers.ts`                  | Aggregates all module handlers (imports only)                                          |
| `tests/unit/utils/render-with-providers.tsx`    | `render` + `renderHook` with QueryClient + MemoryRouter + TanStack Query test defaults |

### Handler Architecture

Handlers are **co-located with the feature** and imported into the global server:

```
tests/unit/features/master-data/<feature>/data/<feature>.handlers.ts    ← module handlers
tests/unit/mocks/handlers.ts                                             ← imports all modules
```

This keeps mock data close to the feature tests and makes `handlers.ts` a clean index file.

### TanStack Query Testing Best Practices

Per the [official TanStack Query guide](https://tanstack.com/query/latest/docs/framework/react/guides/testing):

1. **Fresh QueryClient per test** — Each test gets its own `QueryClient` instance to ensure isolation
2. **Disable retries in tests** — Default `retry: false` in test QueryClient to avoid timeout hangs
3. **Use renderHook wrapper** — Wrap queries/mutations with QueryClientProvider for proper context
4. **Wait for query states** — Use `waitFor()` to assert on `isSuccess`, `isError`, `isPending` states
5. **Mock network via MSW** — Use `server.use()` overrides for network call testing

All of this is configured in `tests/unit/utils/render-with-providers.tsx` and applied automatically by the `renderHook` and `render` helpers.

### Coverage Exclusions (already in vitest.config.ts)

These files are **excluded from coverage** — still write tests for them but they won't affect metrics:

- `*.types.ts`, `*.schema.ts`, `index.ts`, `routes.tsx`, `src/main.tsx`, `src/app/**`

---

## Task

Implement full unit test coverage for the feature at: **`$FEATURE_PATH`**

Where `$FEATURE_PATH` is the feature folder you specify, e.g. `src/features/master-data/currency`.

---

## Step-by-Step Instructions

### Step 0 — Explore the Feature (MANDATORY — do NOT skip)

**Every module is different.** Use `list_dir` and `read_file` to discover ALL source files before writing any test.

#### 0a. List all directories and files

```
list_dir($FEATURE_PATH/data)
list_dir($FEATURE_PATH/components)
list_dir($FEATURE_PATH/pages)        ← may not exist in all modules
```

Common layouts you may find:

| Layout                                                                                                                | Modules that use it     | Notes                                        |
| --------------------------------------------------------------------------------------------------------------------- | ----------------------- | -------------------------------------------- |
| `components/` has only `<name>-columns.tsx` + `<name>-form-modal.tsx`                                                 | bank, currency, country | Simple — bank is the reference               |
| `components/` has sub-panels + sub-form-modals                                                                        | partner                 | Complex — partner is the reference           |
| `components/` has `<name>-detail-modal.tsx`                                                                           | close-payment           | Add detail-modal tests                       |
| `components/` has `<name>-filters.tsx`                                                                                | monitoring features     | Add filter component tests                   |
| `pages/` has a single `<name>.page.tsx`                                                                               | bank                    | Simple page — mock DataTable, ActionButton   |
| `pages/` has split `<name>-list.page.tsx`, `<name>-create.page.tsx`, `<name>-show.page.tsx`, `<name>-update.page.tsx` | partner                 | Complex pages — each needs its own test file |

#### 0b. Read every source file

For each file in `data/` and `components/` and `pages/`, read the source to identify:

1. **Data files**: What API endpoints does the service call? What are the Zod required fields and exact error messages?
2. **Components**: What hooks does the component import?
   - `useAuth` → add `vi.mock("@railfinance/core", ...)`
   - `useMasterDataXxx` from `@/shared/query/option-data.query` → add mock returning `{ data: [...], isLoading: false }`
   - `useXxxMutation` / `useXxxQuery` from the feature barrel → mock via `vi.mock("@/features/...", ...)`
   - Sibling component imports → mock via **direct relative path** (not the barrel)
3. **Conditional rendering guards**: Is any UI wrapped in `{(mode as string) === "disabled-feature" && ...}`? → Do NOT write tests for that UI — it will never render.
4. **Commented-out fields**: Is any input wrapped in `{/* ... */}`? → Use `defaultValues` to pre-populate those fields instead of typing into inputs.
5. **`isLocalMode` prop**: Does the component have a `isLocalMode` flag? → Test both `isLocalMode={true}` (bypasses mutations) and `isLocalMode={false}` (calls API).
6. **Submit button label**: Does the modal pass a custom `confirmText` prop? → If not, the default is `"Confirm"` — test with `getByRole("button", { name: /confirm/i })`.

#### 0c. Build the test plan

Before writing any code, list which test files you will create and what they will test. For a complex module like partner, the plan looks like:

```
tests/unit/features/master-data/<feature>/
├─ data/
│    <name>.handlers.ts        ← MSW mock data + handlers
│    <name>.utils.test.ts      ← one test per exported constant
│    <name>.schema.test.ts     ← valid + invalid Zod cases
│    <name>.service.test.ts    ← one test per service method
│    <name>.query.test.ts      ← one test per hook (success/disabled/error)
│    <name>.mutation.test.ts   ← one test per mutation (success/error)
├─ components/
│    <name>-columns.test.tsx   ← column count, ids, cell renderers
│    <name>-form-modal.test.tsx ← create/edit modes, validation, submit
│    <name>-detail-modal.test.tsx ← if detail modal exists
│    <name>-filters.test.tsx   ← if filter component exists
│    <name>-<sub>.test.tsx     ← for each sub-panel (partner-branches, etc.)
│    <name>-<sub>-form-modal.test.tsx ← for each sub-form-modal
└─ pages/
     <name>.page.test.tsx      ← if single page
     <name>-list.page.test.tsx ← if split pages
     <name>-create.page.test.tsx
     <name>-show.page.test.tsx
     <name>-update.page.test.tsx
```

### Step 1 — Create `<feature>.handlers.ts` and register it in `handlers.ts`

**1a. Create the module handler file**

Location: `tests/unit/features/master-data/<feature>/data/<feature>.handlers.ts`

This file owns all mock data and MSW handlers for the feature. Export `mock<Feature>`, paged/single response shapes, and the `<feature>Handlers` array.

```ts
import type { <Feature>Response } from "@/features/master-data/<feature>/data/<feature>.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mock<Feature>: <Feature>Response = {
  id: 1,
  // ... all fields with realistic values
};

export const paged<Feature>Response: PagedApiResponse<<Feature>Response> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mock<Feature>],
    pagination: { total: 1, pageSize: 10, pageNumber: 1, totalPages: 1, currentPage: 1, from: 1, to: 1 },
  },
};

export const single<Feature>Response: ApiResponse<<Feature>Response> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mock<Feature>,
};

export const <feature>Handlers = [
  // List
  http.get(`${BASE}/master/<resource>`, () => HttpResponse.json(paged<Feature>Response)),

  // Get by ID
  http.get(`${BASE}/master/<resource>/:id`, () => HttpResponse.json(single<Feature>Response)),

  // Create
  http.post(`${BASE}/master/<resource>`, () =>
    HttpResponse.json(single<Feature>Response, { status: 201 })
  ),

  // Update
  http.put(`${BASE}/master/<resource>/:id`, () => HttpResponse.json(single<Feature>Response)),

  // Delete
  http.delete(`${BASE}/master/<resource>/:id`, () =>
    HttpResponse.json({ status: "SUCCESS", message: "Data deleted successfully" })
  ),

  // Export (blob)
  http.get(`${BASE}/master/<resource>/export`, () =>
    new HttpResponse(new Blob(["excel-data"], { type: "application/vnd.ms-excel" }), {
      headers: { "Content-Type": "application/vnd.ms-excel" },
    })
  ),

  // Import template (blob)
  http.get(`${BASE}/master/<resource>/import/template`, () =>
    new HttpResponse(new Blob(["template-data"], { type: "application/vnd.ms-excel" }), {
      headers: { "Content-Type": "application/vnd.ms-excel" },
    })
  ),

  // Import
  http.post(`${BASE}/master/<resource>/import`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Import successful",
      data: { summary: { total: 5, success: 5, failed: 0 }, rowErrors: [], errorReport: { fileUrl: null } },
    })
  ),
];
```

**1b. Register in the global `tests/unit/mocks/handlers.ts`**

Add a one-line import and spread the new array:

```ts
import { <feature>Handlers } from "@tests/unit/features/master-data/<feature>/data/<feature>.handlers";
// ... existing imports

export const handlers = [
  ...existingHandlers,
  ...<feature>Handlers,
];
```

> The global `handlers.ts` is an **index-only file** — it never defines mock data or handler logic directly.

### Step 2 — Create `<feature>.utils.test.ts`

Location: `tests/unit/features/master-data/<feature>/data/<feature>.utils.test.ts`

Test all exported constants with simple equality checks. No external dependencies needed.

```ts
import { describe, expect, it } from "vitest";
import {
  FEATURE_LIST_PAGE_TITLE,
  FEATURE_BASE,
  FEATURE_URL,
  FEATURE_PERMISSION,
  FEATURE_LIST_PERMISSION,
  // ... all other permission constants
} from "@/features/master-data/<feature>/data/<feature>.utils";

describe("<feature>.utils", () => {
  describe("URL constants", () => {
    it("has correct FEATURE_LIST_PAGE_TITLE", () => {
      expect(FEATURE_LIST_PAGE_TITLE).toBe("...");
    });
    // one test per constant
  });

  describe("permission constants", () => {
    it("all action permissions start with FEATURE_PERMISSION prefix", () => {
      const permissions = [FEATURE_LIST_PERMISSION, ...];
      permissions.forEach((p) => expect(p).toMatch(/^<module>:<resource>:/));
    });

    it("all action permissions are distinct", () => {
      const permissions = [...];
      expect(new Set(permissions).size).toBe(permissions.length);
    });
  });
});
```

### Step 3 — Create `<feature>.schema.test.ts`

Location: `tests/unit/features/master-data/<feature>/data/<feature>.schema.test.ts`

Test the Zod schema covering valid data, required field errors, optional fields, and boundary conditions.

```ts
import { describe, expect, it } from "vitest";
import { <feature>Schema } from "@/features/master-data/<feature>/data/<feature>.schema";

describe("<feature>Schema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => { ... });
    it("accepts a minimal valid object", () => { ... });
    it("accepts optional fields as undefined", () => { ... });
  });

  describe("<field> validation", () => {
    it("rejects empty <requiredField>", () => {
      const result = <feature>Schema.safeParse({ /* bad data */ });
      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "<field>");
        expect(err?.message).toBe("Expected error message");
      }
    });
    it("rejects <field> exceeding max length", () => { ... });
    it("accepts <field> at exactly max length", () => { ... });
  });
});
```

### Step 4 — Expand / create `<feature>.service.test.ts`

Location: `tests/unit/features/master-data/<feature>/data/<feature>.service.test.ts`

Test each service method: success cases, param forwarding, error cases. For blob methods, verify `instanceof Blob`.

**⚠️ CRITICAL — FormData dryRun pattern:**  
MSW in Node.js cannot parse `File` from jsdom via `request.formData()`. Instead, use a `vi.spyOn(FormData.prototype, "append")` spy to verify FormData contents.

```ts
// ✅ CORRECT — spy on FormData.append
it("sends dryRun=true in FormData when specified", async () => {
  const appendSpy = vi.spyOn(FormData.prototype, "append");
  const file = new File(["content"], "items.xlsx", {
    type: "application/vnd.ms-excel",
  });

  await (<feature>Service.import<Feature>(file, true));

  expect(appendSpy).toHaveBeenCalledWith("dryRun", "true");
  appendSpy.mockRestore();
});

// ❌ WRONG — do NOT use request.formData() in handlers for File uploads
```

### Step 5 — Create `<feature>.query.test.ts`

Location: `tests/unit/features/master-data/<feature>/data/<feature>.query.test.ts`

Always mock `sonner` at the top. Test queryKeys structure, then each hook.

**Key TanStack Query Testing Patterns:**

- **Test successful queries**: Render the hook, wait for `isSuccess` state, then assert data shape
- **Test disabled queries**: Pass `{ enabled: false }` and verify hook does NOT fetch
- **Test error states**: Use `server.use()` to override the handler with a 500 response, then verify `isError`
- **Wait for state changes**: Always use `waitFor()` when asserting on query states (they update asynchronously)

```ts
import { server } from "@tests/unit/mocks/server";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

describe("<feature>QueryKeys", () => {
  it("all returns base key", () => {
    expect(<feature>QueryKeys.all).toEqual(["<resources>"]);
  });
  // test each queryKey factory: list, detail, etc.
});

describe("use<Feature>List", () => {
  it("fetches and returns paged data when enabled (default)", async () => {
    const { result } = renderHook(() => use < Feature > List());

    // Queries are not fetching until mounted
    expect(result.current.isFetching || result.current.isPending).toBe(true);

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Verify the response structure
    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toBeInstanceOf(Array);
  });

  it("does not fetch when enabled option is false", async () => {
    const { result } = renderHook(
      () => use < Feature > List(undefined, { enabled: false }),
    );

    // Hook should not be fetching
    expect(result.current.isFetching).toBe(false);
    expect(result.current.isPending).toBe(false);

    // data should be undefined
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    // Override the handler for this test
    server.use(
      http.get(`http://localhost:3000/master/<resource>`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => use < Feature > List());

    // Wait for error state (queries have retry: false in tests)
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});

// For blob hooks (export/template):
describe("use<Feature>Export", () => {
  it("fetches and returns a Blob when enabled", async () => {
    const { result } = renderHook(
      () => use < Feature > Export(undefined, { enabled: true }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeInstanceOf(Blob);
    expect(result.current.data?.type).toBe("application/vnd.ms-excel");
  });

  it("does not fetch when enabled is false", () => {
    const { result } = renderHook(
      () => use < Feature > Export(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});
```

### Step 6 — Create `<feature>.mutation.test.ts`

Location: `tests/unit/features/master-data/<feature>/data/<feature>.mutation.test.ts`

Always mock `sonner`. **Never wait on `mutation.isSuccess`** — after success, `useHandleMutationResponse` calls `mutation.reset()` which reverts state to `idle`. **Wait for `toast.success` instead** or verify the side effect (query invalidation, data update).

**Key TanStack Query Mutation Patterns:**

- **Test successful mutations**: Call `mutation.mutate()`, wait for success callback (toast, query invalidation)
- **Test error handling**: Override handler with error response, verify error callback fires (toast.error)
- **Avoid `isSuccess` assertions**: The mutation hook resets after success callback, making `isSuccess === true` transient
- **Verify side effects**: Check that queries get invalidated or data gets updated via `queryClient` methods

```ts
import { server } from "@tests/unit/mocks/server";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

describe("use<Feature>CreateMutation", () => {
  it("successfully creates and calls onSuccess callback", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => use < Feature > CreateMutation());

    const payload = {
      /* valid data */
    };
    result.current.mutate(payload);

    // ✅ CORRECT — wait for the success callback (toast.success) to fire
    // Do NOT wait for mutation.isSuccess because it resets immediately after
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("handles validation errors from server (422)", async () => {
    const { toast } = await import("sonner");

    // Override handler to return validation error
    server.use(
      http.post(`http://localhost:3000/master/<resource>`, () =>
        HttpResponse.json(
          {
            status: "VALIDATION_ERROR",
            message: "Validation failed",
            data: {
              fieldErrors: {
                name: ["Name already exists"],
              },
            },
          },
          { status: 422 },
        ),
      ),
    );

    const { result } = renderHook(() => use < Feature > CreateMutation());
    result.current.mutate({
      /* payload */
    });

    // Wait for error callback
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it("handles server errors (500)", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.post(`http://localhost:3000/master/<resource>`, () =>
        HttpResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        ),
      ),
    );

    const { result } = renderHook(() => use < Feature > CreateMutation());
    result.current.mutate({
      /* payload */
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("use<Feature>UpdateMutation", () => {
  // Similar pattern to Create
  it("successfully updates and invalidates list query", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => use < Feature > UpdateMutation());

    result.current.mutate({ id: 1 /* updated fields */ });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });
});

describe("use<Feature>DeleteMutation", () => {
  // Test delete without expecting data response
  it("successfully deletes", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => use < Feature > DeleteMutation());

    result.current.mutate(1); // id

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });
});
```

### Step 7 — Create `<feature>-columns.test.tsx`

Location: `tests/unit/features/master-data/<feature>/components/<feature>-columns.test.tsx`

Mock `useAuth` since columns use `ActionButton → Visibility → useAuth()`. Use the `TestColumnDef` cast pattern to avoid TypeScript union type errors on `accessorKey`.

```tsx
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { flexRender } from "@tanstack/react-table";
import { describe, expect, it, vi } from "vitest";
import { <feature>Columns } from "@/features/master-data/<feature>/components/<feature>-columns";

vi.mock("@railfinance/core", () => ({
  useAuth: () => ({
    can: () => true,
    hasResource: () => true,
    permissions: [], roles: [], user: {}, token: null,
    isSuperAdmin: false, isAuthenticated: true, isLoading: false,
    isRefreshing: false, error: null,
    logout: vi.fn(), scheduleTokenRefresh: vi.fn(),
  }),
}));

// ⚠️ REQUIRED — ColumnDef is a union type; this cast avoids TS2339 errors
type TestColumnDef = {
  id?: string;
  accessorKey?: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  meta?: { title: string };
  cell?: React.ComponentType<never>;
  header?: React.ComponentType<never> | ((ctx: never) => React.ReactNode);
};

describe("<feature>Columns", () => {
  it("returns an array of N columns", () => {
    expect(<feature>Columns(mockHandlers)).toHaveLength(N);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = <feature>Columns(mockHandlers) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual(["number", "field1", "field2", ..., "actions"]);
  });

  it("number column has enableSorting: false and enableHiding: false", () => {
    const columns = <feature>Columns(mockHandlers) as unknown as TestColumnDef[];
    const col = columns.find((c) => (c.id ?? c.accessorKey) === "number");
    expect(col?.enableSorting).toBe(false);
    expect(col?.enableHiding).toBe(false);
  });

  it("each column has a meta.title defined", () => {
    const columns = <feature>Columns(mockHandlers) as unknown as TestColumnDef[];
    columns.forEach((col) => expect(col.meta?.title).toBeTruthy());
  });

  // Test cell renderers using flexRender
  it("renders number cell with row index + 1", () => {
    const columns = <feature>Columns(mockHandlers) as unknown as TestColumnDef[];
    const numberCol = columns.find((c) => c.id === "number");
    if (!numberCol?.cell) return;

    render(
      flexRender(numberCol.cell, {
        row: { index: 2, original: {} },
        column: { id: "number" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {}, cell: {},
        getContext: () => ({} as never),
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
```

### Step 8 — Create `<feature>-form-modal.test.tsx`

Location: `tests/unit/features/master-data/<feature>/components/<feature>-form-modal.test.tsx`

Mock both `useAuth` and `sonner`. Test create/edit modes, Zod validation messages, successful submission flow.

```tsx
import { render, screen, waitFor } from "@tests/unit/utils/render-with-providers";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { <Feature>FormModal } from "@/features/master-data/<feature>/components/<feature>-form-modal";

vi.mock("@railfinance/core", () => ({
  useAuth: () => ({
    can: () => true, hasResource: () => true, permissions: [], roles: [],
    user: {}, token: null, isSuperAdmin: false, isAuthenticated: true,
    isLoading: false, isRefreshing: false, error: null,
    logout: vi.fn(), scheduleTokenRefresh: vi.fn(),
  }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

describe("<Feature>FormModal", () => {
  describe("when open=false", () => {
    it("does not render modal content when closed", () => {
      render(<<Feature>FormModal open={false} onOpenChange={vi.fn()} mode="create" />);
      expect(screen.queryByText("Add <Feature>")).not.toBeInTheDocument();
    });
  });

  describe("create mode", () => {
    it("renders the modal title 'Add <Feature>'", () => {
      render(<<Feature>FormModal open={true} onOpenChange={vi.fn()} mode="create" />);
      expect(screen.getByText("Add <Feature>")).toBeInTheDocument();
    });

    it("renders a 'Create' confirm button", () => {
      render(<<Feature>FormModal open={true} onOpenChange={vi.fn()} mode="create" />);
      expect(screen.getByRole("button", { name: /^create$/i })).toBeInTheDocument();
    });

    it("shows validation error when submitting empty form", async () => {
      const user = userEvent.setup();
      render(<<Feature>FormModal open={true} onOpenChange={vi.fn()} mode="create" />);
      await user.click(screen.getByRole("button", { name: /^create$/i }));
      await waitFor(() => {
        expect(screen.getByText("<Required field> is required")).toBeInTheDocument();
      });
    });

    it("calls onOpenChange(false) after successful form submission", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(<<Feature>FormModal open={true} onOpenChange={onOpenChange} mode="create" />);

      await user.type(screen.getByLabelText(/<field label>/i), "Test Value");
      // ... fill all required fields
      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    });
  });

  describe("edit mode", () => {
    const defaultValues = { id: 1, /* all fields */ };

    it("renders the modal title 'Edit <Feature>'", () => {
      render(<<Feature>FormModal open={true} onOpenChange={vi.fn()} mode="edit" defaultValues={defaultValues} />);
      expect(screen.getByText("Edit <Feature>")).toBeInTheDocument();
    });

    it("pre-fills fields with defaultValues", () => {
      render(<<Feature>FormModal open={true} onOpenChange={vi.fn()} mode="edit" defaultValues={defaultValues} />);
      const input = screen.getByLabelText(/<field>/i) as HTMLInputElement;
      expect(input.value).toBe(defaultValues.<field>);
    });

    // Test disabled fields in edit mode (e.g., code field)
    it("<field> is disabled in edit mode", () => {
      render(<<Feature>FormModal open={true} onOpenChange={vi.fn()} mode="edit" defaultValues={defaultValues} />);
      expect(screen.getByPlaceholderText(/<placeholder>/i)).toBeDisabled();
    });
  });
});
```

### Step 8b — Sub-panel / List Component Tests (if module has sub-panels)

Some modules have sub-panels — list components that embed a data table + add/edit/delete sub-items (e.g. `partner-branches.tsx`, `partner-taxes.tsx`).

**Key rules for sub-panel tests:**

1. **Mock the sub-form modal via DIRECT relative path** — the barrel mock does NOT intercept components in the same folder:

   ```ts
   // ✅ Correct — direct relative path
   vi.mock("../partner-branch-form-modal", () => ({
     PartnerBranchFormModal: ({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) =>
       open ? <div data-testid="branch-modal"><button onClick={() => onOpenChange(false)}>Close</button></div> : null,
   }));
   // ❌ Wrong — barrel import does not override sibling component
   vi.mock("@/features/master-data", async importOriginal => ({ ...actual, PartnerBranchFormModal: () => null }));
   ```

2. **Mock ActionButton with testId** — enables `getByTestId("action-btn-add")`, `getByTestId("action-btn-edit")`, `getByTestId("action-btn-delete")`:

   ```ts
   vi.mock("@railfinance/core", () => ({
     default: ({ onClick, label, variant }: { onClick?: () => void; label?: string; variant?: string }) => (
       <button data-testid={`action-btn-${variant}`} onClick={onClick}>{label ?? variant}</button>
     ),
     ActionButton: ({ onClick, label, variant }: { onClick?: () => void; label?: string; variant?: string }) => (
       <button data-testid={`action-btn-${variant}`} onClick={onClick}>{label ?? variant}</button>
     ),
   }));
   ```

3. **Mock DataTable/OfflineDataTable** — the real component needs a full React Table setup:

   ```ts
   vi.mock("@railfinance/core", () => ({
     DataTable: ({ columns }: { columns: unknown[] }) => (
       <div data-testid="data-table"><span data-testid="columns-count">{columns?.length}</span></div>
     ),
   }));
   ```

4. **Test the add/edit/delete/confirm flow** (modal opens → interaction → closes):

   ```tsx
   it("opens add modal when Add button clicked", async () => {
     const user = userEvent.setup();
     render(<PartnerBranches partnerId={1} />);
     await user.click(screen.getByTestId("action-btn-add"));
     expect(screen.getByTestId("branch-modal")).toBeInTheDocument();
   });
   ```

5. **`isLocalMode` prop**: If the sub-panel accepts `isLocalMode`, test both:
   - `isLocalMode={true}`: mutations are bypassed; `onSuccess` is called with local data
   - `isLocalMode={false}` (default): API mutations are used

#### Sub-form modal tests (e.g. `partner-branch-form-modal.test.tsx`)

Sub-form modals (modals belonging to sub-panels) may NOT have their own MSW handlers. Mock their mutation hooks directly:

```ts
vi.mock("@/features/master-data", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/master-data")>();
  return {
    ...actual,
    useCreatePartnerBranchMutation: ({
      onSuccess,
    }: {
      onSuccess?: () => void;
    }) => ({
      mutate: (_data: unknown) => {
        onSuccess?.();
      },
      isPending: false,
    }),
    useUpdatePartnerBranchMutation: ({
      onSuccess,
    }: {
      onSuccess?: () => void;
    }) => ({
      mutate: (_data: unknown) => {
        onSuccess?.();
      },
      isPending: false,
    }),
  };
});
```

---

### Step 8c — Page Tests

**Every page file needs a test file.** Read the page source first to identify all imports, hooks, and layout components.

#### Standard page mocks

```tsx
// 1. Router hooks — always mock when page uses useNavigate / useParams / useSearchParams
vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router")>()),
  useNavigate: () => vi.fn(),
  useParams: () => ({ id: "1" }),
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
}));

// 2. Layout stubs — match what the page actually imports from "@/layouts"
vi.mock("@/layouts", () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
  PageHeader: ({ title }: { title?: string }) => (
    <div data-testid="page-header">{title}</div>
  ),
  LoadDataPage: ({ title }: { title?: string }) => (
    <div data-testid="load-data-page">{title}</div>
  ),
}));

// 3. Feature sub-components — mock via direct relative path or feature barrel
vi.mock("../partner-form", () => ({
  PartnerForm: ({ mode }: { mode?: string }) => (
    <div data-testid="partner-form" data-mode={mode} />
  ),
}));

// 4. Feature mutations — if page calls delete/activate/deactivate directly
vi.mock("@/features/master-data", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/features/master-data")>()),
  useDeletePartnerMutation: () => ({ mutate: vi.fn(), isPending: false }),
}));

// 5. useAuth — always
vi.mock("@railfinance/core", () => ({
  useAuth: () => ({
    can: () => true,
    hasResource: () => true,
    permissions: [],
    roles: [],
    user: {},
    token: null,
    isSuperAdmin: false,
    isAuthenticated: true,
    isLoading: false,
    isRefreshing: false,
    error: null,
    logout: vi.fn(),
    scheduleTokenRefresh: vi.fn(),
  }),
}));

// 6. sonner toast — always
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));
```

#### List page test pattern

```tsx
describe("<Name>ListPage", () => {
  it("renders without crashing", () => {
    render(<NameListPage />);
    expect(screen.getByTestId("main-layout")).toBeInTheDocument();
  });

  it("renders page title in header", () => {
    render(<NameListPage />);
    expect(screen.getByTestId("page-header")).toHaveTextContent(/page title/i);
  });

  it("opens create modal when Add button clicked", async () => {
    const user = userEvent.setup();
    render(<NameListPage />);
    await user.click(screen.getByTestId("action-btn-add"));
    expect(screen.getByTestId("form-modal")).toBeInTheDocument();
  });
});
```

#### Show/Detail page test pattern

```tsx
const mockData = vi.hoisted(() => ({
  mockEntity: { id: 1, name: "Test" /* all fields */ } as EntityType,
}));

// The show page likely calls useEntityById — mock the query hook
vi.mock("@/features/...", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/features/...")>()),
  useEntityById: () => ({
    data: { status: "SUCCESS", data: mockData.mockEntity },
    isLoading: false,
    isError: false,
  }),
}));

describe("<Name>ShowPage", () => {
  it("renders entity name", async () => {
    render(<NameShowPage />);
    await waitFor(() => {
      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });

  it("renders back button", () => {
    render(<NameShowPage />);
    expect(screen.getByTestId("action-btn-back")).toBeInTheDocument();
  });
});
```

#### Create / Update page test pattern

```tsx
describe("<Name>CreatePage", () => {
  it("renders the form component", () => {
    render(<NameCreatePage />);
    expect(screen.getByTestId("partner-form")).toBeInTheDocument();
  });

  it("form is in create mode", () => {
    render(<NameCreatePage />);
    expect(screen.getByTestId("partner-form")).toHaveAttribute(
      "data-mode",
      "create",
    );
  });
});

describe("<Name>UpdatePage", () => {
  it("renders the form component in edit mode", () => {
    render(<NameUpdatePage />);
    expect(screen.getByTestId("partner-form")).toHaveAttribute(
      "data-mode",
      "edit",
    );
  });
});
```

---

## Step 9 — Run and Fix

```bash
npm run test:unit:coverage
```

If any test fails:

1. Read the error message carefully
2. Check that MSW handlers return the expected shape
3. Verify mock paths match the actual import paths used in source files
4. For `waitFor` timeouts, ensure the global `queryClient` in `useHandleMutationResponse` can resolve (its `invalidateQueries` won't throw — it just won't affect the test QueryClient)

**Finding form inputs when `getByLabelText` fails:**

Some labels include an asterisk span (`<Label>Name <span className="text-red-500">*</span></Label>`). This breaks the label↔input association. Use `getByPlaceholderText` as fallback:

```tsx
// ❌ May fail if label has nested span
screen.getByLabelText(/name/i);

// ✅ More reliable
screen.getByPlaceholderText(/enter name/i);

// ✅ Or query by text node when placeholder is unknown
screen.getByRole("textbox", { name: /name/i });
```

**When `option-data.query` hooks block form submission:**

If a form uses `useMasterDataXxx()` from `@/shared/query/option-data.query` and the component marks `isSubmitting = mutation.isPending || queryHook.isLoading`, the Confirm button stays disabled during loading. Mock the hook to return `isLoading: false`:

```ts
vi.mock("@/shared/query/option-data.query", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/shared/query/option-data.query")>();
  return {
    ...actual,
    useMasterDataTaxRates: () => ({
      data: [{ value: "1", label: "Tax 11%" }],
      isLoading: false,
    }),
    useMasterDataPartnerCategories: () => ({ data: [], isLoading: false }),
    // add only the hooks the component actually uses
  };
});
```

**TanStack Query state management in tests:**

Follow these patterns from the [official guide](https://tanstack.com/query/latest/docs/framework/react/guides/testing):

```tsx
// ✅ CORRECT — queries start in pending state, wait for state change
const { result } = renderHook(() => useMyQuery());
expect(result.current.isPending).toBe(true); // synchronous

await waitFor(() => expect(result.current.isSuccess).toBe(true)); // async

// ✅ CORRECT — mutations start idle, call mutate(), wait for callback
const { result } = renderHook(() => useMyMutation());
result.current.mutate(data);

await waitFor(() => {
  expect(toast.success).toHaveBeenCalled(); // assert on side effect, not isSuccess
});

// ❌ WRONG — never assert on query/mutation state without waitFor
expect(result.current.isSuccess).toBe(true);

// ❌ WRONG — never wait on mutation.isSuccess (it resets immediately after callback)
await waitFor(() => expect(result.current.isSuccess).toBe(true));
```

**Handling `setFormErrorsFromApi` in `onError`:**

When a mutation's `onError` calls `setFormErrorsFromApi(form, error)`, it sets per-field error messages on the form. It does **NOT** call `toast.error`. To test error display:

```tsx
// Override MSW to return a 422 with field errors
server.use(
  http.post("http://localhost:3000/...", () =>
    HttpResponse.json(
      { status: "VALIDATION_ERROR", errors: { name: ["Name already exists"] } },
      { status: 422 },
    ),
  ),
);
// Then submit and check the field error is rendered
await waitFor(() =>
  expect(screen.getByText("Name already exists")).toBeInTheDocument(),
);
```

## Step 10 — Verify build

```bash
npm run build
```

Fix any TypeScript errors, then re-run tests to confirm all pass.

---

## Step 11 — Verify 100% Coverage

Run coverage scoped to the feature folder and confirm all metrics are at 100:

```bash
npx vitest run --coverage tests/unit/features/master-data/<feature>
```

Look for the feature rows in the coverage table output. All 4 metrics (Stmts, Branch, Funcs, Lines) must be `100`:

```
 ...ank/components |     100 |      100 |     100 |     100 |
  bank-columns.tsx |     100 |      100 |     100 |     100 |
  ...orm-modal.tsx |     100 |      100 |     100 |     100 |
 ...data/bank/data |     100 |      100 |     100 |     100 |
  bank.mutation.ts |     100 |      100 |     100 |     100 |
  bank.query.ts    |     100 |      100 |     100 |     100 |
  bank.service.ts  |     100 |      100 |     100 |     100 |
  bank.utils.ts    |     100 |      100 |     100 |     100 |
 ...ata/bank/pages |     100 |      100 |     100 |     100 |
  bank.page.tsx    |     100 |      100 |     100 |     100 |
```

After tests pass, run `ShowCoverage.ps1` for a readable per-file breakdown:

```powershell
# Detail per file for the specific module
.\ShowCoverage.ps1 -Module "<feature>"

# Example: .\ShowCoverage.ps1 -Module "bank"
# Example: .\ShowCoverage.ps1 -Module "partner"
# Example: .\ShowCoverage.ps1 -Module "currency"
```

```powershell
# Summary grouped by module (overview of all features)
.\ShowCoverage.ps1 -GroupByModule

# Filter by a specific module with grouped summary
.\ShowCoverage.ps1 -Module "<feature>" -GroupByModule
```

> Legend: >= 80% = green · >= 50% = yellow · < 50% = red  
> All 4 columns (Lines%, Stmts%, Funcs%, Branchs%) must show green (100%) for the feature to be complete.

**Common branch coverage gaps (V8):**

| Uncovered pattern              | Example                                | Fix                                         |
| ------------------------------ | -------------------------------------- | ------------------------------------------- |
| `\|\|` fallback operand        | `data \|\| []`                         | Add test where left side is falsy           |
| `&&` short-circuit             | `isActive && doThing()`                | Add test where condition is false           |
| `if` false branch              | `if (defaultValues?.id)`               | Add test where id is absent                 |
| Uncontrolled RHF input handler | `downloadTemplate` prop on ImportModal | Expose button in mock that calls the prop   |
| Mutation `onSuccess` callback  | `queryClient.invalidateQueries(...)`   | Trigger `mutation.mutate()` via mock button |

**⚠️ TanStack Query testing anti-patterns:**

| Anti-pattern                                          | Why it's wrong                                                                          | Correct approach                                                                 |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Wait on `mutation.isSuccess` to verify success        | `useHandleMutationResponse` calls `mutation.reset()` immediately after success callback | Wait for side effect: `expect(toast.success).toHaveBeenCalled()`                 |
| Assert on query state without `waitFor`               | Query state updates asynchronously, assertion fires before state changes                | Wrap in `waitFor()`: `await waitFor(() => expect(result.current.isSuccess))`     |
| Skip `enabled: false` tests                           | Tests don't verify disabled queries stay idle, risking accidental fetches in production | Test both `enabled: true` (default) and `enabled: false` paths                   |
| Test with default retries in QueryClient              | Tests timeout waiting for retries; errors take 3+ seconds to surface                    | Set `retry: false` in test QueryClient (already done in `render-with-providers`) |
| Override single MSW handler instead of `server.use()` | Handler doesn't reset after test, affects other tests                                   | Use `server.use()` override — automatically reverted after test                  |
| Assert `isPending` after mutation completes           | Mutation state is idle after `reset()`, assertion fails                                 | Assert during mutation: check before/after the `mutate()` call                   |

**⚠️ Input type matters for RHF validation:**

- **Controlled inputs** (via `Controller`): use `fireEvent.change(el, { target: { value } })`
- **Uncontrolled inputs** (via `register()`): use `userEvent.type(el, value)` — `fireEvent.change` does NOT update the DOM `value` property that RHF reads at submit time.

**⚠️ Zod v4 error messages differ from v3:**

- v3: `"String must contain at most 50 character(s)"`
- v4: `"Too big: expected string to have <=50 characters"` → use regex `/Too big.*50 characters/i`

---

## Step 12 — Run Lint on Feature Files

```bash
npx eslint src/features/master-data/<feature> tests/unit/features/master-data/<feature> --max-warnings 0
```

No output = no errors. Fix any issues before proceeding.

**Common lint errors in test files:**

- `'X' is defined but never used` — remove the unused import
- `no-unused-vars` after test refactoring — remove helpers/imports that are no longer needed

---


## Common Pitfalls & Solutions

| Problem                                                     | Cause                                                         | Solution                                                                                                                                                                      |
| ----------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TS2339: Property 'accessorKey' does not exist`             | `ColumnDef` is a union type                                   | Use `as unknown as TestColumnDef[]` cast                                                                                                                                      |
| Mutation test passes but `isSuccess` never true             | `mutation.reset()` is called after success                    | Wait for `toast.success` instead of `isSuccess`                                                                                                                               |
| `request.formData()` throws in MSW handler                  | `File` from jsdom fails webidl check                          | Use `vi.spyOn(FormData.prototype, "append")`                                                                                                                                  |
| Component renders null (permission check fails)             | `Visibility` uses `useAuth()`                                 | Mock `@/shared/hooks/use-auth`                                                                                                                                                |
| Modal content not found when `open=false`                   | Radix Dialog unmounts closed content                          | Use `queryByText` and assert `not.toBeInTheDocument()`                                                                                                                        |
| Blob test fails                                             | `useExportBanks` runs on mount                                | Pass `{ enabled: true }` explicitly or use `server.use()` override                                                                                                            |
| `user.type` on `document.getElementById()` fails TypeScript | `getElementById` returns `HTMLElement \| null`                | Use `document.getElementById("id") as HTMLElement` — do NOT use `!` (SonarQube flags `!` assertions)                                                                          |
| `userEvent.type()` timeout on long strings                  | Each character is a simulated keystroke                       | Use `userEvent.setup({ delay: null })` inside the test — removes per-keystroke delay, keeps semantics                                                                         |
| `Cannot find name 'global'` in test files                   | Browser tsconfig has no Node.js types                         | Use `globalThis.URL.createObjectURL` instead of `global.URL...`                                                                                                               |
| Unused import lint error after test refactoring             | Import added but never used after edit                        | Remove unused imports — check with `npx eslint --max-warnings 0`                                                                                                              |
| `key={index}` warning in map inside mock                    | Array index as React key is anti-pattern                      | Use `key={col.id ?? String(i)}` for stable keys                                                                                                                               |
| `TestColumnDef` missing `header` property                   | Header tests call `col.header` at runtime                     | Add `header?: React.ComponentType<never> \| ((ctx: never) => React.ReactNode)` to type                                                                                        |
| `getByLabelText` fails on required field                    | Label has `<span>*</span>` inside                             | Use `getByPlaceholderText()` or `getByRole("textbox")` instead                                                                                                                |
| Confirm button disabled / form won't submit                 | `useMasterDataXxx` returns `isLoading: true`                  | Mock `@/shared/query/option-data.query` to return `{ data: [], isLoading: false }`                                                                                            |
| Sibling form modal not intercepted by barrel mock           | Barrel mock doesn't override same-folder sibling              | Mock via direct relative path: `vi.mock("../sibling-form-modal", ...)`                                                                                                        |
| Tabs / sections not found in DOM                            | Wrapped in `{(mode as string) === "disabled-feature" && ...}` | Condition is always false — skip testing that UI entirely                                                                                                                     |
| Commented-out input not found in DOM                        | Field is inside `{/* ... */}` block                           | Use `defaultValues` to pre-populate the field instead of typing into it                                                                                                       |
| Sub-form modal `onSuccess` never called in API mode         | MSW handler not registered for sub-resource endpoint          | Mock mutation hooks directly: `vi.mock("@/features/...", async imp => ({ ...actual, useCreateXxx: ({ onSuccess }) => ({ mutate: () => onSuccess?.(), isPending: false }) }))` |
| `Select` component (Radix) not interactive in jsdom         | Radix Popper can't position floating content                  | Mock the custom `Select` component as a plain `<button>` that calls `onValueChange` when clicked                                                                              |
| Classification / Select label matches multiple elements     | shadcn Select renders label text outside `<label>`            | Use `getAllByText(/classification/i).length` or `getByText` not `getByLabelText`                                                                                              |

---

## Reference Files

### Partner feature (complex — multi-page, sub-panels, sub-form-modals)

| Test file                                                                                              | What it demonstrates                                      |
| ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| `tests/unit/features/master-data/partner/data/partner.handlers.ts`                                    | Handler file structure                                    |
| `tests/unit/features/master-data/partner/data/partner.utils.test.ts`                                  | Utils constants testing                                   |
| `tests/unit/features/master-data/partner/data/partner.schema.test.ts`                                 | Zod v4 schema testing                                     |
| `tests/unit/features/master-data/partner/data/partner.service.test.ts`                                | Service method testing                                    |
| `tests/unit/features/master-data/partner/data/partner.query.test.ts`                                  | Query hook testing                                        |
| `tests/unit/features/master-data/partner/data/partner.mutation.test.ts`                               | Mutation hook testing                                     |
| `tests/unit/features/master-data/partner/components/partner-columns.test.tsx`                         | Column testing pattern                                    |
| `tests/unit/features/master-data/partner/components/partner-form.test.tsx`                            | Form with disabled-feature guard + option-data.query mock |
| `tests/unit/features/master-data/partner/components/partner-branch-form-modal.test.tsx`               | Sub-form modal without own MSW handlers                   |
| `tests/unit/features/master-data/partner/components/partner-tax-form-modal.test.tsx`                  | Sub-form modal with Select mock + option-data.query mock  |
| `tests/unit/features/master-data/partner/components/partner-transaction-account-form-modal.test.tsx`  | Sub-form modal patterns                                   |
| `tests/unit/features/master-data/partner/components/partner-document-form-modal.test.tsx`             | File upload modal + commented-out fields                  |
| `tests/unit/features/master-data/partner/components/partner-branches.test.tsx`                        | Sub-panel with sibling mock via direct path               |
| `tests/unit/features/master-data/partner/components/partner-taxes.test.tsx`                           | Sub-panel with direct sibling mock                        |
| `tests/unit/features/master-data/partner/pages/partner-list.page.test.tsx`                            | List page test                                            |
| `tests/unit/features/master-data/partner/pages/partner-show.page.test.tsx`                            | Show page test with data mock                             |
| `tests/unit/features/master-data/partner/pages/partner-create.page.test.tsx`                          | Create page test                                          |
| `tests/unit/features/master-data/partner/pages/partner-update.page.test.tsx`                          | Update page test                                          |

### Bank feature (simple — one page, one component)

| Test file                                                                    | What it demonstrates |
| ---------------------------------------------------------------------------- | -------------------- |
| `tests/unit/features/master-data/bank/data/bank.handlers.ts`                | Minimal handler file |
| `tests/unit/features/master-data/bank/data/bank.utils.test.ts`              | Utils testing        |
| `tests/unit/features/master-data/bank/data/bank.schema.test.ts`             | Schema testing       |
| `tests/unit/features/master-data/bank/data/bank.service.test.ts`            | Service testing      |
| `tests/unit/features/master-data/bank/data/bank.query.test.ts`              | Query testing        |
| `tests/unit/features/master-data/bank/data/bank.mutation.test.ts`           | Mutation testing     |
| `tests/unit/features/master-data/bank/components/bank-columns.test.tsx`     | Columns testing      |
| `tests/unit/features/master-data/bank/components/bank-form-modal.test.tsx`  | Form modal testing   |

### Global infrastructure

- `tests/unit/mocks/handlers.ts` — global MSW handlers index (import only, no logic)
- `tests/unit/utils/render-with-providers.tsx` — render utilities

---

## Step 14 — Final Build Verification

```bash
npm run build
```

**Verification checklist:**

- ✅ Build completes successfully (no errors)
- ✅ No TypeScript compilation errors
- ✅ All test files are properly type-checked
- ✅ No unused imports or variables detected
- ✅ Output is created in `.output/build/` folder (if configured)

**If build fails:**

1. Check for any TypeScript errors: `npx tsc --noEmit`
2. Review the error messages carefully — they indicate which files/lines need fixing
3. Common issues:
   - Unused imports in test files → remove them
   - Type mismatches in mock data → verify mock matches actual types
   - Missing exports → ensure all test utilities are properly exported
4. Re-run tests locally to verify fixes: `npm run test:unit:coverage`
5. Re-run build after fixes: `npm run build`

**Build output example (successful):**

```
✓ built in 23.96s
├─ dist/index.html
├─ dist/assets/
│  ├─ main.*.js
│  ├─ main.*.css
│  └─ ...
└─ dist/vite.svg
```

Once build succeeds with zero errors, your test coverage implementation is **complete and production-ready**.

---

## Further Reading & Resources

**Official TanStack Query Testing Guide:**

- [TanStack Query v5 Testing Guide](https://tanstack.com/query/latest/docs/framework/react/guides/testing) — Authoritative patterns for testing queries and mutations

**Key Sections:**

- [Our First Test](https://tanstack.com/query/latest/docs/framework/react/guides/testing#our-first-test) — Basic useQuery testing with wrapper
- [Turn off retries](https://tanstack.com/query/latest/docs/framework/react/guides/testing#turn-off-retries) — Configure QueryClient for tests
- [Testing Network Calls](https://tanstack.com/query/latest/docs/framework/react/guides/testing#testing-network-calls) — MSW integration patterns
- [Further reading (TkDodo blog)](https://tkdodo.eu/blog/testing-react-query) — Deep dive on testing patterns

**Related Skills & Tools:**

- Vitest skill — for `describe`, `it`, `vi.mock()`, coverage utilities
- @testing-library/react — for `render`, `screen`, `waitFor`, `userEvent`
- MSW v2 — for mocking network requests with `http.*` handlers
- React Hook Form — for form testing with `userEvent.type()`
- Zod v4 — for schema validation testing
