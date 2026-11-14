import { kbliQueryKeys } from "../data/kbli.query";
import { kbliService } from "../data/kbli.service";
import type { KbliRecord } from "../data/kbli.types";
import { KBLI_CREATE_URL, KBLI_LIST_PAGE_TITLE, KBLI_LIST_PERMISSION, KBLI_URL, kbliDetailUrl, kbliEditUrl } from "../data/kbli.utils";
import { toDataTableResponse } from "../../shared/to-data-table-response";
import { ActionButton } from "@railfinance/core/components/actions";
import { Button } from "@railfinance/core/ui/button";
import { StatusToggleModal } from "@/shared/components";
import { DataTable } from "@railfinance/core/components/data-table";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@railfinance/core/ui/empty";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { Tooltip, TooltipContent, TooltipTrigger } from "@railfinance/core/ui/tooltip";
import { toast } from "@railfinance/core/lib";
import type { PagedApiResponse } from "@railfinance/core/types";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { Eye, PlusCircle, ToggleLeft, ToggleRight, Search } from "lucide-react";
import { createContext, useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 10;
const KbliStatusTargetContext = createContext<((record: KbliRecord) => void) | null>(null);

function KbliActionsCell({
  row,
}: Readonly<CellContext<KbliRecord, unknown>>) {
  const navigate = useNavigate();
  const setStatusTarget = useContext(KbliStatusTargetContext);
  if (!setStatusTarget) throw new Error("KBLI actions must be rendered inside their provider.");
  const record = row.original;

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button type="button" variant="ghost" size="icon" aria-label={`View KBLI ${record.code}`} onClick={() => navigate(kbliDetailUrl(record.id))}>
            <Eye aria-hidden="true" className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>View</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button type="button" variant="ghost" size="icon" aria-label={`${record.status === "ACTIVE" ? "Deactivate" : "Activate"} KBLI ${record.code}`} onClick={() => setStatusTarget(record)}>
            {record.status === "ACTIVE" ? <ToggleRight aria-hidden="true" className="size-5 text-blue-600" /> : <ToggleLeft aria-hidden="true" className="size-5 text-red-500" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{record.status === "ACTIVE" ? "Deactivate" : "Activate"}</TooltipContent>
      </Tooltip>
      <ActionButton variant="edit" size="sm" aria-label={`Edit KBLI ${record.code}`} onClick={() => navigate(kbliEditUrl(record.id))} tooltip="Edit" />
    </div>
  );
}

const KBLI_COLUMNS: ColumnDef<KbliRecord>[] = [
  { accessorKey: "code", header: "KBLI Code", enableSorting: false },
  { accessorKey: "businessFieldName", header: "Business Field Name", enableSorting: false, cell: ({ row }) => <span className="block max-w-64 truncate" title={row.original.businessFieldName}>{row.original.businessFieldName}</span> },
  { accessorKey: "category", header: "Category/Golongan", enableSorting: false, cell: ({ row }) => <span className="block max-w-64 truncate" title={row.original.category}>{row.original.category}</span> },
  { id: "actions", header: "Actions", enableSorting: false, cell: KbliActionsCell },
];

export function KbliListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusTarget, setStatusTarget] = useState<KbliRecord | null>(null);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [isEmptySearch, setIsEmptySearch] = useState(false);
  const [tableInstance, setTableInstance] = useState(0);

  const handleDataLoaded = useCallback((response: PagedApiResponse<KbliRecord>) => {
    const total = response.data?.pagination.total ?? 0;
    setTotalItems(total);
    setIsEmptySearch(Boolean(searchValue.trim()) && total === 0);
  }, [searchValue]);

  const handleSearchChange = (value: string) => {
    if (value === "" && searchValue !== "") setTableInstance((instance) => instance + 1);
    setSearchValue(value);
    setIsEmptySearch(false);
  };

  const changeStatus = async () => {
    if (!statusTarget || isChangingStatus) return;
    const status = statusTarget.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setIsChangingStatus(true);
    try {
      await kbliService.setStatus(statusTarget.id, status);
      await queryClient.invalidateQueries({ queryKey: kbliQueryKeys.all });
      const verb = status === "ACTIVE" ? "activated" : "deactivated";
      toast.success(`KBLI ${verb} successfully`, {
        description: status === "ACTIVE" ? "The KBLI has been activated." : "The KBLI has been deactivated.",
      });
      setStatusTarget(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update KBLI status.");
    } finally {
      setIsChangingStatus(false);
    }
  };

  return (
    <Page
      type="base"
      title={KBLI_LIST_PAGE_TITLE}
      permission={import.meta.env.DEV ? undefined : KBLI_LIST_PERMISSION}
      breadcrumbs={[{ title: "Master Data", url: "#" }, { title: KBLI_LIST_PAGE_TITLE, url: KBLI_URL }]}
    >
      <PageHeader
        title={KBLI_LIST_PAGE_TITLE}
        actions={<Button type="button" onClick={() => navigate(KBLI_CREATE_URL)}><PlusCircle aria-hidden="true" className="mr-2 h-4 w-4" />Add KBLI</Button>}
      />
      <div className="relative">
        <KbliStatusTargetContext.Provider value={setStatusTarget}>
          <DataTable<KbliRecord>
            key={tableInstance}
            title="All KBLI"
            columns={KBLI_COLUMNS}
            queryKey={[...kbliQueryKeys.lists()]}
            queryFn={async ({ page, size, search }) => toDataTableResponse(
              await kbliService.list({ page: page + 1, pageSize: size, search: search ?? "" }),
            )}
            search={{ key: "search", placeholder: "Search KBLI", value: searchValue, onChange: handleSearchChange }}
            toolbar={{ enableColumnToggle: false, enableFullscreenToggle: false }}
            className={isEmptySearch ? "relative min-h-[20rem] [&>div:nth-child(2)]:hidden" : undefined}
            pageSize={PAGE_SIZE}
            badge={{ enabled: true, label: `${totalItems} data` }}
            onDataLoaded={handleDataLoaded}
          />
        </KbliStatusTargetContext.Provider>
        {isEmptySearch && searchValue.trim() && (
          <div className="pointer-events-none absolute inset-x-4 top-36 bottom-3 z-10 flex items-center justify-center">
            <Empty className="pointer-events-auto h-full max-w-none gap-3 rounded-none border-0 bg-background py-6">
              <EmptyHeader className="gap-2">
                <EmptyMedia variant="icon" className="relative isolate size-12 overflow-visible rounded-lg border bg-background p-3 shadow-sm">
                  <Search aria-hidden="true" className="size-5 text-primary" />
                </EmptyMedia>
                <EmptyTitle>No KBLI found</EmptyTitle>
                <EmptyDescription>Your search “{searchValue}” did not match any KBLI. Please try again or add new KBLI.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button type="button" variant="outline" size="sm" onClick={() => handleSearchChange("")}>Clear search</Button>
              </EmptyContent>
            </Empty>
          </div>
        )}
      </div>
      <StatusToggleModal
        open={Boolean(statusTarget)}
        onOpenChange={(open) => { if (!open && !isChangingStatus) setStatusTarget(null); }}
        isActive={statusTarget?.status === "ACTIVE"}
        onCancel={() => setStatusTarget(null)}
        onConfirm={changeStatus}
        isLoading={isChangingStatus}
      />
    </Page>
  );
}
