/**
 * Posting Asset Legacy - Group List Page
 * Main entry showing all grouped posting asset legacy records
 */

import type { PostingAssetLegacyGroup } from "@/features/monitoring";
import {
  POSTING_ASSET_LEGACY_LIST_PAGE_TITLE,
  POSTING_ASSET_LEGACY_LIST_PERMISSION,
  POSTING_ASSET_LEGACY_URL,
  postingAssetLegacyDetailUrl,
  postingAssetLegacyGroupColumns,
  postingAssetLegacyQueryKeys,
  postingAssetLegacyService,
  useBatchRegeneratePostingAssetLegacyMutation,
  useBatchSendToSapPostingAssetLegacyMutation,
  useRegeneratePostingAssetLegacyMutation,
  useSendToSapPostingAssetLegacyMutation,
} from "@/features/monitoring";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable, type FilterOptions } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useState } from "react";
import { useNavigate } from "react-router";

export function PostingAssetLegacyPage() {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<PostingAssetLegacyGroup[]>(
    [],
  );
  const [bulkAction, setBulkAction] = useState<
    "regenerate" | "sendToSap" | null
  >(null);

  const batchRegenerateMutation = useBatchRegeneratePostingAssetLegacyMutation({
    onSuccess: () => {
      setSelectedItems([]);
      setBulkAction(null);
    },
  });

  const batchSendToSapMutation = useBatchSendToSapPostingAssetLegacyMutation({
    onSuccess: () => {
      setSelectedItems([]);
      setBulkAction(null);
    },
  });

  const [singleAction, setSingleAction] = useState<{
    type: "regenerate" | "sendToSap";
    group: PostingAssetLegacyGroup;
  } | null>(null);

  const singleRegenerateMutation = useRegeneratePostingAssetLegacyMutation({
    onSuccess: () => setSingleAction(null),
  });

  const singleSendToSapMutation = useSendToSapPostingAssetLegacyMutation({
    onSuccess: () => setSingleAction(null),
  });

  const filters: FilterOptions[] = [
    {
      key: "status",
      label: "Status",
      placeholder: "Filter by status",
      type: "select",
      clearable: true,
      options: [
        { label: "Success", value: "S", description: "" },
        { label: "Cancel", value: "C", description: "" },
        { label: "Error", value: "E", description: "" },
      ],
    },
    {
      key: "month",
      label: "Month",
      placeholder: "Filter by month",
      type: "select",
      clearable: true,
      options: Array.from({ length: 12 }, (_, i) => ({
        label: new Date(2024, i).toLocaleString("default", { month: "long" }),
        value: String(i + 1),
        description: "",
      })),
    },
    {
      key: "year",
      label: "Year",
      placeholder: "Filter by year",
      type: "select",
      clearable: true,
      options: Array.from({ length: 5 }, (_, i) => {
        const year = new Date().getFullYear() - i;
        return { label: String(year), value: String(year), description: "" };
      }),
    },
  ];

  const handleViewGroup = (group: PostingAssetLegacyGroup) => {
    navigate(
      postingAssetLegacyDetailUrl(
        group.REVERSAL,
        group.NO_DOK,
        group.REFERENCE ?? "",
      ),
    );
  };

  const columns = postingAssetLegacyGroupColumns({
    onView: handleViewGroup,
    onRegenerate: (group) => setSingleAction({ type: "regenerate", group }),
    onSendToSap: (group) => setSingleAction({ type: "sendToSap", group }),
  });

  return (
    <Page
      type="monitoring"
      title={POSTING_ASSET_LEGACY_LIST_PAGE_TITLE}
      permission={POSTING_ASSET_LEGACY_LIST_PERMISSION}
      breadcrumbs={[
        { title: "Monitoring", url: "#" },
        {
          title: POSTING_ASSET_LEGACY_LIST_PAGE_TITLE,
          url: POSTING_ASSET_LEGACY_URL,
        },
      ]}
    >
      <PageHeader
        title={POSTING_ASSET_LEGACY_LIST_PAGE_TITLE}
        description="Monitor and manage legacy invoice posting records"
        actions={
          selectedItems.length > 0 ? (
            <div className="flex items-center gap-2">
              <ActionButton
                variant="generate"
                showLabel
                label="Bulk Regenerate"
                onClick={() => setBulkAction("regenerate")}
              />
              <ActionButton
                variant="sent"
                showLabel
                label="Bulk Send to SAP"
                onClick={() => setBulkAction("sendToSap")}
              />
            </div>
          ) : undefined
        }
      />

      <DataTable<PostingAssetLegacyGroup>
        title="Posting Records"
        columns={columns}
        queryFn={postingAssetLegacyService.list}
        queryKey={[...postingAssetLegacyQueryKeys.lists()]}
        search={{
          key: "search",
          placeholder:
            "Search by document number, reference, or virtual account",
        }}
        filters={filters}
        toolbar={{
          enableColumnToggle: true,
        }}
        itemIdKey="NO_DOK"
        selectedItems={selectedItems}
        onItemSelect={setSelectedItems}
      />

      <ConfirmationModal
        open={bulkAction !== null}
        onOpenChange={(open) => {
          if (!open) setBulkAction(null);
        }}
        title={
          bulkAction === "regenerate"
            ? "Bulk Regenerate Posting"
            : "Bulk Send to SAP"
        }
        description={
          bulkAction === "regenerate"
            ? `Are you sure you want to regenerate ${selectedItems.length} selected posting(s)? Existing entries will be replaced.`
            : `Are you sure you want to send ${selectedItems.length} selected posting(s) to SAP for processing?`
        }
        confirmText={bulkAction === "regenerate" ? "Regenerate" : "Send to SAP"}
        confirmVariant="default"
        isLoading={
          batchRegenerateMutation.isPending || batchSendToSapMutation.isPending
        }
        onConfirm={() => {
          const postings = selectedItems.map((item) => ({
            reversal: item.REVERSAL,
            noDok: item.NO_DOK,
            reference: item.REFERENCE ?? "",
          }));

          if (bulkAction === "regenerate") {
            batchRegenerateMutation.mutate({ postings });
          } else {
            batchSendToSapMutation.mutate({ postings });
          }
        }}
      />

      <ConfirmationModal
        open={singleAction !== null}
        onOpenChange={(open) => {
          if (!open) setSingleAction(null);
        }}
        title={
          singleAction?.type === "regenerate"
            ? "Regenerate Posting"
            : "Send to SAP"
        }
        description={
          singleAction?.type === "regenerate"
            ? `Are you sure you want to regenerate posting for document ${singleAction?.group.NO_DOK}? Existing entries will be replaced.`
            : `Are you sure you want to send posting for document ${singleAction?.group.NO_DOK} to SAP for processing?`
        }
        confirmText={
          singleAction?.type === "regenerate" ? "Regenerate" : "Send to SAP"
        }
        confirmVariant="default"
        isLoading={
          singleRegenerateMutation.isPending ||
          singleSendToSapMutation.isPending
        }
        onConfirm={() => {
          if (!singleAction) return;
          const params = {
            reversal: singleAction.group.REVERSAL,
            noDok: singleAction.group.NO_DOK,
            reference: singleAction.group.REFERENCE ?? "",
          };

          if (singleAction.type === "regenerate") {
            singleRegenerateMutation.mutate(params);
          } else {
            singleSendToSapMutation.mutate(params);
          }
        }}
      />
    </Page>
  );
}
