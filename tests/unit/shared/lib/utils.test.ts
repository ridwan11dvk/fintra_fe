import { getCurrencyLabel, getCurrencySymbol, mapRolesToIds } from "@/shared/lib/utils";
import { describe, expect, it } from "vitest";

describe("getCurrencyLabel", () => {
  it("maps code 0 to IDR", () => {
    expect(getCurrencyLabel("0")).toBe("IDR");
  });

  it("maps code 1 to USD", () => {
    expect(getCurrencyLabel("1")).toBe("USD");
  });

  it("returns dash for unknown codes", () => {
    expect(getCurrencyLabel("9")).toBe("-");
  });
});

describe("getCurrencySymbol", () => {
  it("defaults to Rp for empty currency", () => {
    expect(getCurrencySymbol()).toBe("Rp");
    expect(getCurrencySymbol(null)).toBe("Rp");
    expect(getCurrencySymbol("")).toBe("Rp");
  });

  it("returns static symbols for known currencies", () => {
    expect(getCurrencySymbol("idr")).toBe("Rp");
    expect(getCurrencySymbol("USD")).toBe("$");
    expect(getCurrencySymbol("eur")).toBe("€");
    expect(getCurrencySymbol("GBP")).toBe("£");
    expect(getCurrencySymbol("JPY")).toBe("¥");
    expect(getCurrencySymbol("sgd")).toBe("S$");
    expect(getCurrencySymbol("MYR")).toBe("RM");
  });

  it("extracts a symbol via Intl formatting for other currencies", () => {
    expect(getCurrencySymbol("BRL")).toBe("R$");
  });

  it("falls back to the cleaned code when Intl fails", () => {
    expect(getCurrencySymbol("XYZ")).toBe("XYZ");
  });
});

describe("mapRolesToIds", () => {
  it("returns an empty array for undefined roles", () => {
    expect(mapRolesToIds(undefined)).toEqual([]);
  });

  it("maps roles to their ids", () => {
    expect(
      mapRolesToIds([
        { id: 1, name: "Admin" },
        { id: 5, name: "Viewer" },
      ] as never),
    ).toEqual([1, 5]);
  });
});
