import {
  useCreatePartnerBankAccountMutation,
  useCreatePartnerContactMutation,
  useCreatePartnerErpCodeMutation,
  useCreatePartnerMutation,
  useCreatePartnerTaxMutation,
  useCreatePartnerVirtualAccountMutation,
  useDeletePartnerBankAccountMutation,
  useDeletePartnerContactMutation,
  useDeletePartnerDocumentMutation,
  useDeletePartnerErpCodeMutation,
  useDeletePartnerMutation,
  useDeletePartnerTaxMutation,
  useDeletePartnerVirtualAccountMutation,
  useUpdatePartnerBankAccountMutation,
  useUpdatePartnerContactMutation,
  useUpdatePartnerDocumentMutation,
  useUpdatePartnerErpCodeMutation,
  useUpdatePartnerMutation,
  useUpdatePartnerTaxMutation,
  useUpdatePartnerVirtualAccountMutation,
  useUploadPartnerDocumentMutation,
} from "@/features/master-data/partner/data/partner.mutation";
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

// ============================================================================
// useCreatePartnerMutation
// ============================================================================
describe("useCreatePartnerMutation", () => {
  it("calls toast.success after successful create", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useCreatePartnerMutation());

    result.current.mutate({
      name: "New Partner",
      partnerCode: "NEW-001",
      status: "ACTIVE",
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.post(`${BASE}/master/partner`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useCreatePartnerMutation());
    result.current.mutate({
      name: "New Partner",
      partnerCode: "NEW-001",
      status: "ACTIVE",
    });
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

// ============================================================================
// useUpdatePartnerMutation
// ============================================================================
describe("useUpdatePartnerMutation", () => {
  it("calls toast.success after successful update", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdatePartnerMutation());

    result.current.mutate({
      id: 1,
      data: { name: "Updated Partner", status: "ACTIVE" },
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 422", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.put(`${BASE}/master/partner/:id`, () =>
        HttpResponse.json({ message: "Validation Error" }, { status: 422 }),
      ),
    );
    const { result } = renderHook(() => useUpdatePartnerMutation());
    result.current.mutate({ id: 1, data: { name: "Updated" } });
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

// ============================================================================
// useDeletePartnerMutation
// ============================================================================
describe("useDeletePartnerMutation", () => {
  it("calls toast.success after successful delete", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useDeletePartnerMutation());

    result.current.mutate(1);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 404", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.delete(`${BASE}/master/partner/:id`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );
    const { result } = renderHook(() => useDeletePartnerMutation());
    result.current.mutate(999);
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

// ============================================================================
// useUploadPartnerDocumentMutation
// ============================================================================
describe("useUploadPartnerDocumentMutation", () => {
  it("calls toast.success after successful document upload", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUploadPartnerDocumentMutation());

    result.current.mutate({
      partnerId: 1,
      data: { documentName: "New Doc", isActive: true },
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.post(`${BASE}/master/partner/:partnerId/document`, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useUploadPartnerDocumentMutation());
    result.current.mutate({
      partnerId: 1,
      data: { documentName: "New Doc", isActive: true },
    });
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

// ============================================================================
// useUpdatePartnerDocumentMutation
// ============================================================================
describe("useUpdatePartnerDocumentMutation", () => {
  it("calls toast.success after successful document update", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdatePartnerDocumentMutation());

    result.current.mutate({
      partnerId: 1,
      documentId: 1,
      data: { documentName: "Updated Doc" },
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 422", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.put(`${BASE}/master/partner/:partnerId/document/:documentId`, () =>
        HttpResponse.json({ message: "Error" }, { status: 422 }),
      ),
    );
    const { result } = renderHook(() => useUpdatePartnerDocumentMutation());
    result.current.mutate({
      partnerId: 1,
      documentId: 1,
      data: { documentName: "Updated Doc" },
    });
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

// ============================================================================
// useDeletePartnerDocumentMutation
// ============================================================================
describe("useDeletePartnerDocumentMutation", () => {
  it("calls toast.success after successful document delete", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useDeletePartnerDocumentMutation());

    result.current.mutate({ partnerId: 1, documentId: 1 });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 404", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.delete(
        `${BASE}/master/partner/:partnerId/document/:documentId`,
        () => HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );
    const { result } = renderHook(() => useDeletePartnerDocumentMutation());
    result.current.mutate({ partnerId: 1, documentId: 999 });
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

// ============================================================================
// useCreatePartnerContactMutation
// ============================================================================
describe("useCreatePartnerContactMutation", () => {
  it("calls toast.success after successful contact create", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useCreatePartnerContactMutation(1));

    result.current.mutate({ name: "New Contact" });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.post(`${BASE}/master/partner/contact`, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useCreatePartnerContactMutation(1));
    result.current.mutate({ name: "New Contact" });
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

// ============================================================================
// useUpdatePartnerContactMutation
// ============================================================================
describe("useUpdatePartnerContactMutation", () => {
  it("calls toast.success after successful contact update", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdatePartnerContactMutation(1));

    result.current.mutate({
      contactId: 1,
      data: { name: "Updated Contact" },
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 422", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.put(`${BASE}/master/partner/contact/:contactId`, () =>
        HttpResponse.json({ message: "Error" }, { status: 422 }),
      ),
    );
    const { result } = renderHook(() => useUpdatePartnerContactMutation(1));
    result.current.mutate({
      contactId: 1,
      data: { name: "Updated" },
    });
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

// ============================================================================
// useDeletePartnerContactMutation
// ============================================================================
describe("useDeletePartnerContactMutation", () => {
  it("calls toast.success after successful contact delete", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useDeletePartnerContactMutation());

    result.current.mutate({ partnerId: 1, contactId: 1 });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 404", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.delete(`${BASE}/master/partner/contact/:contactId`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );
    const { result } = renderHook(() => useDeletePartnerContactMutation());
    result.current.mutate({ partnerId: 1, contactId: 999 });
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

// ============================================================================
// useCreatePartnerTaxMutation
// ============================================================================
describe("useCreatePartnerTaxMutation", () => {
  it("calls toast.success after successful tax create", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useCreatePartnerTaxMutation(1));

    result.current.mutate({ taxRateId: 1, active: true });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.post(`${BASE}/master/partner/tax`, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useCreatePartnerTaxMutation(1));
    result.current.mutate({ taxRateId: 1, active: true });
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

// ============================================================================
// useUpdatePartnerTaxMutation
// ============================================================================
describe("useUpdatePartnerTaxMutation", () => {
  it("calls toast.success after successful tax update", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdatePartnerTaxMutation());

    result.current.mutate({
      partnerId: 1,
      taxId: 1,
      data: { active: false },
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 422", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.put(`${BASE}/master/partner/tax/:taxId`, () =>
        HttpResponse.json({ message: "Error" }, { status: 422 }),
      ),
    );
    const { result } = renderHook(() => useUpdatePartnerTaxMutation());
    result.current.mutate({
      partnerId: 1,
      taxId: 1,
      data: { active: false },
    });
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

// ============================================================================
// useDeletePartnerTaxMutation
// ============================================================================
describe("useDeletePartnerTaxMutation", () => {
  it("calls toast.success after successful tax delete", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useDeletePartnerTaxMutation());

    result.current.mutate({ partnerId: 1, taxId: 1 });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 404", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.delete(`${BASE}/master/partner/tax/:taxId`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );
    const { result } = renderHook(() => useDeletePartnerTaxMutation());
    result.current.mutate({ partnerId: 1, taxId: 999 });
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

// ============================================================================
// useCreatePartnerBankAccountMutation
// ============================================================================
describe("useCreatePartnerBankAccountMutation", () => {
  it("calls toast.success after successful bank account create", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useCreatePartnerBankAccountMutation(1));

    result.current.mutate({
      accountNumber: "9876543210",
      holderName: "New Holder",
      active: true,
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.post(`${BASE}/master/partner/bank-account`, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useCreatePartnerBankAccountMutation(1));
    result.current.mutate({
      accountNumber: "9876543210",
      holderName: "Holder",
    });
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

// ============================================================================
// useUpdatePartnerBankAccountMutation
// ============================================================================
describe("useUpdatePartnerBankAccountMutation", () => {
  it("calls toast.success after successful bank account update", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdatePartnerBankAccountMutation(1));

    result.current.mutate({
      bankAccountId: 1,
      data: { holderName: "Updated Holder" },
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 422", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.put(`${BASE}/master/partner/bank-account/:bankAccountId`, () =>
        HttpResponse.json({ message: "Error" }, { status: 422 }),
      ),
    );
    const { result } = renderHook(() => useUpdatePartnerBankAccountMutation(1));
    result.current.mutate({
      bankAccountId: 1,
      data: { holderName: "Updated" },
    });
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

// ============================================================================
// useDeletePartnerBankAccountMutation
// ============================================================================
describe("useDeletePartnerBankAccountMutation", () => {
  it("calls toast.success after successful bank account delete", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useDeletePartnerBankAccountMutation());

    result.current.mutate({ partnerId: 1, bankAccountId: 1 });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 404", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.delete(`${BASE}/master/partner/bank-account/:bankAccountId`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );
    const { result } = renderHook(() => useDeletePartnerBankAccountMutation());
    result.current.mutate({ partnerId: 1, bankAccountId: 999 });
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

// ============================================================================
// useCreatePartnerVirtualAccountMutation
// ============================================================================
describe("useCreatePartnerVirtualAccountMutation", () => {
  it("calls toast.success after successful virtual account create", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() =>
      useCreatePartnerVirtualAccountMutation(1),
    );

    result.current.mutate({
      number: "9876543210",
      holder: "New Holder",
      active: true,
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.post(`${BASE}/master/partner/virtual-account`, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );
    const { result } = renderHook(() =>
      useCreatePartnerVirtualAccountMutation(1),
    );
    result.current.mutate({
      number: "9876543210",
      holder: "Holder",
    });
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

// ============================================================================
// useUpdatePartnerVirtualAccountMutation
// ============================================================================
describe("useUpdatePartnerVirtualAccountMutation", () => {
  it("calls toast.success after successful virtual account update", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() =>
      useUpdatePartnerVirtualAccountMutation(1),
    );

    result.current.mutate({
      virtualAccountId: 1,
      data: { holder: "Updated Holder" },
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 422", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.put(`${BASE}/master/partner/virtual-account/:virtualAccountId`, () =>
        HttpResponse.json({ message: "Error" }, { status: 422 }),
      ),
    );
    const { result } = renderHook(() =>
      useUpdatePartnerVirtualAccountMutation(1),
    );
    result.current.mutate({
      virtualAccountId: 1,
      data: { holder: "Updated" },
    });
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

// ============================================================================
// useDeletePartnerVirtualAccountMutation
// ============================================================================
describe("useDeletePartnerVirtualAccountMutation", () => {
  it("calls toast.success after successful virtual account delete", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() =>
      useDeletePartnerVirtualAccountMutation(),
    );

    result.current.mutate({ partnerId: 1, virtualAccountId: 1 });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 404", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.delete(
        `${BASE}/master/partner/virtual-account/:virtualAccountId`,
        () => HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );
    const { result } = renderHook(() =>
      useDeletePartnerVirtualAccountMutation(),
    );
    result.current.mutate({ partnerId: 1, virtualAccountId: 999 });
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

// ============================================================================
// useCreatePartnerErpCodeMutation
// ============================================================================
describe("useCreatePartnerErpCodeMutation", () => {
  it("calls toast.success after successful ERP code create", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useCreatePartnerErpCodeMutation(1));

    result.current.mutate({ erpCode: "NEW-ERP-001", isActive: true });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.post(`${BASE}/master/partner/:partnerId/erp-code`, () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useCreatePartnerErpCodeMutation(1));
    result.current.mutate({ erpCode: "NEW-ERP-001", isActive: true });
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

// ============================================================================
// useUpdatePartnerErpCodeMutation
// ============================================================================
describe("useUpdatePartnerErpCodeMutation", () => {
  it("calls toast.success after successful ERP code update", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdatePartnerErpCodeMutation());

    result.current.mutate({
      partnerId: 1,
      erpCodeId: 1,
      data: { erpCode: "UPDATED-ERP-001" },
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 422", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.put(`${BASE}/master/partner/:partnerId/erp-code/:erpCodeId`, () =>
        HttpResponse.json({ message: "Error" }, { status: 422 }),
      ),
    );
    const { result } = renderHook(() => useUpdatePartnerErpCodeMutation());
    result.current.mutate({
      partnerId: 1,
      erpCodeId: 1,
      data: { erpCode: "Updated" },
    });
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

// ============================================================================
// useDeletePartnerErpCodeMutation
// ============================================================================
describe("useDeletePartnerErpCodeMutation", () => {
  it("calls toast.success after successful ERP code delete", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useDeletePartnerErpCodeMutation());

    result.current.mutate({ partnerId: 1, erpCodeId: 1 });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 404", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.delete(`${BASE}/master/partner/:partnerId/erp-code/:erpCodeId`, () =>
        HttpResponse.json({ message: "Not Found" }, { status: 404 }),
      ),
    );
    const { result } = renderHook(() => useDeletePartnerErpCodeMutation());
    result.current.mutate({ partnerId: 1, erpCodeId: 999 });
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
