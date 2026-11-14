import {
  partnerQueryKeys,
  useGetPartnerById,
  useGetPartnerLegality,
  useGetPartnerTaxProfile,
  useListPartnerBankAccounts,
  useListPartnerContacts,
  useListPartnerDocReferences,
  useListPartnerDocuments,
  useListPartnerErpCodes,
  useListPartners,
  useListPartnerTaxes,
  useListPartnerVirtualAccounts,
} from "@/features/master-data/partner/data/partner.query";
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

vi.mock("@railfinance/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@railfinance/core")>();
  const { buildUiResponseMock } =
    await import("@tests/unit/mocks/ui-response-mock");
  return buildUiResponseMock(actual);
});

const BASE = "http://localhost:3000";

// ============================================================================
// Query Keys
// ============================================================================
describe("partnerQueryKeys", () => {
  it("all returns base key", () => {
    expect(partnerQueryKeys.all).toEqual(["partners"]);
  });

  it("lists returns list key", () => {
    expect(partnerQueryKeys.lists()).toEqual(["partners", "list"]);
  });

  it("list returns list key with params", () => {
    expect(partnerQueryKeys.list({ page: 1, size: 10 })).toEqual([
      "partners",
      "list",
      { page: 1, size: 10 },
    ]);
  });

  it("details returns details key", () => {
    expect(partnerQueryKeys.details()).toEqual(["partners", "detail"]);
  });

  it("detail returns detail key with id", () => {
    expect(partnerQueryKeys.detail(5)).toEqual(["partners", "detail", 5]);
  });

  it("documents returns documents key", () => {
    expect(partnerQueryKeys.documents(1)).toEqual(["partners", "documents", 1]);
  });

  it("documentList returns document list key with params", () => {
    expect(partnerQueryKeys.documentList(1, { page: 1, size: 10 })).toEqual([
      "partners",
      "documents",
      1,
      { page: 1, size: 10 },
    ]);
  });

  it("contacts returns contacts key", () => {
    expect(partnerQueryKeys.contacts(1)).toEqual(["partners", "contacts", 1]);
  });

  it("contactList returns contact list key with params", () => {
    expect(partnerQueryKeys.contactList(1, { page: 1, size: 10 })).toEqual([
      "partners",
      "contacts",
      1,
      { page: 1, size: 10 },
    ]);
  });

  it("taxProfile returns tax profile key", () => {
    expect(partnerQueryKeys.taxProfile(1)).toEqual([
      "partners",
      "taxProfile",
      1,
    ]);
  });

  it("taxes returns taxes key", () => {
    expect(partnerQueryKeys.taxes(1)).toEqual(["partners", "taxes", 1]);
  });

  it("taxList returns tax list key with params", () => {
    expect(partnerQueryKeys.taxList(1, { page: 1, size: 10 })).toEqual([
      "partners",
      "taxes",
      1,
      { page: 1, size: 10 },
    ]);
  });

  it("docRef returns doc reference key with all params", () => {
    expect(partnerQueryKeys.docRef("COMP01", 1, 2, 3, 4)).toEqual([
      "partners",
      "docReferences",
      "COMP01",
      1,
      2,
      3,
      4,
      undefined,
      undefined,
    ]);
  });

  it("bankAccounts returns bank accounts key", () => {
    expect(partnerQueryKeys.bankAccounts(1)).toEqual([
      "partners",
      "bankAccounts",
      1,
    ]);
  });

  it("bankAccountList returns bank account list key with params", () => {
    expect(partnerQueryKeys.bankAccountList(1, { page: 1, size: 10 })).toEqual([
      "partners",
      "bankAccounts",
      1,
      { page: 1, size: 10 },
    ]);
  });

  it("virtualAccounts returns virtual accounts key", () => {
    expect(partnerQueryKeys.virtualAccounts(1)).toEqual([
      "partners",
      "virtualAccounts",
      1,
    ]);
  });

  it("virtualAccountList returns virtual account list key with params", () => {
    expect(
      partnerQueryKeys.virtualAccountList(1, { page: 1, size: 10 }),
    ).toEqual(["partners", "virtualAccounts", 1, { page: 1, size: 10 }]);
  });

  it("erpCodes returns ERP codes key", () => {
    expect(partnerQueryKeys.erpCodes(1)).toEqual(["partners", "erpCodes", 1]);
  });

  it("erpCodeList returns ERP code list key", () => {
    expect(partnerQueryKeys.erpCodeList(1, { page: 1, size: 10 })).toEqual([
      "partners",
      "erpCodes",
      1,
      { page: 1, size: 10 },
    ]);
  });

  it("erpCodeDetail returns ERP code detail key", () => {
    expect(partnerQueryKeys.erpCodeDetail(1, 7)).toEqual([
      "partners",
      "erpCodes",
      1,
      "detail",
      7,
    ]);
  });
});

