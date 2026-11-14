import { describe, expect, it } from "vitest";
import {
  companyFileEditSchema,
  companyFileSchema,
  companyFileWithFileSchema,
  companyFormSchema,
  fileValidationSchema,
} from "@/features/master-data/company/data/company.schema";

describe("fileValidationSchema", () => {
  describe("valid files", () => {
    it("accepts a valid File object within size limit", () => {
      const file = new File(["content"], "test.pdf", {
        type: "application/pdf",
      });
      const result = fileValidationSchema.safeParse(file);

      expect(result.success).toBe(true);
    });

    it("accepts a file at exactly the 10MB limit", () => {
      const buffer = new ArrayBuffer(10 * 1024 * 1024);
      const file = new File([buffer], "large.pdf", { type: "application/pdf" });
      const result = fileValidationSchema.safeParse(file);

      expect(result.success).toBe(true);
    });
  });

  describe("invalid files", () => {
    it("rejects a file exceeding 10MB limit", () => {
      const buffer = new ArrayBuffer(10 * 1024 * 1024 + 1);
      const file = new File([buffer], "toolarge.pdf", {
        type: "application/pdf",
      });
      const result = fileValidationSchema.safeParse(file);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "File size must be less than 10MB",
        );
      }
    });

    it("rejects non-File objects", () => {
      const result = fileValidationSchema.safeParse("not a file");

      expect(result.success).toBe(false);
    });
  });
});

