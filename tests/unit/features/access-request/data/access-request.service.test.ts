import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { accessRequestService } from "@/features/access-request/data/access-request.service";

const BASE = "http://localhost:3000";

describe("accessRequestService", () => {
  describe("listAccessRequests()", () => {
    it("returns paged access request data on success", async () => {
      const result = await accessRequestService.listAccessRequests();
      expect(result.status).toBe("SUCCESS");
      expect(result.data.content).toHaveLength(1);
      expect(result.data.content[0].userName).toBe("John Doe");
    });

    it("forwards pagination params", async () => {
      let capturedUrl = "";
      server.use(
        http.get(`${BASE}/access-request`, ({ request }) => {
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

      await accessRequestService.listAccessRequests({
        pageSize: 25,
        pageNumber: 2,
      });

      expect(capturedUrl).toContain("pageSize=25");
      expect(capturedUrl).toContain("pageNumber=2");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/access-request`, () =>
          HttpResponse.json({ message: "Server error" }, { status: 500 }),
        ),
      );

      await expect(accessRequestService.listAccessRequests()).rejects.toThrow();
    });
  });

  describe("getAccessRequestById()", () => {
    it("returns a single access request by ID with details", async () => {
      const result = await accessRequestService.getAccessRequestById(1);
      expect(result.id).toBe(1);
      expect(result.modules).toBeDefined();
      expect(result.modules).toHaveLength(2);
    });
  });

  describe("changeAccessRequestStatus()", () => {
    it("changes status and returns the updated record", async () => {
      const result = await accessRequestService.changeAccessRequestStatus(1, {
        status: "APPROVED",
        roles: [1, 2],
      });
      expect(result.id).toBe(1);
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.put(`${BASE}/access-request/:id`, () =>
          HttpResponse.json(
            { message: "Resource not found" },
            { status: 404 },
          ),
        ),
      );

      await expect(
        accessRequestService.changeAccessRequestStatus(999, {
          status: "APPROVED",
          roles: [1],
        }),
      ).rejects.toThrow();
    });
  });
});
