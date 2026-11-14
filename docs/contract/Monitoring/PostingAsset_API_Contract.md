# Posting Asset API Contract

## Overview

The Posting Asset API provides endpoints for managing individual asset posting records within the monitoring module. The API supports grouped views, detailed transaction lookups, CRUD operations, and status summary reporting. The API uses JWT authentication for secure access.

---

## Base Information

- **Base URL**: `/api/monitoring/posting/asset`
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
  "message": "Grouped posting assets retrieved successfully",
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

## Data Models

### PostingAssetGroup (List/Grouped Response)

| Field             | Type          | Description                                             |
| ----------------- | ------------- | ------------------------------------------------------- |
| sapStatus         | String (1)    | SAP posting status: `S`=Success, `C`=Created, `E`=Error |
| postingStatus     | Integer       | Internal status: `0`=Pending, `1`=Posted, `2`=Error     |
| reversalFlag      | String (1)    | Reversal flag: `A` or `B`                               |
| documentDate      | String        | Document date (YYYYMMDD format)                         |
| documentNumber    | String        | SAP document number (max 25)                            |
| reference         | String        | Reference number (max 50)                               |
| assignment        | String        | Assignment text (max 16)                                |
| sapDocumentNumber | String        | SAP-assigned document number (max 20)                   |
| fiscalYear        | Integer       | Fiscal year                                             |
| virtualAccount    | String        | Virtual account number (max 16)                         |
| createdAt         | LocalDateTime | Record creation timestamp                               |
| updatedAt         | LocalDateTime | Record last update timestamp                            |

### PostingAssetDTO (Detail/Create/Update)

| Field              | Type       | Required | Constraints                            |
| ------------------ | ---------- | -------- | -------------------------------------- |
| id                 | Long       | No       | Auto-generated                         |
| fileName           | String     | No       | Max 16 characters                      |
| recordNumber       | String     | No       | —                                      |
| transactionCode    | String     | Yes      | Max 4 characters                       |
| withholdingTax     | String     | No       | Max 5 characters                       |
| reversalFlag       | String     | Yes      | Must be `A` or `B`                     |
| documentType       | String     | Yes      | Max 2 characters                       |
| postingDate        | String     | Yes      | YYYYMMDD format                        |
| documentDate       | String     | Yes      | YYYYMMDD format                        |
| documentNumber     | String     | Yes      | Max 25 characters                      |
| reference          | String     | No       | Max 50 characters                      |
| debitCreditFlag    | String     | Yes      | Must be `S` or `H`                     |
| accountNumber      | String     | Yes      | Max 11 characters                      |
| alternativeAccount | String     | No       | Max 10 characters                      |
| amount             | BigDecimal | No       | Must be ≥ 0.01                         |
| businessArea       | String     | Yes      | Max 4 characters                       |
| segment            | String     | Yes      | Max 5 characters                       |
| fixedAssetNumber   | String     | Yes      | 1–7 characters                         |
| costCenter         | String     | Yes      | Max 10 characters                      |
| profitCenter       | String     | Yes      | Max 10 characters                      |
| internalOrderFlag  | String     | No       | Max 1 character, alphanumeric          |
| assignment         | String     | No       | Max 16 characters                      |
| vendorId           | String     | No       | Max 6 characters                       |
| customerId         | String     | No       | Max 6 characters                       |
| postingStatus      | Integer    | No       | `0`=Pending, `1`=Posted, `2`=Error     |
| postingTimestamp   | String     | No       | —                                      |
| sapStatus          | String     | No       | Must be `S`, `C`, or `E` (if provided) |
| sapDocumentNumber  | String     | No       | Max 20 characters                      |
| fiscalYear         | Integer    | No       | —                                      |
| virtualAccount     | String     | Yes      | Max 16 characters                      |
| recordIndex        | Integer    | Yes      | Must be ≥ 0                            |
| totalIndex         | Integer    | Yes      | Must be ≥ 0                            |
| assetAccountFlag   | String     | No       | Must be `0` or `1` (if provided)       |
| wwrvc              | String     | No       | Max 10 characters                      |
| kndnr              | String     | No       | Max 10 characters                      |
| wwprd              | String     | No       | Max 18 characters                      |

### PostingAssetStatusSummary

| Field           | Type | Description                    |
| --------------- | ---- | ------------------------------ |
| pendingCount    | long | Records with postingStatus = 0 |
| postedCount     | long | Records with postingStatus = 1 |
| errorCount      | long | Records with postingStatus = 2 |
| sapSuccessCount | long | Records with sapStatus = `S`   |
| sapErrorCount   | long | Records with sapStatus = `E`   |

