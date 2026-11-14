import { segmentQueryKeys } from "../data/segment.query";
import { segmentService } from "../data/segment.service";
import {
  SEGMENT_DETAIL_PERMISSION,
  SEGMENT_LIST_PAGE_TITLE,
  SEGMENT_URL,
  segmentEditUrl,
} from "../data/segment.utils";
import { Button } from "@railfinance/core/ui/button";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import styles from "../components/segment-detail.module.css";

export function SegmentDetailPage() {
  const { segmentId = "" } = useParams();
  const navigate = useNavigate();
  const segmentQuery = useQuery({
    queryKey: segmentQueryKeys.detail(segmentId),
    queryFn: () => segmentService.get(segmentId),
    enabled: Boolean(segmentId),
  });
  const segment = segmentQuery.data;

  return (
    <Page
      type="base"
      title="Segment Details"
      permission={import.meta.env.DEV ? undefined : SEGMENT_DETAIL_PERMISSION}
      breadcrumbs={[
        { title: "Master Data", url: "#" },
        { title: SEGMENT_LIST_PAGE_TITLE, url: SEGMENT_URL },
        { title: segment?.segmentName ?? segmentId, url: `${SEGMENT_URL}/${segmentId}` },
      ]}
    >
      <div className="border-b">
        <PageHeader title="View Segment" withBackButton={false} />
      </div>
      {segmentQuery.isPending && <output className="mt-6 block text-sm text-muted-foreground">Loading Segment…</output>}
      {segmentQuery.isError && <p className="mt-6 text-sm text-destructive" role="alert">{segmentQuery.error.message}</p>}
      {segment && (
        <section className="mt-6 border-b">
          <dl className={styles.details}>
            <div className={styles.row}><dt className={styles.label}>Segment ID</dt><dd className={styles.value}>{segment.segmentId}</dd></div>
            <div className={styles.row}><dt className={styles.label}>Segment Name</dt><dd className={styles.value}>{segment.segmentName}</dd></div>
            <div className={styles.row}><dt className={styles.label}>Parent Segment</dt><dd className={styles.value}>{segment.parentSegmentName ?? segment.parentSegmentId ?? "-"}</dd></div>
            <div className={styles.row}><dt className={styles.label}>Description</dt><dd className={`${styles.value} whitespace-pre-wrap`}>{segment.description || "-"}</dd></div>
            <div className={styles.row}><dt className={styles.label}>Status</dt><dd className={styles.value}>{segment.status === "ACTIVE" ? "Active" : "Inactive"}</dd></div>
          </dl>
        </section>
      )}
      <div className="mt-5 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => navigate(SEGMENT_URL)}>
          Back
        </Button>
        {segment && (
          <Button
            type="button"
            variant="default"
            onClick={() => navigate(segmentEditUrl(segment.segmentId))}
          >
            <Pencil aria-hidden="true" className="h-4 w-4" />
            Edit
          </Button>
        )}
      </div>
    </Page>
  );
}
