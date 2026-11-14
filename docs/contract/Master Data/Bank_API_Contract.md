# Bank Master Data API Contract

## Overview

The Bank Master Data API provides endpoints for managing banking institution information within the system. The API supports comprehensive bank data including payment system codes (RTGS, BIFAST, SKN, Online) and visual identification. The API uses JWT authentication with permission-based access control for secure bank management.

---

## Base Information

- **Base URL**: `/api/master/bank`
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
  "message": "Banks retrieved successfully",
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

### 1. List All Banks

Retrieves a paginated list of banks with optional search.

**Endpoint**: `GET /`  
**Permission**: `master-data:bank:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `search` (string, optional): Search keyword to filter by name, code, or payment system codes
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, default: "createdAt,desc"): Sort criteria with direction (e.g., "name,asc"). Default sorts by creation date in descending order

#### Response (200 OK)

```json
{
  "message": "Banks retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
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
      {
        "id": 2,
        "name": "Bank Mandiri",
        "code": "MANDIRI",
        "color": "#FF6600",
        "rtgsCode": "BMRIIDJA",
        "onlineCode": "008",
        "bifastCode": "008",
        "sknCode": "008",
        "isActive": true,
        "createdAt": "2026-02-01T11:00:00",
        "updatedAt": "2026-02-01T11:00:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      }
    ],
    "totalElements": 15,
    "totalPages": 2,
    "currentPage": 0,
    "pageSize": 10,
    "hasNext": true,
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

### 2. Get Bank by ID

Retrieves a specific bank by its ID.

**Endpoint**: `GET /{id}`  
**Permission**: `master-data:bank:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Bank ID (required)

#### Response (200 OK)

```json
{
  "message": "Bank retrieved successfully",
  "status": "SUCCESS",
  "data": {
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
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Bank does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 3. Create Bank

Creates a new bank.

**Endpoint**: `POST /`  
**Permission**: `master-data:bank:create`  
**Authentication**: Required (Bearer Token)

#### Request

```json
{
  "name": "Bank Central Asia",
  "code": "BCA",
  "color": "#0066CC",
  "rtgsCode": "BCAINID31",
  "onlineCode": "014",
  "bifastCode": "014",
  "sknCode": "014",
  "isActive": true
}
```

#### Request Validations

- `name`: Required, max 100 characters, must be unique
- `code`: Required, max 50 characters, must be unique
- `color`: Optional, max 20 characters
- `rtgsCode`: Optional, max 50 characters
- `onlineCode`: Optional, max 50 characters
- `bifastCode`: Optional, max 50 characters
- `sknCode`: Optional, max 50 characters
- `isActive`: Optional, defaults to true

#### Response (201 Created)

```json
{
  "message": "Bank created successfully",
  "status": "SUCCESS",
  "data": {
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
    "createdBy": "user@example.com",
    "updatedBy": "user@example.com"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors (blank name/code, invalid field values)
- **409 Conflict**: Duplicate bank name or code
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 4. Update Bank

Updates an existing bank.

**Endpoint**: `PUT /{id}`  
**Permission**: `master-data:bank:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Bank ID (required)

#### Request

```json
{
  "name": "Bank Central Asia",
  "code": "BCA",
  "color": "#0066CC",
  "rtgsCode": "BCAINID31",
  "onlineCode": "014",
  "bifastCode": "014",
  "sknCode": "014",
  "isActive": true
}
```

#### Response (200 OK)

```json
{
  "message": "Bank updated successfully",
  "status": "SUCCESS",
  "data": {
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
    "updatedAt": "2026-02-01T15:30:00",
    "createdBy": "admin",
    "updatedBy": "user@example.com"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors (blank name/code, invalid field values)
- **404 Not Found**: Bank does not exist
- **409 Conflict**: Duplicate bank name or code for another bank
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 5. Delete Bank

Deletes a bank by ID.

**Endpoint**: `DELETE /{id}`  
**Permission**: `master-data:bank:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Bank ID (required)

#### Response (200 OK)

```json
{
  "message": "Bank deleted successfully",
  "status": "SUCCESS",
  "data": "Bank deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Bank does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 6. Export Banks to Excel

Exports bank data to an Excel file with optional search filter.

**Endpoint**: `GET /export`  
**Permission**: `master-data:bank:export`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `search` (string, optional): Search keyword to filter exported banks by name, code, or payment system codes

#### Response (200 OK)

Returns an Excel file (.xlsx) as a byte array with bank data.

**Headers**:

- `Content-Type`: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- `Content-Disposition`: `attachment; filename=banks_export.xlsx`

#### Error Responses

- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions
- **500 Internal Server Error**: Export generation failed

---

### 7. Download Bank Import Template

Generates and downloads an Excel template for bank import with headers and example rows.

**Endpoint**: `GET /import/template`  
**Permission**: `master-data:bank:import`  
**Authentication**: Required (Bearer Token)

#### Response (200 OK)

Returns an Excel template file (.xlsx) as a byte array.

**Headers**:

- `Content-Type`: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- `Content-Disposition`: `attachment; filename=bank_import_template.xlsx`

**Template Columns**:

- Name: Required, max 100 characters
- Code: Required, max 50 characters
- Color: Optional, max 20 characters
- RTGS Code: Optional, max 50 characters
- Online Code: Optional, max 50 characters
- BIFAST Code: Optional, max 50 characters
- SKN Code: Optional, max 50 characters

#### Error Responses

- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions
- **500 Internal Server Error**: Template generation failed

---

### 8. Import Banks from Excel

Imports bank data from an Excel file with upsert-by-code behavior. Supports dry-run validation mode.

**Endpoint**: `POST /import`  
**Permission**: `master-data:bank:import`  
**Authentication**: Required (Bearer Token)
**Content-Type**: `multipart/form-data`

#### Request Parameters

- `file` (MultipartFile, required): Excel file in xlsx/xls format
- `dryRun` (boolean, default: false): If true, validates and classifies only without persisting changes

#### Response (200 OK)

```json
{
  "message": "Bank import executed successfully",
  "status": "SUCCESS",
  "data": {
    "summary": {
      "totalRows": 50,
      "validRows": 45,
      "invalidRows": 5,
      "createdRows": 30,
      "updatedRows": 15,
      "skippedRows": 0,
      "dryRun": false
    },
    "rowErrors": [
      {
        "rowNumber": 10,
        "message": "Bank code cannot be blank"
      },
      {
        "rowNumber": 25,
        "message": "Bank name already exists"
      }
    ],
    "errorReport": null
  },
  "errors": null
}
```

#### Dry-Run Mode Response (200 OK)

```json
{
  "message": "Bank import validated successfully",
  "status": "SUCCESS",
  "data": {
    "summary": {
      "totalRows": 50,
      "validRows": 45,
      "invalidRows": 5,
      "createdRows": 30,
      "updatedRows": 15,
      "skippedRows": 0,
      "dryRun": true
    },
    "rowErrors": [
      {
        "rowNumber": 10,
        "message": "Bank code cannot be blank"
      },
      {
        "rowNumber": 25,
        "message": "Bank name already exists"
      }
    ],
    "errorReport": {
      "fileName": "bank_import_errors.xlsx",
      "contentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "base64Content": "UEsDBAoAAAAAAI..."
    }
  },
  "errors": null
}
```

#### Import Behavior: name, code; optional fields validated for length)

- **Dry-Run**: When `dryRun=true`, rows are classified and validated but NOT persisted to the database. An error report is generated for rows with errors
- **Error Handling**: Import continues processing remaining rows even if some rows fail
  | `INVALID_COLOR` | Color format is invalid |
  | `INVALID_LENGTH` | Field value exceeds maximum allowed length |
  | `INVALID_FORMAT` | Field value format is invalid |

#### Error Responses

- **400 Bad Request**: Invalid file format or missing file
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions
- **500 Internal Server Error**: Import processing failed

---

## Required Permissions Summary

| Operation                | Permission               |
| ------------------------ | ------------------------ |
| List Banks               | `master-data:bank:list`   |
| Read Bank                | `master-data:bank:read`   |
| Create Bank              | `master-data:bank:create` |
| Update Bank              | `master-data:bank:update` |
| Delete Bank              | `master-data:bank:delete` |
| Export Banks             | `master-data:bank:export` |
| Import Banks             | `master-data:bank:import` |
| Download Import Template | `master-data:bank:import` |

---

## Data Type Reference

| Type    | Format     | Example |
| ------- | ---------- | ------- |
| Long    | Integer    | 1       |
| String  | Text       | "BCA"   |
| Boolean | true/false | true    |

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

1. **Unique Constraints**: Both bank name and code must be unique
   - Attempting to create or update with duplicate values will return 409 Conflict

2. **Payment System Codes**:
   - `rtgsCode`: Real Time Gross Settlement code used for high-value transfers
   - `bifastCode`: Bank Indonesia Fast code for fast fund transfers
   - `sknCode`: Sistem Kliring Nasional code for clearing operations
   - `onlineCode`: Online banking system identifier
   - All payment system codes are optional

3. **Color Field**: Visual identification color code
   - Format: Hexadecimal (e.g., "#0066CC") or color names
   - Used for UI representation of bank information

4. **Active Status**: Controlled by system, defaults to true on creation
   - Inactive banks may be retained for historical and audit purposes

5. **Audit Fields**: All resources include `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` for audit and compliance purposes

6. **Search Functionality**: The search parameter filters across name, code, RTGS code, and BIFAST code using case-insensitive matching

7. **Default Sorting**: When sort is not specified, results are sorted by createdAt in descending order (newest first)

8. **Bank Code Standards**: Bank codes should follow banking industry standards
   - Example: BCA, MANDIRI, BNI, BRI, CIMB, etc.

9. **Used by House Banks**: Bank records are referenced by House Bank accounts via the bank code
   - Cannot delete a bank that is actively referenced by house bank accounts (data integrity)

10. **Pagination**: Default page size is 10 items, maximum configurable per system settings

11. **Import/Export Functionality**:
    - **Export**: Generates Excel files with bank data, supporting optional search filters
    - **Template Download**: Provides a pre-formatted Excel template for consistent data entry during imports
    - **Import**: Supports upsert-by-code behavior (creates new banks or updates existing ones based on code)
    - **Dry-Run Mode**: Validates import data without persisting changes, allowing users to review errors before actual import
    - **Error Reporting**: Import provides detailed row-level error information with error codes and affected data
    - **Supported Formats**: Excel files (.xlsx and .xls formats)

12. **Import Upsert Behavior**:
    - Banks are matched by `code` field
    - If code exists: record is updated with new values
    - If code is new: new bank record is created
    - Name uniqueness is still validated across all banks
13. **Import Response Structure**:
    - `summary`: Aggregate import counters (total, valid, invalid, created, updated, skipped, dryRun flag)
    - `rowErrors`: Array of row-level validation errors with row number and message
    - `errorReport`: Available in dry-run mode with base64-encoded Excel error report for download

14. **Import Validation**:
    - Required fields: `name`, `code`
    - Field length constraints enforced as per DTO specifications
    - Duplicate name validation (unique name constraint)
    - Duplicate code handling: Updates existing bank if code matches
    - Invalid color format: No validation, accepts any string up to 20 characters
