/**
 * Access Request Feature - Admin Dashboard Page
 */

import {
  ACCESS_REQUEST_APPROVE_PERMISSION,
  ACCESS_REQUEST_LIST_PAGE_TITLE,
  ACCESS_REQUEST_TABLE_TITLE,
  ACCESS_REQUEST_URL,
  accessRequestService,
  type AccessRequestResponse,
} from "@/features/access-request";
import { accessRequestQueryKeys } from "@railfinance/core/access-request";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useState } from "react";
import { accessRequestColumns } from "../components/access-request-columns";
import { RequestDetailModal } from "../components/request-detail-modal";

export const AccessRequestListPage = () => {
  const [selectedRequest, setSelectedRequest] =
    useState<AccessRequestResponse | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const handleViewRequest = (request: AccessRequestResponse) => {
    setSelectedRequest(request);
    setDetailModalOpen(true);
  };

  const handleSuccess = () => {
    // Invalidate and refetch the list
  };

  const columns = accessRequestColumns({
    onView: handleViewRequest,
  });

  return (
    <Page
      type="base"
      permission={ACCESS_REQUEST_APPROVE_PERMISSION}
      breadcrumbs={[
        { title: "Settings", url: "#" },
        {
          title: ACCESS_REQUEST_LIST_PAGE_TITLE,
          url: ACCESS_REQUEST_URL,
        },
      ]}
    >
      <PageHeader
        title={ACCESS_REQUEST_LIST_PAGE_TITLE}
        description="View and manage all access requests submitted by users."
      />

      {/* Data Table */}
      <div className="rounded-lg border border-border bg-card">
        <DataTable<AccessRequestResponse>
          title={ACCESS_REQUEST_TABLE_TITLE}
          columns={columns}
          queryFn={accessRequestService.listAccessRequests}
          queryKey={accessRequestQueryKeys.lists()}
          search={{
            key: "search",
            placeholder: "Search...",
          }}
        />
      </div>

      {/* Request Detail Modal */}
      <RequestDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        request={selectedRequest || null}
        onSuccess={handleSuccess}
      />
    </Page>
  );
};
