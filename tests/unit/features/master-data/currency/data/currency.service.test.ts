import { currencyService } from "@/features/master-data/currency/data/currency.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const BASE = "http://localhost:3000";

describe("currencyService", () => {
  describe("listCurrencies()", () => {
    it("returns paged currency data on success", async () => {
      const result = await currencyService.listCurrencies({
        page: 1,
        size: 10,
      });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data?.content[0].code).toBe("IDR");
      expect(result.data?.pagination.total).toBe(1);
    });

    it("forwards pagination params to the request", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/currency`, ({ request }) => {
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

      await currencyService.listCurrencies({
        page: 2,
        size: 5,
        search: "IDR",
      });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("page")).toBe("2");
      expect(capturedUrl.searchParams.get("size")).toBe("5");
      expect(capturedUrl.searchParams.get("search")).toBe("IDR");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/currency`, () =>
          HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          ),
        ),
      );

      await expect(currencyService.listCurrencies()).rejects.toThrow();
    });
  });

  describe("getCurrencyById()", () => {
    it("returns a single currency by ID", async () => {
      const result = await currencyService.getCurrencyById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.code).toBe("IDR");
    });

    it("throws when the server returns 404", async () => {
      await expect(currencyService.getCurrencyById(999)).rejects.toThrow();
    });
  });

  describe("getCurrenciesByCountry()", () => {
    it("returns currencies by country", async () => {
      const result = await currencyService.getCurrenciesByCountry(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(1);
      expect(result.data?.[0].code).toBe("IDR");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/currency/country/:countryId`, () =>
          HttpResponse.json(
            { message: "Server Error" },
            { status: 500 },
          ),
        ),
      );

      await expect(
        currencyService.getCurrenciesByCountry(1),
      ).rejects.toThrow();
    });
  });

  describe("getActiveCurrenciesByCountry()", () => {
    it("returns active currencies by country", async () => {
      const result = await currencyService.getActiveCurrenciesByCountry(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(1);
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(
          `${BASE}/master/currency/country/:countryId/active`,
          () =>
            HttpResponse.json(
              { message: "Server Error" },
              { status: 500 },
            ),
        ),
      );

      await expect(
        currencyService.getActiveCurrenciesByCountry(1),
      ).rejects.toThrow();
    });
  });

  describe("createCurrency()", () => {
    it("creates a currency and returns the created record", async () => {
      const payload = {
        countryId: 1,
        code: "IDR",
        name: "Indonesian Rupiah",
      };

      const result = await currencyService.createCurrency(payload);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.code).toBe("IDR");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.post(`${BASE}/master/currency`, () =>
          HttpResponse.json(
            { message: "Server Error" },
            { status: 500 },
          ),
        ),
      );

      await expect(
        currencyService.createCurrency({
          countryId: 1,
          code: "IDR",
        }),
      ).rejects.toThrow();
    });
  });

  describe("updateCurrency()", () => {
    it("updates a currency and returns the updated record", async () => {
      const payload = {
        countryId: 1,
        code: "IDR",
        name: "Updated Rupiah",
      };

      const result = await currencyService.updateCurrency(1, payload);

      expect(result.status).toBe("SUCCESS");
    });

    it("throws when the server returns 422", async () => {
      server.use(
        http.put(`${BASE}/master/currency/:id`, () =>
          HttpResponse.json(
            { message: "Validation Error" },
            { status: 422 },
          ),
        ),
      );

      await expect(
        currencyService.updateCurrency(1, {
          countryId: 1,
          code: "IDR",
        }),
      ).rejects.toThrow();
    });
  });

  describe("deleteCurrency()", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("deletes a currency successfully", async () => {
      const result = await currencyService.deleteCurrency(1);
      expect(result.status).toBe("SUCCESS");
    });

    it("throws when the server returns 404", async () => {
      await expect(currencyService.deleteCurrency(999)).rejects.toThrow();
    });
  });

  describe("syncCurrencies()", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("syncs currencies successfully", async () => {
      const result = await currencyService.syncCurrencies();
      expect(result.status).toBe("SUCCESS");
      expect(result.message).toBe("Data synced successfully");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.post(`${BASE}/master/currency/sync`, () =>
          HttpResponse.json(
            { message: "Server Error" },
            { status: 500 },
          ),
        ),
      );

      await expect(currencyService.syncCurrencies()).rejects.toThrow();
    });
  });
});
