import { describe, expect, it } from "vitest";
import {
  partnerBankAccountSchema,
  partnerContactSchema,
  partnerDocumentSchema,
  partnerErpCodeSchema,
  partnerFormSchema,
  partnerTaxSchema,
  partnerVirtualAccountSchema,
} from "@/features/master-data/partner/data/partner.schema";

describe("partnerFormSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = partnerFormSchema.safeParse({
        name: "PT. Test Partner",
        partnerCode: "TST-001",
        npwpNumber: "01.234.567.8-999.000",
        companyEmail: "partner@test.com",
        companyPhoneNumber: "021-1234567",
        status: "ACTIVE",
      });
      expect(result.success).toBe(true);
    });

    it("accepts a minimal valid object with only required fields", () => {
      const result = partnerFormSchema.safeParse({
        name: "Partner A",
        partnerCode: "PA-001",
        npwpNumber: "01.234.567.8-999.000",
      });
      expect(result.success).toBe(true);
    });

    it("accepts optional fields as undefined", () => {
      const result = partnerFormSchema.safeParse({
        name: "Partner B",
        partnerCode: "PB-001",
        npwpNumber: "01.234.567.8-999.000",
        companyEmail: undefined,
        companyPhoneNumber: undefined,
        identityNumber: undefined,
      });
      expect(result.success).toBe(true);
    });

    it("defaults status to ACTIVE when not provided", () => {
      const result = partnerFormSchema.safeParse({
        name: "Partner C",
        partnerCode: "PC-001",
        npwpNumber: "01.234.567.8-999.000",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe("ACTIVE");
      }
    });

    it("defaults isValidatedByDjp to false", () => {
      const result = partnerFormSchema.safeParse({
        name: "Partner D",
        partnerCode: "PD-001",
        npwpNumber: "01.234.567.8-999.000",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isValidatedByDjp).toBe(false);
      }
    });

    it("defaults integratedToErp to false", () => {
      const result = partnerFormSchema.safeParse({
        name: "Partner E",
        partnerCode: "PE-001",
        npwpNumber: "01.234.567.8-999.000",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.integratedToErp).toBe(false);
      }
    });

    it("accepts empty string for companyEmail (empty literal)", () => {
      const result = partnerFormSchema.safeParse({
        name: "Partner F",
        partnerCode: "PF-001",
        npwpNumber: "01.234.567.8-999.000",
        companyEmail: "",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("npwpNumber validation", () => {
    it("rejects a missing npwpNumber", () => {
      const result = partnerFormSchema.safeParse({
        name: "Partner",
        partnerCode: "P-001",
        npwpNumber: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "npwpNumber");
        expect(err).toBeDefined();
      }
    });
  });

  describe("name validation", () => {
    it("rejects empty name", () => {
      const result = partnerFormSchema.safeParse({
        name: "",
        partnerCode: "TST-001",
        npwpNumber: "01.234.567.8-999.000",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "name");
        expect(err).toBeDefined();
      }
    });

    it("rejects name exceeding 255 characters", () => {
      const result = partnerFormSchema.safeParse({
        name: "A".repeat(256),
        partnerCode: "TST-001",
        npwpNumber: "01.234.567.8-999.000",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "name");
        expect(err).toBeDefined();
      }
    });

    it("accepts name at exactly 255 characters", () => {
      const result = partnerFormSchema.safeParse({
        name: "A".repeat(255),
        partnerCode: "TST-001",
        npwpNumber: "01.234.567.8-999.000",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("partnerCode validation", () => {
    it("rejects empty partnerCode", () => {
      const result = partnerFormSchema.safeParse({
        name: "Partner",
        partnerCode: "",
        npwpNumber: "01.234.567.8-999.000",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find(
          (i) => i.path[0] === "partnerCode",
        );
        expect(err).toBeDefined();
      }
    });

    it("rejects partnerCode exceeding 50 characters", () => {
      const result = partnerFormSchema.safeParse({
        name: "Partner",
        partnerCode: "A".repeat(51),
        npwpNumber: "01.234.567.8-999.000",
      });
      expect(result.success).toBe(false);
    });

    it("accepts partnerCode at exactly 50 characters", () => {
      const result = partnerFormSchema.safeParse({
        name: "Partner",
        partnerCode: "A".repeat(50),
        npwpNumber: "01.234.567.8-999.000",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("companyEmail validation", () => {
    it("rejects invalid email format", () => {
      const result = partnerFormSchema.safeParse({
        name: "Partner",
        partnerCode: "P-001",
        npwpNumber: "01.234.567.8-999.000",
        companyEmail: "not-an-email",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find(
          (i) => i.path[0] === "companyEmail",
        );
        expect(err).toBeDefined();
      }
    });

    it("accepts a valid email", () => {
      const result = partnerFormSchema.safeParse({
        name: "Partner",
        partnerCode: "P-001",
        npwpNumber: "01.234.567.8-999.000",
        companyEmail: "test@example.com",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("identityNumber validation", () => {
    it("rejects an unknown identityNumberType", () => {
      const result = partnerFormSchema.safeParse({
        name: "Partner",
        partnerCode: "P-001",
        npwpNumber: "01.234.567.8-999.000",
        identityNumber: "3173012345678910",
        identityNumberType: "UNKNOWN",
      });
      expect(result.success).toBe(false);
    });

    it("accepts a known identityNumberType", () => {
      const result = partnerFormSchema.safeParse({
        name: "Partner",
        partnerCode: "P-001",
        npwpNumber: "01.234.567.8-999.000",
        identityNumber: "3173012345678910",
        identityNumberType: "KITAS",
      });
      expect(result.success).toBe(true);
    });

    it("rejects identityNumber exceeding 50 characters", () => {
      const result = partnerFormSchema.safeParse({
        name: "Partner",
        partnerCode: "P-001",
        npwpNumber: "01.234.567.8-999.000",
        identityNumber: "1".repeat(51),
      });
      expect(result.success).toBe(false);
    });

    it("accepts identityNumber at exactly 50 characters", () => {
      const result = partnerFormSchema.safeParse({
        name: "Partner",
        partnerCode: "P-001",
        npwpNumber: "01.234.567.8-999.000",
        identityNumber: "1".repeat(50),
      });
      expect(result.success).toBe(true);
    });
  });

  describe("conditional validation (partnerCategoryId)", () => {
    describe("when partnerCategoryId is 1", () => {
      it("requires identityNumber", () => {
        const result = partnerFormSchema.safeParse({
          name: "Partner",
          partnerCode: "P-001",
          npwpNumber: "01.234.567.8-999.000",
          partnerCategoryId: 1,
          identityNumber: "",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          const err = result.error.issues.find(
            (i) => i.path[0] === "identityNumber",
          );
          expect(err?.message).toBe("Identity number is required");
        }
      });

      it("accepts when identityNumber is provided", () => {
        const result = partnerFormSchema.safeParse({
          name: "Partner",
          partnerCode: "P-001",
          npwpNumber: "01.234.567.8-999.000",
          partnerCategoryId: 1,
          identityNumber: "1234567890",
        });
        expect(result.success).toBe(true);
      });
    });

    describe("when partnerCategoryId is not 1", () => {
      it("does not require identityNumber", () => {
        const result = partnerFormSchema.safeParse({
          name: "Partner",
          partnerCode: "P-001",
          npwpNumber: "01.234.567.8-999.000",
          partnerCategoryId: 2,
          identityNumber: "",
        });
        expect(result.success).toBe(true);
      });
    });

    describe("when partnerCategoryId is not set", () => {
      it("does not require identityNumber", () => {
        const result = partnerFormSchema.safeParse({
          name: "Partner",
          partnerCode: "P-001",
          npwpNumber: "01.234.567.8-999.000",
          identityNumber: "",
        });
        expect(result.success).toBe(true);
      });
    });
  });
});

describe("partnerDocumentSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = partnerDocumentSchema.safeParse({
        documentName: "Contract 2024",
        documentType: "PDF",
        documentDate: "2024-01-01",
        documentNumber: "DOC-001",
        description: "Main contract",
        isActive: true,
      });
      expect(result.success).toBe(true);
    });

    it("accepts minimal valid object with only required fields", () => {
      const result = partnerDocumentSchema.safeParse({
        documentName: "Document A",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("documentName validation", () => {
    it("rejects empty documentName", () => {
      const result = partnerDocumentSchema.safeParse({ documentName: "" });
      expect(result.success).toBe(false);
    });

    it("rejects documentName exceeding 255 characters", () => {
      const result = partnerDocumentSchema.safeParse({
        documentName: "A".repeat(256),
      });
      expect(result.success).toBe(false);
    });

    it("accepts documentName at exactly 255 characters", () => {
      const result = partnerDocumentSchema.safeParse({
        documentName: "A".repeat(255),
      });
      expect(result.success).toBe(true);
    });
  });
});

describe("partnerContactSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = partnerContactSchema.safeParse({
        name: "Jane Doe",
        position: "Manager",
        department: "Sales",
        phoneNumber: "021-1234567",
        email: "jane@test.com",
        preferredCommChannel: "EMAIL",
      });
      expect(result.success).toBe(true);
    });

    it("accepts minimal valid object with only required name", () => {
      const result = partnerContactSchema.safeParse({ name: "Contact A" });
      expect(result.success).toBe(true);
    });

    it("accepts empty string for email", () => {
      const result = partnerContactSchema.safeParse({
        name: "Contact A",
        email: "",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("name validation", () => {
    it("rejects empty name", () => {
      const result = partnerContactSchema.safeParse({ name: "" });
      expect(result.success).toBe(false);
    });

    it("rejects name exceeding 255 characters", () => {
      const result = partnerContactSchema.safeParse({ name: "A".repeat(256) });
      expect(result.success).toBe(false);
    });
  });

  describe("email validation", () => {
    it("rejects invalid email format", () => {
      const result = partnerContactSchema.safeParse({
        name: "Contact",
        email: "invalid",
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("partnerTaxSchema", () => {
  it("accepts a valid tax object", () => {
    const result = partnerTaxSchema.safeParse({
      taxRateId: 1,
      active: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects taxRateId of zero", () => {
    const result = partnerTaxSchema.safeParse({ taxRateId: 0, active: true });
    expect(result.success).toBe(false);
  });

  it("rejects negative taxRateId", () => {
    const result = partnerTaxSchema.safeParse({
      taxRateId: -1,
      active: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing taxRateId", () => {
    const result = partnerTaxSchema.safeParse({ active: true });
    expect(result.success).toBe(false);
  });
});

describe("partnerBankAccountSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = partnerBankAccountSchema.safeParse({
        accountNumber: "1234567890",
        holderName: "PT. Test Partner",
        bankCenter: "BCA",
        bankBranch: "Jakarta",
        companyCode: "COMP01",
        currency: "IDR",
        swiftCode: "CENAIDJA",
        isDefaultPayment: true,
        active: true,
      });
      expect(result.success).toBe(true);
    });

    it("accepts minimal valid object", () => {
      const result = partnerBankAccountSchema.safeParse({
        accountNumber: "1234567890",
        holderName: "Holder Name",
      });
      expect(result.success).toBe(true);
    });

    it("defaults isDefaultPayment to false and active to true", () => {
      const result = partnerBankAccountSchema.safeParse({
        accountNumber: "1234567890",
        holderName: "Holder Name",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isDefaultPayment).toBe(false);
        expect(result.data.active).toBe(true);
      }
    });
  });

  describe("accountNumber validation", () => {
    it("rejects empty accountNumber", () => {
      const result = partnerBankAccountSchema.safeParse({
        accountNumber: "",
        holderName: "Holder",
      });
      expect(result.success).toBe(false);
    });

    it("rejects accountNumber exceeding 50 characters", () => {
      const result = partnerBankAccountSchema.safeParse({
        accountNumber: "1".repeat(51),
        holderName: "Holder",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("holderName validation", () => {
    it("rejects empty holderName", () => {
      const result = partnerBankAccountSchema.safeParse({
        accountNumber: "12345",
        holderName: "",
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("partnerVirtualAccountSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = partnerVirtualAccountSchema.safeParse({
        number: "1234567890",
        holder: "PT. Test Partner",
        bankCode: "BCA",
        type: "BANK",
        companyCode: "COMP01",
        active: true,
      });
      expect(result.success).toBe(true);
    });

    it("accepts minimal valid object", () => {
      const result = partnerVirtualAccountSchema.safeParse({
        number: "1234567890",
        holder: "Holder Name",
      });
      expect(result.success).toBe(true);
    });

    it("defaults active to true", () => {
      const result = partnerVirtualAccountSchema.safeParse({
        number: "1234567890",
        holder: "Holder Name",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.active).toBe(true);
      }
    });
  });

  describe("number validation", () => {
    it("rejects empty number", () => {
      const result = partnerVirtualAccountSchema.safeParse({
        number: "",
        holder: "Holder",
      });
      expect(result.success).toBe(false);
    });

    it("rejects number exceeding 50 characters", () => {
      const result = partnerVirtualAccountSchema.safeParse({
        number: "1".repeat(51),
        holder: "Holder",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("holder validation", () => {
    it("rejects empty holder", () => {
      const result = partnerVirtualAccountSchema.safeParse({
        number: "12345",
        holder: "",
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("partnerErpCodeSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = partnerErpCodeSchema.safeParse({
        erpCode: "ERP-001",
        companyCode: "COMP01",
        partnerClassificationId: 1,
        partnerCategoryId: 2,
        startDate: "2024-01-01",
      });
      expect(result.success).toBe(true);
    });

    it("accepts minimal valid object", () => {
      const result = partnerErpCodeSchema.safeParse({ erpCode: "ERP-001", startDate: "2024-01-01" });
      expect(result.success).toBe(true);
    });
  });

  describe("erpCode validation", () => {
    it("rejects empty erpCode", () => {
      const result = partnerErpCodeSchema.safeParse({ erpCode: "", startDate: "2024-01-01" });
      expect(result.success).toBe(false);
    });

    it("rejects erpCode exceeding 100 characters", () => {
      const result = partnerErpCodeSchema.safeParse({
        erpCode: "A".repeat(101),
        startDate: "2024-01-01",
      });
      expect(result.success).toBe(false);
    });

    it("accepts erpCode at exactly 100 characters", () => {
      const result = partnerErpCodeSchema.safeParse({
        erpCode: "A".repeat(100),
        startDate: "2024-01-01",
      });
      expect(result.success).toBe(true);
    });
  });
});
