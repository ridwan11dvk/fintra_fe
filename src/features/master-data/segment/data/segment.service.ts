import type {
  SegmentInput,
  SegmentListParams,
  SegmentListResult,
  SegmentRecord,
} from "./segment.types";
import { segmentApiAdapter } from "./segment.api-adapter";
import { usePayableMasterDataApi } from "../../shared/payable-api";

async function getDevelopmentAdapter() {
  if (!import.meta.env.DEV) {
    throw new Error(
      "Segment API is not integrated. Development fixtures are disabled outside development mode.",
    );
  }

  return (await import("./segment.dev-adapter")).segmentDevAdapter;
}

export const segmentService = {
  async list(params?: SegmentListParams): Promise<SegmentListResult> {
    return usePayableMasterDataApi ? segmentApiAdapter.list(params) : (await getDevelopmentAdapter()).list(params);
  },

  async get(segmentId: string): Promise<SegmentRecord> {
    return usePayableMasterDataApi ? segmentApiAdapter.get(segmentId) : (await getDevelopmentAdapter()).get(segmentId);
  },

  async create(input: SegmentInput): Promise<SegmentRecord> {
    return usePayableMasterDataApi ? segmentApiAdapter.create(input) : (await getDevelopmentAdapter()).create(input);
  },

  async update(segmentId: string, input: SegmentInput): Promise<SegmentRecord> {
    return usePayableMasterDataApi ? segmentApiAdapter.update(segmentId, input) : (await getDevelopmentAdapter()).update(segmentId, input);
  },

  async setStatus(segmentId: string, status: SegmentRecord["status"]): Promise<SegmentRecord> {
    return usePayableMasterDataApi ? segmentApiAdapter.setStatus(segmentId, status) : (await getDevelopmentAdapter()).setStatus(segmentId, status);
  },

  async listParentOptions(currentSegmentId?: string): Promise<SegmentRecord[]> {
    return usePayableMasterDataApi ? segmentApiAdapter.listParentOptions(currentSegmentId) : (await getDevelopmentAdapter()).listParentOptions(currentSegmentId);
  },
};
