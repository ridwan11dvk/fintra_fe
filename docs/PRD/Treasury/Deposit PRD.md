# Deposit - Product Requirements Document (PRD)

## 1. Overview

The **Deposit** feature is a deposit transaction monitoring module within the Treasury system. Deposit data originates from external systems and **cannot be created through the frontend**. This module provides capabilities to view, filter, edit data, and manage transmission status for Virtual Account (VA) fund deposits.

---

## 2. Objectives

- Provide a real-time monitoring dashboard for agent deposit transactions.
- Allow users to view deposit details through a modal view component.
- Allow users to edit specific fields on deposit records.
- Provide transmission status management for deposit records (mark as sent/not sent).
- Provide comprehensive filtering and search capabilities for operational and reconciliation needs.

---

## 3. User Roles & Permissions

| Permission                                              | Description                      |
| ------------------------------------------------------- | -------------------------------- |
| `treasury:incoming-payment:open-payment:deposit:list`   | View deposit list and summary    |
| `treasury:incoming-payment:open-payment:deposit:read`   | View deposit details             |
| `treasury:incoming-payment:open-payment:deposit:update` | Edit data and update send status |

> **Note:** `create` and `delete` permissions are **not used** on the frontend since data cannot be added or deleted through the UI.

---

## 4. Database Structure

Refers to the `deposit` table. Full reference: [Deposit DB Documentation](../../db/Treasury/Deposit.md)

### Main Columns

| Column             | Type          | Nullable | Default | Description                                  |
| ------------------ | ------------- | -------- | ------- | -------------------------------------------- |
| `id`               | BIGSERIAL     | NO       | -       | Auto-increment primary key                   |
| `agent_code`       | VARCHAR(20)   | YES      | -       | Agent/terminal identifier code               |
| `virtual_account`  | VARCHAR(18)   | YES      | -       | Virtual Account number for deposit (VA)      |
| `name`             | VARCHAR(255)  | YES      | -       | Name of agent or account holder              |
| `reference_number` | VARCHAR(255)  | YES      | -       | Reference number for the deposit transaction |
| `deposit_date`     | TIMESTAMP     | YES      | -       | Date and time when deposit was made/recorded |
| `opening_balance`  | DECIMAL(20,2) | YES      | -       | Account balance before deposit               |
| `amount`           | DECIMAL(20,2) | YES      | -       | Deposit amount                               |
| `closing_balance`  | DECIMAL(20,2) | YES      | -       | Account balance after deposit                |
| `bank_code`        | VARCHAR(20)   | YES      | -       | Code of bank used for deposit                |
| `send_status`      | SMALLINT      | NO       | 0       | Transmission status: 0=Not Sent, 1=Sent      |
| `created_at`       | TIMESTAMP     | NO       | NOW     | Record creation timestamp                    |
| `updated_at`       | TIMESTAMP     | NO       | NOW     | Last update timestamp                        |
| `created_by`       | VARCHAR(100)  | YES      | -       | User who created the record                  |
| `updated_by`       | VARCHAR(100)  | YES      | -       | User who last modified the record            |

### Enumerations

#### Send Status (`send_status`)

| Value | Label    | Description                               |
| ----- | -------- | ----------------------------------------- |
| 0     | Not Sent | Deposit not yet transmitted to system     |
| 1     | Sent     | Deposit successfully transmitted/recorded |

---

## 5. Functional Requirements

### 5.1. Deposit List Page

**Description:** Displays all deposit data in a paginated table.

**Table Columns:**

| No  | Column             | Label           | Sortable | Notes                         |
| --- | ------------------ | --------------- | -------- | ----------------------------- |
| 1   | `agent_code`       | Agent Code      | Yes      |                               |
| 2   | `virtual_account`  | Virtual Account | Yes      |                               |
| 3   | `name`             | Name            | Yes      |                               |
| 4   | `reference_number` | Reference No.   | Yes      |                               |
| 5   | `deposit_date`     | Deposit Date    | Yes      | Format: DD/MM/YYYY            |
| 6   | `amount`           | Amount          | Yes      | Format: currency (Rp)         |
| 7   | `opening_balance`  | Opening Balance | Yes      | Format: currency (Rp)         |
| 8   | `closing_balance`  | Closing Balance | Yes      | Format: currency (Rp)         |
| 9   | `bank_code`        | Bank            | Yes      |                               |
| 10  | `send_status`      | Send Status     | Yes      | Colored badge/label           |
| 11  | -                  | Actions         | No       | Buttons: Resend, Detail, Edit |

**Filters & Search:**

| Filter       | Input Type        | Description                                                           |
| ------------ | ----------------- | --------------------------------------------------------------------- |
| Search       | Text input        | Search by `agent_code`, `name`, `virtual_account`, `reference_number` |
| Agent Code   | Dropdown          | Filter by specific agent                                              |
| Bank         | Dropdown          | Filter by bank code                                                   |
| Send Status  | Dropdown          | All / Not Sent / Sent                                                 |
| Deposit Date | Date range picker | Deposit date range                                                    |

