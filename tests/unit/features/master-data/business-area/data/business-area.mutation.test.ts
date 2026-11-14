import {
  useCreateBusinessAreaMutation,
  useDeleteBusinessAreaMutation,
  useImportBusinessAreasMutation,
  useUpdateBusinessAreaMutation,
} from "@/features/master-data/business-area/data/business-area.mutation";
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

describe("useCreateBusinessAreaMutation", () => {
  it("calls toast.success after successful create", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useCreateBusinessAreaMutation());

    result.current.mutate({
      companyCode: "PTABC",
      name: "Business Area Jakarta",
      baCode: "BA-JKT-01",
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.post(`${BASE}/master/business-area`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useCreateBusinessAreaMutation());

    result.current.mutate({
      companyCode: "PTABC",
      name: "Business Area Jakarta",
      baCode: "BA-JKT-01",
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useUpdateBusinessAreaMutation", () => {
  it("calls toast.success after successful update", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useUpdateBusinessAreaMutation());

    result.current.mutate({
      id: 1,
      data: {
        companyCode: "PTABC",
        name: "Business Area Jakarta Updated",
        baCode: "BA-JKT-01",
      },
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 422", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.put(`${BASE}/master/business-area/:id`, () =>
        HttpResponse.json({ message: "Validation Error" }, { status: 422 }),
      ),
    );

    const { result } = renderHook(() => useUpdateBusinessAreaMutation());

    result.current.mutate({
      id: 1,
      data: {
        companyCode: "PTABC",
        name: "",
        baCode: "BA-JKT-01",
      },
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useDeleteBusinessAreaMutation", () => {
  it("calls toast.success after successful delete", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useDeleteBusinessAreaMutation());

    result.current.mutate(1);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 404", async () => {
    const { toast } = await import("sonner");

    server.use(
      http.delete(`${BASE}/master/business-area/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useDeleteBusinessAreaMutation());

    result.current.mutate(999);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useImportBusinessAreasMutation", () => {
  it("calls toast.success after successful import", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useImportBusinessAreasMutation());

    const file = new File(["content"], "business-areas.xlsx", {
      type: "application/vnd.ms-excel",
    });

    result.current.mutate({ file });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.success when importing with dryRun=true", async () => {
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useImportBusinessAreasMutation());

    const file = new File(["content"], "business-areas.xlsx", {
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
      http.post(`${BASE}/master/business-area/import`, () =>
        HttpResponse.json({ message: "Unprocessable Entity" }, { status: 422 }),
      ),
    );

    const { result } = renderHook(() => useImportBusinessAreasMutation());

    const file = new File(["bad"], "business-areas.xlsx", {
      type: "application/vnd.ms-excel",
    });

    result.current.mutate({ file });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
