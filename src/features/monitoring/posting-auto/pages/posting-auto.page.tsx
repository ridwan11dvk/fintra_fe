/**
 * Posting Auto - Group List Page
 * Main entry showing all grouped posting auto records
 */

import type { PostingAutoGroup } from "@/features/monitoring";
import {
  POSTING_AUTO_LIST_PAGE_TITLE,
  POSTING_AUTO_LIST_PERMISSION,
  POSTING_AUTO_URL,
  postingAutoDetailUrl,
  postingAutoGroupColumns,
  postingAutoQueryKeys,
  postingAutoService,
} from "@/features/monitoring";
import { DataTable, type FilterOptions } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { REVERSAL_FLAG_OPTIONS, SAP_STATUS_OPTIONS } from "@railfinance/core/constants";
import { useNavigate } from "react-router";

export function PostingAutoPage() {
  const navigate = useNavigate();

  const filters: FilterOptions[] = [
    {
      key: "sapStatus",
      label: "SAP Status",
      placeholder: "Filter by SAP status",
      type: "select",
      clearable: true,
      options: SAP_STATUS_OPTIONS,
    },
    {
      key: "reversalFlag",
      label: "Reversal Flag",
      placeholder: "Filter by reversal flag",
      type: "select",
      clearable: true,
      options: REVERSAL_FLAG_OPTIONS,
    },
  ];

  const handleViewGroup = (group: PostingAutoGroup) => {
    navigate(
      postingAutoDetailUrl(
        group.reversalFlag,
        group.documentNumber,
        group.reference ?? "",
      ),
    );
  };

  const columns = postingAutoGroupColumns({ onView: handleViewGroup });

  return (
    <Page
      type="monitoring"
      title={POSTING_AUTO_LIST_PAGE_TITLE}
      permission={POSTING_AUTO_LIST_PERMISSION}
      breadcrumbs={[
        { title: "Monitoring", url: "#" },
        { title: POSTING_AUTO_LIST_PAGE_TITLE, url: POSTING_AUTO_URL },
      ]}
    >
      <PageHeader
        title={POSTING_AUTO_LIST_PAGE_TITLE}
        description="Monitor and manage automated batch posting records"
      />

      {/* Data Table */}
      <DataTable<PostingAutoGroup>
        title="Posting Records"
        columns={columns}
        queryFn={postingAutoService.listGrouped}
        queryKey={[...postingAutoQueryKeys.lists()]}
        search={{
          key: "search",
          placeholder:
            "Search by document number, business area, or assignment",
        }}
        filters={filters}
        toolbar={{
          enableColumnToggle: true,
        }}
      />
    </Page>
  );
}
