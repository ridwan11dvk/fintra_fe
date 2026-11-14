import { ContentCreatePage, ContentFormPage } from "@/features/master-data/content/pages/content-form.page";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { render, screen, waitFor } from "@tests/unit/utils/render-with-providers";
import { server } from "@tests/unit/mocks/server";
import { Route, Routes } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";

const ENDPOINT = "http://localhost:3000/master-data/contents";
const savedRecord = {
  id: 7,
  sectionName: "FAQ",
  body: "Original wording",
  active: true,
};

function renderEditForm() {
  return render(
    <Routes>
      <Route path="/master-data/content/:id/edit" element={<ContentFormPage mode="edit" />} />
      <Route path="/master-data/content/:id" element={<p>View Content route</p>} />
    </Routes>,
    { initialEntries: ["/master-data/content/7/edit"] },
  );
}

function renderCreateForm() {
  return render(
    <Routes>
      <Route path="/master-data/content/create" element={<ContentCreatePage />} />
      <Route path="/master-data/content" element={<p>Content list route</p>} />
    </Routes>,
    { initialEntries: ["/master-data/content/create"] },
  );
}

describe("ContentFormPage edit mode", () => {
  beforeEach(() => {
    server.use(
      http.get(`${ENDPOINT}/7`, () => HttpResponse.json({ data: savedRecord, message: "ok", status: "SUCCESS" })),
      http.put(`${ENDPOINT}/7`, async ({ request }) => {
        const body = await request.json() as { sectionName: string; body: string; active: boolean };
        return HttpResponse.json({ data: { ...savedRecord, ...body }, message: "ok", status: "SUCCESS" });
      }),
    );
  });

  it("enables Save and prompts before leaving after a text-only edit", async () => {
    const user = userEvent.setup();
    renderEditForm();

    const contentField = await screen.findByRole("textbox", { name: /Content/ });
    const saveButton = screen.getByRole("button", { name: "Save" });
    expect(saveButton).toBeDisabled();

    await user.clear(contentField);
    await user.type(contentField, "Updated wording");

    await waitFor(() => expect(saveButton).toBeEnabled());
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(await screen.findByText("Do you want to save or discard changes?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Discard" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled();
  });

  it("saves text-only changes from the unsaved-changes dialog", async () => {
    const user = userEvent.setup();
    renderEditForm();

    const contentField = await screen.findByRole("textbox", { name: /Content/ });
    await user.clear(contentField);
    await user.type(contentField, "Updated wording");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await user.click(await screen.findByRole("button", { name: "Save changes" }));

    expect(await screen.findByText("View Content route")).toBeInTheDocument();
  });

  it("shows the backend duplicate-active conflict when editing to an occupied section", async () => {
    const user = userEvent.setup();
    server.use(
      http.put(`${ENDPOINT}/7`, () => HttpResponse.json({
        type: "about:blank",
        title: "Conflict",
        status: 409,
        detail: "An active Content already exists for section 'Hero Banner'.",
      }, { status: 409 })),
    );
    renderEditForm();

    await user.selectOptions(await screen.findByRole("combobox", { name: /Section Name/ }), "Hero Banner");
    await user.type(screen.getByRole("textbox", { name: /Content/ }), " Updated wording");
    await waitFor(() => expect(screen.getByRole("button", { name: "Save" })).toBeEnabled());
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("An active Content already exists for section 'Hero Banner'."))
      .toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });
});

describe("ContentFormPage create mode", () => {
  it("shows the backend duplicate-active conflict on the section field", async () => {
    const user = userEvent.setup();
    server.use(
      http.post(ENDPOINT, () => HttpResponse.json({
        type: "about:blank",
        title: "Conflict",
        status: 409,
        detail: "An active Content already exists for section 'FAQ'.",
      }, { status: 409 })),
    );
    renderCreateForm();

    await user.selectOptions(await screen.findByRole("combobox", { name: /Section Name/ }), "FAQ");
    await user.type(screen.getByRole("textbox", { name: /Content/ }), "Duplicate wording");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("An active Content already exists for section 'FAQ'."))
      .toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });
});
