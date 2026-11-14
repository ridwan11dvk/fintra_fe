import { partnerClassificationService } from "@/features/master-data/partner-classification/data/partner-classification.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const BASE = "http://localhost:3000";

describe("partnerClassificationService", () => {
  describe("listPartnerClassifications()", () => {
    it("returns paged partner classification data on success", async () => {
      const result =
        await partnerClassificationService.listPartnerClassifications({
          page: 1,
          size: 10,
        });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data?.content[0].name).toBe("Distributor");
      expect(result.data?.pagination.total).toBe(1);
    });

    it("forwards pagination params to the request", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(
          "http://localhost:3000/master/partner/classification",
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

      await partnerClassificationService.listPartnerClassifications({
        page: 2,
        size: 5,
        search: "Distributor",
      });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("page")).toBe("2");
      expect(capturedUrl.searchParams.get("size")).toBe("5");
      expect(capturedUrl.searchParams.get("search")).toBe("Distributor");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(
          "http://localhost:3000/master/partner/classification",
          () =>
            HttpResponse.json(
              { message: "Internal Server Error" },
              { status: 500 },
            ),
        ),
      );

      await expect(
        partnerClassificationService.listPartnerClassifications(),
      ).rejects.toThrow();
    });
  });

  describe("getPartnerClassificationById()", () => {
    it("returns a single partner classification by ID", async () => {
      const result =
        await partnerClassificationService.getPartnerClassificationById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.name).toBe("Distributor");
    });
  });

  describe("createPartnerClassification()", () => {
    it("creates a partner classification and returns the created record", async () => {
      const payload = {
        name: "Distributor",
        isActive: true,
      };
      const result =
        await partnerClassificationService.createPartnerClassification(
          payload,
        );

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.name).toBe("Distributor");
    });
  });

  describe("updatePartnerClassification()", () => {
    it("updates a partner classification and returns the updated record", async () => {
      const payload = {
        name: "Distributor Updated",
        isActive: true,
      };
      const result =
        await partnerClassificationService.updatePartnerClassification(
          1,
          payload,
        );

      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deletePartnerClassification()", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("deletes a partner classification successfully", async () => {
      const result =
        await partnerClassificationService.deletePartnerClassification(1);

      expect(result.status).toBe("SUCCESS");
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.delete(`${BASE}/master/partner/classification/:id`, () =>
          HttpResponse.json(
            { message: "Not Found" },
            { status: 404 },
          ),
        ),
      );

      await expect(
        partnerClassificationService.deletePartnerClassification(999),
      ).rejects.toThrow();
    });
  });
});