**Pagination:**

- Default page size: 10
- Default sort: `deposit_date` descending

**API Endpoint:** `GET /api/treasury/deposit`

---

### 5.2. Deposit Detail (Modal View)

**Description:** Displays all detail information of a single deposit record in a modal dialog. The modal is **read-only** (view only).

**Information Displayed:**

**Section: Agent Information**

- Agent Code (`agent_code`)
- Name (`name`)
- Virtual Account (`virtual_account`)
- Reference Number (`reference_number`)

**Section: Deposit Details**

- Deposit Date (`deposit_date`) — format: DD/MM/YYYY HH:mm
- Opening Balance (`opening_balance`) — format: currency
- Deposit Amount (`amount`) — format: currency
- Closing Balance (`closing_balance`) — format: currency

**Section: Bank Information**

- Bank Code (`bank_code`)

**Section: Status**

- Send Status (`send_status`) — colored badge

**Section: Audit**

- Created By (`created_by`)
- Created At (`created_at`) — format: DD/MM/YYYY HH:mm
- Updated By (`updated_by`)
- Updated At (`updated_at`) — format: DD/MM/YYYY HH:mm

**Trigger:** Click the "Detail" button in the actions column of the list table.

**API Endpoint:** `GET /api/treasury/deposit/{id}`

---

### 5.3. Edit Deposit

**Description:** Allows users to edit specific fields on a deposit record.

**Editable Fields:**

| No  | Field              | Label           | Input Type      | Validation                                                 |
| --- | ------------------ | --------------- | --------------- | ---------------------------------------------------------- |
| 1   | `agent_code`       | Agent Code      | Text input      | Max 20 characters                                          |
| 2   | `virtual_account`  | Virtual Account | Text input      | Max 18 characters                                          |
| 3   | `name`             | Name            | Text input      | Max 255 characters                                         |
| 4   | `reference_number` | Reference No.   | Text input      | Max 255 characters                                         |
| 5   | `deposit_date`     | Deposit Date    | Date picker     | ISO datetime format                                        |
| 6   | `opening_balance`  | Opening Balance | Number input    | Decimal(20,2)                                              |
| 7   | `amount`           | Amount          | Number input    | Decimal(20,2), positive                                    |
| 8   | `closing_balance`  | Closing Balance | Number input    | Decimal(20,2)                                              |
| 9   | `bank_code`        | Bank Code       | Dropdown/Select | Populated from Bank data                                   |
| 10  | `document_path`    | Document        | File upload     | Only accepts PDF or image files (jpg, jpeg, png). Max 5MB. |

**UI Component:** The edit form can be a modal dialog or inline edit on the detail page.

**Validation Rules:**

- Amount must be a positive number.
- Opening balance + amount should approximately equal closing balance.
- If all fields are valid, save button is enabled.
- Display validation errors inline next to affected fields.

**Behavior:**

- On successful update, display a success notification and refresh the table data.
- On failure (validation/server error), display the appropriate error message.

**API Endpoint:** `PUT /api/treasury/deposit/{id}`

---

### 5.4. Update Send Status

**Description:** Feature to update `send_status` for deposit records (mark as sent or not sent).

**UI Behavior:**

1. **Single Update:**
   - Send Status dropdown/toggle in the actions column or detail view.
   - Allow quick status change: Not Sent ↔ Sent
   - On status change, immediately send update request to API.
   - Show loading indicator and confirmation.

2. **Bulk Update:**
   - Checkbox on each table row for selecting multiple records.
   - "Mark as Sent" / "Mark as Not Sent" buttons above the table (active when records selected).
   - Confirmation dialog: _"You are about to mark {n} records as {status}. Continue?"_

**After Update:**

- Display a success notification with the number of records updated.
- Refresh the table data to reflect status changes.

**API Response:**

```json
{
  "message": "{n} records updated successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "agentCode": "AG001",
      "referenceNumber": "REF-2026-00001",
      "sendStatus": 1,
      "success": true
    }
  ],
  "errors": null
}
```

**API Endpoint:** `PUT /api/treasury/deposit/{id}/send-status` (single) or `PUT /api/treasury/deposit/send-status/bulk` (multiple)

---

### 5.5. Summary / Statistics

**Description:** Displays a summary of deposit data at the top of the page (optional, as card/widget).

**Summary Data:**

- Total Deposits (count of all records)
- Total Deposits Not Sent (`send_status = 0`)
- Total Deposits Sent (`send_status = 1`)
- Total Deposit Amount (sum of `amount`)

**API Endpoint:**

- `GET /api/treasury/deposit/summary/count-by-status`
- `GET /api/treasury/deposit/summary/total-amount`

