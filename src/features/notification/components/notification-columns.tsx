"use client";

import {
  NOTIFICATION_DELETE_PERMISSION,
  NOTIFICATION_READ_PERMISSION,
  type NotificationResponse,
} from "@/features/notification";
import { ActionButton } from "@railfinance/core/components/actions";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import { Badge } from "@railfinance/core/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";

export const notificationColumns = (
  handlers: TableActionHandlers<NotificationResponse>,
): ColumnDef<NotificationResponse>[] => [
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
    accessorKey: "categoryName",
    meta: { title: "Category" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="font-medium text-sm">{row.getValue("categoryName")}</div>
    ),
  },
  {
    accessorKey: "title",
    meta: { title: "Title" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="font-medium text-sm max-w-xs truncate">
        {row.getValue("title")}
      </div>
    ),
  },
  {
    accessorKey: "channel",
    meta: { title: "Channel" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => {
      const channel = row.original.channel;
      const channelVariants: Record<
        string,
        "default" | "secondary" | "destructive" | "outline"
      > = {
        IN_APP: "default",
        EMAIL: "secondary",
        SMS: "destructive",
        WHATSAPP: "outline",
      };
      return (
        <Badge variant={channelVariants[channel] || "default"}>{channel}</Badge>
      );
    },
  },
  {
    accessorKey: "isRead",
    meta: { title: "Status" },
    header: ({ column }) => <ColumnHeader column={column} align="center" />,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant={row.original.isRead ? "secondary" : "default"}>
          {row.original.isRead ? "Read" : "Unread"}
        </Badge>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    meta: { title: "Date" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="text-sm">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </div>
    ),
  },
  {
    id: "actions",
    meta: { title: "Actions" },
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <ActionButton
          variant="show"
          size="sm"
          onClick={() => handlers?.onShow?.(row.original)}
          permission={NOTIFICATION_READ_PERMISSION}
        />
        <ActionButton
          variant="delete"
          size="sm"
          onClick={() => handlers?.onDelete?.(row.original)}
          permission={NOTIFICATION_DELETE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
