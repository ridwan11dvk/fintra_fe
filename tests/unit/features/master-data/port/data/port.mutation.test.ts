import {
  useCreatePortMutation,
  useDeletePortMutation,
  useUpdatePortMutation,
} from "@/features/master-data/port/data/port.mutation";
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

describe("useCreatePortMutation", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("calls toast.success after successful create", async () => {
    const { result } = renderHook(() => useCreatePortMutation());

    result.current.mutate({
      customsOfficeId: 1,
      code: "PORT-CGK-001",
      name: "Pelabuhan Soekarno-Hatta Jakarta",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(toastSuccess).toHaveBeenCalled();
  });

  it("calls toast.error when server returns 500", async () => {
    server.use(
      http.post(`${BASE}/master/port`, () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useCreatePortMutation());

    result.current.mutate({
      customsOfficeId: 1,
      code: "PORT-CGK-001",
      name: "Pelabuhan Soekarno-Hatta Jakarta",
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toastError).toHaveBeenCalled();
  });
});

describe("useUpdatePortMutation", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("calls toast.success after successful update", async () => {
    const { result } = renderHook(() => useUpdatePortMutation());

    result.current.mutate({
      id: 1,
      data: {
        customsOfficeId: 1,
        code: "PORT-CGK-002",
        name: "Updated Port",
      },
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(toastSuccess).toHaveBeenCalled();
  });

  it("calls toast.error when server returns 422", async () => {
    server.use(
      http.put(`${BASE}/master/port/:id`, () =>
        HttpResponse.json({ message: "Validation Error" }, { status: 422 }),
      ),
    );

    const { result } = renderHook(() => useUpdatePortMutation());

    result.current.mutate({
      id: 1,
      data: {
        customsOfficeId: 1,
        code: "",
        name: "",
      },
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toastError).toHaveBeenCalled();
  });
});

describe("useDeletePortMutation", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("calls toast.success after successful delete", async () => {
    const { result } = renderHook(() => useDeletePortMutation());

    result.current.mutate(1);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(toastSuccess).toHaveBeenCalled();
  });

  it("calls toast.error when server returns 404", async () => {
    server.use(
      http.delete(`${BASE}/master/port/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useDeletePortMutation());

    result.current.mutate(999);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toastError).toHaveBeenCalled();
  });
});
