import type { SegmentRecord } from "../data/segment.types";

export const segmentColumns = [
  { key: "segmentId", title: "Segment ID" },
  { key: "segmentName", title: "Segment Name" },
  { key: "parentSegmentName", title: "Parent Segment" },
  { key: "description", title: "Description" },
] as const satisfies ReadonlyArray<{
  key: keyof SegmentRecord;
  title: string;
}>;
