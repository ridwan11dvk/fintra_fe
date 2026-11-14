import { accessRequestHandlers } from "@tests/unit/features/access-request/data/access-request.handlers";
import { approvalWorkflowHandlers } from "@tests/unit/features/master-data/approval-workflow/data/approval-workflow.handlers";
import { bankHandlers } from "@tests/unit/features/master-data/bank/data/bank.handlers";
import { partnerClassificationHandlers } from "@tests/unit/features/master-data/partner-classification/data/partner-classification.handlers";
import { businessAreaHandlers } from "@tests/unit/features/master-data/business-area/data/business-area.handlers";
import { companyHandlers } from "@tests/unit/features/master-data/company/data/company.handlers";
import { companyTaxHandlers } from "@tests/unit/features/master-data/company-tax/data/company-tax.handlers";
import { cashflowCategoryHandlers } from "@tests/unit/features/master-data/cashflow-category/data/cashflow-category.handlers";
import { cashflowGroupHandlers } from "@tests/unit/features/master-data/cashflow-group/data/cashflow-group.handlers";
import { chartOfAccountHandlers } from "@tests/unit/features/master-data/chart-of-account/data/chart-of-account.handlers";
import { costCenterHandlers } from "@tests/unit/features/master-data/cost-center/data/cost-center.handlers";
import { countryHandlers } from "@tests/unit/features/master-data/country/data/country.handlers";
import { currencyHandlers } from "@tests/unit/features/master-data/currency/data/currency.handlers";
import { currencyRateHandlers } from "@tests/unit/features/master-data/currency-rate/data/currency-rate.handlers";
import { customsOfficeHandlers } from "@tests/unit/features/master-data/customs-office/data/customs-office.handlers";
import { disputeWorkflowHandlers } from "@tests/unit/features/master-data/dispute-workflow/data/dispute-workflow.handlers";
import { districtHandlers } from "@tests/unit/features/master-data/district/data/district.handlers";
import { documentNameHandlers } from "@tests/unit/features/master-data/document-name/data/document-name.handlers";
import { glAccountHandlers } from "@tests/unit/features/master-data/general-ledger-account/data/gl-account.handlers";
import { houseBankHandlers } from "@tests/unit/features/master-data/house-bank/data/house-bank.handlers";
import { partnerCategoryHandlers } from "@tests/unit/features/master-data/partner-category/data/partner-category.handlers";
import { partnerDocRefHandlers } from "@tests/unit/features/master-data/partner-doc-ref/data/partner-doc-ref.handlers";
import { partnerTypeHandlers } from "@tests/unit/features/master-data/partner-type/data/partner-type.handlers";
import { partnerHandlers } from "@tests/unit/features/master-data/partner/data/partner.handlers";
import { portHandlers } from "@tests/unit/features/master-data/port/data/port.handlers";
import { provinceHandlers } from "@tests/unit/features/master-data/province/data/province.handlers";
import { regencyHandlers } from "@tests/unit/features/master-data/regency/data/regency.handlers";
import { rejectCategoryHandlers } from "@tests/unit/features/master-data/reject-category/data/reject-category.handlers";
import { taxableItemHandlers } from "@tests/unit/features/master-data/taxable-item/data/taxable-item.handlers";
import { taxRateHandlers } from "@tests/unit/features/master-data/tax-rate/data/tax-rate.handlers";
import { termOfPaymentHandlers } from "@tests/unit/features/master-data/term-of-payment/data/term-of-payment.handlers";
import { transactionCategoryHandlers } from "@tests/unit/features/master-data/transaction-category/data/transaction-category.handlers";
import { transactionTypeHandlers } from "@tests/unit/features/master-data/transaction-type/data/transaction-type.handlers";
import { uomHandlers } from "@tests/unit/features/master-data/unit-of-measure/data/uom.handlers";
import { villageHandlers } from "@tests/unit/features/master-data/village/data/village.handlers";
import { workCatalogHandlers } from "@tests/unit/features/master-data/work-catalog/data/work-catalog.handlers";
import { notificationHandlers } from "@tests/unit/features/notification/data/notification.handlers";
import { depositHandlers } from "@tests/unit/features/treasury/open-payment/data/deposit.handlers";
import { digitalVaultHandlers } from "@tests/unit/features/treasury/digital-vault/data/digital-vault.handlers";
import { postingAssetHandlers } from "@tests/unit/features/monitoring/posting-asset/data/posting-asset.handlers";
import { postingAutoLegacyHandlers } from "@tests/unit/features/monitoring/posting-auto-legacy/data/posting-auto-legacy.handlers";
import { postingAssetLegacyHandlers } from "@tests/unit/features/monitoring/posting-asset-legacy/data/posting-asset-legacy.handlers";
import { roleHandlers } from "@tests/unit/features/settings/role/data/role.handlers";
import { rolePositionHandlers } from "@tests/unit/features/settings/role-position/data/role-position.handlers";
import { menuManagementHandlers } from "@tests/unit/features/settings/menu-management/data/menu-management.handlers";
import { m2mClientHandlers } from "@tests/unit/features/settings/m2m-client/data/m2m-client.handlers";
import { userHandlers } from "@tests/unit/features/settings/users/data/user.handlers";

export const handlers = [
  ...accessRequestHandlers,
  ...approvalWorkflowHandlers,
  ...bankHandlers,
  ...businessAreaHandlers,
  ...companyHandlers,
  ...companyTaxHandlers,
  ...cashflowCategoryHandlers,
  ...cashflowGroupHandlers,
  ...chartOfAccountHandlers,
  ...costCenterHandlers,
  ...countryHandlers,
  ...currencyHandlers,
  ...currencyRateHandlers,
  ...customsOfficeHandlers,
  ...disputeWorkflowHandlers,
  ...districtHandlers,
  ...documentNameHandlers,
  ...glAccountHandlers,
  ...houseBankHandlers,
  ...partnerCategoryHandlers,
  ...partnerClassificationHandlers,
  ...partnerDocRefHandlers,
  ...partnerTypeHandlers,
  ...partnerHandlers,
  ...portHandlers,
  ...provinceHandlers,
  ...regencyHandlers,
  ...rejectCategoryHandlers,
  ...taxableItemHandlers,
  ...taxRateHandlers,
  ...termOfPaymentHandlers,
  ...transactionCategoryHandlers,
  ...transactionTypeHandlers,
  ...uomHandlers,
  ...villageHandlers,
  ...workCatalogHandlers,
  ...postingAssetHandlers,
  ...postingAutoLegacyHandlers,
  ...postingAssetLegacyHandlers,
  ...notificationHandlers,
  ...digitalVaultHandlers,
  ...depositHandlers,
  ...roleHandlers,
  ...rolePositionHandlers,
  ...menuManagementHandlers,
  ...m2mClientHandlers,
  ...userHandlers,
];
