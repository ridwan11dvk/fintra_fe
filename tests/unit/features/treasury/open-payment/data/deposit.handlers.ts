import type { DepositResponse, DepositSummary, CountByStatusResponse } from "@/features/treasury";
import { http, HttpResponse } from "msw";

export const mockDeposits: DepositResponse[] = [
  {
    id: 1,
    agentCode: "AGT001",
    virtualAccount: "1234567890",
    name: "John Doe",
    referenceNumber: "REF-001",
    depositDate: "2025-06-15T10:00:00Z",
    openingBalance: 5000000,
    amount: 1000000,
    closingBalance: 6000000,
    bankCode: "BANK01",
    documentPath: "/documents/ref-001.pdf",
    sendStatus: 0,
    createdAt: "2025-06-15T10:00:00Z",
    updatedAt: "2025-06-15T10:00:00Z",
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    id: 2,
    agentCode: "AGT002",
    virtualAccount: "0987654321",
    name: "Jane Smith",
    referenceNumber: "REF-002",
    depositDate: "2025-06-16T10:00:00Z",
    openingBalance: 10000000,
    amount: 2000000,
    closingBalance: 12000000,
    bankCode: "BANK02",
    documentPath: undefined,
    sendStatus: 1,
    createdAt: "2025-06-16T10:00:00Z",
    updatedAt: "2025-06-16T12:00:00Z",
    createdBy: "admin",
    updatedBy: "admin",
  },
];

export const mockDepositSummary: DepositSummary = {
  totalDeposits: 2,
  totalNotSent: 1,
  totalSent: 1,
  totalAmount: 3000000,
};

export const mockCountByStatus: CountByStatusResponse = {
  notSent: 1,
  sent: 1,
};

export const depositHandlers = [
  // GET /treasury/deposit - list deposits
  http.get("*/treasury/deposit", () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Deposits retrieved successfully",
      data: {
        content: mockDeposits,
        totalElements: mockDeposits.length,
        totalPages: 1,
        size: 10,
        number: 0,
      },
    });
  }),

  // GET /treasury/deposit/:id
  http.get("*/treasury/deposit/:id", ({ params }) => {
    const { id } = params;
    const deposit = mockDeposits.find((d) => d.id === Number(id));
    if (!deposit) {
      return HttpResponse.json(
        { status: "ERROR", message: "Deposit not found", data: null },
        { status: 404 },
      );
    }
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Deposit retrieved successfully",
      data: deposit,
    });
  }),

  // PUT /treasury/deposit/:id (FormData)
  http.put("*/treasury/deposit/:id", async ({ params, request }) => {
    const { id } = params;
    const deposit = mockDeposits.find((d) => d.id === Number(id));
    if (!deposit) {
      return HttpResponse.json(
        { status: "ERROR", message: "Deposit not found", data: null },
        { status: 404 },
      );
    }

    const formData = await request.formData();
    const updates: Partial<DepositResponse> = {};

    const agentCode = formData.get("agentCode");
    if (agentCode) updates.agentCode = String(agentCode);
    const virtualAccount = formData.get("virtualAccount");
    if (virtualAccount) updates.virtualAccount = String(virtualAccount);
    const name = formData.get("name");
    if (name) updates.name = String(name);
    const referenceNumber = formData.get("referenceNumber");
    if (referenceNumber) updates.referenceNumber = String(referenceNumber);
    const depositDate = formData.get("depositDate");
    if (depositDate) updates.depositDate = String(depositDate);
    const openingBalance = formData.get("openingBalance");
    if (openingBalance) updates.openingBalance = Number(openingBalance);
    const amount = formData.get("amount");
    if (amount) updates.amount = Number(amount);
    const closingBalance = formData.get("closingBalance");
    if (closingBalance) updates.closingBalance = Number(closingBalance);
    const bankCode = formData.get("bankCode");
    if (bankCode) updates.bankCode = String(bankCode);
    const documentPath = formData.get("documentPath");
    if (documentPath) updates.documentPath = String(documentPath);

    return HttpResponse.json({
      status: "SUCCESS",
      message: "Deposit updated successfully",
      data: { ...deposit, ...updates, updatedAt: new Date().toISOString() },
    });
  }),

  // PUT /treasury/deposit/:id/send-status
  http.put("*/treasury/deposit/:id/send-status", ({ params, request }) => {
    const { id } = params;
    const url = new URL(request.url);
    const sendStatus = Number(url.searchParams.get("sendStatus")) as 0 | 1;
    const deposit = mockDeposits.find((d) => d.id === Number(id));
    if (!deposit) {
      return HttpResponse.json(
        { status: "ERROR", message: "Deposit not found", data: null },
        { status: 404 },
      );
    }
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Send status updated successfully",
      data: { ...deposit, sendStatus, updatedAt: new Date().toISOString() },
    });
  }),

  // PUT /treasury/deposit/send-status/bulk
  http.put("*/treasury/deposit/send-status/bulk", () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Send status updated successfully",
      data: { message: "Bulk update completed" },
    });
  }),

  // GET /treasury/deposit/summary/stats
  http.get("*/treasury/deposit/summary/stats", () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Summary retrieved successfully",
      data: mockDepositSummary,
    });
  }),

  // GET /treasury/deposit/summary/count-by-status
  http.get("*/treasury/deposit/summary/count-by-status", () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Count by status retrieved successfully",
      data: mockCountByStatus,
    });
  }),
];
