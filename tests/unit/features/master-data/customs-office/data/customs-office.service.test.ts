import { customsOfficeService } from "@/features/master-data/customs-office/data/customs-office.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

const BASE = "http://localhost:3000";

describe("customsOfficeService", () => {
  describe("listCustomsOffices()", () => {
    it("returns paged customs office data on success", async () => {
      const result = await customsOfficeService.listCustomsOffices({ page: 1, size: 10 });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(2);
      expect(result.data?.content[0].code).toBe("KPPBC-001");
      expect(result.data?.pagination.total).toBe(2);
    });

    it("forwards pagination params to the request", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/customs-office`, ({ request }) => {
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

      await customsOfficeService.listCustomsOffices({
        page: 2,
        size: 5,
      });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("page")).toBe("2");
      expect(capturedUrl.searchParams.get("size")).toBe("5");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/customs-office`, () => {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          );
        }),
      );

      await expect(customsOfficeService.listCustomsOffices()).rejects.toThrow();
    });
  });

  describe("listCustomsOfficesAlt()", () => {
    it("returns all customs offices as array", async () => {
      const result = await customsOfficeService.listCustomsOfficesAlt();

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(2);
    });

    it("passes search parameter", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/customs-office/list`, ({ request }) => {
          capturedUrls.push(new URL(request.url));
          return HttpResponse.json({
            status: "SUCCESS",
            message: "ok",
            data: [],
          });
        }),
      );

      await customsOfficeService.listCustomsOfficesAlt({ search: "Jakarta" });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("search")).toBe("Jakarta");
    });
  });

  describe("getCustomsOfficeById()", () => {
    it("returns a single customs office by ID", async () => {
      const result = await customsOfficeService.getCustomsOfficeById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.code).toBe("KPPBC-001");
    });

    it("throws when customs office not found", async () => {
      server.use(
        http.get(`${BASE}/master/customs-office/999`, () => {
          return HttpResponse.json(
            { message: "Customs office not found" },
            { status: 404 },
          );
        }),
      );

      await expect(customsOfficeService.getCustomsOfficeById(999)).rejects.toThrow();
    });
  });

  describe("createCustomsOffice()", () => {
    it("creates a customs office and returns the created record", async () => {
      const payload = {
        code: "KPPBC-003",
        name: "Test Customs Office",
        isActive: true,
      };
      const result = await customsOfficeService.createCustomsOffice(payload);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.code).toBe("KPPBC-001");
    });

    it("creates an inactive customs office", async () => {
      const payload = {
        code: "KPPBC-004",
        name: "Inactive Office",
        isActive: false,
      };
      const result = await customsOfficeService.createCustomsOffice(payload);

      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("updateCustomsOffice()", () => {
    it("updates a customs office and returns the updated record", async () => {
      const payload = {
        code: "KPPBC-001",
        name: "Updated Customs Office",
        isActive: false,
      };
      const result = await customsOfficeService.updateCustomsOffice(1, payload);

      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deleteCustomsOffice()", () => {
    it("deletes a customs office successfully", async () => {
      const result = await customsOfficeService.deleteCustomsOffice(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.message).toBe("Customs office deleted successfully");
    });

    it("throws when customs office not found", async () => {
      server.use(
        http.delete(`${BASE}/master/customs-office/999`, () => {
          return HttpResponse.json(
            { message: "Customs office not found" },
            { status: 404 },
          );
        }),
      );

      await expect(customsOfficeService.deleteCustomsOffice(999)).rejects.toThrow();
    });
  });
});
