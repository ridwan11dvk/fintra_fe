import { departmentService } from "../data/department.service";
import type { DepartmentRecord } from "../data/department.types";
import {
  DEPARTMENT_CREATE_URL,
  DEPARTMENT_LIST_PAGE_TITLE,
  DEPARTMENT_LIST_PERMISSION,
  DEPARTMENT_URL,
  departmentDetailUrl,
  departmentEditUrl,
  departmentQueryKeys,
} from "../data/department.utils";
import { toDataTableResponse } from "../../shared/to-data-table-response";
import { ActionButton } from "@railfinance/core/components/actions";
import { Button } from "@railfinance/core/ui/button";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@railfinance/core/ui/empty";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { StatusBadge } from "@railfinance/core/components/badges";
import { Tooltip, TooltipContent, TooltipTrigger } from "@railfinance/core/ui/tooltip";
import { toast } from "@railfinance/core/lib";
import type { PagedApiResponse } from "@railfinance/core/types";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { Eye, PlusCircle, Power, Search } from "lucide-react";
import { createContext, useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "../department-layout.css";

const PAGE_SIZE = 10;
const DepartmentStatusTargetContext = createContext<((record: DepartmentRecord) => void) | null>(null);

function DepartmentStatusCell({
  row,
}: Readonly<CellContext<DepartmentRecord, unknown>>) {
  const { status } = row.original;
  return <StatusBadge status={status === "ACTIVE" ? "active" : "inactive"} label={status === "ACTIVE" ? "Active" : "Inactive"} />;
}

function DepartmentActionsCell({
  row,
}: Readonly<CellContext<DepartmentRecord, unknown>>) {
  const navigate = useNavigate();
  const setStatusTarget = useContext(DepartmentStatusTargetContext);
  if (!setStatusTarget) throw new Error("Department actions must be rendered inside their provider.");
  const record = row.original;

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button type="button" variant="ghost" size="icon" aria-label={`View Department ${record.code}`} onClick={() => navigate(departmentDetailUrl(record.id))}>
            <Eye aria-hidden="true" className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>View</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button type="button" variant="ghost" size="icon" aria-label={`${record.status === "ACTIVE" ? "Deactivate" : "Activate"} Department ${record.code}`} onClick={() => setStatusTarget(record)}>
            <Power aria-hidden="true" className={`h-4 w-4 ${record.status === "ACTIVE" ? "text-destructive" : "text-primary"}`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{record.status === "ACTIVE" ? "Deactivate" : "Activate"}</TooltipContent>
      </Tooltip>
      <ActionButton variant="edit" size="sm" aria-label={`Edit Department ${record.code}`} onClick={() => navigate(departmentEditUrl(record.id))} tooltip="Edit" />
    </div>
  );
}

export function DepartmentListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusTarget, setStatusTarget] = useState<DepartmentRecord | null>(null);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [isEmptySearch, setIsEmptySearch] = useState(false);
  const [tableInstance, setTableInstance] = useState(0);
  const parentsQuery = useQuery({
    queryKey: departmentQueryKeys.list({ search: "", page: 1, pageSize: 1000 }),
    queryFn: () => departmentService.list({ page: 1, pageSize: 1000 }),
  });
  const parents = parentsQuery.data?.items ?? [];

  const handleDataLoaded = useCallback((response: PagedApiResponse<DepartmentRecord>) => {
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
      await departmentService.setStatus(statusTarget.id, status);
      await queryClient.invalidateQueries({ queryKey: departmentQueryKeys.all });
      const verb = status === "ACTIVE" ? "activated" : "deactivated";
      toast.success(`Department ${verb} successfully`, {
        description: status === "ACTIVE" ? "The Department has been activated." : "The Department has been deactivated.",
      });
      setStatusTarget(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update Department status.");
    } finally {
      setIsChangingStatus(false);
    }
  };

  const columns: ColumnDef<DepartmentRecord>[] = [
    { accessorKey: "name", header: "Department Name", enableSorting: false },
    { accessorKey: "code", header: "Department Code", enableSorting: false },
    {
      id: "parentDepartment",
      header: "Parent Department",
      enableSorting: false,
      cell: ({ row }) => parents.find((parent) => parent.id === row.original.parentDepartmentId)?.name ?? row.original.parentDepartmentId ?? "—",
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: false,
      cell: DepartmentStatusCell,
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: DepartmentActionsCell,
    },
  ];

  return (
    <Page
      type="base"
      title={DEPARTMENT_LIST_PAGE_TITLE}
      permission={import.meta.env.DEV ? undefined : DEPARTMENT_LIST_PERMISSION}
      breadcrumbs={[
        { title: "Master Data", url: "#" },
        { title: DEPARTMENT_LIST_PAGE_TITLE, url: DEPARTMENT_URL },
      ]}
    >
      <PageHeader
        title={DEPARTMENT_LIST_PAGE_TITLE}
        withBackButton={false}
        actions={<Button type="button" onClick={() => navigate(DEPARTMENT_CREATE_URL)}><PlusCircle aria-hidden="true" className="mr-2 h-4 w-4" />Add Department</Button>}
      />
      {parentsQuery.isError && <p className="mb-3 text-sm text-destructive" role="alert">Unable to load Parent Department names: {parentsQuery.error.message}</p>}
      <div className="relative">
        <DepartmentStatusTargetContext.Provider value={setStatusTarget}>
        <DataTable<DepartmentRecord>
          key={tableInstance}
          title="All Department"
          columns={columns}
          queryKey={[...departmentQueryKeys.lists()]}
          queryFn={async ({ page, size, search }) => toDataTableResponse(
            await departmentService.list({ page, pageSize: size, search: search ?? "" }),
          )}
          search={{ key: "search", placeholder: "Search Department", value: searchValue, onChange: handleSearchChange }}
          toolbar={{ enableColumnToggle: false, enableFullscreenToggle: false }}
          className={isEmptySearch ? "relative min-h-[20rem] [&>div:nth-child(2)]:hidden" : undefined}
          pageSize={PAGE_SIZE}
          badge={{ enabled: true, label: `${totalItems} Department${totalItems === 1 ? "" : "s"}` }}
          onDataLoaded={handleDataLoaded}
        />
        </DepartmentStatusTargetContext.Provider>
        {isEmptySearch && searchValue.trim() && (
          <div className="pointer-events-none absolute inset-x-4 top-36 bottom-3 z-10 flex items-center justify-center">
            <Empty className="pointer-events-auto h-full max-w-none gap-3 rounded-none border-0 bg-background py-6">
              <EmptyHeader className="gap-2">
                <EmptyMedia variant="icon" className="relative isolate size-12 overflow-visible rounded-lg border bg-background p-3 shadow-sm">
                  <Search aria-hidden="true" className="size-5 text-primary" />
                </EmptyMedia>
                <EmptyTitle>No Department found</EmptyTitle>
                <EmptyDescription>Your search “{searchValue}” did not match any Department. Please try again.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button type="button" variant="outline" size="sm" onClick={() => handleSearchChange("")}>Clear search</Button>
              </EmptyContent>
            </Empty>
          </div>
        )}
      </div>
      <ConfirmationModal
        open={Boolean(statusTarget)}
        onOpenChange={(open) => { if (!open && !isChangingStatus) setStatusTarget(null); }}
        title={statusTarget?.status === "ACTIVE" ? "Deactivate this data?" : "Activate this data"}
        description={undefined}
        confirmText={statusTarget?.status === "ACTIVE" ? "Deactivate" : "Activate"}
        cancelText="Cancel"
        confirmVariant={statusTarget?.status === "ACTIVE" ? "destructive" : "default"}
        size="sm"
        onConfirm={changeStatus}
        isLoading={isChangingStatus}
      >
        <div className="space-y-3">
          <span className={`grid size-9 place-items-center rounded-full ${statusTarget?.status === "ACTIVE" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`}>
            <Power aria-hidden="true" className="size-4" />
          </span>
          <p className="text-xs text-muted-foreground">Are you sure you want to {statusTarget?.status === "ACTIVE" ? "deactivate" : "activate"} this Department? This action might affect other configuration.</p>
        </div>
      </ConfirmationModal>
    </Page>
  );
}
