import { postingAutoService } from "@/features/monitoring/posting-auto/data/posting-auto.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const BASE = "http://localhost:3000";

describe("postingAutoService", () => {
  describe("listGrouped()", () => {
    it("returns paged group data on success", async () => {
      server.use(
        http.get(`${BASE}/monitoring/posting/auto`, () =>
          HttpResponse.json({
            status: "SUCCESS",
            message: "ok",
            data: {
              content: [
                {
                  reversalFlag: "A",
                  documentNumber: "DOC-001",
                  reference: "REF-001",
                  documentDate: "20250101",
                  virtualAccount: "VA001",
                  sapDocumentNumber: "SAP-001",
                  sapStatus: "S",
                  postingStatus: 0,
                  assignment: null,
                  fiscalYear: 2025,
                  createdAt: "2025-01-01T00:00:00Z",
                  updatedAt: "2025-01-01T00:00:00Z",
                },
              ],
              pagination: {
                total: 1,
                pageSize: 10,
                pageNumber: 1,
                totalPages: 1,
                currentPage: 1,
                from: 0,
                to: 0,
              },
            },
          }),
        ),
      );

      const result = await postingAutoService.listGrouped({
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
        http.get(`${BASE}/monitoring/posting/auto`, ({ request }) => {
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

      await postingAutoService.listGrouped({
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
        http.get(`${BASE}/monitoring/posting/auto`, () =>
          HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          ),
        ),
      );

      await expect(postingAutoService.listGrouped()).rejects.toThrow();
    });
  });

  describe("getByTransaction()", () => {
    it("returns transaction detail records", async () => {
      server.use(
        http.get(
          `${BASE}/monitoring/posting/auto/:reversalFlag/:documentNumber/:reference`,
          () =>
            HttpResponse.json({
              status: "SUCCESS",
              message: "Data fetched successfully",
              data: [
                {
                  id: 1,
                  documentNumber: "DOC-001",
                  transactionCode: "T001",
                  reversalFlag: "A",
                  documentType: "DT",
                  documentDate: "20250101",
                  debitCreditFlag: "S",
                  accountNumber: "ACC-001",
                  businessArea: "BA01",
                  postingDate: "20250101",
                  segment: "",
                  costCenter: "",
                  profitCenter: "",
                  fixedAssetNumber: "",
                },
              ],
            }),
        ),
      );

      const result = await postingAutoService.getByTransaction(
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
          `${BASE}/monitoring/posting/auto/:reversalFlag/:documentNumber/:reference`,
          () =>
            HttpResponse.json(
              { message: "Server Error" },
              { status: 500 },
            ),
        ),
      );

      await expect(
        postingAutoService.getByTransaction("A", "DOC", "REF"),
      ).rejects.toThrow();
    });
  });

  describe("getById()", () => {
    it("returns a single posting auto by ID", async () => {
      server.use(
        http.get(`${BASE}/monitoring/posting/auto/:id`, () =>
          HttpResponse.json({
            status: "SUCCESS",
            message: "Success",
            data: {
              id: 1,
              documentNumber: "DOC-001",
              transactionCode: "T001",
              reversalFlag: "A",
              documentType: "DT",
              documentDate: "20250101",
              debitCreditFlag: "S",
              accountNumber: "ACC-001",
              businessArea: "BA01",
            },
          }),
        ),
      );

      const result = await postingAutoService.getById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.documentNumber).toBe("DOC-001");
    });
  });

  describe("create()", () => {
    it("creates a posting auto and returns the created record", async () => {
      server.use(
        http.post(`${BASE}/monitoring/posting/auto`, () =>
          HttpResponse.json({
            status: "SUCCESS",
            message: "Created",
            data: {
              id: 2,
              transactionCode: "T001",
              reversalFlag: "A",
              documentType: "DT",
              documentDate: "20250101",
              documentNumber: "DOC-001",
              debitCreditFlag: "S",
              accountNumber: "ACC-001",
              businessArea: "BA01",
            },
          }),
        ),
      );

      const payload = {
        transactionCode: "T001",
        reversalFlag: "A" as const,
        documentType: "DT",
        documentDate: "20250101",
        documentNumber: "DOC-001",
        debitCreditFlag: "S" as const,
        accountNumber: "ACC-001",
        businessArea: "BA01",
      };

      const result = await postingAutoService.create(payload);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.transactionCode).toBe("T001");
    });
  });

  describe("update()", () => {
    it("updates a posting auto and returns the updated record", async () => {
      server.use(
        http.put(`${BASE}/monitoring/posting/auto/:id`, () =>
          HttpResponse.json({
            status: "SUCCESS",
            message: "Updated",
            data: {
              id: 1,
              transactionCode: "T002",
              reversalFlag: "A",
              documentType: "DT",
              documentDate: "20250101",
              documentNumber: "DOC-001",
              debitCreditFlag: "S",
              accountNumber: "ACC-001",
              businessArea: "BA01",
            },
          }),
        ),
      );

      const payload = {
        transactionCode: "T002",
        reversalFlag: "A" as const,
        documentType: "DT",
        documentDate: "20250101",
        documentNumber: "DOC-001",
        debitCreditFlag: "S" as const,
        accountNumber: "ACC-001",
        businessArea: "BA01",
      };

      const result = await postingAutoService.update(1, payload);

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

    it("deletes a posting auto successfully", async () => {
      server.use(
        http.delete(`${BASE}/monitoring/posting/auto/:id`, () =>
          HttpResponse.json({
            status: "SUCCESS",
            message: "Deleted",
          }),
        ),
      );

      const result = await postingAutoService.delete(1);
      expect(result.status).toBe("SUCCESS");
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.delete(`${BASE}/monitoring/posting/auto/:id`, () =>
          HttpResponse.json({ message: "Not Found" }, { status: 404 }),
        ),
      );

      await expect(postingAutoService.delete(999)).rejects.toThrow();
    });
  });

  describe("getStatusSummary()", () => {
    it("returns status summary counts", async () => {
      server.use(
        http.get(`${BASE}/monitoring/posting/auto/summary/status`, () =>
          HttpResponse.json({
            status: "SUCCESS",
            message: "Status summary fetched successfully",
            data: {
              pendingCount: 10,
              postedCount: 20,
              errorCount: 5,
              sapSuccessCount: 15,
              sapErrorCount: 3,
              sapCancelCount: 2,
            },
          }),
        ),
      );

      const result = await postingAutoService.getStatusSummary();

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.pendingCount).toBe(10);
      expect(result.data?.postedCount).toBe(20);
      expect(result.data?.errorCount).toBe(5);
      expect(result.data?.sapSuccessCount).toBe(15);
      expect(result.data?.sapErrorCount).toBe(3);
      expect(result.data?.sapCancelCount).toBe(2);
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/monitoring/posting/auto/summary/status`, () =>
          HttpResponse.json(
            { message: "Server Error" },
            { status: 500 },
          ),
        ),
      );

      await expect(
        postingAutoService.getStatusSummary(),
      ).rejects.toThrow();
    });
  });
});
