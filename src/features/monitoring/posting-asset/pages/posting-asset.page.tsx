/**
 * Posting Asset - Group List Page
 * Main entry showing all grouped posting asset records
 */

import type { PostingAssetGroup } from "@/features/monitoring";
import {
  POSTING_ASSET_LIST_PAGE_TITLE,
  POSTING_ASSET_LIST_PERMISSION,
  POSTING_ASSET_URL,
  postingAssetDetailUrl,
  postingAssetGroupColumns,
  postingAssetQueryKeys,
  postingAssetService,
} from "@/features/monitoring";
import { DataTable, type FilterOptions } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { REVERSAL_FLAG_OPTIONS, SAP_STATUS_OPTIONS } from "@railfinance/core/constants";
import { useNavigate } from "react-router";

export function PostingAssetPage() {
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

  const handleViewGroup = (group: PostingAssetGroup) => {
    navigate(
      postingAssetDetailUrl(
        group.reversalFlag,
        group.documentNumber,
        group.reference ?? "",
      ),
    );
  };

  const columns = postingAssetGroupColumns({ onView: handleViewGroup });

  return (
    <Page
      type="monitoring"
      title={POSTING_ASSET_LIST_PAGE_TITLE}
      permission={POSTING_ASSET_LIST_PERMISSION}
      breadcrumbs={[
        { title: "Monitoring", url: "#" },
        { title: POSTING_ASSET_LIST_PAGE_TITLE, url: POSTING_ASSET_URL },
      ]}
    >
      <PageHeader
        title={POSTING_ASSET_LIST_PAGE_TITLE}
        description="Monitor and manage asset batch posting records"
      />

      {/* Data Table */}
      <DataTable<PostingAssetGroup>
        title="Posting Records"
        columns={columns}
        queryFn={postingAssetService.listGrouped}
        queryKey={[...postingAssetQueryKeys.lists()]}
        search={{
          key: "search",
          placeholder:
            "Search by document number, reference, or virtual account",
        }}
        filters={filters}
        toolbar={{
          enableColumnToggle: true,
        }}
      />
    </Page>
  );
}
