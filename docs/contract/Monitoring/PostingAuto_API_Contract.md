# Posting Auto API Contract

## Overview

The Posting Auto API provides endpoints for managing automated batch posting records within the monitoring module. The API supports grouped views, detailed transaction lookups, CRUD operations, and status summary reporting. The API uses JWT authentication for secure access.

---

## Base Information

- **Base URL**: `/api/monitoring/posting/auto`
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
  "message": "Grouped posting autos retrieved successfully",
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

### PostingAutoGroup (List/Grouped Response)

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

### PostingAutoDTO (Detail/Create/Update)

| Field              | Type       | Required | Constraints                          |
| ------------------ | ---------- | -------- | ------------------------------------ |
| id                 | Long       | No       | Auto-generated                       |
| fileName           | String     | No       | Max 16 characters                    |
| recordNumber       | String     | No       | Max 4 characters                     |
| transactionCode    | String     | Yes      | Max 4 characters                     |
| withholdingTax     | String     | No       | Max 5 characters                     |
| reversalFlag       | String     | Yes      | Must be `A` or `B`                   |
| documentType       | String     | Yes      | Max 2 characters                     |
| postingDate        | String     | Yes      | YYYYMMDD format                      |
| documentDate       | String     | Yes      | YYYYMMDD format                      |
| documentNumber     | String     | Yes      | Max 25 characters                    |
| reference          | String     | No       | Max 50 characters                    |
| debitCreditFlag    | String     | Yes      | Must be `S` or `H`                   |
| accountNumber      | String     | Yes      | Max 10 characters                    |
| alternativeAccount | String     | No       | Max 10 characters                    |
| amount             | BigDecimal | No       | Must be ≥ 0.01 if provided           |
| businessArea       | String     | Yes      | Max 4 characters                     |
| segment            | String     | Yes      | Max 5 characters                     |
| fixedAssetNumber   | String     | Yes      | 1–7 characters                       |
| costCenter         | String     | Yes      | Max 10 characters                    |
| profitCenter       | String     | Yes      | Max 10 characters                    |
| internalOrderFlag  | String     | No       | Must be `Y` or `N` if provided       |
| assignment         | String     | No       | Max 16 characters                    |
| vendorId           | String     | No       | Max 6 characters                     |
| customerId         | String     | No       | Max 6 characters                     |
| postingStatus      | Integer    | No       | `0`=Pending, `1`=Posted, `2`=Error   |
| postingTimestamp   | String     | No       | —                                    |
| sapStatus          | String     | No       | Must be `S`, `C`, or `E` if provided |
| sapDocumentNumber  | String     | No       | Max 20 characters                    |
| fiscalYear         | Integer    | No       | —                                    |
| statusMessage1     | String     | No       | Max 100 characters                   |
| statusMessage2     | String     | No       | Max 100 characters                   |
| statusMessage3     | String     | No       | Max 100 characters                   |
| statusMessage4     | String     | No       | Max 100 characters                   |
| statusMessage5     | String     | No       | Max 100 characters                   |
| statusMessage6     | String     | No       | Max 100 characters                   |
| statusMessage7     | String     | No       | Max 100 characters                   |
| statusMessage8     | String     | No       | Max 100 characters                   |
| statusMessage9     | String     | No       | Max 100 characters                   |
| statusMessage10    | String     | No       | Max 100 characters                   |
| assetAccountFlag   | String     | No       | Must be `0` or `1` if provided       |
| recordIndex        | Integer    | Yes      | Must be ≥ 0                          |
| totalIndex         | Integer    | Yes      | Must be ≥ 0                          |
| virtualAccount     | String     | No       | Max 16 characters                    |
| createdAt          | String     | No       | Read-only, auto-set on create        |
| updatedAt          | String     | No       | Read-only, auto-set on update        |

### PostingAutoStatusSummary

| Field           | Type | Description                    |
| --------------- | ---- | ------------------------------ |
| pendingCount    | long | Records with postingStatus = 0 |
| postedCount     | long | Records with postingStatus = 1 |
| errorCount      | long | Records with postingStatus = 2 |
| sapSuccessCount | long | Records with sapStatus = `S`   |
| sapErrorCount   | long | Records with sapStatus = `E`   |
| sapCancelCount  | long | Records with sapStatus = `C`   |

---

## Endpoints

### 1. Get Grouped Posting Autos

Retrieves posting autos grouped by reversal flag, document number, and reference with pagination and filtering support.

**Endpoint**: `GET /`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

