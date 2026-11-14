# Close Payment API Contract

## Overview

The Close Payment API provides endpoints for managing close payment transactions within the treasury system. The API supports comprehensive payment tracking including invoice references, payment amounts, transaction details, and payment status management. The API uses JWT authentication with permission-based access control for secure payment management.

---

## Base Information

- **Base URL**: `/api/treasury/close-payments`
- **Authentication**: Bearer JWT Token
- **Content-Type**: `application/json`
- **Response Format**: All responses wrapped in `ApiResponse` envelope

---

## Common Response Structure

### Success Response

```json
{
  "message": "Operation successful",
  "status": "SUCCESS",
  "data": {},
  "errors": null
}
```

### Error Response

```json
{
  "message": "Error description",
  "status": "ERROR",
  "data": null,
  "errors": [
    {
      "field": "fieldName",
      "message": "Error message"
    }
  ]
}
```

### Paginated Response

```json
{
  "message": "Close payments retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [],
    "totalElements": 100,
    "totalPages": 10,
    "currentPage": 0,
    "pageSize": 20,
    "hasNext": true,
    "hasPrevious": false
  },
  "errors": null
}
```

---

## Endpoints

### 1. List All Close Payments

Retrieves a paginated list of close payments with advanced filtering options.

**Endpoint**: `GET /`  
**Permission**: `treasury:close-payment:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `search` (string, optional): Search keyword to filter by customer ID, name, invoice/transaction numbers
- `paymentStatus` (int, optional): Filter by payment status (0=Unpaid, 1=Paid)
- `postingA8Status` (int, optional): Filter by A8 posting status (0/1/2/5)
- `invoiceDate` (date, optional): Exact invoice date (YYYY-MM-DD)
- `startInvoiceDate` (date, optional): Invoice date range start (YYYY-MM-DD)
- `endInvoiceDate` (date, optional): Invoice date range end (YYYY-MM-DD)
- `dueDate` (date, optional): Exact due date (YYYY-MM-DD)
- `startDueDate` (date, optional): Due date range start (YYYY-MM-DD)
- `endDueDate` (date, optional): Due date range end (YYYY-MM-DD)
- `paymentDate` (date, optional): Exact payment date (YYYY-MM-DD)
- `startPaymentDate` (date, optional): Payment date range start (YYYY-MM-DD)
- `endPaymentDate` (date, optional): Payment date range end (YYYY-MM-DD)
- `createdAt` (date, optional): Exact created date (YYYY-MM-DD)
- `startCreatedAt` (date, optional): Created date range start (YYYY-MM-DD)
- `endCreatedAt` (date, optional): Created date range end (YYYY-MM-DD)
- `updatedAt` (date, optional): Exact updated date (YYYY-MM-DD)
- `startUpdatedAt` (date, optional): Updated date range start (YYYY-MM-DD)
- `endUpdatedAt` (date, optional): Updated date range end (YYYY-MM-DD)
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 20): Items per page
- `sort` (string, optional): Sort criteria (e.g., "updatedAt,desc")

#### Response (200 OK)

```json
{
  "message": "Close payments retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "custId": "CUST001",
        "name": "PT Maju Jaya",
        "transId": "TRX20260316001",
        "invoiceNumber": "INV-2026-001",
        "ppfNumber": "PPF-2026-001",
        "paymentDate": "2026-03-20T10:30:00",
        "invoiceDate": "2026-03-01T08:00:00",
        "printDate": "2026-03-20T11:00:00",
        "dueDate": "2026-04-01T23:59:59",
        "amount": 5000000.0,
        "paymentAmount": 5000000.0,
        "vatAmount": 0.0,
        "whtAmount": 50000.0,
        "bankCode": "BNI",
        "bankAccountNumber": "0012345678",
        "bankAccountHolder": "PT Maju Jaya",
        "paymentType": "TRANSFER",
        "bankRuleId": 1,
        "source": 0,
        "paymentStatus": 1,
        "postingA8Status": 2,
        "createdAt": "2026-03-15T09:00:00",
        "updatedAt": "2026-03-20T10:30:00",
        "createdBy": "user@example.com",
        "updatedBy": "user@example.com"
      }
    ],
    "totalElements": 150,
    "totalPages": 8,
    "currentPage": 0,
    "pageSize": 20,
    "hasNext": true,
    "hasPrevious": false
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Invalid pagination or filter parameters
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 2. Get Close Payment by ID

