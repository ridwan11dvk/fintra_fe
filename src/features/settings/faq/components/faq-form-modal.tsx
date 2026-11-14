import {
  FAQ_TARGET_TYPE_CODE,
  faqSchema,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  type FaqFormData,
  type FaqResponse,
} from "@/features/settings/faq/data";
import { zodResolver } from "@hookform/resolvers/zod";
import type { OptionItem } from "@railfinance/core/types";
import { Button } from "@railfinance/core/ui/button";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { DialogFooter } from "@railfinance/core/ui/dialog";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { useGetLookupValueOptions } from "@railfinance/core/masterdata";
import { useForm } from "react-hook-form";

/** Form id referenced by the modal footer submit button. */
export const FAQ_FORM_ID = "faq-form";

interface FaqFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<FaqResponse>;
  onSuccess?: () => void;
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function FaqFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<FaqFormModalProps>) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add FAQ" : "Edit FAQ"}
      size="default"
      footer={
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form={FAQ_FORM_ID}>
            {mode === "create" ? "Create" : "Save"}
          </Button>
        </DialogFooter>
      }
    >
      {open && (
        <FaqFormModalContent
          key={`${mode}-${defaultValues?.id ?? "new"}`}
          onOpenChange={onOpenChange}
          mode={mode}
          defaultValues={defaultValues}
          onSuccess={onSuccess}
        />
      )}
    </Modal>
  );
}

