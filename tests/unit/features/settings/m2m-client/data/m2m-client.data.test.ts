import {
  useCreateM2mClient,
  useDeleteM2mClient,
  useRegenerateM2mToken,
  useUpdateM2mClient,
  useUpdateM2mPermissions,
} from "@/features/settings/m2m-client/data/m2m-client.mutation";
import {
  m2mClientQueryKeys,
  useM2mClient,
  useM2mClientAudit,
  useM2mClients,
} from "@/features/settings/m2m-client/data/m2m-client.query";
import { m2mClientService } from "@/features/settings/m2m-client/data/m2m-client.service";
import { server } from "@tests/unit/mocks/server";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
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
const URL = `${BASE}/m2m-clients`;

describe("m2mClientQueryKeys", () => {
  it("returns expected key structure", () => {
    expect(m2mClientQueryKeys.all).toEqual(["m2m-clients"]);
    expect(m2mClientQueryKeys.lists()).toEqual(["m2m-clients", "list"]);
    const params = { page: 1, size: 10 };
    expect(m2mClientQueryKeys.list(params)).toEqual([
      "m2m-clients",
      "list",
      params,
    ]);
    expect(m2mClientQueryKeys.details()).toEqual(["m2m-clients", "detail"]);
    expect(m2mClientQueryKeys.detail(5)).toEqual(["m2m-clients", "detail", 5]);
    expect(m2mClientQueryKeys.audit(3)).toEqual(["m2m-clients", "audit", 3]);
    expect(m2mClientQueryKeys.allPermissions).toEqual([
      "m2m-clients",
      "all-permissions",
    ]);
  });
});

describe("m2mClientService", () => {
  it("getClients fetches paged data", async () => {
    const data = await m2mClientService.getClients({ page: 1, size: 10 });
    expect(data.status).toBe("SUCCESS");
    expect(data.data?.content[0].name).toBe("Test Client");
  });

  it("getClientById fetches a single client", async () => {
    const data = await m2mClientService.getClientById(1);
    expect(data.data?.id).toBe(1);
  });

  it("createClient posts payload", async () => {
    const data = await m2mClientService.createClient({ name: "New" });
    expect(data.status).toBe("SUCCESS");
    expect(data.data?.token).toBe("tok");
  });

  it("updateClient puts payload", async () => {
    const data = await m2mClientService.updateClient(1, { name: "Upd" });
    expect(data.status).toBe("SUCCESS");
  });

  it("deleteClient sends DELETE", async () => {
    const data = await m2mClientService.deleteClient(1);
    expect(data.status).toBe("SUCCESS");
  });

  it("regenerateToken posts to regenerate endpoint", async () => {
    const data = await m2mClientService.regenerateToken(1);
    expect(data.data?.token).toBe("tok");
  });

  it("updatePermissions puts permissions", async () => {
    const data = await m2mClientService.updatePermissions(1, {
      permissionIds: [1, 2],
    });
    expect(data.status).toBe("SUCCESS");
  });

  it("getAuditLog fetches audit entries", async () => {
    const data = await m2mClientService.getAuditLog(1, { page: 0, size: 20 });
    expect(data.data?.content).toHaveLength(1);
  });
});

describe("useM2mClients", () => {
  it("fetches paged clients", async () => {
    const { result } = renderHook(() => useM2mClients({ page: 1, size: 10 }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.content).toHaveLength(1);
  });

  it("does not fetch when enabled is false", () => {
    const { result } = renderHook(() =>
      useM2mClients({ page: 1, size: 10, enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});

describe("useM2mClient", () => {
  it("fetches a single client", async () => {
    const { result } = renderHook(() => useM2mClient(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.id).toBe(1);
  });

  it("is disabled when id is 0", () => {
    const { result } = renderHook(() => useM2mClient(0));
    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useM2mClientAudit", () => {
  it("fetches audit log entries", async () => {
    const { result } = renderHook(() => useM2mClientAudit(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.content).toHaveLength(1);
  });
});

describe("mutations", () => {
  it("useCreateM2mClient shows success toast", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useCreateM2mClient());

    result.current.mutate({ name: "New" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith(
      "API Client created successfully",
    );
  });

  it("useUpdateM2mClient shows success toast", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdateM2mClient());

    result.current.mutate({ id: 1, client: { name: "Upd" } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith(
      "API Client updated successfully",
    );
  });

  it("useDeleteM2mClient shows success toast", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useDeleteM2mClient());

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith(
      "API Client deactivated successfully",
    );
  });

  it("useRegenerateM2mToken shows success toast", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useRegenerateM2mToken());

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith(
      "Token regenerated successfully",
    );
  });

  it("useUpdateM2mPermissions shows success toast", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdateM2mPermissions());

    result.current.mutate({ id: 1, permissions: { permissionIds: [1] } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith(
      "Permissions updated successfully",
    );
  });

  it("shows error toast when request fails", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.post(URL, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useCreateM2mClient());
    result.current.mutate({ name: "New" });

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
