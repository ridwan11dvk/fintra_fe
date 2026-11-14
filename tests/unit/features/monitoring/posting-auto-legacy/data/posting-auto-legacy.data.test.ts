import {
  useBatchRegeneratePostingAutoLegacyMutation,
  useBatchSendToSapPostingAutoLegacyMutation,
  useCreatePostingAutoLegacyMutation,
  useDeletePostingAutoLegacyMutation,
  useGeneratePostingAutoLegacyMutation,
  useRegeneratePostingAutoLegacyMutation,
  useSendToSapPostingAutoLegacyMutation,
  useUpdatePostingAutoLegacyMutation,
} from "@/features/monitoring/posting-auto-legacy/data/posting-auto-legacy.mutation";
import {
  postingAutoLegacyQueryKeys,
  usePostingAutoLegacyByTransaction,
  usePostingAutoLegacyList,
} from "@/features/monitoring/posting-auto-legacy/data/posting-auto-legacy.query";
import { postingAutoLegacyService } from "@/features/monitoring/posting-auto-legacy/data/posting-auto-legacy.service";
import {
  POSTING_AUTO_LEGACY_BASE,
  POSTING_AUTO_LEGACY_URL,
  postingAutoLegacyDetailUrl,
} from "@/features/monitoring/posting-auto-legacy/data/posting-auto-legacy.utils";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
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

describe("postingAutoLegacyQueryKeys", () => {
  it("returns expected key structure", () => {
    expect(postingAutoLegacyQueryKeys.all).toEqual(["postingAutoLegacy"]);
    expect(postingAutoLegacyQueryKeys.lists()).toEqual([
      "postingAutoLegacy",
      "list",
    ]);
    expect(postingAutoLegacyQueryKeys.list()).toEqual([
      "postingAutoLegacy",
      "list",
      undefined,
    ]);
    expect(postingAutoLegacyQueryKeys.transactions()).toEqual([
      "postingAutoLegacy",
      "transaction",
    ]);
    expect(postingAutoLegacyQueryKeys.transaction("R", "D1", "REF1")).toEqual([
      "postingAutoLegacy",
      "transaction",
      "R",
      "D1",
      "REF1",
    ]);
  });
});

describe("postingAutoLegacyService", () => {
  it("list fetches paged data", async () => {
    const data = await postingAutoLegacyService.list();
    expect(data.status).toBe("SUCCESS");
    expect(data.data?.content[0].NO_DOK).toBe("DOK-001");
  });

  it("getByTransaction fetches detail rows", async () => {
    const data = await postingAutoLegacyService.getByTransaction(
      "R",
      "DOK-001",
      "REF-001",
    );
    expect(data.status).toBe("SUCCESS");
    expect(data.data?.[0].ACCOUNT).toBe("100001");
  });

  it("create posts payload", async () => {
    const data = await postingAutoLegacyService.create({
      RECORD_NUMBER: 1,
      TCODE: "FB01",
      REVERSAL: "",
      DOC_TYPE: "KR",
      NO_DOK: "D1",
      DEBIT_KREDIT: "S",
      ACCOUNT: "1",
      AMOUNT: "1",
      BA: "1",
      Fiscal_year: 2024,
      virtual_acc: "va",
    });
    expect(data.status).toBe("SUCCESS");
  });

  it("update puts payload", async () => {
    const data = await postingAutoLegacyService.update("R", "D1", "R1", "1", {
      RECORD_NUMBER: 1,
      TCODE: "FB01",
      REVERSAL: "",
      DOC_TYPE: "KR",
      NO_DOK: "D1",
      DEBIT_KREDIT: "S",
      ACCOUNT: "1",
      AMOUNT: "1",
      BA: "1",
      Fiscal_year: 2024,
      virtual_acc: "va",
    });
    expect(data.status).toBe("SUCCESS");
  });

  it("delete sends DELETE", async () => {
    const data = await postingAutoLegacyService.delete("R", "D1", "R1", "1");
    expect(data.status).toBe("SUCCESS");
  });

  it("generate posts generate request", async () => {
    const data = await postingAutoLegacyService.generate({ invoice: "INV-1" });
    expect(data.status).toBe("SUCCESS");
  });

  it("regenerate posts regenerate request", async () => {
    const data = await postingAutoLegacyService.regenerate("R", "D1", "R1");
    expect(data.status).toBe("SUCCESS");
  });

  it("sendToSap posts send-to-sap request", async () => {
    const data = await postingAutoLegacyService.sendToSap("R", "D1", "R1");
    expect(data.status).toBe("SUCCESS");
    expect(data.data?.sap_doc_number).toBe("SAP-001");
  });

  it("batchSendToSap posts batch request", async () => {
    const data = await postingAutoLegacyService.batchSendToSap({
      postings: [{ reversal: "R", noDok: "D1", reference: "R1" }],
    });
    expect(data.status).toBe("SUCCESS");
  });

  it("batchRegenerate posts batch request", async () => {
    const data = await postingAutoLegacyService.batchRegenerate({
      postings: [{ reversal: "R", noDok: "D1", reference: "R1" }],
    });
    expect(data.status).toBe("SUCCESS");
  });
});

