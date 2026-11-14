/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Station List Card Grid
 * Card-based replacement for the station summary DataTable
 */

import {
  digitalVaultQueryKeys,
  digitalVaultService,
  type VaultStationSummary,
} from "@/features/treasury";
import { TableEmptyState } from "@/shared/components/data-table/table-empty-state";
import { ActionButton } from "@railfinance/core/components/actions";
import { Badge } from "@railfinance/core/ui/badge";
import { Button } from "@railfinance/core/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@railfinance/core/ui/card";
import { convertToPaginationParams, getFilterDisplayValue, getFilterValues, renderFilter, type FilterOptions, type SearchOptions } from "@railfinance/core/components/data-table";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@railfinance/core/ui/dialog";
import { Field } from "@railfinance/core/ui/field";
import { formatCurrency, getErrorMessage, toast } from "@railfinance/core/lib";
import { Label } from "@railfinance/core/ui/label";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@railfinance/core/ui/pagination";
import { ProgressLoader } from "@railfinance/core/components/loader";
import { SearchInput } from "@railfinance/core/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@railfinance/core/ui/select";
import { useDebounce } from "@railfinance/core/hooks";
import { type InputValue } from "@railfinance/core/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface StationListCardGridProps {
  title?: string;
  description?: string;
  search?: SearchOptions;
  filters?: FilterOptions[];
  onFiltersChange?: (filters: Record<string, InputValue>) => void;
  onView: (station: VaultStationSummary) => void;
  pageSize?: number;
}

function CardRow({
  label,
  value,
}: Readonly<{ label: string; value: React.ReactNode }>) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}

