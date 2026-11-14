import {
  TAXABLE_ITEM_CREATE_PERMISSION,
  TAXABLE_ITEM_DELETE_PERMISSION,
  TAXABLE_ITEM_EXPORT_PERMISSION,
  TAXABLE_ITEM_IMPORT_PERMISSION,
  TAXABLE_ITEM_LIST_PAGE_TITLE,
  TAXABLE_ITEM_LIST_PERMISSION,
  TAXABLE_ITEM_UPDATE_PERMISSION,
  TAXABLE_ITEM_URL,
  TaxableItemFormModal,
  taxableItemQueryKeys,
  taxableItemService,
  useConvertHierarchicalTaxableItemsMutation,
  useDeleteTaxableItemMutation,
  useExportTaxableItemsMutation,
  useImportTaxableItemsMutation,
  useListTaxableItemRows,
  type CostCenterResponse,
  type TaxableItemResponse,
  type TaxableItemRow,
} from "@/features/master-data";
import { queryClient } from "@railfinance/core";
import { ActionButton } from "@railfinance/core/components/actions";
import { SearchInput } from "@railfinance/core/components/input";
import {
  ConfirmationModal,
  ImportModal,
} from "@railfinance/core/components/modal";
import { PageHeader } from "@railfinance/core/components/page-header";
import { Page } from "@railfinance/core/components/page-shell";
import { useDebounce } from "@railfinance/core/hooks";
import { cn } from "@railfinance/core/lib";
import { Badge } from "@railfinance/core/ui/badge";
import { Card, CardContent, CardHeader } from "@railfinance/core/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@railfinance/core/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@railfinance/core/ui/popover";
import { Separator } from "@railfinance/core/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@railfinance/core/ui/table";
import { useState } from "react";

interface AddChildTarget {
  level: number;
  parentId: number | null;
}

function HierarchyCell({
  item,
  onAddChild,
  onEdit,
  onDelete,
}: Readonly<{
  item: TaxableItemResponse | null;
  onAddChild?: () => void;
  onEdit?: (item: TaxableItemResponse) => void;
  onDelete?: (item: TaxableItemResponse) => void;
}>) {
  if (!item) {
    return <TableCell className="border-r last:border-r-0 bg-muted/20" />;
  }

  return (
    <TableCell className="border-r last:border-r-0 px-3 py-3">
      <div className="flex items-center justify-between gap-2 group">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="text-xs font-medium uppercase tracking-wide text-foreground leading-tight text-left hover:text-primary hover:underline underline-offset-2 transition-colors cursor-pointer"
            >
              {item.fullCode ?? item.code} - {item.name}
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-64 p-0">
            <div className="px-4 py-3">
              <p className="font-semibold text-sm">{item.name}</p>
              {item.fullCode && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.fullCode}
                </p>
              )}
            </div>
            <Separator />
            <div className="px-4 py-3 space-y-2">
              {item.code && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Code</span>
                  <span className="font-medium">{item.code}</span>
                </div>
              )}
              {item.altCode && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Alt Code</span>
                  <span className="font-medium">{item.altCode}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Level</span>
                <span className="font-medium">{item.level}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Cost Centers</span>
                <span className="font-medium text-right">
                  {item.costCenters
                    ?.map((cc: CostCenterResponse) => cc.costCenterCode)
                    .join(", ") || "-"}
                </span>
              </div>
              <div className="flex justify-between text-xs items-center">
                <span className="text-muted-foreground">Type</span>
                <Badge variant="outline" className="text-xs h-4 px-1.5">
                  {item.type}
                </Badge>
              </div>
              <div className="flex justify-between text-xs items-center">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant={item.isActive ? "default" : "secondary"}
                  className="text-xs h-4 px-1.5"
                >
                  {item.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <div className="flex items-center gap-1 shrink-0">
          {onAddChild && (
            <ActionButton
              variant="add"
              buttonVariant="ghost"
              size="xs"
              showLabel={false}
              onClick={onAddChild}
              tooltip="Add child item"
            />
          )}
          <div className="hidden group-hover:flex items-center gap-1">
            <ActionButton
              variant="edit"
              buttonVariant="ghost"
              size="xs"
              onClick={() => onEdit?.(item)}
              permission={TAXABLE_ITEM_UPDATE_PERMISSION}
            />
            <ActionButton
              variant="delete"
              buttonVariant="ghost"
              size="xs"
              onClick={() => onDelete?.(item)}
              permission={TAXABLE_ITEM_DELETE_PERMISSION}
            />
          </div>
        </div>
      </div>
    </TableCell>
  );
}

