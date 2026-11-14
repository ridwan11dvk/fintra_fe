import {
  useCreateTermOfPaymentMutation,
  useDeleteTermOfPaymentMutation,
  useUpdateTermOfPaymentMutation,
} from "@/features/master-data/term-of-payment/data/term-of-payment.mutation";
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

describe("useCreateTermOfPaymentMutation", () => {
  it("calls toast.success after successful create", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useCreateTermOfPaymentMutation());

    result.current.mutate({
      code: "NET_30",
      name: "Net 30",
      numberOfDays: 30,
      calculationType: "CALENDAR_DAYS",
      isActive: true,
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.post(`${BASE}/master/term-of-payment`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useCreateTermOfPaymentMutation());

    result.current.mutate({
      code: "NET_30",
      name: "Net 30",
      numberOfDays: 30,
      calculationType: "CALENDAR_DAYS",
      isActive: true,
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useUpdateTermOfPaymentMutation", () => {
  it("calls toast.success after successful update", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useUpdateTermOfPaymentMutation());

    result.current.mutate({
      id: 1,
      data: {
        code: "NET_30",
        name: "Net 30 Updated",
        numberOfDays: 30,
        calculationType: "CALENDAR_DAYS",
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
      http.put(`${BASE}/master/term-of-payment/:id`, () =>
        HttpResponse.json({ message: "Validation Error" }, { status: 422 }),
      ),
    );

    const { result } = renderHook(() => useUpdateTermOfPaymentMutation());

    result.current.mutate({
      id: 1,
      data: {
        code: "",
        name: "Net 30",
        numberOfDays: 30,
        calculationType: "CALENDAR_DAYS",
        isActive: true,
      },
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useDeleteTermOfPaymentMutation", () => {
  it("calls toast.success after successful delete", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useDeleteTermOfPaymentMutation());

    result.current.mutate(1);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 404", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.delete(`${BASE}/master/term-of-payment/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useDeleteTermOfPaymentMutation());

    result.current.mutate(999);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
