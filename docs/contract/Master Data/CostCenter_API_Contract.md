# Cost Center Master Data API Contract

## Overview

The Cost Center Master Data API provides endpoints for managing cost centers within business areas. The API uses JWT authentication and permission-based access control. Cost centers store organizational structure information used for financial tracking and budget allocation.

---

## Base Information

- **Base URL**: `/api/master/cost-center`
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
  "message": "Cost centers retrieved successfully",
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

### 1. List All Cost Centers

Retrieves a paginated list of cost centers with optional search.

**Endpoint**: `GET /`  
**Permission**: `master-data:cost-center:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `search` (string, optional): Search keyword to filter by code, name, company code, or BA code
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, optional): Sort criteria (e.g., "id,asc")

#### Response (200 OK)

```json
{
  "message": "Cost centers retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "companyCode": "PT_XYZ",
        "baCode": "BA-JKT-01",
        "costCenterCode": "CC-001",
        "costCenterName": "Jakarta Head Office Cost Center",
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

### 2. Get All Active Cost Centers

Retrieves all active cost centers without pagination.

**Endpoint**: `GET /active`  
**Permission**: `master-data:cost-center:list`  
**Authentication**: Required (Bearer Token)

#### Response (200 OK)

```json
{
  "message": "Active cost centers retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "companyCode": "PT_XYZ",
      "baCode": "BA-JKT-01",
      "costCenterCode": "CC-001",
      "costCenterName": "Jakarta Head Office Cost Center",
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

### 3. Get Cost Centers by Company and Business Area

Retrieves all active cost centers for a specific company and business area.

**Endpoint**: `GET /company/{companyCode}/ba/{baCode}`  
**Permission**: `master-data:cost-center:list`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `companyCode` (String): Company code (required)
- `baCode` (String): Business area code (required)

#### Response (200 OK)

```json
{
  "message": "Cost centers retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "companyCode": "PT_XYZ",
      "baCode": "BA-JKT-01",
      "costCenterCode": "CC-001",
      "costCenterName": "Jakarta Head Office Cost Center",
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

- **400 Bad Request**: Invalid company or BA code format
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 4. Get Cost Center by ID

Retrieves a specific cost center by its ID.

**Endpoint**: `GET /{id}`  
**Permission**: `master-data:cost-center:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Cost Center ID (required)

#### Response (200 OK)

```json
{
  "message": "Cost center retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "companyCode": "PT_XYZ",
    "baCode": "BA-JKT-01",
    "costCenterCode": "CC-001",
    "costCenterName": "Jakarta Head Office Cost Center",
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

- **404 Not Found**: Cost center does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 5. Create Cost Center

Creates a new cost center.

**Endpoint**: `POST /`  
**Permission**: `master-data:cost-center:create`  
**Authentication**: Required (Bearer Token)

#### Request

```json
{
  "companyCode": "PT_XYZ",
  "baCode": "BA-JKT-01",
  "costCenterCode": "CC-001",
  "costCenterName": "Jakarta Head Office Cost Center",
  "isActive": true
}
```

#### Request Validations

- `companyCode`: Required, max 50 characters
- `baCode`: Required, max 50 characters
- `costCenterCode`: Required, max 50 characters, must be unique within the combination of (companyCode, baCode, costCenterCode)
- `costCenterName`: Required, max 255 characters
- `isActive`: Optional, defaults to true

#### Response (201 Created)

```json
{
  "message": "Cost center created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "companyCode": "PT_XYZ",
    "baCode": "BA-JKT-01",
    "costCenterCode": "CC-001",
    "costCenterName": "Jakarta Head Office Cost Center",
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

- **400 Bad Request**: Validation errors (missing required fields)
- **409 Conflict**: Duplicate cost center code within the same company and BA combination
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 6. Update Cost Center

Updates an existing cost center.

**Endpoint**: `PUT /{id}`  
**Permission**: `master-data:cost-center:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Cost Center ID (required)

#### Request

```json
{
  "companyCode": "PT_XYZ",
  "baCode": "BA-JKT-01",
  "costCenterCode": "CC-001",
  "costCenterName": "Jakarta Head Office Cost Center - Updated",
  "isActive": true
}
```

#### Response (200 OK)

```json
{
  "message": "Cost center updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "companyCode": "PT_XYZ",
    "baCode": "BA-JKT-01",
    "costCenterCode": "CC-001",
    "costCenterName": "Jakarta Head Office Cost Center - Updated",
    "isActive": true,
    "createdAt": "2026-02-01T10:00:00",
    "updatedAt": "2026-02-18T15:30:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors
- **404 Not Found**: Cost center does not exist
- **409 Conflict**: Duplicate cost center code for another cost center within the same company and BA combination
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 7. Delete Cost Center

Deletes a cost center by ID.

**Endpoint**: `DELETE /{id}`  
**Permission**: `master-data:cost-center:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Cost Center ID (required)

#### Response (200 OK)

```json
{
  "message": "Cost center deleted successfully",
  "status": "SUCCESS",
  "data": "Cost center deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Cost center does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Required Permissions Summary

| Operation                          | Permission                      |
| ---------------------------------- | ------------------------------- |
| List Cost Centers                  | `master-data:cost-center:list`   |
| Get All Active Cost Centers        | `master-data:cost-center:list`   |
| Get Cost Centers by Company and BA | `master-data:cost-center:list`   |
| Read Cost Center                   | `master-data:cost-center:read`   |
| Create Cost Center                 | `master-data:cost-center:create` |
| Update Cost Center                 | `master-data:cost-center:update` |
| Delete Cost Center                 | `master-data:cost-center:delete` |

---

## Data Type Reference

| Type    | Format     | Example  |
| ------- | ---------- | -------- |
| Long    | Integer    | 1        |
| String  | Text       | "CC-001" |
| Boolean | true/false | true     |

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

1. **Cost Center Code**: Must be unique within the combination of (companyCode, baCode). Follows organizational naming standards (e.g., CC-001, CC-002).

2. **Company Code & BA Code**: These codes link the cost center to its parent organization structure. Must reference valid records in the business_area master data.

3. **Cost Center Name**: Used for display purposes in user interfaces and financial reports. Should be descriptive and meaningful.

4. **Audit Fields**: All resources include `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` for audit purposes.

5. **Active Status**: Controlled by system, defaults to true on creation. When deactivating, ensure no ongoing transactions depend on the cost center. Historical data should be retained when deactivating (set isActive = false, not deleted).

6. **Sorting**: Default sort is by `updatedAt` in descending order when no sort is specified.

7. **Search Functionality**: The search parameter matches against:
   - Cost center code
   - Cost center name
   - Company code
   - BA code

8. **Unique Constraint**: The combination of (companyCode, baCode, costCenterCode) must be unique to prevent duplicate cost center definitions. When updating, if the code changes, the new code must not violate this constraint for another cost center.

9. **Performance Considerations**: Use the specific endpoint filter (`/company/{companyCode}/ba/{baCode}`) for better performance when retrieving cost centers for a specific organizational unit rather than listing all cost centers.

10. **Financial Tracking**: Cost centers are used for allocating and tracking costs in the organization. Ensure proper assignment of cost centers to departments/units and transactions before deactivating.
