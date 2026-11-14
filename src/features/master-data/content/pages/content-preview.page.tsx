import { useQuery } from "@tanstack/react-query";
import { Button } from "@railfinance/core/ui/button";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { contentService } from "../data/content.service";
import { contentSections } from "../data/content.types";
import { CONTENT_LIST_PERMISSION, CONTENT_URL, contentQueryKeys } from "../data/content.utils";
import { useNavigate } from "react-router";

export function ContentPreviewPage() {
  const navigate = useNavigate();
  const query = useQuery({
    queryKey: [...contentQueryKeys.lists(), "landing-preview"],
    queryFn: () => contentService.list({ page: 1, pageSize: 100 }),
    refetchOnWindowFocus: true,
  });

  if (query.isPending) return <Page type="base" title="Landing Page Preview" permission={import.meta.env.DEV ? undefined : CONTENT_LIST_PERMISSION}><PageHeader title="Landing Page Preview" /><output className="mt-6 block">Loading active Content…</output></Page>;
  if (query.isError) return <Page type="base" title="Landing Page Preview" permission={import.meta.env.DEV ? undefined : CONTENT_LIST_PERMISSION}><PageHeader title="Landing Page Preview" /><p role="alert" className="mt-6 text-sm text-destructive">{query.error.message}</p><Button type="button" variant="link" onClick={() => navigate(CONTENT_URL)}>Back to Content</Button></Page>;

  const activeContent = query.data.items.filter((item) => item.status === "ACTIVE");
  return <Page type="base" title="Landing Page Preview" permission={import.meta.env.DEV ? undefined : CONTENT_LIST_PERMISSION} breadcrumbs={[{ title: "Master Data", url: "#" }, { title: "Content", url: CONTENT_URL }, { title: "Landing Page Preview", url: `${CONTENT_URL}/preview` }]}>
    <PageHeader title="Landing Page Preview" actions={<Button type="button" variant="outline" onClick={() => navigate(CONTENT_URL)}>Back to Content</Button>} />
    <p className="mb-6 mt-2 text-sm text-muted-foreground">Local QA preview powered by the Content API. Changes appear after refresh.</p>
    <main aria-label="Landing page sections" className="grid gap-4">
      {contentSections.map((section) => {
        const item = activeContent.find((content) => content.sectionName === section);
        return <section key={section} aria-labelledby={`preview-${section}`} data-has-active-content={Boolean(item)} className="rounded-lg border bg-card p-6">
          <h2 id={`preview-${section}`} className="text-lg font-semibold">{section}</h2>
          {item && <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{item.content}</p>}
        </section>;
      })}
    </main>
  </Page>;
}
