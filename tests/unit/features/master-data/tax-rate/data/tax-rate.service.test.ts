import { describe, expect, it } from "vitest";
import { taxRateService } from "@/features/master-data/tax-rate/data/tax-rate.service";

describe("taxRateService", () => {
  describe("listTaxRates()", () => {
    it("returns paged tax rate data on success", async () => {
      const result = await taxRateService.listTaxRates();
      expect(result.status).toBe("SUCCESS");
      expect(result.data.content).toHaveLength(1);
    });

    it("forwards pagination params to the request", async () => {
      const result = await taxRateService.listTaxRates({
        pageSize: 10,
        pageNumber: 1,
      });
      expect(result.status).toBe("SUCCESS");
      expect(result.data.content).toBeDefined();
    });

    it("throws when the server returns 500", async () => {
      const { server } = await import("@tests/unit/mocks/server");
      const { http, HttpResponse } = await import("msw");
      server.use(
        http.get("http://localhost:3000/master/tax-rates", () =>
          HttpResponse.json(
            { message: "Server error" },
            { status: 500 },
          ),
        ),
      );
      await expect(taxRateService.listTaxRates()).rejects.toThrow();
    });
  });

  describe("getTaxRateById()", () => {
    it("returns a single tax rate by ID", async () => {
      const result = await taxRateService.getTaxRateById(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data.id).toBe(1);
    });

    it("throws when the tax rate is not found", async () => {
      await expect(taxRateService.getTaxRateById(999)).rejects.toThrow();
    });
  });

  describe("getTaxRateByCode()", () => {
    it("returns a single tax rate by code", async () => {
      const result = await taxRateService.getTaxRateByCode("PPN_17");
      expect(result.status).toBe("SUCCESS");
      expect(result.data.code).toBe("PPN_17");
    });

    it("throws when the tax rate is not found by code", async () => {
      await expect(
        taxRateService.getTaxRateByCode("NONEXISTENT"),
      ).rejects.toThrow();
    });
  });

  describe("createTaxRate()", () => {
    it("creates a tax rate and returns the created record", async () => {
      const result = await taxRateService.createTaxRate({
        code: "PPN_17",
        name: "PPN 17%",
        taxType: "PPN",
        ratePercent: 17,
        coefficientNumerator: 17,
        coefficientDenominator: 100,
        startDate: "2024-01-01",
      });
      expect(result.status).toBe("SUCCESS");
      expect(result.data.name).toBe("PPN 17%");
    });
  });

  describe("updateTaxRate()", () => {
    it("updates a tax rate and returns the updated record", async () => {
      const result = await taxRateService.updateTaxRate(1, {
        code: "PPN_17",
        name: "Updated Tax Rate",
        taxType: "PPN",
        ratePercent: 17,
        coefficientNumerator: 17,
        coefficientDenominator: 100,
        startDate: "2024-01-01",
      });
      expect(result.status).toBe("SUCCESS");
      expect(result.data.id).toBe(1);
    });
  });

  describe("deleteTaxRate()", () => {
    it("deletes a tax rate successfully", async () => {
      const result = await taxRateService.deleteTaxRate(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.message).toBe("Data deleted successfully");
    });

    it("throws when the server returns 404", async () => {
      await expect(taxRateService.deleteTaxRate(999)).rejects.toThrow();
    });
  });
});
