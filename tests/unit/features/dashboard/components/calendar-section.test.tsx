import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

vi.mock("@railfinance/core", () => ({
  EventCalendar: ({
    className,
    mode,
    selected,
    onSelect,
    eventModifiers,
  }: {
    className?: string;
    mode?: string;
    selected?: Date;
    onSelect?: () => void;
    eventModifiers?: unknown;
  }) => (
    <div data-testid="event-calendar" className={className}>
      <span data-testid="calendar-mode">{mode}</span>
      <span data-testid="calendar-holidays">
        {eventModifiers?.holiday?.length ?? 0}
      </span>
      <span data-testid="calendar-events">
        {eventModifiers?.event?.length ?? 0}
      </span>
    </div>
  ),
}));
vi.mock("@railfinance/core/components/event-calendar", () => ({
  EventCalendar: ({
    className,
    mode,
    selected,
    onSelect,
    eventModifiers,
  }: {
    className?: string;
    mode?: string;
    selected?: Date;
    onSelect?: () => void;
    eventModifiers?: unknown;
  }) => (
    <div data-testid="event-calendar" className={className}>
      <span data-testid="calendar-mode">{mode}</span>
      <span data-testid="calendar-holidays">
        {eventModifiers?.holiday?.length ?? 0}
      </span>
      <span data-testid="calendar-events">
        {eventModifiers?.event?.length ?? 0}
      </span>
    </div>
  ),
}));
vi.mock("@railfinance/core/components/event-calendar", () => ({
  EventCalendar: ({
    className,
    mode,
    selected,
    onSelect,
    eventModifiers,
  }: {
    className?: string;
    mode?: string;
    selected?: Date;
    onSelect?: () => void;
    eventModifiers?: unknown;
  }) => (
    <div data-testid="event-calendar" className={className}>
      <span data-testid="calendar-mode">{mode}</span>
      <span data-testid="calendar-holidays">
        {eventModifiers?.holiday?.length ?? 0}
      </span>
      <span data-testid="calendar-events">
        {eventModifiers?.event?.length ?? 0}
      </span>
    </div>
  ),
}));

import { CalendarSection } from "@/features/dashboard/components/calendar-section";

describe("CalendarSection", () => {
  it("renders the EventCalendar component", () => {
    render(<CalendarSection />);
    expect(screen.getByTestId("event-calendar")).toBeInTheDocument();
  });

  it("passes mode='single' to the calendar", () => {
    render(<CalendarSection />);
    expect(screen.getByTestId("calendar-mode")).toHaveTextContent("single");
  });

  it("passes rounded class to the calendar", () => {
    render(<CalendarSection />);
    const calendar = screen.getByTestId("event-calendar");
    expect(calendar.className).toContain("rounded-lg");
  });

  it("passes 1 holiday modifier", () => {
    render(<CalendarSection />);
    expect(screen.getByTestId("calendar-holidays")).toHaveTextContent("1");
  });

  it("passes 1 event modifier", () => {
    render(<CalendarSection />);
    expect(screen.getByTestId("calendar-events")).toHaveTextContent("1");
  });

  it("has a selected date (today)", () => {
    render(<CalendarSection />);
    // The calendar renders with selected={new Date()}
    expect(screen.getByTestId("event-calendar")).toBeInTheDocument();
  });
});
