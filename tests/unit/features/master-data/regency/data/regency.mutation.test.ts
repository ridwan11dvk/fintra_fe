import {
  useCreateRegencyMutation,
  useDeleteRegencyMutation,
  useUpdateRegencyMutation,
} from "@/features/master-data/regency/data/regency.mutation";
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
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);

const BASE = "http://localhost:3000";

describe("useCreateRegencyMutation", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("calls onSuccess after successful create", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useCreateRegencyMutation({ onSuccess }),
    );

    result.current.mutate({
      code: "REG001",
      name: "Bandung",
      provinceId: 1,
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });

    expect(toastSuccess).toHaveBeenCalled();
  });

  it("calls onError when server returns 500", async () => {
    server.use(
      http.post(`${BASE}/master/regency`, () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );

    const onError = vi.fn();
    const { result } = renderHook(() => useCreateRegencyMutation({ onError }));

    result.current.mutate({
      code: "REG001",
      name: "Bandung",
      provinceId: 1,
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });

    expect(toastError).toHaveBeenCalled();
  });
});

describe("useUpdateRegencyMutation", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("calls onSuccess after successful update", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useUpdateRegencyMutation({ onSuccess }),
    );

    result.current.mutate({
      id: 1,
      data: {
        code: "REG001",
        name: "Updated Regency",
        provinceId: 1,
      },
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });

    expect(toastSuccess).toHaveBeenCalled();
  });

  it("calls onError when server returns 422", async () => {
    server.use(
      http.put(`${BASE}/master/regency/:id`, () =>
        HttpResponse.json({ message: "Validation Error" }, { status: 422 }),
      ),
    );

    const onError = vi.fn();
    const { result } = renderHook(() => useUpdateRegencyMutation({ onError }));

    result.current.mutate({
      id: 1,
      data: {
        code: "",
        name: "",
        provinceId: 0,
      },
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });

    expect(toastError).toHaveBeenCalled();
  });
});

describe("useDeleteRegencyMutation", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("calls onSuccess after successful delete", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useDeleteRegencyMutation({ onSuccess }),
    );

    result.current.mutate(1);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });

    expect(toastSuccess).toHaveBeenCalled();
  });

  it("calls onError when server returns 404", async () => {
    server.use(
      http.delete(`${BASE}/master/regency/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const onError = vi.fn();
    const { result } = renderHook(() => useDeleteRegencyMutation({ onError }));

    result.current.mutate(999);

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });

    expect(toastError).toHaveBeenCalled();
  });
});
