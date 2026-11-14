# Monitoring Legacy Integration API Contract

> API contract for the Monitoring Legacy Integration controller.
> Base path: `/api/monitoring-legacy/posting`
> This controller acts as a thin proxy to the external Monitoring Legacy API.

---

## Response Envelope

Every response wraps in this structure:

```json
{
  "message": "string",
  "status": "SUCCESS" | "ERROR" | "WARNING",
  "data": {},
  "errors": [
    { "field": "string", "message": "string" }
  ]
}
```

- `data` is omitted when null.
- `errors` is omitted when null.

---

## Pagination Envelope

Paginated endpoints wrap `data` in:

```json
{
  "content": [],
  "pagination": {
    "total": 100,
    "pageSize": 15,
    "pageNumber": 0,
    "totalPages": 7,
    "currentPage": 1,
    "from": 1,
    "to": 15
  }
}
```

- `pageNumber` is zero-based.
- `currentPage` is one-based.
- `from`/`to` are one-based row range.

---

---

## Invoices

### `GET /api/monitoring-legacy/posting/invoices`

List invoices with pagination and filters.

**Query Parameters:**

| Parameter       | Type    | Default       | Description                                      |
| --------------- | ------- | ------------- | ------------------------------------------------ |
| `page`          | int     | —             | Page number (zero-based)                         |
| `size`          | int     | —             | Items per page                                   |
| `search`        | string  | —             | Full-text search                                 |
| `status`        | string  | —             | Filter by status0                                |
| `postingDate`   | string  | —             | Filter by posting date                           |
| `month`         | int     | —             | Filter by entry_date month (1–12)                |
| `year`          | int     | —             | Filter by entry_date year                        |
| `sort`          | string  | —             | Sort column                                      |
| `sortOrder`     | string  | —             | `asc` or `desc`                                  |
| `ids`           | string  | —             | Comma-separated NO_DOK values                    |

**Response `200`:**

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "REVERSAL": "A",
        "DOC_DATE": "20240115",
        "NO_DOK": "INV-2024-001",
        "ASSIGNMENT": "ASSIGN001",
        "REFERENCE": "REF-001",
        "NO_DOKSAP": "5100000123",
        "POSTING_DATE": "20240115",
        "Fiscal_year": 2024,
        "virtual_acc": "VA1234567890",
        "pos_status": 1,
        "pos_tgl": "2024-01-15T10:30:00.000000Z",
        "entry_date": "2024-01-15T08:00:00.000000Z",
        "status0": "S"
      }
    ],
    "pagination": {
      "total": 100,
      "pageSize": 15,
      "pageNumber": 0,
      "totalPages": 7,
      "currentPage": 1,
      "from": 1,
      "to": 15
    }
  }
}
```

---

### `GET /api/monitoring-legacy/posting/invoices/{reversal}/{noDok}/{reference}`

Get all line items for a specific invoice document group.

**Path Parameters:**

| Parameter   | Type   | Description                |
| ----------- | ------ | -------------------------- |
| `reversal`  | string | Reversal flag (`A` or `B`) |
| `noDok`     | string | Document number            |
| `reference` | string | Reference text             |

**Response `200`:**

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS",
  "data": [
    {
      "FILE_NAME": "upload.csv",
      "REVERSAL": "A",
      "RECORD_NUMBER": 1,
      "TCODE": "FB01",
      "PPH": "",
      "DOC_TYPE": "SA",
      "DOC_DATE": "20240115",
      "NO_DOK": "INV-2024-001",
      "ASSIGNMENT": "ASSIGN001",
      "REFERENCE": "REF-001",
      "NO_DOKSAP": "5100000123",
      "POSTING_DATE": "20240115",
      "Fiscal_year": 2024,
      "virtual_acc": "VA1234567890",
      "pos_status": 1,
      "pos_tgl": "2024-01-15T10:30:00.000000Z",
      "entry_date": "2024-01-15T08:00:00.000000Z",
      "status0": "S",
      "indeks": 1,
      "totalidx": 3,
      "GL_ACCOUNT": "1000001",
      "ACCOUNT": "1000001",
      "ALTERNATIVE_ACC": "",
      "AMOUNT": "1000000",
      "DEBIT_KREDIT": "D",
      "BA": "BA01",
      "INTERNAL_ORDER": "",
      "VENDOR": "V001",
      "CUSTOMER": "",
      "SEGMEN": "",
      "FA": "",
      "CC": "",
      "PC": "",
      "sts_acountfa": "",
      "VALUE_DATE": "20240115",
      "status1": "",
      "status2": "",
      "status3": "",
      "status4": "",
      "status5": "",
      "status6": "",
      "status7": "",
      "status8": "",
      "status9": "",
      "status10": "",
      "WWRVC": "",
      "KNDNR": "",
      "WWPRD": ""
    }
  ]
}
```

