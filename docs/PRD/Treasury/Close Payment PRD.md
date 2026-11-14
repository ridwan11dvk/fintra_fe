# Close Payment - Product Requirements Document (PRD)

## 1. Overview

The **Close Payment** feature is a payment monitoring module within the Treasury system. Close payment data originates from external systems (desktop application or collection web portal) and **cannot be created through the frontend**. This module provides capabilities to view, filter, partially edit data, and reset A8 posting status.

---

## 2. Objectives

- Provide a real-time monitoring dashboard for customer close payment data.
- Allow users to view close payment details through a modal view component.
- Allow users to edit specific fields on records that are still unpaid (`payment_status = 0`).
- Provide A8 posting status reset to `0` (Not Generated) for one or multiple records at once (bulk action).
- Provide comprehensive filtering and search capabilities for operational and reconciliation needs.

---

## 3. User Roles & Permissions

| Permission                                       | Description                           |
| ------------------------------------------------ | ------------------------------------- |
| `treasury:incoming-payment:close-payment:list`   | View close payment list and summary   |
| `treasury:incoming-payment:close-payment:read`   | View close payment details            |
| `treasury:incoming-payment:close-payment:update` | Edit data and reset A8 posting status |

> **Note:** `create` and `delete` permissions are **not used** on the frontend since data cannot be added or deleted through the UI.

---

## 4. Database Structure

Refers to the `close_payment` table. Full reference: [Close Payment DB Documentation](../../db/Treasury/Close%20Payment.md)

### Main Columns

| Column                  | Type         | Nullable | Default | Description                                                        |
| ----------------------- | ------------ | -------- | ------- | ------------------------------------------------------------------ |
| `id`                    | BIGSERIAL    | NO       | -       | Auto-increment primary key                                         |
| `cust_id`               | VARCHAR(100) | YES      | -       | Customer ID                                                        |
| `name`                  | VARCHAR(255) | YES      | -       | Customer/recipient name                                            |
| `trans_id`              | VARCHAR(100) | YES      | -       | Transaction ID                                                     |
| `invoice_number`        | VARCHAR(100) | YES      | -       | Invoice number                                                     |
| `ppf_number`            | VARCHAR(100) | YES      | -       | PPF (Proof of Payment File) number                                 |
| `payment_date`          | TIMESTAMP    | YES      | -       | Payment date                                                       |
| `invoice_date`          | TIMESTAMP    | YES      | -       | Invoice date                                                       |
| `print_date`            | TIMESTAMP    | YES      | -       | Document print date                                                |
| `due_date`              | TIMESTAMP    | YES      | -       | Due date                                                           |
| `amount`                | DECIMAL      | YES      | -       | Total invoice amount                                               |
| `payment_amount`        | DECIMAL      | YES      | -       | Actual amount paid                                                 |
| `vat_amount`            | DECIMAL      | YES      | -       | Value Added Tax (VAT) amount                                       |
| `wht_amount`            | DECIMAL      | YES      | -       | Withholding Tax (WHT) amount                                       |
| `bank_code`             | VARCHAR(50)  | YES      | -       | Payment bank code                                                  |
| `bank_account_number`   | VARCHAR(100) | YES      | -       | Bank account number                                                |
| `bank_account_holder`   | VARCHAR(255) | YES      | -       | Bank account holder name                                           |
| `transfer_receipt_path` | TEXT         | YES      | -       | Transfer receipt file path (PDF/image)                             |
| `payment_type`          | VARCHAR(100) | YES      | -       | Payment type                                                       |
| `bank_rule_id`          | INTEGER      | YES      | -       | Access rule ID determining which banks can access this record      |
| `source`                | SMALLINT     | YES      | 0       | Source: 0=Desktop, 1=Collection Web                                |
| `payment_status`        | SMALLINT     | NO       | 0       | Payment status: 0=Unpaid, 1=Paid                                   |
| `posting_a8_status`     | SMALLINT     | NO       | 0       | A8 posting status: 0=Not Generated, 1=Partial, 2=Success, 5=Failed |
| `created_at`            | TIMESTAMP    | NO       | NOW     | Record creation timestamp                                          |
| `updated_at`            | TIMESTAMP    | NO       | NOW     | Last update timestamp                                              |
| `created_by`            | VARCHAR(100) | YES      | -       | User who created the record                                        |
| `updated_by`            | VARCHAR(100) | YES      | -       | User who last modified the record                                  |

