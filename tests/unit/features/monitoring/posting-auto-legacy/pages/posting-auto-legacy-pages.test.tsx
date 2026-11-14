import { POSTING_AUTO_LEGACY_LIST_PAGE_TITLE } from "@/features/monitoring";
import { PostingAutoLegacyDetailPage } from "@/features/monitoring/posting-auto-legacy/pages/posting-auto-legacy-detail.page";
import { PostingAutoLegacyPage } from "@/features/monitoring/posting-auto-legacy/pages/posting-auto-legacy.page";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";

const { mutate, mutationMock } = vi.hoisted(() => {
  const mutate = vi.fn();
  const mutationMock = () => ({ mutate, isPending: false });
  return { mutate, mutationMock };
});

const detailResponse = {
  status: "SUCCESS",
  message: "OK",
  data: [
    {
      indeks: 1,
      totalidx: 1,
      REVERSAL: "A",
      NO_DOK: "DOK-001",
      REFERENCE: "REF-1",
      TCODE: "FB01",
      DOC_TYPE: "KR",
      DOC_DATE: "2024-01-15",
      POSTING_DATE: "2024-01-16",
      ACCOUNT: "100001",
      DEBIT_KREDIT: "D",
      AMOUNT: "1000",
      BA: "1000",
      pos_status: 0,
      status0: "",
      Fiscal_year: 2024,
    },
  ],
};

vi.mock("@/features/monitoring", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/monitoring")>();
  return {
    ...actual,
    useBatchRegeneratePostingAutoLegacyMutation: mutationMock,
    useBatchSendToSapPostingAutoLegacyMutation: mutationMock,
    useRegeneratePostingAutoLegacyMutation: mutationMock,
    useSendToSapPostingAutoLegacyMutation: mutationMock,
    useDeletePostingAutoLegacyMutation: mutationMock,
    usePostingAutoLegacyByTransaction: () => ({
      data: detailResponse,
      isLoading: false,
      isError: false,
    }),
  };
});

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
      // Page renders a 403 screen unless its permission check passes; stub it
      // so page content renders directly.
      Page: ({
        children,
        title,
      }: {
        children: React.ReactNode;
        title?: string;
      }) => (
        <div data-testid="page">
          {title && <h1>{title}</h1>}
          {children}
        </div>
      ),
      ActionButton: ({
        onClick,
        label,
        variant,
      }: {
        onClick?: () => void;
        label?: string;
        variant?: string;
      }) => (
        <button data-testid={`action-btn-${variant}`} onClick={onClick}>
          {label ?? variant}
        </button>
      ),
      DataTable: ({
        columns,
        title,
        selectedItems,
      }: {
        columns: unknown[];
        title?: string;
        selectedItems?: unknown[];
      }) => {
        const actionsCol = (
          columns as Array<{
            id?: string;
            cell?: (ctx: unknown) => React.ReactNode;
          }>
        ).find((c) => c.id === "actions");
        return (
          <div data-testid="data-table">
            {title && <span>{title}</span>}
            <span data-testid="selected-count">
              {(selectedItems as unknown[] | undefined)?.length ?? 0}
            </span>
            {actionsCol?.cell &&
              actionsCol.cell({
                row: {
                  index: 0,
                  original: {
                    REVERSAL: "A",
                    NO_DOK: "DOK-001",
                    REFERENCE: "REF-1",
                    status0: "",
                  },
                  getIsSelected: () => false,
                  toggleSelected: vi.fn(),
                  getValue: (k: string) =>
                    ({
                      REVERSAL: "A",
                      NO_DOK: "DOK-001",
                      REFERENCE: "REF-1",
                    })[k],
                },
              } as never)}
          </div>
        );
      },
      OfflineDataTable: ({
        columns,
        title,
        data,
      }: {
        columns: unknown[];
        title?: string;
        data: unknown[];
      }) => {
        const actionsCol = (
          columns as Array<{
            id?: string;
            cell?: (ctx: unknown) => React.ReactNode;
          }>
        ).find((c) => c.id === "actions");
        return (
          <div data-testid="offline-data-table">
            {title && <span>{title}</span>}
            <span data-testid="rows-count">{data.length}</span>
            {actionsCol?.cell &&
              actionsCol.cell({
                row: {
                  index: 0,
                  original: detailResponse.data[0],
                  getValue: (k: string) =>
                    (detailResponse.data[0] as Record<string, unknown>)[k],
                },
              } as never)}
          </div>
        );
      },
      ConfirmationModal: ({
        open,
        onConfirm,
        onOpenChange,
        title,
      }: {
        open?: boolean;
        onConfirm?: () => void;
        onOpenChange?: (open: boolean) => void;
        title?: string;
      }) =>
        open ? (
          <div data-testid="confirmation-modal">
            <span data-testid="modal-title">{title}</span>
            <button data-testid="confirm-btn" onClick={onConfirm}>
              Confirm
            </button>
            <button
              data-testid="cancel-btn"
              onClick={() => onOpenChange?.(false)}
            >
              Cancel
            </button>
          </div>
        ) : null,
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/activity-feed", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/alert-banner", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/cards", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/simple-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/constants", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/progress", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/skeleton", __railfinanceCoreMock);

