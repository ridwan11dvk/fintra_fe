import { describe, expect, it } from "vitest";
import { countrySchema } from "@/features/master-data/country/data/country.schema";

describe("countrySchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = countrySchema.safeParse({
        name: "Indonesia",
        iso2Code: "ID",
        iso3Code: "IDN",
        dialCode: "+62",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts optional fields as empty strings", () => {
      const result = countrySchema.safeParse({
        name: "Test Country",
        iso2Code: "",
        iso3Code: "",
        dialCode: "",
        isActive: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.iso2Code).toBeUndefined();
        expect(result.data.iso3Code).toBeUndefined();
        expect(result.data.dialCode).toBeUndefined();
      }
    });

    it("accepts isActive as false", () => {
      const result = countrySchema.safeParse({
        name: "Test Country",
        isActive: false,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(false);
      }
    });
  });

  describe("name validation", () => {
    it("rejects empty name", () => {
      const result = countrySchema.safeParse({
        name: "",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "name");
        expect(err?.message).toBe("Country name is required");
      }
    });

    it("rejects name exceeding 100 characters", () => {
      const result = countrySchema.safeParse({
        name: "A".repeat(101),
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("accepts name at exactly 100 characters", () => {
      const result = countrySchema.safeParse({
        name: "A".repeat(100),
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("iso2Code validation", () => {
    it("rejects iso2Code with 1 character", () => {
      const result = countrySchema.safeParse({
        name: "Test",
        iso2Code: "I",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "iso2Code");
        expect(err?.message).toBe(
          "ISO 2 code must be exactly 2 characters",
        );
      }
    });

    it("rejects iso2Code with 3 characters", () => {
      const result = countrySchema.safeParse({
        name: "Test",
        iso2Code: "IDN",
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("transforms iso2Code to uppercase", () => {
      const result = countrySchema.safeParse({
        name: "Test",
        iso2Code: "id",
        isActive: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.iso2Code).toBe("ID");
      }
    });
  });

  describe("iso3Code validation", () => {
    it("rejects iso3Code with 2 characters", () => {
      const result = countrySchema.safeParse({
        name: "Test",
        iso3Code: "ID",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "iso3Code");
        expect(err?.message).toBe(
          "ISO 3 code must be exactly 3 characters",
        );
      }
    });

    it("rejects iso3Code with 4 characters", () => {
      const result = countrySchema.safeParse({
        name: "Test",
        iso3Code: "IDNN",
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("transforms iso3Code to uppercase", () => {
      const result = countrySchema.safeParse({
        name: "Test",
        iso3Code: "idn",
        isActive: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.iso3Code).toBe("IDN");
      }
    });
  });

  describe("dialCode validation", () => {
    it("rejects dialCode without plus sign", () => {
      const result = countrySchema.safeParse({
        name: "Test",
        dialCode: "62",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "dialCode");
        expect(err?.message).toBe(
          "Dial code must start with + followed by numbers (e.g., +62)",
        );
      }
    });

    it("rejects dialCode with letters after plus", () => {
      const result = countrySchema.safeParse({
        name: "Test",
        dialCode: "+abc",
        isActive: true,
      });

      expect(result.success).toBe(false);
    });
  });

  describe("isActive validation", () => {
    it("accepts isActive as true", () => {
      const result = countrySchema.safeParse({
        name: "Test",
        isActive: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(true);
      }
    });

    it("accepts isActive as false", () => {
      const result = countrySchema.safeParse({
        name: "Test",
        isActive: false,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(false);
      }
    });

    it("rejects isActive when not provided", () => {
      const result = countrySchema.safeParse({
        name: "Test",
      });

      expect(result.success).toBe(false);
    });
  });
});
