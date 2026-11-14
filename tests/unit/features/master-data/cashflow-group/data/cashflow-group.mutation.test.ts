import {
  useActivateCashflowGroupMutation,
  useCreateCashflowGroupMutation,
  useDeactivateCashflowGroupMutation,
  useDeleteCashflowGroupMutation,
  useUpdateCashflowGroupMutation,
} from "@/features/master-data/cashflow-group/data/cashflow-group.mutation";
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
  const { buildUiResponseMock } = await import(
    "@tests/unit/mocks/ui-response-mock"
  );
  return buildUiResponseMock(actual);
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);

const BASE = "http://localhost:3000";
const LIST_URL = `${BASE}/master-data/cashflow-groups`;
const PAYABLE_DELETE_URL = `${BASE}/api/master-data/cashflow-groups`;

const payload = {
  code: "OPR-02",
  name: "Operating Receipt Two",
  cashflowGroupId: "1",
  cashflowType: "RECIPIENT_TARGET" as const,
  exception: false,
  description: "Operating group",
};

describe("useCreateCashflowGroupMutation", () => {
  it("[FSSC-CFG-014] toasts after a successful create", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useCreateCashflowGroupMutation());

    result.current.mutate(payload);

    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });

  it("toasts when create fails", async () => {
    server.use(
      http.post(LIST_URL, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useCreateCashflowGroupMutation());

    result.current.mutate(payload);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useUpdateCashflowGroupMutation", () => {
  it("toasts after a successful update", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdateCashflowGroupMutation());

    result.current.mutate({ id: 1, data: payload });

    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });
});

describe("useActivateCashflowGroupMutation", () => {
  it("toasts after activating a group", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useActivateCashflowGroupMutation());

    result.current.mutate(2);

    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });
});

describe("useDeactivateCashflowGroupMutation", () => {
  it("toasts after deactivating a group", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useDeactivateCashflowGroupMutation());

    result.current.mutate(1);

    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });
});

describe("useDeleteCashflowGroupMutation", () => {
  it("[FSSC-CFG-030] toasts after deleting a group", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useDeleteCashflowGroupMutation());

    result.current.mutate(1);

    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });

  it("toasts when delete fails", async () => {
    server.use(
      http.delete(`${PAYABLE_DELETE_URL}/:id`, () =>
        HttpResponse.json({ message: "Cannot delete" }, { status: 400 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useDeleteCashflowGroupMutation());

    result.current.mutate(1);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
