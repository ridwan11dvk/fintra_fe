# Partner Document Reference API Contract

## Overview

The Partner Document Reference API provides endpoints for managing document references required for specific partner types and companies. Document references define which documents (e.g., KTP, NPWP, Passport) must be uploaded by partners based on their country location, company, partner category, and partner type classification. The API uses JWT authentication and permission-based access control.

---

## Base Information

- **Base URL**: `/api/master/partner/doc-ref`
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
  "message": "Partner document references retrieved successfully",
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

### 1. Get All Partner Document References

Retrieves a paginated list of all partner document references with optional sorting.

**Endpoint**: `GET /`  
**Permission**: `master-data:document-reference:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, optional): Sort field and direction (e.g., "createdAt,desc")

#### Response (200 OK)

```json
{
  "message": "Partner document references retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "countryId": 101,
        "countryName": "Indonesia",
        "companyCode": "COMP001",
        "partnerCategoryId": 1,
        "partnerTypeId": 2,
        "partnerSubTypeId": 3,
        "documentName": "KTP",
        "isActive": true,
        "createdAt": "2026-01-27T10:30:00",
        "updatedAt": "2026-01-27T10:30:00",
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

### 2. Get Filtered Partner Document References

Retrieves a list of active partner document references filtered by multiple criteria without pagination.

**Endpoint**: `GET /filtered`  
**Permission**: None (Public)  
**Authentication**: Optional

#### Query Parameters

- `companyCode` (string, optional): Filter by company code
- `countryId` (Long, optional): Filter by country ID
- `partnerCategoryId` (Long, optional): Filter by partner category ID
- `partnerTypeId` (Long, optional): Filter by partner type ID
- `partnerSubTypeId` (Long, optional): Filter by partner sub-type ID

#### Response (200 OK)

```json
{
  "message": "Partner document references retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "countryId": 101,
      "countryName": "Indonesia",
      "companyCode": "COMP001",
      "partnerCategoryId": 1,
      "partnerTypeId": 2,
      "partnerSubTypeId": 3,
      "documentName": "KTP",
      "isActive": true,
      "createdAt": "2026-01-27T10:30:00",
      "updatedAt": "2026-01-27T10:30:00",
      "createdBy": "admin",
      "updatedBy": "admin"
    },
    {
      "id": 2,
      "countryId": 101,
      "countryName": "Indonesia",
      "companyCode": "COMP001",
      "partnerCategoryId": 1,
      "partnerTypeId": 2,
      "partnerSubTypeId": 3,
      "documentName": "NPWP",
      "isActive": true,
      "createdAt": "2026-01-27T11:00:00",
      "updatedAt": "2026-01-27T11:00:00",
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

### 3. Get Partner Document References by Country

Retrieves all active partner document references for a specific country.

**Endpoint**: `GET /country/{countryId}`  
**Permission**: `master-data:document-reference:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `countryId` (Long): Country ID (required)

#### Response (200 OK)

```json
{
  "message": "Partner document references retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "countryId": 101,
      "countryName": "Indonesia",
      "companyCode": "COMP001",
      "partnerCategoryId": 1,
      "partnerTypeId": 2,
      "partnerSubTypeId": 3,
      "documentName": "KTP",
      "isActive": true,
      "createdAt": "2026-01-27T10:30:00",
      "updatedAt": "2026-01-27T10:30:00",
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

### 4. Get Partner Document References by Country and Company

Retrieves all active partner document references for a specific country and company combination.

**Endpoint**: `GET /country/{countryId}/company/{companyCode}`  
**Permission**: `master-data:document-reference:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `countryId` (Long): Country ID (required)
- `companyCode` (String): Company Code (required)

#### Response (200 OK)

```json
{
  "message": "Partner document references retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "countryId": 101,
      "countryName": "Indonesia",
      "companyCode": "COMP001",
      "partnerCategoryId": 1,
      "partnerTypeId": 2,
      "partnerSubTypeId": 3,
      "documentName": "KTP",
      "isActive": true,
      "createdAt": "2026-01-27T10:30:00",
      "updatedAt": "2026-01-27T10:30:00",
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

### 5. Get Partner Document Reference by ID

Retrieves a specific partner document reference by its ID.

**Endpoint**: `GET /{id}`  
**Permission**: `master-data:document-reference:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Partner Document Reference ID (required)

#### Response (200 OK)

```json
{
  "message": "Partner document reference retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "countryId": 101,
    "countryName": "Indonesia",
    "companyCode": "COMP001",
    "partnerCategoryId": 1,
    "partnerTypeId": 2,
    "partnerSubTypeId": 3,
    "documentName": "KTP",
    "isActive": true,
    "createdAt": "2026-01-27T10:30:00",
    "updatedAt": "2026-01-27T10:30:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Partner document reference does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 6. Create Partner Document Reference

Creates a new partner document reference defining required documents for a specific partner type and company.

**Endpoint**: `POST /`  
**Permission**: `master-data:document-reference:create`  
**Authentication**: Required (Bearer Token)

#### Request Body

```json
{
  "countryId": 101,
  "companyCode": "COMP001",
  "partnerCategoryId": 1,
  "partnerTypeId": 2,
  "partnerSubTypeId": 3,
  "documentName": "KTP",
  "isActive": true
}
```

#### Request Validations

- `countryId`: Required, must be a valid country ID that exists in the system
- `companyCode`: Required, non-blank, 1-100 characters
- `partnerCategoryId`: Required, must be a valid partner category ID
- `partnerTypeId`: Required, must be a valid partner type ID
- `partnerSubTypeId`: Required, must be a valid partner sub-type ID
- `documentName`: Required, non-blank, 1-255 characters (e.g., "KTP", "NPWP", "Passport")
- `isActive`: Optional, boolean (defaults to true on creation)

#### Response (201 Created)

```json
{
  "message": "Partner document reference created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "countryId": 101,
    "countryName": "Indonesia",
    "companyCode": "COMP001",
    "partnerCategoryId": 1,
    "partnerTypeId": 2,
    "partnerSubTypeId": 3,
    "documentName": "KTP",
    "isActive": true,
    "createdAt": "2026-01-27T10:30:00",
    "updatedAt": "2026-01-27T10:30:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors (missing required fields, invalid format)
- **404 Not Found**: Country, partner category, or partner type not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 7. Update Partner Document Reference

Updates an existing partner document reference with new information.

**Endpoint**: `PUT /{id}`  
**Permission**: `master-data:document-reference:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Partner Document Reference ID (required)

#### Request Body

```json
{
  "countryId": 101,
  "companyCode": "COMP001",
  "partnerCategoryId": 1,
  "partnerTypeId": 2,
  "partnerSubTypeId": 3,
  "documentName": "KTP",
  "isActive": true
}
```

#### Request Validations

Same as Create endpoint.

#### Response (200 OK)

```json
{
  "message": "Partner document reference updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "countryId": 101,
    "countryName": "Indonesia",
    "companyCode": "COMP001",
    "partnerCategoryId": 1,
    "partnerTypeId": 2,
    "partnerSubTypeId": 3,
    "documentName": "KTP",
    "isActive": true,
    "createdAt": "2026-01-27T10:30:00",
    "updatedAt": "2026-01-27T11:00:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors
- **404 Not Found**: Partner document reference, country, partner category, or partner type not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 8. Delete Partner Document Reference

Deletes a partner document reference by ID.

**Endpoint**: `DELETE /{id}`  
**Permission**: `master-data:document-reference:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Partner Document Reference ID (required)

#### Response (200 OK)

```json
{
  "message": "Partner document reference deleted successfully",
  "status": "SUCCESS",
  "data": "Partner document reference deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Partner document reference does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Required Permissions Summary

| Operation      | Permission                             |
| -------------- | -------------------------------------- |
| List (GET /)   | `master-data:document-reference:list`   |
| Get by Filters | None (Public)                          |
| Get by Country | `master-data:document-reference:read`   |
| Get by ID      | `master-data:document-reference:read`   |
| Create         | `master-data:document-reference:create` |
| Update         | `master-data:document-reference:update` |
| Delete         | `master-data:document-reference:delete` |

---

## Authentication

### Bearer Token Format

```
Authorization: Bearer {jwt_token}
```

---

## Data Type Reference

| Type          | Format     | Example               | Notes                       |
| ------------- | ---------- | --------------------- | --------------------------- |
| Long          | Integer    | 101                   | Positive integer            |
| String        | Text       | "KTP"                 | See length constraints      |
| LocalDateTime | ISO 8601   | "2026-01-27T10:30:00" | Format: YYYY-MM-DDTHH:mm:ss |
| Boolean       | true/false | true                  | Active/inactive status      |

---

## Status Codes

| Code | Description                              |
| ---- | ---------------------------------------- |
| 200  | OK - Request successful                  |
| 201  | Created - Resource created successfully  |
| 400  | Bad Request - Validation errors          |
| 401  | Unauthorized - Missing/invalid token     |
| 403  | Forbidden - Insufficient permissions     |
| 404  | Not Found - Resource does not exist      |
| 500  | Internal Server Error - Unexpected error |

---

## Field Specifications

### countryId

- **Type**: Long
- **Required**: Yes
- **Description**: The ID of the country for which this document reference applies
- **Example**: 101
- **Validation**: Must reference an existing Country entity

### companyCode

- **Type**: String
- **Required**: Yes
- **Min Length**: 1
- **Max Length**: 100
- **Description**: Company identifier/code for which documents are required
- **Example**: "COMP001", "PT-ABC"
- **Notes**: Should match company codes used elsewhere in the system

### partnerCategoryId

- **Type**: Long
- **Required**: Yes
- **Description**: The ID of the partner category (e.g., Supplier, Customer, Agent)
- **Example**: 1
- **Validation**: Must reference an existing PartnerCategory entity

### partnerTypeId

- **Type**: Long
- **Required**: Yes
- **Description**: The ID of the partner type (e.g., Individual, Company, Government)
- **Example**: 2
- **Validation**: Must reference an existing PartnerType entity

### partnerSubTypeId

- **Type**: Long
- **Required**: Yes
- **Description**: The ID of the partner sub-type for more granular categorization
- **Example**: 3
- **Validation**: Must reference an existing PartnerType entity (sub-type)

### documentName

- **Type**: String
- **Required**: Yes
- **Min Length**: 1
- **Max Length**: 255
- **Description**: Name or description of the required document
- **Example**: "KTP", "NPWP", "Passport", "Business Registration"
- **Notes**: Should use standardized document type names

### isActive

- **Type**: Boolean
- **Required**: No
- **Default**: true (on creation)
- **Description**: Indicates whether this document reference requirement is currently active
- **Example**: true

### id

- **Type**: Long
- **Description**: Auto-generated unique identifier
- **Example**: 1

### countryName

- **Type**: String
- **Description**: Name of the country (returned in responses)
- **Example**: "Indonesia"

### createdAt

- **Type**: LocalDateTime
- **Description**: Timestamp when the record was created
- **Format**: ISO 8601 (YYYY-MM-DDTHH:mm:ss)
- **Example**: "2026-01-27T10:30:00"

### updatedAt

- **Type**: LocalDateTime
- **Description**: Timestamp when the record was last updated
- **Format**: ISO 8601 (YYYY-MM-DDTHH:mm:ss)
- **Example**: "2026-01-27T11:00:00"

### createdBy

- **Type**: String
- **Description**: Username of the user who created the record
- **Example**: "admin"

### updatedBy

- **Type**: String
- **Description**: Username of the user who last updated the record
- **Example**: "admin"

---

## Notes

1. **Active Flag**: Document references can be marked as inactive without deletion, allowing for soft deletion and historical tracking.

2. **Country Dependency**: A valid country must exist in the system before creating a document reference for it.

3. **Partner Category & Type**: Both partner category and type must exist as valid master data before creating references.

4. **Filtered Endpoint**: The `/filtered` endpoint is public and does not require authentication, making it suitable for frontend lookups of active document requirements.

5. **Audit Fields**: All resources include `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` for audit purposes.

6. **Pagination**: List endpoint supports pagination with configurable page size and sorting by default on `createdAt` in descending order.

7. **Company Code**: Different document requirements can exist for the same country/partner-type combination but different companies.

8. **Document Names**: Use standardized, consistent document names across the system (e.g., always "KTP" for Indonesian ID, not "Kartu Tanda Penduduk").

---

## Example Workflows

### Workflow 1: Retrieve Required Documents for a New Partner

1. Call `GET /filtered?countryId=101&partnerCategoryId=1&partnerTypeId=2&companyCode=COMP001`
2. System returns list of required documents for that specific combination
3. Frontend displays these as required fields in the partner creation form

### Workflow 2: Manage Document Requirements Admin

1. Administrator calls `GET /` with pagination to list all document references
2. Administrator creates new reference `POST /` for newly supported partner type
3. Administrator updates existing reference `PUT /1` to change document requirements
4. Administrator deletes obsolete reference `DELETE /5` when no longer needed

### Workflow 3: Partner Onboarding Integration

1. External system queries `GET /filtered?countryId=101&companyCode=COMP001`
2. System returns all required documents for Indonesia-based partners
3. External system validates uploaded documents against this reference list
4. Proceeds with partner validation if all required documents are provided