| Parameter         | Type      | Required | Description                                             |
| ----------------- | --------- | -------- | ------------------------------------------------------- |
| search            | String    | No       | Search by document number, business area, or assignment |
| sapStatus         | String    | No       | Filter by SAP status (`S`, `C`, `E`)                    |
| reversalFlag      | String    | No       | Filter by reversal flag (`A` or `B`)                    |
| postingStatus     | Integer   | No       | Filter by posting status (`0`, `1`, `2`)                |
| startPostingDate  | LocalDate | No       | Filter from posting date (inclusive, YYYY-MM-DD)        |
| endPostingDate    | LocalDate | No       | Filter to posting date (inclusive, YYYY-MM-DD)          |
| startEntryDate    | LocalDate | No       | Filter from entry/created date (inclusive)              |
| endEntryDate      | LocalDate | No       | Filter to entry/created date (inclusive)                |
| startDocumentDate | LocalDate | No       | Filter from document date (inclusive)                   |
| endDocumentDate   | LocalDate | No       | Filter to document date (inclusive)                     |
| page              | int       | No       | Page number, 0-indexed (default: 0)                     |
| size              | int       | No       | Items per page (default: 20)                            |
| sort              | String    | No       | Sort criteria, e.g. `updatedAt,desc` (default)          |

#### Sortable Fields

`sapStatus`, `reversalFlag`, `documentDate`, `documentNumber`, `reference`, `assignment`, `sapDocumentNumber`, `fiscalYear`, `virtualAccount`, `createdAt`, `updatedAt`

#### Response (200 OK)