describe("query hooks", () => {
  it("usePostingAutoLegacyList fetches paged groups", async () => {
    const { result } = renderHook(() => usePostingAutoLegacyList());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.content).toHaveLength(1);
  });

  it("usePostingAutoLegacyByTransaction fetches detail rows", async () => {
    const { result } = renderHook(() =>
      usePostingAutoLegacyByTransaction("R", "DOK-001", "REF-001"),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toHaveLength(1);
  });

  it("usePostingAutoLegacyByTransaction is disabled without noDok", () => {
    const { result } = renderHook(() =>
      usePostingAutoLegacyByTransaction("R", "", ""),
    );

    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("mutation hooks", () => {
  it("useCreatePostingAutoLegacyMutation creates", async () => {
    const { result } = renderHook(() => useCreatePostingAutoLegacyMutation());
    result.current.mutate({
      RECORD_NUMBER: 1,
      TCODE: "FB01",
      REVERSAL: "",
      DOC_TYPE: "KR",
      NO_DOK: "D1",
      DEBIT_KREDIT: "S",
      ACCOUNT: "1",
      AMOUNT: "1",
      BA: "1",
      Fiscal_year: 2024,
      virtual_acc: "va",
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("useUpdatePostingAutoLegacyMutation updates", async () => {
    const { result } = renderHook(() => useUpdatePostingAutoLegacyMutation());
    result.current.mutate({
      reversal: "R",
      noDok: "D1",
      reference: "R1",
      indeks: "1",
      data: {
        RECORD_NUMBER: 1,
        TCODE: "FB01",
        REVERSAL: "",
        DOC_TYPE: "KR",
        NO_DOK: "D1",
        DEBIT_KREDIT: "S",
        ACCOUNT: "1",
        AMOUNT: "1",
        BA: "1",
        Fiscal_year: 2024,
        virtual_acc: "va",
      },
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("useDeletePostingAutoLegacyMutation deletes", async () => {
    const { result } = renderHook(() => useDeletePostingAutoLegacyMutation());
    result.current.mutate({
      reversal: "R",
      noDok: "D1",
      reference: "R1",
      indeks: "1",
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("useGeneratePostingAutoLegacyMutation generates", async () => {
    const { result } = renderHook(() => useGeneratePostingAutoLegacyMutation());
    result.current.mutate({ invoice: "INV-1" });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("useRegeneratePostingAutoLegacyMutation regenerates", async () => {
    const { result } = renderHook(() =>
      useRegeneratePostingAutoLegacyMutation(),
    );
    result.current.mutate({ reversal: "R", noDok: "D1", reference: "R1" });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("useSendToSapPostingAutoLegacyMutation sends to SAP", async () => {
    const { result } = renderHook(() =>
      useSendToSapPostingAutoLegacyMutation(),
    );
    result.current.mutate({ reversal: "R", noDok: "D1", reference: "R1" });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("useBatchSendToSapPostingAutoLegacyMutation batch sends", async () => {
    const { result } = renderHook(() =>
      useBatchSendToSapPostingAutoLegacyMutation(),
    );
    result.current.mutate({
      postings: [{ reversal: "R", noDok: "D1", reference: "R1" }],
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("useBatchRegeneratePostingAutoLegacyMutation batch regenerates", async () => {
    const { result } = renderHook(() =>
      useBatchRegeneratePostingAutoLegacyMutation(),
    );
    result.current.mutate({
      postings: [{ reversal: "R", noDok: "D1", reference: "R1" }],
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("posting-auto-legacy utils", () => {
  it("exposes URL constants", () => {
    expect(POSTING_AUTO_LEGACY_BASE).toBe("incoming-payment-legacy");
    expect(POSTING_AUTO_LEGACY_URL).toBe("/monitoring/incoming-payment-legacy");
  });

  it("postingAutoLegacyDetailUrl encodes segments", () => {
    expect(postingAutoLegacyDetailUrl("R", "D/1", "REF 1")).toBe(
      "/monitoring/incoming-payment-legacy/R/D%2F1/REF%201",
    );
  });
});
