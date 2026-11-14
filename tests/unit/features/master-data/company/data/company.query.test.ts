import {
  companyQueryKeys,
  useGetCompanyById,
  useGetCompanyFilePresignedUrl,
  useGetFooterPresignedUrl,
  useGetHeaderPresignedUrl,
  useGetLogoPresignedUrl,
  useListCompanies,
} from "@/features/master-data/company/data/company.query";
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

describe("companyQueryKeys", () => {
  it("all returns base key array", () => {
    expect(companyQueryKeys.all).toEqual(["companies"]);
  });

  it("lists() returns list key", () => {
    expect(companyQueryKeys.lists()).toEqual(["companies", "list"]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(companyQueryKeys.list()).toEqual(["companies", "list", undefined]);
  });

  it("list(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(companyQueryKeys.list(params)).toEqual([
      "companies",
      "list",
      params,
    ]);
  });

  it("details() returns detail key", () => {
    expect(companyQueryKeys.details()).toEqual(["companies", "detail"]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(companyQueryKeys.detail(5)).toEqual(["companies", "detail", 5]);
  });
});

describe("useListCompanies", () => {
  it("fetches and returns paged company data", async () => {
    const { result } = renderHook(() => useListCompanies());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].code).toBe("COMP001");
  });

  it("passes pagination params to the query", async () => {
    const params = { page: 1, size: 10, keyword: "PT Mitra", isActive: true };
    const { result } = renderHook(() => useListCompanies(params));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListCompanies(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/company`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListCompanies());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.error when request fails", async () => {
    server.use(
      http.get(`${BASE}/master/company`, () =>
        HttpResponse.json(
          { message: "Failed to fetch companies" },
          { status: 500 },
        ),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListCompanies());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it("calls toast.error with fallback message when no error message", async () => {
    server.use(
      http.get(`${BASE}/master/company`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListCompanies());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load companies"),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(`${BASE}/master/company`, () =>
        HttpResponse.json({
          status: "ERROR",
          message: "Server Error",
          data: null,
        }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useListCompanies());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("handles gcTime option silently", async () => {
    const { result } = renderHook(() =>
      useListCompanies(undefined, { gcTime: 5000 }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe("SUCCESS");
  });
});

describe("useGetCompanyById", () => {
  it("fetches and returns a single company by ID", async () => {
    const { result } = renderHook(() => useGetCompanyById(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.name).toBe("PT Mitra Utama Indonesia");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetCompanyById(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when company not found", async () => {
    server.use(
      http.get(`${BASE}/master/company/:id`, () =>
        HttpResponse.json({ message: "Company not found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useGetCompanyById(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.error with custom error message", async () => {
    server.use(
      http.get(`${BASE}/master/company/:id`, () =>
        HttpResponse.json(
          { message: "Company access denied" },
          { status: 403 },
        ),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetCompanyById(1));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("Company access denied"),
      ),
    );
  });

  it("calls toast.error with fallback message when no error details", async () => {
    server.use(
      http.get(`${BASE}/master/company/:id`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetCompanyById(1));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to load company"),
    );
  });
});

describe("useGetLogoPresignedUrl", () => {
  it("fetches and returns presigned URL for logo", async () => {
    const { result } = renderHook(() => useGetLogoPresignedUrl(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data).toMatch(/^https:\/\/s3\.example\.com/);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetLogoPresignedUrl(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});

describe("useGetHeaderPresignedUrl", () => {
  it("fetches and returns presigned URL for header document", async () => {
    const { result } = renderHook(() => useGetHeaderPresignedUrl(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data).toMatch(/^https:\/\/s3\.example\.com/);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetHeaderPresignedUrl(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});

describe("useGetFooterPresignedUrl", () => {
  it("fetches and returns presigned URL for footer document", async () => {
    const { result } = renderHook(() => useGetFooterPresignedUrl(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data).toMatch(/^https:\/\/s3\.example\.com/);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetFooterPresignedUrl(1, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});

describe("useGetCompanyFilePresignedUrl", () => {
  it("fetches and returns presigned URL for company file", async () => {
    const { result } = renderHook(() => useGetCompanyFilePresignedUrl(1, 5));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data).toMatch(/^https:\/\/s3\.example\.com/);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetCompanyFilePresignedUrl(1, 5, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});
