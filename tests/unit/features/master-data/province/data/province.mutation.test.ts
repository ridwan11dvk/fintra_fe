import {
  useCreateProvinceMutation,
  useDeleteProvinceMutation,
  useUpdateProvinceMutation,
} from "@/features/master-data/province/data/province.mutation";
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

describe("useCreateProvinceMutation", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("calls onSuccess after successful create", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useCreateProvinceMutation({ onSuccess }),
    );

    result.current.mutate({
      code: "PROV001",
      name: "West Java",
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });

    expect(toastSuccess).toHaveBeenCalled();
  });

  it("calls onError when server returns 500", async () => {
    server.use(
      http.post(`${BASE}/master/province`, () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );

    const onError = vi.fn();
    const { result } = renderHook(() => useCreateProvinceMutation({ onError }));

    result.current.mutate({
      code: "PROV001",
      name: "West Java",
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });

    expect(toastError).toHaveBeenCalled();
  });
});

describe("useUpdateProvinceMutation", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("calls onSuccess after successful update", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useUpdateProvinceMutation({ onSuccess }),
    );

    result.current.mutate({
      id: 1,
      data: {
        code: "PROV001",
        name: "Updated Province",
      },
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });

    expect(toastSuccess).toHaveBeenCalled();
  });

  it("calls onError when server returns 422", async () => {
    server.use(
      http.put(`${BASE}/master/province/:id`, () =>
        HttpResponse.json({ message: "Validation Error" }, { status: 422 }),
      ),
    );

    const onError = vi.fn();
    const { result } = renderHook(() => useUpdateProvinceMutation({ onError }));

    result.current.mutate({
      id: 1,
      data: {
        code: "",
        name: "",
      },
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });

    expect(toastError).toHaveBeenCalled();
  });
});

describe("useDeleteProvinceMutation", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("calls onSuccess after successful delete", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useDeleteProvinceMutation({ onSuccess }),
    );

    result.current.mutate(1);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });

    expect(toastSuccess).toHaveBeenCalled();
  });

  it("calls onError when server returns 404", async () => {
    server.use(
      http.delete(`${BASE}/master/province/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const onError = vi.fn();
    const { result } = renderHook(() => useDeleteProvinceMutation({ onError }));

    result.current.mutate(999);

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });

    expect(toastError).toHaveBeenCalled();
  });
});