export function TaxableItemPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedTaxableItem, setSelectedTaxableItem] = useState<
    TaxableItemResponse | undefined
  >();
  const [addChildTarget, setAddChildTarget] = useState<
    AddChildTarget | undefined
  >();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [taxableItemToDelete, setTaxableItemToDelete] = useState<
    TaxableItemResponse | undefined
  >();

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isConvertOpen, setIsConvertOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  // const [costCenter, setCostCenter] = useState<string | undefined>(undefined); NOSONAR
  const debouncedSearch = useDebounce(searchValue, 300);

  // const { data: costCentersData, isLoading: costCenterLoading } =
  //   useGetCostCenterOptions(); NOSONAR
  const queryParams = {
    page: currentPage,
    size: 10,
    search: debouncedSearch || undefined,
    // costCenter: costCenter || undefined,
  };

  const { data, isLoading } = useListTaxableItemRows(queryParams);
  const rows: TaxableItemRow[] = data?.data?.content ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages ?? 0;

  const deleteTaxableItemMutation = useDeleteTaxableItemMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxableItemQueryKeys.all });
      setIsDeleteConfirmOpen(false);
      setTaxableItemToDelete(undefined);
    },
  });

  const importTaxableItemsMutation = useImportTaxableItemsMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taxableItemQueryKeys.lists(),
      });
    },
  });

  const convertHierarchicalTaxableItemsMutation =
    useConvertHierarchicalTaxableItemsMutation();

  const { mutate: handleExport, isPending: isExporting } =
    useExportTaxableItemsMutation();

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedTaxableItem(undefined);
    setAddChildTarget(undefined);
    setIsFormOpen(true);
  };

  const handleAddChild = (parentItem: TaxableItemResponse) => {
    setFormMode("create");
    setSelectedTaxableItem(undefined);
    setAddChildTarget({
      level: (parentItem.level ?? 0) + 1,
      parentId: parentItem.id,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: TaxableItemResponse) => {
    setFormMode("edit");
    setSelectedTaxableItem(item);
    setAddChildTarget(undefined);
    setIsFormOpen(true);
  };

  const handleDelete = (item: TaxableItemResponse) => {
    setTaxableItemToDelete(item);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (taxableItemToDelete) {
      deleteTaxableItemMutation.mutate(taxableItemToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: taxableItemQueryKeys.all });
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(0);
  };
  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(0, endPage - maxVisible + 1);
    }

    if (startPage > 0) {
      items.push(
        <PaginationItem key="start">
          <PaginationLink
            onClick={() => setCurrentPage(0)}
            isActive={currentPage === 0}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );
      if (startPage > 1) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const page = i;
      items.push(
        <PaginationItem key={page}>
          <PaginationLink
            onClick={() => setCurrentPage(page)}
            isActive={currentPage === page}
          >
            {page + 1}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
      items.push(
        <PaginationItem key="end">
          <PaginationLink
            onClick={() => setCurrentPage(totalPages - 1)}
            isActive={currentPage === totalPages - 1}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <Page
      type="base"
      title={TAXABLE_ITEM_LIST_PAGE_TITLE}
      permission={TAXABLE_ITEM_LIST_PERMISSION}
      breadcrumbs={[
        { title: "Master Data", url: "#" },
        { title: TAXABLE_ITEM_LIST_PAGE_TITLE, url: TAXABLE_ITEM_URL },
      ]}
    >
      <PageHeader
        title="Taxable Item"
        description="Manage taxable items and their 4-level hierarchical classification"
        actions={
          <div className="flex items-center gap-2">
            <ActionButton
              variant="export"
              label="Export"
              showLabel
              onClick={() => handleExport()}
              disabled={isExporting}
              permission={TAXABLE_ITEM_EXPORT_PERMISSION}
            />
            <ActionButton
              variant="upload"
              label="Import"
              showLabel
              onClick={() => setIsImportOpen(true)}
              permission={TAXABLE_ITEM_IMPORT_PERMISSION}
            />
            <ActionButton
              variant="generate"
              label="Convert"
              showLabel
              onClick={() => setIsConvertOpen(true)}
              permission={TAXABLE_ITEM_IMPORT_PERMISSION}
            />

            <ActionButton
              variant="add"
              label="Add"
              showLabel
              onClick={handleOpenCreate}
              permission={TAXABLE_ITEM_CREATE_PERMISSION}
            />
          </div>
        }
      />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            {/* <CardTitle className="text-base">Hierarchy Table</CardTitle> */}
            <div className="flex items-center gap-2">
              <SearchInput
                placeholder="Search across all levels..."
                value={searchValue}
                onSearch={handleSearchChange}
                onClear={() => handleSearchChange("")}
                className="max-w-xs"
              />
              {/* <QuerySelect<InputValue, OptionItem>
                id="cost-center-filter"
                className="max-w-xs"
                options={costCentersData?.data?.map((cc) => ({
                  label: cc.label,
                  value: cc.label,
                  description: cc.description,
                }))}
                value={costCenter}
                onValueChange={(val) =>
                  setCostCenter(val as string | undefined)
                }
                placeholder="Filter by Cost Center"
                disabled={costCenterLoading}
              />  NOSONAR*/}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-center font-bold border-r w-1/4">
                    Level 1
                  </TableHead>
                  <TableHead className="text-center font-bold border-r w-1/4">
                    Level 2
                  </TableHead>
                  <TableHead className="text-center font-bold border-r w-1/4">
                    Level 3
                  </TableHead>
                  <TableHead className="text-center font-bold w-1/4">
                    Level 4
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-12 text-muted-foreground"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && rows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-12 text-muted-foreground"
                    >
                      No taxable items found.
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading &&
                  rows.map((row) => {
                    const rowKey = [
                      row.level1?.id,
                      row.level2?.id,
                      row.level3?.id,
                      row.level4?.id,
                    ].join("-");
                    return (
                      <TableRow
                        key={rowKey}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <HierarchyCell
                          item={row.level1}
                          onAddChild={
                            row.level1
                              ? () =>
                                  handleAddChild(
                                    row.level1 as TaxableItemResponse,
                                  )
                              : undefined
                          }
                          onEdit={handleOpenEdit}
                          onDelete={handleDelete}
                        />
                        <HierarchyCell
                          item={row.level2}
                          onAddChild={
                            row.level2
                              ? () =>
                                  handleAddChild(
                                    row.level2 as TaxableItemResponse,
                                  )
                              : undefined
                          }
                          onEdit={handleOpenEdit}
                          onDelete={handleDelete}
                        />
                        <HierarchyCell
                          item={row.level3}
                          onAddChild={
                            row.level3
                              ? () =>
                                  handleAddChild(
                                    row.level3 as TaxableItemResponse,
                                  )
                              : undefined
                          }
                          onEdit={handleOpenEdit}
                          onDelete={handleDelete}
                        />
                        <HierarchyCell
                          item={row.level4}
                          onEdit={handleOpenEdit}
                          onDelete={handleDelete}
                        />
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className=" flex flex-col items-center justify-between px-4 py-3 border-t sm:flex-row">
              <p className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
              </p>
              <Pagination className="p-0 m-0 w-fit">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                      aria-disabled={currentPage === 0}
                      className={cn(
                        currentPage === 0 && "pointer-events-none opacity-50",
                      )}
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                      }
                      aria-disabled={currentPage >= totalPages - 1}
                      className={cn(
                        currentPage >= totalPages - 1 &&
                          "pointer-events-none opacity-50",
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <TaxableItemFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedTaxableItem}
        defaultLevel={addChildTarget?.level}
        defaultParentId={addChildTarget?.parentId}
        onSuccess={handleFormSuccess}
      />

      <ImportModal
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        mutation={importTaxableItemsMutation}
        downloadTemplate={() => taxableItemService.downloadImportTemplate()}
        templateFileName="taxable-item_import_template.xlsx"
      />

      <ImportModal
        open={isConvertOpen}
        title="Convert Taxable Items"
        onOpenChange={setIsConvertOpen}
        mutation={convertHierarchicalTaxableItemsMutation}
        templateFileName="taxable-item_import_template.xlsx"
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Taxable Item"
        description={`Are you sure you want to delete "${taxableItemToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteTaxableItemMutation.isPending}
      />
    </Page>
  );
}

export default TaxableItemPage;
