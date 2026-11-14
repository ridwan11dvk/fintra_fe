import {
  useActivateCashflowCategoryMutation,
  useCreateCashflowCategoryMutation,
  useDeactivateCashflowCategoryMutation,
  useUpdateCashflowCategoryMutation,
} from "@/features/master-data/cashflow-category/data/cashflow-category.mutation";
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
const LIST_URL = `${BASE}/master-data/cashflow-categories`;

const payload = {
  name: "Operating Expense",
  description: "OPEX category",
};

describe("useCreateCashflowCategoryMutation", () => {
  it("[FSSC-CFC-014] toasts after a successful create", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useCreateCashflowCategoryMutation());

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
    const { result } = renderHook(() => useCreateCashflowCategoryMutation());

    result.current.mutate(payload);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useUpdateCashflowCategoryMutation", () => {
  it("toasts after a successful update", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdateCashflowCategoryMutation());

    result.current.mutate({ id: 1, data: payload });

    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });
});

describe("useActivateCashflowCategoryMutation", () => {
  it("toasts after activating a category", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useActivateCashflowCategoryMutation());

    result.current.mutate(2);

    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });
});

describe("useDeactivateCashflowCategoryMutation", () => {
  it("toasts after deactivating a category", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() =>
      useDeactivateCashflowCategoryMutation(),
    );

    result.current.mutate(1);

    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });

  it("toasts when deactivate fails", async () => {
    server.use(
      http.patch(`${LIST_URL}/:id/deactivate`, () =>
        HttpResponse.json({ message: "Forbidden" }, { status: 403 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() =>
      useDeactivateCashflowCategoryMutation(),
    );

    result.current.mutate(1);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
