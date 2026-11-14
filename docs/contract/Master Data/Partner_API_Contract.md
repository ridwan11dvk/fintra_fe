# Partner Management API Contract

## Overview

The Partner API provides comprehensive endpoints for managing partners (business entities like suppliers, customers, agents, partners, and other organizational entities). The API supports filtering by category, type, country, company code, and hierarchical organization. The API uses JWT authentication and permission-based access control.

---

## Base Information

- **Base URL**: `/api/master/partner`
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
  "message": "Partners retrieved successfully",
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

### 1. Get All Partners

Retrieves a paginated list of all partners with optional search.

**Endpoint**: `GET /`  
**Permission**: `master-data:partner:list`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `application/json`

#### Query Parameters

- `search` (string, optional): Search keyword to filter by code, name, email, or company code
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, default: "createdAt,desc"): Sort field and direction (e.g., "createdAt,desc", "name,asc")

#### Response (200 OK)

```json
{
  "message": "Partners retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "name": "PT Supplier Indonesia Jaya",
        "partnerCode": "SUPP001",
        "companyCode": "PT_XYZ",
        "partnerCategoryId": 1,
        "partnerTypeId": 1,
        "partnerSubTypeId": null,
        "moduleId": 1,
        "phoneNumber": "+62215551234",
        "email": "vendor@mitra.com",
        "npwp": "001001001001",
        "nitku": "123456789",
        "identityNumber": "3173012345678910",
        "nationality": "Indonesia",
        "plans": "Standard Plan",
        "address": "Jl. Merdeka No. 123, Jakarta 12000",
        "countryId": 1,
        "provinceId": 1,
        "regencyId": 1,
        "districtId": 1,
        "villageId": 1,
        "postalCode": "12000",
        "blacklistReason": null,
        "blacklistFile": null,
        "isValidatedByDjp": true,
        "integratedToErp": true,
        "taxExemptionPattern": "PTKP_TK",
        "isActive": true,
        "createdAt": "2026-01-27T10:30:00",
        "updatedAt": "2026-01-27T10:30:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      }
    ],
    "totalElements": 1,
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

- **400 Bad Request**: Invalid pagination or sort parameters
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 2. Get Partner by ID

Retrieves a specific partner by its ID.

**Endpoint**: `GET /{id}`  
**Permission**: `master-data:partner:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Partner ID (required)

#### Response (200 OK)

```json
{
  "message": "Partner retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "name": "PT Supplier Indonesia Jaya",
    "partnerCode": "SUPP001",
    "companyCode": "PT_XYZ",
    "partnerCategoryId": 1,
    "partnerTypeId": 1,
    "partnerSubTypeId": null,
    "moduleId": 1,
    "phoneNumber": "+62215551234",
    "email": "vendor@mitra.com",
    "npwp": "001001001001",
    "nitku": "123456789",
    "identityNumber": "3173012345678910",
    "nationality": "Indonesia",
    "plans": "Standard Plan",
    "address": "Jl. Merdeka No. 123, Jakarta 12000",
    "countryId": 1,
    "provinceId": 1,
    "regencyId": 1,
    "districtId": 1,
    "villageId": 1,
    "postalCode": "12000",
    "blacklistReason": null,
    "blacklistFile": null,
    "isValidatedByDjp": true,
    "integratedToErp": true,
    "taxExemptionPattern": "PTKP_TK",
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

- **404 Not Found**: Partner not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 3. Create Partner

Creates a new partner. Can optionally include documents, correspondents, and tax data with file uploads in a single request.

**Endpoint**: `POST /`  
**Permission**: `master-data:partner:create`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `multipart/form-data` (supports file uploads) or `application/json` (for basic partner data)

#### Request (Multipart Form-Data)

When uploading documents with the partner, use multipart/form-data format:

```
POST /api/master/partner
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="name"

PT Supplier Indonesia Jaya
------WebKitFormBoundary
Content-Disposition: form-data; name="partnerCode"

SUPP001
------WebKitFormBoundary
Content-Disposition: form-data; name="companyCode"

PT_XYZ
... (other fields)
------WebKitFormBoundary
Content-Disposition: form-data; name="files"; filename="document.pdf"
Content-Type: application/pdf

