import type { Role } from "@/features/settings";

export function getCurrencyLabel(code: string): string {
  switch (code) {
    case "0":
      return "IDR";
    case "1":
      return "USD";
    default:
      return "-";
  }
}

export function getCurrencySymbol(currency?: string | null): string {
  if (!currency) return "Rp";
  const cleanCode = currency.trim().toUpperCase();
  const staticSymbols: Record<string, string> = {
    IDR: "Rp",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CNY: "¥",
    CNH: "¥",
    SGD: "S$",
    AUD: "A$",
    CAD: "C$",
    HKD: "HK$",
    MYR: "RM",
  };
  if (staticSymbols[cleanCode]) {
    return staticSymbols[cleanCode];
  }
  try {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: cleanCode,
    }).format(0);
    return formatted.replaceAll(/[0-9\s.,-]/g, "") || cleanCode;
  } catch {
    return cleanCode;
  }
}

export const mapRolesToIds = (roles: Role[] | undefined): number[] => {
  if (!roles) return [];
  return roles.map((role) => role.id);
};
