import { profitCenterQueryKeys } from "../data/profit-center.query";
import { profitCenterService } from "../data/profit-center.service";
import {
  PROFIT_CENTER_DETAIL_PERMISSION,
  PROFIT_CENTER_LIST_PAGE_TITLE,
  PROFIT_CENTER_URL,
  profitCenterEditUrl,
} from "../data/profit-center.utils";
import { Button } from "@railfinance/core/ui/button";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import styles from "../components/profit-center-detail.module.css";

export function ProfitCenterDetailPage() {
  const { profitCenterId = "" } = useParams();
  const navigate = useNavigate();
  const recordQuery = useQuery({
    queryKey: profitCenterQueryKeys.detail(profitCenterId),
    queryFn: () => profitCenterService.get(profitCenterId),
    enabled: Boolean(profitCenterId),
  });
  const record = recordQuery.data;

  return (
    <Page
      type="base"
      title="Profit Center Details"
      permission={import.meta.env.DEV ? undefined : PROFIT_CENTER_DETAIL_PERMISSION}
      breadcrumbs={[
        { title: "Master Data", url: "#" },
        { title: PROFIT_CENTER_LIST_PAGE_TITLE, url: PROFIT_CENTER_URL },
        { title: record?.profitCenterName ?? profitCenterId, url: `${PROFIT_CENTER_URL}/${profitCenterId}` },
      ]}
    >
      <div className="border-b">
        <PageHeader title="View Profit Center" withBackButton={false} />
      </div>
      {recordQuery.isPending && <output className="mt-6 block text-sm text-muted-foreground">Loading Profit Center…</output>}
      {recordQuery.isError && <p className="mt-6 text-sm text-destructive" role="alert">{recordQuery.error.message}</p>}
      {record && (
        <section className="mt-6 border-b">
          <dl className={styles.details}>
            <div className={styles.row}><dt className={styles.label}>Profit Center ID</dt><dd className={styles.value}>{record.profitCenterId}</dd></div>
            <div className={styles.row}><dt className={styles.label}>Profit Center Name</dt><dd className={styles.value}>{record.profitCenterName}</dd></div>
            <div className={styles.row}><dt className={styles.label}>Parent Profit Center</dt><dd className={styles.value}>{record.parentProfitCenterId || "-"}</dd></div>
            <div className={styles.row}><dt className={styles.label}>Segment</dt><dd className={styles.value}>{record.segmentName || record.segmentId || "-"}</dd></div>
            <div className={styles.row}><dt className={styles.label}>Business Unit ID</dt><dd className={styles.value}>{record.businessUnitId}</dd></div>
            <div className={styles.row}><dt className={styles.label}>Responsible Person</dt><dd className={styles.value}>{record.responsiblePerson || "-"}</dd></div>
            <div className={styles.row}><dt className={styles.label}>Status</dt><dd className={styles.value}>{record.status === "ACTIVE" ? "Active" : "Inactive"}</dd></div>
          </dl>
        </section>
      )}
      <div className="mt-5 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => navigate(PROFIT_CENTER_URL)}>Back</Button>
        {record && <Button type="button" onClick={() => navigate(profitCenterEditUrl(record.profitCenterId))}><Pencil aria-hidden="true" />Edit</Button>}
      </div>
    </Page>
  );
}
