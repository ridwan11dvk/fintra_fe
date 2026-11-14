import type { PaginationParams } from "@railfinance/core/types";
import { Button } from "@railfinance/core/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@railfinance/core/ui/select";
import { X } from "lucide-react";

interface NotificationFiltersProps {
  onFilterChange: (params: Partial<PaginationParams>) => void;
  onClearFilters: () => void;
  currentFilters?: {
    channel?: string;
    isRead?: string;
    categoryId?: number;
  };
}

export const NotificationFilters = ({
  onFilterChange,
  onClearFilters,
  currentFilters,
}: NotificationFiltersProps) => {
  const hasActiveFilters =
    currentFilters?.channel ||
    currentFilters?.isRead ||
    currentFilters?.categoryId;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Channel Filter */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Channel</div>
          <Select
            value={currentFilters?.channel || "all"}
            onValueChange={(value) =>
              onFilterChange({ channel: value === "all" ? undefined : value })
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Channels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="IN_APP">In-App</SelectItem>
              <SelectItem value="EMAIL">Email</SelectItem>
              <SelectItem value="SMS">SMS</SelectItem>
              <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Read Status Filter */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Read Status</div>
          <Select
            value={currentFilters?.isRead || "all"}
            onValueChange={(value) =>
              onFilterChange({ isRead: value === "all" ? undefined : value })
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="false">Unread</SelectItem>
              <SelectItem value="true">Read</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};
