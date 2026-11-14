import { Button } from "@railfinance/core";
import { DataTable } from "@railfinance/core/components/data-table";
import type { JobPositionResponse } from "@railfinance/core/masterdata";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

function createJobPositionSelectionColumns(): ColumnDef<JobPositionResponse>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "code",
      header: "Position Code",
    },
    {
      accessorKey: "name",
      header: "Position",
    },
    {
      accessorKey: "jobName",
      header: "Description",
    },
  ];
}

interface ChooseJobPositionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobPositions: JobPositionResponse[];
  onChoose: (jobPositions: JobPositionResponse[]) => void;
}

export function ChooseJobPositionsDialog({
  open,
  onOpenChange,
  jobPositions,
  onChoose,
}: Readonly<ChooseJobPositionsDialogProps>) {
  const [selectedPositions, setSelectedPositions] =
    useState<JobPositionResponse[]>(jobPositions);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setSelectedPositions(jobPositions);
    }
  }

  const handleChoose = (positions: JobPositionResponse[]) => {
    onChoose(positions);
    onOpenChange(false);
  };

  const jobPositionColumns = createJobPositionSelectionColumns();

  return (
    <DataTable
      title="Choose Job Positions"
      description={
        selectedPositions?.length > 0
          ? `${selectedPositions.length} position(s) selected`
          : "Choose one or multiple job positions"
      }
      open={open}
      onOpenChange={onOpenChange}
      footer={
        <div className="flex justify-end">
          <Button onClick={() => handleChoose(selectedPositions)}>
            Choose
          </Button>
        </div>
      }
      columns={jobPositionColumns as ColumnDef<unknown>[]}
      selectedItems={selectedPositions}
      onItemSelect={(items: unknown[]) =>
        setSelectedPositions(items as JobPositionResponse[])
      }
      queryKey={["jobPosition"]}
      queryFn={(params) =>
        import("@railfinance/core").then((mod) =>
          mod.jobPositionService.paginateActiveJobPositions(params),
        )
      }
      search={{
        key: "search",
        placeholder: "Search by position code or name",
      }}
      pageSize={20}
    />
  );
}
