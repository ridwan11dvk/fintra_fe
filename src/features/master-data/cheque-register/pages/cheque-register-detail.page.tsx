import { chequeRegisterService } from "../data/cheque-register.service";
import { CHEQUE_REGISTER_LIST_PAGE_TITLE, CHEQUE_REGISTER_URL, chequeRegisterEditUrl, chequeRegisterQueryKeys } from "../data/cheque-register.utils";
import { Button } from "@railfinance/core/ui/button";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router";

export function ChequeRegisterDetailPage() {
  const { id = "" } = useParams(); const navigate = useNavigate(); const query = useQuery({ queryKey: chequeRegisterQueryKeys.detail(id), queryFn: () => chequeRegisterService.get(id), enabled: Boolean(id) });
  return <Page type="base" title="View Cheque Register" breadcrumbs={[{ title: "Master Data", url: "#" }, { title: CHEQUE_REGISTER_LIST_PAGE_TITLE, url: CHEQUE_REGISTER_URL }, { title: "View Cheque Register", url: `${CHEQUE_REGISTER_URL}/${id}` }]}>
    <div className="border-b"><PageHeader title="View Cheque Register" withBackButton={false} /></div>
    {query.isPending && <output className="mt-6 block text-sm text-muted-foreground">Loading Cheque Register…</output>}
    {query.isError && <p role="alert" className="mt-6 text-sm text-destructive">{query.error.message}</p>}
    {query.data && <section className="mt-6 border-b"><dl className="grid grid-cols-1">
      <DetailRow label="Cheque Number" value={query.data.chequeNumber} />
      <DetailRow label="House Bank" value={query.data.houseBankName} />
      <DetailRow label="Status" value={query.data.status.charAt(0) + query.data.status.slice(1).toLowerCase()} />
      <DetailRow label="Release Date" value={query.data.status !== "RELEASE" || !query.data.releaseDate ? "-" : new Date(`${query.data.releaseDate}T00:00:00`).toLocaleDateString("en-GB")} />
    </dl></section>}
    <div className="mt-5 flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => navigate(CHEQUE_REGISTER_URL)}>Back</Button>{query.data && <Button type="button" onClick={() => navigate(chequeRegisterEditUrl(id))}><Pencil aria-hidden="true" />Edit</Button>}</div>
  </Page>;
}

function DetailRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return <div className="grid gap-1 py-3.5 md:grid-cols-[145px_minmax(0,1fr)] md:gap-x-6 md:items-center md:py-4"><dt className="text-sm font-semibold text-foreground/80">{label}</dt><dd className="min-w-0 break-words text-base text-foreground/80">{value}</dd></div>;
}
