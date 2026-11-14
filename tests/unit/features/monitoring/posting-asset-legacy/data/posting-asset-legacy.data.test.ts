import {
  useBatchRegeneratePostingAssetLegacyMutation,
  useBatchSendToSapPostingAssetLegacyMutation,
  useCreatePostingAssetLegacyMutation,
  useDeletePostingAssetLegacyMutation,
  useGeneratePostingAssetLegacyMutation,
  useRegeneratePostingAssetLegacyMutation,
  useSendToSapPostingAssetLegacyMutation,
  useUpdatePostingAssetLegacyMutation,
} from "@/features/monitoring/posting-asset-legacy/data/posting-asset-legacy.mutation";
import {
  postingAssetLegacyQueryKeys,
  usePostingAssetLegacyByTransaction,
  usePostingAssetLegacyList,
} from "@/features/monitoring/posting-asset-legacy/data/posting-asset-legacy.query";
import { postingAssetLegacyService } from "@/features/monitoring/posting-asset-legacy/data/posting-asset-legacy.service";
import {
  POSTING_ASSET_LEGACY_BASE,
  POSTING_ASSET_LEGACY_URL,
  postingAssetLegacyDetailUrl,
} from "@/features/monitoring/posting-asset-legacy/data/posting-asset-legacy.utils";
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

describe("postingAssetLegacyQueryKeys", () => {
  it("returns expected key structure", () => {
    expect(postingAssetLegacyQueryKeys.all).toEqual(["postingAssetLegacy"]);
    expect(postingAssetLegacyQueryKeys.lists()).toEqual([
      "postingAssetLegacy",
      "list",
    ]);
    expect(postingAssetLegacyQueryKeys.list()).toEqual([
      "postingAssetLegacy",
      "list",
      undefined,
    ]);
    expect(postingAssetLegacyQueryKeys.transactions()).toEqual([
      "postingAssetLegacy",
      "transaction",
    ]);
    expect(postingAssetLegacyQueryKeys.transaction("R", "D1", "REF1")).toEqual([
      "postingAssetLegacy",
      "transaction",
      "R",
      "D1",
      "REF1",
    ]);
  });
});

describe("postingAssetLegacyService", () => {
  it("list fetches paged data", async () => {
    const data = await postingAssetLegacyService.list();
    expect(data.status).toBe("SUCCESS");
    expect(data.data?.content[0].NO_DOK).toBe("INV-001");
  });

  it("getByTransaction fetches detail rows", async () => {
    const data = await postingAssetLegacyService.getByTransaction(
      "R",
      "INV-001",
      "REF-001",
    );
    expect(data.status).toBe("SUCCESS");
    expect(data.data?.[0].ACCOUNT).toBe("200001");
  });

  it("create posts payload", async () => {
    const data = await postingAssetLegacyService.create({
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
    const data = await postingAssetLegacyService.update("R", "D1", "R1", "1", {
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
    const data = await postingAssetLegacyService.delete("R", "D1", "R1", "1");
    expect(data.status).toBe("SUCCESS");
  });

  it("generate posts generate request", async () => {
    const data = await postingAssetLegacyService.generate({ invoice: "INV-1" });
    expect(data.status).toBe("SUCCESS");
  });

  it("regenerate posts regenerate request", async () => {
    const data = await postingAssetLegacyService.regenerate("R", "D1", "R1");
    expect(data.status).toBe("SUCCESS");
  });

  it("sendToSap posts send-to-sap request", async () => {
    const data = await postingAssetLegacyService.sendToSap("R", "D1", "R1");
    expect(data.status).toBe("SUCCESS");
    expect(data.data?.sap_doc_number).toBe("SAP-002");
  });

  it("batchSendToSap posts batch request", async () => {
    const data = await postingAssetLegacyService.batchSendToSap({
      postings: [{ reversal: "R", noDok: "D1", reference: "R1" }],
    });
    expect(data.status).toBe("SUCCESS");
  });

  it("batchRegenerate posts batch request", async () => {
    const data = await postingAssetLegacyService.batchRegenerate({
      postings: [{ reversal: "R", noDok: "D1", reference: "R1" }],
    });
    expect(data.status).toBe("SUCCESS");
  });
});

describe("query hooks", () => {
  it("usePostingAssetLegacyList fetches paged groups", async () => {
    const { result } = renderHook(() => usePostingAssetLegacyList());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.content).toHaveLength(1);
  });

  it("usePostingAssetLegacyByTransaction fetches detail rows", async () => {
    const { result } = renderHook(() =>
      usePostingAssetLegacyByTransaction("R", "INV-001", "REF-001"),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toHaveLength(1);
  });

  it("usePostingAssetLegacyByTransaction is disabled without noDok", () => {
    const { result } = renderHook(() =>
      usePostingAssetLegacyByTransaction("R", "", ""),
    );

    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("mutation hooks", () => {
  it("useCreatePostingAssetLegacyMutation creates", async () => {
    const { result } = renderHook(() => useCreatePostingAssetLegacyMutation());
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

  it("useUpdatePostingAssetLegacyMutation updates", async () => {
    const { result } = renderHook(() => useUpdatePostingAssetLegacyMutation());
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

  it("useDeletePostingAssetLegacyMutation deletes", async () => {
    const { result } = renderHook(() => useDeletePostingAssetLegacyMutation());
    result.current.mutate({
      reversal: "R",
      noDok: "D1",
      reference: "R1",
      indeks: "1",
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("useGeneratePostingAssetLegacyMutation generates", async () => {
    const { result } = renderHook(() =>
      useGeneratePostingAssetLegacyMutation(),
    );
    result.current.mutate({ invoice: "INV-1" });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("useRegeneratePostingAssetLegacyMutation regenerates", async () => {
    const { result } = renderHook(() =>
      useRegeneratePostingAssetLegacyMutation(),
    );
    result.current.mutate({ reversal: "R", noDok: "D1", reference: "R1" });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("useSendToSapPostingAssetLegacyMutation sends to SAP", async () => {
    const { result } = renderHook(() =>
      useSendToSapPostingAssetLegacyMutation(),
    );
    result.current.mutate({ reversal: "R", noDok: "D1", reference: "R1" });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("useBatchSendToSapPostingAssetLegacyMutation batch sends", async () => {
    const { result } = renderHook(() =>
      useBatchSendToSapPostingAssetLegacyMutation(),
    );
    result.current.mutate({
      postings: [{ reversal: "R", noDok: "D1", reference: "R1" }],
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("useBatchRegeneratePostingAssetLegacyMutation batch regenerates", async () => {
    const { result } = renderHook(() =>
      useBatchRegeneratePostingAssetLegacyMutation(),
    );
    result.current.mutate({
      postings: [{ reversal: "R", noDok: "D1", reference: "R1" }],
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("posting-asset-legacy utils", () => {
  it("exposes URL constants", () => {
    expect(POSTING_ASSET_LEGACY_BASE).toBe("invoice-legacy");
    expect(POSTING_ASSET_LEGACY_URL).toBe("/monitoring/invoice-legacy");
  });

  it("postingAssetLegacyDetailUrl encodes segments", () => {
    expect(postingAssetLegacyDetailUrl("R", "D/1", "REF 1")).toBe(
      "/monitoring/invoice-legacy/R/D%2F1/REF%201",
    );
  });
});
