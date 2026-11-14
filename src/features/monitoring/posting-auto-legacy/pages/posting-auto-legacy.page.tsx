/**
 * Posting Auto Legacy - Group List Page
 * Main entry showing all grouped posting auto legacy records
 */

import type { PostingAutoLegacyGroup } from "@/features/monitoring";
import {
  POSTING_AUTO_LEGACY_LIST_PAGE_TITLE,
  POSTING_AUTO_LEGACY_LIST_PERMISSION,
  POSTING_AUTO_LEGACY_URL,
  postingAutoLegacyDetailUrl,
  postingAutoLegacyGroupColumns,
  postingAutoLegacyQueryKeys,
  postingAutoLegacyService,
  useBatchRegeneratePostingAutoLegacyMutation,
  useBatchSendToSapPostingAutoLegacyMutation,
  useRegeneratePostingAutoLegacyMutation,
  useSendToSapPostingAutoLegacyMutation,
} from "@/features/monitoring";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable, type FilterOptions } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useState } from "react";
import { useNavigate } from "react-router";

export function PostingAutoLegacyPage() {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<PostingAutoLegacyGroup[]>(
    [],
  );
  const [bulkAction, setBulkAction] = useState<
    "regenerate" | "sendToSap" | null
  >(null);

  const batchRegenerateMutation = useBatchRegeneratePostingAutoLegacyMutation({
    onSuccess: () => {
      setSelectedItems([]);
      setBulkAction(null);
    },
  });

  const batchSendToSapMutation = useBatchSendToSapPostingAutoLegacyMutation({
    onSuccess: () => {
      setSelectedItems([]);
      setBulkAction(null);
    },
  });

  const [singleAction, setSingleAction] = useState<{
    type: "regenerate" | "sendToSap";
    group: PostingAutoLegacyGroup;
  } | null>(null);

  const singleRegenerateMutation = useRegeneratePostingAutoLegacyMutation({
    onSuccess: () => setSingleAction(null),
  });

  const singleSendToSapMutation = useSendToSapPostingAutoLegacyMutation({
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

  const handleViewGroup = (group: PostingAutoLegacyGroup) => {
    navigate(
      postingAutoLegacyDetailUrl(
        group.REVERSAL,
        group.NO_DOK,
        group.REFERENCE ?? "",
      ),
    );
  };

  const columns = postingAutoLegacyGroupColumns({
    onView: handleViewGroup,
    onRegenerate: (group) => setSingleAction({ type: "regenerate", group }),
    onSendToSap: (group) => setSingleAction({ type: "sendToSap", group }),
  });

  return (
    <Page
      type="monitoring"
      title={POSTING_AUTO_LEGACY_LIST_PAGE_TITLE}
      permission={POSTING_AUTO_LEGACY_LIST_PERMISSION}
      breadcrumbs={[
        { title: "Monitoring", url: "#" },
        {
          title: POSTING_AUTO_LEGACY_LIST_PAGE_TITLE,
          url: POSTING_AUTO_LEGACY_URL,
        },
      ]}
    >
      <PageHeader
        title={POSTING_AUTO_LEGACY_LIST_PAGE_TITLE}
        description="Monitor and manage legacy payment posting records"
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

      <DataTable<PostingAutoLegacyGroup>
        title="Posting Records"
        columns={columns}
        queryFn={postingAutoLegacyService.list}
        queryKey={[...postingAutoLegacyQueryKeys.lists()]}
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
