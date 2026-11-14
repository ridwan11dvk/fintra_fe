import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { portService } from "@/features/master-data/port/data/port.service";

const BASE = "http://localhost:3000";

describe("portService", () => {
  describe("listPorts()", () => {
    it("returns paged port data on success", async () => {
      const result = await portService.listPorts();
      expect(result.status).toBe("SUCCESS");
      expect(result.data.content).toHaveLength(1);
      expect(result.data.content[0].name).toBe(
        "Pelabuhan Soekarno-Hatta Jakarta",
      );
    });

    it("forwards pagination params to the request", async () => {
      let capturedUrl = "";
      server.use(
        http.get(`${BASE}/master/port`, ({ request }) => {
          capturedUrl = request.url;
          return HttpResponse.json({
            status: "SUCCESS",
            message: "OK",
            data: {
              content: [],
              pagination: {
                total: 0,
                pageSize: 25,
                pageNumber: 2,
                totalPages: 0,
                currentPage: 2,
                from: 26,
                to: 0,
              },
            },
          });
        }),
      );

      await portService.listPorts({
        pageSize: 25,
        pageNumber: 2,
      });

      expect(capturedUrl).toContain("pageSize=25");
      expect(capturedUrl).toContain("pageNumber=2");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/port`, () =>
          HttpResponse.json({ message: "Server error" }, { status: 500 }),
        ),
      );

      await expect(portService.listPorts()).rejects.toThrow();
    });
  });

  describe("listPortsAlt()", () => {
    it("returns ports by customs office (alt)", async () => {
      const result = await portService.listPortsAlt(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(2);
    });
  });

  describe("listPortsByCustomsOffice()", () => {
    it("returns paged ports by customs office id", async () => {
      const result = await portService.listPortsByCustomsOffice(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data.content).toHaveLength(1);
    });
  });

  describe("getPortById()", () => {
    it("returns a single port by ID", async () => {
      const result = await portService.getPortById(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data.id).toBe(1);
      expect(result.data.code).toBe("PORT-CGK-001");
    });
  });

  describe("createPort()", () => {
    it("creates a port and returns the created record", async () => {
      const result = await portService.createPort({
        customsOfficeId: 1,
        code: "PORT-CGK-001",
        name: "Pelabuhan Soekarno-Hatta Jakarta",
      });
      expect(result.status).toBe("SUCCESS");
      expect(result.data.code).toBe("PORT-CGK-001");
    });
  });

  describe("updatePort()", () => {
    it("updates a port and returns the updated record", async () => {
      const result = await portService.updatePort(1, {
        customsOfficeId: 1,
        code: "PORT-CGK-002",
        name: "Pelabuhan Soekarno-Hatta Jakarta Updated",
      });
      expect(result.status).toBe("SUCCESS");
      expect(result.data.id).toBe(1);
    });
  });

  describe("deletePort()", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("deletes a port successfully", async () => {
      const result = await portService.deletePort(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.message).toBe("Data deleted successfully");
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.delete(`${BASE}/master/port/:id`, () =>
          HttpResponse.json(
            { message: "Port not found" },
            { status: 404 },
          ),
        ),
      );

      await expect(portService.deletePort(999)).rejects.toThrow();
    });
  });
});