**Response `500` (proxy error):**

```json
{
  "message": "Failed to get invoice details: Connection refused",
  "status": "ERROR"
}
```

---

### `POST /api/monitoring-legacy/posting/invoices`

Create a new invoice line item.

**Request Body (`PostingInvoiceRequestDTO`):**

| Field             | Type    | Required | Description                           |
| ----------------- | ------- | -------- | ------------------------------------- |
| `RECORD_NUMBER`   | int     | yes      | Record sequence number                |
| `TCODE`           | string  | yes      | SAP transaction code                  |
| `REVERSAL`        | string  | yes      | Reversal flag (`A`/`B`)               |
| `DOC_TYPE`        | string  | yes      | Document type                         |
| `NO_DOK`          | string  | yes      | Document number                       |
| `REFERENCE`       | string  | yes      | Reference text                        |
| `DEBIT_KREDIT`    | string  | yes      | `D` (debit) or `K` (credit)           |
| `ACCOUNT`         | string  | yes      | Account number                        |
| `AMOUNT`          | string  | yes      | Amount                                |
| `BA`              | string  | yes      | Business area                         |
| `Fiscal_year`     | int     | yes      | Fiscal year                           |
| `virtual_acc`     | string  | yes      | Virtual account                       |
| `FILE_NAME`       | string  | no       | Source file name                      |
| `PPH`             | string  | no       | Tax withholding                       |
| `POSTING_DATE`    | string  | no       | Posting date (YYYYMMDD or YYYY-MM-DD) |
| `DOC_DATE`        | string  | no       | Document date                         |
| `VALUE_DATE`      | string  | no       | Value date                            |
| `ALTERNATIVE_ACC` | string  | no       | Alternative account                   |
| `SEGMEN`          | string  | no       | Segment                               |
| `FA`              | string  | no       | Functional area                       |
| `CC`              | string  | no       | Cost center                           |
| `PC`              | string  | no       | Profit center                         |
| `INTERNAL_ORDER`  | string  | no       | Internal order                        |
| `ASSIGNMENT`      | string  | no       | Assignment                            |
| `VENDOR`          | string  | no       | Vendor number                         |
| `CUSTOMER`        | string  | no       | Customer number                       |
| `WWRVC`           | string  | no       | Revenue sharing code                  |
| `KNDNR`           | string  | no       | Customer number (SAP)                 |
| `WWPRD`           | string  | no       | Product code                          |
| `pos_status`      | int     | no       | Posting status                        |
| `status0`         | string  | no       | SAP response type                     |
| `NO_DOKSAP`       | string  | no       | SAP document number                   |

**Response `201`:**

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS"
}
```

**Response `500`:**

```json
{
  "message": "Failed to create invoice: Validation error",
  "status": "ERROR"
}
```

---

### `PUT /api/monitoring-legacy/posting/invoices/{reversal}/{noDok}/{reference}/{indeks}`

Update a specific invoice line item.

**Path Parameters:**

| Parameter   | Type   | Description        |
| ----------- | ------ | ------------------ |
| `reversal`  | string | Reversal flag      |
| `noDok`     | string | Document number    |
| `reference` | string | Reference text     |
| `indeks`    | string | Line item index    |

**Request Body:** Same as `POST /api/monitoring-legacy/posting/invoices`.

**Response `200`:**

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS"
}
```

---

### `DELETE /api/monitoring-legacy/posting/invoices/{reversal}/{noDok}/{reference}/{indeks}`

Delete a specific invoice line item.

