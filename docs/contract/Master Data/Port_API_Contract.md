# Port Master Data API Contract

## Overview

The Port Master Data API provides endpoints for managing ports (Pelabuhan) under the supervision of Indonesian Customs Offices. The API uses JWT authentication and permission-based access control. Ports store information about ports that handle import/export operations and customs clearance activities.

---

## Base Information

- **Base URL**: `/api/master/port`
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
  "message": "Ports retrieved successfully",
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

### 1. List All Ports

Retrieves a paginated list of all ports with optional search.

**Endpoint**: `GET /`  
**Permission**: `master-data:port:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `search` (string, optional): Search keyword to filter by code or name
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, optional): Sort criteria (e.g., "id,asc")

#### Response (200 OK)

```json
{
  "message": "Ports retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "customsOfficeId": 1,
        "customsOffice": {
          "id": 1,
          "code": "CGK",
          "name": "Kantor Bea Cukai Jakarta",
          "isActive": true,
          "createdAt": "2026-02-01T10:00:00",
          "updatedAt": "2026-02-01T10:00:00",
          "createdBy": "admin",
          "updatedBy": "admin"
        },
        "code": "PORT-CGK-001",
        "name": "Pelabuhan Soekarno-Hatta Jakarta",
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

### 2. List Ports by Customs Office

Retrieves a paginated list of ports for a specific customs office with optional search.

**Endpoint**: `GET /customs-office/{customsOfficeId}`  
**Permission**: `master-data:port:list`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `customsOfficeId` (Long): Customs Office ID (required)

#### Query Parameters

- `search` (string, optional): Search keyword to filter by code or name
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, optional): Sort criteria (e.g., "id,asc")

#### Response (200 OK)

```json
{
  "message": "Ports retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "customsOfficeId": 1,
        "customsOffice": {
          "id": 1,
          "code": "CGK",
          "name": "Kantor Bea Cukai Jakarta",
          "isActive": true,
          "createdAt": "2026-02-01T10:00:00",
          "updatedAt": "2026-02-01T10:00:00",
          "createdBy": "admin",
          "updatedBy": "admin"
        },
        "code": "PORT-CGK-001",
        "name": "Pelabuhan Soekarno-Hatta Jakarta",
        "isActive": true,
        "createdAt": "2026-02-01T10:00:00",
        "updatedAt": "2026-02-01T10:00:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      }
    ],
    "totalElements": 10,
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

- **400 Bad Request**: Invalid pagination parameters or customs office ID
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 3. Get Port by ID

Retrieves a specific port by its ID.

**Endpoint**: `GET /{id}`  
**Permission**: `master-data:port:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Port ID (required)

#### Response (200 OK)

