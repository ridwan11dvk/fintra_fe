import type {
  VaultStationClosureDetail,
  VaultStationSummary,
  VaultStationSummaryTotal,
  VaultTransactionDetail,
  VaultTransactionItem,
} from "@/features/treasury";
import { http, HttpResponse } from "msw";

export const mockStationSummaryList: VaultStationSummary[] = [
  {
    stationName: "Station A",
    companyCode: "C001",
    closureCount: 5,
    totalClosureAmount: 50000000,
    totalDepositAmount: 45000000,
  },
  {
    stationName: "Station B",
    companyCode: "C002",
    closureCount: 3,
    totalClosureAmount: 30000000,
    totalDepositAmount: 28000000,
  },
];

export const mockStationSummaryTotal: VaultStationSummaryTotal = {
  totalAllClosureAmount: 80000000,
  totalAllDepositAmount: 73000000,
};

export const mockClosureDetailList: VaultStationClosureDetail[] = [
  {
    id: 1,
    virtualAccountNumber: "1234567890",
    stationName: "Station A",
    companyCode: "C001",
    closureNumber: "CL-001",
    closureDate: "2025-06-15",
    depositDate: "2025-06-15T10:00:00Z",
    closureAmount: 10000000,
    totalDepositAmount: 9000000,
    bankCode: "BANK01",
    billingType: "CREDIT",
    paymentStatus: 1,
    postingA8Status: 2,
  },
  {
    id: 2,
    virtualAccountNumber: "0987654321",
    stationName: "Station A",
    companyCode: "C001",
    closureNumber: "CL-002",
    closureDate: "2025-06-16",
    depositDate: null,
    closureAmount: 15000000,
    totalDepositAmount: 0,
    bankCode: "BANK01",
    billingType: "-",
    paymentStatus: 0,
    postingA8Status: null,
  },
];

export const mockTransactions: VaultTransactionItem[] = [
  {
    id: 101,
    depositDate: "2025-06-15T09:00:00Z",
    depositAmount: 5000000,
    billingType: "CREDIT",
    transactionId: "TXN-001",
    machineCode: "MCH-001",
    machineName: "Machine A",
  },
  {
    id: 102,
    depositDate: "2025-06-15T08:00:00Z",
    depositAmount: 4000000,
    billingType: "DEPOSIT",
    transactionId: "TXN-002",
    machineCode: "MCH-001",
    machineName: "Machine A",
  },
];

export const mockTransactionDetail: VaultTransactionDetail = {
  id: 1,
  virtualAccountNumber: "1234567890",
  stationName: "Station A",
  companyCode: "C001",
  closureNumber: "CL-001",
  closureDate: "2025-06-15",
  closureAmount: 10000000,
  depositType: 1,
  latestBillingType: "CREDIT",
  latestDepositDate: "2025-06-15T10:00:00Z",
  totalDepositAmount: 9000000,
  bankCode: "BANK01",
  paymentStatus: 1,
  postingA8Status: 2,
  depositDetails: mockTransactions,
};

export const digitalVaultHandlers = [
  // GET /treasury/digital-vault - station summary list
  http.get("*/treasury/digital-vault", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search");
    let filtered = [...mockStationSummaryList];
    if (search) {
      filtered = filtered.filter((s) =>
        s.stationName.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Station summary retrieved successfully",
      data: {
        content: filtered,
        totalElements: filtered.length,
        totalPages: 1,
        size: 10,
        number: 0,
      },
    });
  }),

  // GET /treasury/digital-vault/total - total summary
  http.get("*/treasury/digital-vault/total", () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Total summary retrieved successfully",
      data: mockStationSummaryTotal,
    });
  }),

  // GET /treasury/digital-vault/:stationName/closures - closure detail list
  http.get("*/treasury/digital-vault/:stationName/closures", ({ params, request }) => {
    const { stationName } = params;
    const url = new URL(request.url);
    const search = url.searchParams.get("search");
    let filtered = mockClosureDetailList.filter(
      (c) => c.stationName === stationName,
    );
    if (search) {
      filtered = filtered.filter(
        (c) =>
          c.closureNumber.toLowerCase().includes(search.toLowerCase()) ||
          c.virtualAccountNumber.includes(search),
      );
    }
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Closure detail retrieved successfully",
      data: {
        content: filtered,
        totalElements: filtered.length,
        totalPages: 1,
        size: 10,
        number: 0,
      },
    });
  }),

  // GET /treasury/digital-vault/transactions/:id - transaction detail
  http.get("*/treasury/digital-vault/transactions/:id", ({ params }) => {
    const { id } = params;
    if (Number(id) !== mockTransactionDetail.id) {
      return HttpResponse.json(
        { status: "ERROR", message: "Transaction not found", data: null },
        { status: 404 },
      );
    }
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Transaction detail retrieved successfully",
      data: mockTransactionDetail,
    });
  }),
];
