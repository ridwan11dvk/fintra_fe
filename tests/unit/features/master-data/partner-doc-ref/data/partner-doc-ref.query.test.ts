import {
  partnerDocRefQueryKeys,
  useGetFilteredPartnerDocRefs,
  useGetPartnerDocRef,
  useGetPartnerDocRefByCountry,
  useGetPartnerDocRefByCountryAndCompany,
  useListPartnerDocRefs,
} from "@/features/master-data/partner-doc-ref/data/partner-doc-ref.query";
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

describe("partnerDocRefQueryKeys", () => {
  it("all returns base key array", () => {
    expect(partnerDocRefQueryKeys.all).toEqual(["partnerDocRefs"]);
  });

  it("lists() returns list key", () => {
    expect(partnerDocRefQueryKeys.lists()).toEqual(["partnerDocRefs", "list"]);
  });

  it("list() without params returns list key with undefined", () => {
    expect(partnerDocRefQueryKeys.list()).toEqual([
      "partnerDocRefs",
      "list",
      undefined,
    ]);
  });

  it("list(params) returns list key with params", () => {
    const params = { page: 1, size: 10 };
    expect(partnerDocRefQueryKeys.list(params)).toEqual([
      "partnerDocRefs",
      "list",
      params,
    ]);
  });

  it("details() returns detail key", () => {
    expect(partnerDocRefQueryKeys.details()).toEqual([
      "partnerDocRefs",
      "detail",
    ]);
  });

  it("detail(id) returns detail key with id", () => {
    expect(partnerDocRefQueryKeys.detail(5)).toEqual([
      "partnerDocRefs",
      "detail",
      5,
    ]);
  });

  it("byCountry(countryId) returns byCountry key", () => {
    expect(partnerDocRefQueryKeys.byCountry(1)).toEqual([
      "partnerDocRefs",
      "byCountry",
      1,
    ]);
  });

  it("byCountryAndCompany returns combined key", () => {
    expect(partnerDocRefQueryKeys.byCountryAndCompany(1, "C001")).toEqual([
      "partnerDocRefs",
      "byCountryAndCompany",
      1,
      "C001",
    ]);
  });
});

describe("useListPartnerDocRefs", () => {
  it("fetches and returns paged partner doc ref data", async () => {
    const { result } = renderHook(() => useListPartnerDocRefs());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].documentName).toBe("KTP");
  });

  it("passes pagination params to the query", async () => {
    const params = { page: 1, size: 10, search: "KTP" };
    const { result } = renderHook(() => useListPartnerDocRefs(params));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListPartnerDocRefs(undefined, { enabled: false }),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/partner/doc-ref`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useListPartnerDocRefs());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.success with fallback message when data.message is undefined", async () => {
    server.use(
      http.get(`${BASE}/master/partner/doc-ref`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          data: {
            content: [],
            pagination: {
              total: 0,
              pageSize: 10,
              pageNumber: 1,
              totalPages: 0,
              currentPage: 1,
              from: 0,
              to: 0,
            },
          },
        }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListPartnerDocRefs());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Partner document references loaded",
      ),
    );
  });

  it("does not call toast.success when status is not SUCCESS", async () => {
    server.use(
      http.get(`${BASE}/master/partner/doc-ref`, () =>
        HttpResponse.json({
          status: "FAILED",
          message: "Error",
          data: null,
        }),
      ),
    );

    const { toast } = await import("sonner");
    (toast.success as ReturnType<typeof vi.fn>).mockClear();

    const { result } = renderHook(() => useListPartnerDocRefs());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with fallback message when no error message in response", async () => {
    server.use(
      http.get(`${BASE}/master/partner/doc-ref`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useListPartnerDocRefs());

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load partner document references",
      ),
    );
  });
});

describe("useGetPartnerDocRef", () => {
  it("fetches and returns a single partner doc ref by ID", async () => {
    const { result } = renderHook(() => useGetPartnerDocRef(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.documentName).toBe("KTP");
  });

  it("does not fetch when id is undefined", async () => {
    const { result } = renderHook(() => useGetPartnerDocRef(undefined));

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("enters error state when server returns 404", async () => {
    server.use(
      http.get(`${BASE}/master/partner/doc-ref/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useGetPartnerDocRef(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls toast.error when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/partner/doc-ref/:id`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const { toast } = await import("sonner");
    const { result } = renderHook(() => useGetPartnerDocRef(999));

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load partner document reference",
      ),
    );
  });
});

describe("useGetPartnerDocRefByCountry", () => {
  it("fetches partner doc refs by country", async () => {
    const { result } = renderHook(() => useGetPartnerDocRefByCountry(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data).toHaveLength(1);
  });

  it("does not fetch when countryId is undefined", async () => {
    const { result } = renderHook(() =>
      useGetPartnerDocRefByCountry(undefined),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});

describe("useGetPartnerDocRefByCountryAndCompany", () => {
  it("fetches partner doc refs by country and company", async () => {
    const { result } = renderHook(() =>
      useGetPartnerDocRefByCountryAndCompany(1, "C001"),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data).toHaveLength(1);
  });

  it("does not fetch when params are missing", async () => {
    const { result } = renderHook(() =>
      useGetPartnerDocRefByCountryAndCompany(undefined, undefined),
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});

describe("useGetFilteredPartnerDocRefs", () => {
  it("fetches filtered partner doc refs", async () => {
    const { result } = renderHook(() =>
      useGetFilteredPartnerDocRefs({
        companyCode: "C001",
        countryId: 1,
      }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data).toHaveLength(1);
  });

  it("fetches without filters", async () => {
    const { result } = renderHook(() => useGetFilteredPartnerDocRefs());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe("SUCCESS");
  });
});
