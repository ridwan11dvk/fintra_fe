import { countryService } from "@/features/master-data/country/data/country.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const BASE = "http://localhost:3000";

describe("countryService", () => {
  describe("listCountries()", () => {
    it("returns paged country data on success", async () => {
      const result = await countryService.listCountries({
        page: 1,
        size: 10,
      });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data?.content[0].name).toBe("Indonesia");
      expect(result.data?.pagination.total).toBe(1);
    });

    it("forwards pagination params to the request", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/country`, ({ request }) => {
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

      await countryService.listCountries({
        page: 2,
        size: 5,
        search: "Indonesia",
      });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("page")).toBe("2");
      expect(capturedUrl.searchParams.get("size")).toBe("5");
      expect(capturedUrl.searchParams.get("search")).toBe("Indonesia");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/country`, () =>
          HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          ),
        ),
      );

      await expect(countryService.listCountries()).rejects.toThrow();
    });
  });

  describe("getCountryById()", () => {
    it("returns a single country by ID", async () => {
      const result = await countryService.getCountryById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.name).toBe("Indonesia");
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.get(`${BASE}/master/country/:id`, () =>
          HttpResponse.json({ message: "Not Found" }, { status: 404 }),
        ),
      );

      await expect(countryService.getCountryById(999)).rejects.toThrow();
    });
  });

  describe("createCountry()", () => {
    it("creates a country and returns the created record", async () => {
      const payload = {
        name: "Indonesia",
        iso2Code: "ID",
        iso3Code: "IDN",
        dialCode: "+62",
      };

      const result = await countryService.createCountry(payload);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.name).toBe("Indonesia");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.post(`${BASE}/master/country`, () =>
          HttpResponse.json(
            { message: "Server Error" },
            { status: 500 },
          ),
        ),
      );

      await expect(
        countryService.createCountry({
          name: "Test",
        }),
      ).rejects.toThrow();
    });
  });

  describe("updateCountry()", () => {
    it("updates a country and returns the updated record", async () => {
      const payload = {
        name: "Updated Indonesia",
      };

      const result = await countryService.updateCountry(1, payload);

      expect(result.status).toBe("SUCCESS");
    });

    it("throws when the server returns 422", async () => {
      server.use(
        http.put(`${BASE}/master/country/:id`, () =>
          HttpResponse.json(
            { message: "Validation Error" },
            { status: 422 },
          ),
        ),
      );

      await expect(
        countryService.updateCountry(1, {
          name: "Test",
        }),
      ).rejects.toThrow();
    });
  });

  describe("deleteCountry()", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("deletes a country successfully", async () => {
      const result = await countryService.deleteCountry(1);
      expect(result.status).toBe("SUCCESS");
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.delete(`${BASE}/master/country/:id`, () =>
          HttpResponse.json({ message: "Not Found" }, { status: 404 }),
        ),
      );

      await expect(countryService.deleteCountry(999)).rejects.toThrow();
    });
  });
});
