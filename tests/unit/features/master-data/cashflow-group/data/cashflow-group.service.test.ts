import { cashflowGroupService } from "@/features/master-data/cashflow-group/data/cashflow-group.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import {
  mockCashflowGroupDto,
  mockCashflowGroupDtoInactive,
} from "./cashflow-group.handlers";

const BASE = "http://localhost:3000";
const LIST_URL = `${BASE}/master-data/cashflow-groups`;
const PAYABLE_DELETE_URL = `${BASE}/api/master-data/cashflow-groups`;

const requestPayload = {
  code: "OPR-02",
  name: "Operating Receipt Two",
  cashflowGroupId: "1",
  cashflowType: "RECIPIENT_TARGET" as const,
  exception: "1",
  description: "Second operating group",
};

describe("cashflowGroupService", () => {
  describe("listCashflowGroups()", () => {
    it("[FSSC-CFG-001] returns paged cashflow group data on success", async () => {
      const result = await cashflowGroupService.listCashflowGroups({
        page: 0,
        size: 10,
      });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(2);
      expect(result.data?.content[0].code).toBe("OPR-01");
      expect(result.data?.content[0].cashflowType).toBe("RECIPIENT_TARGET");
      expect(result.data?.content[0].exception).toBe(true);
      expect(result.data?.pagination.total).toBe(2);
    });

    it("[FSSC-CFG-003] filters list results client-side by search keyword", async () => {
      const result = await cashflowGroupService.listCashflowGroups({
        page: 0,
        size: 10,
        search: "provider",
      });

      expect(result.data?.content).toHaveLength(1);
      expect(result.data?.content[0].cashflowType).toBe("PROVIDER");
    });

    it("throws when the API returns ERROR status", async () => {
      server.use(
        http.get(LIST_URL, () =>
          HttpResponse.json({
            status: "ERROR",
            message: "Cashflow groups unavailable",
          }),
        ),
      );

      await expect(cashflowGroupService.listCashflowGroups()).rejects.toThrow(
        "Cashflow groups unavailable",
      );
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get(LIST_URL, () =>
          HttpResponse.json({ message: "Internal Server Error" }, { status: 500 }),
        ),
      );

      await expect(cashflowGroupService.listCashflowGroups()).rejects.toThrow();
    });
  });

  describe("getCashflowGroupById()", () => {
    it("[FSSC-CFG-002] returns a single cashflow group by ID", async () => {
      const result = await cashflowGroupService.getCashflowGroupById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(mockCashflowGroupDto.id);
      expect(result.data?.cashflowGroupName).toBe("Operating");
    });
  });

  describe("createCashflowGroup()", () => {
    it("[FSSC-CFG-014] posts trimmed payload with exception flag spelling", async () => {
      let body: unknown;

      server.use(
        http.post(LIST_URL, async ({ request }) => {
          body = await request.json();
          return HttpResponse.json({
            status: "SUCCESS",
            message: "Cashflow group created",
            data: {
              id: 3,
              code: requestPayload.code,
              name: requestPayload.name,
              categoryCode: requestPayload.cashflowGroupId,
              categoryName: "Operating",
              cashflowType: requestPayload.cashflowType,
              exception: requestPayload.exception,
              description: requestPayload.description,
              active: true,
              canDelete: true,
            },
          });
        }),
      );

      const result = await cashflowGroupService.createCashflowGroup({
        ...requestPayload,
        code: "  OPR-02  ",
        name: "  Operating Receipt Two  ",
        cashflowGroupId: " 1 ",
        description: "  Second operating group  ",
      });

      expect(result.status).toBe("SUCCESS");
      expect(body).toEqual({
        code: "OPR-02",
        name: "Operating Receipt Two",
        categoryCode: "1",
        cashflowType: "RECIPIENT_TARGET",
        exception: "1",
        description: "Second operating group",
      });
    });
  });

  describe("updateCashflowGroup()", () => {
    it("updates a cashflow group successfully", async () => {
      const result = await cashflowGroupService.updateCashflowGroup(1, {
        ...requestPayload,
        name: "Operating Receipt Updated",
      });

      expect(result.status).toBe("SUCCESS");
      expect(result.message).toContain("updated");
    });
  });

  describe("activateCashflowGroup() & deactivateCashflowGroup()", () => {
    it("activates an inactive cashflow group", async () => {
      const result = await cashflowGroupService.activateCashflowGroup(
        mockCashflowGroupDtoInactive.id,
      );

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.status).toBe("ACTIVE");
    });

    it("deactivates an active cashflow group", async () => {
      const result = await cashflowGroupService.deactivateCashflowGroup(
        mockCashflowGroupDto.id,
      );

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.status).toBe("INACTIVE");
    });
  });

  describe("deleteCashflowGroup()", () => {
    it("[FSSC-CFG-030] deletes a cashflow group through the payable API", async () => {
      const result = await cashflowGroupService.deleteCashflowGroup(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.message).toContain("deleted");
    });

    it("throws when payable delete fails", async () => {
      server.use(
        http.delete("*/api/master-data/cashflow-groups/:id", () =>
          HttpResponse.json({ message: "Cannot delete" }, { status: 400 }),
        ),
      );

      await expect(cashflowGroupService.deleteCashflowGroup(1)).rejects.toThrow();
    });
  });
});