### Enumerations

#### Payment Status (`payment_status`)

| Value | Label  | Description                            |
| ----- | ------ | -------------------------------------- |
| 0     | Unpaid | Payment has not been received          |
| 1     | Paid   | Payment has been successfully received |

#### Posting A8 Status (`posting_a8_status`)

| Value | Label         | Description                       |
| ----- | ------------- | --------------------------------- |
| 0     | Not Generated | A8 posting has not been generated |
| 1     | Partial       | A8 posting partially generated    |
| 2     | Success       | A8 posting successfully generated |
| 5     | Failed        | A8 posting generation failed      |

#### Payment Source (`source`)

| Value | Label          | Description                    |
| ----- | -------------- | ------------------------------ |
| 0     | Desktop        | Input from desktop application |
| 1     | Collection Web | Input from web portal          |

---

## 5. Functional Requirements

### 5.1. Close Payment List Page

**Description:** Displays all close payment data in a paginated table.

**Table Columns:**

| No  | Column              | Label             | Sortable | Notes                                                    |
| --- | ------------------- | ----------------- | -------- | -------------------------------------------------------- |
| 1   | `cust_id`           | Customer ID       | Yes      |                                                          |
| 2   | `name`              | Customer Name     | Yes      |                                                          |
| 3   | `invoice_number`    | Invoice No.       | Yes      |                                                          |
| 4   | `trans_id`          | Transaction ID    | Yes      |                                                          |
| 5   | `ppf_number`        | PPF No.           | Yes      |                                                          |
| 6   | `payment_date`      | Payment Date      | Yes      | Format: DD/MM/YYYY                                       |
| 7   | `due_date`          | Due Date          | Yes      | Format: DD/MM/YYYY                                       |
| 8   | `amount`            | Amount            | Yes      | Format: currency (Rp)                                    |
| 9   | `payment_amount`    | Payment Amount    | Yes      | Format: currency (Rp)                                    |
| 10  | `bank_code`         | Bank              | Yes      |                                                          |
| 11  | `payment_status`    | Payment Status    | Yes      | Colored badge/label                                      |
| 12  | `posting_a8_status` | A8 Posting Status | Yes      | Colored badge/label                                      |
| 14  | -                   | Actions           | No       | Buttons: Reset (conditional), Detail, Edit (conditional) |

**Filters & Search:**

| Filter            | Input Type        | Description                                                             |
| ----------------- | ----------------- | ----------------------------------------------------------------------- |
| Search            | Text input        | Search by `cust_id`, `name`, `invoice_number`, `trans_id`, `ppf_number` |
| Payment Status    | Dropdown          | All / Unpaid / Paid                                                     |
| Posting A8 Status | Dropdown          | All / Not Generated / Partial / Success / Failed                        |
| Invoice Date      | Date range picker | Invoice date range                                                      |
| Due Date          | Date range picker | Due date range                                                          |
| Payment Date      | Date range picker | Payment date range                                                      |

**Pagination:**

- Default page size: 10
- Default sort: `updated_at` descending

**API Endpoint:** `GET /api/treasury/close-payment`

---

### 5.2. Close Payment Detail (Modal View)

**Description:** Displays all detail information of a single close payment record in a modal dialog. The modal is **read-only** (view only).

**Information Displayed:**

**Section: Customer Information**

- Customer ID (`cust_id`)
- Customer Name (`name`)

**Section: Transaction References**

- Transaction ID (`trans_id`)
- Invoice No. (`invoice_number`)
- PPF No. (`ppf_number`)

**Section: Dates**

