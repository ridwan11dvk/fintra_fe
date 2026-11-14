import { glAccountService } from "@/features/master-data/general-ledger-account/data/gl-account.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const BASE = "http://localhost:3000";

describe("glAccountService", () => {
  describe("listGLAccounts()", () => {
    it("returns paged GL account data on success", async () => {
      const result = await glAccountService.listGLAccounts({
        page: 1,
        size: 10,
      });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data?.content[0].companyCode).toBe("COMP1");
      expect(result.data?.pagination.total).toBe(1);
    });

    it("forwards pagination params to the request", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/gl`, ({ request }) => {
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

      await glAccountService.listGLAccounts({
        page: 2,
        size: 5,
        search: "COMP1",
      });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("page")).toBe("2");
      expect(capturedUrl.searchParams.get("size")).toBe("5");
      expect(capturedUrl.searchParams.get("search")).toBe("COMP1");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/gl`, () =>
          HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          ),
        ),
      );

      await expect(glAccountService.listGLAccounts()).rejects.toThrow();
    });
  });

  describe("getGLAccountById()", () => {
    it("returns a single GL account by ID", async () => {
      const result = await glAccountService.getGLAccountById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.companyCode).toBe("COMP1");
    });
  });

  describe("getGLAccountsByCompanyCode()", () => {
    it("returns GL accounts by company code", async () => {
      const result = await glAccountService.getGLAccountsByCompanyCode("COMP1");

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(1);
      expect(result.data?.[0].companyCode).toBe("COMP1");
    });
  });

  describe("getGLAccountsByBACode()", () => {
    it("returns GL accounts by BA code", async () => {
      const result = await glAccountService.getGLAccountsByBACode("BA001");

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(1);
      expect(result.data?.[0].baCode).toBe("BA001");
    });
  });

  describe("createGLAccount()", () => {
    it("creates a GL account and returns the created record", async () => {
      const payload = {
        companyCode: "COMP1",
        baCode: "BA001",
        unitName: "Jakarta Finance",
        account: "61101",
        isActive: true,
      };
      const result = await glAccountService.createGLAccount(payload);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.companyCode).toBe("COMP1");
    });
  });

  describe("updateGLAccount()", () => {
    it("updates a GL account and returns the updated record", async () => {
      const payload = {
        companyCode: "COMP1",
        baCode: "BA001",
        unitName: "Jakarta Finance Updated",
        account: "61101",
        isActive: true,
      };
      const result = await glAccountService.updateGLAccount(1, payload);

      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deleteGLAccount()", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("deletes a GL account successfully", async () => {
      const result = await glAccountService.deleteGLAccount(1);
      expect(result.status).toBe("SUCCESS");
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.delete(`${BASE}/master/gl/:id`, () =>
          HttpResponse.json({ message: "Not Found" }, { status: 404 }),
        ),
      );

      await expect(glAccountService.deleteGLAccount(999)).rejects.toThrow();
    });
  });
});
