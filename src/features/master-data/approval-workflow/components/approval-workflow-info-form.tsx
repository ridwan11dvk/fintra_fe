import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  useGetModuleByName,
  useGetTransactionTypeOptions,
} from "@railfinance/core";
import {
  type Control,
  Controller,
} from "react-hook-form";
import type { ApprovalWorkflowFormData } from "../data";

interface ApprovalWorkflowInfoFormProps {
  control: Control<ApprovalWorkflowFormData>;
  onTransactionTypeChange: () => void;
}

export function ApprovalWorkflowInfoForm({
  control,
  onTransactionTypeChange,
}: Readonly<ApprovalWorkflowInfoFormProps>) {
  const { data: moduleData } = useGetModuleByName("Payable");
  const { data: transactionTypeOptions } = useGetTransactionTypeOptions(
    moduleData?.data?.id,
  );
  const transactionOptions = transactionTypeOptions?.data ?? [];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Field 1: Transaction Type */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
        <span className="w-48 text-sm font-medium text-foreground shrink-0 pt-2">
          <span>Transaction type</span> <span className="text-destructive">*</span>
        </span>
        <div className="flex-1 max-w-xl">
          <Controller
            name="transactionType"
            control={control}
            render={({ field }) => {
              const selectedOption = transactionOptions.find(
                (t) => String(t.value) === String(field.value),
              );

              return (
                <Select
                  key={`${field.value}-${transactionOptions.length}`}
                  value={field.value ? String(field.value) : undefined}
                  onValueChange={(value) => {
                    onTransactionTypeChange();
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger className="w-full h-10 bg-background">
                    <SelectValue placeholder="Select">
                      {selectedOption?.label}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {transactionOptions.map((t) => (
                      <SelectItem key={String(t.value)} value={String(t.value)}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
        </div>
      </div>

      {/* Field 2: Workflow Name */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
        <span className="w-48 text-sm font-medium text-foreground shrink-0 pt-2">
          <span>Workflow name</span> <span className="text-destructive">*</span>
        </span>
        <div className="flex-1 max-w-xl">
          <Controller
            name="workflowName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder="Enter Workflow name"
                className="w-full h-10 bg-background"
              />
            )}
          />
        </div>
      </div>

      {/* Field 3: Description */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
        <span className="w-48 text-sm font-medium text-foreground shrink-0 pt-2">
          Description
        </span>
        <div className="flex-1 max-w-xl">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                value={field.value ?? ""}
                placeholder="Enter Description"
                className="w-full min-h-[140px] resize-none bg-background"
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default ApprovalWorkflowInfoForm;
