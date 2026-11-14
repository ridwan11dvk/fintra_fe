import type { ProfitCenterRecord } from "../data/profit-center.types";

export const profitCenterColumns = [
  { key: "profitCenterId", title: "Profit Center ID" },
  { key: "profitCenterName", title: "Profit Center Name" },
  { key: "parentProfitCenterId", title: "Parent Profit Center" },
  { key: "businessUnitId", title: "Business Unit ID" },
] as const satisfies ReadonlyArray<{ key: keyof ProfitCenterRecord; title: string }>;