// ============================================================================
// useListPartners
// ============================================================================
describe("useListPartners", () => {
  it("fetches and returns paged data", async () => {
    const { result } = renderHook(() => useListPartners());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe("SUCCESS");
    expect(result.current.data?.data?.content).toHaveLength(1);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListPartners(undefined, { enabled: false }),
    );
    expect(result.current.isFetching).toBe(false);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/partner`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useListPartners());
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

// ============================================================================
// useGetPartnerById
// ============================================================================
describe("useGetPartnerById", () => {
  it("fetches a specific partner by ID", async () => {
    const { result } = renderHook(() => useGetPartnerById(1));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.id).toBe(1);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetPartnerById(1, { enabled: false }),
    );
    expect(result.current.isFetching).toBe(false);
  });

  it("enters error state when server returns 404", async () => {
    server.use(
      http.get(`${BASE}/master/partner/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );
    const { result } = renderHook(() => useGetPartnerById(999));
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

// ============================================================================
// useListPartnerDocuments
// ============================================================================
describe("useListPartnerDocuments", () => {
  it("fetches and returns paged document data", async () => {
    const { result } = renderHook(() => useListPartnerDocuments(1));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.content).toHaveLength(1);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListPartnerDocuments(1, undefined, { enabled: false }),
    );
    expect(result.current.isFetching).toBe(false);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/partner/:partnerId/document`, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useListPartnerDocuments(1));
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

// ============================================================================
// useListPartnerContacts
// ============================================================================
describe("useListPartnerContacts", () => {
  it("fetches and returns paged contact data", async () => {
    const { result } = renderHook(() => useListPartnerContacts(1));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].name).toBe("Jane Doe");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListPartnerContacts(1, undefined, { enabled: false }),
    );
    expect(result.current.isFetching).toBe(false);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/partner/contact`, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useListPartnerContacts(1));
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

// ============================================================================
// useGetPartnerTaxProfile
// ============================================================================
describe("useGetPartnerTaxProfile", () => {
  it("fetches the tax profile of a partner", async () => {
    const { result } = renderHook(() => useGetPartnerTaxProfile(1));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.npwpNumber).toBe("1234567890123456");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetPartnerTaxProfile(1, { enabled: false }),
    );
    expect(result.current.isFetching).toBe(false);
  });

  it("enters error state when server returns 404 (no record yet)", async () => {
    server.use(
      http.get(`${BASE}/master/partner/:partnerId/tax-profile`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );
    const { result } = renderHook(() => useGetPartnerTaxProfile(1));
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

// ============================================================================
// useGetPartnerLegality
// ============================================================================
describe("useGetPartnerLegality", () => {
  it("fetches the legality record of a partner", async () => {
    const { result } = renderHook(() => useGetPartnerLegality(1));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.id).toBe(1);
    expect(result.current.data?.data?.nibNumber).toBe("NIB-001");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useGetPartnerLegality(1, { enabled: false }),
    );
    expect(result.current.isFetching).toBe(false);
  });
});

// ============================================================================
// useListPartnerTaxes
// ============================================================================
describe("useListPartnerTaxes", () => {
  it("fetches and returns paged tax data", async () => {
    const { result } = renderHook(() => useListPartnerTaxes(1));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].taxRateId).toBe(1);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListPartnerTaxes(1, undefined, { enabled: false }),
    );
    expect(result.current.isFetching).toBe(false);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/partner/tax`, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useListPartnerTaxes(1));
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

// ============================================================================
// useListPartnerDocReferences
// ============================================================================
describe("useListPartnerDocReferences", () => {
  it("fetches doc references successfully", async () => {
    const { result } = renderHook(() =>
      useListPartnerDocReferences({ companyCode: "COMP01" }),
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe("SUCCESS");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListPartnerDocReferences({
        companyCode: "COMP01",
        options: { enabled: false },
      }),
    );
    expect(result.current.isFetching).toBe(false);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/partner/doc-ref/filtered`, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );
    const { result } = renderHook(() =>
      useListPartnerDocReferences({ companyCode: "COMP01" }),
    );
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

// ============================================================================
// useListPartnerBankAccounts
// ============================================================================
describe("useListPartnerBankAccounts", () => {
  it("fetches and returns paged bank account data", async () => {
    const { result } = renderHook(() => useListPartnerBankAccounts(1));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].accountNumber).toBe(
      "1234567890",
    );
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListPartnerBankAccounts(1, undefined, { enabled: false }),
    );
    expect(result.current.isFetching).toBe(false);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/partner/bank-account`, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useListPartnerBankAccounts(1));
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

// ============================================================================
// useListPartnerVirtualAccounts
// ============================================================================
describe("useListPartnerVirtualAccounts", () => {
  it("fetches and returns paged virtual account data", async () => {
    const { result } = renderHook(() => useListPartnerVirtualAccounts(1));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.content).toHaveLength(1);
    expect(result.current.data?.data?.content[0].number).toBe("1234567890");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListPartnerVirtualAccounts(1, undefined, { enabled: false }),
    );
    expect(result.current.isFetching).toBe(false);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/partner/virtual-account`, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useListPartnerVirtualAccounts(1));
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

// ============================================================================
// useListPartnerErpCodes
// ============================================================================
describe("useListPartnerErpCodes", () => {
  it("fetches and returns paged ERP code data", async () => {
    const { result } = renderHook(() => useListPartnerErpCodes(1));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.content).toHaveLength(1);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() =>
      useListPartnerErpCodes(1, undefined, { enabled: false }),
    );
    expect(result.current.isFetching).toBe(false);
  });

  it("enters error state when server returns 500", async () => {
    server.use(
      http.get(`${BASE}/master/partner/:partnerId/erp-code`, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useListPartnerErpCodes(1));
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
