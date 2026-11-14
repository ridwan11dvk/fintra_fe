import { profitCenterColumns } from "../components/profit-center-columns";
import { profitCenterQueryKeys } from "../data/profit-center.query";
import { profitCenterService } from "../data/profit-center.service";
import type { ProfitCenterRecord } from "../data/profit-center.types";
import {
  PROFIT_CENTER_LIST_PAGE_TITLE,
  PROFIT_CENTER_LIST_PERMISSION,
  PROFIT_CENTER_URL,
  profitCenterDetailUrl,
  profitCenterEditUrl,
} from "../data/profit-center.utils";
import { toDataTableResponse } from "../../shared/to-data-table-response";
import { ActionButton } from "@railfinance/core/components/actions";
import { Button } from "@railfinance/core/ui/button";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@railfinance/core/ui/empty";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { Tooltip, TooltipContent, TooltipTrigger } from "@railfinance/core/ui/tooltip";
import { toast } from "@railfinance/core/lib";
import type { PagedApiResponse } from "@railfinance/core/types";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { Eye, PlusCircle, Power, Search } from "lucide-react";
import { createContext, useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 7;

const ProfitCenterStatusTargetContext = createContext<
  ((record: ProfitCenterRecord) => void) | null
>(null);

function ProfitCenterActionsCell({
  row,
}: Readonly<CellContext<ProfitCenterRecord, unknown>>) {
  const navigate = useNavigate();
  const setStatusTarget = useContext(ProfitCenterStatusTargetContext);
  if (!setStatusTarget) {
    throw new Error(
      "Profit Center actions must be rendered inside their provider.",
    );
  }
  const record = row.original;
  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button type="button" variant="ghost" size="icon" aria-label={`View ${record.profitCenterName}`} onClick={() => navigate(profitCenterDetailUrl(record.profitCenterId))}>
            <Eye aria-hidden="true" className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>View</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button type="button" variant="ghost" size="icon" aria-label={`${record.status === "ACTIVE" ? "Deactivate" : "Activate"} ${record.profitCenterName}`} onClick={() => setStatusTarget(record)}>
            <Power aria-hidden="true" className={record.status === "ACTIVE" ? "h-4 w-4 text-destructive" : "h-4 w-4 text-primary"} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{record.status === "ACTIVE" ? "Deactivate" : "Activate"}</TooltipContent>
      </Tooltip>
      <ActionButton variant="edit" size="sm" aria-label={`Edit ${record.profitCenterName}`} onClick={() => navigate(profitCenterEditUrl(record.profitCenterId))} tooltip="Edit" />
    </div>
  );
}

