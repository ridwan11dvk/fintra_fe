import { businessAreaService } from "@/features/master-data/business-area/data/business-area.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

const BASE = "http://localhost:3000";

describe("businessAreaService", () => {
  describe("listBusinessAreas()", () => {
    it("returns paged business area data on success", async () => {
      const result = await businessAreaService.listBusinessAreas({
        page: 1,
        size: 10,
      });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data?.content[0].baCode).toBe("BA-JKT-01");
    });

    it("forwards pagination params to the request", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/business-area`, ({ request }) => {
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

      await businessAreaService.listBusinessAreas({
        page: 2,
        size: 5,
        search: "Jakarta",
      });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("page")).toBe("2");
      expect(capturedUrl.searchParams.get("size")).toBe("5");
      expect(capturedUrl.searchParams.get("search")).toBe("Jakarta");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/business-area`, () =>
          HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          ),
        ),
      );

      await expect(businessAreaService.listBusinessAreas()).rejects.toThrow();
    });
  });

  describe("getBusinessAreaById()", () => {
    it("returns a single business area by ID", async () => {
      const result = await businessAreaService.getBusinessAreaById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.name).toBe("Business Area Jakarta");
    });
  });

  describe("getBusinessAreaByCode()", () => {
    it("returns a single business area by code", async () => {
      const result =
        await businessAreaService.getBusinessAreaByCode("BA-JKT-01");

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.baCode).toBe("BA-JKT-01");
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.get(`${BASE}/master/business-area/code/:baCode`, () =>
          HttpResponse.json({ message: "Not Found" }, { status: 404 }),
        ),
      );

      await expect(
        businessAreaService.getBusinessAreaByCode("MISSING"),
      ).rejects.toThrow();
    });
  });

  describe("createBusinessArea()", () => {
    it("creates a business area and returns the created record", async () => {
      const result = await businessAreaService.createBusinessArea({
        companyCode: "PTABC",
        name: "Business Area Jakarta",
        baCode: "BA-JKT-01",
      });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.baCode).toBe("BA-JKT-01");
    });
  });

  describe("updateBusinessArea()", () => {
    it("updates a business area and returns the updated record", async () => {
      const result = await businessAreaService.updateBusinessArea(1, {
        companyCode: "PTABC",
        name: "Business Area Jakarta Updated",
        baCode: "BA-JKT-01",
      });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.name).toBe("Business Area Jakarta");
    });
  });

  describe("deleteBusinessArea()", () => {
    it("deletes a business area successfully", async () => {
      const result = await businessAreaService.deleteBusinessArea(1);

      expect(result.status).toBe("SUCCESS");
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.delete(`${BASE}/master/business-area/:id`, () =>
          HttpResponse.json({ message: "Not Found" }, { status: 404 }),
        ),
      );

      await expect(
        businessAreaService.deleteBusinessArea(999),
      ).rejects.toThrow();
    });
  });

  describe("exportBusinessAreas()", () => {
    it("returns a Blob on success", async () => {
      const result = await businessAreaService.exportBusinessAreas();

      expect(result).toBeInstanceOf(Blob);
    });

    it("sends search param when provided", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/business-area/export`, ({ request }) => {
          capturedUrls.push(new URL(request.url));
          return new HttpResponse(
            new Blob(["excel"], { type: "application/vnd.ms-excel" }),
            {
              headers: { "Content-Type": "application/vnd.ms-excel" },
            },
          );
        }),
      );

      await businessAreaService.exportBusinessAreas("Jakarta");

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("search")).toBe("Jakarta");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/business-area/export`, () =>
          HttpResponse.json({ message: "Server Error" }, { status: 500 }),
        ),
      );

      await expect(businessAreaService.exportBusinessAreas()).rejects.toThrow();
    });
  });

  describe("downloadImportTemplate()", () => {
    it("returns a Blob on success", async () => {
      const result = await businessAreaService.downloadImportTemplate();

      expect(result).toBeInstanceOf(Blob);
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/business-area/import/template`, () =>
          HttpResponse.json({ message: "Server Error" }, { status: 500 }),
        ),
      );

      await expect(
        businessAreaService.downloadImportTemplate(),
      ).rejects.toThrow();
    });
  });

  describe("importBusinessAreas()", () => {
    it("imports a file and returns import response", async () => {
      const file = new File(["content"], "business-areas.xlsx", {
        type: "application/vnd.ms-excel",
      });

      const result = await businessAreaService.importBusinessAreas(file);

      expect(result.status).toBe("SUCCESS");
      expect(result.message).toBe("Import successful");
    });

    it("sends dryRun=true in FormData when specified", async () => {
      const appendSpy = vi.spyOn(FormData.prototype, "append");
      const file = new File(["content"], "business-areas.xlsx", {
        type: "application/vnd.ms-excel",
      });

      await businessAreaService.importBusinessAreas(file, true);

      expect(appendSpy).toHaveBeenCalledWith("dryRun", "true");
      appendSpy.mockRestore();
    });

    it("throws when the server returns 422", async () => {
      server.use(
        http.post(`${BASE}/master/business-area/import`, () =>
          HttpResponse.json(
            { message: "Unprocessable Entity" },
            { status: 422 },
          ),
        ),
      );

      const file = new File(["bad"], "business-areas.xlsx", {
        type: "application/vnd.ms-excel",
      });

      await expect(
        businessAreaService.importBusinessAreas(file),
      ).rejects.toThrow();
    });
  });
});
