/**
 * Business Unit Response
 */
export interface BusinessUnitResponse {
  id: string | number;
  code: string; // Business Unit ID
  name: string; // Business Unit Name
  parentBusinessUnit?: string;
  businessUnitType?: string;
  companyCode?: string;
  segment?: string;
  region?: string;
  status?: boolean | string;
  effectiveDate?: boolean | string;
  endDate?: boolean | string;
  createdBy?: string;
  createdDate?: boolean | string;
  lastUpdatedBy?: string;
  lastUpdatedDate?: boolean | string;
  description?: string;
  isLinked?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Business Unit Request
 */
export interface BusinessUnitRequest {
  code: string;
  name: string;
  parentBusinessUnit?: string;
  businessUnitType?: string;
  companyCode?: string;
  segment?: string;
  region?: string;
  status?: boolean | string;
  effectiveDate?: boolean | string;
  endDate?: boolean | string;
  createdBy?: string;
  createdDate?: boolean | string;
  lastUpdatedBy?: string;
  lastUpdatedDate?: boolean | string;
  description?: string;
  isLinked?: boolean;
  isActive?: boolean;
}

/**
 * Action Handlers for Business Unit Table
 */
export interface BusinessUnitActionHandlers {
  onView?: (item: BusinessUnitResponse) => void;
  onToggle?: (item: BusinessUnitResponse) => void;
  onLink?: (item: BusinessUnitResponse) => void;
  onEdit?: (item: BusinessUnitResponse) => void;
  onDelete?: (item: BusinessUnitResponse) => void;
}
