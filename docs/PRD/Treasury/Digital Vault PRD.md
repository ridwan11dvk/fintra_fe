# Digital Vault - Product Requirements Document (PRD)

## 1. Overview

The **Digital Vault** feature is a real-time revenue deposit monitoring module within the Treasury system. Digital Vault enables financial and operational teams at KAI to track the status of daily cash closures (_tutupan_) submitted by station cashiers, monitor deposit transactions per closure, and reconcile reported closure amounts against actual received deposits. This is a **read-only monitoring API** — closure data originates from the external RTS (Railway Ticketing System) and deposit confirmations are received from the banking VAI (Virtual Account Interface) system.

---

## 2. Objectives

- Provide real-time visibility of deposit statuses per VA (Virtual Account) station
- Enable reconciliation between reported closure amounts and received deposits (CREDIT)
- Monitor SAP posting status per closure transaction
- Support filtering and search up to 3 months of historical data
- Provide station-level and transaction-level drill-down views

---

## 3. User Roles & Permissions

| Permission              | Description                                        |
| ----------------------- | -------------------------------------------------- |
| `treasury:deposit:list` | View digital vault station summary list            |
| `treasury:deposit:read` | View station closure detail and transaction detail |

---

## 4. Business Flow

```
Station Cashier
    │
    ▼
Daily Cash Closure Report (via RTS)
    │  → Creates record in dv_payment_header
    │  → Closure amount reported
    ▼
Physical Deposit
    │  → Deposit types:
    │     1 = Digital vault machine (brankas)
    │     2 = Teller
    │     3 = BRILink
    ▼
Bank Confirmation to VAI System
    │  → Records in dv_payment_detail
    │  → Billing types: DEPOSIT → CREDIT → COMPLETE
    ▼
Update payment_status in dv_payment_header
    │  → 0 = OPEN (not yet settled)
    │  → 1 = COMPLETE (fully settled)
    ▼
SAP Posting
       → posting_a8_status = 1 : Sending to SAP (INPROGRESS)
       → posting_a8_status = 2 : Successfully sent (SUCCESS)
       → posting_a8_status = 5 : Failed / error (FAILED)
```

---

## 5. Database Structure

Refers to the `vault_station_virtual_account`, `vault_payment_header`, `vault_payment_header_detail`, and `vault_payment_detail` tables. Full reference: [Digital Vault DB Documentation](../../db/Treasury/Digital%20Vault.md)

### 5.1 Station Table (`vault_station_virtual_account`)

| Column                   | Type         | Nullable | Default | Description                             |
| ------------------------ | ------------ | -------- | ------- | --------------------------------------- |
| `id`                     | BIGSERIAL    | NO       | -       | Auto-increment primary key              |
| `station_code`           | VARCHAR(10)  | YES      | -       | Unique station code                     |
| `station_name`           | VARCHAR(100) | NO       | -       | Full station name                       |
| `address`                | VARCHAR(255) | YES      | -       | Station address                         |
| `virtual_account_number` | VARCHAR(18)  | NO       | -       | VA number assigned to station           |
| `cost_center`            | VARCHAR(10)  | YES      | -       | Cost center code (finance)              |
| `station_abbreviation`   | VARCHAR(20)  | NO       | -       | Station abbreviation                    |
| `reserve_status`         | INTEGER      | YES      | -       | 0 = open, 1 = used/closed               |
| `bank_rule_id`           | INTEGER      | YES      | -       | Bank rule identifier                    |
| `virtual_account_status` | INTEGER      | YES      | -       | 1 = active, 2 = inactive                |
| `company_code`           | VARCHAR(10)  | YES      | -       | Company code (e.g. IC100)               |
| `hit_history`            | INTEGER      | YES      | 0       | Total hit count for this VA             |
| `hit_history_date`       | TIMESTAMP    | YES      | -       | Last hit date                           |
| `business_area`          | VARCHAR(255) | YES      | -       | Business area (e.g. A010 = head office) |
| `profit_center`          | VARCHAR(255) | YES      | -       | Profit center for revenue recording     |
| `created_at`             | TIMESTAMP    | NO       | NOW     | Record creation timestamp               |
| `updated_at`             | TIMESTAMP    | NO       | NOW     | Last update timestamp                   |

### 5.2 Payment Header Table (`vault_payment_header`)

