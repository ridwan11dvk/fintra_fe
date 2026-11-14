import type {
  VaultBillingType,
  VaultDepositType,
  VaultPaymentStatus,
  VaultPostingA8Status,
} from "@/features/treasury";
import type { BadgeVariantType } from "@railfinance/core/ui/badge";

// ============================================================================
// DIGITAL VAULT - URLS & VARIANT HELPERS
// ============================================================================
export const DIGITAL_VAULT_LIST_PAGE_TITLE = "Deposit Box";
export const DIGITAL_VAULT_STATION_LIST_PAGE_TITLE =
  DIGITAL_VAULT_LIST_PAGE_TITLE + " - Station Summary";
export const DIGITAL_VAULT_BASE = "deposit";
export const DIGITAL_VAULT_URL = "/treasury/" + DIGITAL_VAULT_BASE;

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const DIGITAL_VAULT_PERMISSION = "treasury:deposit:";
export const DIGITAL_VAULT_LIST_PERMISSION = DIGITAL_VAULT_PERMISSION + "list";
export const DIGITAL_VAULT_READ_PERMISSION = DIGITAL_VAULT_PERMISSION + "read";
export const DIGITAL_VAULT_CREATE_PERMISSION =
  DIGITAL_VAULT_PERMISSION + "create";
export const DIGITAL_VAULT_UPDATE_PERMISSION =
  DIGITAL_VAULT_PERMISSION + "update";
export const DIGITAL_VAULT_DELETE_PERMISSION =
  DIGITAL_VAULT_PERMISSION + "delete";

export const closuredetailUrl = (stationName: string) =>
  `${DIGITAL_VAULT_URL}/${encodeURIComponent(stationName)}/closures`;

// ============================================================================
// ENUM HELPERS (for display labels)
// ============================================================================

export const VAULT_PAYMENT_STATUS_LABELS: Record<VaultPaymentStatus, string> = {
  0: "OPEN",
  1: "COMPLETE",
};

export const VAULT_BILLING_TYPE_LABELS: Record<VaultBillingType, string> = {
  DEPOSIT: "Deposit",
  CREDIT: "Credit",
  COMPLETE: "Complete",
  INQUIRY: "Inquiry",
  "-": "No Deposit",
};

export const VAULT_SAP_POSTING_STATUS_LABELS: Record<
  NonNullable<VaultPostingA8Status> | "NOT_POSTED",
  string
> = {
  1: "In Progress",
  2: "Success",
  5: "Failed",
  NOT_POSTED: "Not Posted",
};

export const VAULT_DEPOSIT_TYPE_LABELS: Record<VaultDepositType, string> = {
  1: "Digital Vault",
  2: "Teller",
  3: "BRILink",
};

export const getBillingTypeVariant = (type: string) => {
  const variants: Record<string, BadgeVariantType> = {
    DEPOSIT: "default-outline",
    CREDIT: "warning-outline",
    COMPLETE: "purple-outline",
    INQUIRY: "info-outline",
    "-": "outline",
  };
  return variants[type] || "outline";
};

export const getSAPStatusVariant = (status: 1 | 2 | 5 | null) => {
  const variants: Record<string, BadgeVariantType> = {
    "1": "secondary", // INPROGRESS
    "2": "default", // SUCCESS
    "5": "destructive", // FAILED
    NOT_POSTED: "black",
  };
  return variants[status?.toString() || "NOT_POSTED"] || "black";
};

export const getPaymentStatusVariant = (status: 0 | 1) => {
  return status === 1 ? "default" : "secondary";
};
