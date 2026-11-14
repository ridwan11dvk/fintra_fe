import { describe, expect, it } from "vitest";
import { partnerService } from "@/features/master-data/partner/data/partner.service";

const BASE = "http://localhost:3000";

describe("partnerService", () => {
  describe("listPartners", () => {
    it("fetches partners list successfully", async () => {
      const result = await partnerService.listPartners();
      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data!.content[0].partnerCode).toBe("TST-001");
    });

    it("forwards pagination params", async () => {
      const result = await partnerService.listPartners({
        page: 1,
        size: 10,
        search: "test",
      });
      expect(result.status).toBe("SUCCESS");
    });

    it("forwards status filter", async () => {
      const result = await partnerService.listPartners({
        page: 1,
        size: 10,
        status: "ACTIVE",
      });
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("getPartnerById", () => {
    it("fetches a specific partner by ID", async () => {
      const result = await partnerService.getPartnerById(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.name).toBe("PT. Test Partner");
    });
  });

  describe("createPartner", () => {
    it("creates a partner successfully", async () => {
      const result = await partnerService.createPartner({
        name: "New Partner",
        partnerCode: "NEW-001",
        status: "ACTIVE",
      });
      expect(result.status).toBe("SUCCESS");
      expect(result.data?.partnerCode).toBe("TST-001");
    });
  });

  describe("updatePartner", () => {
    it("updates a partner successfully", async () => {
      const result = await partnerService.updatePartner(1, {
        name: "Updated Partner",
        status: "ACTIVE",
      });
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deletePartner", () => {
    it("deletes a partner successfully", async () => {
      const result = await partnerService.deletePartner(1);
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("listPartnerDocuments", () => {
    it("fetches partner documents list successfully", async () => {
      const result = await partnerService.listPartnerDocuments(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data!.content[0].documentName).toBe("Test Document");
    });

    it("forwards params for document list", async () => {
      const result = await partnerService.listPartnerDocuments(1, {
        page: 1, size: 10, search: "test",
      });
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("uploadPartnerDocument", () => {
    it("uploads a partner document successfully", async () => {
      const result = await partnerService.uploadPartnerDocument(1, {
        documentName: "New Document",
        isActive: true,
      });
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("updatePartnerDocument", () => {
    it("updates a partner document successfully", async () => {
      const result = await partnerService.updatePartnerDocument(1, 1, {
        documentName: "Updated Document",
      });
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deletePartnerDocument", () => {
    it("deletes a partner document successfully", async () => {
      const result = await partnerService.deletePartnerDocument(1, 1);
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("listPartnerContacts", () => {
    it("fetches partner contacts list successfully", async () => {
      const result = await partnerService.listPartnerContacts(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data!.content[0].name).toBe("Jane Doe");
    });

    it("forwards params for contact list", async () => {
      const result = await partnerService.listPartnerContacts(1, {
        page: 1, size: 10, search: "jane",
      });
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("getPartnerContactsList", () => {
    it("fetches all contacts of a partner as a plain list", async () => {
      const result = await partnerService.getPartnerContactsList(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(1);
      expect(result.data![0].name).toBe("Jane Doe");
    });
  });

  describe("createPartnerContact", () => {
    it("creates a partner contact successfully", async () => {
      const result = await partnerService.createPartnerContact({
        partnerId: 1,
        name: "New Contact",
      });
      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
    });
  });

  describe("updatePartnerContact", () => {
    it("updates a partner contact successfully", async () => {
      const result = await partnerService.updatePartnerContact(1, {
        name: "Updated Contact",
      });
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deletePartnerContact", () => {
    it("deletes a partner contact successfully", async () => {
      const result = await partnerService.deletePartnerContact(1);
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("listPartnerTaxes", () => {
    it("fetches partner taxes list successfully", async () => {
      const result = await partnerService.listPartnerTaxes(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data!.content[0].taxRateId).toBe(1);
    });

    it("forwards params for tax list", async () => {
      const result = await partnerService.listPartnerTaxes(1, {
        page: 1, size: 10, search: "tax",
      });
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("createPartnerTax", () => {
    it("creates a partner tax successfully", async () => {
      const result = await partnerService.createPartnerTax(1, {
        taxRateId: 1,
        active: true,
      });
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("updatePartnerTax", () => {
    it("updates a partner tax successfully", async () => {
      const result = await partnerService.updatePartnerTax(1, 1, {
        active: false,
      });
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deletePartnerTax", () => {
    it("deletes a partner tax successfully", async () => {
      const result = await partnerService.deletePartnerTax(1);
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("getPartnerTaxProfile", () => {
    it("fetches the tax profile of a partner", async () => {
      const result = await partnerService.getPartnerTaxProfile(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
      expect(result.data?.npwpNumber).toBe("1234567890123456");
    });
  });

  describe("getFilteredDocRef", () => {
    it("fetches filtered doc references successfully", async () => {
      const result = await partnerService.getFilteredDocRef("COMP01");
      expect(result.status).toBe("SUCCESS");
    });

    it("forwards optional params for doc ref filter", async () => {
      const result = await partnerService.getFilteredDocRef(
        "COMP01",
        1,
        2,
        3,
        4,
      );
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("listPartnerBankAccounts", () => {
    it("fetches partner bank accounts list successfully", async () => {
      const result = await partnerService.listPartnerBankAccounts(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data!.content[0].accountNumber).toBe("1234567890");
    });

    it("forwards params for bank account list", async () => {
      const result = await partnerService.listPartnerBankAccounts(1, {
        page: 1, size: 10, search: "BCA",
        companyCode: "COMP01",
        verificationStatus: "VERIFIED",
      });
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("getPartnerBankAccountsList", () => {
    it("fetches all bank accounts of a partner as a plain list", async () => {
      const result = await partnerService.getPartnerBankAccountsList(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(1);
      expect(result.data![0].accountNumber).toBe("1234567890");
    });
  });

  describe("createPartnerBankAccount", () => {
    it("creates a partner bank account successfully", async () => {
      const result = await partnerService.createPartnerBankAccount({
        accountNumber: "9876543210",
        holderName: "New Holder",
        active: true,
      });
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("updatePartnerBankAccount", () => {
    it("updates a partner bank account successfully", async () => {
      const result = await partnerService.updatePartnerBankAccount(1, {
        holderName: "Updated Holder",
      });
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deletePartnerBankAccount", () => {
    it("deletes a partner bank account successfully", async () => {
      const result = await partnerService.deletePartnerBankAccount(1);
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("listPartnerVirtualAccounts", () => {
    it("fetches partner virtual accounts list successfully", async () => {
      const result = await partnerService.listPartnerVirtualAccounts(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data!.content[0].number).toBe("1234567890");
    });

    it("forwards params for virtual account list", async () => {
      const result = await partnerService.listPartnerVirtualAccounts(1, {
        page: 1, size: 10, search: "BCA",
        bankCode: "BCA",
        companyCode: "COMP01",
      });
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("getPartnerVirtualAccountsList", () => {
    it("fetches all virtual accounts of a partner as a plain list", async () => {
      const result = await partnerService.getPartnerVirtualAccountsList(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data).toHaveLength(1);
      expect(result.data![0].number).toBe("1234567890");
    });
  });

  describe("createPartnerVirtualAccount", () => {
    it("creates a partner virtual account successfully", async () => {
      const result = await partnerService.createPartnerVirtualAccount({
        number: "9876543210",
        holder: "New Holder",
        active: true,
      });
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("updatePartnerVirtualAccount", () => {
    it("updates a partner virtual account successfully", async () => {
      const result = await partnerService.updatePartnerVirtualAccount(1, {
        holder: "Updated Holder",
      });
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deletePartnerVirtualAccount", () => {
    it("deletes a partner virtual account successfully", async () => {
      const result = await partnerService.deletePartnerVirtualAccount(1);
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("listPartnerErpCodes", () => {
    it("fetches partner ERP codes list successfully", async () => {
      const result = await partnerService.listPartnerErpCodes(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toHaveLength(1);
      expect(result.data!.content[0].erpCode).toBe("ERP-001");
    });

    it("forwards params for ERP code list", async () => {
      const result = await partnerService.listPartnerErpCodes(1, {
        page: 1, size: 10, search: "ERP",
      });
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("getPartnerErpCodeById", () => {
    it("fetches a specific ERP code by ID", async () => {
      const result = await partnerService.getPartnerErpCodeById(1, 1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
    });
  });

  describe("createPartnerErpCode", () => {
    it("creates a partner ERP code successfully", async () => {
      const result = await partnerService.createPartnerErpCode(1, {
        erpCode: "NEW-ERP-001",
        isActive: true,
      });
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("updatePartnerErpCode", () => {
    it("updates a partner ERP code successfully", async () => {
      const result = await partnerService.updatePartnerErpCode(1, 1, {
        erpCode: "UPDATED-ERP-001",
      });
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deletePartnerErpCode", () => {
    it("deletes a partner ERP code successfully", async () => {
      const result = await partnerService.deletePartnerErpCode(1, 1);
      expect(result.status).toBe("SUCCESS");
    });
  });
});

describe("partnerService base URL", () => {
  it("uses the correct base URL", () => {
    expect(BASE).toBe("http://localhost:3000");
  });
});
