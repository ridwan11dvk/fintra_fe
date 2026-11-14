import { transactionTypeService } from "@/features/master-data/transaction-type/data/transaction-type.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

const BASE = "http://localhost:3000";

describe("transactionTypeService", () => {
  describe("listTransactionTypes()", () => {
    it("returns paged transaction type data on success", async () => {
      const result = await transactionTypeService.listTransactionTypes({ page: 1, size: 10 });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data?.content[0].name).toBe("Sales Invoice");
      expect(result.data?.pagination.total).toBe(1);
    });

    it("forwards pagination params to the request", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/transaction-type`, ({ request }) => {
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

      await transactionTypeService.listTransactionTypes({ page: 2, size: 5, search: "Invoice" });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("page")).toBe("2");
      expect(capturedUrl.searchParams.get("size")).toBe("5");
      expect(capturedUrl.searchParams.get("search")).toBe("Invoice");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/transaction-type`, () => {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          );
        }),
      );

      await expect(transactionTypeService.listTransactionTypes()).rejects.toThrow();
    });
  });

  describe("getTransactionTypeById()", () => {
    it("returns a single transaction type by ID", async () => {
      const result = await transactionTypeService.getTransactionTypeById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.name).toBe("Sales Invoice");
    });
  });

  describe("getTransactionTypesByCompanyCode()", () => {
    it("returns transaction types by company code", async () => {
      const result = await transactionTypeService.getTransactionTypesByCompanyCode("COMP");

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(1);
      expect(result.data?.[0].companyCode).toBe("COMP");
    });
  });

  describe("getTransactionTypeByCompanyAndTcode()", () => {
    it("returns a transaction type by company code and tcode", async () => {
      const result = await transactionTypeService.getTransactionTypeByCompanyAndTcode("COMP", "FB70");

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.companyCode).toBe("COMP");
      expect(result.data?.tcode).toBe("FB70");
    });
  });

  describe("getTransactionTypesByModuleId()", () => {
    it("returns transaction types by module ID", async () => {
      const result = await transactionTypeService.getTransactionTypesByModuleId(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(1);
    });
  });

  describe("createTransactionType()", () => {
    it("creates a transaction type and returns the created record", async () => {
      const payload = {
        companyCode: "COMP",
        code: "SI",
        name: "Sales Invoice",
        isActive: true,
      };
      const result = await transactionTypeService.createTransactionType(payload);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.name).toBe("Sales Invoice");
    });
  });

  describe("updateTransactionType()", () => {
    it("updates a transaction type and returns the updated record", async () => {
      const payload = {
        companyCode: "COMP",
        code: "SI",
        name: "Sales Invoice Updated",
        isActive: true,
      };
      const result = await transactionTypeService.updateTransactionType(1, payload);

      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deleteTransactionType()", () => {
    it("deletes a transaction type successfully", async () => {
      const result = await transactionTypeService.deleteTransactionType(1);

      expect(result.status).toBe("SUCCESS");
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.delete(`${BASE}/master/transaction-type/:id`, () =>
          HttpResponse.json({ message: "Not Found" }, { status: 404 }),
        ),
      );

      await expect(transactionTypeService.deleteTransactionType(999)).rejects.toThrow();
    });
  });
});