describe("companyFormSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = companyFormSchema.safeParse({
        code: "COMP001",
        name: "PT Mitra Utama Indonesia",
        address: "Jl. Sudirman 123, Jakarta",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts a minimal valid object", () => {
      const result = companyFormSchema.safeParse({
        code: "TEST",
        name: "Test Company",
        isActive: false,
      });

      expect(result.success).toBe(true);
    });

    it("accepts optional address as undefined", () => {
      const result = companyFormSchema.safeParse({
        code: "TEST",
        name: "Test Company",
        isActive: true,
        address: undefined,
      });

      expect(result.success).toBe(true);
    });

    it("accepts optional address as null", () => {
      const result = companyFormSchema.safeParse({
        code: "TEST",
        name: "Test Company",
        isActive: true,
        address: null,
      });

      expect(result.success).toBe(true);
    });

    it("uses default isActive value of true when not provided", () => {
      const result = companyFormSchema.safeParse({
        code: "TEST",
        name: "Test Company",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(true);
      }
    });
  });

  describe("code validation", () => {
    it("rejects empty code", () => {
      const result = companyFormSchema.safeParse({
        code: "",
        name: "Test",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const codeError = result.error.issues.find(
          (issue) => issue.path[0] === "code",
        );
        expect(codeError?.message).toBe("Company code is required");
      }
    });

    it("rejects code exceeding 50 characters", () => {
      const result = companyFormSchema.safeParse({
        code: "A".repeat(51),
        name: "Test",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const codeError = result.error.issues.find(
          (issue) => issue.path[0] === "code",
        );
        expect(codeError?.message).toContain("must not exceed 50 characters");
      }
    });

    it("accepts code at exactly 50 characters", () => {
      const result = companyFormSchema.safeParse({
        code: "A".repeat(50),
        name: "Test",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("name validation", () => {
    it("rejects empty name", () => {
      const result = companyFormSchema.safeParse({
        code: "TEST",
        name: "",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find(
          (issue) => issue.path[0] === "name",
        );
        expect(nameError?.message).toBe("Company name is required");
      }
    });

    it("rejects name exceeding 255 characters", () => {
      const result = companyFormSchema.safeParse({
        code: "TEST",
        name: "A".repeat(256),
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find(
          (issue) => issue.path[0] === "name",
        );
        expect(nameError?.message).toContain("must not exceed 255 characters");
      }
    });

    it("accepts name at exactly 255 characters", () => {
      const result = companyFormSchema.safeParse({
        code: "TEST",
        name: "A".repeat(255),
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("address validation", () => {
    it("rejects address exceeding 255 characters", () => {
      const result = companyFormSchema.safeParse({
        code: "TEST",
        name: "Test",
        address: "A".repeat(256),
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const addressError = result.error.issues.find(
          (issue) => issue.path[0] === "address",
        );
        expect(addressError?.message).toContain(
          "must not exceed 255 characters",
        );
      }
    });

    it("accepts address at exactly 255 characters", () => {
      const result = companyFormSchema.safeParse({
        code: "TEST",
        name: "Test",
        address: "A".repeat(255),
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });
});

describe("companyFileSchema", () => {
  describe("valid data", () => {
    it("accepts fully populated valid object", () => {
      const result = companyFileSchema.safeParse({
        name: "Document 1",
        alias: "DOC1",
        documentDate: "2024-01-01",
        validFrom: "2024-01-01",
        validTo: "2024-12-31",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts minimal valid object (name and alias only)", () => {
      const result = companyFileSchema.safeParse({
        name: "Document",
        alias: "DOC",
      });

      expect(result.success).toBe(true);
    });

    it("accepts optional date fields as undefined", () => {
      const result = companyFileSchema.safeParse({
        name: "Document",
        alias: "DOC",
        documentDate: undefined,
        validFrom: undefined,
        validTo: undefined,
      });

      expect(result.success).toBe(true);
    });

    it("accepts optional date fields as null", () => {
      const result = companyFileSchema.safeParse({
        name: "Document",
        alias: "DOC",
        documentDate: null,
        validFrom: null,
        validTo: null,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("name validation", () => {
    it("rejects empty name", () => {
      const result = companyFileSchema.safeParse({
        name: "",
        alias: "DOC",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find(
          (issue) => issue.path[0] === "name",
        );
        expect(nameError?.message).toContain("is requred");
      }
    });

    it("rejects name exceeding 255 characters", () => {
      const result = companyFileSchema.safeParse({
        name: "A".repeat(256),
        alias: "DOC",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find(
          (issue) => issue.path[0] === "name",
        );
        expect(nameError?.message).toContain("must not exceed 255 characters");
      }
    });
  });

  describe("alias validation", () => {
    it("rejects empty alias", () => {
      const result = companyFileSchema.safeParse({
        name: "Document",
        alias: "",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const aliasError = result.error.issues.find(
          (issue) => issue.path[0] === "alias",
        );
        expect(aliasError?.message).toBe("Alias is required");
      }
    });

    it("rejects alias exceeding 255 characters", () => {
      const result = companyFileSchema.safeParse({
        name: "Document",
        alias: "A".repeat(256),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const aliasError = result.error.issues.find(
          (issue) => issue.path[0] === "alias",
        );
        expect(aliasError?.message).toContain("must not exceed 255 characters");
      }
    });
  });
});

describe("companyFileWithFileSchema", () => {
  describe("valid data", () => {
    it("accepts valid object with required file", () => {
      const file = new File(["content"], "test.pdf", {
        type: "application/pdf",
      });
      const result = companyFileWithFileSchema.safeParse({
        name: "Document",
        alias: "DOC",
        file,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("file validation", () => {
    it("rejects when file is missing", () => {
      const result = companyFileWithFileSchema.safeParse({
        name: "Document",
        alias: "DOC",
      });

      expect(result.success).toBe(false);
    });

    it("rejects when file exceeds size limit", () => {
      const buffer = new ArrayBuffer(10 * 1024 * 1024 + 1);
      const file = new File([buffer], "toolarge.pdf", {
        type: "application/pdf",
      });
      const result = companyFileWithFileSchema.safeParse({
        name: "Document",
        alias: "DOC",
        file,
      });

      expect(result.success).toBe(false);
    });
  });
});

describe("companyFileEditSchema", () => {
  describe("valid data", () => {
    it("accepts valid object without file (edit mode)", () => {
      const result = companyFileEditSchema.safeParse({
        name: "Document",
        alias: "DOC",
      });

      expect(result.success).toBe(true);
    });

    it("accepts valid object with file (replacing file)", () => {
      const file = new File(["content"], "test.pdf", {
        type: "application/pdf",
      });
      const result = companyFileEditSchema.safeParse({
        name: "Document",
        alias: "DOC",
        file,
      });

      expect(result.success).toBe(true);
    });

    it("accepts optional file as undefined", () => {
      const result = companyFileEditSchema.safeParse({
        name: "Document",
        alias: "DOC",
        file: undefined,
      });

      expect(result.success).toBe(true);
    });
  });
});
