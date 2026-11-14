import { render, screen } from "@tests/unit/utils/render-with-providers";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NotificationFilters } from "@/features/notification/components/notification-filters";

describe("NotificationFilters", () => {
  it("renders channel and read status selects", () => {
    render(
      <NotificationFilters
        onFilterChange={vi.fn()}
        onClearFilters={vi.fn()}
      />,
    );

    expect(screen.getByText("Channel")).toBeInTheDocument();
    expect(screen.getByText("Read Status")).toBeInTheDocument();
  });

  it("does not show clear filters button when no active filters", () => {
    render(
      <NotificationFilters
        onFilterChange={vi.fn()}
        onClearFilters={vi.fn()}
      />,
    );

    expect(screen.queryByText("Clear Filters")).not.toBeInTheDocument();
  });

  it("shows clear filters button when channel filter is active", () => {
    render(
      <NotificationFilters
        onFilterChange={vi.fn()}
        onClearFilters={vi.fn()}
        currentFilters={{ channel: "EMAIL" }}
      />,
    );

    expect(screen.getByText("Clear Filters")).toBeInTheDocument();
  });

  it("shows clear filters button when isRead filter is active", () => {
    render(
      <NotificationFilters
        onFilterChange={vi.fn()}
        onClearFilters={vi.fn()}
        currentFilters={{ isRead: "true" }}
      />,
    );

    expect(screen.getByText("Clear Filters")).toBeInTheDocument();
  });

  it("calls onClearFilters when Clear Filters is clicked", async () => {
    const user = userEvent.setup({ delay: null });
    const onClearFilters = vi.fn();

    render(
      <NotificationFilters
        onFilterChange={vi.fn()}
        onClearFilters={onClearFilters}
        currentFilters={{ channel: "EMAIL" }}
      />,
    );

    await user.click(screen.getByText("Clear Filters"));
    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });
});
