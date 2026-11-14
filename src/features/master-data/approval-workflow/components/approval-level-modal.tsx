import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Modal,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  toast,
  useGetRoleOptions,
} from "@railfinance/core";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  formatNumberWithCommas,
  getApprovalRoleSchema,
  useStageCategoryOptions,
  useStageProcessOptions,
  validateBasicFields,
  validateLimits,
  type ApprovalLevelItem,
  type ApprovalLimitRow,
} from "../data";

interface ApprovalLevelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingLevel?: ApprovalLevelItem | null;
  onSave: (level: ApprovalLevelItem) => void;
  totalLevels: number;
}

function ApprovalLevelModalInner({
  open,
  onOpenChange,
  editingLevel,
  onSave,
  totalLevels,
}: Readonly<ApprovalLevelModalProps>) {
  const [category, setCategory] = useState(
    editingLevel?.layer || "",
  );
  const [name, setName] = useState(
    editingLevel?.title || "",
  );
  const [outputStep, setOutputStep] = useState(
    editingLevel?.outputStep || "",
  );
  const [roleSetting, setRoleSetting] = useState<"manually" | "limit-based">(
    editingLevel?.roleSetting || "manually",
  );
  const [roleName, setRoleName] = useState(
    editingLevel?.roleName || "",
  );
  const [limits, setLimits] = useState<ApprovalLimitRow[]>(
    editingLevel?.limits && editingLevel.limits.length > 0
      ? editingLevel.limits.map((l) => ({
        ...l,
        minAmount: formatNumberWithCommas(l.minAmount),
        maxAmount: formatNumberWithCommas(l.maxAmount),
      }))
      : [
        {
          id: crypto.randomUUID(),
          minAmount: "0",
          maxAmount: "5,000,000,000",
          roleName: "",
        },
      ],
  );

  const { data: catOptionsRes } = useStageCategoryOptions();
  const categoryOptions = catOptionsRes?.data ?? [];

  const { data: procOptionsRes, isLoading: isLoadingProcess } =
    useStageProcessOptions(category);
  const processOptions = procOptionsRes?.data ?? [];

  const { data: roleOptionsRes, refetch: refetchRoles } = useGetRoleOptions();
  const roleOptions = roleOptionsRes?.data ?? [];

  useEffect(() => {
    refetchRoles?.();
  }, [refetchRoles]);

  const roleNameItems = roleOptions.map((r) => ({
    key: String(r.value),
    label: r.label,
  }));

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setName("");
  };

  const handleAddLimit = () => {
    setLimits((prev) => {
      const lastLimit = prev[prev.length - 1];
      let nextMin = "0";
      if (lastLimit?.maxAmount) {
        const digits = String(lastLimit.maxAmount).replace(/\D/g, "");
        if (digits) {
          const maxVal = BigInt(digits);
          nextMin = formatNumberWithCommas((maxVal + 1n).toString());
        }
      }
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          minAmount: nextMin,
          maxAmount: "",
          roleName: "",
        },
      ];
    });
  };

  const handleDeleteLimit = (limitId: string) => {
    setLimits((prev) => prev.filter((l) => l.id !== limitId));
  };

  const handleLimitChange = (
    limitId: string,
    field: "minAmount" | "maxAmount" | "roleName",
    value: string,
  ) => {
    setLimits((prev) =>
      prev.map((l) =>
        l.id === limitId
          ? {
            ...l,
            [field]:
              field === "roleName"
                ? value
                : formatNumberWithCommas(value),
          }
          : l,
      ),
    );
  };

  const handleSubmit = () => {
    const basicError = validateBasicFields(
      category,
      name,
      outputStep,
      roleSetting,
      roleName,
    );
    if (basicError) {
      toast.error(basicError);
      return;
    }

    const validRoleLabels = roleNameItems.map((r) => r.label);
    if (roleSetting === "manually" && !getApprovalRoleSchema(validRoleLabels).safeParse(roleName).success) {
      toast.error("Please select an active Role Name");
      return;
    }
    if (validRoleLabels.length === 0) {
      toast.error("Role options are unavailable. Please try again.");
      return;
    }
    if (roleSetting === "limit-based") {
      const limitsError = validateLimits(limits, validRoleLabels);
      if (limitsError) {
        toast.error(limitsError);
        return;
      }
    }

    const selectedCat = categoryOptions.find((c) => c.value === category);
    const selectedProc = processOptions.find((p) => p.value === name);

    const item: ApprovalLevelItem = {
      id: editingLevel ? editingLevel.id : crypto.randomUUID(),
      order: editingLevel ? editingLevel.order : totalLevels + 1,
      layer: category,
      categoryName: selectedCat?.label || editingLevel?.categoryName || category,
      title: name,
      processName: selectedProc?.label || editingLevel?.processName || name,
      description: outputStep,
      outputStep,
      roleSetting,
      roleName: roleSetting === "manually" ? roleName : undefined,
      limits: roleSetting === "limit-based" ? limits : undefined,
    };
    onSave(item);
    onOpenChange(false);
  };

  let processPlaceholder = "Select Name";
  if (!category) {
    processPlaceholder = "Select Category first";
  } else if (isLoadingProcess) {
    processPlaceholder = "Loading...";
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={editingLevel ? "Edit Approval Level" : "Add Approval Level"}
      description="Configuration of step, layer, role, and output"
      size="lg"
      className="sm:max-w-2xl"
      footer={
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="px-5 h-9"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-[#1b2559] hover:bg-[#1b2559]/90 text-white px-5 h-9"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      }
    >
      <div className="space-y-5 py-2">
        {/* Field 1: Stage Process Category */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <span className="w-44 text-sm font-medium text-foreground shrink-0">
            <span>Stage Process Category</span> <span className="text-destructive">*</span>
          </span>
          <div className="flex-1">
            <Select value={category} onValueChange={handleCategoryChange} disabled>
              <SelectTrigger className="w-full h-10 bg-background">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Field 2: Stage Process Name */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <span className="w-44 text-sm font-medium text-foreground shrink-0">
            <span>Stage Process Name</span> <span className="text-destructive">*</span>
          </span>
          <div className="flex-1">
            <Select
              value={name}
              onValueChange={setName}
              disabled
            >
              <SelectTrigger className="w-full h-10 bg-background">
                <SelectValue placeholder={processPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {processOptions.map((proc) => (
                  <SelectItem key={proc.value} value={proc.value}>
                    {proc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Field 3: Output Step */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <span className="w-44 text-sm font-medium text-foreground shrink-0">
            <span>Output Step</span> <span className="text-destructive">*</span>
          </span>
          <div className="flex-1">
            <Input
              value={outputStep}
              onChange={(e) => setOutputStep(e.target.value)}
              placeholder="Approval of submitted data"
              className="w-full h-10 bg-background"
            />
          </div>
        </div>

        {/* Field 4: Role Setting */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <span className="w-44 text-sm font-medium text-foreground shrink-0">
            <span>Role Setting</span> <span className="text-destructive">*</span>
          </span>
          <div className="flex-1">
            <RadioGroup
              value={roleSetting}
              onValueChange={(val) =>
                setRoleSetting(val as "manually" | "limit-based")
              }
              className="flex items-center gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manually" id="manually" />
                <Label
                  htmlFor="manually"
                  className="text-sm font-normal text-foreground cursor-pointer"
                >
                  Select Manually
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="limit-based" id="limit-based" />
                <Label
                  htmlFor="limit-based"
                  className="text-sm font-normal text-foreground cursor-pointer"
                >
                  Limit Based
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Mode A: Select Manually */}
        {roleSetting === "manually" && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <span className="w-44 text-sm font-medium text-foreground shrink-0">
              <span>Role Name</span> <span className="text-destructive">*</span>
            </span>
            <div className="flex-1">
              <Select value={roleName} onValueChange={setRoleName}>
                <SelectTrigger className="w-full h-10 bg-background">
                  <SelectValue
                    placeholder={
                      "Select Role"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {roleNameItems.map((r) => (
                    <SelectItem key={r.key} value={r.label}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Mode B: Limit Based */}
        {roleSetting === "limit-based" && (
          <div className="space-y-4 pt-1">
            <Separator />

            {/* List of Limit Cards with external Delete Buttons */}
            <div className="space-y-3">
              {limits.map((limit) => (
                <div key={limit.id} className="flex items-center gap-3">
                  <div className="flex-1 rounded-xl border border-border/80 bg-card p-4 space-y-3 shadow-2xs">
                    {/* Limit Amount */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <span className="w-32 text-sm font-medium text-foreground shrink-0">
                        <span>Limit Amount</span> <span className="text-destructive">*</span>
                      </span>
                      <div className="flex items-center gap-3 flex-1">
                        <InputGroup className="h-10 bg-background flex-1">
                          <InputGroupAddon
                            align="inline-start"
                            className="text-muted-foreground text-sm font-medium pl-3"
                          >
                            Rp
                          </InputGroupAddon>
                          <Input
                            value={limit.minAmount}
                            onChange={(e) =>
                              handleLimitChange(
                                limit.id,
                                "minAmount",
                                e.target.value,
                              )
                            }
                            placeholder="0"
                            className="border-0 shadow-none focus-visible:ring-0 pl-1"
                          />
                        </InputGroup>

                        <span className="text-muted-foreground text-sm">-</span>

                        <InputGroup className="h-10 bg-background flex-1">
                          <InputGroupAddon
                            align="inline-start"
                            className="text-muted-foreground text-sm font-medium pl-3"
                          >
                            Rp
                          </InputGroupAddon>
                          <Input
                            value={limit.maxAmount}
                            onChange={(e) =>
                              handleLimitChange(
                                limit.id,
                                "maxAmount",
                                e.target.value,
                              )
                            }
                            placeholder="0"
                            className="border-0 shadow-none focus-visible:ring-0 pl-1"
                          />
                        </InputGroup>
                      </div>
                    </div>

                    {/* Role Name */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <span className="w-32 text-sm font-medium text-foreground shrink-0">
                        <span>Role Name</span> <span className="text-destructive">*</span>
                      </span>
                      <div className="flex-1">
                        <Select
                          value={limit.roleName}
                          onValueChange={(val) =>
                            handleLimitChange(limit.id, "roleName", val)
                          }
                        >
                          <SelectTrigger className="w-full h-10 bg-background">
                            <SelectValue
                              placeholder={
                                "Select Role"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {roleNameItems.map((r) => (
                              <SelectItem key={r.key} value={r.label}>
                                {r.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Delete button beside the card */}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="size-9 rounded-lg bg-[#d92d20] hover:bg-[#d92d20]/90 text-white shrink-0"
                    onClick={() => handleDeleteLimit(limit.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add Limit Button with inline Separators */}
            <div className="flex items-center gap-4 py-2">
              <Separator className="flex-1" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 h-9 px-4 border-[#1b2559] text-[#1b2559] hover:bg-primary/5 rounded-md shrink-0"
                onClick={handleAddLimit}
              >
                <Plus className="size-4" />
                <span>Add Limit</span>
              </Button>
              <Separator className="flex-1" />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export function ApprovalLevelModal({
  open,
  onOpenChange,
  editingLevel,
  onSave,
  totalLevels,
}: Readonly<ApprovalLevelModalProps>) {
  if (!open) return null;

  return (
    <ApprovalLevelModalInner
      key={editingLevel ? editingLevel.id : "new-level"}
      open={open}
      onOpenChange={onOpenChange}
      editingLevel={editingLevel}
      onSave={onSave}
      totalLevels={totalLevels}
    />
  );
}

export default ApprovalLevelModal;
