/**
 * Digital Vault - Closure Detail Page
 * Shows all closures for a specific station
 */

import {
  closureDetailColumns,
  DIGITAL_VAULT_LIST_PAGE_TITLE,
  DIGITAL_VAULT_READ_PERMISSION,
  DIGITAL_VAULT_URL,
  digitalVaultQueryKeys,
  digitalVaultService,
  TotalSummaryCard,
  TransactionDetailModal,
  type VaultStationClosureDetail,
} from "@/features/treasury";
import { DataTable, type FilterOptions } from "@railfinance/core/components/data-table";
import { formatDate, getLastThreeMonthDateRange } from "@railfinance/core/lib";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { type InputValue, type PaginationParams } from "@railfinance/core/types";
import { useCallback, useState } from "react";
import type { DateRange } from "react-day-picker";
import { useParams } from "react-router";

export function ClosureDetailPage() {
  const { stationName } = useParams<{ stationName: string }>();

  const decodedStationName = stationName
    ? decodeURIComponent(stationName)
    : "Unknown Station";

  // Transaction detail modal state
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | undefined
  >();

  const [filterState, setFilterState] = useState<Record<string, InputValue>>();

  const filters = [
    {
      key: "dateRange",
      label: "Data Range",
      placeholder: "Filter by date range",
      type: "date-range",
      clearable: true,
      defaultValue: getLastThreeMonthDateRange(),
    },
  ] as FilterOptions[];

  const generateDescription = useCallback(() => {
    const dateRange = filterState?.["dateRange"] as DateRange;
    const description = dateRange
      ? formatDate(dateRange?.from?.toString() ?? "", "MMM DD, YYYY") +
        " - " +
        formatDate(dateRange?.to?.toString() ?? "", "MMM DD, YYYY")
      : "";
    return description;
  }, [filterState]);

  const columns = closureDetailColumns({
    onView: (closure) => {
      setSelectedTransactionId(closure.id);
    },
  });

  // Create a query function wrapper that includes stationName
  const queryFn = async (params: PaginationParams) => {
    return digitalVaultService.listClosureDetail(decodedStationName, params);
  };

  return (
    <Page
      type="treasury"
      title={`Deposit Box  ${decodedStationName} Station`}
      permission={DIGITAL_VAULT_READ_PERMISSION}
      breadcrumbs={[
        {
          title: "Treasury",
          url: "#",
        },
        {
          title: DIGITAL_VAULT_LIST_PAGE_TITLE,
          url: DIGITAL_VAULT_URL,
        },
        {
          title: decodedStationName,
          url: "#",
        },
      ]}
    >
      <div className="space-y-6">
        {/* Header with Back Button */}

        <PageHeader
          title={`${decodedStationName}`}
          description="View all closure records and their deposit status"
        />

        <TotalSummaryCard filters={{ ...filterState, stationName }} />

        <DataTable<VaultStationClosureDetail>
          title="Closure Details"
          description={generateDescription()}
          columns={columns}
          queryFn={queryFn}
          queryKey={digitalVaultQueryKeys.closureDetailList(decodedStationName)}
          onRowClick={(closure) => setSelectedTransactionId(closure.id)}
          search={{
            key: "search",
            placeholder: "Search by closure #, VA, or company code",
          }}
          filters={filters}
          onFiltersChange={setFilterState}
          toolbar={{
            enableColumnToggle: true,
          }}
        />

        {/* Transaction Detail Modal */}
        <TransactionDetailModal
          isOpen={!!selectedTransactionId}
          onClose={() => setSelectedTransactionId(undefined)}
          selectedId={selectedTransactionId || 0}
        />
      </div>
    </Page>
  );
}