function StationCard({
  station,
  onView,
}: Readonly<{
  station: VaultStationSummary;
  onView: (station: VaultStationSummary) => void;
}>) {
  return (
    <Card size="sm" className="w-full">
      <CardHeader className="border-b">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate">{station.stationName}</CardTitle>
            <CardDescription className="truncate">
              {station.companyCode}
            </CardDescription>
          </div>
          <Badge variant="outline" className="shrink-0">
            {station.closureCount} Closures
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <CardRow
          label="Total Closure Amount"
          value={formatCurrency(station.totalClosureAmount)}
        />
        <CardRow
          label="Total Deposit Amount"
          value={formatCurrency(station.totalDepositAmount)}
        />
        <CardRow
          label="Total Credit Amount"
          value={formatCurrency(station.totalCreditAmount)}
        />
        <CardRow
          label="Total Complete Amount"
          value={formatCurrency(station.totalCompleteAmount)}
        />
      </CardContent>
      <CardFooter className="border-t justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-primary hover:text-primary"
          onClick={() => onView(station)}
        >
          View Details
          <ArrowRight className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export function StationListCardGrid({
  title,
  description,
  search,
  filters,
  onFiltersChange,
  onView,
  pageSize: initialPageSize = 9,
}: Readonly<StationListCardGridProps>) {
  const defaultFiltersState = useMemo(
    () => getFilterValues(filters || []),
    [filters],
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [filtersState, setFiltersState] =
    useState<Record<string, InputValue>>(defaultFiltersState);
  const [draftFiltersState, setDraftFiltersState] =
    useState<Record<string, InputValue>>(defaultFiltersState);
  const [openFilter, setOpenFilter] = useState(false);

  const debouncedSearch = useDebounce(searchValue, 300);

  const [prevSearch, setPrevSearch] = useState(debouncedSearch);
  if (debouncedSearch !== prevSearch) {
    setPrevSearch(debouncedSearch);
    setCurrentPage(0);
  }

  useEffect(() => {
    onFiltersChange?.(filtersState);
  }, [filtersState, onFiltersChange]);

  useEffect(() => {
    setDraftFiltersState(filtersState);
  }, [filtersState]);

  const handleDraftFilterChange = (
    filter: FilterOptions,
    value: InputValue,
  ) => {
    setDraftFiltersState((prev) => ({ ...prev, [filter.key]: value }));
  };

  const applyFilters = () => {
    setFiltersState(draftFiltersState);
    setCurrentPage(0);
    setOpenFilter(false);
  };

  const handleClearAll = () => {
    const cleared: Record<string, InputValue> = {};
    filters?.forEach((filter) => {
      cleared[filter.key] = "";
    });
    setFiltersState(cleared);
    setDraftFiltersState(cleared);
    setSearchValue("");
    setCurrentPage(0);
    setOpenFilter(false);
  };

  const handleClearFilter = (filterKey: string) => {
    setFiltersState((prev) => ({ ...prev, [filterKey]: "" }));
    setDraftFiltersState((prev) => ({ ...prev, [filterKey]: "" }));
    setCurrentPage(0);
  };

  const queryParams = useMemo(
    () =>
      convertToPaginationParams({
        page: currentPage,
        size: pageSize,
        search: debouncedSearch || undefined,
        filters: filtersState,
      }),
    [currentPage, pageSize, debouncedSearch, filtersState],
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [...digitalVaultQueryKeys.stationSummaryList(), queryParams],
    queryFn: () => digitalVaultService.listStationSummary(queryParams),
  });

  useEffect(() => {
    if (isError) {
      toast.error(getErrorMessage(error) || "Failed to load data");
    }
  }, [isError, error]);

  const paginationData = data?.data;
  const pagination = paginationData?.pagination;
  const content = paginationData?.content || [];

  const totalPages = pagination?.totalPages || 0;
  const currentPageNumber = pagination?.currentPage || 1;
  const from = pagination?.from || 0;
  const to = pagination?.to || 0;
  const totalRows = pagination?.total || 0;

  return (
    <div className="w-full space-y-6">
      <Card className="w-full">
        <CardHeader>
          {title && (
            <CardTitle>
              {title}{" "}
              {totalRows > 0 && (
                <Badge variant="outline">{totalRows} data</Badge>
              )}
            </CardTitle>
          )}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="w-full">
          <div className="flex w-full flex-col items-end gap-2 md:flex-row">
            <div className="flex flex-col items-end gap-2 md:flex-row">
              {search?.key && (
                <Field className="max-w-sm">
                  <Label
                    className="text-xs text-muted-foreground"
                    htmlFor={search.key}
                  >
                    {search.label ? search.label : "Search"}
                  </Label>
                  <SearchInput
                    id={search.key}
                    placeholder={search.placeholder || "Search"}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </Field>
              )}
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              {filters?.map((filter) => {
                const displayValue = getFilterDisplayValue({
                  ...filter,
                  value: filtersState[filter.key],
                });
                if (!displayValue) return null;
                return (
                  <div
                    key={filter.key}
                    className="flex cursor-default items-center gap-1 rounded-md border pl-2 text-sm"
                  >
                    {filter.label}: {displayValue}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-0"
                      onClick={() => handleClearFilter(filter.key)}
                    >
                      <X className="h-3 w-3 cursor-pointer hover:text-destructive" />
                    </Button>
                  </div>
                );
              })}
              {!!filters && filters.length > 0 && (
                <ActionButton
                  variant="filter"
                  showLabel
                  onClick={() => setOpenFilter(true)}
                  label="Filters"
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {!!filters && filters.length > 0 && (
        <Dialog open={openFilter} onOpenChange={setOpenFilter}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Filter</DialogTitle>
            </DialogHeader>
            {filters.map((filter) =>
              renderFilter({
                ...filter,
                value: draftFiltersState[filter.key],
                onchange: handleDraftFilterChange,
              }),
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="black" onClick={handleClearAll}>
                  Reset
                </Button>
              </DialogClose>
              <Button type="button" onClick={applyFilters}>
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <div className="relative">
        {content.length ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {content.map((station) => (
              <StationCard
                key={station.stationName}
                station={station}
                onView={onView}
              />
            ))}
          </div>
        ) : (
          <Card className="w-full">
            <CardContent className="p-0">
              {error ? (
                <div className="flex h-24 items-center justify-center text-center text-sm text-muted-foreground">
                  Error loading data
                </div>
              ) : (
                <TableEmptyState onResetFilter={handleClearAll} />
              )}
            </CardContent>
          </Card>
        )}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-md bg-background/50 backdrop-blur-sm">
            <ProgressLoader />
          </div>
        )}
      </div>

      {totalRows > 0 && (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(0);
                }}
              >
                <SelectTrigger id="pageSize" className="max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="9">9</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 whitespace-nowrap text-center text-sm text-muted-foreground sm:text-left">
              Show {from} to {to} of {totalRows} total results
            </div>
            <Pagination className="w-fit">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((page) => Math.max(0, page - 1));
                    }}
                    className={
                      currentPage === 0 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    const isCurrentPage = currentPageNumber === page;
                    const isVisible =
                      Math.abs(page - currentPageNumber) <= 2 ||
                      page === 1 ||
                      page === totalPages;

                    if (!isVisible && page !== 2 && page !== totalPages - 1) {
                      return null;
                    }

                    if (
                      page !== 1 &&
                      page !== totalPages &&
                      Math.abs(page - currentPageNumber) > 2 &&
                      (page === 2 || page === totalPages - 1)
                    ) {
                      return (
                        <PaginationItem key={`ellipsis-${page}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={isCurrentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page - 1);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  },
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((page) =>
                        Math.min(page + 1, totalPages - 1),
                      );
                    }}
                    className={
                      currentPage === totalPages - 1
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
