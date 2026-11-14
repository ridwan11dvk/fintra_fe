/**
 * Digital Vault - Station Summary List Page
 * Main entry point showing all stations with aggregated closure and deposit data
 */

import {
  closuredetailUrl,
  DIGITAL_VAULT_LIST_PAGE_TITLE,
  DIGITAL_VAULT_LIST_PERMISSION,
  DIGITAL_VAULT_STATION_LIST_PAGE_TITLE,
  DIGITAL_VAULT_URL,
  StationListCardGrid,
  TotalSummaryCard,
} from "@/features/treasury";
import { formatDate, getLastThreeMonthDateRange } from "@railfinance/core/lib";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { type FilterOptions } from "@railfinance/core/components/data-table";
import { type InputValue } from "@railfinance/core/types";

import { useCallback, useState } from "react";
import type { DateRange } from "react-day-picker";
import { useNavigate } from "react-router";

export function StationListPage() {
  const navigate = useNavigate();
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

  return (
    <Page
      type="treasury"
      title={DIGITAL_VAULT_STATION_LIST_PAGE_TITLE}
      permission={DIGITAL_VAULT_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Treasury",
          url: "#",
        },
        {
          title: DIGITAL_VAULT_LIST_PAGE_TITLE,
          url: DIGITAL_VAULT_URL,
        },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Deposit Box"
          description="Real-time revenue deposit monitoring and reconciliation"
        />

        <TotalSummaryCard filters={filterState} />

        <StationListCardGrid
          title="Station Summary"
          description={generateDescription()}
          onView={(station) => {
            navigate(closuredetailUrl(station.stationName));
          }}
          search={{
            key: "search",
            placeholder: "Search by station name",
          }}
          filters={filters}
          onFiltersChange={setFilterState}
        />
      </div>
    </Page>
  );
}
