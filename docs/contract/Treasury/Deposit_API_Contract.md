# Deposit API Contract

## Overview

The Deposit API provides endpoints for managing deposit transactions within the treasury system. The API supports comprehensive deposit tracking including agent information, virtual account details, deposit amounts, and send status management. The API uses JWT authentication with permission-based access control for secure deposit management.

---

## Base Information

- **Base URL**: `/api/treasury/deposit`
- **Authentication**: Bearer JWT Token
- **Content-Type**: `application/json` (multipart/form-data for file uploads)
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
  "message": "Deposits retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [],
    "totalElements": 100,
    "totalPages": 10,
    "currentPage": 0,
    "pageSize": 10,
    "hasNext": true,
    "hasPrevious": false
  },
  "errors": null
}
```

---

## Endpoints

### 1. List All Deposits

Retrieves a paginated list of deposits with advanced filtering options.

**Endpoint**: `GET /`  
**Permission**: `treasury:incoming-payment:open-payment:deposit:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `search` (string, optional): Search keyword to filter by agent code, name, virtual account, or reference number
- `agentCode` (string, optional): Filter by agent code
- `bankCode` (string, optional): Filter by bank code
- `sendStatus` (int, optional): Filter by send status (0=Not Sent, 1=Sent)
- `startDate` (datetime, optional): Deposit date range start (ISO 8601 format)
- `endDate` (datetime, optional): Deposit date range end (ISO 8601 format)
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, optional): Sort criteria (default: "depositDate,desc")

#### Response (200 OK)