Retrieves a specific close payment by its ID.

**Endpoint**: `GET /{id}`  
**Permission**: `treasury:close-payment:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Close payment ID (required)

#### Response (200 OK)

```json
{
  "message": "Close payment retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "custId": "CUST001",
    "name": "PT Maju Jaya",
    "transId": "TRX20260316001",
    "invoiceNumber": "INV-2026-001",
    "ppfNumber": "PPF-2026-001",
    "paymentDate": "2026-03-20T10:30:00",
    "invoiceDate": "2026-03-01T08:00:00",
    "printDate": "2026-03-20T11:00:00",
    "dueDate": "2026-04-01T23:59:59",
    "amount": 5000000.0,
    "paymentAmount": 5000000.0,
    "vatAmount": 0.0,
    "whtAmount": 50000.0,
    "bankCode": "BNI",
    "bankAccountNumber": "0012345678",
    "bankAccountHolder": "PT Maju Jaya",
    "paymentType": "TRANSFER",
    "bankRuleId": 1,
    "source": 0,
    "paymentStatus": 1,
    "postingA8Status": 2,
    "createdAt": "2026-03-15T09:00:00",
    "updatedAt": "2026-03-20T10:30:00",
    "createdBy": "user@example.com",
    "updatedBy": "user@example.com"
  },
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Close payment does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 3. Create Close Payment

Creates a new close payment transaction.

**Endpoint**: `POST /`  
**Permission**: `treasury:close-payment:create`  
**Authentication**: Required (Bearer Token)

#### Request

```json
{
  "custId": "CUST001",
  "name": "PT Maju Jaya",
  "transId": "TRX20260316001",
  "invoiceNumber": "INV-2026-001",
  "ppfNumber": "PPF-2026-001",
  "paymentDate": "2026-03-20T10:30:00",
  "invoiceDate": "2026-03-01T08:00:00",
  "printDate": "2026-03-20T11:00:00",
  "dueDate": "2026-04-01T23:59:59",
  "amount": 5000000.0,
  "paymentAmount": 5000000.0,
  "vatAmount": 0.0,
  "whtAmount": 50000.0,
  "bankCode": "BNI",
  "bankAccountNumber": "0012345678",
  "bankAccountHolder": "PT Maju Jaya",
  "paymentType": "TRANSFER",
  "bankRuleId": 1,
  "source": 0,
  "paymentStatus": 1,
  "postingA8Status": 0
}
```

#### Request Validations

- `amount`: Required, must be greater than 0
- `paymentAmount`: Required, must be greater than 0
- `vatAmount`: Optional, cannot be negative (default 0)
- `whtAmount`: Optional, cannot be negative (default 0)
- `paymentStatus`: Required, values: 0 (Unpaid) or 1 (Paid)
- `postingA8Status`: Required, values: 0, 1, 2, or 5
- `source`: Required, values: 0 (Desktop) or 1 (Collection Web)
- Other string fields: Optional, appropriate max lengths enforced

#### Response (201 Created)

```json
{
  "message": "Close payment created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "custId": "CUST001",
    "name": "PT Maju Jaya",
    "transId": "TRX20260316001",
    "invoiceNumber": "INV-2026-001",
    "ppfNumber": "PPF-2026-001",
    "paymentDate": "2026-03-20T10:30:00",
    "invoiceDate": "2026-03-01T08:00:00",
    "printDate": "2026-03-20T11:00:00",
    "dueDate": "2026-04-01T23:59:59",
    "amount": 5000000.0,
    "paymentAmount": 5000000.0,
    "vatAmount": 0.0,
    "whtAmount": 50000.0,
    "bankCode": "BNI",
    "bankAccountNumber": "0012345678",
    "bankAccountHolder": "PT Maju Jaya",
    "paymentType": "TRANSFER",
    "bankRuleId": 1,
    "source": 0,
    "paymentStatus": 1,
    "postingA8Status": 0,
    "createdAt": "2026-03-15T09:00:00",
    "updatedAt": "2026-03-15T09:00:00",
    "createdBy": "user@example.com",
    "updatedBy": "user@example.com"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors (invalid amounts, invalid status values)
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 4. Update Close Payment

Updates an existing close payment transaction.

**Endpoint**: `PUT /{id}`  
**Permission**: `treasury:close-payment:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Close payment ID (required)

