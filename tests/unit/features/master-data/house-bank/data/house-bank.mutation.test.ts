import {
  useCreateHouseBankMutation,
  useDeleteHouseBankMutation,
  useImportHouseBanksMutation,
  useUpdateHouseBankMutation,
} from "@/features/master-data/house-bank/data/house-bank.mutation";
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

describe("useCreateHouseBankMutation", () => {
  it("calls toast.success after successful create", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useCreateHouseBankMutation());

    result.current.mutate({
      bankCode: "BCA",
      companyCode: "FINTRA",
      currencyCode: "IDR",
      accountId: "HB-BCA-001",
      accountNumber: "1234567890",
      accountName: "PT Fintra - BCA Operasional",
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.post(`${BASE}/master/house-bank`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useCreateHouseBankMutation());

    result.current.mutate({
      bankCode: "BCA",
      companyCode: "FINTRA",
      currencyCode: "IDR",
      accountId: "HB-BCA-001",
      accountNumber: "1234567890",
      accountName: "Test",
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useUpdateHouseBankMutation", () => {
  it("calls toast.success after successful update", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useUpdateHouseBankMutation());

    result.current.mutate({
      id: 1,
      data: {
        bankCode: "BCA",
        companyCode: "FINTRA",
        currencyCode: "IDR",
        accountId: "HB-BCA-001",
        accountNumber: "1234567890",
        accountName: "Updated Account",
      },
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 422", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.put(`${BASE}/master/house-bank/:id`, () =>
        HttpResponse.json({ message: "Validation Error" }, { status: 422 }),
      ),
    );

    const { result } = renderHook(() => useUpdateHouseBankMutation());

    result.current.mutate({
      id: 1,
      data: {
        bankCode: "",
        companyCode: "FINTRA",
        currencyCode: "IDR",
        accountId: "HB-BCA-001",
        accountNumber: "1234567890",
        accountName: "Test",
      },
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useDeleteHouseBankMutation", () => {
  it("calls toast.success after successful delete", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useDeleteHouseBankMutation());

    result.current.mutate(1);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 404", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.delete(`${BASE}/master/house-bank/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useDeleteHouseBankMutation());

    result.current.mutate(999);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useImportHouseBanksMutation", () => {
  it("calls toast.success after successful import", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useImportHouseBanksMutation());

    const file = new File(["content"], "house_banks.xlsx", {
      type: "application/vnd.ms-excel",
    });

    result.current.mutate({ file });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.success when importing with dryRun=true", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useImportHouseBanksMutation());

    const file = new File(["content"], "house_banks.xlsx", {
      type: "application/vnd.ms-excel",
    });

    result.current.mutate({ file, dryRun: true });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 422", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.post(`${BASE}/master/house-bank/import`, () =>
        HttpResponse.json({ message: "Unprocessable Entity" }, { status: 422 }),
      ),
    );

    const { result } = renderHook(() => useImportHouseBanksMutation());

    const file = new File(["bad"], "house_banks.xlsx", {
      type: "application/vnd.ms-excel",
    });

    result.current.mutate({ file });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
