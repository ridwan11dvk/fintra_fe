export const SEGMENT_LIST_PAGE_TITLE = "Segment";
export const SEGMENT_BASE = "segment";
export const SEGMENT_URL = `/master-data/${SEGMENT_BASE}`;
export const SEGMENT_CREATE_URL = `${SEGMENT_URL}/create`;
export const segmentDetailUrl = (segmentId: string) => `${SEGMENT_URL}/${segmentId}`;
export const segmentEditUrl = (segmentId: string) => `${segmentDetailUrl(segmentId)}/edit`;

export const SEGMENT_PERMISSION = "master-data:segment:";
export const SEGMENT_LIST_PERMISSION = `${SEGMENT_PERMISSION}list`;
export const SEGMENT_CREATE_PERMISSION = `${SEGMENT_PERMISSION}create`;
export const SEGMENT_EDIT_PERMISSION = `${SEGMENT_PERMISSION}edit`;
export const SEGMENT_DETAIL_PERMISSION = `${SEGMENT_PERMISSION}detail`;
