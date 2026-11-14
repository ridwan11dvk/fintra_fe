import {
  Button,
  Page,
  PageHeader,
  Separator,
  toast,
  useGetRoleOptions,
} from "@railfinance/core";
import { ProgressLoader } from "@railfinance/core/components/loader";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import {
  ApprovalLevelList,
  ApprovalLevelModal,
  ApprovalWorkflowInfoForm,
} from "../components";
import {
  APPROVAL_WORKFLOW_CREATE_PAGE_TITLE,
  APPROVAL_WORKFLOW_CREATE_PERMISSION,
  APPROVAL_WORKFLOW_CREATE_URL,
  APPROVAL_WORKFLOW_EDIT_PAGE_TITLE,
  APPROVAL_WORKFLOW_LIST_PAGE_TITLE,
  APPROVAL_WORKFLOW_UPDATE_PERMISSION,
  APPROVAL_WORKFLOW_URL,
  formatNumberWithCommas,
  findInvalidApprovalRole,
  getApprovalWorkflowEditUrl,
  useApprovalWorkflowDetail,
  useCreateApprovalWorkflowMutation,
  useApprovalWorkflowStageTemplate,
  useUpdateApprovalWorkflowMutation,
  type ApprovalLevelItem,
  type ApprovalWorkflowFormData,
  type CreateApprovalWorkflowRequest,
} from "../data";

interface ApprovalWorkflowFormInnerProps {
  id?: string;
}

