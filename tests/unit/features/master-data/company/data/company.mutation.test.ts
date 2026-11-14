import {
  useCreateCompanyMutation,
  useDeleteCompanyFileMutation,
  useDeleteCompanyMutation,
  useImportCompaniesMutation,
  useUpdateCompanyFileMutation,
  useUpdateCompanyMutation,
  useUploadCompanyFileMutation,
} from "@/features/master-data/company/data/company.mutation";
import { server } from "@tests/unit/mocks/server";
import { renderHook, waitFor } from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    const { buildUiResponseMock } =
      await import("@tests/unit/mocks/ui-response-mock");
    return buildUiResponseMock(actual);
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);

const BASE = "http://localhost:3000";

describe("useCreateCompanyMutation", () => {
  it("calls toast.success after successful create", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useCreateCompanyMutation());

    result.current.mutate({
      code: "COMP002",
      name: "PT Baru Indonesia",
      isActive: true,
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns 500", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.post(`${BASE}/master/company`, () =>
        HttpResponse.json({ message: "Server Error" }, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useCreateCompanyMutation());

    result.current.mutate({
      code: "COMP002",
      name: "PT Baru Indonesia",
      isActive: true,
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it("sends FormData with file uploads when files provided", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useCreateCompanyMutation());
    const file = new File(["logo"], "logo.png", { type: "image/png" });

    result.current.mutate({
      code: "COMP002",
      name: "PT Baru",
      isActive: true,
      files: [file],
      fileAliases: "LOGO",
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });
});

describe("useUpdateCompanyMutation", () => {
  it("calls toast.success after successful update", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdateCompanyMutation());

    result.current.mutate({
      id: 1,
      data: {
        name: "PT Mitra Updated",
        isActive: true,
      },
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns error", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.put(`${BASE}/master/company/:id`, () =>
        HttpResponse.json({ message: "Update failed" }, { status: 400 }),
      ),
    );
    const { result } = renderHook(() => useUpdateCompanyMutation());

    result.current.mutate({
      id: 1,
      data: { name: "Updated" },
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it("accepts optional file fields in update payload", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdateCompanyMutation());
    const logoFile = new File(["logo"], "logo.png", { type: "image/png" });
    const headerFile = new File(["header"], "header.pdf", {
      type: "application/pdf",
    });

    result.current.mutate({
      id: 1,
      data: {
        name: "Updated",
        logoFile,
        headerDocFile: headerFile,
      },
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });
});

describe("useDeleteCompanyMutation", () => {
  it("calls toast.success after successful delete", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useDeleteCompanyMutation());

    result.current.mutate(1);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when server returns error", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.delete(`${BASE}/master/company/:id`, () =>
        HttpResponse.json({ message: "Cannot delete" }, { status: 409 }),
      ),
    );
    const { result } = renderHook(() => useDeleteCompanyMutation());

    result.current.mutate(1);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useUploadCompanyFileMutation", () => {
  it("calls toast.success after successful file upload", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUploadCompanyFileMutation());
    const file = new File(["content"], "document.pdf", {
      type: "application/pdf",
    });

    result.current.mutate({
      companyId: 1,
      name: "Document 1",
      alias: "DOC1",
      file,
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when upload fails", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.post(`${BASE}/master/company/:companyId/file`, () =>
        HttpResponse.json({ message: "Upload failed" }, { status: 400 }),
      ),
    );
    const { result } = renderHook(() => useUploadCompanyFileMutation());
    const file = new File(["content"], "document.pdf", {
      type: "application/pdf",
    });

    result.current.mutate({
      companyId: 1,
      name: "Document 1",
      alias: "DOC1",
      file,
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useUpdateCompanyFileMutation", () => {
  it("calls toast.success after successful file update", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useUpdateCompanyFileMutation());
    const file = new File(["updated"], "document.pdf", {
      type: "application/pdf",
    });

    result.current.mutate({
      companyId: 1,
      fileId: 5,
      data: {
        name: "Updated Document",
        alias: "DOC1",
        file,
      },
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when update fails", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.put(`${BASE}/master/company/:companyId/file/:fileId`, () =>
        HttpResponse.json({ message: "Update failed" }, { status: 400 }),
      ),
    );
    const { result } = renderHook(() => useUpdateCompanyFileMutation());

    result.current.mutate({
      companyId: 1,
      fileId: 5,
      data: {
        name: "Updated",
        alias: "DOC",
      },
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useDeleteCompanyFileMutation", () => {
  it("calls toast.success after successful file delete", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useDeleteCompanyFileMutation());

    result.current.mutate({ companyId: 1, fileId: 5 });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when delete fails", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.delete(`${BASE}/master/company/:companyId/file/:fileId`, () =>
        HttpResponse.json({ message: "Cannot delete file" }, { status: 409 }),
      ),
    );
    const { result } = renderHook(() => useDeleteCompanyFileMutation());

    result.current.mutate({ companyId: 1, fileId: 5 });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe("useImportCompaniesMutation", () => {
  it("calls toast.success after successful import", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useImportCompaniesMutation());
    const file = new File(["excel-data"], "import.xlsx", {
      type: "application/vnd.ms-excel",
    });

    result.current.mutate({ file });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });

  it("calls toast.error when import fails", async () => {
    const { toast } = await import("sonner");
    server.use(
      http.post(`${BASE}/master/company/import`, () =>
        HttpResponse.json({ message: "Invalid file format" }, { status: 400 }),
      ),
    );
    const { result } = renderHook(() => useImportCompaniesMutation());
    const file = new File(["invalid"], "import.xlsx", {
      type: "application/vnd.ms-excel",
    });

    result.current.mutate({ file });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it("accepts dryRun parameter", async () => {
    const { toast } = await import("sonner");
    const { result } = renderHook(() => useImportCompaniesMutation());
    const file = new File(["data"], "import.xlsx", {
      type: "application/vnd.ms-excel",
    });

    result.current.mutate({ file, dryRun: true });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(expect.any(String)),
    );
  });
});
