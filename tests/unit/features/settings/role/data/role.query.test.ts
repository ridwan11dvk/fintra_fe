import {
  roleQueryKeys,
  usePermissions,
  useRole,
  useRoleByName,
  useRolePermissions,
  useRoles,
} from "@/features/settings/role/data/role.query";
import { server } from "@tests/unit/mocks/server";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

vi.mock("@railfinance/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@railfinance/core")>();
  const { buildUiResponseMock } =
    await import("@tests/unit/mocks/ui-response-mock");
  return buildUiResponseMock(actual);
});

const BASE = "http://localhost:3000";

describe("roleQueryKeys", () => {
  it("all returns base key array", () => {
    expect(roleQueryKeys.all).toEqual(["roles"]);
  });

  it("allPermissions returns permissions key", () => {
    expect(roleQueryKeys.allPermissions).toEqual(["permissions"]);
  });

  it("lists() returns list key", () => {
    expect(roleQueryKeys.lists()).toEqual(["roles", "list"]);
  });

  it("list(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(roleQueryKeys.list(params)).toEqual(["roles", "list", params]);
  });

  it("details() returns detail key", () => {
    expect(roleQueryKeys.details()).toEqual(["roles", "detail"]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(roleQueryKeys.detail(5)).toEqual(["roles", "detail", 5]);
  });

  it("detailByName(name) returns detail key with name", () => {
    expect(roleQueryKeys.detailByName("Admin")).toEqual([
      "roles",
      "detail",
      "name",
      "Admin",
    ]);
  });

  it("permissions(id) returns permissions key with id", () => {
    expect(roleQueryKeys.permissions(3)).toEqual(["roles", "permissions", 3]);
  });
});

describe("useRoles", () => {
  it("fetches and returns paged role data", async () => {
    const { result } = renderHook(() => useRoles({ page: 1, size: 10 }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].name).toBe("Admin");
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/role`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useRoles({ page: 1, size: 10 }));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("usePermissions", () => {
  it("fetches and returns paged permission data when enabled", async () => {
    const { result } = renderHook(() =>
      usePermissions({ page: 1, size: 10 }, true),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      usePermissions({ page: 1, size: 10 }, false),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/permission`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() =>
      usePermissions({ page: 1, size: 10 }, true),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useRole", () => {
  it("fetches and returns role detail by ID", async () => {
    const { result } = renderHook(() => useRole(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.name).toBe("Admin");
  });

  it("does not fetch when id is 0 (falsy)", async () => {
    const { result } = renderHook(() => useRole(0));

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 404", async () => {
    server.use(
      http.get(`${BASE}/master/role/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useRole(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useRoleByName", () => {
  it("fetches and returns role detail by name", async () => {
    const { result } = renderHook(() => useRoleByName("Admin"));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.data?.name).toBe("Admin");
  });

  it("does not fetch when name is empty string", async () => {
    const { result } = renderHook(() => useRoleByName(""));

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/role/name/:name`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useRoleByName("NonExistent"));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useRolePermissions", () => {
  it("fetches and returns permissions for a role", async () => {
    const { result } = renderHook(() => useRolePermissions(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data).toBeInstanceOf(Array);
    expect(result.current.data?.data).toHaveLength(1);
  });

  it("does not fetch when id is 0 (falsy)", async () => {
    const { result } = renderHook(() => useRolePermissions(0));

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});
