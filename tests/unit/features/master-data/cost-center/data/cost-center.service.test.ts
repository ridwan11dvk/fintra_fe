import { costCenterService } from "@/features/master-data/cost-center/data/cost-center.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const BASE = "http://localhost:3000";

describe("costCenterService", () => {
  describe("listCostCenters()", () => {
    it("returns paged cost center data on success", async () => {
      const result = await costCenterService.listCostCenters({
        page: 1,
        size: 10,
      });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data?.content[0].costCenterCode).toBe("CC-001");
      expect(result.data?.pagination.total).toBe(1);
    });

    it("forwards pagination params to the request", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/cost-center`, ({ request }) => {
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

      await costCenterService.listCostCenters({
        page: 2,
        size: 5,
        search: "CC-001",
      });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("page")).toBe("2");
      expect(capturedUrl.searchParams.get("size")).toBe("5");
      expect(capturedUrl.searchParams.get("search")).toBe("CC-001");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/cost-center`, () =>
          HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          ),
        ),
      );

      await expect(costCenterService.listCostCenters()).rejects.toThrow();
    });
  });

  describe("getActiveCostCenters()", () => {
    it("returns active cost centers on success", async () => {
      const result = await costCenterService.getActiveCostCenters();

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toBeDefined();
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/cost-center/active`, () =>
          HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          ),
        ),
      );

      await expect(
        costCenterService.getActiveCostCenters(),
      ).rejects.toThrow();
    });
  });

  describe("getCostCentersByCompanyAndBA()", () => {
    it("returns cost centers by company and BA", async () => {
      server.use(
        http.get(`${BASE}/master/cost-center/company/:companyCode/ba/:baCode`, () =>
          HttpResponse.json({
            status: "SUCCESS",
            message: "Data fetched successfully",
              data: [{
                id: 1,
                companyCode: "COMP001",
                baCode: "BA001",
                costCenterCode: "CC-001",
                costCenterName: "Test",
                startDate: "2024-01-01",
                endDate: null,
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
                createdBy: "admin",
                updatedBy: "admin",
              }],
          }),
        ),
      );

      const result =
        await costCenterService.getCostCentersByCompanyAndBA(
          "COMP001",
          "BA001",
        );

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(1);
      expect(result.data?.[0].companyCode).toBe("COMP001");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(
          `${BASE}/master/cost-center/company/:companyCode/ba/:baCode`,
          () =>
            HttpResponse.json(
              { message: "Server Error" },
              { status: 500 },
            ),
        ),
      );

      await expect(
        costCenterService.getCostCentersByCompanyAndBA("COMP001", "BA001"),
      ).rejects.toThrow();
    });
  });

  describe("getCostCentersByCompanyBAAndType()", () => {
    it("returns cost centers by company, BA and type", async () => {
      server.use(
        http.get(
          `${BASE}/master/cost-center/company/:companyCode/ba/:baCode/type/:type`,
          () =>
            HttpResponse.json({
              status: "SUCCESS",
              message: "Data fetched successfully",
              data: [{
                id: 1,
                companyCode: "COMP001",
                baCode: "BA001",
                costCenterCode: "CC-001",
                costCenterName: "Test",
                startDate: "2024-01-01",
                endDate: null,
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
                createdBy: "admin",
                updatedBy: "admin",
              }],
            }),
        ),
      );

      const result =
        await costCenterService.getCostCentersByCompanyBAAndType(
          "COMP001",
          "BA001",
          "BA",
        );

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(1);
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(
          `${BASE}/master/cost-center/company/:companyCode/ba/:baCode/type/:type`,
          () =>
            HttpResponse.json(
              { message: "Server Error" },
              { status: 500 },
            ),
        ),
      );

      await expect(
        costCenterService.getCostCentersByCompanyBAAndType(
          "COMP001",
          "BA001",
          "BA",
        ),
      ).rejects.toThrow();
    });
  });

  describe("getCostCenterById()", () => {
    it("returns a single cost center by ID", async () => {
      const result = await costCenterService.getCostCenterById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.costCenterName).toBe(
        "Jakarta Head Office Cost Center",
      );
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.get(`${BASE}/master/cost-center/:id`, () =>
          HttpResponse.json({ message: "Not Found" }, { status: 404 }),
        ),
      );

      await expect(costCenterService.getCostCenterById(999)).rejects.toThrow();
    });
  });

  describe("createCostCenter()", () => {
    it("creates a cost center and returns the created record", async () => {
      const payload = {
        companyCode: "COMP001",
        baCode: "BA001",
        costCenterCode: "CC-001",
        costCenterName: "New Cost Center",
      };

      const result = await costCenterService.createCostCenter(payload);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.costCenterCode).toBe("CC-001");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.post(`${BASE}/master/cost-center`, () =>
          HttpResponse.json(
            { message: "Server Error" },
            { status: 500 },
          ),
        ),
      );

      await expect(
        costCenterService.createCostCenter({
          companyCode: "COMP001",
          baCode: "BA001",
          costCenterCode: "CC-001",
          costCenterName: "Test",
        }),
      ).rejects.toThrow();
    });
  });

  describe("updateCostCenter()", () => {
    it("updates a cost center and returns the updated record", async () => {
      const payload = {
        companyCode: "COMP001",
        baCode: "BA001",
        costCenterCode: "CC-001",
        costCenterName: "Updated Cost Center",
      };

      const result = await costCenterService.updateCostCenter(1, payload);

      expect(result.status).toBe("SUCCESS");
    });

    it("throws when the server returns 422", async () => {
      server.use(
        http.put(`${BASE}/master/cost-center/:id`, () =>
          HttpResponse.json(
            { message: "Validation Error" },
            { status: 422 },
          ),
        ),
      );

      await expect(
        costCenterService.updateCostCenter(1, {
          companyCode: "COMP001",
          baCode: "BA001",
          costCenterCode: "CC-001",
          costCenterName: "Test",
        }),
      ).rejects.toThrow();
    });
  });

  describe("deleteCostCenter()", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("deletes a cost center successfully", async () => {
      const result = await costCenterService.deleteCostCenter(1);
      expect(result.status).toBe("SUCCESS");
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.delete(`${BASE}/master/cost-center/:id`, () =>
          HttpResponse.json({ message: "Not Found" }, { status: 404 }),
        ),
      );

      await expect(costCenterService.deleteCostCenter(999)).rejects.toThrow();
    });
  });
});
