export const getStatusVariant = (status: string) => {
  switch (status) {
    // draft
    case "DRAFT": return "warning-outline";

    //rejected
    case "MANAGER_REJECTED":
    case "VP_REJECTED":
    case "FRT_REJECTED":
    case "SPECIALIST_REJECTED":
    case "REGIONAL_FINANCE_REJECTED":
    case "ADMIN_REJECTED":
    case "DJP_REJECTED":
      return "destructive";

    // approved
    case "MANAGER_APPROVED":
    case "VP_APPROVED":
    case "FRT_APPROVED":
    case "SPECIALIST_APPROVED":
    case "REGIONAL_FINANCE_APPROVED":
    case "ADMIN_VALIDATED":
    case "ADMIN_APPROVED":
    case "DJP_APPROVED":
      return "success";

    // review
    case "MANAGER_REVIEW":
    case "VP_REVIEW":
    case "FRT_REVIEW":
    case "SPECIALIST_REVIEW":
    case "REGIONAL_FINANCE_REVIEW":
    case "ADMIN_REVIEW":
      return "warning";

    // active
    case "ACTIVE": return "default";

    // admin processed
    case "ADMIN_PROSESSED": return "purple-outline";

    // default
    default:
      return "outline";
  }
};

export const formatStatusText = (status: string) => {
  if (!status) return "-";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