[binary file content]
------WebKitFormBoundary--
```

#### Request (JSON)

For basic partner creation without documents:

```json
{
  "name": "PT Supplier Indonesia Jaya",
  "partnerCode": "SUPP001",
  "companyCode": "PT_XYZ",
  "partnerCategoryId": 1,
  "partnerTypeId": 1,
  "partnerSubTypeId": null,
  "moduleId": 1,
  "phoneNumber": "+62215551234",
  "email": "vendor@mitra.com",
  "npwp": "001001001001",
  "nitku": "123456789",
  "identityNumber": "3173012345678910",
  "nationality": "Indonesia",
  "plans": "Standard Plan",
  "address": "Jl. Merdeka No. 123, Jakarta 12000",
  "countryId": 1,
  "provinceId": 1,
  "regencyId": 1,
  "districtId": 1,
  "villageId": 1,
  "postalCode": "12000",
  "blacklistReason": null,
  "blacklistFile": null,
  "isValidatedByDjp": true,
  "integratedToErp": true,
  "taxExemptionPattern": "PTKP_TK",
  "isActive": true
}
```

#### Request Validations

- `name`: Required, non-blank, maximum 255 characters
- `partnerCode`: Required, non-blank, maximum 50 characters, unique
- `companyCode`: Required, non-blank, maximum 100 characters
- `partnerCategoryId`: Required, must reference existing category
- `partnerTypeId`: Required, must reference existing type
- `partnerSubTypeId`: Optional (must reference existing type if provided)
- `moduleId`: Required, must reference existing module
- `phoneNumber`: Optional, maximum 20 characters
- `email`: Optional, must be valid email if provided, maximum 255 characters
- `npwp`: Optional, maximum 15 characters
- `nitku`: Optional, maximum 50 characters
- `identityNumber`: Optional, maximum 50 characters
- `nationality`: Optional, maximum 100 characters
- `plans`: Optional, maximum 255 characters
- `address`: Optional, no length limit
- `countryId`: Optional, must reference existing country if provided
- `provinceId`: Optional, must reference existing province if provided
- `regencyId`: Optional, must reference existing regency if provided
- `districtId`: Optional, must reference existing district if provided
- `villageId`: Optional, must reference existing village if provided
- `postalCode`: Optional, maximum 10 characters
- `blacklistReason`: Optional, no length limit
- `blacklistFile`: Optional, maximum 255 characters
- `isValidatedByDjp`: Optional, defaults to false
- `integratedToErp`: Optional, defaults to false
- `taxExemptionPattern`: Optional, maximum 255 characters
- `isActive`: Required, boolean

#### Response (201 Created)

When creating without supporting data:

```json
{
  "message": "Partner created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "name": "PT Supplier Indonesia Jaya",
    "partnerCode": "SUPP001",
    "companyCode": "PT_XYZ",
    "partnerCategoryId": 1,
    "partnerTypeId": 1,
    "partnerSubTypeId": null,
    "moduleId": 1,
    "phoneNumber": "+62215551234",
    "email": "vendor@mitra.com",
    "npwp": "001001001001",
    "nitku": "123456789",
    "identityNumber": "3173012345678910",
    "nationality": "Indonesia",
    "plans": "Standard Plan",
    "address": "Jl. Merdeka No. 123, Jakarta 12000",
    "countryId": 1,
    "provinceId": 1,
    "regencyId": 1,
    "districtId": 1,
    "villageId": 1,
    "postalCode": "12000",
    "blacklistReason": null,
    "blacklistFile": null,
    "isValidatedByDjp": true,
    "integratedToErp": true,
    "taxExemptionPattern": "PTKP_TK",
    "isActive": true,
    "createdAt": "2026-01-27T10:30:00",
    "updatedAt": "2026-01-27T10:30:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

When creating with supporting data (documents/correspondents/taxes/files):

```json
{
  "message": "Partner with documents created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "name": "PT Supplier Indonesia Jaya",
    "partnerCode": "SUPP001",
    "companyCode": "PT_XYZ",
    "partnerCategoryId": 1,
    "partnerTypeId": 1,
    "partnerSubTypeId": null,
    "moduleId": 1,
    "phoneNumber": "+62215551234",
    "email": "vendor@mitra.com",
    "npwp": "001001001001",
    "nitku": "123456789",
    "identityNumber": "3173012345678910",
    "nationality": "Indonesia",
    "plans": "Standard Plan",
    "address": "Jl. Merdeka No. 123, Jakarta 12000",
    "countryId": 1,
    "provinceId": 1,
    "regencyId": 1,
    "districtId": 1,
    "villageId": 1,
    "postalCode": "12000",
    "blacklistReason": null,
    "blacklistFile": null,
    "isValidatedByDjp": true,
    "integratedToErp": true,
    "taxExemptionPattern": "PTKP_TK",
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

- **400 Bad Request**: Validation errors (missing required fields, exceeding max length, invalid email, invalid reference IDs)
- **409 Conflict**: Duplicate partner code
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 4. Update Partner

Updates an existing partner.

**Endpoint**: `PUT /{id}`  
**Permission**: `master-data:partner:update`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `application/json`

#### URL Parameters

- `id` (Long): Partner ID (required)

#### Request

Same structure as Create endpoint - all fields are updatable.

#### Response (200 OK)

```json
{
  "message": "Partner updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "name": "PT Supplier Indonesia Jaya Updated",
    "partnerCode": "SUPP001",
    "companyCode": "PT_XYZ",
    "partnerCategoryId": 1,
    "partnerTypeId": 1,
    "partnerSubTypeId": null,
    "moduleId": 1,
    "phoneNumber": "+62215551234",
    "email": "vendor@mitra.com",
    "npwp": "001001001001",
    "nitku": "123456789",
    "identityNumber": "3173012345678910",
    "nationality": "Indonesia",
    "plans": "Premium Plan",
    "address": "Jl. Merdeka No. 123, Jakarta 12000",
    "countryId": 1,
    "provinceId": 1,
    "regencyId": 1,
    "districtId": 1,
    "villageId": 1,
    "postalCode": "12000",
    "blacklistReason": null,
    "blacklistFile": null,
    "isValidatedByDjp": true,
    "integratedToErp": true,
    "taxExemptionPattern": "PTKP_TK",
    "isActive": true,
    "createdAt": "2026-01-27T10:30:00",
    "updatedAt": "2026-01-27T15:00:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors
- **404 Not Found**: Partner not found
- **409 Conflict**: Duplicate partner code
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 5. Delete Partner

Deletes a partner by ID.

**Endpoint**: `DELETE /{id}`  
**Permission**: `master-data:partner:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Partner ID (required)

#### Response (200 OK)

```json
{
  "message": "Partner deleted successfully",
  "status": "SUCCESS",
  "data": "Partner deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Partner not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

---

## Partner Document Management

### 6. Get Partner Documents

Retrieves all documents for a specific partner with pagination.

**Endpoint**: `GET /{partnerId}/document`  
**Permission**: `master-data:partner:read`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `application/json`

#### URL Parameters

- `partnerId` (Long): Partner ID (required)

#### Query Parameters

- `search` (string, optional): Keyword for searching documents
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, default: "createdAt,desc"): Sort field and direction

#### Response (200 OK)

```json
{
  "message": "Documents retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "partnerId": 1,
        "documentName": "Invoice",
        "documentType": "INVOICE",
        "documentDate": "2026-01-27",
        "documentNumber": "INV001",
        "fileExtension": "pdf",
        "fileSize": 102400,
        "filePath": "/documents/partner_1/doc_1.pdf",
        "description": "Monthly invoice",
        "isActive": true,
        "createdAt": "2026-01-27T10:30:00",
        "updatedAt": "2026-01-27T10:30:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      }
    ],
    "totalElements": 1,
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

- **404 Not Found**: Partner not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 7. Create Partner Document

Creates and uploads a new document for a partner.

**Endpoint**: `POST /{partnerId}/document`  
**Permission**: `master-data:partner:update`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `multipart/form-data`

#### URL Parameters

- `partnerId` (Long): Partner ID (required)

#### Form Parameters

- `file` (file, required): The document file to upload
- `documentName` (string, required): Name of the document
- `documentType` (string, optional): Type of document (e.g., INVOICE, CONTRACT)
- `documentDate` (date, optional): Document date
- `documentNumber` (string, optional): Document number/reference
- `description` (string, optional): Description of the document
- `isActive` (boolean, default: true): Whether the document is active

#### Response (201 Created)

```json
{
  "message": "Document uploaded successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "partnerId": 1,
    "documentName": "Invoice",
    "documentType": "INVOICE",
    "documentDate": "2026-01-27",
    "documentNumber": "INV001",
    "fileExtension": "pdf",
    "fileSize": 102400,
    "filePath": "/documents/partner_1/doc_1.pdf",
    "description": "Monthly invoice",
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

- **400 Bad Request**: File is empty or validation errors
- **404 Not Found**: Partner not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 8. Update Partner Document

Updates document metadata (not the file itself).

**Endpoint**: `PUT /{partnerId}/document/{documentId}`  
**Permission**: `master-data:partner:update`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `application/json`

#### URL Parameters

- `partnerId` (Long): Partner ID (required)
- `documentId` (Long): Document ID (required)

#### Request

```json
{
  "documentName": "Invoice Updated",
  "documentType": "INVOICE",
  "documentDate": "2026-01-27",
  "documentNumber": "INV001",
  "description": "Updated monthly invoice",
  "isActive": true
}
```

#### Response (200 OK)

```json
{
  "message": "Document updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "partnerId": 1,
    "documentName": "Invoice Updated",
    "documentType": "INVOICE",
    "documentDate": "2026-01-27",
    "documentNumber": "INV001",
    "fileExtension": "pdf",
    "fileSize": 102400,
    "filePath": "/documents/partner_1/doc_1.pdf",
    "description": "Updated monthly invoice",
    "isActive": true,
    "createdAt": "2026-01-27T10:30:00",
    "updatedAt": "2026-01-27T10:45:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors
- **404 Not Found**: Document or Partner not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 9. Delete Partner Document

Deletes a partner document.

**Endpoint**: `DELETE /{partnerId}/document/{documentId}`  
**Permission**: `master-data:partner:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `partnerId` (Long): Partner ID (required)
- `documentId` (Long): Document ID (required)

#### Response (200 OK)

```json
{
  "message": "Document deleted successfully",
  "status": "SUCCESS",
  "data": "Document deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Document or Partner not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Partner Correspondent Management

### 10. Get Partner Correspondents

Retrieves all correspondents for a specific partner with pagination.

**Endpoint**: `GET /{partnerId}/correspondent`  
**Permission**: `master-data:partner:read`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `application/json`

#### URL Parameters

- `partnerId` (Long): Partner ID (required)

#### Query Parameters

- `search` (string, optional): Keyword for searching correspondents
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, default: "createdAt,desc"): Sort field and direction

#### Response (200 OK)

```json
{
  "message": "Correspondents retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "partnerId": 1,
        "name": "John Doe",
        "position": "Manager",
        "phone": "+62215551234",
        "email": "john.doe@mitra.com",
        "address": "Jl. Mitra No. 1, Jakarta",
        "isActive": true,
        "createdAt": "2026-01-27T10:30:00",
        "updatedAt": "2026-01-27T10:30:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      }
    ],
    "totalElements": 1,
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

- **404 Not Found**: Partner not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 11. Get Correspondent by ID

Retrieves a specific correspondent by ID.

**Endpoint**: `GET /{partnerId}/correspondent/{correspondentId}`  
**Permission**: `master-data:partner:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `partnerId` (Long): Partner ID (required)
- `correspondentId` (Long): Correspondent ID (required)

#### Response (200 OK)

```json
{
  "message": "Correspondent retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "partnerId": 1,
    "name": "John Doe",
    "position": "Manager",
    "phone": "+62215551234",
    "email": "john.doe@mitra.com",
    "address": "Jl. Mitra No. 1, Jakarta",
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

- **404 Not Found**: Correspondent not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 12. Create Correspondent

Creates a new correspondent for a partner.

**Endpoint**: `POST /{partnerId}/correspondent`  
**Permission**: `master-data:partner:update`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `application/json`

#### URL Parameters

- `partnerId` (Long): Partner ID (required)

#### Request

```json
{
  "name": "John Doe",
  "position": "Manager",
  "phone": "+62215551234",
  "email": "john.doe@mitra.com",
  "address": "Jl. Mitra No. 1, Jakarta",
  "isActive": true
}
```

#### Response (201 Created)

```json
{
  "message": "Correspondent created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "partnerId": 1,
    "name": "John Doe",
    "position": "Manager",
    "phone": "+62215551234",
    "email": "john.doe@mitra.com",
    "address": "Jl. Mitra No. 1, Jakarta",
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

- **400 Bad Request**: Validation errors
- **404 Not Found**: Partner not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 13. Update Correspondent

Updates an existing correspondent.

**Endpoint**: `PUT /{partnerId}/correspondent/{correspondentId}`  
**Permission**: `master-data:partner:update`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `application/json`

#### URL Parameters

- `partnerId` (Long): Partner ID (required)
- `correspondentId` (Long): Correspondent ID (required)

#### Request

```json
{
  "name": "Jane Doe",
  "position": "Senior Manager",
  "phone": "+62215555678",
  "email": "jane.doe@mitra.com",
  "address": "Jl. Mitra No. 2, Jakarta",
  "isActive": true
}
```

#### Response (200 OK)

```json
{
  "message": "Correspondent updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "partnerId": 1,
    "name": "Jane Doe",
    "position": "Senior Manager",
    "phone": "+62215555678",
    "email": "jane.doe@mitra.com",
    "address": "Jl. Mitra No. 2, Jakarta",
    "isActive": true,
    "createdAt": "2026-01-27T10:30:00",
    "updatedAt": "2026-01-27T10:45:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors
- **404 Not Found**: Correspondent or Partner not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 14. Delete Correspondent

Deletes a correspondent.

**Endpoint**: `DELETE /{partnerId}/correspondent/{correspondentId}`  
**Permission**: `master-data:partner:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `partnerId` (Long): Partner ID (required)
- `correspondentId` (Long): Correspondent ID (required)

#### Response (200 OK)

```json
{
  "message": "Correspondent deleted successfully",
  "status": "SUCCESS",
  "data": "Correspondent deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Correspondent or Partner not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Partner Tax Management

### 15. Get Partner Taxes

Retrieves all tax associations for a specific partner with pagination.

**Endpoint**: `GET /{partnerId}/tax`  
**Permission**: `master-data:partner:read`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `application/json`

#### URL Parameters

- `partnerId` (Long): Partner ID (required)

#### Query Parameters

- `search` (string, optional): Keyword for searching partner taxes
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, default: "createdAt,desc"): Sort field and direction

#### Response (200 OK)

```json
{
  "message": "Taxes retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "partnerId": 1,
        "taxRateId": 1,
        "effectiveDate": "2026-01-01",
        "expiryDate": "2026-12-31",
        "isActive": true,
        "createdAt": "2026-01-27T10:30:00",
        "updatedAt": "2026-01-27T10:30:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      }
    ],
    "totalElements": 1,
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

- **404 Not Found**: Partner not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 16. Get Tax by ID

Retrieves a specific tax association by ID.

**Endpoint**: `GET /{partnerId}/tax/{taxId}`  
**Permission**: `master-data:partner:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `partnerId` (Long): Partner ID (required)
- `taxId` (Long): Tax Association ID (required)

#### Response (200 OK)

```json
{
  "message": "Tax retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "partnerId": 1,
    "taxRateId": 1,
    "effectiveDate": "2026-01-01",
    "expiryDate": "2026-12-31",
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

- **404 Not Found**: Tax association not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 17. Create Tax Association

Creates a new tax association for a partner.

**Endpoint**: `POST /{partnerId}/tax`  
**Permission**: `master-data:partner:update`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `application/json`

#### URL Parameters

- `partnerId` (Long): Partner ID (required)

#### Request

```json
{
  "taxRateId": 1,
  "effectiveDate": "2026-01-01",
  "expiryDate": "2026-12-31",
  "isActive": true
}
```

#### Response (201 Created)

```json
{
  "message": "Tax association created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "partnerId": 1,
    "taxRateId": 1,
    "effectiveDate": "2026-01-01",
    "expiryDate": "2026-12-31",
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

- **400 Bad Request**: Validation errors
- **404 Not Found**: Partner or Tax Rate not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 18. Update Tax Association

Updates an existing tax association.

**Endpoint**: `PUT /{partnerId}/tax/{taxId}`  
**Permission**: `master-data:partner:update`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `application/json`

#### URL Parameters

- `partnerId` (Long): Partner ID (required)
- `taxId` (Long): Tax Association ID (required)

#### Request

```json
{
  "taxRateId": 2,
  "effectiveDate": "2026-02-01",
  "expiryDate": "2026-12-31",
  "isActive": true
}
```

#### Response (200 OK)

```json
{
  "message": "Tax association updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "partnerId": 1,
    "taxRateId": 2,
    "effectiveDate": "2026-02-01",
    "expiryDate": "2026-12-31",
    "isActive": true,
    "createdAt": "2026-01-27T10:30:00",
    "updatedAt": "2026-01-27T10:45:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors
- **404 Not Found**: Tax association or Partner not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 19. Delete Tax Association

Deletes a tax association.

**Endpoint**: `DELETE /{partnerId}/tax/{taxId}`  
**Permission**: `master-data:partner:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `partnerId` (Long): Partner ID (required)
- `taxId` (Long): Tax Association ID (required)

#### Response (200 OK)

```json
{
  "message": "Tax association deleted successfully",
  "status": "SUCCESS",
  "data": "Tax association deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Tax association or Partner not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Partner Transaction Account Management

### 20. Get Partner Transaction Accounts

Retrieves all transaction accounts for a specific partner with pagination and optional filters.

**Endpoint**: `GET /{partnerId}/transaction-account`  
**Permission**: `master-data:partner:read`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `application/json`

#### URL Parameters

- `partnerId` (Long): Partner ID (required)

#### Query Parameters

- `search` (string, optional): Keyword for searching transaction accounts (by account number, holder, or bank code)
- `type` (string, optional): Filter by transaction account type (e.g., DOMESTIC, FOREIGN)
- `companyCode` (string, optional): Filter by company code
- `isActive` (boolean, optional): Filter by active status
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, default: "createdAt,desc"): Sort field and direction

#### Response (200 OK)

```json
{
  "message": "Transaction accounts retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "partnerId": 1,
        "correspondentId": null,
        "companyCode": "PT_XYZ",
        "bankCode": "BBBAIDJA",
        "type": "DOMESTIC",
        "accountNumber": "123456789012",
        "accountHolder": "PT Supplier Indonesia Jaya",
        "isActive": true,
        "createdAt": "2026-01-27T10:30:00",
        "updatedAt": "2026-01-27T10:30:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      }
    ],
    "totalElements": 1,
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

- **404 Not Found**: Partner not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 21. Get Transaction Account by ID

Retrieves a specific transaction account by ID.

**Endpoint**: `GET /{partnerId}/transaction-account/{accountId}`  
**Permission**: `master-data:partner:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `partnerId` (Long): Partner ID (required)
- `accountId` (Long): Transaction Account ID (required)

#### Response (200 OK)

```json
{
  "message": "Transaction account retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "partnerId": 1,
    "correspondentId": null,
    "companyCode": "PT_XYZ",
    "bankCode": "BBBAIDJA",
    "type": "DOMESTIC",
    "accountNumber": "123456789012",
    "accountHolder": "PT Supplier Indonesia Jaya",
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

- **404 Not Found**: Transaction account not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 22. Create Transaction Account

Creates a new transaction account for a partner.

**Endpoint**: `POST /{partnerId}/transaction-account`  
**Permission**: `master-data:partner:update`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `application/json`

#### URL Parameters

- `partnerId` (Long): Partner ID (required)

#### Request

```json
{
  "companyCode": "PT_XYZ",
  "bankCode": "BBBAIDJA",
  "type": "DOMESTIC",
  "accountNumber": "123456789012",
  "accountHolder": "PT Supplier Indonesia Jaya",
  "correspondentId": null,
  "isActive": true
}
```

#### Request Validations

- `companyCode`: Required, non-blank, maximum 100 characters
- `bankCode`: Required, non-blank, maximum 20 characters
- `type`: Required, must be valid transaction account type (DOMESTIC, FOREIGN, etc.)
- `accountNumber`: Required, non-blank, maximum 50 characters
- `accountHolder`: Required, non-blank, maximum 255 characters
- `correspondentId`: Optional, must reference existing correspondent if provided
- `isActive`: Optional, defaults to true

#### Response (201 Created)

```json
{
  "message": "Transaction account created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "partnerId": 1,
    "correspondentId": null,
    "companyCode": "PT_XYZ",
    "bankCode": "BBBAIDJA",
    "type": "DOMESTIC",
    "accountNumber": "123456789012",
    "accountHolder": "PT Supplier Indonesia Jaya",
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

- **400 Bad Request**: Validation errors (missing required fields, invalid type)
- **404 Not Found**: Partner or Correspondent not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 23. Update Transaction Account

Updates an existing transaction account.

**Endpoint**: `PUT /{partnerId}/transaction-account/{accountId}`  
**Permission**: `master-data:partner:update`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `application/json`

#### URL Parameters

- `partnerId` (Long): Partner ID (required)
- `accountId` (Long): Transaction Account ID (required)

#### Request

```json
{
  "companyCode": "PT_XYZ",
  "bankCode": "BBBAIDJA",
  "type": "DOMESTIC",
  "accountNumber": "987654321098",
  "accountHolder": "PT Supplier Indonesia Jaya Updated",
  "correspondentId": null,
  "isActive": true
}
```

#### Response (200 OK)

```json
{
  "message": "Transaction account updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "partnerId": 1,
    "correspondentId": null,
    "companyCode": "PT_XYZ",
    "bankCode": "BBBAIDJA",
    "type": "DOMESTIC",
    "accountNumber": "987654321098",
    "accountHolder": "PT Supplier Indonesia Jaya Updated",
    "isActive": true,
    "createdAt": "2026-01-27T10:30:00",
    "updatedAt": "2026-01-27T10:35:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors
- **404 Not Found**: Transaction account or Partner not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 24. Delete Transaction Account

Deletes a transaction account.

**Endpoint**: `DELETE /{partnerId}/transaction-account/{accountId}`  
**Permission**: `master-data:partner:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `partnerId` (Long): Partner ID (required)
- `accountId` (Long): Transaction Account ID (required)

#### Response (200 OK)

```json
{
  "message": "Transaction account deleted successfully",
  "status": "SUCCESS",
  "data": "Transaction account deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Transaction account or Partner not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Partner ERP Code Management

### 25. Get Partner ERP Codes

Retrieves all ERP code mappings for a specific partner with pagination.

**Endpoint**: `GET /{partnerId}/erp-code`  
**Permission**: `master-data:partner:read`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `application/json`

#### URL Parameters

- `partnerId` (Long): Partner ID (required)

#### Query Parameters

- `search` (string, optional): Keyword for searching ERP codes
- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sort` (string, default: "createdAt,desc"): Sort field and direction

#### Response (200 OK)

```json
{
  "message": "ERP codes retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "partnerId": 1,
        "partnerName": "PT Supplier Indonesia Jaya",
        "erpCode": "VENDOR001",
        "companyCode": "PT_XYZ",
        "partnerClassificationId": 1,
        "partnerClassificationName": "External",
        "partnerCategoryId": 2,
        "partnerCategoryName": "Supplier",
        "partnerTypeId": 3,
        "partnerTypeName": "Domestic Supplier",
        "partnerSubTypeId": null,
        "partnerSubTypeName": null,
        "isActive": true,
        "createdAt": "2026-01-27T10:30:00",
        "updatedAt": "2026-01-27T10:30:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      }
    ],
    "totalElements": 1,
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

- **404 Not Found**: Partner not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 26. Get ERP Code by ID

Retrieves a specific ERP code mapping by ID.

**Endpoint**: `GET /{partnerId}/erp-code/{erpCodeId}`  
**Permission**: `master-data:partner:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `partnerId` (Long): Partner ID (required)
- `erpCodeId` (Long): ERP Code ID (required)

#### Response (200 OK)

```json
{
  "message": "ERP code retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "partnerId": 1,
    "partnerName": "PT Supplier Indonesia Jaya",
    "erpCode": "VENDOR001",
    "companyCode": "PT_XYZ",
    "partnerClassificationId": 1,
    "partnerClassificationName": "External",
    "partnerCategoryId": 2,
    "partnerCategoryName": "Supplier",
    "partnerTypeId": 3,
    "partnerTypeName": "Domestic Supplier",
    "partnerSubTypeId": null,
    "partnerSubTypeName": null,
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

- **404 Not Found**: ERP code not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 27. Create ERP Code

Creates a new ERP code mapping for a partner.

**Endpoint**: `POST /{partnerId}/erp-code`  
**Permission**: `master-data:partner:update`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `application/json`

#### URL Parameters

- `partnerId` (Long): Partner ID (required)

#### Request

```json
{
  "erpCode": "VENDOR001",
  "companyCode": "PT_XYZ",
  "partnerClassificationId": 1,
  "partnerCategoryId": 2,
  "partnerTypeId": 3,
  "partnerSubTypeId": null,
  "isActive": true
}
```

#### Request Validations

- `erpCode`: Required, non-blank, maximum 100 characters
- `companyCode`: Optional, maximum 100 characters
- `partnerClassificationId`: Optional, must reference existing classification if provided
- `partnerCategoryId`: Optional, must reference existing category if provided
- `partnerTypeId`: Optional, must reference existing type if provided
- `partnerSubTypeId`: Optional, must reference existing sub-type if provided
- `isActive`: Optional, defaults to true
- Combination of `erpCode`, `companyCode`, `partnerClassificationId`, `partnerCategoryId`, `partnerTypeId`, and `partnerSubTypeId` must be unique per partner

#### Response (201 Created)

```json
{
  "message": "ERP code created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "partnerId": 1,
    "partnerName": "PT Supplier Indonesia Jaya",
    "erpCode": "VENDOR001",
    "companyCode": "PT_XYZ",
    "partnerClassificationId": 1,
    "partnerClassificationName": "External",
    "partnerCategoryId": 2,
    "partnerCategoryName": "Supplier",
    "partnerTypeId": 3,
    "partnerTypeName": "Domestic Supplier",
    "partnerSubTypeId": null,
    "partnerSubTypeName": null,
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

- **400 Bad Request**: Validation errors (missing required fields, exceeding max length)
- **404 Not Found**: Partner or referenced classification/category/type not found
- **409 Conflict**: Duplicate ERP code combination
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 28. Update ERP Code

Updates an existing ERP code mapping.

**Endpoint**: `PUT /{partnerId}/erp-code/{erpCodeId}`  
**Permission**: `master-data:partner:update`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `application/json`

#### URL Parameters

- `partnerId` (Long): Partner ID (required)
- `erpCodeId` (Long): ERP Code ID (required)

#### Request

```json
{
  "erpCode": "VENDOR001-UPDATED",
  "companyCode": "PT_XYZ",
  "partnerClassificationId": 1,
  "partnerCategoryId": 2,
  "partnerTypeId": 3,
  "partnerSubTypeId": null,
  "isActive": true
}
```

#### Response (200 OK)

```json
{
  "message": "ERP code updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "partnerId": 1,
    "partnerName": "PT Supplier Indonesia Jaya",
    "erpCode": "VENDOR001-UPDATED",
    "companyCode": "PT_XYZ",
    "partnerClassificationId": 1,
    "partnerClassificationName": "External",
    "partnerCategoryId": 2,
    "partnerCategoryName": "Supplier",
    "partnerTypeId": 3,
    "partnerTypeName": "Domestic Supplier",
    "partnerSubTypeId": null,
    "partnerSubTypeName": null,
    "isActive": true,
    "createdAt": "2026-01-27T10:30:00",
    "updatedAt": "2026-01-27T10:35:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors
- **404 Not Found**: ERP code or Partner not found
- **409 Conflict**: Duplicate ERP code combination
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 29. Delete ERP Code

Deletes a partner ERP code mapping.

**Endpoint**: `DELETE /{partnerId}/erp-code/{erpCodeId}`  
**Permission**: `master-data:partner:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `partnerId` (Long): Partner ID (required)
- `erpCodeId` (Long): ERP Code ID (required)

#### Response (200 OK)

```json
{
  "message": "ERP code deleted successfully",
  "status": "SUCCESS",
  "data": "ERP code deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: ERP code or Partner not found
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Required Permissions Summary

| Operation                                    | Permission                  |
| -------------------------------------------- | --------------------------- |
| List Partners                                | `master-data:partner:list`   |
| Read Partner / Sub-entities (GET)            | `master-data:partner:read`   |
| Create Partner                               | `master-data:partner:create` |
| Update Partner                               | `master-data:partner:update` |
| Delete Partner                               | `master-data:partner:delete` |
| Create / Update / Delete Document            | `master-data:partner:update` |
| Create / Update / Delete Correspondent       | `master-data:partner:update` |
| Create / Update / Delete Tax Association     | `master-data:partner:update` |
| Create / Update / Delete Transaction Account | `master-data:partner:update` |
| Create / Update / Delete ERP Code            | `master-data:partner:update` |

---

## Authentication

### Bearer Token Format

```
Authorization: Bearer {jwt_token}
```

---

## Data Type Reference

| Type          | Format     | Example               |
| ------------- | ---------- | --------------------- |
| Long          | Integer    | 1                     |
| String        | Text       | "SUPP001"             |
| Boolean       | true/false | true                  |
| LocalDateTime | ISO 8601   | "2026-01-27T10:30:00" |

---

## Status Codes

| Code | Description                                                 |
| ---- | ----------------------------------------------------------- |
| 200  | OK - Request successful                                     |
| 201  | Created - Resource created successfully                     |
| 400  | Bad Request - Validation errors                             |
| 401  | Unauthorized - Missing/invalid authentication               |
| 403  | Forbidden - Insufficient permissions                        |
| 404  | Not Found - Resource does not exist                         |
| 409  | Conflict - Duplicate resource (unique constraint violation) |
| 500  | Internal Server Error - Unexpected server error             |

---

## Notes

1. **ID Format**: The partner ID is auto-generated by the database as a Long value.
2. **Module Requirement**: Every partner must be assigned to a module. The `moduleId` is required in both create and update operations.
3. **Relationships**: Partners require valid references to:
   - Partner Category (required)
   - Partner Type (required)
   - Partner Sub-Type (optional)
   - Module (required)
   - Location information: Country, Province, Regency, District, Village (all optional)
4. **Partner Code Uniqueness**: The `partnerCode` must be unique across the system.
5. **Audit Fields**: All resources include `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` for audit purposes.
6. **Active Status**: The `isActive` field determines whether the partner is available for use in the system.
7. **Search**: Search functionality filters by partner code, name, email, or company code.
8. **Tax Information**: Partners can have tax-related fields including NPWP, NITKU, and tax exemption patterns for Indonesian tax compliance.
9. **Tax Associations**: Tax associations link partners with tax rates and have effective/expiry dates for time-bound tax rules.
10. **Blacklist Support**: Partners can be blacklisted with reason and file reference for compliance tracking.
11. **ERP Integration**: The `integratedToErp` flag indicates whether this partner is synchronized with your ERP system.
12. **Documents**: Partners can have multiple documents attached for record-keeping. File uploads are supported via multipart/form-data.
13. **Correspondents**: Partners can have multiple correspondence contacts. Each correspondent has contact details like name, position, phone, and email.
14. **Nested Resource Structure**: Document, Correspondent, and Tax management endpoints follow the nested resource pattern: `/{partnerId}/{resource}` and `/{partnerId}/{resource}/{resourceId}`.
15. **Transaction Accounts**: Partners can have multiple transaction accounts (bank accounts, foreign exchange accounts, etc.) for financial transactions. Each account is linked to a company code, bank, and account holder information.
16. **Transaction Account Types**: Supported types include DOMESTIC (for local bank accounts) and FOREIGN (for international accounts). The type determines how the account can be used in financial operations.
17. **Correspondent Association**: Transaction accounts can optionally be linked to a specific correspondent contact for additional routing or approval workflow purposes.
