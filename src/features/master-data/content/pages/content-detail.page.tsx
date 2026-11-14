import { contentService } from "../data/content.service";
import { CONTENT_DETAIL_PERMISSION, CONTENT_LIST_PAGE_TITLE, CONTENT_URL, contentEditUrl, contentQueryKeys } from "../data/content.utils";
import { Button } from "@railfinance/core/ui/button";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import styles from "../components/content-detail.module.css";

export function ContentDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const query = useQuery({ queryKey: contentQueryKeys.detail(id), queryFn: () => contentService.get(id), enabled: Boolean(id) });
  const record = query.data;

  return (
    <Page type="base" title="View Content" permission={import.meta.env.DEV ? undefined : CONTENT_DETAIL_PERMISSION} breadcrumbs={[
      { title: "Master Data", url: "#" },
      { title: CONTENT_LIST_PAGE_TITLE, url: CONTENT_URL },
      { title: record?.sectionName ?? "View Content", url: `${CONTENT_URL}/${id}` },
    ]}>
      <div className="border-b">
        <PageHeader title="View Content" withBackButton={false} />
      </div>
      {query.isPending && <output className="mt-6 block text-sm text-muted-foreground">Loading Content…</output>}
      {query.isError && <p role="alert" className="mt-6 text-sm text-destructive">{query.error.message}</p>}
      {record && (
        <section className="mt-6 border-b">
          <dl className={styles.details}>
            <div className={styles.row}><dt className={styles.label}>Section Name</dt><dd className={styles.value}>{record.sectionName}</dd></div>
            <div className={`${styles.row} ${styles.multilineRow}`}><dt className={styles.label}>Content</dt><dd className={`${styles.value} ${styles.contentValue}`}>{record.content}</dd></div>
          </dl>
        </section>
      )}
      <div className="mt-5 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => navigate(CONTENT_URL)}>Back</Button>
        {record && <Button type="button" onClick={() => navigate(contentEditUrl(id))}><Pencil aria-hidden="true" className="h-4 w-4" />Edit</Button>}
      </div>
    </Page>
  );
}
