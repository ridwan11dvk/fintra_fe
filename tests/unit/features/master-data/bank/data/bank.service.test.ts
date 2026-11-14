import { bankService } from "@/features/master-data/bank/data/bank.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const BASE = "http://localhost:3000";

describe("bankService", () => {
  describe("listBanks()", () => {
    it("returns paged bank data on success", async () => {
      const result = await bankService.listBanks({ page: 1, size: 10 });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data?.content[0].code).toBe("BCA");
      expect(result.data?.pagination.total).toBe(1);
    });

    it("forwards pagination params to the request", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get("http://localhost:3000/master/bank", ({ request }) => {
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

      await bankService.listBanks({ page: 2, size: 5, search: "BCA" });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("page")).toBe("2");
      expect(capturedUrl.searchParams.get("size")).toBe("5");
      expect(capturedUrl.searchParams.get("search")).toBe("BCA");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get("http://localhost:3000/master/bank", () => {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          );
        }),
      );

      await expect(bankService.listBanks()).rejects.toThrow();
    });
  });

  describe("getBankById()", () => {
    it("returns a single bank by ID", async () => {
      const result = await bankService.getBankById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.name).toBe("Bank Central Asia");
    });
  });

  describe("createBank()", () => {
    it("creates a bank and returns the created record", async () => {
      const payload = {
        name: "Bank Central Asia",
        code: "BCA",
        isActive: true,
      };
      const result = await bankService.createBank(payload);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.code).toBe("BCA");
    });
  });

  describe("updateBank()", () => {
    it("updates a bank and returns the updated record", async () => {
      const payload = {
        name: "Bank Central Asia Updated",
        code: "BCA",
        isActive: true,
      };
      const result = await bankService.updateBank(1, payload);

      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deleteBank()", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => { });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("deletes a bank successfully", async () => {
      const result = await bankService.deleteBank(1);
      expect(result.status).toBe("SUCCESS");
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.delete(`${BASE}/master/bank/:id`, () =>
          HttpResponse.json({ message: "Not Found" }, { status: 404 }),
        ),
      );

      await expect(bankService.deleteBank(999)).rejects.toThrow();
    });
  });

  describe("exportBanks()", () => {
    it("returns a Blob on success", async () => {
      const result = await bankService.exportBanks();
      expect(result).toBeInstanceOf(Blob);
    });

    it("sends search param when provided", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/bank/export`, ({ request }) => {
          capturedUrls.push(new URL(request.url));
          return new HttpResponse(new Blob(["excel"]), {
            headers: { "Content-Type": "application/vnd.ms-excel" },
          });
        }),
      );

      await bankService.exportBanks("BCA");

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("search")).toBe("BCA");
    });

    it("omits search param when not provided", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/bank/export`, ({ request }) => {
          capturedUrls.push(new URL(request.url));
          return new HttpResponse(new Blob(["excel"]), {
            headers: { "Content-Type": "application/vnd.ms-excel" },
          });
        }),
      );

      await bankService.exportBanks();

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("search")).toBeNull();
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/bank/export`, () =>
          HttpResponse.json({ message: "Server Error" }, { status: 500 }),
        ),
      );

      await expect(bankService.exportBanks()).rejects.toThrow();
    });
  });

  describe("downloadImportTemplate()", () => {
    it("returns a Blob on success", async () => {
      const result = await bankService.downloadImportTemplate();
      expect(result).toBeInstanceOf(Blob);
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/bank/import/template`, () =>
          HttpResponse.json({ message: "Server Error" }, { status: 500 }),
        ),
      );

      await expect(bankService.downloadImportTemplate()).rejects.toThrow();
    });
  });

  describe("importBanks()", () => {
    it("imports a file and returns import response", async () => {
      const file = new File(["content"], "banks.xlsx", {
        type: "application/vnd.ms-excel",
      });

      const result = await bankService.importBanks(file);

      expect(result.status).toBe("SUCCESS");
      expect(result.message).toBe("Import successful");
    });

    it("sends dryRun=true in FormData when specified", async () => {
      const appendSpy = vi.spyOn(FormData.prototype, "append");

      const file = new File(["content"], "banks.xlsx", {
        type: "application/vnd.ms-excel",
      });

      await bankService.importBanks(file, true);

      expect(appendSpy).toHaveBeenCalledWith("dryRun", "true");
      appendSpy.mockRestore();
    });

    it("sends dryRun=false in FormData when specified as false", async () => {
      const appendSpy = vi.spyOn(FormData.prototype, "append");

      const file = new File(["content"], "banks.xlsx", {
        type: "application/vnd.ms-excel",
      });

      await bankService.importBanks(file, false);

      expect(appendSpy).toHaveBeenCalledWith("dryRun", "false");
      appendSpy.mockRestore();
    });

    it("omits dryRun field when dryRun is undefined", async () => {
      const appendSpy = vi.spyOn(FormData.prototype, "append");

      const file = new File(["content"], "banks.xlsx", {
        type: "application/vnd.ms-excel",
      });

      await bankService.importBanks(file);

      expect(appendSpy).not.toHaveBeenCalledWith("dryRun", expect.anything());
      appendSpy.mockRestore();
    });

    it("throws when the server returns 422", async () => {
      server.use(
        http.post(`${BASE}/master/bank/import`, () =>
          HttpResponse.json(
            { message: "Unprocessable Entity" },
            { status: 422 },
          ),
        ),
      );

      const file = new File(["bad"], "banks.xlsx", {
        type: "application/vnd.ms-excel",
      });

      await expect(bankService.importBanks(file)).rejects.toThrow();
    });
  });
});
