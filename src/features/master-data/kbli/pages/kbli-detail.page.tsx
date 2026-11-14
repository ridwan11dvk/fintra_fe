import { kbliQueryKeys } from "../data/kbli.query";
import { kbliService } from "../data/kbli.service";
import { KBLI_DETAIL_PERMISSION, KBLI_LIST_PAGE_TITLE, KBLI_URL, kbliEditUrl } from "../data/kbli.utils";
import { Button } from "@railfinance/core/ui/button";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import styles from "../components/kbli-detail.module.css";

export function KbliDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const query = useQuery({ queryKey: kbliQueryKeys.detail(id), queryFn: () => kbliService.get(id), enabled: Boolean(id) });
  const record = query.data;
  return <Page type="base" title="KBLI Details" permission={import.meta.env.DEV ? undefined : KBLI_DETAIL_PERMISSION} breadcrumbs={[
    { title: "Master Data", url: "#" }, { title: KBLI_LIST_PAGE_TITLE, url: KBLI_URL }, { title: record?.code ?? id, url: `${KBLI_URL}/${id}` },
  ]}>
    <div className="border-b">
      <PageHeader title="View KBLI" withBackButton={false} />
    </div>
    {query.isPending && <output className="mt-6 block text-sm text-muted-foreground">Loading KBLI…</output>}
    {query.isError && <p className="mt-6 text-sm text-destructive" role="alert">{query.error.message}</p>}
    {record && (
      <section className="mt-6 border-b">
        <dl className={styles.details}>
          <div className={styles.row}><dt className={styles.label}>KBLI Code</dt><dd className={styles.value}>{record.code}</dd></div>
          <div className={styles.row}><dt className={styles.label}>Business Field Name</dt><dd className={styles.value}>{record.businessFieldName}</dd></div>
          <div className={styles.row}><dt className={styles.label}>Category/Golongan</dt><dd className={styles.value}>{record.category}</dd></div>
        </dl>
      </section>
    )}
    <div className="mt-5 flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => navigate(KBLI_URL)}>Back</Button>{record && <Button type="button" onClick={() => navigate(kbliEditUrl(record.id))}><Pencil aria-hidden="true" className="h-4 w-4" />Edit</Button>}</div>
  </Page>;
}
