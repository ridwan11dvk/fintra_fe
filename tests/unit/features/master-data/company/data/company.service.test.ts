import { companyService } from "@/features/master-data/company/data/company.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

const BASE = "http://localhost:3000";

describe("companyService", () => {
  describe("listCompanies()", () => {
    it("returns paged company data on success", async () => {
      const result = await companyService.listCompanies({ page: 1, size: 10 });

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data?.content[0].code).toBe("COMP001");
      expect(result.data?.pagination.total).toBe(1);
    });

    it("forwards pagination params to the request", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get("http://localhost:3000/master/company", ({ request }) => {
          capturedUrls.push(new URL(request.url));
          return HttpResponse.json({
            status: "SUCCESS",
            message: "ok",
            data: {
              content: [],
              pagination: {
                total: 0,
                pageSize: 5,
                pageNumber: 2,
                totalPages: 0,
                currentPage: 2,
                from: 0,
                to: 0,
              },
            },
          });
        }),
      );

      await companyService.listCompanies({
        page: 2,
        size: 5,
        keyword: "Mitra",
        isActive: true,
      });

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("page")).toBe("2");
      expect(capturedUrl.searchParams.get("size")).toBe("5");
      expect(capturedUrl.searchParams.get("keyword")).toBe("Mitra");
      expect(capturedUrl.searchParams.get("isActive")).toBe("true");
    });

    it("throws when the server returns 500", async () => {
      server.use(
        http.get("http://localhost:3000/master/company", () => {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          );
        }),
      );

      await expect(companyService.listCompanies()).rejects.toThrow();
    });
  });

  describe("getCompanyById()", () => {
    it("returns a single company by ID", async () => {
      const result = await companyService.getCompanyById(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.name).toBe("PT Mitra Utama Indonesia");
    });

    it("throws when company not found", async () => {
      server.use(
        http.get(`${BASE}/master/company/999`, () => {
          return HttpResponse.json(
            { message: "Company not found" },
            { status: 404 },
          );
        }),
      );

      await expect(companyService.getCompanyById(999)).rejects.toThrow();
    });
  });

  describe("createCompany()", () => {
    it("creates a company and returns the created record", async () => {
      const payload = {
        code: "COMP002",
        name: "PT Baru Indonesia",
        address: "Jl. Merdeka 456",
        isActive: true,
      };
      const result = await companyService.createCompany(payload);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.code).toBe("COMP001");
    });

    it("creates a company without optional fields", async () => {
      const payload = {
        code: "COMP003",
        name: "PT No Address",
        isActive: true,
      };
      const result = await companyService.createCompany(payload);

      expect(result.status).toBe("SUCCESS");
    });

    it("sends FormData with correct headers for file upload", async () => {
      const payload = {
        code: "COMP002",
        name: "PT Baru Indonesia",
        isActive: true,
        files: [new File(["logo"], "logo.png", { type: "image/png" })],
        fileAliases: "LOGO",
      };

      const result = await companyService.createCompany(payload);

      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("updateCompany()", () => {
    it("updates a company and returns the updated record", async () => {
      const payload = {
        name: "PT Mitra Utama Updated",
        isActive: true,
      };
      const result = await companyService.updateCompany(1, payload);

      expect(result.status).toBe("SUCCESS");
    });

    it("updates company with code and address fields", async () => {
      const payload = {
        code: "COMP-UPD",
        name: "Updated Name",
        address: "New Address 123",
      };
      const result = await companyService.updateCompany(1, payload);

      expect(result.status).toBe("SUCCESS");
    });

    it("updates company with optional file fields", async () => {
      const logoFile = new File(["logo"], "logo.png", { type: "image/png" });
      const headerFile = new File(["header"], "header.pdf", {
        type: "application/pdf",
      });
      const footerFile = new File(["footer"], "footer.pdf", {
        type: "application/pdf",
      });

      const payload = {
        name: "Updated Company",
        logoFile,
        headerDocFile: headerFile,
        footerDocFile: footerFile,
      };

      const result = await companyService.updateCompany(1, payload);

      expect(result.status).toBe("SUCCESS");
    });

    it("updates company without name field (only code)", async () => {
      const payload = {
        code: "CODE-ONLY",
        isActive: false,
      };
      const result = await companyService.updateCompany(1, payload);
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deleteCompany()", () => {
    it("deletes a company successfully", async () => {
      const result = await companyService.deleteCompany(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.message).toBe("Data deleted successfully");
    });

    it("throws when company not found", async () => {
      server.use(
        http.delete(`${BASE}/master/company/999`, () => {
          return HttpResponse.json(
            { message: "Company not found" },
            { status: 404 },
          );
        }),
      );

      await expect(companyService.deleteCompany(999)).rejects.toThrow();
    });
  });

  describe("uploadCompanyFile()", () => {
    it("uploads a company file successfully", async () => {
      const file = new File(["content"], "document.pdf", {
        type: "application/pdf",
      });
      const payload = {
        companyId: 1,
        name: "Document 1",
        alias: "DOC1",
        file,
      };

      const result = await companyService.uploadCompanyFile(payload);

      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
    });
  });

  describe("updateCompanyFile()", () => {
    it("updates a company file successfully", async () => {
      const file = new File(["updated content"], "updated.pdf", {
        type: "application/pdf",
      });
      const payload = {
        name: "Updated Document",
        alias: "DOC1",
        file,
      };

      const result = await companyService.updateCompanyFile(1, 5, payload);

      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deleteCompanyFile()", () => {
    it("deletes a company file successfully", async () => {
      const result = await companyService.deleteCompanyFile(1, 5);

      expect(result.status).toBe("SUCCESS");
      expect(result.message).toBe("File deleted successfully");
    });
  });

  describe("getLogoPresignedUrl()", () => {
    it("returns a presigned URL for logo", async () => {
      const result = await companyService.getLogoPresignedUrl(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toMatch(/^https:\/\/s3\.example\.com/);
    });
  });

  describe("getHeaderPresignedUrl()", () => {
    it("returns a presigned URL for header document", async () => {
      const result = await companyService.getHeaderPresignedUrl(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toMatch(/^https:\/\/s3\.example\.com/);
    });
  });

  describe("getFooterPresignedUrl()", () => {
    it("returns a presigned URL for footer document", async () => {
      const result = await companyService.getFooterPresignedUrl(1);

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toMatch(/^https:\/\/s3\.example\.com/);
    });
  });

  describe("getCompanyFilePresignedUrl()", () => {
    it("returns a presigned URL for company file", async () => {
      const result = await companyService.getCompanyFilePresignedUrl(1, 5);

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toMatch(/^https:\/\/s3\.example\.com/);
    });
  });

  describe("exportCompanies()", () => {
    it("exports companies and returns a Blob", async () => {
      const result = await companyService.exportCompanies();

      expect(result).toBeInstanceOf(Blob);
    });

    it("passes search parameter when provided", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/company/export`, ({ request }) => {
          capturedUrls.push(new URL(request.url));
          return new HttpResponse(
            new Blob(["data"], { type: "application/vnd.ms-excel" }),
            {
              headers: { "Content-Type": "application/vnd.ms-excel" },
            },
          );
        }),
      );

      await companyService.exportCompanies("PT Mitra");

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("search")).toBe("PT Mitra");
    });

    it("does not include search parameter when undefined", async () => {
      const capturedUrls: URL[] = [];

      server.use(
        http.get(`${BASE}/master/company/export`, ({ request }) => {
          capturedUrls.push(new URL(request.url));
          return new HttpResponse(
            new Blob(["data"], { type: "application/vnd.ms-excel" }),
            {
              headers: { "Content-Type": "application/vnd.ms-excel" },
            },
          );
        }),
      );

      await companyService.exportCompanies();

      const [capturedUrl] = capturedUrls;
      expect(capturedUrl.searchParams.get("search")).toBeNull();
    });
  });

  describe("downloadImportTemplate()", () => {
    it("downloads import template and returns a Blob", async () => {
      const result = await companyService.downloadImportTemplate();

      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe("application/vnd.ms-excel");
    });
  });

  describe("importCompanies()", () => {
    it("imports companies from Excel file", async () => {
      const file = new File(["excel-data"], "import.xlsx", {
        type: "application/vnd.ms-excel",
      });
      const result = await companyService.importCompanies(file);

      expect(result.status).toBe("SUCCESS");
      expect(result.message).toBe("Import successful");
      expect(result.data?.summary.createdRows).toBe(5);
    });

    it("sends dryRun=true in FormData when specified", async () => {
      const appendSpy = vi.spyOn(FormData.prototype, "append");
      const file = new File(["content"], "items.xlsx", {
        type: "application/vnd.ms-excel",
      });

      await companyService.importCompanies(file, true);

      expect(appendSpy).toHaveBeenCalledWith("dryRun", "true");
      appendSpy.mockRestore();
    });

    it("sends dryRun=false in FormData when explicitly set to false", async () => {
      const appendSpy = vi.spyOn(FormData.prototype, "append");
      const file = new File(["content"], "items.xlsx", {
        type: "application/vnd.ms-excel",
      });

      await companyService.importCompanies(file, false);

      expect(appendSpy).toHaveBeenCalledWith("dryRun", "false");
      appendSpy.mockRestore();
    });

    it("does not include dryRun in FormData when undefined", async () => {
      const appendSpy = vi.spyOn(FormData.prototype, "append");
      const file = new File(["content"], "items.xlsx", {
        type: "application/vnd.ms-excel",
      });

      await companyService.importCompanies(file);

      // Check that dryRun was not appended
      const dryRunCalls = (appendSpy.mock.calls as unknown[][]).filter(
        (call) => call[0] === "dryRun",
      );
      expect(dryRunCalls).toHaveLength(0);
      appendSpy.mockRestore();
    });
  });
});