function FaqFormModalContent({
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<{
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<FaqResponse>;
  onSuccess?: () => void;
}>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      target: defaultValues?.target || "",
      question: defaultValues?.question || "",
      questionEn: defaultValues?.questionEn || "",
      answer: defaultValues?.answer || "",
      answerEn: defaultValues?.answerEn || "",
      startDate: defaultValues?.startDate || todayIsoDate(),
      endDate: defaultValues?.endDate || "",
      sortOrder: defaultValues?.sortOrder ?? 0,
    },
  });

  const createMutation = useCreateFaqMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdateFaqMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const mutation = mode === "create" ? createMutation : updateMutation;
  const isLoading = mutation.isPending;

  const { data: targetsData, isLoading: isLoadingTargets } =
    useGetLookupValueOptions(FAQ_TARGET_TYPE_CODE);

  const targetOptions =
    targetsData?.data?.map((item: OptionItem) => ({
      value: item.alias ?? item.value,
      label: item.label,
    })) || [];

  const onSubmit = (data: FaqFormData) => {
    const payload = {
      target: data.target,
      question: data.question,
      questionEn: data.questionEn || undefined,
      answer: data.answer,
      answerEn: data.answerEn || undefined,
      startDate: data.startDate,
      endDate: data.endDate || undefined,
      sortOrder: data.sortOrder,
    };

    if (mode === "create") {
      createMutation.mutate(payload);
    } else if (defaultValues?.id) {
      updateMutation.mutate({ id: defaultValues.id, data: payload });
    }
  };

  const textareaClass = (hasError: boolean) =>
    cn(
      "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      hasError && "border-red-500 focus-visible:ring-red-500",
    );

  return (
    <form
      id={FAQ_FORM_ID}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      {/* Target */}
      <div className="space-y-2">
        <Label htmlFor="target" className="text-sm font-medium">
          Target <span className="text-red-500">*</span>
        </Label>
        <select
          id="target"
          disabled={isLoading || isLoadingTargets}
          className={cn(
            "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            errors.target && "border-red-500 focus-visible:ring-red-500",
          )}
          {...register("target")}
        >
          <option value="">
            {isLoadingTargets ? "Loading targets..." : "Select target"}
          </option>
          {targetOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500">
          App/section this FAQ belongs to, selected from the FAQ Target
          categories
        </p>
        {errors.target && (
          <p className="text-xs text-red-500">{errors.target.message}</p>
        )}
      </div>

      {/* Question ID */}
      <div className="space-y-2">
        <Label htmlFor="question" className="text-sm font-medium">
          Question (ID) <span className="text-red-500">*</span>
        </Label>
        <textarea
          id="question"
          maxLength={500}
          disabled={isLoading}
          className={cn("h-16", textareaClass(!!errors.question))}
          {...register("question")}
        />
        {errors.question && (
          <p className="text-xs text-red-500">{errors.question.message}</p>
        )}
      </div>

      {/* Question EN */}
      <div className="space-y-2">
        <Label htmlFor="questionEn" className="text-sm font-medium">
          Question (EN)
        </Label>
        <textarea
          id="questionEn"
          maxLength={500}
          disabled={isLoading}
          className={cn("h-16", textareaClass(!!errors.questionEn))}
          {...register("questionEn")}
        />
        <p className="text-xs text-gray-500">
          Falls back to Indonesian when empty
        </p>
        {errors.questionEn && (
          <p className="text-xs text-red-500">{errors.questionEn.message}</p>
        )}
      </div>

      {/* Answer ID */}
      <div className="space-y-2">
        <Label htmlFor="answer" className="text-sm font-medium">
          Answer (ID) <span className="text-red-500">*</span>
        </Label>
        <textarea
          id="answer"
          maxLength={4000}
          disabled={isLoading}
          className={cn("h-24", textareaClass(!!errors.answer))}
          {...register("answer")}
        />
        {errors.answer && (
          <p className="text-xs text-red-500">{errors.answer.message}</p>
        )}
      </div>

      {/* Answer EN */}
      <div className="space-y-2">
        <Label htmlFor="answerEn" className="text-sm font-medium">
          Answer (EN)
        </Label>
        <textarea
          id="answerEn"
          maxLength={4000}
          disabled={isLoading}
          className={cn("h-24", textareaClass(!!errors.answerEn))}
          {...register("answerEn")}
        />
        <p className="text-xs text-gray-500">
          Falls back to Indonesian when empty
        </p>
        {errors.answerEn && (
          <p className="text-xs text-red-500">{errors.answerEn.message}</p>
        )}
      </div>

      {/* Start Date */}
      <div className="space-y-2">
        <Label htmlFor="startDate" className="text-sm font-medium">
          Start Date <span className="text-red-500">*</span>
        </Label>
        <Input
          id="startDate"
          type="date"
          {...register("startDate")}
          className={cn(
            "h-10",
            errors.startDate && "border-red-500 focus-visible:ring-red-500",
          )}
          disabled={isLoading}
        />
        {errors.startDate && (
          <p className="text-xs text-red-500">{errors.startDate.message}</p>
        )}
      </div>

      {/* End Date */}
      <div className="space-y-2">
        <Label htmlFor="endDate" className="text-sm font-medium">
          End Date (Optional)
        </Label>
        <Input
          id="endDate"
          type="date"
          {...register("endDate")}
          className={cn(
            "h-10",
            errors.endDate && "border-red-500 focus-visible:ring-red-500",
          )}
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">
          Leave empty for the FAQ to be valid indefinitely
        </p>
        {errors.endDate && (
          <p className="text-xs text-red-500">{errors.endDate.message}</p>
        )}
      </div>

      {/* Sort Order */}
      <div className="space-y-2">
        <Label htmlFor="sortOrder" className="text-sm font-medium">
          Sort Order <span className="text-red-500">*</span>
        </Label>
        <Input
          id="sortOrder"
          type="number"
          min={0}
          step={1}
          {...register("sortOrder")}
          className={cn(
            "h-10",
            errors.sortOrder && "border-red-500 focus-visible:ring-red-500",
          )}
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">
          FAQs are displayed per target in ascending order
        </p>
        {errors.sortOrder && (
          <p className="text-xs text-red-500">{errors.sortOrder.message}</p>
        )}
      </div>
    </form>
  );
}

export default FaqFormModal;
