# General Ledger Account Master Data API Contract

## Overview

The General Ledger Account Master Data API provides endpoints for managing GL accounts within companies and business areas. The API uses JWT authentication and permission-based access control. GL accounts store the mapping between companies, business areas, units, and their corresponding GL codes for accounting purposes.

---

## Base Information

- **Base URL**: `/api/master/gl`
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
  "message": "GL accounts retrieved successfully",
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

### 1. List All GL Accounts

Retrieves a paginated list of GL accounts with optional search.

**Endpoint**: `GET /`  
**Permission**: `master-data:gl-account:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `search` (string, optional): Search keyword to filter by company code, BA code, unit name, account, or description
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, optional): Sort criteria (e.g., "id,asc")

#### Response (200 OK)

```json
{
  "message": "GL accounts retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "companyCode": "PT_XYZ",
        "baCode": "BA-JKT-01",
        "unitName": "Jakarta Finance",
        "account": "61101",
        "description": "Revenue from Product Sales",
        "isActive": true,
        "createdAt": "2026-02-01T10:00:00",
        "updatedAt": "2026-02-01T10:00:00",
        "createdBy": "admin",
        "updatedBy": "admin"
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

- **400 Bad Request**: Invalid pagination parameters
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 2. Get GL Account by ID

Retrieves a specific GL account by its ID.

**Endpoint**: `GET /{id}`  
**Permission**: `master-data:gl-account:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): GL Account ID (required)

#### Response (200 OK)

```json
{
  "message": "GL account retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "companyCode": "PT_XYZ",
    "baCode": "BA-JKT-01",
    "unitName": "Jakarta Finance",
    "account": "61101",
    "description": "Revenue from Product Sales",
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

- **404 Not Found**: GL account does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 3. Get GL Accounts by Company Code

Retrieves all GL accounts for a specific company.

**Endpoint**: `GET /company/{companyCode}`  
**Permission**: `master-data:gl-account:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `companyCode` (String): Company Code (required)

#### Response (200 OK)

```json
{
  "message": "GL accounts retrieved successfully for company: PT_XYZ",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "companyCode": "PT_XYZ",
      "baCode": "BA-JKT-01",
      "unitName": "Jakarta Finance",
      "account": "61101",
      "description": "Revenue from Product Sales",
      "isActive": true,
      "createdAt": "2026-02-01T10:00:00",
      "updatedAt": "2026-02-01T10:00:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 4. Get GL Accounts by Business Area Code

Retrieves all GL accounts for a specific business area.

**Endpoint**: `GET /business-area/{baCode}`  
**Permission**: `master-data:gl-account:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `baCode` (String): Business Area Code (required)

#### Response (200 OK)

```json
{
  "message": "GL accounts retrieved successfully for business area: BA-JKT-01",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "companyCode": "PT_XYZ",
      "baCode": "BA-JKT-01",
      "unitName": "Jakarta Finance",
      "account": "61101",
      "description": "Revenue from Product Sales",
      "isActive": true,
      "createdAt": "2026-02-01T10:00:00",
      "updatedAt": "2026-02-01T10:00:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    }
  ],
  "errors": null
}
```

#### Error Responses

- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 5. Get GL Account by Company, Business Area, and Unit

Retrieves a specific GL account by the combination of company code, business area code, and unit name.

**Endpoint**: `GET /by-combination`  
**Permission**: `master-data:gl-account:read`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `companyCode` (String): Company Code (required)
- `baCode` (String): Business Area Code (required)
- `unitName` (String): Unit Name (required)

#### Response (200 OK)

```json
{
  "message": "GL account retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "companyCode": "PT_XYZ",
    "baCode": "BA-JKT-01",
    "unitName": "Jakarta Finance",
    "account": "61101",
    "description": "Revenue from Product Sales",
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

- **404 Not Found**: GL account not found for the specified combination
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 6. Create GL Account

Creates a new GL account.

**Endpoint**: `POST /`  
**Permission**: `master-data:gl-account:create`  
**Authentication**: Required (Bearer Token)

#### Request

```json
{
  "companyCode": "PT_XYZ",
  "baCode": "BA-JKT-01",
  "unitName": "Jakarta Finance",
  "account": "61101",
  "description": "Revenue from Product Sales",
  "isActive": true
}
```

#### Request Validations

- `companyCode`: Required, max 50 characters
- `baCode`: Required, max 50 characters
- `unitName`: Optional, max 100 characters
- `account`: Required, max 100 characters
- `description`: Optional, max 255 characters
- `isActive`: Optional, defaults to true

#### Response (201 Created)

```json
{
  "message": "GL account created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "companyCode": "PT_XYZ",
    "baCode": "BA-JKT-01",
    "unitName": "Jakarta Finance",
    "account": "61101",
    "description": "Revenue from Product Sales",
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

- **400 Bad Request**: Validation errors (e.g., missing required fields, exceeding max length)
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 7. Update GL Account

Updates an existing GL account.

**Endpoint**: `PUT /{id}`  
**Permission**: `master-data:gl-account:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): GL Account ID (required)

#### Request

```json
{
  "companyCode": "PT_XYZ",
  "baCode": "BA-JKT-01",
  "unitName": "Jakarta Finance",
  "account": "61101",
  "description": "Revenue from Product Sales",
  "isActive": true
}
```

#### Response (200 OK)

```json
{
  "message": "GL account updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "companyCode": "PT_XYZ",
    "baCode": "BA-JKT-01",
    "unitName": "Jakarta Finance",
    "account": "61101",
    "description": "Revenue from Product Sales",
    "isActive": true,
    "createdAt": "2026-02-01T10:00:00",
    "updatedAt": "2026-02-01T11:00:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors
- **404 Not Found**: GL account does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 8. Delete GL Account

Deletes a GL account by ID.

**Endpoint**: `DELETE /{id}`  
**Permission**: `master-data:gl-account:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): GL Account ID (required)

#### Response (200 OK)

```json
{
  "message": "GL account deleted successfully",
  "status": "SUCCESS",
  "data": "GL account deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: GL account does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Required Permissions Summary

| Operation         | Permission                     |
| ----------------- | ------------------------------ |
| List GL Accounts  | `master-data:gl-account:list`   |
| Read GL Account   | `master-data:gl-account:read`   |
| Create GL Account | `master-data:gl-account:create` |
| Update GL Account | `master-data:gl-account:update` |
| Delete GL Account | `master-data:gl-account:delete` |

---

## Data Type Reference

| Type    | Format     | Example  |
| ------- | ---------- | -------- |
| Long    | Integer    | 1        |
| String  | Text       | "PT_XYZ" |
| Boolean | true/false | true     |

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

## Notes

1. **GL Account Mapping**: Maps the relationship between organizational units (company, business area, unit) and their GL codes for accounting purposes

2. **Company Code**: Identifies the parent company for the GL account mapping. Must correspond to an existing company in the system

3. **Business Area Code**: Identifies the business area/division within the company. Must correspond to an existing business area

4. **Unit Name**: Represents the organizational unit within the business area (e.g., department, cost center). Optional field

5. **GL Account Code** (`account`): The GL (General Ledger) account code used for GL posting at the specified organizational level. This is a required field that stores the actual accounting code
   - Examples: 61101, 611-001 (depending on organization's GL account numbering format)

6. **Description**: Optional field for documenting and referencing the GL account mapping
   - Examples: "Revenue from Product Sales", "Expense - Office Supplies"

7. **Active Status**: Controlled by system and can be toggled as needed. Deactivating a GL account should be done with consideration for ongoing transactions

8. **Audit Fields**: All resources include `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` for audit purposes

9. **Sorting**: Default sort is by ID in ascending order

10. **Combination Uniqueness**: The endpoint `GET /by-combination` allows retrieving GL accounts by the unique combination of company code, BA code, and unit name - this combination uniquely identifies a GL account within the system

11. **Search Functionality**: The list endpoint supports searching across company code, business area code, unit name, account, and description for flexible filtering

12. **Retrieval by Company/BA**: Specialized endpoints are provided to retrieve all GL accounts for a specific company or business area, useful for bulk operations and reporting