**Path Parameters:** Same as PUT.

**Response `200`:**

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS"
}
```

---

### `POST /api/monitoring-legacy/posting/invoices/generate`

Generate posting entries for an invoice number.

**Request Body (`PostingGenerateInvoiceRequestDTO`):**

| Field      | Type   | Required | Description                    |
| ---------- | ------ | -------- | ------------------------------ |
| `invoice`  | string | yes      | Invoice number                 |
| `reversal` | string | no       | Reversal flag, defaults to `A` |

**Response `200`:**

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS"
}
```

---

### `POST /api/monitoring-legacy/posting/invoices/{reversal}/{noDok}/{reference}/regenerate`

Regenerate posting entries for an existing invoice document group.

**Path Parameters:**

| Parameter   | Type   | Description    |
| ----------- | ------ | -------------- |
| `reversal`  | string | Reversal flag  |
| `noDok`     | string | Document number|
| `reference` | string | Reference text |

**Response `200`:**

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS"
}
```

---

### `POST /api/monitoring-legacy/posting/invoices/{reversal}/{noDok}/{reference}/send-to-sap`

Send invoice to SAP for processing.

**Path Parameters:** Same as regenerate.

**Response `200`:**

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS",
  "data": {
    "sap_doc_number": "5100000123"
  }
}
```

---

### `POST /api/monitoring-legacy/posting/invoices/batch/send-to-sap`

Batch send multiple invoices to SAP.

**Request Body (`BatchPostingRequestDTO`):**

```json
{
  "postings": [
    {
      "reversal": "A",
      "noDok": "INV-2024-001",
      "reference": "REF-001"
    }
  ]
}
```

**Response `200`:**

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS",
  "data": {
    "successful": [
      {
        "no_dok": "INV-001 A",
        "message": "SAP: 5100000123",
        "sap_doc_number": "5100000123",
        "invoice": null
      }
    ],
    "failed": [],
    "total_processed": 1
  }
}
```

---

### `POST /api/monitoring-legacy/posting/invoices/batch/regenerate`

Batch regenerate multiple invoice posting entries.

**Request Body:** Same as `batch/send-to-sap`.

**Response `200`:**

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS",
  "data": {
    "successful": [
      {
        "no_dok": "INV-001 A",
        "invoice_id": null,
        "message": "3 old → 4 new entries",
        "old_entries": 3,
        "new_entries": 4
      }
    ],
    "failed": [],
    "total_processed": 1,
    "total_old_entries": 3,
    "total_new_entries": 4
  }
}
```

---

---

## Payments

### `GET /api/monitoring-legacy/posting/payments`

List payments with pagination and filters.

**Query Parameters:** Same as `GET /api/monitoring-legacy/posting/invoices`.