---

## Endpoints

### 1. Get Grouped Posting Assets

Retrieves posting assets grouped by reversal flag, document number, and reference with pagination and filtering support.

**Endpoint**: `GET /`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

| Parameter         | Type      | Required | Description                                              |
| ----------------- | --------- | -------- | -------------------------------------------------------- |
| search            | String    | No       | Search by document number, reference, or virtual account |
| sapStatus         | String    | No       | Filter by SAP status (`S`, `C`, `E`)                     |
| reversalFlag      | String    | No       | Filter by reversal flag (`A` or `B`)                     |
| startPostingDate  | LocalDate | No       | Filter from posting date (inclusive, YYYY-MM-DD)         |
| endPostingDate    | LocalDate | No       | Filter to posting date (inclusive, YYYY-MM-DD)           |
| startEntryDate    | LocalDate | No       | Filter from entry/created date (inclusive)               |
| endEntryDate      | LocalDate | No       | Filter to entry/created date (inclusive)                 |
| startDocumentDate | LocalDate | No       | Filter from document date (inclusive)                    |
| endDocumentDate   | LocalDate | No       | Filter to document date (inclusive)                      |
| page              | int       | No       | Page number, 0-indexed (default: 0)                      |
| size              | int       | No       | Items per page (default: 20)                             |
| sort              | String    | No       | Sort criteria, e.g. `updatedAt,desc` (default)           |

#### Sortable Fields

`sapStatus`, `reversalFlag`, `documentDate`, `documentNumber`, `reference`, `assignment`, `sapDocumentNumber`, `fiscalYear`, `virtualAccount`, `createdAt`, `updatedAt`

#### Response (200 OK)

