import { termOfPaymentService } from "@/features/master-data/term-of-payment/data/term-of-payment.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

const BASE = "http://localhost:3000";

describe("termOfPaymentService", () => {
  describe("listTermOfPayments()", () => {
    it("returns paged data on success", async () => {
      const result = await termOfPaymentService.listTermOfPayments({
        page: 1,
        size: 10,
      });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data?.content[0].code).toBe("NET_30");
      expect(result.data?.pagination.total).toBe(1);
    });

    it("forwards pagination params to the request", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/term-of-payment`, ({ request }) => {
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

      await termOfPaymentService.listTermOfPayments({
        page: 2,
        size: 5,
        search: "NET",
      });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("page")).toBe("2");
      expect(capturedUrl.searchParams.get("size")).toBe("5");
      expect(capturedUrl.searchParams.get("search")).toBe("NET");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/term-of-payment`, () =>
          HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          ),
        ),
      );

      await expect(
        termOfPaymentService.listTermOfPayments(),
      ).rejects.toThrow();
    });
  });

  describe("getTermOfPaymentById()", () => {
    it("returns a single record by ID", async () => {
      const result = await termOfPaymentService.getTermOfPaymentById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.name).toBe("Net 30");
    });
  });

  describe("createTermOfPayment()", () => {
    it("creates a record and returns the created data", async () => {
      const payload = {
        code: "NET_30",
        name: "Net 30",
        numberOfDays: 30,
        calculationType: "CALENDAR_DAYS",
        isActive: true,
      };
      const result = await termOfPaymentService.createTermOfPayment(payload);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.code).toBe("NET_30");
    });
  });

  describe("updateTermOfPayment()", () => {
    it("updates a record and returns the updated data", async () => {
      const payload = {
        code: "NET_30",
        name: "Net 30 Updated",
        numberOfDays: 30,
        calculationType: "CALENDAR_DAYS",
        isActive: true,
      };
      const result = await termOfPaymentService.updateTermOfPayment(
        1,
        payload,
      );

      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deleteTermOfPayment()", () => {
    it("deletes a record successfully", async () => {
      const result = await termOfPaymentService.deleteTermOfPayment(1);

      expect(result.status).toBe("SUCCESS");
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.delete(`${BASE}/master/term-of-payment/:id`, () =>
          HttpResponse.json({ message: "Not Found" }, { status: 404 }),
        ),
      );

      await expect(
        termOfPaymentService.deleteTermOfPayment(999),
      ).rejects.toThrow();
    });
  });
});
