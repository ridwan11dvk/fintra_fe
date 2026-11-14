export type SegmentStatus = "ACTIVE" | "INACTIVE";

export interface SegmentRecord {
  /** Numeric Payable record id; absent for local fixtures. */
  backendId?: number;
  segmentId: string;
  segmentName: string;
  parentSegmentId: string | null;
  parentSegmentName?: string | null;
  description: string;
  status: SegmentStatus;
}

export interface SegmentInput {
  segmentId: string;
  segmentName: string;
  parentSegmentId: string | null;
  description?: string;
  status: SegmentStatus;
}

export interface SegmentListParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface SegmentListResult {
  items: SegmentRecord[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
