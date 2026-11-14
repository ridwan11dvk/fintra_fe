import { chartOfAccountService } from "@/features/master-data/chart-of-account/data/chart-of-account.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import {
  mockChartOfAccount,
  mockChartOfAccounts,
} from "./chart-of-account.handlers";

const BASE = "http://localhost:3000";

describe("chartOfAccountService", () => {
  describe("listChartOfAccounts()", () => {
    it("returns paged chart of account data on success", async () => {
      const result = await chartOfAccountService.listChartOfAccounts({
        page: 0,
        size: 10,
      });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toBeDefined();
      expect(result.data?.content.length).toBeGreaterThan(0);
      expect(result.data?.content[0].code).toBe("11100");
    });

    it("correctly calculates pages with 0-indexed page parameter from DataTable", async () => {
      const generateItems = (count: number) =>
        Array.from({ length: count }, (_, i) => ({
          ...mockChartOfAccount,
          id: i + 1,
          code: `COA-${i + 1}`,
        }));

      server.use(
        http.get(`${BASE}/master-data/chart-of-accounts`, () => {
          return HttpResponse.json({
            status: "SUCCESS",
            message: "ok",
            data: generateItems(25),
          });
        }),
      );

      // Page 1 (DataTable sends page: 0)
      const res0 = await chartOfAccountService.listChartOfAccounts({ page: 0, size: 10 });
      expect(res0.data?.pagination.currentPage).toBe(1);
      expect(res0.data?.pagination.totalPages).toBe(3);
      expect(res0.data?.content).toHaveLength(10);
      expect(res0.data?.content[0].code).toBe("COA-1");

      // Page 2 (DataTable sends page: 1 on Next)
      const res1 = await chartOfAccountService.listChartOfAccounts({ page: 1, size: 10 });
      expect(res1.data?.pagination.currentPage).toBe(2);
      expect(res1.data?.content).toHaveLength(10);
      expect(res1.data?.content[0].code).toBe("COA-11");

      // Page 3 (DataTable sends page: 2 on Next again)
      const res2 = await chartOfAccountService.listChartOfAccounts({ page: 2, size: 10 });
      expect(res2.data?.pagination.currentPage).toBe(3);
      expect(res2.data?.content).toHaveLength(5);
      expect(res2.data?.content[0].code).toBe("COA-21");
    });

    it("forwards search query parameter to the request", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master-data/chart-of-accounts`, ({ request }) => {
          capturedUrls.push(new URL(request.url));
          return HttpResponse.json({
            status: "SUCCESS",
            message: "ok",
            data: [mockChartOfAccount],
          });
        }),
      );

      await chartOfAccountService.listChartOfAccounts({
        page: 0,
        size: 10,
        search: "Cash",
      });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("search")).toBe("Cash");
    });

    it("handles empty data correctly", async () => {
      server.use(
        http.get(`${BASE}/master-data/chart-of-accounts`, () => {
          return HttpResponse.json({
            status: "SUCCESS",
            message: "empty",
            data: [],
          });
        }),
      );

      const result = await chartOfAccountService.listChartOfAccounts({
        page: 0,
        size: 10,
      });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toEqual([]);
      expect(result.data?.pagination.total).toBe(0);
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master-data/chart-of-accounts`, () =>
          HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          ),
        ),
      );

      await expect(
        chartOfAccountService.listChartOfAccounts(),
      ).rejects.toThrow();
    });
  });

  describe("getChartOfAccountById()", () => {
    it("returns a single chart of account by ID", async () => {
      const result = await chartOfAccountService.getChartOfAccountById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.code).toBe("11100");
      expect(result.data?.name).toBe("Cash and Cash Equivalents");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master-data/chart-of-accounts/:id`, () =>
          HttpResponse.json(
            { message: "Not Found" },
            { status: 500 },
          ),
        ),
      );

      await expect(
        chartOfAccountService.getChartOfAccountById(999),
      ).rejects.toThrow();
    });
  });

  describe("createChartOfAccount()", () => {
    it("creates a new chart of account successfully", async () => {
      const payload = {
        code: "11300",
        name: "Bank Mandiri",
        level: 2,
        description: "Operating account",
        active: true,
      };

      const result = await chartOfAccountService.createChartOfAccount(payload);

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toBeDefined();
    });

    it("throws when create request fails", async () => {
      server.use(
        http.post(`${BASE}/master-data/chart-of-accounts`, () =>
          HttpResponse.json(
            { message: "Code already exists" },
            { status: 400 },
          ),
        ),
      );

      await expect(
        chartOfAccountService.createChartOfAccount({
          code: "11100",
          name: "Duplicate",
          level: 1,
        }),
      ).rejects.toThrow();
    });
  });

  describe("updateChartOfAccount()", () => {
    it("updates an existing chart of account successfully", async () => {
      const payload = {
        code: "11100",
        name: "Cash and Cash Equivalents Updated",
        level: 1,
        description: "Updated description",
        active: true,
      };

      const result = await chartOfAccountService.updateChartOfAccount(1, payload);

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toBeDefined();
    });

    it("throws when update request fails", async () => {
      server.use(
        http.put(`${BASE}/master-data/chart-of-accounts/:id`, () =>
          HttpResponse.json(
            { message: "Not Found" },
            { status: 404 },
          ),
        ),
      );

      await expect(
        chartOfAccountService.updateChartOfAccount(999, {
          code: "11100",
          name: "Invalid",
          level: 1,
        }),
      ).rejects.toThrow();
    });
  });

  describe("deleteChartOfAccount()", () => {
    it("deletes a chart of account successfully", async () => {
      const result = await chartOfAccountService.deleteChartOfAccount(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toBe("1");
    });

    it("throws when delete request fails", async () => {
      server.use(
        http.delete(`${BASE}/master-data/chart-of-accounts/:id`, () =>
          HttpResponse.json(
            { message: "Cannot delete active account" },
            { status: 400 },
          ),
        ),
      );

      await expect(
        chartOfAccountService.deleteChartOfAccount(1),
      ).rejects.toThrow();
    });
  });

  describe("activateChartOfAccount() & deactivateChartOfAccount()", () => {
    it("activates chart of account", async () => {
      const result = await chartOfAccountService.activateChartOfAccount(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.active).toBe(true);
    });

    it("deactivates chart of account", async () => {
      const result = await chartOfAccountService.deactivateChartOfAccount(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.active).toBe(false);
    });
  });

  describe("importChartOfAccounts()", () => {
    it("imports chart of accounts from file", async () => {
      const file = new File(["dummy content"], "coa.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const result = await chartOfAccountService.importChartOfAccounts(file);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.summary.totalRows).toBe(10);
    });

    it("imports chart of accounts with dryRun=true", async () => {
      const file = new File(["dummy content"], "coa.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const result = await chartOfAccountService.importChartOfAccounts(
        file,
        true,
      );

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.summary.totalRows).toBe(10);
    });
  });

  describe("downloadImportTemplate()", () => {
    it("downloads import template as blob", async () => {
      const blob = await chartOfAccountService.downloadImportTemplate();
      expect(blob).toBeInstanceOf(Blob);
    });
  });
});
