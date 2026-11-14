# Business Area Master Data API Contract

## Overview

The Business Area Master Data API provides endpoints for managing business areas/divisions within companies. The API uses JWT authentication and permission-based access control. Business areas store organizational structure information, tax compliance data, and API integration credentials.

---

## Base Information

- **Base URL**: `/api/master/business-area`
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
  "message": "Business areas retrieved successfully",
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

### 1. List All Business Areas

Retrieves a paginated list of business areas with optional search.

**Endpoint**: `GET /`  
**Permission**: `master-data:business-area:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `search` (string, optional): Search keyword to filter by name, code, company code, branch code, email, or client ID
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, optional): Sort criteria (e.g., "id,asc")

#### Response (200 OK)

```json
{
  "message": "Business areas retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "companyCode": "PT_XYZ",
        "name": "Jakarta Head Office",
        "baCode": "BA-JKT-01",
        "branchCode": "BRN-001",
        "email": "ba.jakarta@ptxyz.com",
        "taxEmail": "tax.jakarta@ptxyz.com",
        "nitku": "0012345678",
        "npwp": "12345678901234",
        "clientId": "CLIENT_001",
        "clientSecret": "encrypted_secret_value",
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

### 2. Get Business Area by ID

Retrieves a specific business area by its ID.

**Endpoint**: `GET /{id}`  
**Permission**: `master-data:business-area:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Business Area ID (required)

#### Response (200 OK)

```json
{
  "message": "Business area retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "companyCode": "PT_XYZ",
    "name": "Jakarta Head Office",
    "baCode": "BA-JKT-01",
    "branchCode": "BRN-001",
    "email": "ba.jakarta@ptxyz.com",
    "taxEmail": "tax.jakarta@ptxyz.com",
    "nitku": "0012345678",
    "npwp": "12345678901234",
    "clientId": "CLIENT_001",
    "clientSecret": "encrypted_secret_value",
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

- **404 Not Found**: Business area does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 3. Get Business Area by Code

Retrieves a specific business area by its business area code.

**Endpoint**: `GET /code/{baCode}`  
**Permission**: `master-data:business-area:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `baCode` (String): Business Area Code (required)

#### Response (200 OK)

Same structure as Get Business Area by ID endpoint.

#### Error Responses

- **404 Not Found**: Business area with specified code does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 4. Create Business Area

Creates a new business area.

**Endpoint**: `POST /`  
**Permission**: `master-data:business-area:create`  
**Authentication**: Required (Bearer Token)

#### Request

```json
{
  "companyCode": "PT_XYZ",
  "name": "Jakarta Head Office",
  "baCode": "BA-JKT-01",
  "branchCode": "BRN-001",
  "email": "ba.jakarta@ptxyz.com",
  "taxEmail": "tax.jakarta@ptxyz.com",
  "nitku": "0012345678",
  "npwp": "12345678901234",
  "clientId": "CLIENT_001",
  "clientSecret": "client_secret_value"
```

#### Request Validations

- `companyCode`: Required, max 100 characters
- `name`: Required, max 255 characters
- `baCode`: Required, max 50 characters, must be unique
- `branchCode`: Optional, max 50 characters
- `email`: Optional, must be valid email format if provided, must be unique if provided
- `taxEmail`: Optional, must be valid email format if provided
- `nitku`: Optional, max 50 characters, must be unique if provided
- `npwp`: Optional, max 50 characters, must be unique if provided
- `clientId`: Optional, max 100 characters, must be unique if provided
- `clientSecret`: Optional, max 255 characters (should be encrypted at rest)

#### Response (201 Created)

```json
{
  "message": "Business area created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "companyCode": "PT_XYZ",
    "name": "Jakarta Head Office",
    "baCode": "BA-JKT-01",
    "branchCode": "BRN-001",
    "email": "ba.jakarta@ptxyz.com",
    "taxEmail": "tax.jakarta@ptxyz.com",
    "nitku": "0012345678",
    "npwp": "12345678901234",
    "clientId": "CLIENT_001",
    "clientSecret": "encrypted_secret_value",
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

- **400 Bad Request**: Validation errors
- **409 Conflict**: Duplicate business area code, email, NITKU, NPWP, or client ID
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 5. Update Business Area

Updates an existing business area.

**Endpoint**: `PUT /{id}`  
**Permission**: `master-data:business-area:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Business Area ID (required)

#### Request

```json
{
  "companyCode": "PT_XYZ",
  "name": "Jakarta Head Office",
  "baCode": "BA-JKT-01",
  "branchCode": "BRN-001",
  "email": "ba.jakarta@ptxyz.com",
  "taxEmail": "tax.jakarta@ptxyz.com",
  "nitku": "0012345678",
  "npwp": "12345678901234",
  "clientId": "CLIENT_001",
  "clientSecret": "client_secret_value"
}
```

#### Response (200 OK)

Same structure as Get Business Area by ID endpoint.

#### Error Responses

- **400 Bad Request**: Validation errors
- **404 Not Found**: Business area does not exist
- **409 Conflict**: Duplicate business area code, email, NITKU, NPWP, or client ID for another business area
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 6. Delete Business Area

Deletes a business area by ID.

**Endpoint**: `DELETE /{id}`  
**Permission**: `master-data:business-area:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Business Area ID (required)

#### Response (200 OK)

```json
{
  "message": "Business area deleted successfully",
  "status": "SUCCESS",
  "data": "Business area deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Business area does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Required Permissions Summary

| Operation            | Permission                        |
| -------------------- | --------------------------------- |
| List Business Areas  | `master-data:business-area:list`   |
| Read Business Area   | `master-data:business-area:read`   |
| Create Business Area | `master-data:business-area:create` |
| Update Business Area | `master-data:business-area:update` |
| Delete Business Area | `master-data:business-area:delete` |

---

## Data Type Reference

| Type    | Format     | Example     |
| ------- | ---------- | ----------- |
| Long    | Integer    | 1           |
| String  | Text       | "BA-JKT-01" |
| Boolean | true/false | true        |

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

1. **Business Area Code**: Must be unique and follow organizational standards (e.g., BA-JKT-01, BA-SBY-01)
2. **Company Code**: Links business area to its parent company for organizational structure
3. **Email Uniqueness**: Both contact email and tax email, if provided, must be unique across active business areas
4. **Tax Identification**: NITKU and NPWP are tax-critical identifiers and should be validated against government registries
5. **API Credentials**: Client ID and Client Secret are used for external system integration
   - Client credentials should be encrypted at rest
   - Credentials should be rotated periodically for security
   - Access to client credentials should be restricted and logged
   - Never expose client secret in logs or error messages
6. **Audit Fields**: All resources include `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` for audit purposes
7. **Active Status**: Controlled by system, defaults to true on creation. When deactivating, ensure no ongoing transactions depend on it
8. **Sorting**: Default sort is by ID in ascending order
9. **Branch Code**: Optional field used for organizational hierarchy and communication routing