```json
{
  "message": "Port retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "customsOfficeId": 1,
    "customsOffice": {
      "id": 1,
      "code": "CGK",
      "name": "Kantor Bea Cukai Jakarta",
      "isActive": true,
      "createdAt": "2026-02-01T10:00:00",
      "updatedAt": "2026-02-01T10:00:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    },
    "code": "PORT-CGK-001",
    "name": "Pelabuhan Soekarno-Hatta Jakarta",
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

- **404 Not Found**: Port does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 4. Create Port

Creates a new port under a customs office.

**Endpoint**: `POST /`  
**Permission**: `master-data:port:create`  
**Authentication**: Required (Bearer Token)

#### Request

```json
{
  "customsOfficeId": 1,
  "code": "PORT-CGK-001",
  "name": "Pelabuhan Soekarno-Hatta Jakarta",
  "isActive": true
}
```

#### Request Validations

- `customsOfficeId`: Required, must reference existing customs office
- `code`: Required, max 50 characters, must be unique (follows Indonesian Port Authority standards)
- `name`: Required, max 255 characters
- `isActive`: Optional (defaults to true on creation)

#### Response (201 Created)

```json
{
  "message": "Port created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "customsOfficeId": 1,
    "customsOffice": {
      "id": 1,
      "code": "CGK",
      "name": "Kantor Bea Cukai Jakarta",
      "isActive": true,
      "createdAt": "2026-02-01T10:00:00",
      "updatedAt": "2026-02-01T10:00:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    },
    "code": "PORT-CGK-001",
    "name": "Pelabuhan Soekarno-Hatta Jakarta",
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

- **400 Bad Request**: Validation errors (missing required fields, invalid values)
- **409 Conflict**: Duplicate port code
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 5. Update Port

Updates an existing port.

**Endpoint**: `PUT /{id}`  
**Permission**: `master-data:port:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Port ID (required)

#### Request

```json
{
  "customsOfficeId": 1,
  "code": "PORT-CGK-001",
  "name": "Pelabuhan Soekarno-Hatta Jakarta",
  "isActive": true
}
```

#### Response (200 OK)

```json
{
  "message": "Port updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "customsOfficeId": 1,
    "customsOffice": {
      "id": 1,
      "code": "CGK",
      "name": "Kantor Bea Cukai Jakarta",
      "isActive": true,
      "createdAt": "2026-02-01T10:00:00",
      "updatedAt": "2026-02-01T10:00:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    },
    "code": "PORT-CGK-001",
    "name": "Pelabuhan Soekarno-Hatta Jakarta",
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

- **400 Bad Request**: Validation errors (invalid values)
- **404 Not Found**: Port does not exist
- **409 Conflict**: Duplicate port code for another port
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 6. Delete Port

Deletes a port by ID.

**Endpoint**: `DELETE /{id}`  
**Permission**: `master-data:port:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Port ID (required)

#### Response (200 OK)

```json
{
  "message": "Port deleted successfully",
  "status": "SUCCESS",
  "data": "Port deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Port does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Required Permissions Summary

| Operation   | Permission               |
| ----------- | ------------------------ |
| List Ports  | `master-data:port:list`   |
| Read Port   | `master-data:port:read`   |
| Create Port | `master-data:port:create` |
| Update Port | `master-data:port:update` |
| Delete Port | `master-data:port:delete` |

---

## Data Type Reference

| Type    | Format     | Example        |
| ------- | ---------- | -------------- |
| Long    | Integer    | 1              |
| String  | Text       | "PORT-CGK-001" |
| Boolean | true/false | true           |

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

1. **Port Code**: Must be unique and follow Indonesian Port Authority (Direktorat Jenderal Perhubungan Laut) standards. These are assigned by regulatory authorities and should not be modified arbitrarily.

2. **Customs Office Assignment**: Each port must be assigned to exactly one customs office (KPPBC). A port cannot be reassigned to another customs office without careful transaction review and historical tracking.

3. **Official Name**: The official name of the port as registered with the Indonesian Port Authority. Typically follows standards set by maritime authorities.

4. **Master Data Reference**: This is a reference-only table maintained by the Indonesian Port Authority and Indonesian Customs Authority. Update only when official changes are announced by the government.

5. **Active Status**: Controlled by system, defaults to true on creation. Ports with `isActive = false` should be retained for historical purposes related to import/export transactions (never delete from database).

6. **Data Stability**: Port information is relatively static and determined by regulatory authorities. Changes should be infrequent and synchronized with official government records.

7. **Port-Customs Office Relationship**: Use the `/customs-office/{customsOfficeId}` endpoint to retrieve all ports managed by a specific customs office. This supports organizational hierarchies and reporting needs.

8. **Unique Code**: Port codes should be globally unique across all customs offices. If the same port code can appear under different customs offices, the system enforces global uniqueness.

9. **Audit Fields**: All resources include `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` for audit purposes.

10. **Sorting**: Default sort is by ID in ascending order.

11. **Data Source**: Port information should be synchronized with the official Indonesian Port Authority and Indonesian Customs Authority databases when available.

12. **Regulatory Compliance**: Changes to port information should follow proper governance and authorization procedures due to regulatory and operational implications for import/export activities.

13. **Search Functionality**: The search query parameter searches across both port code and port name fields, using case-insensitive matching for flexibility.
