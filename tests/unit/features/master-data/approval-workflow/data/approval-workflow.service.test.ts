import { approvalWorkflowService } from "@/features/master-data/approval-workflow/data";
import type { CreateApprovalWorkflowRequest } from "@/features/master-data/approval-workflow/data";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

const BASE = "http://localhost:3000";

describe("approvalWorkflowService", () => {
  const dummyPayload: CreateApprovalWorkflowRequest = {
    transactionType: 1,
    name: "Supplier Payment Workflow",
    description: "Workflow for supplier payments",
    currency: "IDR",
    levels: [
      {
        stageProcessCategory: "FINANCIAL",
        stageProcess: "financial-approval",
        outputStep: "Approval Step",
        roleSetting: "MANUAL",
        role: "Role 2",
        bands: [],
      },
    ],
  };

  describe("listApprovalWorkflows()", () => {
    it("returns approval workflow list on success", async () => {
      const result = await approvalWorkflowService.listApprovalWorkflows();

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(2);
      expect(result.data[0].transactionType).toBe("SUPPLIER_PAYMENT");
    });

    it("throws when server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/approval-workflow`, () => {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          );
        }),
      );

      await expect(
        approvalWorkflowService.listApprovalWorkflows(),
      ).rejects.toThrow();
    });
  });

  describe("getApprovalWorkflowDetail()", () => {
    it("returns detail for a specific transaction type", async () => {
      const result =
        await approvalWorkflowService.getApprovalWorkflowDetail("SUPPLIER_PAYMENT");

      expect(result.status).toBe("SUCCESS");
      expect(result.data.transactionType).toBe(1);
      expect(result.data.levels).toHaveLength(1);
    });

    it("throws when server returns 500", async () => {
      server.use(
        http.get(`${BASE}/master/approval-workflow/:type`, () => {
          return HttpResponse.json(
            { message: "Not Found" },
            { status: 500 },
          );
        }),
      );

      await expect(
        approvalWorkflowService.getApprovalWorkflowDetail("UNKNOWN"),
      ).rejects.toThrow();
    });
  });

  describe("createApprovalWorkflow()", () => {
    it("creates workflow successfully with valid payload", async () => {
      const result =
        await approvalWorkflowService.createApprovalWorkflow(dummyPayload);

      expect(result.status).toBe("SUCCESS");
      expect(result.message).toBe("Approval workflow created successfully");
    });

    it("throws when server returns 400 or 500", async () => {
      server.use(
        http.post(`${BASE}/master/approval-workflow`, () => {
          return HttpResponse.json(
            { message: "Bad Request" },
            { status: 400 },
          );
        }),
      );

      await expect(
        approvalWorkflowService.createApprovalWorkflow(dummyPayload),
      ).rejects.toThrow();
    });
  });

  describe("updateApprovalWorkflow()", () => {
    it("updates workflow successfully with id and payload", async () => {
      const result = await approvalWorkflowService.updateApprovalWorkflow(
        "1246ac32-40d2-47c7-828c-bf37ae0868a0",
        dummyPayload,
      );

      expect(result.status).toBe("SUCCESS");
      expect(result.message).toBe("Approval workflow updated successfully");
    });

    it("throws when server returns 500", async () => {
      server.use(
        http.put(`${BASE}/master/approval-workflow/:id`, () => {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          );
        }),
      );

      await expect(
        approvalWorkflowService.updateApprovalWorkflow(
          "1246ac32-40d2-47c7-828c-bf37ae0868a0",
          dummyPayload,
        ),
      ).rejects.toThrow();
    });
  });

  describe("getTransactionTypeOptions()", () => {
    it("returns transaction type options list", async () => {
      const result =
        await approvalWorkflowService.getTransactionTypeOptions();

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(2);
      expect(result.data[0].value).toBe(1);
    });
  });

  describe("getStageCategoryOptions()", () => {
    it("returns stage category options list", async () => {
      const result =
        await approvalWorkflowService.getStageCategoryOptions();

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(2);
      expect(result.data[0].value).toBe("BUSINESS_LAYER");
    });
  });

  describe("getStageProcessOptions()", () => {
    it("returns stage process options list with query param", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/approval-workflow/stage-process/options`, ({ request }) => {
          capturedUrls.push(new URL(request.url));
          return HttpResponse.json({
            status: "SUCCESS",
            message: "ok",
            data: [{ value: "financial-approval", label: "Financial Approval" }],
            errors: null,
          });
        }),
      );

      const result =
        await approvalWorkflowService.getStageProcessOptions("FINANCIAL");

      expect(result.status).toBe("SUCCESS");
      expect(capturedUrls[0].searchParams.get("stageCategory")).toBe("FINANCIAL");
    });

    it("returns all stage process options without query param when stageCategory is omitted", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/approval-workflow/stage-process/options`, ({ request }) => {
          capturedUrls.push(new URL(request.url));
          return HttpResponse.json({
            status: "SUCCESS",
            message: "ok",
            data: [{ value: "financial-approval", label: "Financial Approval" }],
            errors: null,
          });
        }),
      );

      const result = await approvalWorkflowService.getStageProcessOptions();

      expect(result.status).toBe("SUCCESS");
      expect(capturedUrls[0].searchParams.get("stageCategory")).toBeNull();
    });
  });

  describe("getDefaultStages()", () => {
    it("returns the ordered stage template for a transaction type", async () => {
      const result = await approvalWorkflowService.getDefaultStages(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data.map((stage) => stage.stageProcessName)).toEqual([
        "Business Unit Verification",
        "Financial Control",
      ]);
    });
  });
});
