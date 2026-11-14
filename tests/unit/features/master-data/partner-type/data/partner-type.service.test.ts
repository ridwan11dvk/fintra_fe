import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { partnerTypeService } from "@/features/master-data/partner-type/data/partner-type.service";

const BASE = "http://localhost:3000";

describe("partnerTypeService", () => {
  describe("listPartnerTypes()", () => {
    it("returns paged partner type data on success", async () => {
      const result = await partnerTypeService.listPartnerTypes();
      expect(result.status).toBe("SUCCESS");
      expect(result.data.content).toHaveLength(1);
      expect(result.data.content[0].name).toBe("Domestic Supplier");
    });

    it("forwards pagination params to the request", async () => {
      let capturedUrl = "";
      server.use(
        http.get(`${BASE}/master/partner/type`, ({ request }) => {
          capturedUrl = request.url;
          return HttpResponse.json({
            status: "SUCCESS",
            message: "OK",
            data: {
              content: [],
              pagination: {
                total: 0,
                pageSize: 25,
                pageNumber: 2,
                totalPages: 0,
                currentPage: 2,
                from: 26,
                to: 0,
              },
            },
          });
        }),
      );

      await partnerTypeService.listPartnerTypes({
        pageSize: 25,
        pageNumber: 2,
      });

      expect(capturedUrl).toContain("pageSize=25");
      expect(capturedUrl).toContain("pageNumber=2");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/partner/type`, () =>
          HttpResponse.json({ message: "Server error" }, { status: 500 }),
        ),
      );

      await expect(
        partnerTypeService.listPartnerTypes(),
      ).rejects.toThrow();
    });
  });

  describe("getPartnerTypeById()", () => {
    it("returns a single partner type by ID", async () => {
      const result = await partnerTypeService.getPartnerTypeById(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data.id).toBe(1);
      expect(result.data.code).toBe("DS");
    });
  });

  describe("getRootPartnerTypesByLegality()", () => {
    it("returns root partner types by legality id", async () => {
      const result =
        await partnerTypeService.getRootPartnerTypesByLegality(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(1);
      expect(result.data[0].partnerLegalityId).toBe(1);
    });
  });

  describe("getPartnerTypeSubtypes()", () => {
    it("returns partner type subtypes by parent id", async () => {
      const result = await partnerTypeService.getPartnerTypeSubtypes(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(1);
    });
  });

  describe("createPartnerType()", () => {
    it("creates a partner type and returns the created record", async () => {
      const result = await partnerTypeService.createPartnerType({
        code: "DS",
        name: "Domestic Supplier",
        partnerLegalityId: 1,
      });
      expect(result.status).toBe("SUCCESS");
      expect(result.data.code).toBe("DS");
    });
  });

  describe("updatePartnerType()", () => {
    it("updates a partner type and returns the updated record", async () => {
      const result = await partnerTypeService.updatePartnerType(1, {
        code: "IS",
        name: "International Supplier",
        partnerLegalityId: 1,
      });
      expect(result.status).toBe("SUCCESS");
      expect(result.data.id).toBe(1);
    });
  });

  describe("deletePartnerType()", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("deletes a partner type successfully", async () => {
      const result = await partnerTypeService.deletePartnerType(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.message).toBe("Data deleted successfully");
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.delete(`${BASE}/master/partner/type/:id`, () =>
          HttpResponse.json(
            { message: "Resource not found" },
            { status: 404 },
          ),
        ),
      );

      await expect(
        partnerTypeService.deletePartnerType(999),
      ).rejects.toThrow();
    });
  });
});
