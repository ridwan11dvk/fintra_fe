import { ContentPreviewPage } from "@/features/master-data/content/pages/content-preview.page";
import { http, HttpResponse } from "msw";
import { server } from "@tests/unit/mocks/server";
import { render, screen, within } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it } from "vitest";

const ENDPOINT = "http://localhost:3000/master-data/contents";

describe("ContentPreviewPage section rules", () => {
  it("shows only one active wording for a section even if the API returns duplicates", async () => {
    server.use(
      http.get(ENDPOINT, () => HttpResponse.json({
        data: [
          { id: 1, sectionName: "Hero Banner", body: "First active wording", active: true },
          { id: 2, sectionName: "Hero Banner", body: "Second active wording", active: true },
        ],
        message: "ok",
        status: "SUCCESS",
      })),
    );
    render(<ContentPreviewPage />);

    const heroHeading = await screen.findByRole("heading", { name: "Hero Banner" });
    const heroSection = heroHeading.closest("section");
    if (!heroSection) throw new Error("Hero Banner section was not rendered");
    expect(within(heroSection).getByText("First active wording")).toBeInTheDocument();
    expect(within(heroSection).queryByText("Second active wording")).not.toBeInTheDocument();
    expect(heroSection).toHaveAttribute("data-has-active-content", "true");
  });

  it("keeps an empty section layout without showing inactive wording or fallback copy", async () => {
    server.use(
      http.get(ENDPOINT, () => HttpResponse.json({
        data: [
          { id: 3, sectionName: "Hero Banner", body: "Inactive wording", active: false },
        ],
        message: "ok",
        status: "SUCCESS",
      })),
    );
    render(<ContentPreviewPage />);

    const heroHeading = await screen.findByRole("heading", { name: "Hero Banner" });
    const heroSection = heroHeading.closest("section");
    if (!heroSection) throw new Error("Hero Banner section was not rendered");
    expect(heroSection).toHaveAttribute("data-has-active-content", "false");
    expect(within(heroSection).queryByText("Inactive wording")).not.toBeInTheDocument();
    expect(within(heroSection).queryByRole("paragraph")).not.toBeInTheDocument();
  });
});
