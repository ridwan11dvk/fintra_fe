import {
  Button,
  ColumnHeader,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Visibility,
} from "@railfinance/core";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, ToggleLeft, ToggleRight } from "lucide-react";
import type {
  BusinessUnitActionHandlers,
  BusinessUnitResponse,
} from "../data/business-unit.types";
import {
  BUSINESS_UNIT_READ_PERMISSION,
  BUSINESS_UNIT_UPDATE_PERMISSION,
} from "../data/business-unit.utils";

export const businessUnitColumns = (
  handlers?: BusinessUnitActionHandlers,
): ColumnDef<BusinessUnitResponse>[] => [
  {
    accessorKey: "code",
    meta: { title: "Business Unit ID" },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Business Unit ID" />
    ),
    cell: ({ row }) => (
      <div className="font-semibold text-slate-800">{row.original.code}</div>
    ),
  },
  {
    accessorKey: "name",
    meta: { title: "Business Unit Name" },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Business Unit Name" />
    ),
    cell: ({ row }) => (
      <div className="font-semibold text-slate-800">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "parentBusinessUnit",
    meta: { title: "Parent Business Unit" },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Parent Business Unit" />
    ),
    cell: ({ row }) => (
      <div className="text-slate-700">
        {row.original.parentBusinessUnit || "—"}
      </div>
    ),
  },
  {
    accessorKey: "businessUnitType",
    meta: { title: "Business Unit Type" },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Business Unit Type" />
    ),
    cell: ({ row }) => (
      <div className="text-slate-700">
        {row.original.businessUnitType || "—"}
      </div>
    ),
  },
  {
    id: "actions",
    meta: { title: "Actions" },
    header: () => <div className="text-left font-medium">Actions</div>,
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-1">
          {/* View Action */}
          <Visibility permission={BUSINESS_UNIT_READ_PERMISSION}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-slate-700"
                  onClick={() => handlers?.onView?.(item)}
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Detail</TooltipContent>
            </Tooltip>
          </Visibility>

          {/* Toggle Link Action (Red when unlinked, Blue when linked) with Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => (handlers?.onToggle ?? handlers?.onLink)?.(item)}
              >
                {item.isLinked ? (
                  <ToggleRight className="size-5 text-blue-600 hover:text-blue-700 transition-colors" />
                ) : (
                  <ToggleLeft className="size-5 text-red-500 hover:text-red-600 transition-colors" />
                )}
                <span className="sr-only">
                  {item.isLinked ? "Deactivate" : "Activate"}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {item.isLinked ? "Deactivate" : "Activate"}
            </TooltipContent>
          </Tooltip>

          {/* Edit Action */}
          <Visibility permission={BUSINESS_UNIT_UPDATE_PERMISSION}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-slate-700"
                  onClick={() => handlers?.onEdit?.(item)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
          </Visibility>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
