import { FaqFormModal } from "@/features/settings/faq/components/faq-form-modal";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const createMutate = vi.fn();
const updateMutate = vi.fn();

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      useAuth: () => ({
        can: () => true,
        hasResource: () => true,
        permissions: [],
        roles: [],
        user: {},
        token: null,
        isSuperAdmin: false,
        isAuthenticated: true,
        isLoading: false,
        isRefreshing: false,
        error: null,
        logout: vi.fn(),
        scheduleTokenRefresh: vi.fn(),
      }),
      useGetLookupValueOptions: () => ({
        data: {
          data: [
            { value: "guest_home", label: "Guest Home" },
            { value: "external_home", label: "External Home" },
          ],
        },
        isLoading: false,
      }),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dialog", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock("@/features/settings/faq/data/faq.mutation", async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import("@/features/settings/faq/data/faq.mutation")
    >();
  return {
    ...actual,
    useCreateFaqMutation: () => ({
      mutate: createMutate,
      isPending: false,
    }),
    useUpdateFaqMutation: () => ({
      mutate: updateMutate,
      isPending: false,
    }),
  };
});

describe("FaqFormModal", () => {
  describe("rendering", () => {
    it("does not render modal content when closed", () => {
      render(
        <FaqFormModal open={false} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.queryByText("Add FAQ")).not.toBeInTheDocument();
    });

    it("renders the create title when open in create mode", () => {
      render(<FaqFormModal open onOpenChange={vi.fn()} mode="create" />);

      expect(screen.getByText("Add FAQ")).toBeInTheDocument();
    });

    it("renders the edit title when open in edit mode", () => {
      render(<FaqFormModal open onOpenChange={vi.fn()} mode="edit" />);

      expect(screen.getByText("Edit FAQ")).toBeInTheDocument();
    });
  });

  describe("target select", () => {
    it("renders the FAQ target categories returned by the category API", async () => {
      render(<FaqFormModal open onOpenChange={vi.fn()} mode="create" />);

      const select = screen.getByLabelText(/Target/) as HTMLSelectElement;
      await waitFor(() => {
        const values = Array.from(select.options).map((o) => o.value);
        expect(values).toContain("guest_home");
        expect(values).toContain("external_home");
      });
    });
  });

  describe("validation", () => {
    it("shows an error when target, question, and answer are blank", async () => {
      const user = userEvent.setup();
      render(<FaqFormModal open onOpenChange={vi.fn()} mode="create" />);

      await user.click(screen.getByRole("button", { name: /Create/ }));

      expect(await screen.findByText("Target is required")).toBeInTheDocument();
      expect(
        await screen.findByText("Question (ID) is required"),
      ).toBeInTheDocument();
      expect(
        await screen.findByText("Answer (ID) is required"),
      ).toBeInTheDocument();
      expect(createMutate).not.toHaveBeenCalled();
    });

    it("shows an error when endDate is before startDate", async () => {
      const user = userEvent.setup();
      render(<FaqFormModal open onOpenChange={vi.fn()} mode="create" />);

      await user.selectOptions(screen.getByLabelText(/Target/), "guest_home");
      await user.type(
        screen.getByLabelText(/Question \(ID\)/),
        "Pertanyaan uji",
      );
      await user.type(screen.getByLabelText(/Answer \(ID\)/), "Jawaban uji");
      await user.clear(screen.getByLabelText(/Start Date/));
      await user.type(screen.getByLabelText(/Start Date/), "2026-12-31");
      await user.type(screen.getByLabelText(/End Date/), "2026-01-01");

      await user.click(screen.getByRole("button", { name: /Create/ }));

      expect(
        await screen.findByText("End date must be on or after start date"),
      ).toBeInTheDocument();
      expect(createMutate).not.toHaveBeenCalled();
    });
  });

  describe("submit", () => {
    it("sends the payload with optional EN fields omitted when blank", async () => {
      createMutate.mockClear();
      const user = userEvent.setup();
      render(<FaqFormModal open onOpenChange={vi.fn()} mode="create" />);

      await user.selectOptions(screen.getByLabelText(/Target/), "guest_home");
      await user.type(
        screen.getByLabelText(/Question \(ID\)/),
        "Pertanyaan uji",
      );
      await user.type(screen.getByLabelText(/Answer \(ID\)/), "Jawaban uji");

      await user.click(screen.getByRole("button", { name: /Create/ }));

      await waitFor(() => expect(createMutate).toHaveBeenCalledTimes(1));
      const payload = createMutate.mock.calls[0][0];
      expect(payload.target).toBe("guest_home");
      expect(payload.question).toBe("Pertanyaan uji");
      expect(payload.answer).toBe("Jawaban uji");
      expect(payload.questionEn).toBeUndefined();
      expect(payload.answerEn).toBeUndefined();
      expect(payload.endDate).toBeUndefined();
      expect(payload.sortOrder).toBe(0);
    });

    it("sends the id when updating", async () => {
      updateMutate.mockClear();
      const user = userEvent.setup();
      render(
        <FaqFormModal
          open
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={{
            id: 7,
            target: "external_home",
            question: "Pertanyaan lama",
            answer: "Jawaban lama",
            startDate: "2026-01-01",
            sortOrder: 3,
          }}
        />,
      );

      await user.click(screen.getByRole("button", { name: /Save/ }));

      await waitFor(() => expect(updateMutate).toHaveBeenCalledTimes(1));
      const [variables] = updateMutate.mock.calls[0];
      expect(variables.id).toBe(7);
      expect(variables.data.target).toBe("external_home");
      expect(variables.data.sortOrder).toBe(3);
    });
  });
});
