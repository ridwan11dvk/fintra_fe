import { describe, expect, it } from "vitest";
import {
  postingAssetFormSchema,
  postingAssetListFilterSchema,
} from "@/features/monitoring/posting-asset/data/posting-asset.schema";

describe("postingAssetListFilterSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid filter object", () => {
      const result = postingAssetListFilterSchema.safeParse({
        search: "test",
        sapStatus: "S",
        reversalFlag: "A",
        postingStatus: 1,
        startPostingDate: "2024-01-01",
        endPostingDate: "2024-12-31",
        startEntryDate: "2024-01-01",
        endEntryDate: "2024-12-31",
        startDocumentDate: "2024-01-01",
        endDocumentDate: "2024-12-31",
        page: 1,
        size: 10,
      });

      expect(result.success).toBe(true);
    });

    it("accepts only required fields (page, size)", () => {
      const result = postingAssetListFilterSchema.safeParse({
        page: 0,
        size: 10,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("date validation", () => {
    it("rejects invalid date format for startPostingDate", () => {
      const result = postingAssetListFilterSchema.safeParse({
        page: 0,
        size: 10,
        startPostingDate: "01-01-2024",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find(
          (i) => i.path[0] === "startPostingDate",
        );
        expect(err?.message).toBe("Invalid date format (YYYY-MM-DD)");
      }
    });
  });

  describe("page/size validation", () => {
    it("rejects negative page", () => {
      const result = postingAssetListFilterSchema.safeParse({
        page: -1,
        size: 10,
      });

      expect(result.success).toBe(false);
    });

    it("rejects size exceeding 100", () => {
      const result = postingAssetListFilterSchema.safeParse({
        page: 0,
        size: 101,
      });

      expect(result.success).toBe(false);
    });

    it("rejects size less than 1", () => {
      const result = postingAssetListFilterSchema.safeParse({
        page: 0,
        size: 0,
      });

      expect(result.success).toBe(false);
    });
  });
});

describe("postingAssetFormSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = postingAssetFormSchema.safeParse({
        transactionCode: "TC01",
        reversalFlag: "A",
        documentType: "DR",
        documentDate: "20240115",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "1234567890",
        businessArea: "BA01",
        fileName: "file.xlsx",
        recordNumber: "001",
        withholdingTax: "PPh23",
        postingDate: "20240115",
        reference: "REF-001",
        alternativeAccount: "0987654321",
        amount: 1000000,
        segment: "SEG01",
        fixedAssetNumber: "FA001",
        costCenter: "CC001",
        profitCenter: "PC001",
        assignment: "ASG-001",
        vendor: "V123",
        customer: "C456",
        fiscalYear: 2024,
        sourceBusinessArea: "SBA",
        virtualAccount: "VA-001",
        wwrvc: "WWRVC01",
        kndnr: "KND001",
        wwprd: "WWPRD0",
        valueDate: "20240115",
      });

      expect(result.success).toBe(true);
    });

    it("accepts only required fields", () => {
      const result = postingAssetFormSchema.safeParse({
        transactionCode: "TC01",
        reversalFlag: "A",
        documentType: "DR",
        documentDate: "20240115",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "1234567890",
        businessArea: "BA01",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("transactionCode validation", () => {
    it("rejects empty transactionCode", () => {
      const result = postingAssetFormSchema.safeParse({
        transactionCode: "",
        reversalFlag: "A",
        documentType: "DR",
        documentDate: "20240115",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "1234567890",
        businessArea: "BA01",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find(
          (i) => i.path[0] === "transactionCode",
        );
        expect(err?.message).toBe("Required");
      }
    });

    it("rejects transactionCode exceeding 4 characters", () => {
      const result = postingAssetFormSchema.safeParse({
        transactionCode: "12345",
        reversalFlag: "A",
        documentType: "DR",
        documentDate: "20240115",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "1234567890",
        businessArea: "BA01",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("documentType validation", () => {
    it("rejects empty documentType", () => {
      const result = postingAssetFormSchema.safeParse({
        transactionCode: "TC01",
        reversalFlag: "A",
        documentType: "",
        documentDate: "20240115",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "1234567890",
        businessArea: "BA01",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find(
          (i) => i.path[0] === "documentType",
        );
        expect(err?.message).toBe("Required");
      }
    });

    it("rejects documentType exceeding 2 characters", () => {
      const result = postingAssetFormSchema.safeParse({
        transactionCode: "TC01",
        reversalFlag: "A",
        documentType: "ABC",
        documentDate: "20240115",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "1234567890",
        businessArea: "BA01",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("documentDate validation", () => {
    it("rejects invalid documentDate format", () => {
      const result = postingAssetFormSchema.safeParse({
        transactionCode: "TC01",
        reversalFlag: "A",
        documentType: "DR",
        documentDate: "2024-01-15",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "1234567890",
        businessArea: "BA01",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find(
          (i) => i.path[0] === "documentDate",
        );
        expect(err?.message).toBe("Must be YYYYMMDD format");
      }
    });
  });

  describe("documentNumber validation", () => {
    it("rejects empty documentNumber", () => {
      const result = postingAssetFormSchema.safeParse({
        transactionCode: "TC01",
        reversalFlag: "A",
        documentType: "DR",
        documentDate: "20240115",
        documentNumber: "",
        debitCreditFlag: "S",
        accountNumber: "1234567890",
        businessArea: "BA01",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find(
          (i) => i.path[0] === "documentNumber",
        );
        expect(err?.message).toBe("Required");
      }
    });

    it("rejects documentNumber exceeding 25 characters", () => {
      const result = postingAssetFormSchema.safeParse({
        transactionCode: "TC01",
        reversalFlag: "A",
        documentType: "DR",
        documentDate: "20240115",
        documentNumber: "A".repeat(26),
        debitCreditFlag: "S",
        accountNumber: "1234567890",
        businessArea: "BA01",
      });

      expect(result.success).toBe(false);
    });

    it("accepts documentNumber at exactly 25 characters", () => {
      const result = postingAssetFormSchema.safeParse({
        transactionCode: "TC01",
        reversalFlag: "A",
        documentType: "DR",
        documentDate: "20240115",
        documentNumber: "A".repeat(25),
        debitCreditFlag: "S",
        accountNumber: "1234567890",
        businessArea: "BA01",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("accountNumber validation", () => {
    it("rejects empty accountNumber", () => {
      const result = postingAssetFormSchema.safeParse({
        transactionCode: "TC01",
        reversalFlag: "A",
        documentType: "DR",
        documentDate: "20240115",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "",
        businessArea: "BA01",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find(
          (i) => i.path[0] === "accountNumber",
        );
        expect(err?.message).toBe("Required");
      }
    });

    it("rejects accountNumber exceeding 10 characters", () => {
      const result = postingAssetFormSchema.safeParse({
        transactionCode: "TC01",
        reversalFlag: "A",
        documentType: "DR",
        documentDate: "20240115",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "12345678901",
        businessArea: "BA01",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("businessArea validation", () => {
    it("rejects empty businessArea", () => {
      const result = postingAssetFormSchema.safeParse({
        transactionCode: "TC01",
        reversalFlag: "A",
        documentType: "DR",
        documentDate: "20240115",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "1234567890",
        businessArea: "",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find(
          (i) => i.path[0] === "businessArea",
        );
        expect(err?.message).toBe("Business Area is required");
      }
    });
  });

  describe("reversalFlag validation", () => {
    it("rejects invalid reversalFlag", () => {
      const result = postingAssetFormSchema.safeParse({
        transactionCode: "TC01",
        reversalFlag: "C",
        documentType: "DR",
        documentDate: "20240115",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "1234567890",
        businessArea: "BA01",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("optional fields", () => {
    it("accepts optional fields as undefined", () => {
      const result = postingAssetFormSchema.safeParse({
        transactionCode: "TC01",
        reversalFlag: "A",
        documentType: "DR",
        documentDate: "20240115",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "1234567890",
        businessArea: "BA01",
        fileName: undefined,
        recordNumber: undefined,
        withholdingTax: undefined,
        postingDate: undefined,
        reference: undefined,
        alternativeAccount: undefined,
        amount: undefined,
        segment: undefined,
        fixedAssetNumber: undefined,
        costCenter: undefined,
        profitCenter: undefined,
        assignment: undefined,
        vendor: undefined,
        customer: undefined,
        fiscalYear: undefined,
      });

      expect(result.success).toBe(true);
    });

    it("rejects valueDate with invalid format", () => {
      const result = postingAssetFormSchema.safeParse({
        transactionCode: "TC01",
        reversalFlag: "A",
        documentType: "DR",
        documentDate: "20240115",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "1234567890",
        businessArea: "BA01",
        valueDate: "2024-01-15",
      });

      expect(result.success).toBe(false);
    });
  });
});
