import { transactionCategoryService } from "@/features/master-data/transaction-category/data/transaction-category.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

const BASE = "http://localhost:3000";

describe("transactionCategoryService", () => {
  describe("listTransactionCategories()", () => {
    it("returns paged transaction category data on success", async () => {
      const result = await transactionCategoryService.listTransactionCategories({ page: 1, size: 10 });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data?.content[0].name).toBe("Office Supplies");
      expect(result.data?.pagination.total).toBe(1);
    });

    it("forwards pagination params to the request", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/transaction-category`, ({ request }) => {
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

      await transactionCategoryService.listTransactionCategories({ page: 2, size: 5, search: "Office" });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("page")).toBe("2");
      expect(capturedUrl.searchParams.get("size")).toBe("5");
      expect(capturedUrl.searchParams.get("search")).toBe("Office");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/transaction-category`, () => {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          );
        }),
      );

      await expect(transactionCategoryService.listTransactionCategories()).rejects.toThrow();
    });
  });

  describe("getTransactionCategoryById()", () => {
    it("returns a single transaction category by ID", async () => {
      const result = await transactionCategoryService.getTransactionCategoryById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.name).toBe("Office Supplies");
    });
  });

  describe("createTransactionCategory()", () => {
    it("creates a transaction category and returns the created record", async () => {
      const payload = {
        name: "Office Supplies",
        isActive: true,
      };
      const result = await transactionCategoryService.createTransactionCategory(payload);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.name).toBe("Office Supplies");
    });
  });

  describe("updateTransactionCategory()", () => {
    it("updates a transaction category and returns the updated record", async () => {
      const payload = {
        name: "Office Supplies Updated",
        isActive: true,
      };
      const result = await transactionCategoryService.updateTransactionCategory(1, payload);

      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deleteTransactionCategory()", () => {
    it("deletes a transaction category successfully", async () => {
      const result = await transactionCategoryService.deleteTransactionCategory(1);

      expect(result.status).toBe("SUCCESS");
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.delete(`${BASE}/master/transaction-category/:id`, () =>
          HttpResponse.json({ message: "Not Found" }, { status: 404 }),
        ),
      );

      await expect(transactionCategoryService.deleteTransactionCategory(999)).rejects.toThrow();
    });
  });
});
