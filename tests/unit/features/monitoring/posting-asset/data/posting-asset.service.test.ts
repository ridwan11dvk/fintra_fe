import { postingAssetService } from "@/features/monitoring/posting-asset/data/posting-asset.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const BASE = "http://localhost:3000";

describe("postingAssetService", () => {
  describe("listGrouped()", () => {
    it("returns paged group data on success", async () => {
      const result = await postingAssetService.listGrouped({
        page: 1,
        size: 10,
      });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data?.content[0].documentNumber).toBe("DOC-001");
      expect(result.data?.pagination.total).toBe(1);
    });

    it("forwards pagination params to the request", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/monitoring/posting/asset`, ({ request }) => {
          capturedUrls.push(new URL(request.url));
          return HttpResponse.json({
            status: "SUCCESS",
            message: "ok",
            data: {
              content: [],
              pagination: {
                total: 0,
                pageSize: 5,
                pageNumber: 2,
                totalPages: 0,
                currentPage: 2,
                from: 0,
                to: 0,
              },
            },
          });
        }),
      );

      await postingAssetService.listGrouped({
        page: 2,
        size: 5,
        search: "DOC",
      });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("page")).toBe("2");
      expect(capturedUrl.searchParams.get("size")).toBe("5");
      expect(capturedUrl.searchParams.get("search")).toBe("DOC");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/monitoring/posting/asset`, () =>
          HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          ),
        ),
      );

      await expect(postingAssetService.listGrouped()).rejects.toThrow();
    });
  });

  describe("getByTransaction()", () => {
    it("returns transaction detail records", async () => {
      server.use(
        http.get(
          `${BASE}/monitoring/posting/asset/:reversalFlag/:documentNumber/:reference`,
          () => HttpResponse.json({
            status: "SUCCESS",
            message: "Data fetched successfully",
            data: [
              { id: 1, documentNumber: "DOC-001", transactionCode: "TC01", reversalFlag: "A", documentType: "DR", documentDate: "20240115", debitCreditFlag: "S", accountNumber: "123", businessArea: "BA01", postingDate: "20240115", segment: "", costCenter: "", profitCenter: "", fixedAssetNumber: "" },
            ],
          }),
        ),
      );

      const result = await postingAssetService.getByTransaction(
        "A",
        "DOC-001",
        "REF-001",
      );

      expect(result.status).toBe("SUCCESS");
      expect(Array.isArray(result.data)).toBe(true);
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(
          `${BASE}/monitoring/posting/asset/:reversalFlag/:documentNumber/:reference`,
          () =>
            HttpResponse.json(
              { message: "Server Error" },
              { status: 500 },
            ),
        ),
      );

      await expect(
        postingAssetService.getByTransaction("A", "DOC", "REF"),
      ).rejects.toThrow();
    });
  });

  describe("getById()", () => {
    it("returns a single posting asset by ID", async () => {
      const result = await postingAssetService.getById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.documentNumber).toBe("DOC-001");
    });
  });

  describe("create()", () => {
    it("creates a posting asset and returns the created record", async () => {
      const payload = {
        transactionCode: "TC01",
        reversalFlag: "A" as const,
        documentType: "DR",
        documentDate: "20240115",
        documentNumber: "DOC-001",
        debitCreditFlag: "S" as const,
        accountNumber: "1234567890",
        businessArea: "BA01",
      };

      const result = await postingAssetService.create(payload);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.transactionCode).toBe("TC01");
    });
  });

  describe("update()", () => {
    it("updates a posting asset and returns the updated record", async () => {
      const payload = {
        transactionCode: "TC02",
        reversalFlag: "A" as const,
        documentType: "DR",
        documentDate: "20240115",
        documentNumber: "DOC-001",
        debitCreditFlag: "S" as const,
        accountNumber: "1234567890",
        businessArea: "BA01",
      };

      const result = await postingAssetService.update(1, payload);

      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("delete()", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("deletes a posting asset successfully", async () => {
      const result = await postingAssetService.delete(1);
      expect(result.status).toBe("SUCCESS");
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.delete(`${BASE}/monitoring/posting/asset/:id`, () =>
          HttpResponse.json({ message: "Not Found" }, { status: 404 }),
        ),
      );

      await expect(postingAssetService.delete(999)).rejects.toThrow();
    });
  });

  describe("getStatusSummary()", () => {
    it("returns status summary counts", async () => {
      const result = await postingAssetService.getStatusSummary();

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.pendingCount).toBe(5);
      expect(result.data?.postedCount).toBe(10);
      expect(result.data?.errorCount).toBe(2);
      expect(result.data?.sapSuccessCount).toBe(8);
      expect(result.data?.sapErrorCount).toBe(3);
      expect(result.data?.sapCancelCount).toBe(1);
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/monitoring/posting/asset/summary/status`, () =>
          HttpResponse.json(
            { message: "Server Error" },
            { status: 500 },
          ),
        ),
      );

      await expect(
        postingAssetService.getStatusSummary(),
      ).rejects.toThrow();
    });
  });
});
