import {
  useCreateTaxRateMutation,
  useDeleteTaxRateMutation,
  useUpdateTaxRateMutation,
} from "@/features/master-data/tax-rate/data/tax-rate.mutation";
import { server } from "@tests/unit/mocks/server";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

const toastSuccess = vi.fn();
const toastError = vi.fn();

vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: (...args: unknown[]) => toastError(...args),
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
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/visibility", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dropdown-menu", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/pagination", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/popover", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/radio-group", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/table", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/tabs", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

const BASE = "http://localhost:3000";

describe("useCreateTaxRateMutation", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("calls onSuccess after successful create", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useCreateTaxRateMutation({ onSuccess }),
    );

    result.current.mutate({
      code: "PPN_17",
      name: "PPN 17%",
      taxType: "PPN",
      ratePercent: 17,
      coefficientNumerator: 17,
      coefficientDenominator: 100,
      startDate: "2024-01-01",
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });

    expect(toastSuccess).toHaveBeenCalled();
  });

  it("calls onError when server returns 500", async () => {
    server.use(
      http.post(`${BASE}/master/tax-rates`, () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );

    const onError = vi.fn();
    const { result } = renderHook(() => useCreateTaxRateMutation({ onError }));

    result.current.mutate({
      code: "PPN_17",
      name: "PPN 17%",
      taxType: "PPN",
      ratePercent: 17,
      coefficientNumerator: 17,
      coefficientDenominator: 100,
      startDate: "2024-01-01",
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });

    expect(toastError).toHaveBeenCalled();
  });
});

describe("useUpdateTaxRateMutation", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("calls onSuccess after successful update", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useUpdateTaxRateMutation({ onSuccess }),
    );

    result.current.mutate({
      id: 1,
      data: {
        code: "PPN_17",
        name: "Updated Tax Rate",
        taxType: "PPN",
        ratePercent: 17,
        coefficientNumerator: 17,
        coefficientDenominator: 100,
        startDate: "2024-01-01",
      },
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });

    expect(toastSuccess).toHaveBeenCalled();
  });

  it("calls onError when server returns 422", async () => {
    server.use(
      http.put(`${BASE}/master/tax-rates/:id`, () =>
        HttpResponse.json({ message: "Validation Error" }, { status: 422 }),
      ),
    );

    const onError = vi.fn();
    const { result } = renderHook(() => useUpdateTaxRateMutation({ onError }));

    result.current.mutate({
      id: 1,
      data: {
        code: "",
        name: "",
        taxType: "",
        ratePercent: -1,
        coefficientNumerator: 0,
        coefficientDenominator: 0,
        startDate: "",
      },
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });

    expect(toastError).toHaveBeenCalled();
  });
});

describe("useDeleteTaxRateMutation", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("calls onSuccess after successful delete", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useDeleteTaxRateMutation({ onSuccess }),
    );

    result.current.mutate(1);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });

    expect(toastSuccess).toHaveBeenCalled();
  });

  it("calls onError when server returns 404", async () => {
    server.use(
      http.delete(`${BASE}/master/tax-rates/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const onError = vi.fn();
    const { result } = renderHook(() => useDeleteTaxRateMutation({ onError }));

    result.current.mutate(999);

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });

    expect(toastError).toHaveBeenCalled();
  });
});