export function ProfitCenterListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusTarget, setStatusTarget] = useState<ProfitCenterRecord | null>(null);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [isEmptySearch, setIsEmptySearch] = useState(false);
  const [tableInstance, setTableInstance] = useState(0);

  const handleDataLoaded = useCallback((response: PagedApiResponse<ProfitCenterRecord>) => {
    const total = response.data?.pagination.total ?? 0;
    setTotalItems(total);
    setIsEmptySearch(Boolean(searchValue.trim()) && total === 0);
  }, [searchValue]);

  const handleSearchChange = (value: string) => {
    if (value === "" && searchValue !== "") setTableInstance((instance) => instance + 1);
    setSearchValue(value);
    setIsEmptySearch(false);
  };

  const updateStatus = async () => {
    if (!statusTarget || isChangingStatus) return;
    const nextStatus = statusTarget.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setIsChangingStatus(true);
    try {
      await profitCenterService.setStatus(statusTarget.profitCenterId, nextStatus);
      await queryClient.invalidateQueries({ queryKey: profitCenterQueryKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: profitCenterQueryKeys.detail(statusTarget.profitCenterId) });
      const verb = nextStatus === "ACTIVE" ? "activated" : "deactivated";
      const description = nextStatus === "ACTIVE"
        ? "The Profit Center has been activated."
        : "The Profit Center has been deactivated.";
      toast.success(`Profit Center ${verb} successfully`, { description });
      setStatusTarget(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update Profit Center status.");
    } finally {
      setIsChangingStatus(false);
    }
  };

  const columns: ColumnDef<ProfitCenterRecord>[] = [
    ...profitCenterColumns.map((column) => ({
      accessorKey: column.key,
      header: column.title,
      enableSorting: false,
    })),
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ProfitCenterActionsCell,
    },
  ];

  return (
    <Page
      type="base"
      title={PROFIT_CENTER_LIST_PAGE_TITLE}
      permission={import.meta.env.DEV ? undefined : PROFIT_CENTER_LIST_PERMISSION}
      breadcrumbs={[{ title: "Master Data", url: "#" }, { title: PROFIT_CENTER_LIST_PAGE_TITLE, url: PROFIT_CENTER_URL }]}
    >
      <PageHeader
        title={PROFIT_CENTER_LIST_PAGE_TITLE}
        actions={<Button type="button" onClick={() => navigate(`${PROFIT_CENTER_URL}/create`)}><PlusCircle aria-hidden="true" className="mr-2 h-4 w-4" />Add Profit Center</Button>}
      />
      <ProfitCenterStatusTargetContext.Provider value={setStatusTarget}>
        <div className="relative">
          <DataTable<ProfitCenterRecord>
          key={tableInstance}
          title="All Profit Center"
          columns={columns}
          queryKey={[...profitCenterQueryKeys.lists()]}
          queryFn={async ({ page, size, search }) => toDataTableResponse(
            await profitCenterService.list({ page, pageSize: size, search: search ?? "" }),
          )}
          search={{ key: "search", placeholder: "Search Profit Center", value: searchValue, onChange: handleSearchChange }}
          toolbar={{ enableColumnToggle: false, enableFullscreenToggle: false }}
          className={isEmptySearch ? "relative min-h-[20rem] [&>div:nth-child(2)]:hidden" : undefined}
          pageSize={PAGE_SIZE}
          badge={{ enabled: true, label: `${totalItems} Profit Center${totalItems === 1 ? "" : "s"}` }}
            onDataLoaded={handleDataLoaded}
          />
          {isEmptySearch && searchValue.trim() && (
          <div className="pointer-events-none absolute inset-x-4 top-36 bottom-3 z-10 flex items-center justify-center">
            <Empty className="pointer-events-auto h-full max-w-none gap-3 rounded-none border-0 bg-background py-6">
              <EmptyHeader className="gap-2">
                <EmptyMedia variant="icon" className="relative isolate size-12 overflow-visible rounded-lg border bg-background p-3 shadow-sm">
                  <Search aria-hidden="true" className="size-5 text-primary" />
                </EmptyMedia>
                <EmptyTitle>No Profit Center found</EmptyTitle>
                <EmptyDescription>Your search “{searchValue}” did not match any Profit Center. Please try again.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button type="button" variant="outline" size="sm" onClick={() => handleSearchChange("")}>Clear search</Button>
              </EmptyContent>
            </Empty>
          </div>
          )}
        </div>
      </ProfitCenterStatusTargetContext.Provider>
      <ConfirmationModal
        open={Boolean(statusTarget)}
        onOpenChange={(open) => { if (!open && !isChangingStatus) setStatusTarget(null); }}
        title={statusTarget?.status === "ACTIVE" ? "Deactivate this data?" : "Activate this data"}
        description={undefined}
        confirmText={statusTarget?.status === "ACTIVE" ? "Deactivate" : "Activate"}
        cancelText="Cancel"
        onCancel={() => setStatusTarget(null)}
        confirmVariant={statusTarget?.status === "ACTIVE" ? "destructive" : "default"}
        size="sm"
        onConfirm={updateStatus}
        isLoading={isChangingStatus}
      >
        <div className="space-y-3">
          <span className={`grid size-9 place-items-center rounded-full ${statusTarget?.status === "ACTIVE" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`}>
            <Power aria-hidden="true" className="size-4" />
          </span>
          <p className="text-xs text-muted-foreground">Are you sure you want to {statusTarget?.status === "ACTIVE" ? "deactivate" : "activate"} this data? This action might affect other configuration.</p>
        </div>
      </ConfirmationModal>
    </Page>
  );
}