- Invoice Date (`invoice_date`) — format: DD/MM/YYYY HH:mm
- Payment Date (`payment_date`) — format: DD/MM/YYYY HH:mm
- Due Date (`due_date`) — format: DD/MM/YYYY HH:mm
- Print Date (`print_date`) — format: DD/MM/YYYY HH:mm

**Section: Amounts**

- Invoice Amount (`amount`) — format: currency
- Payment Amount (`payment_amount`) — format: currency
- VAT (`vat_amount`) — format: currency
- WHT (`wht_amount`) — format: currency

**Section: Payment Information**

- Bank Code (`bank_code`)
- Account Number (`bank_account_number`)
- Account Holder Name (`bank_account_holder`)
- Payment Type (`payment_type`)
- Bank Rule ID (`bank_rule_id`) — access rule ID that determines which banks can access this record
- Accessible Banks — list of bank codes that have access to this record, resolved from the `bank_access_rule` table (where `rule_id = bank_rule_id`). Displayed as comma-separated bank codes (e.g., "BNI, BRI, MANDIRI"). If `bank_rule_id` is null or no matching access rules exist, display "—".
- Transfer Receipt (`transfer_receipt_path`) — displayed as a clickable link/preview for PDF or image files

**Section: Status**

- Payment Status (`payment_status`) — colored badge
- A8 Posting Status (`posting_a8_status`) — colored badge
- Source (`source`) — Desktop / Collection Web label

**Section: Audit**

- Created By (`created_by`)
- Created At (`created_at`) — format: DD/MM/YYYY HH:mm
- Updated By (`updated_by`)
- Updated At (`updated_at`) — format: DD/MM/YYYY HH:mm

**Trigger:** Click the "Detail" button in the actions column of the list table.

**API Endpoint:** `GET /api/treasury/close-payment/{id}`

---

### 5.3. Edit Close Payment

**Description:** Allows users to edit specific fields on a close payment record.

**Edit Conditions:**

- Data can **only be edited** when `payment_status = 0` (Unpaid).
- When `payment_status = 1` (Paid), the edit button is **disabled**.

**Editable Fields:**

| No  | Field                   | Label            | Input Type      | Validation                                                 |
| --- | ----------------------- | ---------------- | --------------- | ---------------------------------------------------------- |
| 1   | `transfer_receipt_path` | Transfer Receipt | File upload     | Only accepts PDF or image files (jpg, jpeg, png). Max 5MB. |
| 2   | `trans_id`              | Transaction ID   | Text input      | Max 100 characters                                         |
| 3   | `payment_date`          | Payment Date     | Date picker     | ISO datetime format                                        |
| 4   | `bank_code`             | Bank             | Dropdown/Select | Populated from Bank master data                            |
| 5   | `invoice_number`        | Invoice No.      | Text input      | Max 100 characters                                         |
| 6   | `ppf_number`            | PPF No.          | Text input      | Max 100 characters                                         |
| 7   | `bank_rule_id`          | Bank Rule ID     | Number input    | Integer                                                    |

**UI Component:** The edit form can be a modal dialog or inline edit on the detail page.

**Behavior:**

- On successful update, display a success notification and refresh the table data.
- On failure (validation/server error), display the appropriate error message.

**API Endpoint:** `PUT /api/treasury/close-payment/{id}`

---

### 5.4. Reset A8 Posting Status

**Description:** Feature to reset `posting_a8_status` to `0` (Not Generated) for one or multiple records at once.

**Reset Conditions:**

- Reset can **only be performed** on records where `posting_a8_status` is **not** `0` and **not** `2`.
- This means only records with status `1` (Partial) or `5` (Failed) can be reset.
- Records with status `0` (Not Generated) or `2` (Success) **cannot be reset** and must be skipped/disabled.

**UI Behavior:**

1. **Single Reset:**
   - Reset button in the actions column of the table (icon or small button).
   - Button is only active/visible when reset conditions are met.
   - Confirmation dialog before execution: _"Are you sure you want to reset the posting status?"_

2. **Bulk Reset:**
   - Checkbox on each table row for selecting multiple records.
   - "Reset Posting" button above the table (active when eligible selected records exist).
   - Selected records that don't meet the conditions (status `0` or `2`) will be skipped and the user will be informed.
   - Confirmation dialog: _"You are about to reset posting status for {n} records. Continue?"_

