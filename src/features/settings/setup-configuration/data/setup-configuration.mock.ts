import type {
  ComplianceFsscItem,
  FinancialControlValidationItem,
} from "./setup-configuration.types";

const COMPLIANCE_FSSC_STORAGE_KEY = "fintra_setup_compliance_fssc";
const FINANCIAL_CONTROL_STORAGE_KEY =
  "fintra_setup_financial_control_validation";

export const initialComplianceFsscMock: ComplianceFsscItem[] = [
  {
    id: "fssc-1",
    name: "Compliance 1",
    description: "Lorem ipsum",
  },
  {
    id: "fssc-2",
    name: "Compliance 1",
    description: "Lorem ipsum",
  },
];

export const getStoredComplianceFssc = (): ComplianceFsscItem[] => {
  if (typeof globalThis.window === "undefined") {
    return initialComplianceFsscMock;
  }
  try {
    const raw = globalThis.localStorage.getItem(COMPLIANCE_FSSC_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore error and fall back
  }
  return initialComplianceFsscMock;
};

export const saveStoredComplianceFssc = (
  items: ComplianceFsscItem[],
): ComplianceFsscItem[] => {
  if (typeof globalThis.window !== "undefined") {
    try {
      globalThis.localStorage.setItem(
        COMPLIANCE_FSSC_STORAGE_KEY,
        JSON.stringify(items),
      );
    } catch {
      // Ignore error
    }
  }
  return items;
};

export const initialFinancialControlValidationMock: FinancialControlValidationItem[] =
  [
    {
      id: "fcv-1",
      title: "Lorem ipsum",
      subTitle: "Lorem ipsum",
    },
    {
      id: "fcv-2",
      title: "Lorem ipsum",
      subTitle: "Lorem ipsum",
    },
  ];

export const getStoredFinancialControlValidation = (): FinancialControlValidationItem[] => {
  if (typeof globalThis.window === "undefined") {
    return initialFinancialControlValidationMock;
  }
  try {
    const raw = globalThis.localStorage.getItem(FINANCIAL_CONTROL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore error and fall back
  }
  return initialFinancialControlValidationMock;
};

export const saveStoredFinancialControlValidation = (
  items: FinancialControlValidationItem[],
): FinancialControlValidationItem[] => {
  if (typeof globalThis.window !== "undefined") {
    try {
      globalThis.localStorage.setItem(
        FINANCIAL_CONTROL_STORAGE_KEY,
        JSON.stringify(items),
      );
    } catch {
      // Ignore error
    }
  }
  return items;
};

