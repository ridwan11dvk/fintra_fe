import {
  useBulkUpdateSendStatusMutation,
  useUpdateDepositMutation,
  useUpdateSendStatusMutation,
} from "@/features/treasury";
import { server } from "@tests/unit/mocks/server";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
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
vi.mock("@railfinance/core/components/alert-banner", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/cards", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/simple-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dialog", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dropdown-menu", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/field", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/pagination", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/skeleton", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/table", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

const BASE = "http://localhost:3000";

describe("useUpdateDepositMutation", () => {
  it("should call toast.success after successful update", async () => {
    server.use(
      http.put(`${BASE}/treasury/deposit/:id`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          message: "Deposit updated successfully",
          data: { id: 1, name: "Updated" },
        }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdateDepositMutation());

    result.current.mutate({ id: 1, data: { name: "Updated" } });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Deposit updated successfully",
      ),
    );
  });

  it("should call toast.error on server error", async () => {
    server.use(
      http.put(`${BASE}/treasury/deposit/:id`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdateDepositMutation());

    result.current.mutate({ id: 1, data: { name: "Updated" } });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useUpdateSendStatusMutation", () => {
  it("should call toast.success after successful status update", async () => {
    server.use(
      http.put(`${BASE}/treasury/deposit/:id/send-status`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          message: "Send status updated successfully",
          data: { id: 1, sendStatus: 1 },
        }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdateSendStatusMutation());

    result.current.mutate({ id: 1, sendStatus: 1 });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Send status updated successfully",
      ),
    );
  });

  it("should call toast.error on status update failure", async () => {
    server.use(
      http.put(`${BASE}/treasury/deposit/:id/send-status`, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdateSendStatusMutation());

    result.current.mutate({ id: 1, sendStatus: 1 });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useBulkUpdateSendStatusMutation", () => {
  it("should call toast.success after successful bulk update", async () => {
    server.use(
      http.put(`${BASE}/treasury/deposit/send-status/bulk`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          message: "Send status updated successfully",
          data: { message: "Bulk update completed" },
        }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useBulkUpdateSendStatusMutation());

    result.current.mutate({ ids: [1, 2], sendStatus: 1 });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Send status updated successfully",
      ),
    );
  });

  it("should call toast.error on bulk update failure", async () => {
    server.use(
      http.put(`${BASE}/treasury/deposit/send-status/bulk`, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useBulkUpdateSendStatusMutation());

    result.current.mutate({ ids: [1], sendStatus: 0 });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