#### Request

```json
{
  "custId": "CUST001",
  "name": "PT Maju Jaya Updated",
  "transId": "TRX20260316001",
  "invoiceNumber": "INV-2026-001",
  "ppfNumber": "PPF-2026-001",
  "paymentDate": "2026-03-20T10:30:00",
  "invoiceDate": "2026-03-01T08:00:00",
  "printDate": "2026-03-20T11:00:00",
  "dueDate": "2026-04-01T23:59:59",
  "amount": 5500000.0,
  "paymentAmount": 5500000.0,
  "vatAmount": 100000.0,
  "whtAmount": 55000.0,
  "bankCode": "BNI",
  "bankAccountNumber": "0012345678",
  "bankAccountHolder": "PT Maju Jaya",
  "paymentType": "TRANSFER",
  "bankRuleId": 1,
  "source": 0,
  "paymentStatus": 1,
  "postingA8Status": 2
}
```

#### Response (200 OK)

```json
{
  "message": "Close payment updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "custId": "CUST001",
    "name": "PT Maju Jaya Updated",
    "transId": "TRX20260316001",
    "invoiceNumber": "INV-2026-001",
    "ppfNumber": "PPF-2026-001",
    "paymentDate": "2026-03-20T10:30:00",
    "invoiceDate": "2026-03-01T08:00:00",
    "printDate": "2026-03-20T11:00:00",
    "dueDate": "2026-04-01T23:59:59",
    "amount": 5500000.0,
    "paymentAmount": 5500000.0,
    "vatAmount": 100000.0,
    "whtAmount": 55000.0,
    "bankCode": "BNI",
    "bankAccountNumber": "0012345678",
    "bankAccountHolder": "PT Maju Jaya",
    "paymentType": "TRANSFER",
    "bankRuleId": 1,
    "source": 0,
    "paymentStatus": 1,
    "postingA8Status": 2,
    "createdAt": "2026-03-15T09:00:00",
    "updatedAt": "2026-03-20T14:30:00",
    "createdBy": "user@example.com",
    "updatedBy": "user@example.com"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors
- **404 Not Found**: Close payment does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 5. Update Payment Status

Updates the payment status of a close payment.

**Endpoint**: `PUT /{id}/payment-status`  
**Permission**: `treasury:close-payment:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Close payment ID (required)

#### Query Parameters

- `paymentStatus` (int, required): New payment status (0=Unpaid, 1=Paid)

#### Response (200 OK)

```json
{
  "message": "Payment status updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "custId": "CUST001",
    "name": "PT Maju Jaya",
    "transId": "TRX20260316001",
    "invoiceNumber": "INV-2026-001",
    "ppfNumber": "PPF-2026-001",
    "paymentDate": "2026-03-20T10:30:00",
    "invoiceDate": "2026-03-01T08:00:00",
    "printDate": "2026-03-20T11:00:00",
    "dueDate": "2026-04-01T23:59:59",
    "amount": 5000000.0,
    "paymentAmount": 5000000.0,
    "vatAmount": 0.0,
    "whtAmount": 50000.0,
    "bankCode": "BNI",
    "bankAccountNumber": "0012345678",
    "bankAccountHolder": "PT Maju Jaya",
    "paymentType": "TRANSFER",
    "bankRuleId": 1,
    "source": 0,
    "paymentStatus": 1,
    "postingA8Status": 2,
    "createdAt": "2026-03-15T09:00:00",
    "updatedAt": "2026-03-20T10:30:00",
    "createdBy": "user@example.com",
    "updatedBy": "user@example.com"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Invalid payment status value
- **404 Not Found**: Close payment does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 6. Update A8 Posting Status

Updates the A8 posting status of a close payment.

**Endpoint**: `PUT /{id}/posting-a8-status`  
**Permission**: `treasury:close-payment:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Close payment ID (required)

