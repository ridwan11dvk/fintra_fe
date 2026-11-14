import { contentService, getContentErrorMessage } from "../data/content.service";
import type { ContentRecord } from "../data/content.types";
import { CONTENT_CREATE_URL, CONTENT_LIST_PAGE_TITLE, CONTENT_LIST_PERMISSION, CONTENT_URL, contentDetailUrl, contentEditUrl, contentQueryKeys } from "../data/content.utils";
import { toDataTableResponse } from "../../shared/to-data-table-response";
import { StatusToggleModal } from "@/shared/components";
import { ActionButton } from "@railfinance/core/components/actions";
import { Button } from "@railfinance/core/ui/button";
import { DataTable } from "@railfinance/core/components/data-table";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@railfinance/core/ui/empty";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { Tooltip, TooltipContent, TooltipTrigger } from "@railfinance/core/ui/tooltip";
import { toast } from "@railfinance/core/lib";
import type { PagedApiResponse } from "@railfinance/core/types";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { Eye, PlusCircle, Search, ToggleLeft, ToggleRight } from "lucide-react";
import { createContext, useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

const ContentStatusTargetContext = createContext<((record: ContentRecord) => void) | null>(null);

function ContentValueCell({
  row,
}: Readonly<CellContext<ContentRecord, unknown>>) {
  return <span className="block max-w-[32rem] overflow-hidden text-ellipsis whitespace-nowrap">{row.original.content}</span>;
}

function ContentActionsCell({
  row,
}: Readonly<CellContext<ContentRecord, unknown>>) {
  const navigate = useNavigate();
  const setTarget = useContext(ContentStatusTargetContext);
  if (!setTarget) throw new Error("Content actions must be rendered inside their provider.");
  const record = row.original;

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button type="button" variant="ghost" size="icon" aria-label={`View Content ${record.sectionName}`} onClick={() => navigate(contentDetailUrl(record.id))}>
            <Eye aria-hidden="true" className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>View</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button type="button" variant="ghost" size="icon" aria-label={`${record.status === "ACTIVE" ? "Deactivate" : "Activate"} Content ${record.sectionName}`} onClick={() => setTarget(record)}>
            {record.status === "ACTIVE" ? <ToggleRight aria-hidden="true" className="size-5 text-blue-600" /> : <ToggleLeft aria-hidden="true" className="size-5 text-red-500" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{record.status === "ACTIVE" ? "Deactivate" : "Activate"}</TooltipContent>
      </Tooltip>
      <ActionButton variant="edit" size="sm" aria-label={`Edit Content ${record.sectionName}`} onClick={() => navigate(contentEditUrl(record.id))} tooltip="Edit" />
    </div>
  );
}

const CONTENT_COLUMNS: ColumnDef<ContentRecord>[] = [
  { accessorKey: "sectionName", header: "Section Name", enableSorting: false },
  { accessorKey: "content", header: "Content", enableSorting: false, cell: ContentValueCell },
  { id: "actions", header: "Actions", enableSorting: false, cell: ContentActionsCell },
];

export function ContentListPage() {
  const navigate = useNavigate();
  const client = useQueryClient();
  const [target, setTarget] = useState<ContentRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [isEmptySearch, setIsEmptySearch] = useState(false);
  const [tableInstance, setTableInstance] = useState(0);

  const handleDataLoaded = useCallback((response: PagedApiResponse<ContentRecord>) => {
    const count = response.data?.pagination.total ?? 0;
    setTotal(count);
    setIsEmptySearch(Boolean(searchValue.trim()) && count === 0);
  }, [searchValue]);

  const handleSearchChange = (value: string) => {
    if (value === "" && searchValue !== "") setTableInstance((instance) => instance + 1);
    setSearchValue(value);
    setIsEmptySearch(false);
  };

  const changeStatus = async () => {
    if (!target || loading) return;
    const status = target.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setLoading(true);
    try {
      await contentService.setStatus(target.id, status);
      await client.invalidateQueries({ queryKey: contentQueryKeys.all });
      const verb = status === "ACTIVE" ? "activated" : "deactivated";
      toast.success(`Content ${verb} successfully`, {
        description: status === "ACTIVE" ? "The Content has been activated." : "The Content has been deactivated.",
      });
      setTarget(null);
    } catch (error) {
      toast.error(getContentErrorMessage(error, "Unable to update Content status."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page type="base" title={CONTENT_LIST_PAGE_TITLE} permission={import.meta.env.DEV ? undefined : CONTENT_LIST_PERMISSION} breadcrumbs={[
      { title: "Master Data", url: "#" },
      { title: CONTENT_LIST_PAGE_TITLE, url: CONTENT_URL },
    ]}>
      <PageHeader
        title={CONTENT_LIST_PAGE_TITLE}
        actions={<div className="flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={() => navigate(`${CONTENT_URL}/preview`)}>Preview Landing Page</Button><Button type="button" onClick={() => navigate(CONTENT_CREATE_URL)}><PlusCircle aria-hidden="true" className="mr-2 h-4 w-4" />Add Content</Button></div>}
      />
      <div className="relative">
        <ContentStatusTargetContext.Provider value={setTarget}>
        <DataTable<ContentRecord>
          key={tableInstance}
          title="All Content"
          columns={CONTENT_COLUMNS}
          queryKey={[...contentQueryKeys.lists()]}
          queryFn={async ({ page, size, search }) => {
            const result = await contentService.list({ page: page + 1, pageSize: size, search: search ?? "" });
            const response = toDataTableResponse(result);
            return {
              ...response,
              data: {
                ...response.data,
                pagination: {
                  ...response.data.pagination,
                  currentPage: page + 1,
                  currentPageNumber: page + 1,
                },
              },
            };
          }}
          search={{ key: "search", placeholder: "Search Content", value: searchValue, onChange: handleSearchChange }}
          toolbar={{ enableColumnToggle: false, enableFullscreenToggle: false }}
          className={isEmptySearch ? "relative min-h-[20rem] [&>div:nth-child(2)]:hidden" : undefined}
          pageSize={10}
          badge={{ enabled: true, label: `${total} data` }}
          onDataLoaded={handleDataLoaded}
        />
        </ContentStatusTargetContext.Provider>
        {isEmptySearch && searchValue.trim() && (
          <div className="pointer-events-none absolute inset-x-4 top-36 bottom-3 z-10 flex items-center justify-center">
            <Empty className="pointer-events-auto h-full max-w-none gap-3 rounded-none border-0 bg-background py-6">
              <EmptyHeader className="gap-2">
                <EmptyMedia variant="icon" className="relative isolate size-12 overflow-visible rounded-lg border bg-background p-3 shadow-sm">
                  <Search aria-hidden="true" className="size-5 text-primary" />
                </EmptyMedia>
                <EmptyTitle>No Content found</EmptyTitle>
                <EmptyDescription>Your search “{searchValue}” did not match any Content. Please try again or add new Content.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button type="button" variant="outline" size="sm" onClick={() => handleSearchChange("")}>Clear search</Button>
              </EmptyContent>
            </Empty>
          </div>
        )}
      </div>
      <StatusToggleModal
        open={Boolean(target)}
        onOpenChange={(open) => { if (!open && !loading) setTarget(null); }}
        isActive={target?.status === "ACTIVE"}
        onConfirm={changeStatus}
        isLoading={loading}
        onCancel={() => setTarget(null)}
      />
    </Page>
  );
}
