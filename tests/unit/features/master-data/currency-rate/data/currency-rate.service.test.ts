import { currencyRateService } from "@/features/master-data/currency-rate/data/currency-rate.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

const BASE = "http://localhost:3000";

describe("currencyRateService", () => {
  describe("listCurrencyRates()", () => {
    it("returns paged currency rate data on success", async () => {
      const result = await currencyRateService.listCurrencyRates({ page: 1, size: 10 });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(2);
      expect(result.data?.content[0].currencyCode).toBe("USD");
      expect(result.data?.pagination.total).toBe(2);
    });

    it("forwards pagination params to the request", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/currency-rate`, ({ request }) => {
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

      await currencyRateService.listCurrencyRates({
        page: 2,
        size: 5,
        search: "USD",
        rateType: "KMK",
      });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("page")).toBe("2");
      expect(capturedUrl.searchParams.get("size")).toBe("5");
      expect(capturedUrl.searchParams.get("search")).toBe("USD");
      expect(capturedUrl.searchParams.get("rateType")).toBe("KMK");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/currency-rate`, () => {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          );
        }),
      );

      await expect(currencyRateService.listCurrencyRates()).rejects.toThrow();
    });
  });

  describe("getCurrencyRateById()", () => {
    it("returns a single currency rate by ID", async () => {
      const result = await currencyRateService.getCurrencyRateById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.currencyCode).toBe("USD");
    });

    it("throws when currency rate not found", async () => {
      server.use(
        http.get(`${BASE}/master/currency-rate/999`, () => {
          return HttpResponse.json(
            { message: "Currency rate not found" },
            { status: 404 },
          );
        }),
      );

      await expect(currencyRateService.getCurrencyRateById(999)).rejects.toThrow();
    });
  });

  describe("getCurrencyRatesByCurrency()", () => {
    it("returns rates for a currency code", async () => {
      const result = await currencyRateService.getCurrencyRatesByCurrency("USD");

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(2);
      expect(result.data?.[0].currencyCode).toBe("USD");
    });
  });

  describe("getCurrencyRatesByType()", () => {
    it("returns rates by currency code and rate type", async () => {
      const result = await currencyRateService.getCurrencyRatesByType("USD", "KMK");

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(2);
    });
  });

  describe("getLatestRatesByRateType()", () => {
    it("returns latest rates by rate type", async () => {
      const result = await currencyRateService.getLatestRatesByRateType("KMK");

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(2);
    });
  });

  describe("getRateAtDate()", () => {
    it("returns rate at specific date", async () => {
      const result = await currencyRateService.getRateAtDate("USD", "KMK", "2024-06-01");

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
    });
  });

  describe("getLatestRate()", () => {
    it("returns latest rate for currency and type", async () => {
      const result = await currencyRateService.getLatestRate("USD", "KMK");

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
    });
  });

  describe("createCurrencyRate()", () => {
    it("creates a currency rate and returns the created record", async () => {
      const payload = {
        currencyCode: "USD",
        rateType: "KMK",
        rate: 15500.5,
        startDate: "2024-01-01",
        description: "Test rate",
      };
      const result = await currencyRateService.createCurrencyRate(payload);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.currencyCode).toBe("USD");
    });

    it("creates a rate with optional endDate", async () => {
      const payload = {
        currencyCode: "EUR",
        rateType: "BI",
        rate: 16800.0,
        startDate: "2024-06-01",
        endDate: "2024-12-31",
      };
      const result = await currencyRateService.createCurrencyRate(payload);

      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("updateCurrencyRate()", () => {
    it("updates a currency rate and returns the updated record", async () => {
      const payload = {
        currencyCode: "USD",
        rateType: "KMK",
        rate: 15600.0,
        startDate: "2024-01-01",
      };
      const result = await currencyRateService.updateCurrencyRate(1, payload);

      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deleteCurrencyRate()", () => {
    it("deletes a currency rate successfully", async () => {
      const result = await currencyRateService.deleteCurrencyRate(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.message).toBe("Currency rate deleted successfully");
    });

    it("throws when currency rate not found", async () => {
      server.use(
        http.delete(`${BASE}/master/currency-rate/999`, () => {
          return HttpResponse.json(
            { message: "Currency rate not found" },
            { status: 404 },
          );
        }),
      );

      await expect(currencyRateService.deleteCurrencyRate(999)).rejects.toThrow();
    });
  });

  describe("syncCurrencyRates()", () => {
    it("syncs currency rates successfully", async () => {
      const result = await currencyRateService.syncCurrencyRates();

      expect(result.status).toBe("SUCCESS");
      expect(result.message).toBe("Rates synced successfully");
    });
  });
});
