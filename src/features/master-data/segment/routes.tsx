import { Route } from "react-router";
import { SEGMENT_BASE } from "./data/segment.utils";
import { SegmentCreateLazyPage, SegmentDetailLazyPage, SegmentEditLazyPage, SegmentListLazyPage } from "./pages";

export const segmentRoutes = (
  <Route>
    <Route path={SEGMENT_BASE} element={<SegmentListLazyPage />} />
    <Route path={`${SEGMENT_BASE}/create`} element={<SegmentCreateLazyPage />} />
    <Route path={`${SEGMENT_BASE}/:segmentId`} element={<SegmentDetailLazyPage />} />
    <Route path={`${SEGMENT_BASE}/:segmentId/edit`} element={<SegmentEditLazyPage />} />
  </Route>
);
