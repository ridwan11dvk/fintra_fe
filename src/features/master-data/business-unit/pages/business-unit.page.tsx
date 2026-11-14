import { StatusToggleModal, TableEmptyState } from "@/shared/components";
import {
  AlertBanner,
  Button,
  DataTable,
  Page,
  PageHeader,
  toast,
  Visibility,
  type PagedApiResponse,
} from "@railfinance/core";
import { useQueryClient } from "@tanstack/react-query";
import { PlusCircle, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router";
import { businessUnitColumns } from "../components/business-unit-columns";
import { businessUnitQueryKeys, businessUnitService } from "../data";
import type { BusinessUnitResponse } from "../data/business-unit.types";
import {
  BUSINESS_UNIT_CREATE_PERMISSION,
  BUSINESS_UNIT_CREATE_URL,
  BUSINESS_UNIT_LIST_PAGE_TITLE,
  BUSINESS_UNIT_LIST_PERMISSION,
  BUSINESS_UNIT_URL,
  getBusinessUnitDetailUrl,
  getBusinessUnitEditUrl,
} from "../data/business-unit.utils";

/**
 * Injects TableEmptyState into the DataTable's empty cell when search/filter returns 0 results
 */
function TableEmptyStatePortal({
  containerRef,
  onResetFilter,
}: Readonly<{
  containerRef: React.RefObject<HTMLDivElement | null>;
  onResetFilter: () => void;
}>) {
  const [targetCell, setTargetCell] = useState<HTMLTableCellElement | null>(
    null,
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkCell = () => {
      const cell = container.querySelector<HTMLTableCellElement>(
        "tbody td.text-center",
      );
      if (
        cell &&
        (cell.textContent?.trim() === "No results." ||
          cell.dataset.emptyPortal === "true")
      ) {
        if (!cell.dataset.emptyPortal) {
          cell.dataset.emptyPortal = "true";
          cell.textContent = "";
        }
        setTargetCell(cell);
      } else {
        setTargetCell(null);
      }
    };

    checkCell();

    const observer = new MutationObserver(checkCell);
    observer.observe(container, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [containerRef]);

  if (!targetCell) return null;

  return createPortal(
    <TableEmptyState onResetFilter={onResetFilter} />,
    targetCell,
  );
}

export function BusinessUnitPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [totalCount, setTotalCount] = useState<number>(50);

  // Toggle confirmation modal state
  const [toggleTarget, setToggleTarget] = useState<BusinessUnitResponse | null>(
    null,
  );

  // Success alert banner state
  const [bannerAlert, setBannerAlert] = useState<{
    type?: "activated" | "deactivated" | "success";
    title: string;
    description: string;
  } | null>(() => location.state?.bannerAlert || null);

  useEffect(() => {
    if (location.state?.bannerAlert) {
      globalThis.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleCreate = () => {
    navigate(BUSINESS_UNIT_CREATE_URL);
  };

  const handleView = useCallback(
    (item: BusinessUnitResponse) => {
      navigate(getBusinessUnitDetailUrl(item.id));
    },
    [navigate],
  );

  const handleEdit = useCallback(
    (item: BusinessUnitResponse) => {
      navigate(getBusinessUnitEditUrl(item.id));
    },
    [navigate],
  );

  const handleToggle = useCallback((item: BusinessUnitResponse) => {
    setToggleTarget(item);
  }, []);

  const handleConfirmToggle = async () => {
    if (!toggleTarget) return;

    try {
      await businessUnitService.toggleBusinessUnit(toggleTarget.id);
      queryClient.invalidateQueries({
        queryKey: businessUnitQueryKeys.lists(),
      });

      const willBeLinked = !toggleTarget.isLinked;
      setBannerAlert({
        type: willBeLinked ? "activated" : "deactivated",
        title: willBeLinked
          ? "Business Unit activated successfully"
          : "Business Unit deactivated successfully",
        description: willBeLinked
          ? "The Business Unit has been activated."
          : "The Business Unit has been deactivated.",
      });
    } catch {
      toast.error("Failed to update status");
    } finally {
      setToggleTarget(null);
    }
  };

  const handleResetFilter = () => {
    const input = tableContainerRef.current?.querySelector<HTMLInputElement>(
      "input#search, input[placeholder*='Search']",
    );
    if (input) {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        globalThis.HTMLInputElement.prototype,
        "value",
      )?.set;
      nativeSetter?.call(input, "");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

  const columns = businessUnitColumns({
    onView: handleView,
    onEdit: handleEdit,
    onToggle: handleToggle,
  });

  const handleDataLoaded = (data: PagedApiResponse<BusinessUnitResponse>) => {
    if (data.data?.pagination?.total !== undefined) {
      setTotalCount(data.data.pagination.total);
    }
  };

  return (
    <Page
      type="base"
      title={BUSINESS_UNIT_LIST_PAGE_TITLE}
      permission={BUSINESS_UNIT_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: BUSINESS_UNIT_LIST_PAGE_TITLE,
          url: BUSINESS_UNIT_URL,
        },
      ]}
    >
      <PageHeader
        title={BUSINESS_UNIT_LIST_PAGE_TITLE}
        withBackButton={false}
        actions={
          <div className="flex items-center gap-3">
            <Visibility permission={BUSINESS_UNIT_CREATE_PERMISSION}>
              <Button
                className="gap-2 bg-[#1b2559] hover:bg-[#1b2559]/90 text-white font-medium"
                onClick={handleCreate}
              >
                <PlusCircle className="h-4 w-4" />
                Add Business Unit
              </Button>
            </Visibility>
          </div>
        }
      />

      {/* AlertBanner from @railfinance/ui */}
      {bannerAlert && (
        <div className="relative mb-4">
          <AlertBanner
            items={[
              {
                level: "success",
                title: bannerAlert.title,
                description: bannerAlert.description,
              },
            ]}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2.5 right-2.5 size-6 text-muted-foreground hover:text-foreground"
            onClick={() => setBannerAlert(null)}
          >
            <X className="size-3.5" />
          </Button>
        </div>
      )}

      {/* Table Container wrapping DataTable and TableEmptyState portal */}
      <div ref={tableContainerRef} className="relative">
        <DataTable<BusinessUnitResponse>
          title="All Business Unit"
          badge={{
            enabled: true,
            label: `${totalCount} Business Unit`,
            variant: "outline",
          }}
          columns={columns}
          queryFn={businessUnitService.listBusinessUnits}
          queryKey={businessUnitQueryKeys.lists()}
          search={{
            key: "search",
            label: "Search",
            placeholder: "Search Business Unit",
          }}
          toolbar={{
            enableColumnToggle: false,
            enableFullscreenToggle: false,
          }}
          onDataLoaded={handleDataLoaded}
        />

        <TableEmptyStatePortal
          containerRef={tableContainerRef}
          onResetFilter={handleResetFilter}
        />
      </div>

      {/* Reusable StatusToggleModal from @/shared/components */}
      <StatusToggleModal
        open={!!toggleTarget}
        onOpenChange={(open) => {
          if (!open) setToggleTarget(null);
        }}
        isActive={toggleTarget?.isLinked}
        onConfirm={handleConfirmToggle}
        onCancel={() => setToggleTarget(null)}
      />
    </Page>
  );
}

export default BusinessUnitPage;