**Response `200`:**

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "REVERSAL": "A",
        "DOC_DATE": "20240115",
        "NO_DOK": "PAY-2024-001",
        "ASSIGNMENT": "ASSIGN001",
        "REFERENCE": "REF-001",
        "NO_DOKSAP": "5200000123",
        "POSTING_DATE": "20240115",
        "Fiscal_year": 2024,
        "virtual_acc": "VA1234567890",
        "pos_status": 1,
        "pos_tgl": "2024-01-15T10:30:00.000000Z",
        "entry_date": "2024-01-15T08:00:00.000000Z",
        "status0": "S"
      }
    ],
    "pagination": {
      "total": 50,
      "pageSize": 15,
      "pageNumber": 0,
      "totalPages": 4,
      "currentPage": 1,
      "from": 1,
      "to": 15
    }
  }
}
```

---

### `GET /api/monitoring-legacy/posting/payments/{reversal}/{noDok}/{reference}`

Get all line items for a specific payment document group.

**Path Parameters:**

| Parameter   | Type   | Description                |
| ----------- | ------ | -------------------------- |
| `reversal`  | string | Reversal flag (`A` or `B`) |
| `noDok`     | string | Document number            |
| `reference` | string | Reference text             |

**Response `200`:**

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 42,
      "FILE_NAME": "upload.csv",
      "REVERSAL": "A",
      "RECORD_NUMBER": 1,
      "TCODE": "FB01",
      "PPH": "",
      "DOC_TYPE": "SA",
      "DOC_DATE": "20240115",
      "NO_DOK": "PAY-2024-001",
      "ASSIGNMENT": "ASSIGN001",
      "REFERENCE": "REF-001",
      "NO_DOKSAP": "5200000123",
      "POSTING_DATE": "20240115",
      "VALUE_DATE": "20240115",
      "Fiscal_year": 2024,
      "virtual_acc": "VA1234567890",
      "pos_status": 1,
      "pos_tgl": "2024-01-15T10:30:00.000000Z",
      "entry_date": "2024-01-15T08:00:00.000000Z",
      "status0": "S",
      "indeks": 1,
      "totalidx": 2,
      "GL_ACCOUNT": "2000001",
      "ACCOUNT": "2000001",
      "AMOUNT": "500000",
      "DEBIT_KREDIT": "K",
      "BA": "BA01",
      "INTERNAL_ORDER": "",
      "VENDOR": "V001",
      "CUSTOMER": "",
      "SEGMEN": "",
      "FA": "",
      "CC": "",
      "PC": "",
      "sts_acountfa": "",
      "ALTERNATIVE_ACC": "",
      "XREF1": "XREF001",
      "XREF2": "XREF002",
      "BA_ASAL": "BA001",
      "status1": "",
      "status2": "",
      "status3": "",
      "status4": "",
      "status5": "",
      "status6": "",
      "status7": "",
      "status8": "",
      "status9": "",
      "status10": "",
      "WWRVC": "",
      "KNDNR": "",
      "WWPRD": ""
    }
  ]
}
```

**Response `500` (proxy error):**

```json
{
  "message": "Failed to get payment details: Connection refused",
  "status": "ERROR"
}
```

---

### `POST /api/monitoring-legacy/posting/payments`

Create a new payment line item.

**Request Body (`PostingPaymentRequestDTO`):**

| Field             | Type    | Required | Description                           |
| ----------------- | ------- | -------- | ------------------------------------- |
| `RECORD_NUMBER`   | int     | yes      | Record sequence number                |
| `TCODE`           | string  | yes      | SAP transaction code                  |
| `REVERSAL`        | string  | yes      | Reversal flag (`A`/`B`)               |
| `DOC_TYPE`        | string  | yes      | Document type                         |
| `NO_DOK`          | string  | yes      | Document number                       |
| `REFERENCE`       | string  | yes      | Reference text                        |
| `DEBIT_KREDIT`    | string  | yes      | `D` (debit) or `K` (credit)           |
| `ACCOUNT`         | string  | yes      | Account number                        |
| `AMOUNT`          | string  | yes      | Amount                                |
| `BA`              | string  | yes      | Business area                         |
| `Fiscal_year`     | int     | yes      | Fiscal year                           |
| `virtual_acc`     | string  | yes      | Virtual account                       |
| `FILE_NAME`       | string  | no       | Source file name                      |
| `PPH`             | string  | no       | Tax withholding                       |
| `POSTING_DATE`    | string  | no       | Posting date (YYYYMMDD or YYYY-MM-DD) |
| `DOC_DATE`        | string  | no       | Document date                         |
| `VALUE_DATE`      | string  | no       | Value date                            |
| `ALTERNATIVE_ACC` | string  | no       | Alternative account                   |
| `SEGMEN`          | string  | no       | Segment                               |
| `FA`              | string  | no       | Functional area                       |
| `CC`              | string  | no       | Cost center                           |
| `PC`              | string  | no       | Profit center                         |
| `INTERNAL_ORDER`  | string  | no       | Internal order                        |
| `ASSIGNMENT`      | string  | no       | Assignment                            |
| `VENDOR`          | string  | no       | Vendor number                         |
| `CUSTOMER`        | string  | no       | Customer number                       |
| `XREF1`           | string  | no       | Cross-reference 1                     |
| `XREF2`           | string  | no       | Cross-reference 2                     |
| `BA_ASAL`         | string  | no       | Source business area                  |
| `WWRVC`           | string  | no       | Revenue sharing code                  |
| `KNDNR`           | string  | no       | Customer number (SAP)                 |
| `WWPRD`           | string  | no       | Product code                          |
| `pos_status`      | int     | no       | Posting status                        |
| `status0`         | string  | no       | SAP response type                     |
| `NO_DOKSAP`       | string  | no       | SAP document number                   |