#### Query Parameters

- `postingA8Status` (int, required): New A8 posting status (0/1/2/5)

#### Response (200 OK)

```json
{
  "message": "A8 posting status updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "custId": "CUST001",
    "name": "PT Maju Jaya",
    "transId": "TRX20260316001",
    "invoiceNumber": "INV-2026-001",
    "ppfNumber": "PPF-2026-001",
    "paymentDate": "2026-03-20T10:30:00",
    "invoiceDate": "2026-03-01T08:00:00",
    "printDate": "2026-03-20T11:00:00",
    "dueDate": "2026-04-01T23:59:59",
    "amount": 5000000.0,
    "paymentAmount": 5000000.0,
    "vatAmount": 0.0,
    "whtAmount": 50000.0,
    "bankCode": "BNI",
    "bankAccountNumber": "0012345678",
    "bankAccountHolder": "PT Maju Jaya",
    "paymentType": "TRANSFER",
    "bankRuleId": 1,
    "source": 0,
    "paymentStatus": 1,
    "postingA8Status": 2,
    "createdAt": "2026-03-15T09:00:00",
    "updatedAt": "2026-03-20T10:30:00",
    "createdBy": "user@example.com",
    "updatedBy": "user@example.com"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Invalid A8 posting status value
- **404 Not Found**: Close payment does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 7. Delete Close Payment

Deletes a close payment by ID.

**Endpoint**: `DELETE /{id}`  
**Permission**: `treasury:close-payment:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Close payment ID (required)

#### Response (200 OK)

```json
{
  "message": "Close payment deleted successfully",
  "status": "SUCCESS",
  "data": "Close payment deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Close payment does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 8. Count Unpaid Payments

Gets the count of unpaid close payments.

**Endpoint**: `GET /summary/unpaid-count`  
**Permission**: `treasury:close-payment:list`  
**Authentication**: Required (Bearer Token)

#### Response (200 OK)

```json
{
  "message": "Unpaid payments count retrieved successfully",
  "status": "SUCCESS",
  "data": 45,
  "errors": null
}
```

#### Error Responses

- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 9. Count by Payment Status

Gets the count of close payments filtered by payment status.

**Endpoint**: `GET /summary/count-by-status`  
**Permission**: `treasury:close-payment:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `paymentStatus` (int, required): Payment status to filter by (0=Unpaid, 1=Paid)

#### Response (200 OK)

