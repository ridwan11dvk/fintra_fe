import {
  useCreatePartnerClassificationMutation,
  useDeletePartnerClassificationMutation,
  useUpdatePartnerClassificationMutation,
} from "@/features/master-data/partner-classification/data/partner-classification.mutation";
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

describe("useCreatePartnerClassificationMutation", () => {
  it("calls toast.success after successful create", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() =>
      useCreatePartnerClassificationMutation(),
    );

    result.current.mutate({
      name: "New Classification",
      isActive: true,
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.post(`${BASE}/master/partner/classification`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() =>
      useCreatePartnerClassificationMutation(),
    );

    result.current.mutate({
      name: "New Classification",
      isActive: true,
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useUpdatePartnerClassificationMutation", () => {
  it("calls toast.success after successful update", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() =>
      useUpdatePartnerClassificationMutation(),
    );

    result.current.mutate({
      id: 1,
      data: {
        name: "Updated Classification",
        isActive: true,
      },
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 422", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.put(`${BASE}/master/partner/classification/:id`, () =>
        HttpResponse.json({ message: "Validation Error" }, { status: 422 }),
      ),
    );

    const { result } = renderHook(() =>
      useUpdatePartnerClassificationMutation(),
    );

    result.current.mutate({
      id: 1,
      data: { name: "", isActive: true },
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useDeletePartnerClassificationMutation", () => {
  it("calls toast.success after successful delete", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() =>
      useDeletePartnerClassificationMutation(),
    );

    result.current.mutate(1);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 404", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.delete(`${BASE}/master/partner/classification/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() =>
      useDeletePartnerClassificationMutation(),
    );

    result.current.mutate(999);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
