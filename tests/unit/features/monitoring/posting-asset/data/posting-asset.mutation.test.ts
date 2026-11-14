import {
  useCreatePostingAssetMutation,
  useDeletePostingAssetMutation,
  useUpdatePostingAssetMutation,
} from "@/features/monitoring/posting-asset/data/posting-asset.mutation";
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
vi.mock("@railfinance/core/components/activity-feed", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/alert-banner", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/cards", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/simple-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/constants", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/progress", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/skeleton", __railfinanceCoreMock);

const BASE = "http://localhost:3000";

describe("useCreatePostingAssetMutation", () => {
  it("calls toast.success after successful create", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useCreatePostingAssetMutation());

    result.current.mutate({
      transactionCode: "TC01",
      reversalFlag: "A",
      documentType: "DR",
      documentDate: "20240115",
      documentNumber: "DOC-001",
      debitCreditFlag: "S",
      accountNumber: "1234567890",
      businessArea: "BA01",
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.post(`${BASE}/monitoring/posting/asset`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useCreatePostingAssetMutation());

    result.current.mutate({
      transactionCode: "TC01",
      reversalFlag: "A",
      documentType: "DR",
      documentDate: "20240115",
      documentNumber: "DOC-001",
      debitCreditFlag: "S",
      accountNumber: "1234567890",
      businessArea: "BA01",
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useUpdatePostingAssetMutation", () => {
  it("calls toast.success after successful update", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdatePostingAssetMutation());

    result.current.mutate({
      id: 1,
      data: {
        transactionCode: "TC02",
        reversalFlag: "A",
        documentType: "DR",
        documentDate: "20240115",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "1234567890",
        businessArea: "BA01",
      },
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 422", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.put(`${BASE}/monitoring/posting/asset/:id`, () =>
        HttpResponse.json({ message: "Validation Error" }, { status: 422 }),
      ),
    );

    const { result } = renderHook(() => useUpdatePostingAssetMutation());

    result.current.mutate({
      id: 1,
      data: {
        transactionCode: "",
        reversalFlag: "A",
        documentType: "DR",
        documentDate: "20240115",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "1234567890",
        businessArea: "BA01",
      },
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useDeletePostingAssetMutation", () => {
  it("calls toast.success after successful delete", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useDeletePostingAssetMutation());

    result.current.mutate(1);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 404", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.delete(`${BASE}/monitoring/posting/asset/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useDeletePostingAssetMutation());

    result.current.mutate(999);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
