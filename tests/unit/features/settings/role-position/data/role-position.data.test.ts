import {
  useAssignPositionsToRole,
  useCreatePositionRole,
  useDeleteAllPositionsFromRole,
  useDeleteAllRolesFromPosition,
  useDeleteRolePosition,
  useUpdatePositionRole,
  useUpdatePositionsForRole,
} from "@/features/settings/role-position/data/role-position.mutation";
import {
  rolePositionQueryKeys,
  useRoleGroupedPositions,
  useRolePosition,
  useRolePositionByPositionId,
  useRolePositionDetailByRole,
  useRolePositions,
} from "@/features/settings/role-position/data/role-position.query";
import { rolePositionService } from "@/features/settings/role-position/data/role-position.service";
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
const URL = `${BASE}/master/position-role`;

describe("rolePositionQueryKeys", () => {
  it("returns expected key structure", () => {
    expect(rolePositionQueryKeys.all).toEqual(["positionRoles"]);
    expect(rolePositionQueryKeys.lists()).toEqual(["positionRoles", "list"]);
    const params = { page: 1, size: 10 };
    expect(rolePositionQueryKeys.list(params)).toEqual([
      "positionRoles",
      "list",
      params,
    ]);
    expect(rolePositionQueryKeys.details()).toEqual([
      "positionRoles",
      "detail",
    ]);
    expect(rolePositionQueryKeys.detail(5)).toEqual([
      "positionRoles",
      "detail",
      5,
    ]);
    expect(rolePositionQueryKeys.detailByPosition(3)).toEqual([
      "positionRoles",
      "detail",
      "position",
      3,
    ]);
    expect(rolePositionQueryKeys.detailByRole(4)).toEqual([
      "positionRoles",
      "detail",
      "role",
      4,
    ]);
    expect(rolePositionQueryKeys.roleGroupedList(params)).toEqual([
      "positionRoles",
      "roleGroupedList",
      params,
    ]);
  });
});

describe("rolePositionService", () => {
  it("getRolePositions fetches paged data", async () => {
    const data = await rolePositionService.getRolePositions({
      page: 1,
      size: 10,
    });
    expect(data.status).toBe("SUCCESS");
    expect(data.data?.content[0].jobPositionName).toBe("Manager");
  });

  it("getRolePositionById fetches detail", async () => {
    const data = await rolePositionService.getRolePositionById(1);
    expect(data.data?.jobPosition.code).toBe("JP-001");
  });

  it("getRolePositionByPositionId fetches by position", async () => {
    const data = await rolePositionService.getRolePositionByPositionId(1);
    expect(data.status).toBe("SUCCESS");
  });

  it("createPositionRole posts payload", async () => {
    const data = await rolePositionService.createPositionRole({
      jobPositionId: 1,
      roleIds: [1],
    });
    expect(data.status).toBe("SUCCESS");
  });

  it("updatePositionRole puts payload", async () => {
    const data = await rolePositionService.updatePositionRole(1, {
      jobPositionId: 1,
      roleIds: [2],
    });
    expect(data.status).toBe("SUCCESS");
  });

  it("deleteRolePosition sends DELETE", async () => {
    const data = await rolePositionService.deleteRolePosition(1);
    expect(data.status).toBe("SUCCESS");
  });

  it("deleteAllRolesFromPosition sends DELETE", async () => {
    const data = await rolePositionService.deleteAllRolesFromPosition(1);
    expect(data.status).toBe("SUCCESS");
  });

  it("getRolePositionsGroupedByRole fetches grouped data", async () => {
    const data = await rolePositionService.getRolePositionsGroupedByRole({
      page: 1,
      size: 10,
    });
    expect(data.data?.content[0].roleName).toBe("Admin");
  });

  it("getPositionRoleDetailByRole fetches detail by role", async () => {
    const data = await rolePositionService.getPositionRoleDetailByRole(1);
    expect(data.data?.role.name).toBe("Admin");
  });

  it("assignPositionsToRole posts payload", async () => {
    const data = await rolePositionService.assignPositionsToRole({
      roleId: 1,
      jobPositionIds: [1],
    });
    expect(data.status).toBe("SUCCESS");
  });

  it("updatePositionsForRole puts payload", async () => {
    const data = await rolePositionService.updatePositionsForRole(1, {
      roleId: 1,
      jobPositionIds: [2],
    });
    expect(data.status).toBe("SUCCESS");
  });

  it("deleteAllPositionsFromRole sends DELETE", async () => {
    const data = await rolePositionService.deleteAllPositionsFromRole(1);
    expect(data.status).toBe("SUCCESS");
  });
});

describe("query hooks", () => {
  it("useRolePositions fetches list", async () => {
    const { result } = renderHook(() =>
      useRolePositions({ page: 1, size: 10 }),
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.content).toHaveLength(1);
  });

  it("useRolePosition fetches detail by id", async () => {
    const { result } = renderHook(() => useRolePosition(1));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.jobPosition.id).toBe(1);
  });

  it("useRolePosition is disabled when id is 0", () => {
    const { result } = renderHook(() => useRolePosition(0));
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("useRolePositionByPositionId fetches by position", async () => {
    const { result } = renderHook(() => useRolePositionByPositionId(1));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("useRoleGroupedPositions fetches grouped list", async () => {
    const { result } = renderHook(() =>
      useRoleGroupedPositions({ page: 1, size: 10 }),
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.content[0].roleName).toBe("Admin");
  });

  it("useRolePositionDetailByRole fetches detail by role", async () => {
    const { result } = renderHook(() => useRolePositionDetailByRole(1));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.role.id).toBe(1);
  });
});

describe("mutation hooks", () => {
  it("useCreatePositionRole shows success toast", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useCreatePositionRole());
    result.current.mutate({ jobPositionId: 1, roleIds: [1] });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalled();
  });

  it("useUpdatePositionRole shows success toast", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdatePositionRole());
    result.current.mutate({
      jobPositionId: 1,
      data: { jobPositionId: 1, roleIds: [1] },
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalled();
  });

  it("useDeleteRolePosition shows success toast", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useDeleteRolePosition());
    result.current.mutate(1);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalled();
  });

  it("useDeleteAllRolesFromPosition shows success toast", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useDeleteAllRolesFromPosition());
    result.current.mutate(1);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalled();
  });

  it("useAssignPositionsToRole shows success toast", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useAssignPositionsToRole());
    result.current.mutate({ roleId: 1, jobPositionIds: [1] });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalled();
  });

  it("useUpdatePositionsForRole shows success toast", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdatePositionsForRole());
    result.current.mutate({
      roleId: 1,
      data: { roleId: 1, jobPositionIds: [1] },
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalled();
  });

  it("useDeleteAllPositionsFromRole shows success toast", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useDeleteAllPositionsFromRole());
    result.current.mutate(1);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalled();
  });

  it("shows error toast when request fails", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.post(URL, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useCreatePositionRole());
    result.current.mutate({ jobPositionId: 1, roleIds: [1] });
    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