**After Reset:**

- Display a notification with a result list showing each record's **name**, **invoice number**, and **reset status** (success/failed).
- Refresh the table data.

**API Response Behavior:**

The API returns a list of reset results. The `status` field in the `ApiResponse` depends on the outcome:

| Scenario                       | `ApiResponse.status` | Description                                  |
| ------------------------------ | -------------------- | -------------------------------------------- |
| All records reset successfully | `SUCCESS`            | All selected records were reset to `0`       |
| All records failed to reset    | `ERROR`              | No records were reset (e.g., all ineligible) |
| Mix of success and failure     | `WARNING`            | Some records reset, some skipped/failed      |

**API Response Example (mix — WARNING):**

```json
{
  "message": "Partial reset: 2 of 3 records reset successfully",
  "status": "WARNING",
  "data": [
    {
      "name": "PT Maju Jaya",
      "invoiceNumber": "INV-2026-001",
      "success": true
    },
    {
      "name": "PT ABC Indonesia",
      "invoiceNumber": "INV-2026-002",
      "success": true
    },
    {
      "name": "CV Mitra Bisnis",
      "invoiceNumber": "INV-2026-003",
      "success": false,
      "reason": "Status is already 'Not Generated'"
    }
  ],
  "errors": null
}
```

**API Response Example (all success — SUCCESS):**

```json
{
  "message": "All 2 records reset successfully",
  "status": "SUCCESS",
  "data": [
    {
      "name": "PT Maju Jaya",
      "invoiceNumber": "INV-2026-001",
      "success": true
    },
    {
      "name": "PT ABC Indonesia",
      "invoiceNumber": "INV-2026-002",
      "success": true
    }
  ],
  "errors": null
}
```

**UI Notification:**

- Show a result dialog/notification listing each record with its reset outcome.
- Use green checkmark (✓) for success and red cross (✗) for failed items.
- Example:

```
Reset Posting A8 Results:
  ✓ PT Maju Jaya (INV-2026-001) — Reset successful
  ✓ PT ABC Indonesia (INV-2026-002) — Reset successful
  ✗ CV Mitra Bisnis (INV-2026-003) — Skipped: status is 'Not Generated'
```

**API Endpoint:** `POST /api/treasury/close-payment/posting-status` with request body containing list of IDs.

---

### 5.5. Summary / Statistics

**Description:** Displays a summary of close payment data at the top of the page (optional, as card/widget).

**Summary Data:**

- Total Unpaid records (`payment_status = 0`)
- Total Paid records (`payment_status = 1`)

**API Endpoint:**

- `GET /api/treasury/close-payment/summary/unpaid-count`
- `GET /api/treasury/close-payment/summary/count-by-status?paymentStatus={status}`

---

## 6. Non-Functional Requirements

| Aspect      | Requirement                                                                               |
| ----------- | ----------------------------------------------------------------------------------------- |
| Performance | List page must load within < 2 seconds for datasets up to 10,000 records with pagination. |
| Security    | All endpoints require JWT authentication and permission-based authorization.              |
| File Upload | Transfer receipt files only accept PDF and images (jpg, jpeg, png) with a maximum of 5MB. |
| Audit Trail | Every data change is recorded in `updated_at` and `updated_by`.                           |
| Responsive  | Page must be responsive for desktop (min. 1280px).                                        |
| Concurrency | Optimistic locking or validation on update to prevent concurrent data conflicts.          |

---

## 7. Business Rules

| No  | Rule                                                                                                                                              |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Close payment data **cannot be created** through the frontend. Data originates from external systems.                                             |
| 2   | Close payment data **cannot be deleted** through the frontend.                                                                                    |
| 3   | Data editing is only allowed when `payment_status = 0` (Unpaid).                                                                                  |
| 4   | Editable fields are limited to: `transfer_receipt_path`, `trans_id`, `payment_date`, `bank_code`, `invoice_number`, `ppf_number`, `bank_rule_id`. |
| 5   | A8 posting reset is only for records with `posting_a8_status = 1` or `posting_a8_status = 5`.                                                     |
| 6   | A8 posting reset changes the `posting_a8_status` value to `0` (Not Generated).                                                                    |
| 7   | Transfer receipt files only accept PDF or image formats (jpg, jpeg, png).                                                                         |
| 8   | Every data change must automatically record `updated_by` and `updated_at`.                                                                        |

