import { describe, expect, it } from "vitest";
import { partnerDocRefSchema } from "@/features/master-data/partner-doc-ref/data/partner-doc-ref.schema";

describe("partnerDocRefSchema", () => {
  describe("valid data", () => {
    it("accepts an object with only the required fields", () => {
      const result = partnerDocRefSchema.safeParse({
        countryId: 1,
        companyCode: "C001",
        partnerLegalityId: 3,
        partnerRoleId: 4,
        documentNameId: 15,
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts a fully populated valid object", () => {
      const result = partnerDocRefSchema.safeParse({
        countryId: 1,
        companyCode: "C001",
        partnerCategoryId: 1,
        partnerClassificationId: 2,
        partnerLegalityId: 3,
        partnerRoleId: 4,
        partnerTypeId: 1,
        partnerSubTypeId: 1,
        documentNameId: 15,
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts isActive as optional", () => {
      const result = partnerDocRefSchema.safeParse({
        countryId: 1,
        companyCode: "C001",
        partnerLegalityId: 3,
        partnerRoleId: 4,
        documentNameId: 16,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(true);
      }
    });
  });

  describe("optional partner fields", () => {
    it("accepts partnerCategoryId as null", () => {
      const result = partnerDocRefSchema.safeParse({
        countryId: 1,
        companyCode: "C001",
        partnerCategoryId: null,
        partnerLegalityId: 3,
        partnerRoleId: 4,
        documentNameId: 15,
      });

      expect(result.success).toBe(true);
    });

    it("accepts partnerTypeId and partnerSubTypeId as null", () => {
      const result = partnerDocRefSchema.safeParse({
        countryId: 1,
        companyCode: "C001",
        partnerTypeId: null,
        partnerSubTypeId: null,
        partnerLegalityId: 3,
        partnerRoleId: 4,
        documentNameId: 15,
      });

      expect(result.success).toBe(true);
    });

    it("rejects partnerCategoryId as 0", () => {
      const result = partnerDocRefSchema.safeParse({
        countryId: 1,
        companyCode: "C001",
        partnerCategoryId: 0,
        partnerLegalityId: 3,
        partnerRoleId: 4,
        documentNameId: 15,
      });

      expect(result.success).toBe(false);
    });
  });

  describe("countryId validation", () => {
    it("rejects countryId as 0", () => {
      const result = partnerDocRefSchema.safeParse({
        countryId: 0,
        companyCode: "C001",
        partnerLegalityId: 3,
        partnerRoleId: 4,
        documentNameId: 15,
      });

      expect(result.success).toBe(false);
    });
  });

  describe("companyCode validation", () => {
    it("rejects empty companyCode", () => {
      const result = partnerDocRefSchema.safeParse({
        countryId: 1,
        companyCode: "",
        partnerLegalityId: 3,
        partnerRoleId: 4,
        documentNameId: 15,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find(
          (issue) => issue.path[0] === "companyCode",
        );
        expect(error?.message).toBe("Company code is required");
      }
    });

    it("rejects companyCode exceeding 100 characters", () => {
      const result = partnerDocRefSchema.safeParse({
        countryId: 1,
        companyCode: "A".repeat(101),
        partnerLegalityId: 3,
        partnerRoleId: 4,
        documentNameId: 15,
      });

      expect(result.success).toBe(false);
    });
  });

  describe("partnerLegalityId validation", () => {
    it("rejects partnerLegalityId as 0", () => {
      const result = partnerDocRefSchema.safeParse({
        countryId: 1,
        companyCode: "C001",
        partnerLegalityId: 0,
        partnerRoleId: 4,
        documentNameId: 15,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find(
          (issue) => issue.path[0] === "partnerLegalityId",
        );
        expect(error?.message).toBe("Partner legality is required");
      }
    });
  });

  describe("partnerRoleId validation", () => {
    it("rejects partnerRoleId as 0", () => {
      const result = partnerDocRefSchema.safeParse({
        countryId: 1,
        companyCode: "C001",
        partnerLegalityId: 3,
        partnerRoleId: 0,
        documentNameId: 15,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find(
          (issue) => issue.path[0] === "partnerRoleId",
        );
        expect(error?.message).toBe("Partner role is required");
      }
    });
  });

  describe("documentNameId validation", () => {
    it("rejects documentNameId as 0", () => {
      const result = partnerDocRefSchema.safeParse({
        countryId: 1,
        companyCode: "C001",
        partnerLegalityId: 3,
        partnerRoleId: 4,
        documentNameId: 0,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find(
          (issue) => issue.path[0] === "documentNameId",
        );
        expect(error?.message).toBe("Document name is required");
      }
    });

    it("rejects negative documentNameId", () => {
      const result = partnerDocRefSchema.safeParse({
        countryId: 1,
        companyCode: "C001",
        partnerLegalityId: 3,
        partnerRoleId: 4,
        documentNameId: -1,
      });

      expect(result.success).toBe(false);
    });
  });
});
