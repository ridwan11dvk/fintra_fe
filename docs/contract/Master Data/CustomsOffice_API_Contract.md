# Customs Office Master Data API Contract

## Overview

The Customs Office Master Data API provides endpoints for managing Indonesian Customs Offices (Kantor Pengawasan dan Pelayanan Bea dan Cukai - KPPBC). The API uses JWT authentication and permission-based access control. Customs offices store information about customs offices that oversee import/export operations and customs clearance at various ports throughout Indonesia.

---

## Base Information

- **Base URL**: `/api/master/customs-office`
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
  "message": "Customs offices retrieved successfully",
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

### 1. List All Customs Offices

Retrieves a paginated list of customs offices with optional search.

**Endpoint**: `GET /`  
**Permission**: `master-data:customs-office:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `search` (string, optional): Search keyword to filter by code or name
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, optional): Sort criteria (e.g., "id,asc")

#### Response (200 OK)

```json
{
  "message": "Customs offices retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "code": "KPPBC-001",
        "name": "Kantor Pengawasan dan Pelayanan Bea dan Cukai Jakarta",
        "isActive": true,
        "createdAt": "2026-02-01T10:00:00",
        "updatedAt": "2026-02-01T10:00:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      }
    ],
    "totalElements": 50,
    "totalPages": 5,
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

### 2. Get Customs Office by ID

Retrieves a specific customs office by its ID.

**Endpoint**: `GET /{id}`  
**Permission**: `master-data:customs-office:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Customs Office ID (required)

#### Response (200 OK)

```json
{
  "message": "Customs office retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "KPPBC-001",
    "name": "Kantor Pengawasan dan Pelayanan Bea dan Cukai Jakarta",
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

- **404 Not Found**: Customs office does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 3. Create Customs Office

Creates a new customs office.

**Endpoint**: `POST /`  
**Permission**: `master-data:customs-office:create`  
**Authentication**: Required (Bearer Token)

#### Request

```json
{
  "code": "KPPBC-001",
  "name": "Kantor Pengawasan dan Pelayanan Bea dan Cukai Jakarta",
  "isActive": true
}
```

#### Request Validations

- `code`: Required, max 50 characters, must be unique (follows Indonesian Customs Authority standards)
- `name`: Required, max 255 characters
- `isActive`: Optional (defaults to true on creation)

#### Response (201 Created)

```json
{
  "message": "Customs office created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "KPPBC-001",
    "name": "Kantor Pengawasan dan Pelayanan Bea dan Cukai Jakarta",
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
- **409 Conflict**: Duplicate customs office code
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 4. Update Customs Office

Updates an existing customs office.

**Endpoint**: `PUT /{id}`  
**Permission**: `master-data:customs-office:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Customs Office ID (required)

#### Request

```json
{
  "code": "KPPBC-001",
  "name": "Kantor Pengawasan dan Pelayanan Bea dan Cukai Jakarta",
  "isActive": true
}
```

#### Response (200 OK)

```json
{
  "message": "Customs office updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "KPPBC-001",
    "name": "Kantor Pengawasan dan Pelayanan Bea dan Cukai Jakarta",
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
- **404 Not Found**: Customs office does not exist
- **409 Conflict**: Duplicate customs office code for another customs office
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 5. Delete Customs Office

Deletes a customs office by ID.

**Endpoint**: `DELETE /{id}`  
**Permission**: `master-data:customs-office:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Customs Office ID (required)

#### Response (200 OK)

```json
{
  "message": "Customs office deleted successfully",
  "status": "SUCCESS",
  "data": "Customs office deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Customs office does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Required Permissions Summary

| Operation             | Permission                         |
| --------------------- | ---------------------------------- |
| List Customs Offices  | `master-data:customs-office:list`   |
| Read Customs Office   | `master-data:customs-office:read`   |
| Create Customs Office | `master-data:customs-office:create` |
| Update Customs Office | `master-data:customs-office:update` |
| Delete Customs Office | `master-data:customs-office:delete` |

---

## Data Type Reference

| Type    | Format     | Example     |
| ------- | ---------- | ----------- |
| Long    | Integer    | 1           |
| String  | Text       | "KPPBC-001" |
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

1. **Customs Office Code**: Must be unique and follow Indonesian Customs Authority (Direktorat Jenderal Bea dan Cukai) standards. These are assigned by the government and should not be modified arbitrarily.

2. **Official Name**: The official name of the customs office as registered with the Indonesian Customs Authority. Typically follows the format "Kantor Pengawasan dan Pelayanan Bea dan Cukai [Location]" (KPPBC [Location]).

3. **Master Data Reference**: This is a reference-only table maintained by the Indonesian Customs Authority. Update only when official changes are announced by the government.

4. **Active Status**: Controlled by system, defaults to true on creation. Customs offices with `isActive = false` should be retained for historical purposes related to import/export transactions (never delete from database).

5. **Data Stability**: Customs office data is relatively static and determined by regulatory authority. Changes should be infrequent and synchronized with official government records.

6. **Port Management**: Each customs office typically manages multiple ports. The list of ports under a customs office is maintained in the dedicated ports endpoint.

7. **Audit Fields**: All resources include `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` for audit purposes.

8. **Sorting**: Default sort is by ID in ascending order.

9. **Data Source**: Customs office information should be synchronized with the official Indonesian Customs Authority database when available.

10. **Regulatory Compliance**: Changes to customs office information should follow proper governance and authorization procedures due to regulatory implications.