**Response `201`:**

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS"
}
```

**Response `500`:**

```json
{
  "message": "Failed to create payment: Validation error",
  "status": "ERROR"
}
```

---

### `PUT /api/monitoring-legacy/posting/payments/{reversal}/{noDok}/{reference}/{indeks}`

Update a specific payment line item.

**Path Parameters:**

| Parameter   | Type   | Description     |
| ----------- | ------ | --------------- |
| `reversal`  | string | Reversal flag   |
| `noDok`     | string | Document number |
| `reference` | string | Reference text  |
| `indeks`    | string | Line item index |

**Request Body:** Same as `POST /api/monitoring-legacy/posting/payments`.

**Response `200`:**

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS"
}
```

---

### `DELETE /api/monitoring-legacy/posting/payments/{reversal}/{noDok}/{reference}/{indeks}`

Delete a specific payment line item.

**Path Parameters:** Same as PUT.

**Response `200`:**

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS"
}
```

---

### `POST /api/monitoring-legacy/posting/payments/generate`

Generate posting entries for a payment invoice number.

**Request Body (`PostingGeneratePaymentRequestDTO`):**

| Field     | Type   | Required | Description    |
| --------- | ------ | -------- | -------------- |
| `invoice` | string | yes      | Invoice number |

**Response `200`:**

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS"
}
```

---

### `POST /api/monitoring-legacy/posting/payments/{reversal}/{noDok}/{reference}/regenerate`

Regenerate posting entries for an existing payment document group.

**Path Parameters:**

| Parameter   | Type   | Description     |
| ----------- | ------ | --------------- |
| `reversal`  | string | Reversal flag   |
| `noDok`     | string | Document number |
| `reference` | string | Reference text  |

**Response `200`:**

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS"
}
```

---

### `POST /api/monitoring-legacy/posting/payments/{reversal}/{noDok}/{reference}/send-to-sap`

Send payment to SAP for processing.

**Path Parameters:** Same as regenerate.

**Response `200`:**

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS",
  "data": {
    "sap_doc_number": "5200000123"
  }
}
```

---

### `POST /api/monitoring-legacy/posting/payments/batch/send-to-sap`

Batch send multiple payments to SAP.

**Request Body (`BatchPostingRequestDTO`):**

```json
{
  "postings": [
    {
      "reversal": "A",
      "noDok": "PAY-2024-001",
      "reference": "REF-001"
    }
  ]
}
```

**Response `200`:**

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS",
  "data": {
    "successful": [
      {
        "no_dok": null,
        "message": "SAP: 5200000123",
        "sap_doc_number": "5200000123",
        "invoice": "INV-001"
      }
    ],
    "failed": [],
    "total_processed": 1
  }
}
```

---

### `POST /api/monitoring-legacy/posting/payments/batch/regenerate`

Batch regenerate multiple payment posting entries.

**Request Body:** Same as `batch/send-to-sap`.

**Response `200`:**

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS",
  "data": {
    "successful": [
      {
        "no_dok": null,
        "invoice_id": "INV-001",
        "message": "Regenerated successfully",
        "old_entries": null,
        "new_entries": null
      }
    ],
    "failed": [],
    "total_processed": 1,
    "total_old_entries": null,
    "total_new_entries": null
  }
}
```

**Response `404` (proxy error):**

```json
{
  "message": "Monitoring Legacy API error [batchRegeneratePayments]: No payments found for the selected documents.",
  "status": "ERROR"
}
```

---

---

## Error Responses

All endpoints return the standard `ApiResponse` envelope on error.

**Proxy/connection errors (`500`):**

```json
{
  "message": "Failed to {operation}: {cause}",
  "status": "ERROR"
}
```

**Upstream validation errors:**

```json
{
  "message": "Monitoring Legacy API error [{operation}]: {message} — {field}: {detail}",
  "status": "ERROR"
}
```

**Null upstream response:**

```json
{
  "message": "Null response from Monitoring Legacy API: {operation}",
  "status": "ERROR"
}
```

