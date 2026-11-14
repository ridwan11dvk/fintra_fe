import { EventCalendar, type CalendarModifiers } from "@railfinance/core/components/event-calendar";

const modifiers: CalendarModifiers = {
  holiday: [
    {
      title: "Independence Day",
      date: new Date(new Date().setDate(new Date().getDate() + 3)),
    },
  ],
  event: [
    {
      title: "Team Meeting",
      date: new Date(new Date().setDate(new Date().getDate() + 6)),
    },
  ],
};
export function CalendarSection() {
  return (
    <EventCalendar
      className="w-full rounded-lg shadow-md"
      mode="single"
      selected={new Date()}
      onSelect={() => undefined}
      eventModifiers={modifiers}
    />
  );
}

/* c8 ignore next 1 */
export default CalendarSection;
