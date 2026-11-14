import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { render as renderWithProviders } from "@tests/unit/utils/render-with-providers";
import { server } from "@tests/unit/mocks/server";
import { StageProcessContent } from "@/features/master-data/stage-process/pages/stage-process.page";

const endpoint = /\/master-data\/stage-processes$/;
const initial = [
  { stageCode: "one", name: "First", roleGroup: "Finance", processType: "Approval", slaDays: 1, sequence: 1, version: 0 },
  { stageCode: "two", name: "Second", roleGroup: "Finance", processType: "Approval", slaDays: 2, sequence: 2, version: 0 },
  { stageCode: "three", name: "Third", roleGroup: "Treasury", processType: "Execution", slaDays: 3, sequence: 3, version: 0 },
];
let records: typeof initial;
let savedBodies: unknown[];

beforeEach(() => {
  records = structuredClone(initial);
  savedBodies = [];
  server.use(
    http.get(endpoint, () => HttpResponse.json({ data: records })),
    http.put(endpoint, async ({ request }) => {
      const payload: unknown = await request.json();
      savedBodies.push(payload);
      return HttpResponse.json({ data: records.map((row) => ({ ...row, slaDays: row.stageCode === "one" ? 1.5 : row.slaDays, version: 1 })) });
    }),
  );
});

async function openForm() {
  renderWithProviders(<StageProcessContent />);
  return await screen.findByTestId("stage-row-one");
}

describe("Administrator Stage Process form", () => {
  it("saves a decimal once and resets its dirty baseline from the server response", async () => {
    const row = await openForm();
    const user = userEvent.setup();
    expect(screen.getByRole("heading", { name: "SLA Setup", exact: true })).toBeVisible();
    const sla = within(row).getByRole("textbox", { name: /SLA \(Days\)/ });
    await user.clear(sla);
    await user.type(sla, "1,5");
    const save = screen.getByRole("button", { name: "Save", exact: true });
    await waitFor(() => expect(save).toBeEnabled());
    await user.click(save);
    await waitFor(() => expect(save).toBeDisabled());
    expect(savedBodies).toHaveLength(1);
    expect(savedBodies[0]).toMatchObject({ items: [expect.objectContaining({ stageCode: "one", slaDays: 1.5, version: 0 }), expect.anything(), expect.anything()] });
    await waitFor(() => expect(within(screen.getByTestId("stage-row-one")).getByRole("textbox", { name: /SLA/ })).toHaveValue("1.5"));
  });

  it("does not submit any row when another row has an invalid SLA", async () => {
    const row = await openForm();
    const user = userEvent.setup();
    const sla = within(row).getByRole("textbox", { name: /SLA/ });
    await user.clear(sla);
    expect(await within(row).findByText("SLA wajib diisi")).toBeVisible();
    await user.type(within(screen.getByTestId("stage-row-one")).getByRole("textbox", { name: /SLA/ }), "0,5");
    expect(within(screen.getByTestId("stage-row-one")).getByRole("textbox", { name: /SLA/ })).toHaveValue("0,5");
    await user.tab();
    expect(await screen.findByText("SLA minimal 1 hari")).toBeVisible();
    expect(screen.getByRole("button", { name: "Save", exact: true })).toBeDisabled();
    expect(savedBodies).toHaveLength(0);
  });

  it("preserves the user's draft and shows the error when the API rejects Save", async () => {
    server.use(http.put(endpoint, () => HttpResponse.json({ message: "Catalog changed; reload before saving" }, { status: 409 })));
    const row = await openForm();
    const user = userEvent.setup();
    const name = within(row).getByRole("textbox", { name: /Process Name/ });
    await user.clear(name);
    await user.type(name, "Changed First");
    const save = screen.getByRole("button", { name: "Save", exact: true });
    await waitFor(() => expect(save).toBeEnabled());
    await user.click(save);
    expect(await screen.findByRole("alert")).toHaveTextContent("Catalog changed");
    expect(name).toHaveValue("Changed First");
    expect(save).toBeEnabled();
  });

  it("allows keyboard reordering within a group but refuses the category boundary", async () => {
    await openForm();
    const user = userEvent.setup();
    const secondHandle = within(screen.getByTestId("stage-row-two")).getByRole("button");
    secondHandle.focus();
    await user.keyboard("{ArrowUp}");
    expect(screen.getAllByTestId(/^stage-row-/).map((row) => row.dataset.testid)).toEqual(["stage-row-two", "stage-row-one", "stage-row-three"]);
    within(screen.getByTestId("stage-row-three")).getByRole("button").focus();
    await user.keyboard("{ArrowUp}");
    expect(screen.getAllByTestId(/^stage-row-/).map((row) => row.dataset.testid)).toEqual(["stage-row-two", "stage-row-one", "stage-row-three"]);
    expect(within(screen.getByTestId("stage-row-one")).getByRole("textbox", { name: /SLA/ })).toHaveValue("1");
  });

  it("rejects a pointer drop across groups", async () => {
    const row = await openForm();
    fireEvent.drop(screen.getByTestId("stage-row-three"), { dataTransfer: { getData: () => "one" } });
    expect(screen.getAllByTestId(/^stage-row-/)[0]).toBe(row);
    expect(screen.getByRole("button", { name: "Save", exact: true })).toBeDisabled();
  });

  it("discards unsaved values after Cancel confirmation", async () => {
    const row = await openForm();
    const user = userEvent.setup();
    const name = within(row).getByRole("textbox", { name: /Process Name/ });
    await user.clear(name);
    await user.type(name, "Unsaved");
    await user.click(screen.getByRole("button", { name: "Cancel", exact: true }));
    await user.click(await screen.findByRole("button", { name: "Discard", exact: true }));
    await waitFor(() => expect(within(screen.getByTestId("stage-row-one")).getByRole("textbox", { name: /Process Name/ })).toHaveValue("First"));
    expect(savedBodies).toHaveLength(0);
  });

  it("shows an empty catalog without an invented 18-stage fixture", async () => {
    server.use(http.get(endpoint, () => HttpResponse.json({ data: [] })));
    renderWithProviders(<StageProcessContent />);
    expect(await screen.findByRole("status")).toHaveTextContent(/Loading|No process/);
    expect(await screen.findByText("No process stages are configured.")).toBeVisible();
    expect(screen.queryByTestId("stage-process-form")).not.toBeInTheDocument();
  });
});
