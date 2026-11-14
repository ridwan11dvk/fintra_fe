# Company Management API Contract

## Overview

The Company Management API provides endpoints for managing companies, including company metadata, file uploads (logo, header, footer), and arbitrary company file attachments. The API uses JWT authentication and permission-based access control.

---

## Base Information

- **Base URL**: `/api/master/company`
- **Authentication**: Bearer JWT Token
- **Content-Type**: `application/json` (except multipart/form-data for file uploads)
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
  "message": "Companies retrieved successfully",
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

## Company Operations

### 1. List All Companies

Retrieves a paginated list of companies with optional search and active filter.

**Endpoint**: `GET /`  
**Permission**: `master-data:company:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `keyword` (string, optional): Search keyword to filter by code or name
- `isActive` (boolean, optional): Filter by active status (true/false)
- `sort` (string, default: "updatedAt,desc"): Sort parameters

#### Response (200 OK)

```json
{
  "message": "Companies retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "code": "COMP001",
        "name": "PT Company Indonesia",
        "address": "Jl. Merdeka No. 1, Jakarta",
        "logoFile": "company/1/1709032800000-logo.png",
        "headerDocFile": "company/1/1709032800001-header.pdf",
        "footerDocFile": "company/1/1709032800002-footer.pdf",
        "isActive": true,
        "createdAt": "2026-01-20T10:30:00",
        "updatedAt": "2026-02-26T14:15:00",
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

- **400 Bad Request**: Invalid pagination parameters
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 2. Get Company by ID

Retrieves a specific company with all its associated files.

**Endpoint**: `GET /{id}`  
**Permission**: `master-data:company:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Company ID (required)

#### Response (200 OK)

```json
{
  "message": "Company retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "COMP001",
    "name": "PT Company Indonesia",
    "address": "Jl. Merdeka No. 1, Jakarta",
    "logoFile": "company/1/1709032800000-logo.png",
    "headerDocFile": "company/1/1709032800001-header.pdf",
    "footerDocFile": "company/1/1709032800002-footer.pdf",
    "isActive": true,
    "files": [
      {
        "id": 1,
        "companyId": 1,
        "alias": "CERTIFICATE",
        "name": "Tax Certificate.pdf",
        "filePath": "company/1/1709032800003-certificate.pdf",
        "uploadedDate": "2026-01-20T10:30:00",
        "validFrom": "2026-01-01T00:00:00",
        "validTo": "2027-01-01T00:00:00",
        "isActive": true,
        "createdAt": "2026-01-20T10:30:00",
        "updatedAt": "2026-01-20T10:30:00"
      }
    ],
    "createdAt": "2026-01-20T10:30:00",
    "updatedAt": "2026-02-26T14:15:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Company does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 3. Create Company with Files

Creates a new company with optional file uploads (logo, header, footer, and arbitrary files).

**Endpoint**: `POST /`  
**Permission**: `master-data:company:create`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `multipart/form-data`

#### Request (Multipart Form)

**Form Fields:**

- `code` (string, required): Company code, max 50 characters
- `name` (string, required): Company name, max 255 characters
- `address` (string, optional): Company address, max 255 characters
- `isActive` (boolean, required): Active status
- `files` (array of files, optional): List of files to upload
- `fileAliases` (string, optional): File-to-alias mapping. Format: `"0=LOGO,1=HEADER_DOC,2=FOOTER_DOC,3=CUSTOM_ALIAS"`

**Example cURL:**

```bash
curl -X POST http://localhost:8080/api/master/company \
  -H "Authorization: Bearer {jwt_token}" \
  -F "code=COMP001" \
  -F "name=PT Company Indonesia" \
  -F "address=Jl. Merdeka No. 1, Jakarta" \
  -F "isActive=true" \
  -F "files=@logo.png" \
  -F "files=@header.pdf" \
  -F "files=@footer.pdf" \
  -F "files=@certificate.pdf" \
  -F "fileAliases=0=LOGO,1=HEADER_DOC,2=FOOTER_DOC,3=CERTIFICATE"
```

#### Request Validations

- `code`: Required, max 50 characters
- `name`: Required, max 255 characters
- `address`: Optional, max 255 characters
- `isActive`: Required, boolean
- `files`: Optional, array of files
- `fileAliases`: Optional, comma-separated index=alias pairs

#### Response (201 Created)

```json
{
  "message": "Company created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "code": "COMP001",
    "name": "PT Company Indonesia",
    "address": "Jl. Merdeka No. 1, Jakarta",
    "logoFile": "company/1/1709032800000-logo.png",
    "headerDocFile": "company/1/1709032800001-header.pdf",
    "footerDocFile": "company/1/1709032800002-footer.pdf",
    "isActive": true,
    "files": [
      {
        "id": 1,
        "companyId": 1,
        "alias": "CERTIFICATE",
        "name": "certificate.pdf",
        "filePath": "company/1/1709032800003-certificate.pdf",
        "uploadedDate": "2026-02-26T14:15:00",
        "isActive": true,
        "createdAt": "2026-02-26T14:15:00",
        "updatedAt": "2026-02-26T14:15:00"
      }
    ],
    "createdAt": "2026-02-26T14:15:00",
    "updatedAt": "2026-02-26T14:15:00",
    "createdBy": "user@company.com",
    "updatedBy": "user@company.com"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors, empty file, or invalid file alias mapping
- **500 Internal Server Error**: File upload failed (files are cleaned up automatically)
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

#### File Upload Rollback

If any error occurs during file upload or company creation, all successfully uploaded files are automatically deleted from storage to prevent orphaned files.

---

### 4. Update Company with Files

Updates an existing company information and optionally replaces logo, header, or footer files.

**Endpoint**: `PUT /{id}`  
**Permission**: `master-data:company:update`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `multipart/form-data`

#### URL Parameters

- `id` (Long): Company ID (required)

#### Request (Multipart Form)

**Form Fields:**

- `code` (string, optional): Company code update
- `name` (string, optional): Company name update
- `address` (string, optional): Company address update
- `isActive` (boolean, optional): Active status update
- `logoFile` (file, optional): Replace company logo
- `headerDocFile` (file, optional): Replace header document
- `footerDocFile` (file, optional): Replace footer document

**Example cURL:**

```bash
curl -X PUT http://localhost:8080/api/master/company/1 \
  -H "Authorization: Bearer {jwt_token}" \
  -F "name=PT Company Indonesia Updated" \
  -F "logoFile=@new_logo.png"
```

#### Request Validations

- `code`: Optional, max 50 characters
- `name`: Optional, max 255 characters
- `address`: Optional, max 255 characters
- `isActive`: Optional, boolean
- All file fields are optional and independent

#### Response (200 OK)

Same structure as Create Company endpoint.

#### Error Responses

- **400 Bad Request**: Validation errors
- **404 Not Found**: Company does not exist
- **500 Internal Server Error**: File upload failed (previously uploaded files are cleaned up)
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 5. Delete Company

Deletes a company and its associated data.

**Endpoint**: `DELETE /{id}`  
**Permission**: `master-data:company:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Company ID (required)

#### Response (200 OK)

```json
{
  "message": "Company deleted successfully",
  "status": "SUCCESS",
  "data": "Company deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Company does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Company File Operations

### 6. Upload File to Company

Uploads and attaches a new file to an existing company.

**Endpoint**: `POST /{companyId}/file`  
**Permission**: `master-data:company:update`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `multipart/form-data`

#### URL Parameters

- `companyId` (Long): Company ID (required)

#### Query Parameters

- `file` (file, required): File to upload
- `alias` (string, default: "CUSTOM"): File alias/identifier

#### Response (201 Created)

```json
{
  "message": "File uploaded successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "companyId": 1,
    "alias": "CERTIFICATE",
    "name": "certificate.pdf",
    "filePath": "company/1/1709032800003-certificate.pdf",
    "uploadedDate": "2026-02-26T14:15:00",
    "isActive": true,
    "createdAt": "2026-02-26T14:15:00",
    "updatedAt": "2026-02-26T14:15:00"
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: File is empty
- **404 Not Found**: Company does not exist
- **500 Internal Server Error**: File upload failed
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 7. Update Company File

Updates file metadata (validity dates, alias) and optionally replaces the file content.

**Endpoint**: `PUT /{companyId}/file/{fileId}`  
**Permission**: `master-data:company:update`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `multipart/form-data`

#### URL Parameters

- `companyId` (Long): Company ID (required)
- `fileId` (Long): Company file ID (required)

#### Request (Multipart Form)

**Form Fields:**

- `alias` (string, optional): Update file alias
- `validFrom` (string, optional): Validity start date (ISO 8601: YYYY-MM-DD)
- `validTo` (string, optional): Validity end date (ISO 8601: YYYY-MM-DD)
- `isActive` (boolean, optional): Active status
- `file` (file, optional): Replace file content

**Example cURL:**

```bash
curl -X PUT http://localhost:8080/api/master/company/1/file/1 \
  -H "Authorization: Bearer {jwt_token}" \
  -F "validTo=2027-02-26" \
  -F "file=@updated_certificate.pdf"
```

#### Response (200 OK)

```json
{
  "message": "Company file updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "companyId": 1,
    "alias": "CERTIFICATE",
    "name": "updated_certificate.pdf",
    "filePath": "company/1/1709032800004-updated_certificate.pdf",
    "uploadedDate": "2026-02-26T14:20:00",
    "validFrom": null,
    "validTo": "2027-02-26T00:00:00",
    "isActive": true,
    "createdAt": "2026-02-26T14:15:00",
    "updatedAt": "2026-02-26T14:20:00"
  },
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: File does not exist
- **500 Internal Server Error**: File update failed
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 8. Delete Company File

Deletes a company file from both database and object storage.

**Endpoint**: `DELETE /{companyId}/file/{fileId}`  
**Permission**: `master-data:company:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `companyId` (Long): Company ID (required)
- `fileId` (Long): Company file ID (required)

#### Response (200 OK)

```json
{
  "message": "Company file deleted successfully (database + storage)",
  "status": "SUCCESS",
  "data": "Company file deleted successfully (database + storage)",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: File does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Presigned URL Operations

### 9. Get Logo Presigned URL

Generates a time-limited presigned URL for downloading the company logo.

**Endpoint**: `GET /{id}/logo-url`  
**Permission**: `master-data:company:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Company ID (required)

#### Response (200 OK)

```json
{
  "message": "Logo presigned URL retrieved successfully",
  "status": "SUCCESS",
  "data": "http://object-418.kai.id/finalink-dev/company/1/1709032800000-logo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Company or logo file not found
- **500 Internal Server Error**: Failed to generate presigned URL
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 10. Get Header Document Presigned URL

Generates a time-limited presigned URL for downloading the company header document.

**Endpoint**: `GET /{id}/header-url`  
**Permission**: `master-data:company:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Company ID (required)

#### Response (200 OK)

```json
{
  "message": "Header presigned URL retrieved successfully",
  "status": "SUCCESS",
  "data": "http://object-418.kai.id/finalink-dev/company/1/1709032800001-header.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Company or header file not found
- **500 Internal Server Error**: Failed to generate presigned URL
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 11. Get Footer Document Presigned URL

Generates a time-limited presigned URL for downloading the company footer document.

**Endpoint**: `GET /{id}/footer-url`  
**Permission**: `master-data:company:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): Company ID (required)

#### Response (200 OK)

```json
{
  "message": "Footer presigned URL retrieved successfully",
  "status": "SUCCESS",
  "data": "http://object-418.kai.id/finalink-dev/company/1/1709032800002-footer.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: Company or footer file not found
- **500 Internal Server Error**: Failed to generate presigned URL
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 12. Get Company File Presigned URL

Generates a time-limited presigned URL for downloading a company file.

**Endpoint**: `GET /{companyId}/file/{fileId}/preview-url`  
**Permission**: `master-data:company:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `companyId` (Long): Company ID (required)
- `fileId` (Long): Company file ID (required)

#### Response (200 OK)

```json
{
  "message": "File presigned URL retrieved successfully",
  "status": "SUCCESS",
  "data": "http://object-418.kai.id/finalink-dev/company/1/1709032800003-certificate.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: File not found
- **500 Internal Server Error**: Failed to generate presigned URL
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## File Types Reference

### Fixed Files (Company Metadata)

These files are stored directly in the Company entity:

| File Type  | Field Name    | Purpose               |
| ---------- | ------------- | --------------------- |
| Logo       | logoFile      | Company logo/branding |
| Header Doc | headerDocFile | Header for documents  |
| Footer Doc | footerDocFile | Footer for documents  |

### Arbitrary Files (CompanyFile Records)

Custom files managed through CompanyFile entity with custom aliases and validity dates.

---

## Required Permissions Summary

| Operation                         | Permission                  |
| --------------------------------- | --------------------------- |
| Create Company                    | `master-data:company:create` |
| Read Company (Get by ID)          | `master-data:company:read`   |
| List Companies (Pagination)       | `master-data:company:list`   |
| Update Company                    | `master-data:company:update` |
| Delete Company                    | `master-data:company:delete` |
| Upload/Update/Delete Company File | `master-data:company:update` |
| Get Presigned URLs                | `master-data:company:read`   |

---

## Authentication

### Bearer Token Format

```
Authorization: Bearer {jwt_token}
```

---

## Data Type Reference

| Type          | Format     | Example                              |
| ------------- | ---------- | ------------------------------------ |
| Long          | Integer    | 123456                               |
| String        | Text       | "PT Company Indonesia"               |
| File          | Binary     | Multipart file upload                |
| Boolean       | true/false | true                                 |
| LocalDate     | ISO 8601   | "2026-02-26"                         |
| LocalDateTime | ISO 8601   | "2026-02-26T14:15:00"                |
| File Path     | String     | "company/1/1709032800000-logo.png"   |
| Presigned URL | String     | "http://object-418.kai.id/.../file?" |

---

## Status Codes

| Code | Description                                     |
| ---- | ----------------------------------------------- |
| 200  | OK - Request successful                         |
| 201  | Created - Resource created successfully         |
| 400  | Bad Request - Validation errors or empty file   |
| 401  | Unauthorized - Missing/invalid authentication   |
| 403  | Forbidden - Insufficient permissions            |
| 404  | Not Found - Resource does not exist             |
| 500  | Internal Server Error - Unexpected server error |

---

## Special Features

### File Upload Atomic Transactions

When creating or updating a company with file uploads:

- All file uploads happen within a single transaction
- If any operation fails (file upload or database save), all uploaded files are automatically deleted from storage
- This prevents orphaned files in object storage

### Presigned URLs

- Time-limited (typically 7 days expiry)
- Client downloads directly from MinIO without exposing storage credentials
- Useful for secure file distribution and sharing

### File Aliases

When uploading multiple files during company creation, use `fileAliases` parameter to map files to specific aliases:

- `0=LOGO` - First file becomes company logo
- `1=HEADER_DOC` - Second file becomes header document
- `2=FOOTER_DOC` - Third file becomes footer document
- `3=CUSTOM_TYPE` - Additional files become arbitrary CompanyFile records

Any unmapped files use default naming: `FILE_0`, `FILE_1`, etc.

---

## Notes

1. **File Storage**: All files are stored in MinIO object storage at `http://object-418.kai.id` in bucket `finalink-dev`
2. **File Paths**: Fixed files stored as `company/{companyId}/{timestamp}-{filename}` with timestamp preventing filename collisions
3. **Audit Fields**: All resources include `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` for audit purposes
4. **Pagination**: Default page size is 10, maximum depends on application configuration
5. **CORS**: API allows requests from configured origins
6. **Error Handling**: All errors include detailed messages and field-level validation errors
7. **File Rollback**: Failed uploads automatically clean up any successfully uploaded files

---

## Example Workflows

### Workflow 1: Create Company with Logo

```bash
# Create company with logo upload
curl -X POST http://localhost:8080/api/master/company \
  -H "Authorization: Bearer {jwt_token}" \
  -F "code=COMP001" \
  -F "name=PT Company Indonesia" \
  -F "address=Jakarta" \
  -F "isActive=true" \
  -F "files=@logo.png" \
  -F "fileAliases=0=LOGO"

# Get presigned URL for logo
curl -X GET http://localhost:8080/api/master/company/1/logo-url \
  -H "Authorization: Bearer {jwt_token}"

# Download using presigned URL (no auth needed)
curl -X GET "{presigned_url}" -o logo.png
```

### Workflow 2: Upload Multiple Files

```bash
# Create company with logo, header, footer, and certificate
curl -X POST http://localhost:8080/api/master/company \
  -H "Authorization: Bearer {jwt_token}" \
  -F "code=COMP001" \
  -F "name=PT Company" \
  -F "isActive=true" \
  -F "files=@logo.png" \
  -F "files=@header.pdf" \
  -F "files=@footer.pdf" \
  -F "files=@certificate.pdf" \
  -F "fileAliases=0=LOGO,1=HEADER_DOC,2=FOOTER_DOC,3=CERTIFICATE"

# Result:
# - logoFile field = path to logo.png
# - headerDocFile field = path to header.pdf
# - footerDocFile field = path to footer.pdf
# - files[] array = contains certificate.pdf CompanyFile record with alias=CERTIFICATE
```

### Workflow 3: Update Company and Replace Logo

```bash
# Update company and replace logo
curl -X PUT http://localhost:8080/api/master/company/1 \
  -H "Authorization: Bearer {jwt_token}" \
  -F "name=PT Company Indonesia Updated" \
  -F "logoFile=@new_logo.png"

# Get new presigned URL
curl -X GET http://localhost:8080/api/master/company/1/logo-url \
  -H "Authorization: Bearer {jwt_token}"
```

---

## Troubleshooting

### File Upload Fails

1. **Empty file error**: Ensure the file is not empty
2. **Storage error**: Check MinIO connectivity and bucket permissions
3. **Validation error**: Verify file fields are set correctly in multipart form

### Presigned URL Generation Fails

1. **File not found**: Verify the file exists in the database and MinIO
2. **Storage error**: Check MinIO connectivity
3. **Authorization**: Verify JWT token and user permissions

### File Rollback

If file upload fails during company creation:

- All successfully uploaded files are automatically removed from MinIO
- Database transaction is rolled back
- No orphaned files remain in storage