```json
{
  "message": "Grouped posting assets retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "sapStatus": "S",
        "postingStatus": 1,
        "reversalFlag": "A",
        "documentDate": "20260101",
        "documentNumber": "0000000001",
        "reference": "REF-001",
        "assignment": "ASSIGN001",
        "sapDocumentNumber": "SAP0000001",
        "fiscalYear": 2026,
        "virtualAccount": "VA0000000000001",
        "createdAt": "2026-05-01T08:00:00",
        "updatedAt": "2026-05-20T10:30:00"
      }
    ],
    "totalElements": 50,
    "totalPages": 3,
    "currentPage": 0,
    "pageSize": 20,
    "hasNext": true,
    "hasPrevious": false
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Invalid filter or pagination parameters
- **401 Unauthorized**: Missing/invalid authentication

---

### 2. Get Posting Asset Details by Transaction

Retrieves all posting asset records for a specific transaction identified by reversal flag, document number, and reference.

**Endpoint**: `GET /{reversalFlag}/{documentNumber}/{reference}`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

| Parameter      | Type   | Description                |
| -------------- | ------ | -------------------------- |
| reversalFlag   | String | Reversal flag (`A` or `B`) |
| documentNumber | String | Document number (max 25)   |
| reference      | String | Reference number (max 50)  |

#### Response (200 OK)

```json
{
  "message": "Posting asset details retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 5,
      "transactionCode": "AAAA",
      "withholdingTax": "WT001",
      "reversalFlag": "A",
      "documentType": "AA",
      "postingDate": "20260101",
      "documentDate": "20260101",
      "documentNumber": "0000000001",
      "reference": "REF-001",
      "debitCreditFlag": "S",
      "accountNumber": "12345678901",
      "alternativeAccount": "ALT001",
      "amount": 1000000.0,
      "businessArea": "AREA",
      "segment": "SEG01",
      "fixedAssetNumber": "0000001",
      "costCenter": "CC001",
      "profitCenter": "PC001",
      "internalOrderFlag": "I",
      "assignment": "ASSIGN001",
      "vendorId": "V00001",
      "customerId": "C00001",
      "postingStatus": 0,
      "sapStatus": null,
      "sapDocumentNumber": null,
      "fiscalYear": null,
      "virtualAccount": "VA0000000000001",
      "recordIndex": 1,
      "totalIndex": 1,
      "createdAt": "2026-05-20T08:00:00",
      "createdBy": "user@example.com",
      "updatedAt": "2026-05-20T08:00:00",
      "updatedBy": "user@example.com"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **401 Unauthorized**: Missing/invalid authentication

---

### 3. Get Posting Asset by ID

Retrieves a single posting asset record by its ID.

**Endpoint**: `GET /{id}`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

| Parameter | Type | Description      |
| --------- | ---- | ---------------- |
| id        | Long | Posting asset ID |

#### Response (200 OK)

```json
{
  "message": "Posting asset retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 5,
    "transactionCode": "AAAA",
    "withholdingTax": "WT001",
    "reversalFlag": "A",
    "documentType": "AA",
    "postingDate": "20260101",
    "documentDate": "20260101",
    "documentNumber": "0000000001",
    "reference": "REF-001",
    "debitCreditFlag": "S",
    "accountNumber": "12345678901",
    "alternativeAccount": "ALT001",
    "amount": 1000000.0,
    "businessArea": "AREA",
    "segment": "SEG01",
    "fixedAssetNumber": "0000001",
    "costCenter": "CC001",
    "profitCenter": "PC001",
    "internalOrderFlag": "I",
    "assignment": "ASSIGN001",
    "vendorId": "V00001",
    "customerId": "C00001",
    "postingStatus": 0,
    "sapStatus": null,
    "sapDocumentNumber": null,
    "fiscalYear": null,
    "virtualAccount": "VA0000000000001",
    "recordIndex": 1,
    "totalIndex": 1,
    "createdAt": "2026-05-20T08:00:00",
    "createdBy": "user@example.com",
    "updatedAt": "2026-05-20T08:00:00",
    "updatedBy": "user@example.com"
  },
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Posting asset does not exist
- **401 Unauthorized**: Missing/invalid authentication

---

### 4. Create Posting Asset

Creates a new posting asset record.

**Endpoint**: `POST /`  
**Authentication**: Required (Bearer Token)

#### Request Body

```json
{
  "transactionCode": "AAAA",
  "withholdingTax": "WT001",
  "reversalFlag": "A",
  "documentType": "AA",
  "postingDate": "20260101",
  "documentDate": "20260101",
  "documentNumber": "0000000001",
  "reference": "REF-001",
  "debitCreditFlag": "S",
  "accountNumber": "12345678901",
  "alternativeAccount": "ALT001",
  "amount": 1000000.0,
  "businessArea": "AREA",
  "segment": "SEG01",
  "fixedAssetNumber": "0000001",
  "costCenter": "CC001",
  "profitCenter": "PC001",
  "internalOrderFlag": "I",
  "assignment": "ASSIGN001",
  "vendorId": "V00001",
  "customerId": "C00001",
  "virtualAccount": "VA0000000000001",
  "recordIndex": 1,
  "totalIndex": 1
}
```

#### Request Validations

- `transactionCode`: Required, max 4 characters
- `reversalFlag`: Required, must be `A` or `B`
- `documentType`: Required, max 2 characters
- `postingDate`: Required, YYYYMMDD format
- `documentDate`: Required, YYYYMMDD format
- `documentNumber`: Required, max 25 characters
- `debitCreditFlag`: Required, must be `S` or `H`
- `accountNumber`: Required, max 11 characters
- `businessArea`: Required, max 4 characters
- `segment`: Required, max 5 characters
- `fixedAssetNumber`: Required, 1–7 characters
- `costCenter`: Required, max 10 characters
- `profitCenter`: Required, max 10 characters
- `virtualAccount`: Required, max 16 characters
- `recordIndex`: Required, must be ≥ 0
- `totalIndex`: Required, must be ≥ 0
- `withholdingTax`: Optional, max 5 characters
- `reference`: Optional, max 50 characters
- `alternativeAccount`: Optional, max 10 characters
- `amount`: Optional, must be ≥ 0.01 if provided
- `internalOrderFlag`: Optional, max 1 character, alphanumeric
- `assignment`: Optional, max 16 characters
- `vendorId`: Optional, max 6 characters
- `customerId`: Optional, max 6 characters
- `sapStatus`: Optional, must be `S`, `C`, or `E` if provided
- `assetAccountFlag`: Optional, must be `0` or `1` if provided

#### Response (201 Created)

```json
{
  "message": "Posting asset created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 5,
    "transactionCode": "AAAA",
    "reversalFlag": "A",
    "documentType": "AA",
    "postingDate": "20260101",
    "documentDate": "20260101",
    "documentNumber": "0000000001",
    "reference": "REF-001",
    "debitCreditFlag": "S",
    "accountNumber": "12345678901",
    "amount": 1000000.0,
    "businessArea": "AREA",
    "segment": "SEG01",
    "fixedAssetNumber": "0000001",
    "costCenter": "CC001",
    "profitCenter": "PC001",
    "virtualAccount": "VA0000000000001",
    "recordIndex": 1,
    "totalIndex": 1,
    "postingStatus": 0,
    "createdAt": "2026-05-20T08:00:00",
    "createdBy": "user@example.com",
    "updatedAt": "2026-05-20T08:00:00",
    "updatedBy": "user@example.com"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors
- **409 Conflict**: Duplicate document number and virtual account combination
- **401 Unauthorized**: Missing/invalid authentication

---

### 5. Update Posting Asset

Updates an existing posting asset record. Records that have been successfully posted to SAP (`postingStatus=1` and `sapStatus=S`) cannot be updated.

**Endpoint**: `PUT /{id}`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

| Parameter | Type | Description      |
| --------- | ---- | ---------------- |
| id        | Long | Posting asset ID |

#### Request Body

```json
{
  "transactionCode": "AAAA",
  "withholdingTax": "WT001",
  "reversalFlag": "A",
  "documentType": "AA",
  "postingDate": "20260101",
  "documentDate": "20260101",
  "documentNumber": "0000000001",
  "reference": "REF-001",
  "debitCreditFlag": "S",
  "accountNumber": "12345678901",
  "alternativeAccount": "ALT001",
  "amount": 2000000.0,
  "businessArea": "AREA",
  "segment": "SEG01",
  "fixedAssetNumber": "0000001",
  "costCenter": "CC001",
  "profitCenter": "PC001",
  "internalOrderFlag": "I",
  "assignment": "ASSIGN001",
  "vendorId": "V00001",
  "customerId": "C00001",
  "virtualAccount": "VA0000000000001",
  "recordIndex": 1,
  "totalIndex": 1
}
```

#### Response (200 OK)

```json
{
  "message": "Posting asset updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 5,
    "transactionCode": "AAAA",
    "reversalFlag": "A",
    "documentNumber": "0000000001",
    "reference": "REF-001",
    "amount": 2000000.0,
    "virtualAccount": "VA0000000000001",
    "recordIndex": 1,
    "totalIndex": 1,
    "postingStatus": 0,
    "updatedAt": "2026-05-20T10:30:00",
    "updatedBy": "user@example.com"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors
- **404 Not Found**: Posting asset does not exist
- **409 Conflict**: Record already posted to SAP (cannot be modified)
- **401 Unauthorized**: Missing/invalid authentication

---

### 6. Delete Posting Asset

Deletes a posting asset by ID. Records that have been successfully posted to SAP (`postingStatus=1` and `sapStatus=S`) cannot be deleted.

**Endpoint**: `DELETE /{id}`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

| Parameter | Type | Description      |
| --------- | ---- | ---------------- |
| id        | Long | Posting asset ID |

#### Response (200 OK)

```json
{
  "message": "Posting asset deleted successfully",
  "status": "SUCCESS",
  "data": 5,
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Posting asset does not exist
- **409 Conflict**: Record already posted to SAP (cannot be deleted)
- **401 Unauthorized**: Missing/invalid authentication

---

### 7. Get Posting Asset Status Summary

Returns aggregated counts of posting assets grouped by internal posting status and SAP status.

**Endpoint**: `GET /summary/status`  
**Authentication**: Required (Bearer Token)

#### Response (200 OK)

```json
{
  "message": "Posting asset status summary retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "pendingCount": 120,
    "postedCount": 85,
    "errorCount": 10,
    "sapSuccessCount": 80,
    "sapErrorCount": 15
  },
  "errors": null
}
```

#### Error Responses

- **401 Unauthorized**: Missing/invalid authentication

---

## Business Rules

1. **Duplicate Prevention**: Creating a posting asset with the same `documentNumber` and `virtualAccount` combination is rejected with a conflict error.
2. **SAP Lock**: Posting assets with `postingStatus=1` (Posted) AND `sapStatus=S` (Success) cannot be updated or deleted.
3. **Posting Status Values**: `0` = Pending, `1` = Posted, `2` = Error.
4. **SAP Status Values**: `S` = Success, `C` = Created, `E` = Error.
5. **Date Format**: `postingDate` and `documentDate` must be in `YYYYMMDD` format (e.g., `20260101`).
6. **Grouped List**: The `GET /` endpoint returns one row per unique `(reversalFlag, documentNumber, reference)` combination using aggregate values from all child records.
