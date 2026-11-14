import { describe, expect, it } from "vitest";
import {
  postingAutoFormSchema,
  postingAutoListFilterSchema,
} from "@/features/monitoring/posting-auto/data/posting-auto.schema";

describe("postingAutoListFilterSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid filter object", () => {
      const result = postingAutoListFilterSchema.safeParse({
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
      const result = postingAutoListFilterSchema.safeParse({
        page: 0,
        size: 10,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("date validation", () => {
    it("rejects invalid date format for startPostingDate", () => {
      const result = postingAutoListFilterSchema.safeParse({
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
      const result = postingAutoListFilterSchema.safeParse({
        page: -1,
        size: 10,
      });

      expect(result.success).toBe(false);
    });

    it("rejects size exceeding 100", () => {
      const result = postingAutoListFilterSchema.safeParse({
        page: 0,
        size: 101,
      });

      expect(result.success).toBe(false);
    });

    it("rejects size less than 1", () => {
      const result = postingAutoListFilterSchema.safeParse({
        page: 0,
        size: 0,
      });

      expect(result.success).toBe(false);
    });
  });
});

describe("postingAutoFormSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = postingAutoFormSchema.safeParse({
        transactionCode: "T001",
        reversalFlag: "A",
        documentType: "DT",
        documentDate: "20250101",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "ACC-001",
        businessArea: "BA01",
        fileName: "FILE001.DAT",
        recordNumber: "0001",
        withholdingTax: "10",
        postingDate: "20250101",
        reference: "REF-001",
        alternativeAccount: "ALT-001",
        amount: 1000000,
        segment: "SEG01",
        fixedAssetNumber: "FA-001",
        costCenter: "CC-001",
        profitCenter: "PC-001",
        assignment: "ASG-001",
        vendor: "V001",
        customer: "C001",
        fiscalYear: 2025,
        sourceBusinessArea: "SBA1",
        virtualAccount: "VA-001",
        wwrvc: "WWRVC001",
        kndnr: "KND001",
        wwprd: "WWPRD1",
        valueDate: "20250101",
      });

      expect(result.success).toBe(true);
    });

    it("accepts only required fields", () => {
      const result = postingAutoFormSchema.safeParse({
        transactionCode: "T001",
        reversalFlag: "A",
        documentType: "DT",
        documentDate: "20250101",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "ACC-001",
        businessArea: "BA01",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("transactionCode validation", () => {
    it("rejects empty transactionCode", () => {
      const result = postingAutoFormSchema.safeParse({
        transactionCode: "",
        reversalFlag: "A",
        documentType: "DT",
        documentDate: "20250101",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "ACC-001",
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
      const result = postingAutoFormSchema.safeParse({
        transactionCode: "12345",
        reversalFlag: "A",
        documentType: "DT",
        documentDate: "20250101",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "ACC-001",
        businessArea: "BA01",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("documentType validation", () => {
    it("rejects empty documentType", () => {
      const result = postingAutoFormSchema.safeParse({
        transactionCode: "T001",
        reversalFlag: "A",
        documentType: "",
        documentDate: "20250101",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "ACC-001",
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
      const result = postingAutoFormSchema.safeParse({
        transactionCode: "T001",
        reversalFlag: "A",
        documentType: "ABC",
        documentDate: "20250101",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "ACC-001",
        businessArea: "BA01",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("documentDate validation", () => {
    it("rejects invalid documentDate format", () => {
      const result = postingAutoFormSchema.safeParse({
        transactionCode: "T001",
        reversalFlag: "A",
        documentType: "DT",
        documentDate: "2025-01-01",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "ACC-001",
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
      const result = postingAutoFormSchema.safeParse({
        transactionCode: "T001",
        reversalFlag: "A",
        documentType: "DT",
        documentDate: "20250101",
        documentNumber: "",
        debitCreditFlag: "S",
        accountNumber: "ACC-001",
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
      const result = postingAutoFormSchema.safeParse({
        transactionCode: "T001",
        reversalFlag: "A",
        documentType: "DT",
        documentDate: "20250101",
        documentNumber: "A".repeat(26),
        debitCreditFlag: "S",
        accountNumber: "ACC-001",
        businessArea: "BA01",
      });

      expect(result.success).toBe(false);
    });

    it("accepts documentNumber at exactly 25 characters", () => {
      const result = postingAutoFormSchema.safeParse({
        transactionCode: "T001",
        reversalFlag: "A",
        documentType: "DT",
        documentDate: "20250101",
        documentNumber: "A".repeat(25),
        debitCreditFlag: "S",
        accountNumber: "ACC-001",
        businessArea: "BA01",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("accountNumber validation", () => {
    it("rejects empty accountNumber", () => {
      const result = postingAutoFormSchema.safeParse({
        transactionCode: "T001",
        reversalFlag: "A",
        documentType: "DT",
        documentDate: "20250101",
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
      const result = postingAutoFormSchema.safeParse({
        transactionCode: "T001",
        reversalFlag: "A",
        documentType: "DT",
        documentDate: "20250101",
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
      const result = postingAutoFormSchema.safeParse({
        transactionCode: "T001",
        reversalFlag: "A",
        documentType: "DT",
        documentDate: "20250101",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "ACC-001",
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
      const result = postingAutoFormSchema.safeParse({
        transactionCode: "T001",
        reversalFlag: "C",
        documentType: "DT",
        documentDate: "20250101",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "ACC-001",
        businessArea: "BA01",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("debitCreditFlag validation", () => {
    it("accepts S and H values", () => {
      const sResult = postingAutoFormSchema.safeParse({
        transactionCode: "T001",
        reversalFlag: "A",
        documentType: "DT",
        documentDate: "20250101",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "ACC-001",
        businessArea: "BA01",
      });

      const hResult = postingAutoFormSchema.safeParse({
        transactionCode: "T001",
        reversalFlag: "A",
        documentType: "DT",
        documentDate: "20250101",
        documentNumber: "DOC-001",
        debitCreditFlag: "H",
        accountNumber: "ACC-001",
        businessArea: "BA01",
      });

      expect(sResult.success).toBe(true);
      expect(hResult.success).toBe(true);
    });

    it("rejects invalid debitCreditFlag", () => {
      const result = postingAutoFormSchema.safeParse({
        transactionCode: "T001",
        reversalFlag: "A",
        documentType: "DT",
        documentDate: "20250101",
        documentNumber: "DOC-001",
        debitCreditFlag: "X",
        accountNumber: "ACC-001",
        businessArea: "BA01",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("optional fields", () => {
    it("accepts optional fields as undefined", () => {
      const result = postingAutoFormSchema.safeParse({
        transactionCode: "T001",
        reversalFlag: "A",
        documentType: "DT",
        documentDate: "20250101",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "ACC-001",
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
        sourceBusinessArea: undefined,
        virtualAccount: undefined,
        wwrvc: undefined,
        kndnr: undefined,
        wwprd: undefined,
        valueDate: undefined,
      });

      expect(result.success).toBe(true);
    });

    it("rejects valueDate with invalid format", () => {
      const result = postingAutoFormSchema.safeParse({
        transactionCode: "T001",
        reversalFlag: "A",
        documentType: "DT",
        documentDate: "20250101",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "ACC-001",
        businessArea: "BA01",
        valueDate: "2025-01-01",
      });

      expect(result.success).toBe(false);
    });

    it("rejects postingDate with invalid format", () => {
      const result = postingAutoFormSchema.safeParse({
        transactionCode: "T001",
        reversalFlag: "A",
        documentType: "DT",
        documentDate: "20250101",
        documentNumber: "DOC-001",
        debitCreditFlag: "S",
        accountNumber: "ACC-001",
        businessArea: "BA01",
        postingDate: "2025/01/01",
      });

      expect(result.success).toBe(false);
    });
  });
});