---

## 6. Non-Functional Requirements

| Aspect      | Requirement                                                                               |
| ----------- | ----------------------------------------------------------------------------------------- |
| Performance | List page must load within < 2 seconds for datasets up to 10,000 records with pagination. |
| Security    | All endpoints require JWT authentication and permission-based authorization.              |
| Audit Trail | Every data change is recorded in `updated_at` and `updated_by`.                           |
| Responsive  | Page must be responsive for desktop (min. 1280px).                                        |
| Concurrency | Optimistic locking or validation on update to prevent concurrent data conflicts.          |

---

## 7. Business Rules

| No  | Rule                                                                                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Deposit data **cannot be created** through the frontend. Data originates from external systems.                                                                                      |
| 2   | Deposit data **cannot be deleted** through the frontend.                                                                                                                             |
| 3   | All fields can be edited: `agent_code`, `virtual_account`, `name`, `reference_number`, `deposit_date`, `opening_balance`, `amount`, `closing_balance`, `bank_code`, `document_path`. |
| 4   | Deposit amount must always be a positive number.                                                                                                                                     |
| 5   | Closing balance should equal opening balance plus deposit amount for data integrity.                                                                                                 |
| 6   | Send status indicates whether the deposit has been transmitted to the external system.                                                                                               |
| 7   | Every data change must automatically record `updated_by` and `updated_at`.                                                                                                           |
| 8   | Send status can be toggled between Not Sent (0) and Sent (1) at any time.                                                                                                            |

---

## 8. API Endpoints Summary

| No  | Method | Endpoint                                        | Description                 | Permission                |
| --- | ------ | ----------------------------------------------- | --------------------------- | ------------------------- |
| 1   | GET    | `/api/treasury/deposit`                         | List all data (paginated)   | `treasury:deposit:list`   |
| 2   | GET    | `/api/treasury/deposit/{id}`                    | Get detail by ID            | `treasury:deposit:read`   |
| 3   | PUT    | `/api/treasury/deposit/{id}`                    | Edit deposit data           | `treasury:deposit:update` |
| 4   | PUT    | `/api/treasury/deposit/{id}/send-status`        | Update send status (single) | `treasury:deposit:update` |
| 5   | PUT    | `/api/treasury/deposit/send-status/bulk`        | Update send status (bulk)   | `treasury:deposit:update` |
| 6   | GET    | `/api/treasury/deposit/summary/count-by-status` | Count by send status        | `treasury:deposit:list`   |
| 7   | GET    | `/api/treasury/deposit/summary/total-amount`    | Total deposit amount        | `treasury:deposit:list`   |

> **Not used on frontend:** `POST` (create) and `DELETE` (delete).

---

## 9. Acceptance Criteria

### AC-1: List Deposits

- [ ] User can view deposit list in a paginated table (default 10 per page).
- [ ] Data is sorted by `deposit_date` descending by default.
- [ ] User can search by agent code, name, virtual account, or reference number.
- [ ] User can filter by agent code, bank, send status, and deposit date range.
- [ ] Displayed columns match the specification in section 5.1.

### AC-2: Deposit Detail

- [ ] User can click the "Detail" button to open the detail view modal.
- [ ] Modal displays all information as specified in section 5.2.
- [ ] Modal is read-only with no form inputs.

### AC-3: Edit Deposit

- [ ] User can click the "Edit" button to open the edit form.
- [ ] User can edit all fields: `agent_code`, `virtual_account`, `name`, `reference_number`, `deposit_date`, `opening_balance`, `amount`, `closing_balance`, `bank_code`, `document_path`.
- [ ] Validation prevents saving invalid data (e.g., negative amounts).
- [ ] After a successful edit, the table data is refreshed and a success notification is displayed.

### AC-4: Update Send Status

- [ ] User can update send status for a single record.
- [ ] User can update send status for multiple records at once (bulk action via checkbox).
- [ ] Send status can be toggled between Not Sent (0) and Sent (1).
- [ ] A confirmation dialog is displayed before executing status change.
- [ ] After a successful update, the table data is refreshed and a success notification is displayed.

### AC-5: Summary

- [ ] Summary cards/widgets display the count of total, sent, and not sent deposits.
- [ ] Summary displays the total deposit amount.
- [ ] Summary data is updated after any data changes.

### AC-6: Security & Permissions

- [ ] All endpoints require JWT authentication.
- [ ] Users without the appropriate permissions cannot access the feature.
- [ ] No create or delete endpoints are accessible from the frontend.

---

## 10. Out of Scope

- Creating deposit data through the frontend (data originates from external systems).
- Deleting deposit data through the frontend.
- Data export to Excel/PDF (can be developed in a future phase).
- Email/push notifications for status changes.
- Direct integration with external deposit systems for automated reconciliation.
