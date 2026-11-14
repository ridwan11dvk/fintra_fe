import { partnerCategoryService } from "@/features/master-data/partner-category/data/partner-category.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const BASE = "http://localhost:3000";

describe("partnerCategoryService", () => {
  describe("listPartnerCategories()", () => {
    it("returns paged partner category data on success", async () => {
      const result =
        await partnerCategoryService.listPartnerCategories({
          page: 1,
          size: 10,
        });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data?.content[0].name).toBe("Supplier");
      expect(result.data?.pagination.total).toBe(1);
    });

    it("forwards pagination params to the request", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(
          "http://localhost:3000/master/partner/category",
          ({ request }) => {
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
          },
        ),
      );

      await partnerCategoryService.listPartnerCategories({
        page: 2,
        size: 5,
        search: "Supplier",
      });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("page")).toBe("2");
      expect(capturedUrl.searchParams.get("size")).toBe("5");
      expect(capturedUrl.searchParams.get("search")).toBe("Supplier");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(
          "http://localhost:3000/master/partner/category",
          () =>
            HttpResponse.json(
              { message: "Internal Server Error" },
              { status: 500 },
            ),
        ),
      );

      await expect(
        partnerCategoryService.listPartnerCategories(),
      ).rejects.toThrow();
    });
  });

  describe("getPartnerCategoryById()", () => {
    it("returns a single partner category by ID", async () => {
      const result =
        await partnerCategoryService.getPartnerCategoryById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.name).toBe("Supplier");
    });
  });

  describe("createPartnerCategory()", () => {
    it("creates a partner category and returns the created record", async () => {
      const payload = {
        name: "Supplier",
        isActive: true,
      };
      const result =
        await partnerCategoryService.createPartnerCategory(payload);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.name).toBe("Supplier");
    });
  });

  describe("updatePartnerCategory()", () => {
    it("updates a partner category and returns the updated record", async () => {
      const payload = {
        name: "Supplier Updated",
        isActive: true,
      };
      const result =
        await partnerCategoryService.updatePartnerCategory(1, payload);

      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deletePartnerCategory()", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("deletes a partner category successfully", async () => {
      const result =
        await partnerCategoryService.deletePartnerCategory(1);

      expect(result.status).toBe("SUCCESS");
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.delete(`${BASE}/master/partner/category/:id`, () =>
          HttpResponse.json(
            { message: "Not Found" },
            { status: 404 },
          ),
        ),
      );

      await expect(
        partnerCategoryService.deletePartnerCategory(999),
      ).rejects.toThrow();
    });
  });
});
