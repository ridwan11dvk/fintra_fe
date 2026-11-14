import {
  useActivateWorkCatalogMutation,
  useCreateWorkCatalogMutation,
  useDeactivateWorkCatalogMutation,
  useDeleteWorkCatalogMutation,
  useUpdateWorkCatalogMutation,
} from "@/features/master-data/work-catalog/data/work-catalog.mutation";
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
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);

const BASE = "http://localhost:3000";

const payload = {
  workType: "Pengangkutan",
  subCategoryId: 1,
  groupCategoryId: 1,
  mainCategoryId: 1,
  cashflowCategoryId: 1,
  procurementSchemaId: 1,
  description: "Jasa angkut barang",
  taxes: [{ taxSubject: "BADAN_USAHA" as const, taxRateId: 1 }],
};

describe("useCreateWorkCatalogMutation", () => {
  it("toasts after a successful create", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useCreateWorkCatalogMutation());

    result.current.mutate(payload);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Data fetched successfully"),
    );
  });

  it("toasts when create fails", async () => {
    server.use(
      http.post(`${BASE}/master/work-catalog`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useCreateWorkCatalogMutation());

    result.current.mutate(payload);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useUpdateWorkCatalogMutation", () => {
  it("toasts after a successful update", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdateWorkCatalogMutation());

    result.current.mutate({ id: 1, data: payload });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Data fetched successfully"),
    );
  });

  it("toasts when update fails", async () => {
    server.use(
      http.put(`${BASE}/master/work-catalog/:id`, () =>
        HttpResponse.json({ message: "Validation Error" }, { status: 422 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdateWorkCatalogMutation());

    result.current.mutate({ id: 1, data: payload });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useDeleteWorkCatalogMutation", () => {
  it("toasts after a successful delete", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useDeleteWorkCatalogMutation());

    result.current.mutate(1);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Data deleted successfully"),
    );
  });

  it("toasts when delete fails", async () => {
    server.use(
      http.delete(`${BASE}/master/work-catalog/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useDeleteWorkCatalogMutation());

    result.current.mutate(999);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useActivateWorkCatalogMutation", () => {
  it("toasts after a successful activate", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useActivateWorkCatalogMutation());

    result.current.mutate(1);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Work catalog activated"),
    );
  });

  it("toasts when activate fails", async () => {
    server.use(
      http.patch(`${BASE}/master/work-catalog/:id/activate`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useActivateWorkCatalogMutation());

    result.current.mutate(1);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useDeactivateWorkCatalogMutation", () => {
  it("toasts after a successful deactivate", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useDeactivateWorkCatalogMutation());

    result.current.mutate(1);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Work catalog deactivated"),
    );
  });

  it("toasts when deactivate fails", async () => {
    server.use(
      http.patch(`${BASE}/master/work-catalog/:id/deactivate`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useDeactivateWorkCatalogMutation());

    result.current.mutate(1);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