```json
{
  "message": "Payment count retrieved successfully",
  "status": "SUCCESS",
  "data": 120,
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Invalid payment status value
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Required Permissions Summary

| Operation                 | Permission                      |
| ------------------------- | ------------------------------- |
| List Close Payments       | `treasury:close-payment:list`   |
| Read Close Payment        | `treasury:close-payment:read`   |
| Create Close Payment      | `treasury:close-payment:create` |
| Update Close Payment      | `treasury:close-payment:update` |
| Delete Close Payment      | `treasury:close-payment:delete` |
| Get Payment Count Summary | `treasury:close-payment:list`   |

---

## Data Type Reference

| Type          | Format              | Example             |
| ------------- | ------------------- | ------------------- |
| Long          | Integer             | 1                   |
| String        | Text                | "CUST001"           |
| BigDecimal    | Decimal (19,2)      | 5000000.00          |
| Short         | Integer             | 0, 1, 2             |
| LocalDate     | Date (YYYY-MM-DD)   | 2026-03-01          |
| LocalDateTime | DateTime (ISO 8601) | 2026-03-01T08:00:00 |
| Boolean       | true/false          | true                |

---

## Status Codes

| Code | Description                                       |
| ---- | ------------------------------------------------- |
| 200  | OK - Request successful                           |
| 201  | Created - Resource created successfully           |
| 400  | Bad Request - Validation errors                   |
| 401  | Unauthorized - Missing/invalid authentication     |
| 403  | Forbidden - Insufficient permissions              |
| 404  | Not Found - Resource does not exist               |
| 409  | Conflict - Duplicate resource (unique constraint) |
| 500  | Internal Server Error - Unexpected server error   |

---

## Enumerations

### Payment Status (paymentStatus)

| Value | Code   | Description                                   |
| ----- | ------ | --------------------------------------------- |
| 0     | UNPAID | Belum Dibayar (Payment not yet received)      |
| 1     | PAID   | Sudah Dibayar (Payment successfully received) |

### A8 Posting Status (postingA8Status)

| Value | Code    | Description                                |
| ----- | ------- | ------------------------------------------ |
| 0     | PENDING | Belum Tergenerate (Not yet generated)      |
| 1     | PARTIAL | Tergenerate Sebagian (Partially generated) |
| 2     | SUCCESS | Sukses Tergenerate (Successfully posted)   |
| 5     | FAILED  | Gagal Generate (Generation failed)         |

### Payment Source (source)

| Value | Code           | Description                         |
| ----- | -------------- | ----------------------------------- |
| 0     | DESKTOP        | Payment entered through desktop app |
| 1     | COLLECTION_WEB | Payment received via web portal     |

### Payment Type

| Type        | Description              |
| ----------- | ------------------------ |
| TRANSFER    | Bank transfer/electronic |
| CASH        | Cash payment             |
| CHECK       | Check payment            |
| GIRO        | Giro payment             |
| DEBIT_CARD  | Debit card payment       |
| CREDIT_CARD | Credit card payment      |
| E_WALLET    | E-wallet payment         |
| OTHER       | Other payment methods    |

---

## Notes

1. **Unique Constraints**: Close payment can have unique constraint on (custId, transId, invoiceNumber, ppfNumber) combination

2. **Amount Validation**:
   - `amount`: Total invoice amount (must be > 0)
   - `paymentAmount`: Actual amount paid (must be > 0)
   - `vatAmount`: VAT portion (>= 0)
   - `whtAmount`: Withholding tax portion (>= 0)
   - Relationship: `amount` ≈ `paymentAmount` + `vatAmount` + `whtAmount`

3. **Date Validation**:
   - `invoiceDate` should typically be before or equal to `paymentDate`
   - `dueDate` should typically be after `invoiceDate`
   - `printDate` should be equal to or after `paymentDate`

4. **Payment Status Tracking**:
   - Status 0 (Unpaid) indicates payment is pending
   - Status 1 (Paid) indicates payment has been received
   - Transition between statuses is tracked for audit purposes

5. **A8 Posting Status**:
   - Used for tracking automatic posting to A8 system (Indonesian tax reporting)
   - Status 2 (SUCCESS) indicates successful posting
   - Status 5 (FAILED) indicates failed posting that may need manual intervention

6. **Bank Rule Reference**:
   - `bankRuleId` is an integer that links to banking rules/gateway configurations
   - Integer ID represents specific bank rules (e.g., 1=BNI rule, 2=BCA rule, etc.)
   - Defines how payments are processed through specific banks

7. **Source Tracking**:
   - Distinguishes between payments entered manually (Desktop) vs. collected via portal
   - Important for audit and reconciliation

8. **Filtering**:
   - Date range filters: Either use single date OR start/end date pair
   - Range filters take precedence if both single and range dates are provided
   - Search parameter is case-insensitive and matches partial strings

9. **Default Sorting**: When sort is not specified, results are sorted by updatedAt in descending order

10. **Pagination**: Default page size is 20 items, maximum configurable per system settings

11. **Audit Fields**: All resources include `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` for audit and compliance purposes

12. **Bank Code Standards**: Must reference valid banks in the bank master data
    - Example: BNI, BCA, MANDIRI, BRI, CIMB, etc.

13. **Customer Identification**:
    - `custId` is the customer identifier/code
    - `name` is the customer or payment recipient name
    - At least one should be provided for tracking

14. **Transaction References**:
    - `transId`: Internal transaction identifier
    - `invoiceNumber`: Invoice reference for matching
    - `ppfNumber`: Proof of Payment/Payment File number
    - Helps with reconciliation and tracking
