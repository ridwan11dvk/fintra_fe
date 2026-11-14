export type ChequeRegisterStatus = "OPEN" | "BOOKED" | "CANCEL" | "RELEASE";
export type ChequeRegisterAddStatus = Exclude<ChequeRegisterStatus, "RELEASE">;

export interface ChequeRegisterRecord {
  id: string;
  houseBankId: string;
  houseBankName: string;
  houseBankInstitutionName?: string;
  houseBankAccountNumber?: string;
  houseBankAccountName?: string;
  chequeNumber: string;
  status: ChequeRegisterStatus;
  releaseDate: string;
  isActive: boolean;
}

export interface ChequeRegisterInput {
  houseBankId: string;
  chequeNumber: string;
  status: ChequeRegisterStatus;
  releaseDate: string;
  isActive: boolean;
}

export interface ChequeRegisterHouseBankOption {
  id: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface ChequeRegisterListParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface ChequeRegisterListResult {
  items: ChequeRegisterRecord[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
