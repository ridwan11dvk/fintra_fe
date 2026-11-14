import { houseBankService } from "@/features/master-data/house-bank/data/house-bank.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const BASE = "http://localhost:3000";

describe("houseBankService", () => {
  describe("listHouseBanks()", () => {
    it("returns paged house bank data on success", async () => {
      const result = await houseBankService.listHouseBanks({ page: 1, size: 10 });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data?.content[0].bankCode).toBe("BCA");
      expect(result.data?.pagination.total).toBe(1);
    });

    it("forwards pagination params to the request", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get("http://localhost:3000/master/house-bank", ({ request }) => {
          capturedUrls.push(new URL(request.url));
          return HttpResponse.json({
            status: "SUCCESS",
            message: "ok",
            data: {
              content: [],
              pagination: { total: 0, pageSize: 5, pageNumber: 2, totalPages: 0, currentPage: 2, from: 0, to: 0 },
            },
          });
        }),
      );

      await houseBankService.listHouseBanks({ page: 2, size: 5, search: "BCA" });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("page")).toBe("2");
      expect(capturedUrl.searchParams.get("size")).toBe("5");
      expect(capturedUrl.searchParams.get("search")).toBe("BCA");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get("http://localhost:3000/master/house-bank", () =>
          HttpResponse.json({ message: "Internal Server Error" }, { status: 500 }),
        ),
      );

      await expect(houseBankService.listHouseBanks()).rejects.toThrow();
    });
  });

  describe("getHouseBankById()", () => {
    it("returns a single house bank by ID", async () => {
      const result = await houseBankService.getHouseBankById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.accountName).toBe("PT Fintra - BCA Operasional");
    });
  });

  describe("createHouseBank()", () => {
    it("creates a house bank and returns the created record", async () => {
      const payload = {
        bankCode: "BCA",
        companyCode: "FINTRA",
        currencyCode: "IDR",
        accountId: "HB-BCA-001",
        accountNumber: "1234567890",
        accountName: "PT Fintra - BCA Operasional",
      };
      const result = await houseBankService.createHouseBank(payload);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.bankCode).toBe("BCA");
    });
  });

  describe("updateHouseBank()", () => {
    it("updates a house bank and returns the updated record", async () => {
      const payload = {
        bankCode: "BCA",
        companyCode: "FINTRA",
        currencyCode: "IDR",
        accountId: "HB-BCA-001",
        accountNumber: "1234567890",
        accountName: "PT Fintra - BCA Operasional Updated",
      };
      const result = await houseBankService.updateHouseBank(1, payload);

      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deleteHouseBank()", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("deletes a house bank successfully", async () => {
      const result = await houseBankService.deleteHouseBank(1);
      expect(result.status).toBe("SUCCESS");
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.delete(`${BASE}/master/house-bank/:id`, () =>
          HttpResponse.json({ message: "Not Found" }, { status: 404 }),
        ),
      );

      await expect(houseBankService.deleteHouseBank(999)).rejects.toThrow();
    });
  });

  describe("exportHouseBanks()", () => {
    it("returns a Blob on success", async () => {
      const result = await houseBankService.exportHouseBanks();
      expect(result).toBeInstanceOf(Blob);
    });

    it("sends search param when provided", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/house-bank/export`, ({ request }) => {
          capturedUrls.push(new URL(request.url));
          return new HttpResponse(new Blob(["excel"]), {
            headers: { "Content-Type": "application/vnd.ms-excel" },
          });
        }),
      );

      await houseBankService.exportHouseBanks("BCA");

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("search")).toBe("BCA");
    });

    it("omits search param when not provided", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/house-bank/export`, ({ request }) => {
          capturedUrls.push(new URL(request.url));
          return new HttpResponse(new Blob(["excel"]), {
            headers: { "Content-Type": "application/vnd.ms-excel" },
          });
        }),
      );

      await houseBankService.exportHouseBanks();

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("search")).toBeNull();
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/house-bank/export`, () =>
          HttpResponse.json({ message: "Server Error" }, { status: 500 }),
        ),
      );

      await expect(houseBankService.exportHouseBanks()).rejects.toThrow();
    });
  });

  describe("downloadImportTemplate()", () => {
    it("returns a Blob on success", async () => {
      const result = await houseBankService.downloadImportTemplate();
      expect(result).toBeInstanceOf(Blob);
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/house-bank/import/template`, () =>
          HttpResponse.json({ message: "Server Error" }, { status: 500 }),
        ),
      );

      await expect(houseBankService.downloadImportTemplate()).rejects.toThrow();
    });
  });

  describe("importHouseBanks()", () => {
    it("imports a file and returns import response", async () => {
      const file = new File(["content"], "house_banks.xlsx", {
        type: "application/vnd.ms-excel",
      });

      const result = await houseBankService.importHouseBanks(file);

      expect(result.status).toBe("SUCCESS");
      expect(result.message).toBe("Import successful");
    });

    it("sends dryRun=true in FormData when specified", async () => {
      const appendSpy = vi.spyOn(FormData.prototype, "append");

      const file = new File(["content"], "house_banks.xlsx", {
        type: "application/vnd.ms-excel",
      });

      await houseBankService.importHouseBanks(file, true);

      expect(appendSpy).toHaveBeenCalledWith("dryRun", "true");
      appendSpy.mockRestore();
    });

    it("sends dryRun=false in FormData when specified as false", async () => {
      const appendSpy = vi.spyOn(FormData.prototype, "append");

      const file = new File(["content"], "house_banks.xlsx", {
        type: "application/vnd.ms-excel",
      });

      await houseBankService.importHouseBanks(file, false);

      expect(appendSpy).toHaveBeenCalledWith("dryRun", "false");
      appendSpy.mockRestore();
    });

    it("omits dryRun field when dryRun is undefined", async () => {
      const appendSpy = vi.spyOn(FormData.prototype, "append");

      const file = new File(["content"], "house_banks.xlsx", {
        type: "application/vnd.ms-excel",
      });

      await houseBankService.importHouseBanks(file);

      expect(appendSpy).not.toHaveBeenCalledWith("dryRun", expect.anything());
      appendSpy.mockRestore();
    });

    it("throws when the server returns 422", async () => {
      server.use(
        http.post(`${BASE}/master/house-bank/import`, () =>
          HttpResponse.json({ message: "Unprocessable Entity" }, { status: 422 }),
        ),
      );

      const file = new File(["bad"], "house_banks.xlsx", {
        type: "application/vnd.ms-excel",
      });

      await expect(houseBankService.importHouseBanks(file)).rejects.toThrow();
    });
  });
});