function renderList() {
  return render(
    <Routes>
      <Route path="/" element={<PostingAutoLegacyPage />} />
      <Route
        path="/monitoring/incoming-payment-legacy/:reversalFlag/:documentNumber/:reference"
        element={<PostingAutoLegacyDetailPage />}
      />
      <Route path="*" element={<PostingAutoLegacyPage />} />
    </Routes>,
    { initialEntries: ["/"] },
  );
}

function renderDetail() {
  return render(
    <Routes>
      <Route
        path="/monitoring/incoming-payment-legacy/:reversalFlag/:documentNumber/:reference"
        element={<PostingAutoLegacyDetailPage />}
      />
      <Route path="*" element={<PostingAutoLegacyDetailPage />} />
    </Routes>,
    { initialEntries: ["/monitoring/incoming-payment-legacy/A/DOK-001/REF-1"] },
  );
}

describe("PostingAutoLegacyPage", () => {
  it("renders title, table, and no bulk actions when nothing selected", () => {
    renderList();

    expect(
      screen.getAllByText(POSTING_AUTO_LEGACY_LIST_PAGE_TITLE).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText("Posting Records")).toBeInTheDocument();
    expect(screen.getByTestId("selected-count")).toHaveTextContent("0");
  });

  it("opens bulk confirmation modals from the table actions", async () => {
    const user = userEventSetup();
    renderList();

    await user.click(screen.getByTestId("action-btn-generate"));
    expect(await screen.findByTestId("confirmation-modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-title")).toHaveTextContent(
      "Regenerate Posting",
    );

    await user.click(screen.getByTestId("cancel-btn"));

    await user.click(screen.getByTestId("action-btn-sent"));
    expect(await screen.findByTestId("confirmation-modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-title")).toHaveTextContent("Send to SAP");
  });

  it("navigates to the detail page on view", async () => {
    const user = userEventSetup();
    renderList();

    await user.click(screen.getByTestId("action-btn-show"));
    // detail URL is POSTING_AUTO_LEGACY_URL/A/DOK-001/REF-1 -> detail page renders
    await waitFor(() => {
      expect(screen.getByTestId("offline-data-table")).toBeInTheDocument();
    });
  });
});

describe("PostingAutoLegacyDetailPage", () => {
  it("renders summary, records table, and header actions", () => {
    renderDetail();

    expect(screen.getByText("Document Number")).toBeInTheDocument();
    expect(screen.getByText("DOK-001")).toBeInTheDocument();
    expect(screen.getByText("REF-1")).toBeInTheDocument();
    expect(screen.getByTestId("offline-data-table")).toBeInTheDocument();
    expect(screen.getByTestId("rows-count")).toHaveTextContent("1");
    expect(screen.getByTestId("action-btn-add")).toBeInTheDocument();
  });

  it("opens the regenerate confirmation modal", async () => {
    const user = userEventSetup();
    renderDetail();

    await user.click(screen.getByTestId("action-btn-generate"));
    expect(await screen.findByTestId("confirmation-modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-title")).toHaveTextContent(
      "Regenerate Posting",
    );

    await user.click(screen.getByTestId("confirm-btn"));
    expect(mutate).toHaveBeenCalledWith({
      reversal: "A",
      noDok: "DOK-001",
      reference: "REF-1",
    });
  });

  it("opens the delete confirmation modal", async () => {
    const user = userEventSetup();
    renderDetail();

    await user.click(screen.getByTestId("action-btn-delete"));
    expect(await screen.findByTestId("confirmation-modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-title")).toHaveTextContent(
      "Delete Record",
    );

    await user.click(screen.getByTestId("confirm-btn"));
    expect(mutate).toHaveBeenCalledWith({
      reversal: "A",
      noDok: "DOK-001",
      reference: "REF-1",
      indeks: "1",
    });
  });
});

function userEventSetup() {
  return require("@testing-library/user-event").default.setup();
}
