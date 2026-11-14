import { describe, expect, it } from "vitest";
import { regencyService } from "@/features/master-data/regency/data/regency.service";

describe("regencyService", () => {
  describe("listRegencies()", () => {
    it("returns paged regency data on success", async () => {
      const result = await regencyService.listRegencies();
      expect(result.status).toBe("SUCCESS");
      expect(result.data.content).toHaveLength(1);
    });

    it("forwards pagination params to the request", async () => {
      const result = await regencyService.listRegencies({
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
        http.get("http://localhost:3000/master/regency", () =>
          HttpResponse.json(
            { message: "Server error" },
            { status: 500 },
          ),
        ),
      );
      await expect(regencyService.listRegencies()).rejects.toThrow();
    });
  });

  describe("getRegencyById()", () => {
    it("returns a single regency by ID", async () => {
      const result = await regencyService.getRegencyById(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data.id).toBe(1);
    });

    it("throws when the regency is not found", async () => {
      await expect(regencyService.getRegencyById(999)).rejects.toThrow();
    });
  });

  describe("getRegenciesByProvinceId()", () => {
    it("returns regencies filtered by province ID", async () => {
      const result = await regencyService.getRegenciesByProvinceId(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(1);
    });

    it("throws when the province is not found", async () => {
      await expect(regencyService.getRegenciesByProvinceId(999)).rejects.toThrow();
    });
  });

  describe("createRegency()", () => {
    it("creates a regency and returns the created record", async () => {
      const result = await regencyService.createRegency({
        code: "REG001",
        name: "Bandung",
        provinceId: 1,
      });
      expect(result.status).toBe("SUCCESS");
      expect(result.data.name).toBe("Bandung");
    });
  });

  describe("updateRegency()", () => {
    it("updates a regency and returns the updated record", async () => {
      const result = await regencyService.updateRegency(1, {
        code: "REG001",
        name: "Updated Regency",
        provinceId: 1,
      });
      expect(result.status).toBe("SUCCESS");
      expect(result.data.id).toBe(1);
    });
  });

  describe("deleteRegency()", () => {
    it("deletes a regency successfully", async () => {
      const result = await regencyService.deleteRegency(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.message).toBe("Data deleted successfully");
    });

    it("throws when the server returns 404", async () => {
      await expect(regencyService.deleteRegency(999)).rejects.toThrow();
    });
  });
});