```json
{
  "message": "Grouped posting autos retrieved successfully",
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

### 2. Get Posting Auto Details by Transaction

Retrieves all posting auto records for a specific transaction identified by reversal flag, document number, and reference.

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
  "message": "Posting auto details retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 10,
      "fileName": "FILE0001",
      "recordNumber": "0001",
      "transactionCode": "AAAA",
      "withholdingTax": "WT001",
      "reversalFlag": "A",
      "documentType": "AA",
      "postingDate": "20260101",
      "documentDate": "20260101",
      "documentNumber": "0000000001",
      "reference": "REF-001",
      "debitCreditFlag": "S",
      "accountNumber": "1234567890",
      "alternativeAccount": "ALT001",
      "amount": 1000000.0,
      "businessArea": "AREA",
      "segment": "SEG01",
      "fixedAssetNumber": "0000001",
      "costCenter": "CC001",
      "profitCenter": "PC001",
      "internalOrderFlag": "Y",
      "assignment": "ASSIGN001",
      "vendorId": "V00001",
      "customerId": "C00001",
      "postingStatus": 0,
      "sapStatus": null,
      "sapDocumentNumber": null,
      "fiscalYear": null,
      "assetAccountFlag": "0",
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

### 3. Get Posting Auto by ID

Retrieves a single posting auto record by its ID.

**Endpoint**: `GET /{id}`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

| Parameter | Type | Description     |
| --------- | ---- | --------------- |
| id        | Long | Posting auto ID |

#### Response (200 OK)

```json
{
  "message": "Posting auto retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 10,
    "fileName": "FILE0001",
    "recordNumber": "0001",
    "transactionCode": "AAAA",
    "withholdingTax": "WT001",
    "reversalFlag": "A",
    "documentType": "AA",
    "postingDate": "20260101",
    "documentDate": "20260101",
    "documentNumber": "0000000001",
    "reference": "REF-001",
    "debitCreditFlag": "S",
    "accountNumber": "1234567890",
    "alternativeAccount": "ALT001",
    "amount": 1000000.0,
    "businessArea": "AREA",
    "segment": "SEG01",
    "fixedAssetNumber": "0000001",
    "costCenter": "CC001",
    "profitCenter": "PC001",
    "internalOrderFlag": "Y",
    "assignment": "ASSIGN001",
    "vendorId": "V00001",
    "customerId": "C00001",
    "postingStatus": 0,
    "sapStatus": null,
    "sapDocumentNumber": null,
    "fiscalYear": null,
    "assetAccountFlag": "0",
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

- **404 Not Found**: Posting auto does not exist
- **401 Unauthorized**: Missing/invalid authentication

---

### 4. Create Posting Auto

Creates a new posting auto record.

**Endpoint**: `POST /`  
**Authentication**: Required (Bearer Token)

#### Request Body

```json
{
  "fileName": "FILE0001",
  "recordNumber": "0001",
  "transactionCode": "AAAA",
  "withholdingTax": "WT001",
  "reversalFlag": "A",
  "documentType": "AA",
  "postingDate": "20260101",
  "documentDate": "20260101",
  "documentNumber": "0000000001",
  "reference": "REF-001",
  "debitCreditFlag": "S",
  "accountNumber": "1234567890",
  "alternativeAccount": "ALT001",
  "amount": 1000000.0,
  "businessArea": "AREA",
  "segment": "SEG01",
  "fixedAssetNumber": "0000001",
  "costCenter": "CC001",
  "profitCenter": "PC001",
  "internalOrderFlag": "Y",
  "assignment": "ASSIGN001",
  "vendorId": "V00001",
  "customerId": "C00001",
  "assetAccountFlag": "0",
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
- `accountNumber`: Required, max 10 characters
- `businessArea`: Required, max 4 characters
- `segment`: Required, max 5 characters
- `fixedAssetNumber`: Required, 1–7 characters
- `costCenter`: Required, max 10 characters
- `profitCenter`: Required, max 10 characters
- `recordIndex`: Required, must be ≥ 0
- `totalIndex`: Required, must be ≥ 0
- `withholdingTax`: Optional, max 5 characters
- `reference`: Optional, max 50 characters
- `alternativeAccount`: Optional, max 10 characters
- `amount`: Optional, must be ≥ 0.01 if provided
- `internalOrderFlag`: Optional, must be `Y` or `N` if provided
- `assignment`: Optional, max 16 characters
- `vendorId`: Optional, max 6 characters
- `customerId`: Optional, max 6 characters
- `sapStatus`: Optional, must be `S`, `C`, or `E` if provided
- `assetAccountFlag`: Optional, must be `0` or `1` if provided

#### Response (201 Created)

```json
{
  "message": "Posting auto created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 10,
    "fileName": "FILE0001",
    "recordNumber": "0001",
    "transactionCode": "AAAA",
    "reversalFlag": "A",
    "documentType": "AA",
    "postingDate": "20260101",
    "documentDate": "20260101",
    "documentNumber": "0000000001",
    "reference": "REF-001",
    "debitCreditFlag": "S",
    "accountNumber": "1234567890",
    "amount": 1000000.0,
    "businessArea": "AREA",
    "segment": "SEG01",
    "fixedAssetNumber": "0000001",
    "costCenter": "CC001",
    "profitCenter": "PC001",
    "assetAccountFlag": "0",
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
- **409 Conflict**: Duplicate posting auto record
- **401 Unauthorized**: Missing/invalid authentication

---

### 5. Update Posting Auto

Updates an existing posting auto record. Records that have been successfully posted to SAP (`postingStatus=1` and `sapStatus=S`) cannot be updated.

**Endpoint**: `PUT /{id}`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

| Parameter | Type | Description     |
| --------- | ---- | --------------- |
| id        | Long | Posting auto ID |

#### Request Body

```json
{
  "fileName": "FILE0001",
  "recordNumber": "0001",
  "transactionCode": "AAAA",
  "withholdingTax": "WT001",
  "reversalFlag": "A",
  "documentType": "AA",
  "postingDate": "20260101",
  "documentDate": "20260101",
  "documentNumber": "0000000001",
  "reference": "REF-001",
  "debitCreditFlag": "S",
  "accountNumber": "1234567890",
  "alternativeAccount": "ALT001",
  "amount": 2000000.0,
  "businessArea": "AREA",
  "segment": "SEG01",
  "fixedAssetNumber": "0000001",
  "costCenter": "CC001",
  "profitCenter": "PC001",
  "internalOrderFlag": "Y",
  "assignment": "ASSIGN001",
  "vendorId": "V00001",
  "customerId": "C00001",
  "assetAccountFlag": "0",
  "recordIndex": 1,
  "totalIndex": 1
}
```

#### Response (200 OK)

```json
{
  "message": "Posting auto updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 10,
    "transactionCode": "AAAA",
    "reversalFlag": "A",
    "documentNumber": "0000000001",
    "reference": "REF-001",
    "amount": 2000000.0,
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
- **404 Not Found**: Posting auto does not exist
- **409 Conflict**: Record already posted to SAP (cannot be modified)
- **401 Unauthorized**: Missing/invalid authentication

---

### 6. Delete Posting Auto

Deletes a posting auto by ID. Records that have been successfully posted to SAP (`postingStatus=1` and `sapStatus=S`) cannot be deleted.

**Endpoint**: `DELETE /{id}`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

| Parameter | Type | Description     |
| --------- | ---- | --------------- |
| id        | Long | Posting auto ID |

#### Response (200 OK)

```json
{
  "message": "Posting auto deleted successfully",
  "status": "SUCCESS",
  "data": 10,
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Posting auto does not exist
- **409 Conflict**: Record already posted to SAP (cannot be deleted)
- **401 Unauthorized**: Missing/invalid authentication

---

### 7. Get Posting Auto Status Summary

Returns aggregated counts of posting auto records grouped by internal posting status and SAP status.

**Endpoint**: `GET /summary/status`  
**Authentication**: Required (Bearer Token)

#### Response (200 OK)

```json
{
  "message": "Posting auto status summary retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "pendingCount": 120,
    "postedCount": 85,
    "errorCount": 10,
    "sapSuccessCount": 80,
    "sapErrorCount": 15,
    "sapCancelCount": 5
  },
  "errors": null
}
```

#### Error Responses

- **401 Unauthorized**: Missing/invalid authentication

---

## Business Rules

1. **SAP Lock**: Posting auto records with `postingStatus=1` (Posted) AND `sapStatus=S` (Success) cannot be updated or deleted.
2. **Posting Status Values**: `0` = Pending, `1` = Posted, `2` = Error.
3. **SAP Status Values**: `S` = Success, `C` = Created/Cancel, `E` = Error.
4. **Reversal Flag Values**: `A` = Normal, `B` = Reversal.
5. **Date Format**: `postingDate` and `documentDate` must be in `YYYYMMDD` format (e.g., `20260101`).
6. **Grouping**: The list endpoint groups records by `reversalFlag`, `documentNumber`, and `reference`.
