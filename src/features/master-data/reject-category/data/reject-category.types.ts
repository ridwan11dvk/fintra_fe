/**
 * Reject Category Request - Payload for create and update operations
 */
export interface RejectCategoryRequest {
  code?: string | null;
  name: string;
  description?: string;
  moduleId?: number;
  featureId?: number;
  isActive?: boolean;
}
