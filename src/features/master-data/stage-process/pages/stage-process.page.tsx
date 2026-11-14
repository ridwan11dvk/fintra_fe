import { Button } from "@railfinance/core/ui/button";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { STAGE_PROCESS_LIST_PAGE_TITLE } from "../data/stage-process.utils";
import { useStageProcesses } from "../data/stage-process.query";
import { StageProcessForm } from "../components/stage-process-form";

export function StageProcessContent() {
  const query = useStageProcesses();
  if (query.isPending) return <output className="mt-6 block">Loading Process &amp; Reference…</output>;
  if (query.isError) return <div className="mt-6 space-y-3">
    <p role="alert" className="text-destructive">{query.error.message}</p>
    <Button type="button" variant="outline" onClick={() => { void query.refetch(); }}>Retry</Button>
  </div>;
  if (query.data.length === 0) return <output className="mt-6 block">No process stages are configured.</output>;
  return <StageProcessForm records={query.data} />;
}

export function StageProcessPage() {
  return <Page type="base" title={STAGE_PROCESS_LIST_PAGE_TITLE}>
    <PageHeader title="Setup & Configuration" />
    <StageProcessContent />
  </Page>;
}
