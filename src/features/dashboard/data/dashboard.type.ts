export interface Money {
  amount: number;
  currency: "IDR" | "USD";
}

export type WorkflowStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "paid"
  | "overdue"
  | "processing"
  | "posted"
  | "failed"
  | "open"
  | "active";

export interface Payment {
  id: string;
  vendor: string;
  invoice: string;
  dueDate: string;
  amount: number;
  status: WorkflowStatus;
}

export interface Customer {
  id: string;
  name: string;
  outstanding: number;
  overdue: number;
  daysOverdue: number;
}