---

---

## DTO Field Reference

### PostingListItemDTO

| Field          | Type    | Description              |
| -------------- | ------- | ------------------------ |
| `REVERSAL`     | string  | Reversal flag            |
| `DOC_DATE`     | string  | Document date            |
| `NO_DOK`       | string  | Document number          |
| `ASSIGNMENT`   | string  | Assignment number        |
| `REFERENCE`    | string  | Reference text           |
| `NO_DOKSAP`    | string  | SAP document number      |
| `POSTING_DATE` | string  | Posting date             |
| `Fiscal_year`  | int     | Fiscal year              |
| `virtual_acc`  | string  | Virtual account          |
| `pos_status`   | int     | Posting status           |
| `pos_tgl`      | string  | SAP posting timestamp    |
| `entry_date`   | string  | Entry timestamp          |
| `status0`      | string  | SAP response type        |

### PostingInvoiceDetailDTO

All `PostingListItemDTO` fields, plus:

| Field             | Type    | Description              |
| ----------------- | ------- | ------------------------ |
| `FILE_NAME`       | string  | Source file name         |
| `RECORD_NUMBER`   | int     | Record sequence number   |
| `TCODE`           | string  | SAP transaction code     |
| `PPH`             | string  | Tax withholding          |
| `DOC_TYPE`        | string  | Document type            |
| `VALUE_DATE`      | string  | Value date               |
| `indeks`          | int     | Line item index          |
| `totalidx`        | int     | Total line items         |
| `GL_ACCOUNT`      | string  | GL account number        |
| `ACCOUNT`         | string  | Account number           |
| `ALTERNATIVE_ACC` | string  | Alternative account      |
| `AMOUNT`          | string  | Transaction amount       |
| `DEBIT_KREDIT`    | string  | `D` or `K`               |
| `BA`              | string  | Business area            |
| `INTERNAL_ORDER`  | string  | Internal order           |
| `VENDOR`          | string  | Vendor code              |
| `CUSTOMER`        | string  | Customer code            |
| `SEGMEN`          | string  | Segment                  |
| `FA`              | string  | Functional area          |
| `CC`              | string  | Cost center              |
| `PC`              | string  | Profit center            |
| `sts_acountfa`    | string  | Account/FA status        |
| `status1`–`status10` | string | SAP response messages |
| `WWRVC`           | string  | Revenue sharing code     |
| `KNDNR`           | string  | Customer number (SAP)    |
| `WWPRD`           | string  | Product code             |

### PostingPaymentDetailDTO

All `PostingInvoiceDetailDTO` fields, plus:

| Field       | Type   | Description           |
| ----------- | ------ | --------------------- |
| `id`        | long   | Internal record ID    |
| `XREF1`     | string | Cross-reference 1     |
| `XREF2`     | string | Cross-reference 2     |
| `BA_ASAL`   | string | Source business area  |

### PostingInvoiceRequestDTO

| Field             | Type    | Required | Description              |
| ----------------- | ------- | -------- | ------------------------ |
| `RECORD_NUMBER`   | int     | yes      | Record sequence number   |
| `TCODE`           | string  | yes      | SAP transaction code     |
| `REVERSAL`        | string  | yes      | Reversal flag            |
| `DOC_TYPE`        | string  | yes      | Document type            |
| `NO_DOK`          | string  | yes      | Document number          |
| `REFERENCE`       | string  | yes      | Reference text           |
| `DEBIT_KREDIT`    | string  | yes      | `D` or `K`               |
| `ACCOUNT`         | string  | yes      | Account number           |
| `AMOUNT`          | string  | yes      | Amount                   |
| `BA`              | string  | yes      | Business area            |
| `Fiscal_year`     | int     | yes      | Fiscal year              |
| `virtual_acc`     | string  | yes      | Virtual account          |
| `FILE_NAME`       | string  | no       | Source file name         |
| `PPH`             | string  | no       | Tax withholding          |
| `POSTING_DATE`    | string  | no       | Posting date             |
| `DOC_DATE`        | string  | no       | Document date            |
| `VALUE_DATE`      | string  | no       | Value date               |
| `ALTERNATIVE_ACC` | string  | no       | Alternative account      |
| `SEGMEN`          | string  | no       | Segment                  |
| `FA`              | string  | no       | Functional area          |
| `CC`              | string  | no       | Cost center              |
| `PC`              | string  | no       | Profit center            |
| `INTERNAL_ORDER`  | string  | no       | Internal order           |
| `ASSIGNMENT`      | string  | no       | Assignment               |
| `VENDOR`          | string  | no       | Vendor number            |
| `CUSTOMER`        | string  | no       | Customer number          |
| `WWRVC`           | string  | no       | Revenue sharing code     |
| `KNDNR`           | string  | no       | Customer number (SAP)    |
| `WWPRD`           | string  | no       | Product code             |
| `pos_status`      | int     | no       | Posting status           |
| `status0`         | string  | no       | SAP response type        |
| `NO_DOKSAP`       | string  | no       | SAP document number      |

