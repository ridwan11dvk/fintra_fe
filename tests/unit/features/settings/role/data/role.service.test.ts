import { roleService } from "@/features/settings/role/data/role.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const BASE = "http://localhost:3000";

describe("roleService", () => {
  describe("getRoles()", () => {
    it("returns paged role data on success", async () => {
      const result = await roleService.getRoles({ page: 1, size: 10 });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data?.content[0].name).toBe("Admin");
      expect(result.data?.pagination.total).toBe(1);
    });

    it("forwards pagination params to the request", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/role`, ({ request }) => {
          capturedUrls.push(new URL(request.url));
          return HttpResponse.json({
            status: "SUCCESS",
            message: "ok",
            data: {
              content: [],
              pagination: {
                total: 0, pageSize: 5, pageNumber: 2, totalPages: 0,
                currentPage: 2, from: 0, to: 0,
              },
            },
          });
        }),
      );

      await roleService.getRoles({ page: 2, size: 5, search: "Admin", moduleId: 1 });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("page")).toBe("2");
      expect(capturedUrl.searchParams.get("size")).toBe("5");
      expect(capturedUrl.searchParams.get("search")).toBe("Admin");
      expect(capturedUrl.searchParams.get("moduleId")).toBe("1");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/role`, () =>
          HttpResponse.json({ message: "Internal Server Error" }, { status: 500 }),
        ),
      );

      await expect(roleService.getRoles({ page: 1, size: 10 })).rejects.toThrow();
    });
  });

  describe("getRoleById()", () => {
    it("returns role detail by ID", async () => {
      const result = await roleService.getRoleById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.name).toBe("Admin");
      expect(result.data?.permissions).toHaveLength(1);
    });
  });

  describe("getRoleByName()", () => {
    it("returns role detail by name", async () => {
      const result = await roleService.getRoleByName("Admin");

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.name).toBe("Admin");
    });
  });

  describe("createRole()", () => {
    it("creates a role and returns the created record", async () => {
      const payload = { name: "New Role", moduleId: 1, description: "Test" };
      const result = await roleService.createRole(payload);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.name).toBe("Admin");
    });
  });

  describe("updateRole()", () => {
    it("updates a role and returns the updated record", async () => {
      const payload = { name: "Updated Role", moduleId: 1 };
      const result = await roleService.updateRole(1, payload);

      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deleteRole()", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("deletes a role successfully", async () => {
      const result = await roleService.deleteRole(1);
      expect(result.status).toBe("SUCCESS");
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.delete(`${BASE}/master/role/:id`, () =>
          HttpResponse.json({ message: "Not Found" }, { status: 404 }),
        ),
      );

      await expect(roleService.deleteRole(999)).rejects.toThrow();
    });
  });

  describe("assignPermissions()", () => {
    it("assigns permissions and returns role detail", async () => {
      const result = await roleService.assignPermissions(1, { permissionIds: [1, 2] });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.permissions).toHaveLength(1);
    });
  });

  describe("removePermissions()", () => {
    it("removes permissions and returns role detail", async () => {
      const result = await roleService.removePermissions(1, { permissionIds: [1] });

      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("getRolePermissions()", () => {
    it("returns permissions for a role", async () => {
      const result = await roleService.getRolePermissions(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data?.[0].name).toBe("master-data:bank:list");
    });
  });

  describe("getPermissions()", () => {
    it("returns paged permissions on success", async () => {
      const result = await roleService.getPermissions({ page: 1, size: 10 });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data?.content[0].resource).toBe("master-data:bank");
    });

    it("forwards params to the request", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/permission`, ({ request }) => {
          capturedUrls.push(new URL(request.url));
          return HttpResponse.json({
            status: "SUCCESS", message: "ok",
            data: { content: [], pagination: { total: 0, pageSize: 10, pageNumber: 1, totalPages: 0, currentPage: 1, from: 0, to: 0 } },
          });
        }),
      );

      await roleService.getPermissions({ page: 1, size: 10, resource: "master-data" });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("resource")).toBe("master-data");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/permission`, () =>
          HttpResponse.json({ message: "Server Error" }, { status: 500 }),
        ),
      );

      await expect(roleService.getPermissions({ page: 1, size: 10 })).rejects.toThrow();
    });
  });
});