| Column                   | Type          | Nullable | Default | Description                                            |
| ------------------------ | ------------- | -------- | ------- | ------------------------------------------------------ |
| `id`                     | BIGSERIAL     | NO       | -       | Auto-increment primary key                             |
| `virtual_account_number` | VARCHAR(18)   | YES      | -       | VA number of the station                               |
| `station_abbreviation`   | VARCHAR(20)   | YES      | -       | Station abbreviation                                   |
| `company_code`           | VARCHAR(10)   | YES      | -       | Company code                                           |
| `closure_number`         | VARCHAR(20)   | NO       | -       | Closure number from RTS system                         |
| `closure_date`           | DATE          | NO       | -       | Date of cash closure                                   |
| `station_name`           | VARCHAR(100)  | YES      | -       | Station name                                           |
| `closure_amount`         | DECIMAL(19,2) | NO       | -       | Total reported closure amount (IDR)                    |
| `bank_code`              | VARCHAR(5)    | YES      | -       | Bank code used for deposit                             |
| `transaction_type`       | VARCHAR(20)   | NO       | -       | Transaction type label                                 |
| `deposit_type`           | INTEGER       | NO       | -       | 1=Digital Vault, 2=Teller, 3=BRILink                   |
| `bank_rule_id`           | INTEGER       | YES      | -       | Bank rule identifier for transaction identification    |
| `posting_a8_status`      | INTEGER       | YES      | -       | SAP posting status (1=INPROGRESS, 2=SUCCESS, 5=FAILED) |
| `created_at`             | TIMESTAMP     | YES      | NOW     | Record creation timestamp                              |
| `updated_at`             | TIMESTAMP     | NOT NULL | NOW     | Last update timestamp                                  |
| `updated_by`             | VARCHAR(100)  | YES      | -       | Username who last updated the record                   |
| `created_by`             | VARCHAR(100)  | YES      | -       | Username who created the record                        |
| `created_ip`             | VARCHAR(50)   | YES      | -       | IP address from which the record was created           |
| `updated_ip`             | VARCHAR(50)   | YES      | -       | IP address from which the record was updated           |
| `payment_status`         | INTEGER       | NOT NULL | 0       | 0=OPEN, 1=COMPLETE                                     |
| `rts_user_id`            | INTEGER       | YES      | -       | User ID from the RTS system                            |
| `declaration_id`         | INTEGER       | YES      | -       | Bank declaration response ID                           |

### 5.3 Payment Header Detail Table (`vault_payment_header_detail`)

| Column              | Type          | Nullable | Default | Description                                  |
| ------------------- | ------------- | -------- | ------- | -------------------------------------------- |
| `id`                | BIGSERIAL     | NO       | -       | Auto-increment primary key                   |
| `payment_header_id` | BIGINT        | NO       | -       | Foreign key to `vault_payment_header.id`     |
| `transaction_type`  | VARCHAR(20)   | YES      | -       | Type of transaction for this detail line     |
| `closure_amount`    | DECIMAL(19,2) | YES      | -       | Closure amount for this detail line (IDR)    |
| `document_number`   | VARCHAR(20)   | YES      | -       | Document reference number                    |
| `closure_date`      | DATE          | YES      | -       | Closure date for this detail line            |
| `created_at`        | TIMESTAMP     | NOT NULL | NOW     | Record creation timestamp                    |
| `updated_at`        | TIMESTAMP     | NOT NULL | NOW     | Last update timestamp                        |
| `created_by`        | VARCHAR(100)  | YES      | -       | Username who created the record              |
| `updated_by`        | VARCHAR(100)  | YES      | -       | Username who last updated the record         |
| `created_ip`        | VARCHAR(50)   | YES      | -       | IP address from which the record was created |
| `updated_ip`        | VARCHAR(50)   | YES      | -       | IP address from which the record was updated |

### 5.4 Payment Detail Table (`vault_payment_detail`)

| Column                  | Type          | Nullable | Default | Description                              |
| ----------------------- | ------------- | -------- | ------- | ---------------------------------------- |
| `id`                    | BIGSERIAL     | NO       | -       | Auto-increment primary key               |
| `payment_header_id`     | BIGINT        | NO       | -       | Foreign key to `vault_payment_header.id` |
| `deposit_date`          | TIMESTAMP     | NO       | -       | Date and time of deposit                 |
| `deposit_amount`        | DECIMAL(19,2) | YES      | -       | Deposit amount (IDR)                     |
| `billing_type`          | VARCHAR(20)   | YES      | -       | DEPOSIT / CREDIT / COMPLETE / INQUIRY    |
| `transaction_id`        | VARCHAR(50)   | YES      | -       | Transaction ID from banking system       |
| `machine_serial_number` | VARCHAR(255)  | YES      | -       | Serial number of deposit machine         |
| `machine_code`          | VARCHAR(255)  | YES      | -       | Code of deposit machine                  |
| `machine_name`          | VARCHAR(255)  | YES      | -       | Name of deposit machine                  |
| `deposit_id`            | INTEGER       | YES      | -       | Bank deposit ID                          |
| `created_at`            | TIMESTAMP     | NOT NULL | NOW     | Record creation timestamp                |
| `updated_at`            | TIMESTAMP     | NOT NULL | NOW     | Last update timestamp                    |
| `created_by`            | VARCHAR(100)  | YES      | -       | Username who created the record          |
| `updated_by`            | VARCHAR(100)  | YES      | -       | Username who last updated the record     |
| `created_ip`            | VARCHAR(50)   | YES      | -       | IP address where record was created      |
| `updated_ip`            | VARCHAR(50)   | YES      | -       | IP address from which record updated     |

