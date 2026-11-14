import { describe, expect, it } from "vitest";
import { provinceService } from "@/features/master-data/province/data/province.service";

describe("provinceService", () => {
  describe("listProvinces()", () => {
    it("returns paged province data on success", async () => {
      const result = await provinceService.listProvinces();
      expect(result.status).toBe("SUCCESS");
      expect(result.data.content).toHaveLength(1);
    });

    it("forwards pagination params to the request", async () => {
      const result = await provinceService.listProvinces({
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
        http.get("http://localhost:3000/master/province", () =>
          HttpResponse.json(
            { message: "Server error" },
            { status: 500 },
          ),
        ),
      );
      await expect(provinceService.listProvinces()).rejects.toThrow();
    });
  });

  describe("getProvinceById()", () => {
    it("returns a single province by ID", async () => {
      const result = await provinceService.getProvinceById(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data.id).toBe(1);
    });

    it("throws when the province is not found", async () => {
      await expect(provinceService.getProvinceById(999)).rejects.toThrow();
    });
  });

  describe("createProvince()", () => {
    it("creates a province and returns the created record", async () => {
      const result = await provinceService.createProvince({
        code: "PROV001",
        name: "West Java",
      });
      expect(result.status).toBe("SUCCESS");
      expect(result.data.name).toBe("West Java");
    });
  });

  describe("updateProvince()", () => {
    it("updates a province and returns the updated record", async () => {
      const result = await provinceService.updateProvince(1, {
        code: "PROV001",
        name: "Updated Province",
      });
      expect(result.status).toBe("SUCCESS");
      expect(result.data.id).toBe(1);
    });
  });

  describe("deleteProvince()", () => {
    it("deletes a province successfully", async () => {
      const result = await provinceService.deleteProvince(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.message).toBe("Data deleted successfully");
    });

    it("throws when the server returns 404", async () => {
      await expect(provinceService.deleteProvince(999)).rejects.toThrow();
    });
  });
});