function ApprovalWorkflowFormInner({ id }: Readonly<ApprovalWorkflowFormInnerProps>) {
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const permission = isEdit
    ? APPROVAL_WORKFLOW_UPDATE_PERMISSION
    : APPROVAL_WORKFLOW_CREATE_PERMISSION;

  const { data: detailResponse, isLoading: isLoadingDetail } = useApprovalWorkflowDetail(
    isEdit ? id : undefined,
  );
  const detailData = detailResponse?.data;
  const { data: roleOptionsResponse, isLoading: isLoadingRoles, isError: hasRoleOptionsError } = useGetRoleOptions();

  const pageTitle = isEdit
    ? APPROVAL_WORKFLOW_EDIT_PAGE_TITLE
    : APPROVAL_WORKFLOW_CREATE_PAGE_TITLE;

  const pageUrl =
    isEdit && id
      ? getApprovalWorkflowEditUrl(id)
      : APPROVAL_WORKFLOW_CREATE_URL;

  const [levels, setLevels] = useState<ApprovalLevelItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<ApprovalLevelItem | null>(null);
  const loadedTemplateFor = useRef<string | null>(null);

  const formValues = useMemo(() => {
    if (isEdit && detailData) {
      return {
        transactionType: String(detailData.transactionType ?? ""),
        workflowName: detailData.name || "",
        description: detailData.description || "",
      };
    }
    return undefined;
  }, [isEdit, detailData]);

  const {
    handleSubmit,
    control,
  } = useForm<ApprovalWorkflowFormData>({
    values: formValues,
    defaultValues: {
      transactionType: "",
      workflowName: "",
      description: "",
    },
  });

  const transactionType = useWatch({ control, name: "transactionType" });
  const workflowName = useWatch({ control, name: "workflowName" });
  const transactionTypeId = transactionType ? Number(transactionType) : undefined;
  const {
    data: stageTemplateResponse,
    isLoading: isLoadingStageTemplate,
    isError: hasStageTemplateError,
  } = useApprovalWorkflowStageTemplate(transactionTypeId, {
    enabled: !isEdit && Boolean(transactionTypeId),
  });

  useEffect(() => {
    if (
      isEdit ||
      !transactionType ||
      !stageTemplateResponse?.data ||
      loadedTemplateFor.current === transactionType
    ) {
      return;
    }

    const templateLevels = stageTemplateResponse.data.map((stage, index) => ({
      id: `${transactionType}-${stage.stageProcess}`,
      order: index + 1,
      layer: stage.stageProcessCategory,
      categoryName: stage.stageProcessCategoryName || stage.stageProcessCategory,
      title: stage.stageProcess,
      processName: stage.stageProcessName || stage.stageProcess,
      description: stage.outputStep || "",
      outputStep: stage.outputStep || "",
      roleSetting: "manually" as const,
      roleName: undefined,
    }));
    setLevels(templateLevels);
    loadedTemplateFor.current = transactionType;
  }, [isEdit, transactionType, stageTemplateResponse]);

  const isFormComplete =
    Boolean(transactionType) &&
    Boolean(workflowName?.trim()) &&
    levels.length > 0;

  useEffect(() => {
    if (detailData?.levels && detailData.levels.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLevels(
        detailData.levels.map((lvl, idx) => ({
          id: lvl.id || `lvl-${idx + 1}`,
          order: idx + 1,
          layer: lvl.stageProcessCategory,
          categoryName: lvl.stageProcessCategoryName || lvl.stageProcessCategory,
          title: lvl.stageProcess,
          processName: lvl.stageProcessName || lvl.stageProcess,
          description: lvl.outputStep || "",
          outputStep: lvl.outputStep,
          roleSetting: lvl.roleSetting === "LIMIT_BANDS" ? "limit-based" : "manually",
          roleName: lvl.role,
          limits: lvl.bands?.map((b) => ({
            id: crypto.randomUUID(),
            minAmount: formatNumberWithCommas(b.min),
            maxAmount: formatNumberWithCommas(b.max),
            roleName: b.role,
          })),
        })),
      );
    }
  }, [detailData]);

  const createMutation = useCreateApprovalWorkflowMutation();
  const updateMutation = useUpdateApprovalWorkflowMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (data: ApprovalWorkflowFormData) => {
    if (isLoadingRoles || hasRoleOptionsError || !roleOptionsResponse?.data?.length) {
      toast.error("Role options are unavailable. Please try again before saving.");
      return;
    }
    const validRoles = roleOptionsResponse.data.map((role) => role.label);
    const invalidRole = findInvalidApprovalRole(levels, validRoles);
    if (invalidRole) {
      toast.error(`Level ${invalidRole.level.order}: ${invalidRole.error}`);
      setEditingLevel(invalidRole.level);
      setIsModalOpen(true);
      return;
    }

    const payload: CreateApprovalWorkflowRequest = {
      transactionType: Number(data.transactionType),
      name: data.workflowName.trim(),
      description: data.description ? data.description.trim() : "",
      currency: "IDR",
      levels: levels.map((lvl) => {
        const isLimit = lvl.roleSetting === "limit-based";
        return {
          stageProcessCategory: lvl.layer || "",
          stageProcess: lvl.title || "",
          outputStep: lvl.outputStep || "",
          roleSetting: isLimit ? "LIMIT_BANDS" : "MANUAL",
          role: isLimit ? undefined : lvl.roleName,
          bands: isLimit
            ? (lvl.limits || []).map((l) => ({
              min: Number(String(l.minAmount).replaceAll(/[^\d]/g, "") || "0"),
              max: Number(String(l.maxAmount).replaceAll(/[^\d]/g, "") || "0"),
              role: l.roleName,
            }))
            : [],
        };
      }),
    };

    if (isEdit && id) {
      try {
        const updateId = detailData?.approvalTransactionTypeId;
        if (!updateId) {
          toast.error("Approval transaction type ID not found");
          return;
        }
        const response = await updateMutation.mutateAsync({
          id: updateId,
          payload,
        });
        toast.success(response?.message || "Approval workflow updated successfully");
        navigate(APPROVAL_WORKFLOW_URL);
      } catch (error) {
        const err = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        const errorMsg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to update approval workflow";
        toast.error(errorMsg);
      }
    } else {
      try {
        const response = await createMutation.mutateAsync(payload);
        toast.success(response?.message || "Approval workflow created successfully");
        navigate(APPROVAL_WORKFLOW_URL);
      } catch (error) {
        const err = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        const errorMsg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to create approval workflow";
        toast.error(errorMsg);
      }
    }
  };

  const handleCancel = () => {
    navigate(APPROVAL_WORKFLOW_URL);
  };

  const handleTransactionTypeChange = () => {
    if (isEdit) return;
    loadedTemplateFor.current = null;
    setLevels([]);
  };

  const handleEditLevel = (level: ApprovalLevelItem) => {
    setEditingLevel(level);
    setIsModalOpen(true);
  };

  const handleDeleteLevel = (levelId: string) => {
    setLevels((prev) =>
      prev
        .filter((item) => item.id !== levelId)
        .map((item, idx) => ({ ...item, order: idx + 1 })),
    );
    toast.info("Approval level removed");
  };

  const handleSaveLevel = (level: ApprovalLevelItem) => {
    setLevels((prev) =>
      prev.map((item) => (item.id === level.id ? level : item)),
    );
    toast.success("Approval level updated");
  };

  if (isEdit && isLoadingDetail) {
    return (
      <Page
        type="base"
        title={pageTitle}
        permission={permission}
        breadcrumbs={[
          {
            title: "Master Data",
            url: "#",
          },
          {
            title: APPROVAL_WORKFLOW_LIST_PAGE_TITLE,
            url: APPROVAL_WORKFLOW_URL,
          },
          {
            title: pageTitle,
            url: pageUrl,
          },
        ]}
      >
        <PageHeader title={pageTitle} withBackButton={false} />
        <Separator className="mb-8" />
        <div className="flex justify-center items-center h-64">
          <ProgressLoader />
        </div>
      </Page>
    );
  }

  return (
    <Page
      type="base"
      title={pageTitle}
      permission={permission}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: APPROVAL_WORKFLOW_LIST_PAGE_TITLE,
          url: APPROVAL_WORKFLOW_URL,
        },
        {
          title: pageTitle,
          url: pageUrl,
        },
      ]}
    >
      <PageHeader
        title={pageTitle}
        withBackButton={false}
      />

      <Separator className="mb-8" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Form Fields: Transaction Type, Name, Description */}
        <ApprovalWorkflowInfoForm
          control={control}
          onTransactionTypeChange={handleTransactionTypeChange}
        />

        {/* Section Divider */}
        <Separator />

        {/* Section: Approval Levels Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Approval levels
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Approvals run from top to bottom. Drag to reorder. Edit each level to select its approver role.
            </p>
          </div>

        </div>

        {!isEdit && transactionType && isLoadingStageTemplate && (
          <p className="text-sm text-muted-foreground">Loading default approval levels...</p>
        )}
        {!isEdit && transactionType && hasStageTemplateError && (
          <p className="text-sm text-destructive">
            Could not load default approval levels. Please try selecting the transaction type again.
          </p>
        )}
        {!isEdit && transactionType && !isLoadingStageTemplate && !hasStageTemplateError && levels.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No default approval levels are configured for this transaction type.
          </p>
        )}

        {/* Approval Levels List */}
        <ApprovalLevelList
          levels={levels}
          onEdit={handleEditLevel}
          onDelete={handleDeleteLevel}
          onReorder={setLevels}
        />

        {/* Section Divider */}
        <Separator />

        {/* Action Buttons: Cancel and Save */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            className="px-5 h-9"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending || !isFormComplete}
            className="bg-[#1b2559] hover:bg-[#1b2559]/90 text-white px-5 h-9"
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>

      {/* Modal Edit Level */}
      <ApprovalLevelModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        editingLevel={editingLevel}
        onSave={handleSaveLevel}
        totalLevels={levels.length}
      />
    </Page>
  );
}

export function AddApprovalWorkflowPage() {
  const { id } = useParams<{ id?: string }>();
  return <ApprovalWorkflowFormInner key={id ?? "new"} id={id} />;
}

export default AddApprovalWorkflowPage;