### Enumerations

#### Payment Status (`payment_status`)

| Value | Label    | Description                   |
| ----- | -------- | ----------------------------- |
| 0     | OPEN     | Closure not yet fully settled |
| 1     | COMPLETE | Closure fully settled         |

#### Billing Type (`billing_type`)

| Value    | Description                             |
| -------- | --------------------------------------- |
| DEPOSIT  | Cash being counted in the vault machine |
| CREDIT   | Cash credited to VA by the bank         |
| COMPLETE | Deposit process fully completed         |
| INQUIRY  | Status check from RTS to VAI system     |
| `-`      | No deposit transaction yet              |

#### SAP Posting Status (`posting_a8_status`)

| Value | Label      | Description                             |
| ----- | ---------- | --------------------------------------- |
| 1     | INPROGRESS | Currently being sent to SAP             |
| 2     | SUCCESS    | Successfully posted, SAP doc number set |
| 5     | FAILED     | Failed / error during posting           |
| null  | NOT POSTED | No posting initiated yet                |

#### Deposit Type (`deposit_type`)

| Value | Label         | Description                 |
| ----- | ------------- | --------------------------- |
| 1     | Digital Vault | Via automated vault machine |
| 2     | Teller        | Via bank teller             |
| 3     | BRILink       | Via BRILink agent           |

---

## 6. Functional Requirements

### 6.1 Station Summary List

**As a** treasury user,
**I want to** see a list of all stations with aggregated closure and deposit summaries,
**So that** I can monitor overall settlement status across all stations.

**Acceptance Criteria:**

- List is filtered by default to the 3-month window ending at the specified month
- Each station entry shows: station name, company code, number of closures, total closure amount, total received deposit (CREDIT only)
- Overall totals (all stations) are shown in the response summary
- Filterable by station name (partial, case-insensitive), date range, month, and year
- Paginated with configurable page size

### 6.2 Station Closure Detail

**As a** treasury user,
**I want to** see all closure records for a specific station in a given period,
**So that** I can review each closure's settlement status and SAP posting result.

**Acceptance Criteria:**

- Filterable by station name (path parameter), year, and month
- Each closure record shows: closure number, closure date, latest deposit date, closure amount, total deposit received, bank code, billing type (latest), payment status, SAP posting status
- Results sorted by closure date descending
- Paginated

### 6.3 Transaction Detail

**As a** treasury user,
**I want to** see all individual deposit transactions for a specific closure,
**So that** I can trace each deposit event for audit and reconciliation.

**Acceptance Criteria:**

- Returns a single closure header with all its deposit detail records
- `total_deposit_amount` only sums `billing_type = CREDIT` items
- Items sorted by `created_at` descending

---

## 7. Non-Functional Requirements

| Category    | Requirement                                                        |
| ----------- | ------------------------------------------------------------------ |
| Performance | Response time < 3 seconds for 100-station queries                  |
| Security    | All endpoints require Bearer JWT token with appropriate permission |
| Pagination  | Default 10 items per page                                          |
| Data range  | Default filter covers current month + 2 prior months               |
| Timestamps  | All timestamps in ISO 8601 format                                  |
| Currency    | All monetary values in IDR (integer, no currency symbol)           |

---

## 8. API Endpoint Summary

| Method | Endpoint                                             | Description                     | Permission              |
| ------ | ---------------------------------------------------- | ------------------------------- | ----------------------- |
| `GET`  | `/api/treasury/digital-vault`                        | Station summary list            | `treasury:deposit:list` |
| `GET`  | `/api/treasury/digital-vault/{stationName}/closures` | Station closure detail          | `treasury:deposit:read` |
| `GET`  | `/api/treasury/digital-vault/transactions/{id}`      | Transaction detail by header ID | `treasury:deposit:read` |

Full API contract: [DigitalVault_API_Contract.md](../../contract/Treasury/DigitalVault_API_Contract.md)
