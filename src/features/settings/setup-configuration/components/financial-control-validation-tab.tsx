import {
  Button,
  Input,
  Label,
  ProgressLoader,
  Separator,
  toast,
} from "@railfinance/core";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { FinancialControlValidationItem } from "../data";
import {
  setupConfigurationQueryKeys,
  useGetFinancialControlValidationItems,
  useSaveFinancialControlValidationMutation,
} from "../data";

interface FinancialControlValidationContentProps {
  initialItems: FinancialControlValidationItem[];
}

function FinancialControlValidationContent({
  initialItems,
}: Readonly<FinancialControlValidationContentProps>) {
  const queryClient = useQueryClient();
  const [items, setItems] =
    useState<FinancialControlValidationItem[]>(initialItems);

  const saveMutation = useSaveFinancialControlValidationMutation({
    onSuccess: (res) => {
      queryClient.setQueryData(
        setupConfigurationQueryKeys.financialControlValidation(),
        res,
      );
      toast.success("Financial Control Validation saved successfully");
    },
    onError: () => {
      toast.error("Failed to save Financial Control Validation");
    },
  });

  const handleAddItem = () => {
    const newItem: FinancialControlValidationItem = {
      id: `fcv-${Date.now()}`,
      title: "",
      subTitle: "",
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (
    id: string,
    field: "title" | "subTitle",
    value: string,
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleSave = () => {
    saveMutation.mutate({ items });
  };

  const handleCancel = () => {
    setItems(initialItems);
    toast.info("Changes reverted");
  };

  return (
    <div className="space-y-6 pt-2">
      <div>
        <Label className="text-base font-semibold text-foreground">
          Financial Control Validation
        </Label>
      </div>

      {/* Cards list */}
      <div className="space-y-5">
        {items.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-sm border border-dashed rounded-lg max-w-4xl">
            No financial control validation items. Click below to add one.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-start gap-4 max-w-4xl">
              {/* Card content with transparent background matching page */}
              <div className="flex-1 rounded-xl border border-border/80 bg-transparent p-6 space-y-5">
                {/* Row 1: Title */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Label
                    htmlFor={`title-${item.id}`}
                    className="w-44 sm:w-48 shrink-0 text-sm font-medium text-foreground"
                  >
                    Title
                  </Label>
                  <div className="flex-1 w-full">
                    <Input
                      id={`title-${item.id}`}
                      value={item.title}
                      onChange={(e) =>
                        handleUpdateItem(item.id, "title", e.target.value)
                      }
                      placeholder="Enter title"
                      className="w-full bg-background"
                    />
                  </div>
                </div>

                {/* Row 2: Sub Title */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Label
                    htmlFor={`subTitle-${item.id}`}
                    className="w-44 sm:w-48 shrink-0 text-sm font-medium text-foreground"
                  >
                    Sub Title
                  </Label>
                  <div className="flex-1 w-full">
                    <Input
                      id={`subTitle-${item.id}`}
                      value={item.subTitle}
                      onChange={(e) =>
                        handleUpdateItem(item.id, "subTitle", e.target.value)
                      }
                      placeholder="Enter sub title"
                      className="w-full bg-background"
                    />
                  </div>
                </div>
              </div>

              {/* Delete button OUTSIDE the card on the right */}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-10 w-10 shrink-0 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-2xs mt-2"
                onClick={() => handleDeleteItem(item.id)}
                title="Delete item"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Separator passing cleanly into Add Button without background cutout */}
      <div className="flex items-center my-8 w-full">
        <Separator className="flex-1" />
        <Button
          type="button"
          variant="outline"
          className="border-primary text-primary hover:bg-primary/5 rounded-lg px-6 py-2.5 h-10 font-medium flex items-center gap-2 shrink-0 bg-background"
          onClick={handleAddItem}
        >
          <Plus className="h-4 w-4" />
          Add Financial Control Validation
        </Button>
        <Separator className="flex-1" />
      </div>

      {/* Separator below Add Button */}
      <Separator className="w-full my-6" />

      {/* Bottom Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="min-w-24 rounded-lg font-medium"
          onClick={handleCancel}
          disabled={saveMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="min-w-24 rounded-lg bg-[#1b2559] hover:bg-[#1b2559]/90 text-white font-medium"
          onClick={handleSave}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}

export function FinancialControlValidationTab() {
  const { data, isLoading } = useGetFinancialControlValidationItems();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <ProgressLoader />
      </div>
    );
  }

  return <FinancialControlValidationContent initialItems={data?.data ?? []} />;
}

export default FinancialControlValidationTab;
