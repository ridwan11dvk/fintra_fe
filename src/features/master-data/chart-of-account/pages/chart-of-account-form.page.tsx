import {
  Button,
  Input,
  Label,
  Page,
  PageHeader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Textarea,
  toast,
} from "@railfinance/core";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { UnsavedChangesModal } from "@/features/master-data/shared/unsaved-changes-modal";
import {
  chartOfAccountQueryKeys,
  useCreateChartOfAccountMutation,
  useGetChartOfAccountById,
  useUpdateChartOfAccountMutation,
  type ChartOfAccountFormData,
} from "../data";
import {
  CHART_OF_ACCOUNT_CREATE_PAGE_TITLE,
  CHART_OF_ACCOUNT_CREATE_PERMISSION,
  CHART_OF_ACCOUNT_CREATE_URL,
  CHART_OF_ACCOUNT_EDIT_PAGE_TITLE,
  CHART_OF_ACCOUNT_LIST_PAGE_TITLE,
  CHART_OF_ACCOUNT_UPDATE_PERMISSION,
  CHART_OF_ACCOUNT_URL,
  getChartOfAccountEditUrl,
} from "../data/chart-of-account.utils";

export function ChartOfAccountFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const title = isEdit
    ? CHART_OF_ACCOUNT_EDIT_PAGE_TITLE
    : CHART_OF_ACCOUNT_CREATE_PAGE_TITLE;

  const permission = isEdit
    ? CHART_OF_ACCOUNT_UPDATE_PERMISSION
    : CHART_OF_ACCOUNT_CREATE_PERMISSION;

  const currentUrl =
    isEdit && id ? getChartOfAccountEditUrl(id) : CHART_OF_ACCOUNT_CREATE_URL;

  const { data: detailData, isLoading: isLoadingDetail } =
    useGetChartOfAccountById(id || "", {
      enabled: isEdit,
    });

  const coa = detailData?.data;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<ChartOfAccountFormData>({
    values:
      isEdit && coa
        ? {
          name: coa.name || "",
          code: coa.code || "",
          level:
            coa.level == null
              ? (undefined as unknown as number)
              : Number(coa.level),
          description: coa.description || "",
        }
        : undefined,
    defaultValues: {
      name: "",
      code: "",
      level: undefined as unknown as number,
      description: "",
    },
  });

  const createMutation = useCreateChartOfAccountMutation();
  const updateMutation = useUpdateChartOfAccountMutation();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Track field values for save button active/disabled state
  const watchedName = useWatch({ control, name: "name" });
  const watchedCode = useWatch({ control, name: "code" });
  const watchedLevel = useWatch({ control, name: "level" });
  const isFormValid =
    Boolean(watchedName?.trim()) &&
    Boolean(watchedCode?.trim()) &&
    Boolean(watchedLevel);

  const onSubmit = async (values: ChartOfAccountFormData) => {
    const payload = {
      name: values.name.trim(),
      code: values.code.trim(),
      level: Number(values.level),
      description: values.description?.trim() || "",
      active: isEdit && coa?.active !== undefined ? coa.active : true,
    };

    try {
      if (isEdit && id) {
        const res = await updateMutation.mutateAsync({ id, data: payload });
        queryClient.invalidateQueries({
          queryKey: chartOfAccountQueryKeys.all,
        });
        toast.success(
          res?.message || "Chart of Account updated successfully",
        );
        navigate(CHART_OF_ACCOUNT_URL);
      } else {
        const res = await createMutation.mutateAsync(payload);
        queryClient.invalidateQueries({
          queryKey: chartOfAccountQueryKeys.all,
        });
        toast.success(
          res?.message || "Chart of Account added successfully",
        );
        navigate(CHART_OF_ACCOUNT_URL);
      }
    } catch (error: unknown) {
      const err = error as {
        message?: string;
        response?: { data?: { message?: string } };
      };
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        (isEdit
          ? "Failed to update Chart of Account"
          : "Failed to create Chart of Account"),
      );
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowUnsavedDialog(true);
    } else {
      navigate(CHART_OF_ACCOUNT_URL);
    }
  };

  return (
    <Page
      type="base"
      title={title}
      permission={permission}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: CHART_OF_ACCOUNT_LIST_PAGE_TITLE,
          url: CHART_OF_ACCOUNT_URL,
        },
        {
          title,
          url: currentUrl,
        },
      ]}
    >
      <div className="space-y-6 w-full">
        <PageHeader title={title} withBackButton={false} />
        <Separator className="w-full" />

        {isEdit && isLoadingDetail ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            Loading chart of account data...
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full">
            <div className="space-y-6 w-full">
              {/* Row 1: Chart of Account Name */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label
                  htmlFor="name"
                  className="w-72 shrink-0 text-sm font-medium text-foreground"
                >
                  Chart of Account Name <span className="text-red-500">*</span>
                </Label>
                <div className="w-full sm:w-[460px]">
                  <Input
                    id="name"
                    placeholder="Enter chart of account name"
                    {...register("name", {
                      required: "Chart of Account name is required",
                    })}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Chart of Account Code */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label
                  htmlFor="code"
                  className="w-72 shrink-0 text-sm font-medium text-foreground"
                >
                  Chart of Account Code <span className="text-red-500">*</span>
                </Label>
                <div className="w-full sm:w-[460px]">
                  <Input
                    id="code"
                    placeholder="Enter account code (e.g. 1110)"
                    {...register("code", {
                      required: "Chart of Account code is required",
                    })}
                    disabled={isSubmitting}
                  />
                  {errors.code && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.code.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 3: Level */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label
                  htmlFor="level"
                  className="w-72 shrink-0 text-sm font-medium text-foreground"
                >
                  Level <span className="text-red-500">*</span>
                </Label>
                <div className="w-full sm:w-[460px]">
                  <Controller
                    control={control}
                    name="level"
                    rules={{ required: "Level is required" }}
                    render={({ field }) => {
                      const selectedValue =
                        field.value !== undefined &&
                          field.value !== null &&
                          !Number.isNaN(Number(field.value)) &&
                          Number(field.value) > 0
                          ? String(field.value)
                          : "";
                      return (
                        <Select
                          key={`select-level-${selectedValue || "none"}`}
                          value={selectedValue}
                          onValueChange={(val) =>
                            field.onChange(val ? Number(val) : undefined)
                          }
                          disabled={isSubmitting}
                        >
                          <SelectTrigger id="level" className="w-full">
                            <SelectValue placeholder="Choose" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                              <SelectItem key={lvl} value={String(lvl)}>
                                {lvl}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                  {errors.level && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.level.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 4: Description */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <Label
                  htmlFor="description"
                  className="w-72 shrink-0 text-sm font-medium text-foreground sm:pt-2.5"
                >
                  Description
                </Label>
                <div className="w-full sm:w-[460px]">
                  <Textarea
                    id="description"
                    placeholder="Enter account description"
                    rows={5}
                    {...register("description")}
                    disabled={isSubmitting}
                    className="resize-none"
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Separator & Actions stretching full width */}
            <div className="pt-6 border-t border-border flex items-center justify-end gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                className="h-10 px-6 rounded-lg font-medium"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="h-10 px-6 rounded-lg bg-[#1b2559] hover:bg-[#1b2559]/90 text-white font-medium disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        )}
      </div>

      <UnsavedChangesModal
        open={showUnsavedDialog}
        onOpenChange={setShowUnsavedDialog}
        onDiscard={() => navigate(CHART_OF_ACCOUNT_URL)}
        onSave={() => {
          setShowUnsavedDialog(false);
          void handleSubmit(onSubmit)();
        }}
        saveDisabled={!isFormValid || isSubmitting}
        compact
      />
    </Page>
  );
}

export default ChartOfAccountFormPage;