---

## 8. API Endpoints Summary

| No  | Method | Endpoint                                              | Description                     | Permission                      |
| --- | ------ | ----------------------------------------------------- | ------------------------------- | ------------------------------- |
| 1   | GET    | `/api/treasury/close-payment`                         | List all data (paginated)       | `treasury:close-payment:list`   |
| 2   | GET    | `/api/treasury/close-payment/{id}`                    | Get detail by ID                | `treasury:close-payment:read`   |
| 3   | PUT    | `/api/treasury/close-payment/{id}`                    | Edit data (if status is unpaid) | `treasury:close-payment:update` |
| 4   | PUT    | `/api/treasury/close-payment/{id}/posting-a8-status`  | Reset/update A8 posting status  | `treasury:close-payment:update` |
| 5   | GET    | `/api/treasury/close-payment/summary/unpaid-count`    | Count of unpaid records         | `treasury:close-payment:list`   |
| 6   | GET    | `/api/treasury/close-payment/summary/count-by-status` | Count of records per status     | `treasury:close-payment:list`   |

> **Not used on frontend:** `POST` (create) and `DELETE` (delete).

---

## 9. Acceptance Criteria

### AC-1: List Close Payment

- [ ] User can view close payment list in a paginated table (default 10 per page).
- [ ] Data is sorted by `updated_at` descending by default.
- [ ] User can search by customer ID, name, invoice number, transaction ID, or PPF number.
- [ ] User can filter by payment status, posting status, and date ranges.
- [ ] Displayed columns match the specification in section 5.1.

### AC-2: Close Payment Detail

- [ ] User can click the "Detail" button to open the detail view modal.
- [ ] Modal displays all information as specified in section 5.2.
- [ ] Modal is read-only with no form inputs.
- [ ] If a transfer receipt exists, it is displayed as a clickable link/preview.

### AC-3: Edit Close Payment

- [ ] Edit button is only visible/active when `payment_status = 0`.
- [ ] When `payment_status = 1`, the edit button is hidden or disabled.
- [ ] User can only edit fields: `transfer_receipt_path`, `trans_id`, `payment_date`, `bank_code`, `invoice_number`, `ppf_number`, `bank_rule_id`.
- [ ] Transfer receipt upload only accepts PDF or image files (jpg, jpeg, png) with a maximum size of 5MB.
- [ ] After a successful edit, the table data is refreshed and a success notification is displayed.

### AC-4: Reset A8 Posting Status

- [ ] User can reset A8 posting status to `0` for a single record (single action).
- [ ] User can reset A8 posting status to `0` for multiple records at once (bulk action via checkbox).
- [ ] Reset only applies to records with `posting_a8_status = 1` or `posting_a8_status = 5`.
- [ ] Records with `posting_a8_status = 0` or `posting_a8_status = 2` cannot be reset (disabled/skipped).
- [ ] A confirmation dialog is displayed before executing the reset.
- [ ] After a successful reset, the table data is refreshed and a success notification is displayed.

### AC-5: Summary

- [ ] Summary cards/widgets display the count of unpaid and paid records.
- [ ] Summary data is updated after any data changes.

### AC-6: Security & Permissions

- [ ] All endpoints require JWT authentication.
- [ ] Users without the appropriate permissions cannot access the feature.
- [ ] No create or delete endpoints are accessible from the frontend.

---

## 10. Out of Scope

- Creating close payment data through the frontend (data originates from external systems).
- Deleting close payment data through the frontend.
- Data export to Excel/PDF (can be developed in a future phase).
- Email/push notifications for status changes.
- Direct integration with the A8 system for posting generation.