```json
{
  "message": "Deposits retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "agentCode": "AG001",
        "virtualAccount": "VA001234567890",
        "name": "PT Maju Jaya",
        "referenceNumber": "REF20260320001",
        "depositDate": "2026-03-20T10:30:00",
        "openingBalance": 10000000.0,
        "amount": 5000000.0,
        "closingBalance": 15000000.0,
        "bankCode": "BNI",
        "documentPath": "/deposits/deposit-20260320-001.pdf",
        "sendStatus": 0,
        "createdAt": "2026-03-20T09:00:00",
        "updatedAt": "2026-03-20T09:00:00",
        "createdBy": "user@example.com",
        "updatedBy": "user@example.com"
      }
    ],
    "totalElements": 150,
    "totalPages": 15,
    "currentPage": 0,
    "pageSize": 10,
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

### 2. Get Deposits by Agent Code

Retrieves all deposits for a specific agent.

**Endpoint**: `GET /agent/{agentCode}`  
**Permission**: `treasury:incoming-payment:open-payment:deposit:list`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `agentCode` (string): Agent code (required)

#### Response (200 OK)

```json
{
  "message": "Deposits retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "agentCode": "AG001",
      "virtualAccount": "VA001234567890",
      "name": "PT Maju Jaya",
      "referenceNumber": "REF20260320001",
      "depositDate": "2026-03-20T10:30:00",
      "openingBalance": 10000000.0,
      "amount": 5000000.0,
      "closingBalance": 15000000.0,
      "bankCode": "BNI",
      "documentPath": "/deposits/deposit-20260320-001.pdf",
      "sendStatus": 0,
      "createdAt": "2026-03-20T09:00:00",
      "updatedAt": "2026-03-20T09:00:00",
      "createdBy": "user@example.com",
      "updatedBy": "user@example.com"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 3. Get Deposits by Bank Code

Retrieves all deposits for a specific bank.

**Endpoint**: `GET /bank/{bankCode}`  
**Permission**: `treasury:incoming-payment:open-payment:deposit:list`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `bankCode` (string): Bank code (required)

#### Response (200 OK)

```json
{
  "message": "Deposits retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "agentCode": "AG001",
      "virtualAccount": "VA001234567890",
      "name": "PT Maju Jaya",
      "referenceNumber": "REF20260320001",
      "depositDate": "2026-03-20T10:30:00",
      "openingBalance": 10000000.0,
      "amount": 5000000.0,
      "closingBalance": 15000000.0,
      "bankCode": "BNI",
      "documentPath": "/deposits/deposit-20260320-001.pdf",
      "sendStatus": 0,
      "createdAt": "2026-03-20T09:00:00",
      "updatedAt": "2026-03-20T09:00:00",
      "createdBy": "user@example.com",
      "updatedBy": "user@example.com"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 4. Get Deposits by Send Status

Retrieves deposits with a specific send status.

**Endpoint**: `GET /status/{sendStatus}`  
**Permission**: `treasury:incoming-payment:open-payment:deposit:list`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `sendStatus` (int): Send status (0=Not Sent, 1=Sent) (required)

#### Response (200 OK)

```json
{
  "message": "Deposits retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "agentCode": "AG001",
      "virtualAccount": "VA001234567890",
      "name": "PT Maju Jaya",
      "referenceNumber": "REF20260320001",
      "depositDate": "2026-03-20T10:30:00",
      "openingBalance": 10000000.0,
      "amount": 5000000.0,
      "closingBalance": 15000000.0,
      "bankCode": "BNI",
      "documentPath": "/deposits/deposit-20260320-001.pdf",
      "sendStatus": 0,
      "createdAt": "2026-03-20T09:00:00",
      "updatedAt": "2026-03-20T09:00:00",
      "createdBy": "user@example.com",
      "updatedBy": "user@example.com"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Invalid send status value
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 5. Get Deposit by ID

Retrieves a specific deposit by its ID.

**Endpoint**: `GET /{id}`  
**Permission**: `treasury:incoming-payment:open-payment:deposit:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Deposit ID (required)

#### Response (200 OK)

```json
{
  "message": "Deposit retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "agentCode": "AG001",
    "virtualAccount": "VA001234567890",
    "name": "PT Maju Jaya",
    "referenceNumber": "REF20260320001",
    "depositDate": "2026-03-20T10:30:00",
    "openingBalance": 10000000.0,
    "amount": 5000000.0,
    "closingBalance": 15000000.0,
    "bankCode": "BNI",
    "documentPath": "/deposits/deposit-20260320-001.pdf",
    "sendStatus": 0,
    "createdAt": "2026-03-20T09:00:00",
    "updatedAt": "2026-03-20T09:00:00",
    "createdBy": "user@example.com",
    "updatedBy": "user@example.com"
  },
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Deposit does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 6. Get Deposit by Virtual Account

Retrieves a deposit using virtual account number.

**Endpoint**: `GET /virtual-account/{virtualAccount}`  
**Permission**: `treasury:incoming-payment:open-payment:deposit:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `virtualAccount` (string): Virtual account number (required)

#### Response (200 OK)

```json
{
  "message": "Deposit retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "agentCode": "AG001",
    "virtualAccount": "VA001234567890",
    "name": "PT Maju Jaya",
    "referenceNumber": "REF20260320001",
    "depositDate": "2026-03-20T10:30:00",
    "openingBalance": 10000000.0,
    "amount": 5000000.0,
    "closingBalance": 15000000.0,
    "bankCode": "BNI",
    "documentPath": "/deposits/deposit-20260320-001.pdf",
    "sendStatus": 0,
    "createdAt": "2026-03-20T09:00:00",
    "updatedAt": "2026-03-20T09:00:00",
    "createdBy": "user@example.com",
    "updatedBy": "user@example.com"
  },
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Deposit with given virtual account not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 7. Create Deposit

Creates a new deposit record.

**Endpoint**: `POST /`  
**Permission**: `treasury:incoming-payment:open-payment:deposit:update`  
**Authentication**: Required (Bearer Token)

#### Request

```json
{
  "agentCode": "AG001",
  "virtualAccount": "VA001234567890",
  "name": "PT Maju Jaya",
  "referenceNumber": "REF20260320001",
  "depositDate": "2026-03-20T10:30:00",
  "openingBalance": 10000000.0,
  "amount": 5000000.0,
  "closingBalance": 15000000.0,
  "bankCode": "BNI",
  "documentPath": null,
  "sendStatus": 0
}
```

#### Request Validations

- `agentCode`: Optional, max 50 characters
- `virtualAccount`: Optional, max 50 characters
- `name`: Optional, max 255 characters
- `referenceNumber`: Optional, max 100 characters
- `depositDate`: Optional, ISO 8601 format
- `openingBalance`: Optional, decimal (20,2), cannot be negative
- `amount`: Required, decimal (20,2), must be greater than 0 (@DecimalMin("0.01"))
- `closingBalance`: Optional, decimal (20,2), cannot be negative
- `bankCode`: Optional, max 20 characters
- `documentPath`: Optional, path to document file
- `sendStatus`: Required, values: 0 (Not Sent) or 1 (Sent)

#### Response (201 Created)

```json
{
  "message": "Deposit created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "agentCode": "AG001",
    "virtualAccount": "VA001234567890",
    "name": "PT Maju Jaya",
    "referenceNumber": "REF20260320001",
    "depositDate": "2026-03-20T10:30:00",
    "openingBalance": 10000000.0,
    "amount": 5000000.0,
    "closingBalance": 15000000.0,
    "bankCode": "BNI",
    "documentPath": null,
    "sendStatus": 0,
    "createdAt": "2026-03-20T09:00:00",
    "updatedAt": "2026-03-20T09:00:00",
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

### 8. Update Deposit

Updates an existing deposit record with optional file upload.

**Endpoint**: `PUT /{id}`  
**Permission**: `treasury:incoming-payment:open-payment:deposit:update`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `multipart/form-data`

#### URL Parameters

- `id` (Long): Deposit ID (required)

#### Form Parameters

- `requestDTO` (DepositRequestDTO, required): Deposit data as form field
- `document` (MultipartFile, optional): Deposit document file

#### Request

```json
{
  "agentCode": "AG001",
  "virtualAccount": "VA001234567890",
  "name": "PT Maju Jaya Updated",
  "referenceNumber": "REF20260320001",
  "depositDate": "2026-03-20T10:30:00",
  "openingBalance": 10500000.0,
  "amount": 5500000.0,
  "closingBalance": 16000000.0,
  "bankCode": "BNI",
  "documentPath": "/deposits/deposit-20260320-001.pdf",
  "sendStatus": 0
}
```

#### File Upload Details

- **Supported Formats**: PDF, JPG, JPEG, PNG
- **Max File Size**: 5MB
- **Storage Location**: `/deposits` folder
- **Parameter Name**: `document` (optional)

#### Response (200 OK)

```json
{
  "message": "Deposit updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "agentCode": "AG001",
    "virtualAccount": "VA001234567890",
    "name": "PT Maju Jaya Updated",
    "referenceNumber": "REF20260320001",
    "depositDate": "2026-03-20T10:30:00",
    "openingBalance": 10500000.0,
    "amount": 5500000.0,
    "closingBalance": 16000000.0,
    "bankCode": "BNI",
    "documentPath": "/deposits/deposit-20260320-001-updated.pdf",
    "sendStatus": 0,
    "createdAt": "2026-03-20T09:00:00",
    "updatedAt": "2026-03-20T10:30:00",
    "createdBy": "user@example.com",
    "updatedBy": "user@example.com"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors or invalid file format/size
- **404 Not Found**: Deposit does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 9. Update Deposit Send Status (Single)

Updates the send status for a single deposit.

**Endpoint**: `PUT /{id}/send-status`  
**Permission**: `treasury:incoming-payment:open-payment:deposit:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Deposit ID (required)

#### Query Parameters

- `sendStatus` (int, required): New send status (0=Not Sent, 1=Sent)

#### Response (200 OK)

```json
{
  "message": "Send status updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "agentCode": "AG001",
    "virtualAccount": "VA001234567890",
    "name": "PT Maju Jaya",
    "referenceNumber": "REF20260320001",
    "depositDate": "2026-03-20T10:30:00",
    "openingBalance": 10000000.0,
    "amount": 5000000.0,
    "closingBalance": 15000000.0,
    "bankCode": "BNI",
    "documentPath": "/deposits/deposit-20260320-001.pdf",
    "sendStatus": 1,
    "createdAt": "2026-03-20T09:00:00",
    "updatedAt": "2026-03-20T11:00:00",
    "createdBy": "user@example.com",
    "updatedBy": "user@example.com"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Invalid send status value
- **404 Not Found**: Deposit does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 10. Update Deposit Send Status (Bulk)

Updates send status for multiple deposits.

**Endpoint**: `PUT /send-status/bulk`  
**Permission**: `treasury:incoming-payment:open-payment:deposit:update`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `sendStatus` (int, required): New send status for all deposits (0=Not Sent, 1=Sent)

#### Request

```json
[1, 2, 3, 4, 5]
```

#### Response (200 OK)

```json
{
  "message": "5 records updated successfully",
  "status": "SUCCESS",
  "data": "5 records updated successfully",
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Invalid send status value or empty ID list
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 11. Delete Deposit

Deletes a deposit record.

**Endpoint**: `DELETE /{id}`  
**Permission**: `treasury:incoming-payment:open-payment:deposit:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Deposit ID (required)

#### Response (200 OK)

```json
{
  "message": "Deposit deleted successfully",
  "status": "SUCCESS",
  "data": "Deposit deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Deposit does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 12. Get Deposit Summary Statistics

Retrieves summary data including counts and totals for all deposits.

**Endpoint**: `GET /summary/stats`  
**Permission**: `treasury:incoming-payment:open-payment:deposit:list`  
**Authentication**: Required (Bearer Token)

#### Response (200 OK)

```json
{
  "message": "Summary retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "totalDeposits": 150,
    "depositsNotSent": 45,
    "depositsSent": 105,
    "totalAmount": 747500000.0
  },
  "errors": null
}
```

#### Error Responses

- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 13. Get Count by Send Status

Retrieves deposit counts grouped by send status.

**Endpoint**: `GET /summary/count-by-status`  
**Permission**: `treasury:incoming-payment:open-payment:deposit:list`  
**Authentication**: Required (Bearer Token)

#### Response (200 OK)

```json
{
  "message": "Count by status retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "totalDeposits": 150,
    "depositsNotSent": 45,
    "depositsSent": 105,
    "totalAmount": 747500000.0
  },
  "errors": null
}
```

#### Error Responses

- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Required Permissions Summary

| Operation                      | Permission                                              |
| ------------------------------ | ------------------------------------------------------- |
| List Deposits                  | `treasury:incoming-payment:open-payment:deposit:list`   |
| Read Deposit                   | `treasury:incoming-payment:open-payment:deposit:read`   |
| Create Deposit                 | `treasury:incoming-payment:open-payment:deposit:update` |
| Update Deposit                 | `treasury:incoming-payment:open-payment:deposit:update` |
| Update Send Status             | `treasury:incoming-payment:open-payment:deposit:update` |
| Delete Deposit                 | `treasury:incoming-payment:open-payment:deposit:update` |
| Get Deposit Summary Statistics | `treasury:incoming-payment:open-payment:deposit:list`   |

---

## Data Type Reference

| Type          | Format         | Example                       |
| ------------- | -------------- | ----------------------------- |
| Long          | Integer        | 1                             |
| String        | Text           | "AG001"                       |
| BigDecimal    | Decimal (20,2) | 5000000.00                    |
| Integer       | Integer        | 0, 1                          |
| DateTime      | ISO 8601       | 2026-03-20T10:30:00           |
| Boolean       | true/false     | true                          |
| MultipartFile | Binary file    | PDF, JPG, JPEG, PNG (max 5MB) |

---

## Status Codes

| Code | Description                                     |
| ---- | ----------------------------------------------- |
| 200  | OK - Request successful                         |
| 201  | Created - Resource created successfully         |
| 400  | Bad Request - Validation errors                 |
| 401  | Unauthorized - Missing/invalid authentication   |
| 403  | Forbidden - Insufficient permissions            |
| 404  | Not Found - Resource does not exist             |
| 500  | Internal Server Error - Unexpected server error |

---

## Enumerations

### Send Status (sendStatus)

| Value | Code     | Description                   |
| ----- | -------- | ----------------------------- |
| 0     | NOT_SENT | Belum Terkirim (Not sent)     |
| 1     | SENT     | Sudah Terkirim (Already sent) |

---

## Notes

1. **File Upload Support**:
   - File uploads are optional on the update endpoint
   - Only PDF and image files (JPG, JPEG, PNG) are allowed
   - Maximum file size is 5MB
   - Old document is automatically deleted when a new file is uploaded
   - Supports multipart/form-data content type

2. **Amount Validation**:
   - `amount`: Required, must be > 0.01
   - `openingBalance`: Optional, cannot be negative
   - `closingBalance`: Optional, cannot be negative
   - Balance fields should follow: closingBalance = openingBalance + amount

3. **Date Validation**:
   - `depositDate` should be in ISO 8601 format (YYYY-MM-DDTHH:MM:SS)
   - Typically represents when the deposit was received

4. **Send Status Tracking**:
   - Status 0 (Not Sent) indicates deposit is pending transmission
   - Status 1 (Sent) indicates deposit has been transmitted to the system
   - Bulk update available for changing status of multiple deposits

5. **Filtering and Search**:
   - Search parameter is case-insensitive and matches partial strings
   - Can search by: agentCode, name, virtualAccount, referenceNumber
   - Date range filters: Either use single date OR start/end date pair
   - Range filters take precedence if both single and range dates are provided

6. **Default Sorting**: When sort parameter is not specified, results are sorted by depositDate in descending order

7. **Pagination**: Default page size is 10 items

8. **Audit Fields**: All resources include `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` for audit and compliance purposes

9. **Agent and Bank References**:
   - `agentCode`: Agent identifier/code for deposit source
   - `bankCode`: Bank code (e.g., BNI, BCA, MANDIRI, BRI, CIMB)
   - Must reference valid bank master data

10. **Virtual Account**:
    - `virtualAccount`: Unique virtual account number for deposit collection
    - Used for tracking deposits from specific customers
    - Can be used as a unique lookup key

11. **Document Management**:
    - `documentPath`: File path to deposit supporting documents
    - Can be updated during deposit update operation
    - Old documents are automatically cleaned up when replaced
    - Supports PDF for official documents and images for receipts/proofs

12. **Document Storage**:
    - Files are stored in the `/deposits` folder
    - Storage handled by FileService (MinIO integration)
    - Supports modern cloud storage capabilities

13. **Business Rules**:
    - Deposits are typically created from external systems (bank feeds, batch imports)
    - Manual creation is supported but not the typical workflow
    - Send status helps track which deposits have been transmitted to downstream systems
    - Balance fields help with reconciliation and validation

14. **Unique Constraints**: Deposits should have unique constraint on virtualAccount when applicable

15. **Reference Fields**:
    - `referenceNumber`: External transaction reference for cross-system tracking
    - `virtualAccount`: Primary identifier for deposit collection
    - Together support multi-system reconciliation
