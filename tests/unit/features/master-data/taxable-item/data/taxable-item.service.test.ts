import { taxableItemService } from "@/features/master-data/taxable-item/data/taxable-item.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const BASE = "http://localhost:3000";

describe("taxableItemService", () => {
  describe("listTaxableItems()", () => {
    it("returns paged taxable item data on success", async () => {
      const result = await taxableItemService.listTaxableItems({
        page: 1,
        size: 10,
      });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data?.content[0].code).toBe("GOODS-001");
      expect(result.data?.pagination.total).toBe(1);
    });

    it("forwards pagination params to the request", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/taxable-item`, ({ request }) => {
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

      await taxableItemService.listTaxableItems({
        page: 2,
        size: 5,
        search: "ELECTRONIC",
      });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("page")).toBe("2");
      expect(capturedUrl.searchParams.get("size")).toBe("5");
      expect(capturedUrl.searchParams.get("search")).toBe("ELECTRONIC");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/taxable-item`, () =>
          HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          ),
        ),
      );

      await expect(taxableItemService.listTaxableItems()).rejects.toThrow();
    });
  });

  describe("getTaxableItemById()", () => {
    it("returns a single taxable item by ID", async () => {
      const result = await taxableItemService.getTaxableItemById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.name).toBe("Electronic Goods");
    });
  });

  describe("getTaxableItemsByParent()", () => {
    it("returns child items by parent ID", async () => {
      const result = await taxableItemService.getTaxableItemsByParent(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(2);
    });
  });

  describe("createTaxableItem()", () => {
    it("creates a taxable item and returns the created record", async () => {
      const payload = {
        name: "New Item",
        type: "GOODS" as const,
        isActive: true,
      };
      const result = await taxableItemService.createTaxableItem(payload);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.code).toBe("GOODS-001");
    });
  });

  describe("updateTaxableItem()", () => {
    it("updates a taxable item and returns the updated record", async () => {
      const payload = {
        name: "Updated Item",
        type: "GOODS" as const,
        isActive: true,
      };
      const result = await taxableItemService.updateTaxableItem(1, payload);

      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deleteTaxableItem()", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("deletes a taxable item successfully", async () => {
      const result = await taxableItemService.deleteTaxableItem(1);
      expect(result.status).toBe("SUCCESS");
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.delete(`${BASE}/master/taxable-item/:id`, () =>
          HttpResponse.json({ message: "Not Found" }, { status: 404 }),
        ),
      );

      await expect(taxableItemService.deleteTaxableItem(999)).rejects.toThrow();
    });
  });

  describe("listTaxableItemRows()", () => {
    it("returns paged rows data", async () => {
      const result = await taxableItemService.listTaxableItemRows({
        page: 1,
        size: 10,
      });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data?.content[0].level1?.name).toBe("Electronic Goods");
    });
  });

  describe("getTaxableItemTree()", () => {
    it("returns tree structure", async () => {
      const result = await taxableItemService.getTaxableItemTree();

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe("Electronic Goods");
    });
  });

  describe("getTaxableItemsByLevel2/3/4()", () => {
    it("returns level 2 children", async () => {
      const result = await taxableItemService.getTaxableItemsByLevel2(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(2);
    });

    it("returns level 3 children", async () => {
      const result = await taxableItemService.getTaxableItemsByLevel3(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(2);
    });

    it("returns level 4 children", async () => {
      const result = await taxableItemService.getTaxableItemsByLevel4(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(2);
    });
  });

  describe("listParentTaxableItems()", () => {
    it("returns parent taxable items without search", async () => {
      const result = await taxableItemService.listParentTaxableItems();
      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(2);
    });

    it("forwards search param when provided", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/taxable-item/parent/list`, ({ request }) => {
          capturedUrls.push(new URL(request.url));
          return HttpResponse.json({
            status: "SUCCESS",
            message: "ok",
            data: [],
          });
        }),
      );

      await taxableItemService.listParentTaxableItems("ELECTRONIC");

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("search")).toBe("ELECTRONIC");
    });
  });

  describe("getByIds()", () => {
    it("returns taxable items by IDs", async () => {
      const result = await taxableItemService.getByIds([1, 2]);

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(2);
    });

    it("forwards ids param", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/taxable-item/ids`, ({ request }) => {
          capturedUrls.push(new URL(request.url));
          return HttpResponse.json({
            status: "SUCCESS",
            message: "ok",
            data: [],
          });
        }),
      );

      await taxableItemService.getByIds([1, 2, 3]);

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("ids")).toBe("1,2,3");
    });
  });
});
