export interface ComplianceFsscItem {
  id: string;
  name: string;
  description: string;
}

export interface FinancialControlValidationItem {
  id: string;
  title: string;
  subTitle: string;
}

export interface SetupConfigurationResponse {
  complianceFssc: ComplianceFsscItem[];
  financialControlValidation: FinancialControlValidationItem[];
}

export interface SaveComplianceFsscRequest {
  items: ComplianceFsscItem[];
}

export interface SaveFinancialControlValidationRequest {
  items: FinancialControlValidationItem[];
}

