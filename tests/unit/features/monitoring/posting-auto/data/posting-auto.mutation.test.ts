import {
  useCreatePostingAutoMutation,
  useDeletePostingAutoMutation,
  useUpdatePostingAutoMutation,
} from "@/features/monitoring/posting-auto/data/posting-auto.mutation";
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
vi.mock("@railfinance/core/types", __railfinanceCoreMock);

const BASE = "http://localhost:3000";

describe("useCreatePostingAutoMutation", () => {
  it("calls toast.success after successful create", async () => {
    server.use(
      http.post(`${BASE}/monitoring/posting/auto`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          message: "Created",
          data: { id: 2, transactionCode: "T001" },
        }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useCreatePostingAutoMutation());

    result.current.mutate({
      transactionCode: "T001",
      reversalFlag: "A",
      documentType: "DT",
      documentDate: "20250101",
      documentNumber: "DOC-001",
      debitCreditFlag: "S",
      accountNumber: "ACC-001",
      businessArea: "BA01",
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.post(`${BASE}/monitoring/posting/auto`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useCreatePostingAutoMutation());

    result.current.mutate({
      transactionCode: "T001",
      reversalFlag: "A",
      documentType: "DT",
      documentDate: "20250101",
      documentNumber: "DOC-001",
      debitCreditFlag: "S",
      accountNumber: "ACC-001",
      businessArea: "BA01",
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useUpdatePostingAutoMutation", () => {
  it("calls toast.success after successful update", async () => {
    server.use(
      http.put(`${BASE}/monitoring/posting/auto/:id`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          message: "Updated",
          data: { id: 1, transactionCode: "T002" },
        }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdatePostingAutoMutation());

    result.current.mutate({
      id: 1,
      data: {
        transactionCode: "T002",
        reversalFlag: "A",
        documentType: "DT",
        documentDate: "20250101",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "ACC-001",
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
      http.put(`${BASE}/monitoring/posting/auto/:id`, () =>
        HttpResponse.json({ message: "Validation Error" }, { status: 422 }),
      ),
    );

    const { result } = renderHook(() => useUpdatePostingAutoMutation());

    result.current.mutate({
      id: 1,
      data: {
        transactionCode: "",
        reversalFlag: "A",
        documentType: "DT",
        documentDate: "20250101",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "ACC-001",
        businessArea: "BA01",
      },
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useDeletePostingAutoMutation", () => {
  it("calls toast.success after successful delete", async () => {
    server.use(
      http.delete(`${BASE}/monitoring/posting/auto/:id`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          message: "Deleted",
        }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useDeletePostingAutoMutation());

    result.current.mutate(1);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 404", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.delete(`${BASE}/monitoring/posting/auto/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useDeletePostingAutoMutation());

    result.current.mutate(999);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
