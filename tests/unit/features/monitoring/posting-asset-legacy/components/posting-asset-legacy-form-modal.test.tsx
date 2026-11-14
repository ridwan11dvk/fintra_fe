import { PostingAssetLegacyFormModal } from "@/features/monitoring/posting-asset-legacy/components/posting-asset-legacy-form-modal";
import type { PostingAssetLegacyDetail } from "@/features/monitoring/posting-asset-legacy/data/posting-asset-legacy.types";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@tests/unit/utils/render-with-providers";
import { beforeEach, describe, expect, it, vi } from "vitest";

const createSpy = vi.hoisted(() =>
  vi.fn(() => Promise.resolve({ status: "SUCCESS", message: "OK", data: null })),
);
const updateSpy = vi.hoisted(() =>
  vi.fn(() => Promise.resolve({ status: "SUCCESS", message: "OK", data: null })),
);

vi.mock(
  "@/features/monitoring/posting-asset-legacy/data/posting-asset-legacy.service",
  async (importOriginal) => {
    const actual =
      await importOriginal<typeof import("@/features/monitoring/posting-asset-legacy/data/posting-asset-legacy.service")>();
    return {
      ...actual,
      postingAssetLegacyService: {
        ...actual.postingAssetLegacyService,
        create: createSpy,
        update: updateSpy,
      },
    };
  },
);

const validTransactionKey = { reversal: "A", noDok: "DOK-001", reference: "REF-001" };

const editDefaults = {
  indeks: 3,
  TCODE: "FB01",
  DOC_TYPE: "KR",
  ACCOUNT: "100001",
  AMOUNT: "1000",
  BA: "1000",
  NO_DOK: "DOK-001",
  REVERSAL: "A",
} as Partial<PostingAssetLegacyDetail>;

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(document.getElementById("TCODE") as HTMLInputElement, "FB01");
  await user.type(document.getElementById("DOC_TYPE") as HTMLInputElement, "KR");
  await user.type(document.getElementById("ACCOUNT") as HTMLInputElement, "100001");
  await user.type(document.getElementById("AMOUNT") as HTMLInputElement, "1000");
  await user.type(document.getElementById("BA") as HTMLInputElement, "1000");
}

describe("PostingAssetLegacyFormModal", () => {
  beforeEach(() => {
    createSpy.mockClear();
    updateSpy.mockClear();
  });

  it("renders create title and description", () => {
    render(
      <PostingAssetLegacyFormModal
        open
        onOpenChange={vi.fn()}
        mode="create"
        transactionKey={validTransactionKey}
      />,
    );

    expect(screen.getByText("Create Record")).toBeInTheDocument();
    expect(
      screen.getByText("Fill in the details to create a new invoice legacy record."),
    ).toBeInTheDocument();
  });

  it("renders edit title and description", () => {
    render(
      <PostingAssetLegacyFormModal
        open
        onOpenChange={vi.fn()}
        mode="edit"
        defaultValues={editDefaults}
        transactionKey={validTransactionKey}
      />,
    );

    expect(screen.getByText("Edit Record")).toBeInTheDocument();
    expect(
      screen.getByText("Update the invoice legacy record."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Update" }),
    ).toBeInTheDocument();
  });

  it("shows validation errors and does not submit when required fields are empty", async () => {
    const user = userEvent.setup();
    render(
      <PostingAssetLegacyFormModal
        open
        onOpenChange={vi.fn()}
        mode="create"
        transactionKey={validTransactionKey}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(screen.getAllByText("Required").length).toBeGreaterThanOrEqual(1);
    });
    expect(screen.getByText("Business Area is required")).toBeInTheDocument();
    expect(createSpy).not.toHaveBeenCalled();
  });

  it("submits create and closes the modal on success", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();
    render(
      <PostingAssetLegacyFormModal
        open
        onOpenChange={onOpenChange}
        onSuccess={onSuccess}
        mode="create"
        transactionKey={validTransactionKey}
      />,
    );

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledTimes(1);
    });
    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        TCODE: "FB01",
        DOC_TYPE: "KR",
        ACCOUNT: "100001",
        AMOUNT: "1000",
        BA: "1000",
        REVERSAL: "A",
        NO_DOK: "DOK-001",
        DEBIT_KREDIT: "D",
        RECORD_NUMBER: 1,
      }),
    );
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("submits update with transaction key and index in edit mode", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <PostingAssetLegacyFormModal
        open
        onOpenChange={onOpenChange}
        mode="edit"
        defaultValues={editDefaults}
        transactionKey={validTransactionKey}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Update" }));

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledTimes(1);
    });
    expect(updateSpy).toHaveBeenCalledWith(
      "A",
      "DOK-001",
      "REF-001",
      "3",
      expect.objectContaining({
        TCODE: "FB01",
        DOC_TYPE: "KR",
        ACCOUNT: "100001",
        AMOUNT: "1000",
        BA: "1000",
        REVERSAL: "A",
        NO_DOK: "DOK-001",
      }),
    );
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
    expect(createSpy).not.toHaveBeenCalled();
  });

  it("keeps the modal open when create fails", async () => {
    createSpy.mockRejectedValueOnce(
      Object.assign(new Error("API error"), {
        response: { data: { message: "API error", errors: {} } },
      }),
    );
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <PostingAssetLegacyFormModal
        open
        onOpenChange={onOpenChange}
        mode="create"
        transactionKey={validTransactionKey}
      />,
    );

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledTimes(1);
    });
    await new Promise((r) => setTimeout(r, 300));
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });
});
