# House Bank Master Data API Contract

## Overview

The House Bank Master Data API provides endpoints for managing house bank accounts (organization-owned bank accounts) within the system. The API supports comprehensive management of bank accounts used for transactions, fund management, and payment processing. House banks are linked to Bank master data and include ERP system integration codes. The API uses JWT authentication with permission-based access control for secure account management.

---

## Base Information

- **Base URL**: `/api/master/house-bank`
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
  "message": "House banks retrieved successfully",
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

### 1. List All House Banks

Retrieves a paginated list of house banks with optional search.

**Endpoint**: `GET /`  
**Permission**: `master-data:house-bank:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `search` (string, optional): Search keyword to filter by account ID, account number, account name, or ERP code
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, optional): Sort criteria (e.g., "id,asc")

#### Response (200 OK)

```json
{
  "message": "House banks retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "accountId": "HB-BCA-001",
        "accountNumber": "1234567890",
        "accountName": "PT Fintra - BCA Operasional",
        "companyCode": "PT_XYZ",
        "currencyCode": "IDR",
        "erpCode": "ERP-BCA1",
        "bank": {
          "id": 1,
          "name": "Bank Central Asia",
          "code": "BCA",
          "color": "#0066CC",
          "rtgsCode": "BCAINID31",
          "onlineCode": "014",
          "bifastCode": "014",
          "sknCode": "014",
          "isActive": true,
          "createdAt": "2026-02-01T10:00:00",
          "updatedAt": "2026-02-01T10:00:00",
          "createdBy": "admin",
          "updatedBy": "admin"
        },
        "isActive": true,
        "createdAt": "2026-02-01T10:30:00",
        "updatedAt": "2026-02-01T10:30:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      },
      {
        "id": 2,
        "accountId": "HB-MANDIRI-001",
        "accountNumber": "1234567890123",
        "accountName": "PT Fintra - MANDIRI Utama",
        "companyCode": "PT_ABC",
        "currencyCode": "IDR",
        "erpCode": "ERP-MAN1",
        "bank": {
          "id": 2,
          "name": "Bank Mandiri",
          "code": "MANDIRI",
          "color": "#FF6600",
          "rtgsCode": "BMRIIDJA",
          "onlineCode": "008",
          "bifastCode": "008",
          "sknCode": "008",
          "isActive": true,
          "createdAt": "2026-02-01T10:00:00",
          "updatedAt": "2026-02-01T10:00:00",
          "createdBy": "admin",
          "updatedBy": "admin"
        },
        "isActive": true,
        "createdAt": "2026-02-01T11:00:00",
        "updatedAt": "2026-02-01T11:00:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      }
    ],
    "totalElements": 6,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10,
    "hasNext": false,
    "hasPrevious": false
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Invalid pagination parameters
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 2. Get House Bank by ID

Retrieves a specific house bank by its ID.

**Endpoint**: `GET /{id}`  
**Permission**: `master-data:house-bank:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): House Bank ID (required)

#### Response (200 OK)

```json
{
  "message": "House bank retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "accountId": "HB-BCA-001",
    "accountNumber": "1234567890",
    "accountName": "PT Fintra - BCA Operasional",
    "companyCode": "PT_XYZ",
    "currencyCode": "IDR",
    "erpCode": "ERP-BCA1",
    "bank": {
      "id": 1,
      "name": "Bank Central Asia",
      "code": "BCA",
      "color": "#0066CC",
      "rtgsCode": "BCAINID31",
      "onlineCode": "014",
      "bifastCode": "014",
      "sknCode": "014",
      "isActive": true,
      "createdAt": "2026-02-01T10:00:00",
      "updatedAt": "2026-02-01T10:00:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    },
    "isActive": true,
    "createdAt": "2026-02-01T10:30:00",
    "updatedAt": "2026-02-01T10:30:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: House bank does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 3. Create House Bank

Creates a new house bank account.

**Endpoint**: `POST /`  
**Permission**: `master-data:house-bank:create`  
**Authentication**: Required (Bearer Token)

#### Request

```json
{
  "bankCode": "BCA",
  "companyCode": "PT_XYZ",
  "currencyCode": "IDR",
  "accountId": "HB-BCA-001",
  "accountNumber": "1234567890",
  "accountName": "PT Fintra - BCA Operasional",
  "erpCode": "ERP-BCA1"
}
```

#### Request Validations

- `bankCode`: Required, max 50 characters, must reference existing active Bank
- `companyCode`: Required, max 50 characters, identifies the company/organization
- `currencyCode`: Required, max 10 characters, identifies account currency
- `accountId`: Required, max 100 characters, must be unique
- `accountNumber`: Required, max 50 characters, must be unique
- `accountName`: Required, max 100 characters
- `erpCode`: Optional, max 50 characters, for ERP system integration

#### Response (201 Created)

```json
{
  "message": "House bank created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "accountId": "HB-BCA-001",
    "accountNumber": "1234567890",
    "accountName": "PT Fintra - BCA Operasional",
    "companyCode": "PT_XYZ",
    "currencyCode": "IDR",
    "erpCode": "ERP-BCA1",
    "bank": {
      "id": 1,
      "name": "Bank Central Asia",
      "code": "BCA",
      "color": "#0066CC",
      "rtgsCode": "BCAINID31",
      "onlineCode": "014",
      "bifastCode": "014",
      "sknCode": "014",
      "isActive": true,
      "createdAt": "2026-02-01T10:00:00",
      "updatedAt": "2026-02-01T10:00:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    },
    "isActive": true,
    "createdAt": "2026-02-01T10:30:00",
    "updatedAt": "2026-02-01T10:30:00",
    "createdBy": "user@example.com",
    "updatedBy": "user@example.com"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors (blank fields, invalid field values)
- **404 Not Found**: Bank with provided code does not exist
- **409 Conflict**: Duplicate account ID or account number
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 4. Update House Bank

Updates an existing house bank account.

**Endpoint**: `PUT /{id}`  
**Permission**: `master-data:house-bank:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): House Bank ID (required)

#### Request

```json
{
  "bankCode": "BCA",
  "companyCode": "PT_XYZ",
  "currencyCode": "IDR",
  "accountId": "HB-BCA-001",
  "accountNumber": "1234567890",
  "accountName": "PT Fintra - BCA Operasional",
  "erpCode": "ERP-BCA1",
  "isActive": true
}
```

#### Response (200 OK)

```json
{
  "message": "House bank updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "accountId": "HB-BCA-001",
    "accountNumber": "1234567890",
    "accountName": "PT Fintra - BCA Operasional",
    "companyCode": "PT_XYZ",
    "currencyCode": "IDR",
    "erpCode": "ERP-BCA1",
    "bank": {
      "id": 1,
      "name": "Bank Central Asia",
      "code": "BCA",
      "color": "#0066CC",
      "rtgsCode": "BCAINID31",
      "onlineCode": "014",
      "bifastCode": "014",
      "sknCode": "014",
      "isActive": true,
      "createdAt": "2026-02-01T10:00:00",
      "updatedAt": "2026-02-01T10:00:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    },
    "isActive": true,
    "createdAt": "2026-02-01T10:30:00",
    "updatedAt": "2026-02-01T15:45:00",
    "createdBy": "admin",
    "updatedBy": "user@example.com"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors (blank fields, invalid field values)
- **404 Not Found**: House bank or referenced bank does not exist
- **409 Conflict**: Duplicate account ID or account number for another house bank
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 5. Delete House Bank

Deletes a house bank account by ID.

**Endpoint**: `DELETE /{id}`  
**Permission**: `master-data:house-bank:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): House Bank ID (required)

#### Response (200 OK)

```json
{
  "message": "House bank deleted successfully",
  "status": "SUCCESS",
  "data": "House bank deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: House bank does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Required Permissions Summary

| Operation         | Permission                     |
| ----------------- | ------------------------------ |
| List House Banks  | `master-data:house-bank:list`   |
| Read House Bank   | `master-data:house-bank:read`   |
| Create House Bank | `master-data:house-bank:create` |
| Update House Bank | `master-data:house-bank:update` |
| Delete House Bank | `master-data:house-bank:delete` |

---

## Data Type Reference

| Type    | Format             | Example                  |
| ------- | ------------------ | ------------------------ |
| Long    | Integer            | 1                        |
| String  | Text               | "HB-BCA-001"             |
| Boolean | true/false         | true                     |
| Object  | Nested Bank object | { "id": 1, "name": "..." |

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

## Notes

1. **Unique Constraints**:
   - `accountId`: Must be unique across all house banks
   - `accountNumber`: Must be unique across all house banks
   - These prevent duplicate account registrations in the system

2. **Bank Relationship**:
   - House banks must reference an existing Bank via `bankCode`
   - The bankCode must match a bank entity's code field exactly
   - Invalid bankCode will result in 404 Not Found error

3. **Company Code**:
   - Identifies which company/organization owns the house bank account
   - Must correspond to an existing company in the system
   - Max 50 characters
   - Examples: PT_XYZ, PT_ABC

4. **Currency Code**:
   - Identifies the currency of the house bank account
   - Max 10 characters, typically follows ISO 4217 format
   - Examples: IDR (Indonesian Rupiah), USD (US Dollar), SGD (Singapore Dollar)
   - Used for multi-currency account management

5. **Account ID Format**:
   - Recommended format: `HB-[BANK_CODE]-[SEQUENCE]`
   - Examples: HB-BCA-001, HB-MANDIRI-001, HB-BNI-002
   - Format is flexible but should be consistently applied

6. **Account Number Format**:
   - Varies by bank (different banks have different account number formats)
   - BCA: Typically 10 digits
   - Mandiri: Typically 13 digits
   - BNI: Typically 10-15 digits
   - Must match actual bank account format for reconciliation

7. **Account Name**:
   - Should match exactly as it appears in bank records
   - Used for account identification and reconciliation
   - Example: "PT Fintra - BCA Operasional"

8. **ERP Code Field**:
   - Optional field for integration with enterprise resource planning systems
   - Maps to GL (General Ledger) accounts in ERP
   - Enables automated transaction posting
   - Format and usage depends on organization's ERP configuration
   - Examples: ERP-BCA1, ERP-MAN1

9. **Active Status**: Controlled by system, defaults to true on creation
   - When setting `isActive = false`, ensure:
     - No pending transactions exist
     - No scheduled payments/receipts are pending
     - All dependent systems are updated
   - Inactive accounts retained for historical/audit records

10. **Nested Bank Object**:

- Response includes full Bank details for convenience
- Includes bank name, color, and all payment system codes
- Allows frontend to display complete bank information without additional call

11. **Search Functionality**: The search parameter filters across:

- Account ID
- Account number
- Account name
- Company code
- Currency code
- ERP code
- Uses case-insensitive matching

12. **Audit Fields**: All resources include:
    - `createdAt`: Timestamp when house bank was created
    - `updatedAt`: Timestamp of last update
    - `createdBy`: User who created the record
    - `updatedBy`: User who last updated the record
    - Used for compliance and audit trail

13. **Pagination**: Default page size is 10 items, maximum configurable per system settings

14. **Default Sorting**: When sort is not specified, results are sorted by ID in ascending order

15. **Multi-Currency Support**:
    - House bank accounts can be in different currencies via the `currencyCode` field
    - Multiple accounts with same bank (different currencies): HB-BCA-001 (IDR), HB-BCA-002 (USD), etc.
    - Currency code must be valid per ISO 4217 standard

16. **Company-based Organization**:
    - House bank accounts are organized by company via `companyCode`
    - Each company can have multiple house bank accounts across different banks and currencies
    - Company code must reference an existing company in the system

17. **Reconciliation**:
    - Account numbers should be validated against actual bank records
    - Regular reconciliation recommended to ensure data accuracy
    - ERP codes should be synchronized with accounting system

18. **Payment Processing**: House banks are used for:
    - Receiving payment information for fund management
    - Payment processing and fund transfers
    - Cash position reporting
    - Bank reconciliation activities
