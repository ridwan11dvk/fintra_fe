import { cashflowCategoryService } from "@/features/master-data/cashflow-category/data/cashflow-category.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import {
  mockCashflowCategoryDto,
  mockCashflowCategoryDtoInactive,
} from "./cashflow-category.handlers";

const BASE = "http://localhost:3000";
const LIST_URL = `${BASE}/master-data/cashflow-categories`;

describe("cashflowCategoryService", () => {
  describe("listCashflowCategories()", () => {
    it("[FSSC-CFC-001] returns paged cashflow category data on success", async () => {
      const result = await cashflowCategoryService.listCashflowCategories({
        page: 0,
        size: 10,
      });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(2);
      expect(result.data?.content[0].code).toBe("OPEX");
      expect(result.data?.content[0].name).toBe("Operating Expense");
      expect(result.data?.content[0].status).toBe("ACTIVE");
      expect(result.data?.pagination.total).toBe(2);
    });

    it("[FSSC-CFC-003] filters list results client-side by search keyword", async () => {
      const result = await cashflowCategoryService.listCashflowCategories({
        page: 0,
        size: 10,
        search: "capex",
      });

      expect(result.data?.content).toHaveLength(1);
      expect(result.data?.content[0].code).toBe("CAPEX");
    });

    it("forwards page and size query params to the API", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(LIST_URL, ({ request }) => {
          capturedUrls.push(new URL(request.url));
          return HttpResponse.json({
            status: "SUCCESS",
            message: "ok",
            data: [],
          });
        }),
      );

      await cashflowCategoryService.listCashflowCategories({ page: 1, size: 5 });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("page")).toBe("1");
      expect(capturedUrl.searchParams.get("size")).toBe("5");
    });

    it("throws when the API returns ERROR status", async () => {
      server.use(
        http.get(LIST_URL, () =>
          HttpResponse.json({
            status: "ERROR",
            message: "Cashflow categories unavailable",
          }),
        ),
      );

      await expect(
        cashflowCategoryService.listCashflowCategories(),
      ).rejects.toThrow("Cashflow categories unavailable");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(LIST_URL, () =>
          HttpResponse.json({ message: "Internal Server Error" }, { status: 500 }),
        ),
      );

      await expect(
        cashflowCategoryService.listCashflowCategories(),
      ).rejects.toThrow();
    });
  });

  describe("getCashflowCategoryById()", () => {
    it("[FSSC-CFC-002] returns a single cashflow category by ID", async () => {
      const result = await cashflowCategoryService.getCashflowCategoryById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(mockCashflowCategoryDto.id);
      expect(result.data?.name).toBe("Operating Expense");
    });
  });

  describe("createCashflowCategory()", () => {
    it("[FSSC-CFC-014] creates a cashflow category with trimmed label payload", async () => {
      let body: unknown;

      server.use(
        http.post(LIST_URL, async ({ request }) => {
          body = await request.json();
          return HttpResponse.json({
            status: "SUCCESS",
            message: "Cashflow category created",
            data: {
              id: 4,
              code: "OPS",
              label: "Ops Category",
              description: "Desc",
              active: true,
            },
          });
        }),
      );

      const result = await cashflowCategoryService.createCashflowCategory({
        name: "  Ops Category  ",
        description: "  Desc  ",
      });

      expect(result.status).toBe("SUCCESS");
      expect(body).toEqual({ label: "Ops Category", description: "Desc" });
    });
  });

  describe("updateCashflowCategory()", () => {
    it("updates a cashflow category successfully", async () => {
      const result = await cashflowCategoryService.updateCashflowCategory(1, {
        name: "Operating Expense Updated",
        description: "Updated description",
      });

      expect(result.status).toBe("SUCCESS");
      expect(result.message).toContain("updated");
    });
  });

  describe("activateCashflowCategory() & deactivateCashflowCategory()", () => {
    it("activates an inactive cashflow category", async () => {
      const result = await cashflowCategoryService.activateCashflowCategory(
        mockCashflowCategoryDtoInactive.id,
      );

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.status).toBe("ACTIVE");
    });

    it("deactivates an active cashflow category", async () => {
      const result = await cashflowCategoryService.deactivateCashflowCategory(
        mockCashflowCategoryDto.id,
      );

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.status).toBe("INACTIVE");
    });
  });
});
