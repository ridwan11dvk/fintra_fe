import { companyTaxService } from "@/features/master-data/company-tax/data/company-tax.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const BASE = "http://localhost:3000";

describe("companyTaxService", () => {
  describe("listCompanyTaxes()", () => {
    it("returns paged company tax data on success", async () => {
      const result = await companyTaxService.listCompanyTaxes({
        page: 1,
        size: 10,
      });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data?.content[0].companyCode).toBe("PT. ABC");
      expect(result.data?.pagination.total).toBe(1);
    });

    it("forwards pagination params to the request", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/company-tax`, ({ request }) => {
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

      await companyTaxService.listCompanyTaxes({
        page: 2,
        size: 5,
        search: "PT. ABC",
      });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("page")).toBe("2");
      expect(capturedUrl.searchParams.get("size")).toBe("5");
      expect(capturedUrl.searchParams.get("search")).toBe("PT. ABC");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/company-tax`, () =>
          HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          ),
        ),
      );

      await expect(companyTaxService.listCompanyTaxes()).rejects.toThrow();
    });
  });

  describe("getCompanyTaxById()", () => {
    it("returns a single company tax by ID", async () => {
      const result = await companyTaxService.getCompanyTaxById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.companyCode).toBe("PT. ABC");
    });
  });

  describe("createCompanyTax()", () => {
    it("creates a company tax and returns the created record", async () => {
      const payload = {
        companyCode: "PT. ABC",
        taxRateId: 1,
        startDate: "2024-01-01",
      };
      const result = await companyTaxService.createCompanyTax(payload);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.companyCode).toBe("PT. ABC");
    });
  });

  describe("updateCompanyTax()", () => {
    it("updates a company tax and returns the updated record", async () => {
      const payload = {
        companyCode: "PT. ABC",
        taxRateId: 1,
        startDate: "2024-01-01",
      };
      const result = await companyTaxService.updateCompanyTax(1, payload);

      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deleteCompanyTax()", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("deletes a company tax successfully", async () => {
      const result = await companyTaxService.deleteCompanyTax(1);
      expect(result.status).toBe("SUCCESS");
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.delete(`${BASE}/master/company-tax/:id`, () =>
          HttpResponse.json({ message: "Not Found" }, { status: 404 }),
        ),
      );

      await expect(companyTaxService.deleteCompanyTax(999)).rejects.toThrow();
    });
  });
});
