import { partnerDocRefService } from "@/features/master-data/partner-doc-ref/data/partner-doc-ref.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const BASE = "http://localhost:3000";

describe("partnerDocRefService", () => {
  describe("listPartnerDocRefs()", () => {
    it("returns paged partner doc ref data on success", async () => {
      const result = await partnerDocRefService.listPartnerDocRefs({
        page: 1,
        size: 10,
      });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data?.content[0].documentName).toBe("KTP");
      expect(result.data?.pagination.total).toBe(1);
    });

    it("forwards pagination params to the request", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(
          "http://localhost:3000/master/partner/doc-ref",
          ({ request }) => {
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
          },
        ),
      );

      await partnerDocRefService.listPartnerDocRefs({
        page: 2,
        size: 5,
        search: "KTP",
      });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("page")).toBe("2");
      expect(capturedUrl.searchParams.get("size")).toBe("5");
      expect(capturedUrl.searchParams.get("search")).toBe("KTP");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(
          "http://localhost:3000/master/partner/doc-ref",
          () =>
            HttpResponse.json(
              { message: "Internal Server Error" },
              { status: 500 },
            ),
        ),
      );

      await expect(
        partnerDocRefService.listPartnerDocRefs(),
      ).rejects.toThrow();
    });
  });

  describe("getFilteredPartnerDocRefs()", () => {
    it("returns filtered partner doc refs", async () => {
      const result = await partnerDocRefService.getFilteredPartnerDocRefs({
        companyCode: "C001",
        countryId: 1,
      });

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(1);
      expect(result.data?.[0].documentName).toBe("KTP");
    });
  });

  describe("getPartnerDocRefById()", () => {
    it("returns a single partner doc ref by ID", async () => {
      const result = await partnerDocRefService.getPartnerDocRefById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.documentName).toBe("KTP");
    });
  });

  describe("getByCountry()", () => {
    it("returns partner doc refs by country", async () => {
      const result = await partnerDocRefService.getByCountry(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(1);
      expect(result.data?.[0].countryName).toBe("Indonesia");
    });
  });

  describe("getByCountryAndCompany()", () => {
    it("returns partner doc refs by country and company", async () => {
      const result =
        await partnerDocRefService.getByCountryAndCompany(1, "C001");

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(1);
    });
  });

  describe("createPartnerDocRef()", () => {
    it("creates a partner doc ref and returns the created record", async () => {
      const payload = {
        countryId: 1,
        companyCode: "C001",
        partnerLegalityId: 3,
        partnerRoleId: 4,
        documentNameId: 15,
        isActive: true,
      };
      const result = await partnerDocRefService.createPartnerDocRef(payload);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.documentName).toBe("KTP");
    });
  });

  describe("updatePartnerDocRef()", () => {
    it("updates a partner doc ref and returns the updated record", async () => {
      const payload = {
        countryId: 1,
        companyCode: "C001",
        partnerLegalityId: 3,
        partnerRoleId: 4,
        documentNameId: 16,
        isActive: true,
      };
      const result = await partnerDocRefService.updatePartnerDocRef(
        1,
        payload,
      );

      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deletePartnerDocRef()", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("deletes a partner doc ref successfully", async () => {
      const result = await partnerDocRefService.deletePartnerDocRef(1);

      expect(result.status).toBe("SUCCESS");
    });

    it("throws when the server returns 404", async () => {
      server.use(
        http.delete(`${BASE}/master/partner/doc-ref/:id`, () =>
          HttpResponse.json({ message: "Not Found" }, { status: 404 }),
        ),
      );

      await expect(
        partnerDocRefService.deletePartnerDocRef(999),
      ).rejects.toThrow();
    });
  });
});
