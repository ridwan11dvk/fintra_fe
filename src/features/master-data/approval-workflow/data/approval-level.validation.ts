import { z } from "zod";
import type { ApprovalLevelItem, ApprovalLimitRow } from "./approval-workflow.types";

/** Match role names against the active master Role options. */
export const getApprovalRoleSchema = (validRoles: string[]) =>
  z.string().refine((role) => validRoles.includes(role), {
    message: "Please select an active Role Name",
  });

/** Returns an error message when basic level fields are incomplete; otherwise null. */
export function validateBasicFields(
  category: string,
  name: string,
  outputStep: string,
  roleSetting: "manually" | "limit-based",
  roleName: string,
): string | null {
  if (!category) {
    return "Please select a Stage Process Category";
  }
  if (!name) {
    return "Please select a Stage Process Name";
  }
  if (!outputStep?.trim()) {
    return "Please enter an Output Step";
  }
  if (roleSetting === "manually" && !roleName?.trim()) {
    return "Please select a Role Name";
  }
  return null;
}

/** Returns an error message for a single limit tier, or null when valid. */
export function validateLimitRow(
  limits: ApprovalLimitRow[],
  i: number,
  limit: ApprovalLimitRow,
  validRoles: string[],
): string | null {
  const min = Number(String(limit.minAmount).replaceAll(/[^\d]/g, "") || "0");
  const max = Number(String(limit.maxAmount).replaceAll(/[^\d]/g, "") || "0");

  if (i === 0 && min !== 0) {
    return "The minimum amount of the first limit must start from 0";
  }
  if (max <= 0) {
    return `Maximum amount for Limit ${i + 1} cannot be 0 and must be greater than minimum amount`;
  }
  if (max <= min) {
    return `Maximum amount for Limit ${i + 1} must be greater than minimum amount`;
  }
  if (!limit.roleName?.trim()) {
    return `Please select a Role Name for Limit ${i + 1}`;
  }
  if (validRoles.length > 0 && !validRoles.includes(limit.roleName.trim())) {
    return `Please select a valid Role Name for Limit ${i + 1}`;
  }
  if (i > 0) {
    const prevMax = Number(
      String(limits[i - 1].maxAmount).replaceAll(/[^\d]/g, "") || "0",
    );
    if (min < prevMax) {
      return `Minimum amount for Limit ${i + 1} must be greater than or equal to previous maximum amount`;
    }
  }
  return null;
}

/** Returns an error message when limit tiers are invalid; otherwise null. */
export function validateLimits(
  limits: ApprovalLimitRow[],
  validRoles: string[],
): string | null {
  if (limits.length === 0) {
    return "Please add at least one limit rule";
  }
  for (let i = 0; i < limits.length; i++) {
    const errorMsg = validateLimitRow(limits, i, limits[i], validRoles);
    if (errorMsg) return errorMsg;
  }
  return null;
}

/** Find the first level whose approver assignment needs correction. */
export function findInvalidApprovalRole(levels: ApprovalLevelItem[], validRoles: string[]) {
  const roleSchema = getApprovalRoleSchema(validRoles);
  for (const level of levels) {
    let error: string | null = null;
    if (level.roleSetting === "limit-based") {
      error = validateLimits(level.limits || [], validRoles);
    } else {
      const result = roleSchema.safeParse(level.roleName || "");
      if (!result.success) error = result.error.issues[0].message;
    }
    if (error) return { level: { ...level, roleName: undefined }, error };
  }
  return undefined;
}
