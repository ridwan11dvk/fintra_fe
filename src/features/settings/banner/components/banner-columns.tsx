"use client";

import type { BannerResponse } from "@/features/settings/banner/data/banner.types";
import {
  BANNER_DELETE_PERMISSION,
  BANNER_UPDATE_PERMISSION,
  getBannerValidityStatus,
} from "@/features/settings/banner/data/banner.utils";
import { ActionButton } from "@railfinance/core/components/actions";
import { StatusBadge } from "@railfinance/core/components/badges";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import { Image } from "@railfinance/core/components/image";
import type { ColumnDef } from "@tanstack/react-table";

const validityStatusMap = {
  active: "active",
  scheduled: "pending",
  expired: "archived",
} as const;

const validityLabelMap = {
  active: "Active",
  scheduled: "Scheduled",
  expired: "Expired",
} as const;

export const bannerColumns = (
  handlers: TableActionHandlers<BannerResponse>,
): ColumnDef<BannerResponse>[] => [
  {
    id: "number",
    meta: { title: "No." },
    header: () => <div className="font-medium">No.</div>,
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return <div>{pageIndex * pageSize + row.index + 1}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "image",
    meta: { title: "Image" },
    header: () => <div className="font-medium">Image</div>,
    cell: ({ row }) => {
      const banner = row.original;
      if (banner.imageUrl) {
        return (
          <Image
            src={banner.imageUrl}
            alt={banner.title}
            className="h-10 w-16 rounded-md object-cover"
          />
        );
      }
      return (
        <div className="flex h-10 w-16 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
          Text
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    meta: { title: "Title (ID)" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div
        className="max-w-[240px] truncate font-medium"
        title={row.original.titleEn ?? undefined}
      >
        {row.getValue(column.id)}
      </div>
    ),
  },
  {
    accessorKey: "target",
    meta: { title: "Target" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-mono text-sm">{row.getValue(column.id)}</div>
    ),
  },
  {
    id: "validity",
    meta: { title: "Validity" },
    header: () => <div className="font-medium">Validity</div>,
    cell: ({ row }) => {
      const { startDate, endDate } = row.original;
      return (
        <div className="text-sm">
          {startDate || "-"}
          {" → "}
          {endDate || "No end date"}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: "status",
    meta: { title: "Status" },
    header: () => <div className="font-medium">Status</div>,
    cell: ({ row }) => {
      const status = getBannerValidityStatus(
        row.original.startDate,
        row.original.endDate,
      );
      return (
        <StatusBadge
          status={validityStatusMap[status]}
          label={validityLabelMap[status]}
        />
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "sortOrder",
    meta: { title: "Sort Order" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => <div>{row.getValue(column.id)}</div>,
  },
  {
    accessorKey: "modifiedOn",
    meta: { title: "Modified On" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="text-sm">{row.getValue(column.id) || "-"}</div>
    ),
  },
  {
    accessorKey: "modifiedBy",
    meta: { title: "Modified By" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="text-sm">{row.getValue(column.id) || "-"}</div>
    ),
  },
  {
    id: "actions",
    meta: { title: "Actions" },
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-center gap-2">
        <ActionButton
          variant="edit"
          onClick={() => handlers.onEdit?.(row.original)}
          size="sm"
          permission={BANNER_UPDATE_PERMISSION}
        />
        <ActionButton
          variant="delete"
          onClick={() => handlers.onDelete?.(row.original)}
          size="sm"
          permission={BANNER_DELETE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
