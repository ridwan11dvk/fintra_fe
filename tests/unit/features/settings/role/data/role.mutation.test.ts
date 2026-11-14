import {
  useAssignPermissions,
  useCreateRole,
  useDeleteRole,
  useRemovePermissions,
  useUpdateRole,
} from "@/features/settings/role/data/role.mutation";
import { server } from "@tests/unit/mocks/server";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    const { buildUiResponseMock } =
      await import("@tests/unit/mocks/ui-response-mock");
    return buildUiResponseMock(actual);
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);

const BASE = "http://localhost:3000";

describe("useCreateRole", () => {
  it("calls toast.success after successful create", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useCreateRole());

    result.current.mutate({
      name: "New Role",
      moduleId: 1,
      description: "Test",
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.post(`${BASE}/master/role`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useCreateRole());

    result.current.mutate({ name: "New Role", moduleId: 1 });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useUpdateRole", () => {
  it("calls toast.success after successful update", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useUpdateRole());

    result.current.mutate({
      id: 1,
      role: { name: "Updated Role", moduleId: 1 },
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 422", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.put(`${BASE}/master/role/:id`, () =>
        HttpResponse.json({ message: "Validation Error" }, { status: 422 }),
      ),
    );

    const { result } = renderHook(() => useUpdateRole());

    result.current.mutate({ id: 1, role: { name: "", moduleId: 1 } });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useDeleteRole", () => {
  it("calls toast.success after successful delete", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useDeleteRole());

    result.current.mutate(1);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 404", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.delete(`${BASE}/master/role/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useDeleteRole());

    result.current.mutate(999);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useAssignPermissions", () => {
  it("calls toast.success after successful assign", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useAssignPermissions());

    result.current.mutate({
      id: 1,
      permissions: { permissionIds: [1, 2, 3] },
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.post(`${BASE}/master/role/:id/permissions`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useAssignPermissions());

    result.current.mutate({
      id: 1,
      permissions: { permissionIds: [1] },
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useRemovePermissions", () => {
  it("calls toast.success after successful remove", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useRemovePermissions());

    result.current.mutate({
      id: 1,
      permissions: { permissionIds: [1] },
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.delete(`${BASE}/master/role/:id/permissions`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useRemovePermissions());

    result.current.mutate({
      id: 1,
      permissions: { permissionIds: [1] },
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
