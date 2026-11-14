import { describe, expect, it } from "vitest";
import { termOfPaymentSchema } from "@/features/master-data/term-of-payment/data/term-of-payment.schema";

describe("termOfPaymentSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = termOfPaymentSchema.safeParse({
        code: "NET_30",
        name: "Net 30",
        description: "Payment due within 30 days",
        numberOfDays: 30,
        calculationType: "CALENDAR_DAYS",
        discount: 5,
        discountType: "PERCENTAGE",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts a minimal valid object", () => {
      const result = termOfPaymentSchema.safeParse({
        code: "NET_60",
        name: "Net 60",
        numberOfDays: 60,
        calculationType: "WORKING_DAYS",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts optional fields as undefined", () => {
      const result = termOfPaymentSchema.safeParse({
        code: "COD",
        name: "Cash on Delivery",
        numberOfDays: 0,
        calculationType: "CALENDAR_DAYS",
        isActive: false,
        description: undefined,
        discount: undefined,
        discountType: undefined,
      });

      expect(result.success).toBe(true);
    });

    it("accepts discount as null", () => {
      const result = termOfPaymentSchema.safeParse({
        code: "NET_30",
        name: "Net 30",
        numberOfDays: 30,
        calculationType: "CALENDAR_DAYS",
        isActive: true,
        discount: null,
        discountType: null,
      });

      expect(result.success).toBe(true);
    });

    it("accepts numberOfDays as 0", () => {
      const result = termOfPaymentSchema.safeParse({
        code: "COD",
        name: "Cash on Delivery",
        numberOfDays: 0,
        calculationType: "CALENDAR_DAYS",
        isActive: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.numberOfDays).toBe(0);
      }
    });
  });

  describe("code validation", () => {
    it("rejects empty code", () => {
      const result = termOfPaymentSchema.safeParse({
        code: "",
        name: "Net 30",
        numberOfDays: 30,
        calculationType: "CALENDAR_DAYS",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find(
          (issue) => issue.path[0] === "code",
        );
        expect(error?.message).toBe("Code is required");
      }
    });

    it("rejects code exceeding 50 characters", () => {
      const result = termOfPaymentSchema.safeParse({
        code: "C".repeat(51),
        name: "Net 30",
        numberOfDays: 30,
        calculationType: "CALENDAR_DAYS",
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("accepts code at exactly 50 characters", () => {
      const result = termOfPaymentSchema.safeParse({
        code: "C".repeat(50),
        name: "Net 30",
        numberOfDays: 30,
        calculationType: "CALENDAR_DAYS",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("name validation", () => {
    it("rejects empty name", () => {
      const result = termOfPaymentSchema.safeParse({
        code: "NET_30",
        name: "",
        numberOfDays: 30,
        calculationType: "CALENDAR_DAYS",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find(
          (issue) => issue.path[0] === "name",
        );
        expect(error?.message).toBe("Name is required");
      }
    });

    it("rejects name exceeding 255 characters", () => {
      const result = termOfPaymentSchema.safeParse({
        code: "NET_30",
        name: "N".repeat(256),
        numberOfDays: 30,
        calculationType: "CALENDAR_DAYS",
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("accepts name at exactly 255 characters", () => {
      const result = termOfPaymentSchema.safeParse({
        code: "NET_30",
        name: "N".repeat(255),
        numberOfDays: 30,
        calculationType: "CALENDAR_DAYS",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("description validation", () => {
    it("rejects description exceeding 1000 characters", () => {
      const result = termOfPaymentSchema.safeParse({
        code: "NET_30",
        name: "Net 30",
        description: "D".repeat(1001),
        numberOfDays: 30,
        calculationType: "CALENDAR_DAYS",
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("accepts description at exactly 1000 characters", () => {
      const result = termOfPaymentSchema.safeParse({
        code: "NET_30",
        name: "Net 30",
        description: "D".repeat(1000),
        numberOfDays: 30,
        calculationType: "CALENDAR_DAYS",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("numberOfDays validation", () => {
    it("rejects negative numberOfDays", () => {
      const result = termOfPaymentSchema.safeParse({
        code: "NET_30",
        name: "Net 30",
        numberOfDays: -1,
        calculationType: "CALENDAR_DAYS",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find(
          (issue) => issue.path[0] === "numberOfDays",
        );
        expect(error?.message).toBe("Number of days must be 0 or greater");
      }
    });

    it("rejects numberOfDays with decimal", () => {
      const result = termOfPaymentSchema.safeParse({
        code: "NET_30",
        name: "Net 30",
        numberOfDays: 30.5,
        calculationType: "CALENDAR_DAYS",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find(
          (issue) => issue.path[0] === "numberOfDays",
        );
        expect(error?.message).toBe("Number of days must be a whole number");
      }
    });
  });

  describe("calculationType validation", () => {
    it("rejects empty calculationType", () => {
      const result = termOfPaymentSchema.safeParse({
        code: "NET_30",
        name: "Net 30",
        numberOfDays: 30,
        calculationType: "",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find(
          (issue) => issue.path[0] === "calculationType",
        );
        expect(error?.message).toBe("Calculation type is required");
      }
    });
  });

  describe("discount validation", () => {
    it("rejects negative discount", () => {
      const result = termOfPaymentSchema.safeParse({
        code: "NET_30",
        name: "Net 30",
        numberOfDays: 30,
        calculationType: "CALENDAR_DAYS",
        isActive: true,
        discount: -5,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find(
          (issue) => issue.path[0] === "discount",
        );
        expect(error?.message).toBe("Discount must be 0 or greater");
      }
    });

    it("accepts discount as 0", () => {
      const result = termOfPaymentSchema.safeParse({
        code: "NET_30",
        name: "Net 30",
        numberOfDays: 30,
        calculationType: "CALENDAR_DAYS",
        isActive: true,
        discount: 0,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("isActive validation", () => {
    it("accepts isActive as true", () => {
      const result = termOfPaymentSchema.safeParse({
        code: "NET_30",
        name: "Net 30",
        numberOfDays: 30,
        calculationType: "CALENDAR_DAYS",
        isActive: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(true);
      }
    });

    it("accepts isActive as false", () => {
      const result = termOfPaymentSchema.safeParse({
        code: "NET_30",
        name: "Net 30",
        numberOfDays: 30,
        calculationType: "CALENDAR_DAYS",
        isActive: false,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(false);
      }
    });
  });
});
