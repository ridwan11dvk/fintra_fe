import { chequeRegisterSchema } from "@/features/master-data/cheque-register/data/cheque-register.schema";
import { describe, expect, it } from "vitest";

const openCheque = {
  chequeNumber: "CHQ-001",
  status: "OPEN" as const,
  releaseDate: "",
};

describe("chequeRegisterSchema FSSC-CHQ", () => {
  it("FSSC-CHQ-015: accepts one Cheque Number with Status Open", () => {
    expect(
      chequeRegisterSchema.safeParse({
        houseBankId: "hb-1",
        cheques: [openCheque],
        isActive: true,
      }).success,
    ).toBe(true);
  });

  it("FSSC-CHQ-016: rejects Add without House Bank", () => {
    expect(
      chequeRegisterSchema.safeParse({
        houseBankId: "",
        cheques: [openCheque],
        isActive: true,
      }).success,
    ).toBe(false);
  });

  it("FSSC-CHQ-017: rejects Add without Cheque Number", () => {
    expect(
      chequeRegisterSchema.safeParse({
        houseBankId: "hb-1",
        cheques: [{ ...openCheque, chequeNumber: "" }],
        isActive: true,
      }).success,
    ).toBe(false);
  });

  it("FSSC-CHQ-018: rejects Add without Status", () => {
    expect(
      chequeRegisterSchema.safeParse({
        houseBankId: "hb-1",
        cheques: [{ chequeNumber: "CHQ-001", releaseDate: "" }],
        isActive: true,
      }).success,
    ).toBe(false);
  });

  it("FSSC-CHQ-022: accepts Add with Status Booked", () => {
    expect(
      chequeRegisterSchema.safeParse({
        houseBankId: "hb-1",
        cheques: [{ chequeNumber: "CHQ-002", status: "BOOKED", releaseDate: "" }],
        isActive: true,
      }).success,
    ).toBe(true);
  });

  it("FSSC-CHQ-023: accepts Add with Status Cancel", () => {
    expect(
      chequeRegisterSchema.safeParse({
        houseBankId: "hb-1",
        cheques: [{ chequeNumber: "CHQ-003", status: "CANCEL", releaseDate: "" }],
        isActive: true,
      }).success,
    ).toBe(true);
  });

  it("FSSC-CHQ-026: accepts multiple Cheque Numbers in one batch", () => {
    expect(
      chequeRegisterSchema.safeParse({
        houseBankId: "hb-1",
        cheques: [
          openCheque,
          { chequeNumber: "CHQ-002", status: "OPEN", releaseDate: "" },
        ],
        isActive: true,
      }).success,
    ).toBe(true);
  });

  it("FSSC-CHQ-027: rejects bulk Add when Cheque Numbers duplicate in the batch", () => {
    expect(
      chequeRegisterSchema.safeParse({
        houseBankId: "hb-1",
        cheques: [openCheque, { ...openCheque, chequeNumber: "chq-001" }],
        isActive: true,
      }).success,
    ).toBe(false);
  });

  it("FSSC-CHQ-034: accepts Status change to RELEASE with Release Date", () => {
    expect(
      chequeRegisterSchema.safeParse({
        houseBankId: "hb-1",
        cheques: [
          {
            chequeNumber: "CHQ-004",
            status: "RELEASE",
            releaseDate: "2026-01-15",
          },
        ],
        isActive: true,
      }).success,
    ).toBe(true);
  });

  it("FSSC-CHQ-036: rejects Edit when Cheque Number is emptied", () => {
    expect(
      chequeRegisterSchema.safeParse({
        houseBankId: "hb-1",
        cheques: [{ chequeNumber: "  ", status: "OPEN", releaseDate: "" }],
        isActive: true,
      }).success,
    ).toBe(false);
  });

  it("FSSC-CHQ-037: rejects Edit when House Bank is emptied", () => {
    expect(
      chequeRegisterSchema.safeParse({
        houseBankId: "",
        cheques: [openCheque],
        isActive: true,
      }).success,
    ).toBe(false);
  });

  it("FSSC-CHQ-039: rejects Edit when Status is emptied", () => {
    expect(
      chequeRegisterSchema.safeParse({
        houseBankId: "hb-1",
        cheques: [{ chequeNumber: "CHQ-001", status: "", releaseDate: "" }],
        isActive: true,
      }).success,
    ).toBe(false);
  });
});