### PostingPaymentRequestDTO

All `PostingInvoiceRequestDTO` fields, plus:

| Field       | Type   | Required | Description          |
| ----------- | ------ | -------- | -------------------- |
| `XREF1`     | string | no       | Cross-reference 1    |
| `XREF2`     | string | no       | Cross-reference 2    |
| `BA_ASAL`   | string | no       | Source business area |

### PostingGenerateInvoiceRequestDTO

| Field      | Type   | Required | Description                    |
| ---------- | ------ | -------- | ------------------------------ |
| `invoice`  | string | yes      | Invoice number                 |
| `reversal` | string | no       | Reversal flag, defaults to `A` |

### PostingGeneratePaymentRequestDTO

| Field     | Type   | Required | Description    |
| --------- | ------ | -------- | -------------- |
| `invoice` | string | yes      | Invoice number |

### SendToSapResponseDTO

| Field           | Type   | Description         |
| --------------- | ------ | ------------------- |
| `sap_doc_number`| string | SAP document number |

### BatchPostingRequestDTO

| Field       | Type                      | Required | Description              |
| ----------- | ------------------------- | -------- | ------------------------ |
| `postings`  | `List<BatchPostingItemDTO>` | yes    | Array of posting objects |

### BatchPostingItemDTO

| Field       | Type   | Required | Description     |
| ----------- | ------ | -------- | --------------- |
| `reversal`  | string | yes      | Reversal flag   |
| `noDok`     | string | yes      | Document number |
| `reference` | string | yes      | Reference text  |

### BatchSendToSapResultDTO

| Field            | Type                                | Description       |
| ---------------- | ----------------------------------- | ----------------- |
| `successful`     | `List<BatchSendToSapItemDTO>`       | Successful items  |
| `failed`         | `List<BatchSendToSapFailedItemDTO>` | Failed items      |
| `total_processed`| int                                 | Total processed   |

### BatchSendToSapItemDTO

| Field           | Type   | Description             |
| --------------- | ------ | ----------------------- |
| `no_dok`        | string | Document number (invoices) |
| `message`       | string | Result message          |
| `sap_doc_number`| string | SAP document number     |
| `invoice`       | string | Invoice number (payments) |

### BatchSendToSapFailedItemDTO

| Field     | Type   | Description              |
| --------- | ------ | ------------------------ |
| `no_dok`  | string | Document number (invoices) |
| `invoice` | string | Invoice number (payments)  |
| `reason`  | string | Failure reason           |

### BatchRegenerateResultDTO

| Field              | Type                               | Description          |
| ------------------ | ---------------------------------- | -------------------- |
| `successful`       | `List<BatchRegenerateItemDTO>`     | Successful items     |
| `failed`           | `List<BatchSendToSapFailedItemDTO>`| Failed items         |
| `total_processed`  | int                                | Total processed      |
| `total_old_entries`| int                                | Total old entries    |
| `total_new_entries`| int                                | Total new entries    |

### BatchRegenerateItemDTO

| Field         | Type   | Description                |
| ------------- | ------ | -------------------------- |
| `no_dok`      | string | Document number (invoices) |
| `invoice_id`  | string | Invoice ID (payments)      |
| `message`     | string | Result message             |
| `old_entries`  | int   | Old entry count            |
| `new_entries`  | int   | New entry count            |
