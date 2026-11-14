/**
 * Revenue Center response — local until @railfinance/core ships RevenueCenterResponse.
 */
export interface RevenueCenterResponse {
  id: number;
  code: string;
  name: string;
  parent: string | "";
  segmentId: string | "";
  businessUnitId: string | "";
  isActive: boolean;
}

/**
 * Revenue Center Request - Payload for create and update operations
 */
export interface RevenueCenterRequest {
  code: string;
  name: string;
  parent: string | "";
  segmentId: string | "";
  businessUnitId: string | "";
  isActive: boolean;
}
