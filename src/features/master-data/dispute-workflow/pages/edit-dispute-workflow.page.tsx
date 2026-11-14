import {
  useStageCategoryOptions,
  useStageProcessOptions,
} from "@/features/master-data/approval-workflow/data";
import {
  Button,
  Label,
  Page,
  PageHeader,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Textarea,
  toast,
  useGetRoleOptions,
} from "@railfinance/core";
import {
  useGetLookupValueOptions,
  useGetRejectCategoryOptions,
} from "@railfinance/core/masterdata";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import {
  DISPUTE_WORKFLOW_EDIT_PAGE_TITLE,
  DISPUTE_WORKFLOW_LIST_PAGE_TITLE,
  DISPUTE_WORKFLOW_UPDATE_PERMISSION,
  DISPUTE_WORKFLOW_URL,
  getDisputeWorkflowEditUrl,
  useDisputeWorkflowDetail,
  useDisputeWorkflows,
  useUpdateDisputeWorkflowMutation,
  type DisputeRejectDestination,
  type StageCatalogItem,
  type UpdateDisputeWorkflowDetailItem,
  type UpdateDisputeWorkflowRequest,
} from "../data";
import { UnsavedChangesModal } from "../../shared/unsaved-changes-modal";

export function EditDisputeWorkflowPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const stageProcessParam = id ?? "";

  // 1. Stage info from navigation state
  const stageFromState = location.state as StageCatalogItem | undefined;

  // Fallback query if page was reloaded directly via URL
  const { data: catalogResponse } = useDisputeWorkflows(
    { page: 0, size: 100 },
    {
      enabled: !stageFromState && !!stageProcessParam,
    },
  );

  const matchedStage = useMemo(() => {
    if (stageFromState) return stageFromState;
    return catalogResponse?.data?.content?.find(
      (s) => s.stageProcess === stageProcessParam,
    );
  }, [stageFromState, catalogResponse, stageProcessParam]);

  // Form states for top dropdowns
  const [category, setCategory] = useState<string>(
    stageFromState?.stageProcessCategory || "",
  );
  const [processName, setProcessName] = useState<string>(
    stageFromState?.stageProcess || stageProcessParam || "",
  );

  // Sync state if resolved from fallback catalog query
  useEffect(() => {
    if (matchedStage) {
      if (!category && matchedStage.stageProcessCategory) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCategory(matchedStage.stageProcessCategory);
      }
      if (!processName && matchedStage.stageProcess) {
        setProcessName(matchedStage.stageProcess);
      }
    }
  }, [matchedStage, category, processName]);

  // Options for Stage Category & Stage Process
  const { data: stageCatRes } = useStageCategoryOptions();
  const stageCategoryOptions = Array.isArray(stageCatRes?.data)
    ? stageCatRes.data
    : [];

  const { data: stageProcRes } = useStageProcessOptions(category);
  const stageProcessOptions = Array.isArray(stageProcRes?.data)
    ? stageProcRes.data
    : [];

  // Options for LOVs in Destination Cards
  const { data: rejectCatRes, refetch: refetchRejectCat } =
    useGetLookupValueOptions("REJECT_CATEGORY");
  const { data: rejectCatFallbackRes, refetch: refetchRejectCatFallback } =
    useGetRejectCategoryOptions();
  const rejectCategoryOptions = useMemo(() => {
    if (Array.isArray(rejectCatRes?.data) && rejectCatRes.data.length > 0) {
      return rejectCatRes.data;
    }
    if (Array.isArray(rejectCatFallbackRes?.data)) {
      return rejectCatFallbackRes.data;
    }
    return [];
  }, [rejectCatRes, rejectCatFallbackRes]);

  const { data: roleOptionsRes, refetch: refetchRoleOptions } =
    useGetRoleOptions();
  const roleOptions = Array.isArray(roleOptionsRes?.data)
    ? roleOptionsRes.data
    : [];

  useEffect(() => {
    refetchRejectCat?.();
    refetchRejectCatFallback?.();
    refetchRoleOptions?.();
  }, [refetchRejectCat, refetchRejectCatFallback, refetchRoleOptions]);

  // Existing Reject Destinations from API detail
  const { data: detailResponse, isLoading: isLoadingDetail } =
    useDisputeWorkflowDetail(stageProcessParam, { page: 0, size: 100 });

  const [destinations, setDestinations] = useState<DisputeRejectDestination[]>(
    [],
  );
  const [hasInitializedDestinations, setHasInitializedDestinations] =
    useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  // Initialize destinations from detail API
  useEffect(() => {
    if (detailResponse && !hasInitializedDestinations) {
      const content = detailResponse.data?.content ?? [];
      if (content.length > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDestinations(
          content.map((item, idx) => ({
            id: `rd-${idx + 1}-${Date.now()}`,
            rejectReasonCategory:
              item.rejectReasonCategory ||
              item.rejectReasonCategoryName ||
              "",
            rejectDestination:
              item.rejectDestination?.toLowerCase().includes("non")
                ? "Non Dispute"
                : "Dispute Resolution",
            nonDisputeRole:
              item.nonDisputeRoleCode != null && item.nonDisputeRoleCode !== ""
                ? String(item.nonDisputeRoleCode)
                : item.nonDisputeRole || "",
            afterCaseCloseDestination:
              item.afterCaseCloseDestination?.toLowerCase().includes("another")
                ? "Another stage"
                : "Back to submitter",
            stageProcess:
              item.stageProcessCode != null && item.stageProcessCode !== ""
                ? String(item.stageProcessCode)
                : item.stageProcess || "",
            description: item.description || "",
          })),
        );
      } else {
        // Fallback default destinations if none exist yet
        setDestinations([
          {
            id: `rd-1-${Date.now()}`,
            rejectReasonCategory: "",
            rejectDestination: "Dispute Resolution",
            afterCaseCloseDestination: "Back to submitter",
            description: "",
          },
        ]);
      }
      setHasInitializedDestinations(true);
    }
  }, [detailResponse, hasInitializedDestinations]);

  // Mutation
  const updateMutation = useUpdateDisputeWorkflowMutation();

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setProcessName("");
    setIsFormDirty(true);
  };

  const handleProcessChange = (val: string) => {
    setProcessName(val);
    setIsFormDirty(true);
  };

  const handleAddDestination = () => {
    setIsFormDirty(true);
    const newId = `rd-${Date.now()}`;
    setDestinations((prev) => [
      ...prev,
      {
        id: newId,
        rejectReasonCategory:
          rejectCategoryOptions.length > 0
            ? String(rejectCategoryOptions[0].value)
            : "",
        rejectDestination: "Dispute Resolution",
        afterCaseCloseDestination: "Back to submitter",
        description: "",
      },
    ]);
  };

  const handleRemoveDestination = (destId: string) => {
    setIsFormDirty(true);
    setDestinations((prev) => prev.filter((d) => d.id !== destId));
  };

  const handleUpdateDestination = (
    destId: string,
    field: keyof DisputeRejectDestination,
    value: string,
  ) => {
    setIsFormDirty(true);
    setDestinations((prev) =>
      prev.map((d) => {
        if (d.id !== destId) return d;

        const updated = { ...d, [field]: value };
        // Reset conditional fields if switched
        if (field === "rejectDestination" && value !== "Non Dispute") {
          delete updated.nonDisputeRole;
        } else if (field === "rejectDestination" && value === "Non Dispute") {
          updated.nonDisputeRole =
            updated.nonDisputeRole ||
            (roleOptions.length > 0 ? String(roleOptions[0].value) : "");
        }

        if (
          field === "afterCaseCloseDestination" &&
          value !== "Another stage"
        ) {
          delete updated.stageProcess;
        } else if (
          field === "afterCaseCloseDestination" &&
          value === "Another stage"
        ) {
          updated.stageProcess =
            updated.stageProcess ||
            (stageProcessOptions.length > 0
              ? String(stageProcessOptions[0].value)
              : "");
        }

        return updated;
      }),
    );
  };

  const handleSave = () => {
    const details: UpdateDisputeWorkflowDetailItem[] = destinations.map((d) => {
      const item: UpdateDisputeWorkflowDetailItem = {
        rejectReasonCategory: d.rejectReasonCategory,
        rejectDestination:
          d.rejectDestination === "Non Dispute"
            ? "NON_DISPUTE"
            : "DISPUTE_RESOLUTION",
        afterCaseCloseDestination:
          d.afterCaseCloseDestination === "Another stage"
            ? "ANOTHER_STAGE"
            : "BACK_TO_SUBMITTER",
        description: d.description || "",
      };

      if (d.rejectDestination === "Non Dispute" && d.nonDisputeRole) {
        item.nonDisputeRole = d.nonDisputeRole;
      }

      if (
        d.afterCaseCloseDestination === "Another stage" &&
        d.stageProcess
      ) {
        item.stageProcess = d.stageProcess;
      }

      return item;
    });

    const payload: UpdateDisputeWorkflowRequest = {
      stageProcessCategory: category,
      stageProcess: processName || stageProcessParam,
      details,
    };

    updateMutation.mutate(payload, {
      onSuccess: (res) => {
        toast.success(res.message || "Dispute Workflow updated successfully");
        navigate(DISPUTE_WORKFLOW_URL);
      },
      onError: (error) => {
        const err = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        toast.error(
          err.response?.data?.message ||
          err.message ||
          "Failed to update Dispute Workflow",
        );
      },
    });
  };

  const handleCancel = () => {
    if (isFormDirty) {
      setShowUnsavedModal(true);
    } else {
      navigate(DISPUTE_WORKFLOW_URL);
    }
  };

  return (
    <Page
      type="base"
      title={DISPUTE_WORKFLOW_EDIT_PAGE_TITLE}
      permission={DISPUTE_WORKFLOW_UPDATE_PERMISSION}
      breadcrumbs={[
        { title: "Master Data", url: "#" },
        { title: DISPUTE_WORKFLOW_LIST_PAGE_TITLE, url: DISPUTE_WORKFLOW_URL },
        {
          title: DISPUTE_WORKFLOW_EDIT_PAGE_TITLE,
          url: getDisputeWorkflowEditUrl(stageProcessParam),
        },
      ]}
    >
      <div className="space-y-6">
        <PageHeader title="Edit Dispute Workflow" withBackButton={false} />

        {/* Main Form Column */}
        <div className="max-w-5xl space-y-6">
          {/* Top Dropdowns Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-[1fr_544px] items-center gap-6">
              <Label className="text-sm font-medium text-foreground">
                Stage Process Category <span className="text-destructive">*</span>
              </Label>
              <Select value={category} onValueChange={handleCategoryChange} disabled>
                <SelectTrigger className="w-full bg-card">
                  <SelectValue placeholder="Select Stage Process Category" />
                </SelectTrigger>
                <SelectContent>
                  {stageCategoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-[1fr_544px] items-center gap-6">
              <Label className="text-sm font-medium text-foreground">
                Stage Process Name <span className="text-destructive">*</span>
              </Label>
              <Select
                value={processName}
                onValueChange={handleProcessChange}
                disabled
              >
                <SelectTrigger className="w-full bg-card">
                  <SelectValue
                    placeholder={
                      category
                        ? "Select Stage Process Name"
                        : "Select Stage Process Category first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {stageProcessOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reject Destination Cards */}
          <div className="space-y-6">
            {destinations.map((dest) => (
              <div key={dest.id} className="relative flex items-start">
                <div className="w-full">
                  <DestinationCard
                    destination={dest}
                    rejectCategoryOptions={rejectCategoryOptions}
                    roleOptions={roleOptions}
                    stageProcessOptions={stageProcessOptions}
                    onUpdate={handleUpdateDestination}
                  />
                </div>
                {/* Red Trash Button positioned to the right of the card */}
                {destinations.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="size-10 rounded-lg bg-red-600 hover:bg-red-700 text-white shrink-0 absolute left-[calc(100%+12px)] top-0"
                    onClick={() => handleRemoveDestination(dest.id)}
                  >
                    <Trash2 className="size-5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add Reject Destination with divider line */}
        <div className="flex items-center my-6">
          <div className="flex-1 flex items-center">
            <Separator className="w-full" />
          </div>
          <Button
            type="button"
            variant="outline"
            className="border-indigo-300 text-indigo-950 hover:bg-slate-50 gap-2 font-medium bg-card shadow-none h-9 px-4 rounded-lg shrink-0"
            onClick={handleAddDestination}
          >
            <Plus className="size-4" /> Add Reject Destination
          </Button>
          <div className="flex-1 flex items-center">
            <Separator className="w-full" />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="w-24"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={
              updateMutation.isPending ||
              isLoadingDetail ||
              (!isFormDirty && !hasInitializedDestinations)
            }
            className="w-24 bg-[#1C2052] hover:bg-[#151945] text-white disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-100 disabled:cursor-not-allowed shadow-none"
            onClick={handleSave}
          >
            {updateMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <UnsavedChangesModal
        open={showUnsavedModal}
        onOpenChange={setShowUnsavedModal}
        onDiscard={() => {
          setIsFormDirty(false);
          navigate(DISPUTE_WORKFLOW_URL);
        }}
        onSave={() => {
          setShowUnsavedModal(false);
          handleSave();
        }}
        saveDisabled={updateMutation.isPending || isLoadingDetail}
        compact
      />
    </Page>
  );
}

interface DestinationCardProps {
  destination: DisputeRejectDestination;
  rejectCategoryOptions: Array<{ label: string; value: string | number }>;
  roleOptions: Array<{ label: string; value: string | number }>;
  stageProcessOptions: Array<{ label: string; value: string }>;
  onUpdate: (
    id: string,
    field: keyof DisputeRejectDestination,
    value: string,
  ) => void;
}

function DestinationCard({
  destination: dest,
  rejectCategoryOptions,
  roleOptions,
  stageProcessOptions,
  onUpdate,
}: Readonly<DestinationCardProps>) {
  const drId = useId();
  const ndId = useId();
  const btsId = useId();
  const asId = useId();

  return (
    <div className="rounded-xl border border-border p-6 space-y-5">
      {/* 1. Reject Reason Category & Reject Destination */}
      <div className="space-y-5">
        <div className="grid grid-cols-[1fr_520px] items-center gap-6">
          <Label className="text-sm font-medium text-foreground">
            Reject Reason Category <span className="text-destructive">*</span>
          </Label>
          <Select
            value={dest.rejectReasonCategory}
            onValueChange={(val) =>
              onUpdate(dest.id, "rejectReasonCategory", val)
            }
          >
            <SelectTrigger className="w-full bg-card">
              <SelectValue placeholder="Select Reject Reason Category" />
            </SelectTrigger>
            <SelectContent>
              {rejectCategoryOptions.map((opt) => (
                <SelectItem key={String(opt.value)} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-[1fr_520px] items-center gap-6">
          <Label className="text-sm font-medium text-foreground">
            Reject Destination <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            value={dest.rejectDestination}
            onValueChange={(val) =>
              onUpdate(
                dest.id,
                "rejectDestination",
                val as "Dispute Resolution" | "Non Dispute",
              )
            }
            className="flex items-center gap-6"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Dispute Resolution" id={drId} />
              <Label
                htmlFor={drId}
                className="font-normal cursor-pointer text-sm"
              >
                Dispute Resolution
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Non Dispute" id={ndId} />
              <Label
                htmlFor={ndId}
                className="font-normal cursor-pointer text-sm"
              >
                Non Dispute
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Non Dispute Role (Conditional) */}
        {dest.rejectDestination === "Non Dispute" && (
          <div className="grid grid-cols-[1fr_520px] items-center gap-6">
            <Label className="text-sm font-medium text-foreground">
              Non Dispute Role <span className="text-destructive">*</span>
            </Label>
            <Select
              value={dest.nonDisputeRole || ""}
              onValueChange={(val) => onUpdate(dest.id, "nonDisputeRole", val)}
            >
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="Select Non Dispute Role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((opt) => (
                  <SelectItem key={String(opt.value)} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Separator under Reject Destination block */}
      <Separator className="w-full" />

      {/* 2. After Case Close Destination & Stage Process */}
      <div className="space-y-5">
        <div className="grid grid-cols-[1fr_520px] items-center gap-6">
          <Label className="text-sm font-medium text-foreground">
            After Case Close Destination <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            value={dest.afterCaseCloseDestination}
            onValueChange={(val) =>
              onUpdate(
                dest.id,
                "afterCaseCloseDestination",
                val as "Back to submitter" | "Another stage",
              )
            }
            className="flex items-center gap-6"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Back to submitter" id={btsId} />
              <Label
                htmlFor={btsId}
                className="font-normal cursor-pointer text-sm"
              >
                Back to submitter
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Another stage" id={asId} />
              <Label
                htmlFor={asId}
                className="font-normal cursor-pointer text-sm"
              >
                Another stage
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Stage Process (Conditional) */}
        {dest.afterCaseCloseDestination === "Another stage" && (
          <div className="grid grid-cols-[1fr_520px] items-center gap-6">
            <Label className="text-sm font-medium text-foreground">
              Stage Process <span className="text-destructive">*</span>
            </Label>
            <Select
              value={dest.stageProcess || ""}
              onValueChange={(val) => onUpdate(dest.id, "stageProcess", val)}
            >
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="Select Stage Process" />
              </SelectTrigger>
              <SelectContent>
                {stageProcessOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Separator under After Case Close Destination block */}
      <Separator className="w-full" />

      {/* 3. Description */}
      <div className="grid grid-cols-[1fr_520px] items-start gap-6">
        <Label className="text-sm font-medium text-foreground pt-2">
          Description
        </Label>
        <Textarea
          placeholder="Enter Description"
          value={dest.description}
          onChange={(e) => onUpdate(dest.id, "description", e.target.value)}
          className="min-h-[100px] bg-card resize-y"
        />
      </div>
    </div>
  );
}

export default EditDisputeWorkflowPage;
