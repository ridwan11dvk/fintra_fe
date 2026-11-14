import { ColumnHeader } from "@railfinance/core";
import { ActionButton } from "@railfinance/core/components/actions";
import type { ColumnDef } from "@tanstack/react-table";
import type {
  ChartOfAccountActionHandlers,
  ChartOfAccountResponse,
} from "../data/chart-of-account.types";
import {
  CHART_OF_ACCOUNT_READ_PERMISSION,
  CHART_OF_ACCOUNT_UPDATE_PERMISSION,
} from "../data/chart-of-account.utils";

export const chartOfAccountColumns = (
  handlers?: ChartOfAccountActionHandlers,
): ColumnDef<ChartOfAccountResponse>[] => [
    {
      accessorKey: "code",
      meta: { title: "Code" },
      header: ({ column }) => <ColumnHeader column={column} title="Code" />,
      cell: ({ row }) => (
        <div
          className="max-w-xs truncate font-semibold text-slate-800"
          title={row.original.code}
        >
          {row.original.code}
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "name",
      meta: { title: "Chart of Account" },
      header: ({ column }) => (
        <ColumnHeader column={column} title="Chart of Account" />
      ),
      cell: ({ row }) => (
        <div
          className="max-w-md truncate font-semibold text-slate-800"
          title={row.original.name}
        >
          {row.original.name}
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "level",
      meta: { title: "Level" },
      header: ({ column }) => <ColumnHeader column={column} title="Level" />,
      cell: ({ row }) => (
        <div className="text-slate-700">{row.original.level}</div>
      ),
      enableSorting: false,
    },
    {
      id: "actions",
      meta: { title: "Actions" },
      header: () => <div className="text-center font-medium">Actions</div>,
      cell: ({ row }) => {
        const isActive = row.original.active;

        return (
          <div className="flex items-center justify-center gap-1">
            <ActionButton
              variant="show"
              size="sm"
              onClick={() => handlers?.onView?.(row.original)}
              permission={CHART_OF_ACCOUNT_READ_PERMISSION}
            />
            <ActionButton
              variant={isActive ? "deactivate" : "activate"}
              size="sm"
              onClick={() => {
                if (isActive) {
                  handlers?.onDeactivate?.(row.original);
                } else {
                  handlers?.onActivate?.(row.original);
                }
              }}
              permission={CHART_OF_ACCOUNT_UPDATE_PERMISSION}
            />
            <ActionButton
              variant="edit"
              size="sm"
              onClick={() => handlers?.onEdit?.(row.original)}
              permission={CHART_OF_ACCOUNT_UPDATE_PERMISSION}
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];
