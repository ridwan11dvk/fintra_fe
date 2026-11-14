import { chequeRegisterService } from "../data/cheque-register.service";
import type { ChequeRegisterRecord } from "../data/cheque-register.types";
import { CHEQUE_REGISTER_CREATE_URL, CHEQUE_REGISTER_LIST_PAGE_TITLE, CHEQUE_REGISTER_URL, chequeRegisterDetailUrl, chequeRegisterEditUrl, chequeRegisterQueryKeys } from "../data/cheque-register.utils";
import { toDataTableResponse } from "../../shared/to-data-table-response";
import { ActionButton } from "@railfinance/core/components/actions";
import { Button } from "@railfinance/core/ui/button";
import { DataTable } from "@railfinance/core/components/data-table";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@railfinance/core/ui/empty";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { Tooltip, TooltipContent, TooltipTrigger } from "@railfinance/core/ui/tooltip";
import type { PagedApiResponse } from "@railfinance/core/types";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { Eye, PlusCircle, Search } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";

function ChequeRegisterStatusCell({
  row,
}: Readonly<CellContext<ChequeRegisterRecord, unknown>>) {
  const status = row.original.status;
  return <span className="text-sm">{status.charAt(0) + status.slice(1).toLowerCase()}</span>;
}

function ChequeRegisterReleaseDateCell({
  row,
}: Readonly<CellContext<ChequeRegisterRecord, unknown>>) {
  const { status, releaseDate } = row.original;
  return status !== "RELEASE" || !releaseDate
    ? "-"
    : new Date(`${releaseDate}T00:00:00`).toLocaleDateString("en-GB");
}

function ChequeRegisterActionsCell({
  row,
}: Readonly<CellContext<ChequeRegisterRecord, unknown>>) {
  const navigate = useNavigate();
  const record = row.original;

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button type="button" variant="ghost" size="icon" aria-label={`View Cheque Register ${record.chequeNumber}`} onClick={() => navigate(chequeRegisterDetailUrl(record.id))}>
            <Eye aria-hidden="true" className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>View</TooltipContent>
      </Tooltip>
      <ActionButton variant="edit" size="sm" aria-label={`Edit Cheque Register ${record.chequeNumber}`} onClick={() => navigate(chequeRegisterEditUrl(record.id))} tooltip="Edit" />
    </div>
  );
}

const CHEQUE_REGISTER_COLUMNS: ColumnDef<ChequeRegisterRecord>[] = [
  {
    accessorKey: "houseBankName",
    header: "House Bank",
    enableSorting: false,
    cell: ({ row }) => {
      const { houseBankName, houseBankInstitutionName, houseBankAccountNumber, houseBankAccountName } = row.original;
      if (!houseBankAccountNumber || !houseBankAccountName) return houseBankName;

      return (
        <div className="space-y-0.5">
          <div>{houseBankInstitutionName} · {houseBankAccountNumber}</div>
          <div className="text-sm text-muted-foreground">{houseBankAccountName}</div>
        </div>
      );
    },
  },
  { accessorKey: "chequeNumber", header: "Cheque Number", enableSorting: false },
  { accessorKey: "status", header: "Status", enableSorting: false, cell: ChequeRegisterStatusCell },
  { accessorKey: "releaseDate", header: "Release Date", enableSorting: false, cell: ChequeRegisterReleaseDateCell },
  { id: "actions", header: "Actions", enableSorting: false, cell: ChequeRegisterActionsCell },
];

export function ChequeRegisterListPage() {
  const navigate = useNavigate(); const [total, setTotal] = useState(0); const [searchValue, setSearchValue] = useState(""); const [isEmptySearch, setIsEmptySearch] = useState(false); const [tableInstance, setTableInstance] = useState(0);
  const handleDataLoaded = useCallback((response: PagedApiResponse<ChequeRegisterRecord>) => { const count = response.data?.pagination.total ?? 0; setTotal(count); setIsEmptySearch(Boolean(searchValue.trim()) && count === 0); }, [searchValue]);
  const handleSearchChange = (value: string) => {
    if (value === "" && searchValue !== "") setTableInstance((instance) => instance + 1);
    setSearchValue(value);
    setIsEmptySearch(false);
  };
  return <Page type="base" title={CHEQUE_REGISTER_LIST_PAGE_TITLE} breadcrumbs={[{ title: "Master Data", url: "#" }, { title: CHEQUE_REGISTER_LIST_PAGE_TITLE, url: CHEQUE_REGISTER_URL }]}><PageHeader title={CHEQUE_REGISTER_LIST_PAGE_TITLE} actions={<Button type="button" onClick={() => navigate(CHEQUE_REGISTER_CREATE_URL)}><PlusCircle aria-hidden="true" className="mr-2 h-4 w-4" />Add Cheque Register</Button>} /><div className="relative"><DataTable<ChequeRegisterRecord> key={tableInstance} title="All Cheque Register" columns={CHEQUE_REGISTER_COLUMNS} queryKey={[...chequeRegisterQueryKeys.lists()]} queryFn={async ({ page, size, search }) => toDataTableResponse(await chequeRegisterService.list({ page, pageSize: size, search: search ?? "" }))} search={{ key: "search", placeholder: "Search Cheque Register", value: searchValue, onChange: handleSearchChange }} toolbar={{ enableColumnToggle: false, enableFullscreenToggle: false }} className={isEmptySearch ? "relative min-h-[20rem] [&>div:nth-child(2)]:hidden" : undefined} pageSize={10} badge={{ enabled: true, label: `${total} data` }} onDataLoaded={handleDataLoaded} />{isEmptySearch && searchValue.trim() && <div className="pointer-events-none absolute inset-x-4 top-36 bottom-3 z-10 flex items-center justify-center"><Empty className="pointer-events-auto h-full max-w-none gap-3 rounded-none border-0 bg-background py-6"><EmptyHeader className="gap-2"><EmptyMedia variant="icon" className="relative isolate size-12 overflow-visible rounded-lg border bg-background p-3 shadow-sm"><Search aria-hidden="true" className="size-5 text-primary" /></EmptyMedia><EmptyTitle>No Cheque Register found</EmptyTitle><EmptyDescription>Your search “{searchValue}” did not match any Cheque Register. Please try again or add new Cheque Register.</EmptyDescription></EmptyHeader><EmptyContent><Button type="button" variant="outline" size="sm" onClick={() => handleSearchChange("")}>Clear search</Button></EmptyContent></Empty></div>}</div></Page>;
}
