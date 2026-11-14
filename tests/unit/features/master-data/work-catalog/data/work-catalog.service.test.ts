import { workCatalogService } from "@/features/master-data/work-catalog/data/work-catalog.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

const BASE = "http://localhost:3000";

const requestPayload = {
  workType: "Pengangkutan",
  subCategoryId: 1,
  groupCategoryId: 1,
  mainCategoryId: 1,
  cashflowCategoryId: 1,
  procurementSchemaId: 1,
  description: "Jasa angkut barang",
  taxes: [
    { taxSubject: "BADAN_USAHA" as const, taxRateId: 1 },
    { taxSubject: "PERORANGAN" as const, taxRateId: 2 },
  ],
};

describe("workCatalogService", () => {
  describe("listWorkCatalogs()", () => {
    it("returns paged work catalog data", async () => {
      const result = await workCatalogService.listWorkCatalogs({
        page: 1,
        size: 10,
      });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data?.content[0].workType).toBe("Pengangkutan");
      expect(result.data?.pagination.total).toBe(1);
    });

    it("forwards pagination params", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/work-catalog`, ({ request }) => {
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

      await workCatalogService.listWorkCatalogs({
        page: 2,
        size: 5,
        search: "angkut",
      });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("page")).toBe("2");
      expect(capturedUrl.searchParams.get("size")).toBe("5");
      expect(capturedUrl.searchParams.get("search")).toBe("angkut");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/work-catalog`, () =>
          HttpResponse.json({ message: "Internal Server Error" }, { status: 500 }),
        ),
      );

      await expect(workCatalogService.listWorkCatalogs()).rejects.toThrow();
    });

    it("returns ERROR envelope payload from the API without throwing", async () => {
      server.use(
        http.get(`${BASE}/master/work-catalog`, () =>
          HttpResponse.json({
            status: "ERROR",
            message: "Work catalog unavailable",
          }),
        ),
      );

      const result = await workCatalogService.listWorkCatalogs();

      expect(result.status).toBe("ERROR");
      expect(result.message).toBe("Work catalog unavailable");
    });
  });

  describe("getActiveWorkCatalogs()", () => {
    it("returns active work catalogs", async () => {
      const result = await workCatalogService.getActiveWorkCatalogs();

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(1);
      expect(result.data?.[0].isActive).toBe(true);
    });
  });

  describe("getWorkCatalogsByCompanyAndBA()", () => {
    it("requests the company and business area path", async () => {
      let requestUrl = "";

      server.use(
        http.get(
          `${BASE}/master/work-catalog/company/:companyCode/ba/:baCode`,
          ({ request }) => {
            requestUrl = request.url;
            return HttpResponse.json({
              status: "SUCCESS",
              message: "ok",
              data: [],
            });
          },
        ),
      );

      const result = await workCatalogService.getWorkCatalogsByCompanyAndBA(
        "KAI",
        "BA01",
      );

      expect(result.status).toBe("SUCCESS");
      expect(requestUrl).toContain("/master/work-catalog/company/KAI/ba/BA01");
    });
  });

  describe("getWorkCatalogById()", () => {
    it("returns one work catalog", async () => {
      const result = await workCatalogService.getWorkCatalogById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.taxes).toHaveLength(2);
    });
  });

  describe("createWorkCatalog()", () => {
    it("posts the work catalog payload", async () => {
      let body: unknown;

      server.use(
        http.post(`${BASE}/master/work-catalog`, async ({ request }) => {
          body = await request.json();
          return HttpResponse.json(
            {
              status: "SUCCESS",
              message: "created",
              data: { id: 1 },
            },
            { status: 201 },
          );
        }),
      );

      const result = await workCatalogService.createWorkCatalog(requestPayload);

      expect(result.status).toBe("SUCCESS");
      expect(body).toEqual(requestPayload);
    });
  });

  describe("updateWorkCatalog()", () => {
    it("puts the payload to the record url", async () => {
      let requestUrl = "";
      let body: unknown;

      server.use(
        http.put(`${BASE}/master/work-catalog/:id`, async ({ request }) => {
          requestUrl = request.url;
          body = await request.json();
          return HttpResponse.json({
            status: "SUCCESS",
            message: "updated",
            data: { id: 4 },
          });
        }),
      );

      const result = await workCatalogService.updateWorkCatalog(
        4,
        requestPayload,
      );

      expect(result.status).toBe("SUCCESS");
      expect(requestUrl).toContain("/master/work-catalog/4");
      expect(body).toEqual(requestPayload);
    });
  });

  describe("deleteWorkCatalog()", () => {
    it("deletes a work catalog", async () => {
      const result = await workCatalogService.deleteWorkCatalog(1);

      expect(result.status).toBe("SUCCESS");
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.delete(`${BASE}/master/work-catalog/:id`, () =>
          HttpResponse.json({ message: "Not Found" }, { status: 404 }),
        ),
      );

      await expect(workCatalogService.deleteWorkCatalog(999)).rejects.toThrow();
    });
  });

  describe("activateWorkCatalog()", () => {
    it("patches the activate path", async () => {
      let requestUrl = "";

      server.use(
        http.patch(
          `${BASE}/master/work-catalog/:id/activate`,
          ({ request }) => {
            requestUrl = request.url;
            return HttpResponse.json({
              status: "SUCCESS",
              message: "activated",
              data: { id: 3, isActive: true },
            });
          },
        ),
      );

      const result = await workCatalogService.activateWorkCatalog(3);

      expect(result.status).toBe("SUCCESS");
      expect(requestUrl).toContain("/master/work-catalog/3/activate");
    });
  });

  describe("deactivateWorkCatalog()", () => {
    it("patches the deactivate path", async () => {
      let requestUrl = "";

      server.use(
        http.patch(
          `${BASE}/master/work-catalog/:id/deactivate`,
          ({ request }) => {
            requestUrl = request.url;
            return HttpResponse.json({
              status: "SUCCESS",
              message: "deactivated",
              data: { id: 3, isActive: false },
            });
          },
        ),
      );

      const result = await workCatalogService.deactivateWorkCatalog(3);

      expect(result.status).toBe("SUCCESS");
      expect(requestUrl).toContain("/master/work-catalog/3/deactivate");
    });
  });
});
