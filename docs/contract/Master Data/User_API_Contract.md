# User Management API Contract

## Overview

The User Management API provides endpoints for managing internal and external users. The API uses JWT authentication and permission-based access control.

---

## Base Information

- **Base URL**:
  - Internal Users: `/api/users/internal`
  - External Users: `/api/users/external`
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
  "message": "Users retrieved successfully",
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

## Internal Users

### 1. Create Internal User

Creates a new internal user by validating NIPP against ESA system and assigning roles.

**Endpoint**: `POST /internal`  
**Permission**: `setting:user:create`  
**Authentication**: Required (Bearer Token)

#### Request

```json
{
  "nipp": "123456",
  "roles": [1, 2, 3]
}
```

#### Request Validations

- `nipp`: Required, non-blank, must exist in ESA system
- `roles`: Required, non-empty list of role IDs

#### Notes

- NIPP is validated against the ESA system before user creation
- User data (name, email, organizational hierarchy, etc.) is automatically enriched from ESA
- If NIPP is not found in ESA, the request will fail with 404 Not Found

#### Response (201 Created)

```json
{
  "message": "Internal user created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "nipp": "123456",
    "name": "John Doe",
    "email": "john.doe@company.com",
    "phoneNumber": "+62812345678",
    "companyCode": "COMP001",
    "companyName": "PT Company Name",
    "directorateCode": "DIR001",
    "directorateName": "Finance Directorate",
    "directorateNomenclature": "Keuangan",
    "personalAreaCode": "AREA001",
    "personalAreaName": "Personal Finance",
    "organizationCode": "ORG001",
    "organizationName": "Finance Organization",
    "organizationNomenclature": "Org Nomenclature",
    "jobCode": "JOB001",
    "jobName": "Senior Analyst",
    "jobFamilyCode": "JOBFAM001",
    "jobFamilyName": "Analyst Family",
    "subJobFamilyCode": "SUBJOBFAM001",
    "subJobFamilyName": "Senior Analyst Family",
    "grade": "GRADE5",
    "workerGroupCode": "WG001",
    "workerGroupName": "Worker Group Name",
    "subWorkerGroupCode": "SWG001",
    "subWorkerGroupName": "Sub Worker Group Name",
    "tempSupervisorNipp": "654320",
    "tempSupervisorName": "Temp Supervisor",
    "positionCode": "POS001",
    "positionName": "Finance Analyst",
    "positionNomenclature": "Analis Keuangan",
    "costCenterCode": "CC001",
    "costCenterName": "Cost Center Finance",
    "corsaCode": "CORSA001",
    "corsaName": "CORSA Unit",
    "corsaNomenclature": "CORSA Nomenclature",
    "businessAreaCode": "BA001",
    "businessAreaName": "Financial Operations",
    "supervisorLevelOneNipp": "654321",
    "supervisorLevelOneName": "Jane Smith",
    "supervisorLevelOnePosition": "Manager",
    "supervisorLevelOnePositionName": "Manager Position",
    "supervisorLevelOneDetail": null,
    "supervisorLevelTwoNipp": "987654",
    "supervisorLevelTwoName": "Bob Johnson",
    "supervisorLevelTwoPosition": "Director",
    "supervisorLevelTwoPositionName": "Director Position",
    "supervisorLevelTwoDetail": null,
    "photo": "base64_encoded_image_or_url",
    "rkipInputPeriodUntil": "2026-12-31",
    "employmentStartDate": "2020-01-15",
    "mutationDate": "2025-06-01",
    "genderCode": "M",
    "genderName": "Male",
    "beginningDate": "2020-01-15",
    "endingDate": null,
    "recordingDate": "2026-01-27T10:30:00",
    "stat2": "ACTIVE",
    "psCode": "PS001",
    "psText": "Permanent Staff",
    "psGroup": "PS_GROUP_1",
    "roles": [
      {
        "id": 1,
        "name": "ADMIN",
        "description": "Administrator role"
      }
    ],
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
- **409 Conflict**: Duplicate NIPP or email
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 2. Get Internal User by ID

Retrieves a specific internal user by their ID.

**Endpoint**: `GET /internal/{id}`  
**Permission**: `setting:user:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): User ID (required)

#### Response (200 OK)

```json
{
  "message": "User retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "nipp": "123456",
    "name": "John Doe",
    "email": "john.doe@company.com",
    "phoneNumber": "+62812345678",
    "companyCode": "COMP001",
    "companyName": "PT Company Name",
    "directorateCode": "DIR001",
    "directorateName": "Finance Directorate",
    "directorateNomenclature": "Keuangan",
    "personalAreaCode": "AREA001",
    "personalAreaName": "Personal Finance",
    "organizationCode": "ORG001",
    "organizationName": "Finance Organization",
    "organizationNomenclature": "Org Nomenclature",
    "jobCode": "JOB001",
    "jobName": "Senior Analyst",
    "jobFamilyCode": "JOBFAM001",
    "jobFamilyName": "Analyst Family",
    "subJobFamilyCode": "SUBJOBFAM001",
    "subJobFamilyName": "Senior Analyst Family",
    "grade": "GRADE5",
    "workerGroupCode": "WG001",
    "workerGroupName": "Worker Group Name",
    "subWorkerGroupCode": "SWG001",
    "subWorkerGroupName": "Sub Worker Group Name",
    "tempSupervisorNipp": "654320",
    "tempSupervisorName": "Temp Supervisor",
    "positionCode": "POS001",
    "positionName": "Finance Analyst",
    "positionNomenclature": "Analis Keuangan",
    "costCenterCode": "CC001",
    "costCenterName": "Cost Center Finance",
    "corsaCode": "CORSA001",
    "corsaName": "CORSA Unit",
    "corsaNomenclature": "CORSA Nomenclature",
    "businessAreaCode": "BA001",
    "businessAreaName": "Financial Operations",
    "supervisorLevelOneNipp": "654321",
    "supervisorLevelOneName": "Jane Smith",
    "supervisorLevelOnePosition": "Manager",
    "supervisorLevelOnePositionName": "Manager Position",
    "supervisorLevelOneDetail": null,
    "supervisorLevelTwoNipp": "987654",
    "supervisorLevelTwoName": "Bob Johnson",
    "supervisorLevelTwoPosition": "Director",
    "supervisorLevelTwoPositionName": "Director Position",
    "supervisorLevelTwoDetail": null,
    "photo": "base64_encoded_image_or_url",
    "rkipInputPeriodUntil": "2026-12-31",
    "employmentStartDate": "2020-01-15",
    "mutationDate": "2025-06-01",
    "genderCode": "M",
    "genderName": "Male",
    "beginningDate": "2020-01-15",
    "endingDate": null,
    "recordingDate": "2026-01-27T10:30:00",
    "stat2": "ACTIVE",
    "psCode": "PS001",
    "psText": "Permanent Staff",
    "psGroup": "PS_GROUP_1",
    "roles": [
      {
        "id": 1,
        "name": "ADMIN",
        "description": "Administrator role"
      }
    ],
    "createdAt": "2026-01-27T10:30:00",
    "updatedAt": "2026-01-27T10:30:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: User does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 3. Get Internal User by NIPP (ESA)

Retrieves internal user information by NIPP from the ESA system.

**Endpoint**: `GET /internal/esa/{nipp}`  
**Permission**: `setting:user:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `nipp` (String): User NIPP (required)

#### Response (200 OK)

Same structure as Get by ID endpoint.

#### Error Responses

- **404 Not Found**: User not found in ESA system or in database
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 4. List All Internal Users

Retrieves a paginated list of internal users with optional sorting and search.

**Endpoint**: `GET /internal`  
**Permission**: `setting:user:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sortKey` (string, default: "id"): Field to sort by (e.g., "id", "name", "email")
- `sortDirection` (string, default: "desc"): Sort direction - "asc" for ascending or "desc" for descending
- `search` (string, optional): Search keyword to filter by name, NIPP, or email
- `role` (Long, optional): Role ID to filter users by assigned role

#### Response (200 OK)

```json
{
  "message": "Users retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "nipp": "123456",
        "name": "John Doe",
        "email": "john.doe@company.com",
        "phoneNumber": "+62812345678",
        "companyCode": "COMP001",
        "companyName": "PT Company Name",
        "directorateCode": "DIR001",
        "directorateName": "Finance Directorate",
        "directorateNomenclature": "Keuangan",
        "personalAreaCode": "AREA001",
        "personalAreaName": "Personal Finance",
        "organizationCode": "ORG001",
        "organizationName": "Finance Organization",
        "organizationNomenclature": "Org Nomenclature",
        "jobCode": "JOB001",
        "jobName": "Senior Analyst",
        "jobFamilyCode": "JOBFAM001",
        "jobFamilyName": "Analyst Family",
        "subJobFamilyCode": "SUBJOBFAM001",
        "subJobFamilyName": "Senior Analyst Family",
        "grade": "GRADE5",
        "workerGroupCode": "WG001",
        "workerGroupName": "Worker Group Name",
        "subWorkerGroupCode": "SWG001",
        "subWorkerGroupName": "Sub Worker Group Name",
        "tempSupervisorNipp": "654320",
        "tempSupervisorName": "Temp Supervisor",
        "positionCode": "POS001",
        "positionName": "Finance Analyst",
        "positionNomenclature": "Analis Keuangan",
        "costCenterCode": "CC001",
        "costCenterName": "Cost Center Finance",
        "corsaCode": "CORSA001",
        "corsaName": "CORSA Unit",
        "corsaNomenclature": "CORSA Nomenclature",
        "businessAreaCode": "BA001",
        "businessAreaName": "Financial Operations",
        "supervisorLevelOneNipp": "654321",
        "supervisorLevelOneName": "Jane Smith",
        "supervisorLevelOnePosition": "Manager",
        "supervisorLevelOnePositionName": "Manager Position",
        "supervisorLevelOneDetail": null,
        "supervisorLevelTwoNipp": "987654",
        "supervisorLevelTwoName": "Bob Johnson",
        "supervisorLevelTwoPosition": "Director",
        "supervisorLevelTwoPositionName": "Director Position",
        "supervisorLevelTwoDetail": null,
        "photo": "base64_encoded_image_or_url",
        "rkipInputPeriodUntil": "2026-12-31",
        "employmentStartDate": "2020-01-15",
        "mutationDate": "2025-06-01",
        "genderCode": "M",
        "genderName": "Male",
        "beginningDate": "2020-01-15",
        "endingDate": null,
        "recordingDate": "2026-01-27T10:30:00",
        "stat2": "ACTIVE",
        "psCode": "PS001",
        "psText": "Permanent Staff",
        "psGroup": "PS_GROUP_1",
        "roles": [
          {
            "id": 1,
            "name": "ADMIN",
            "description": "Administrator role"
          }
        ],
        "createdAt": "2026-01-27T10:30:00",
        "updatedAt": "2026-01-27T10:30:00",
        "createdBy": "admin",
        "updatedBy": "admin"
      }
    ],
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

#### Error Responses

- **400 Bad Request**: Invalid pagination parameters
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 5. Update Internal User

Updates an existing internal user's role assignments.

**Endpoint**: `PUT /internal/{id}`  
**Permission**: `setting:user:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): User ID (required)

#### Request

```json
{
  "roles": [1, 2, 3]
}
```

#### Request Validations

- `roles`: Required, non-empty list of role IDs

#### Notes

- Only user roles can be updated through this endpoint
- Other user information (name, email, organizational data) is read-only and comes from ESA
- To reflect changes in ESA data, the user must be deleted and recreated with the updated NIPP

#### Response (200 OK)

Same structure as Get by ID endpoint.

#### Error Responses

- **400 Bad Request**: Validation errors
- **404 Not Found**: User does not exist
- **409 Conflict**: Duplicate NIPP or email
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 6. Delete Internal User

Deletes an internal user by ID.

**Endpoint**: `DELETE /internal/{id}`  
**Permission**: `setting:user:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): User ID (required)

#### Response (200 OK)

```json
{
  "message": "Internal user deleted successfully",
  "status": "SUCCESS",
  "data": "User deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: User does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 7. Update Internal User's RKIP Date Limit

Updates an internal user's RKIP (Rencana Kerja dan Indikator Pelaksanaan) input period limit date.

**Endpoint**: `POST /internal/{id}/rkip-date-limit`  
**Permission**: `setting:user:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): User ID (required)

#### Request

```json
{
  "dateLimit": "2026-12-31"
}
```

#### Request Validations

- `dateLimit`: Required, must be a valid date in ISO 8601 format (YYYY-MM-DD)

#### Response (200 OK)

Returns the updated InternalUserResponseDTO with the new `rkipInputPeriodUntil` field set.

```json
{
  "message": "RKIP date limit updated successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "nipp": "123456",
    "name": "John Doe",
    "email": "john.doe@company.com",
    "rkipInputPeriodUntil": "2026-12-31",
    ...
  },
  "errors": null
}
```

#### Error Responses

- **400 Bad Request**: Validation errors (invalid date format or null dateLimit)
- **404 Not Found**: User does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 8. Delete Internal User's RKIP Date Limit

Clears/deletes an internal user's RKIP input period limit date.

**Endpoint**: `DELETE /internal/{id}/rkip-date-limit`  
**Permission**: `setting:user:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): User ID (required)

#### Request

No request body required.

#### Response (200 OK)

Returns the updated InternalUserResponseDTO with the `rkipInputPeriodUntil` field set to null.

```json
{
  "message": "RKIP date limit deleted successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "nipp": "123456",
    "name": "John Doe",
    "email": "john.doe@company.com",
    "rkipInputPeriodUntil": null,
    ...
  },
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: User does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## External Users

### 1. Create External User

Creates a new external user from a partner institution or individual.

**Endpoint**: `POST /external`  
**Permission**: `setting:user:create`  
**Authentication**: Required (Bearer Token)

#### Request

```json
{
  "userType": "COMPANY",
  "name": "Jane Smith",
  "email": "jane.smith@partner.com",
  "username": "jane_smith",
  "password": "SecurePass456!",
  "roles": [1, 2],
  "phoneNumber": "+62812345679",
  "photo": "base64_encoded_image_or_url",
  "nik": "1234567890123456",
  "npwp": "12.345.678.9-012.345",
  "ktpFile": "file_path_or_url",
  "npwpFile": "file_path_or_url",
  "address": "Jalan Contoh No. 123, Jakarta",
  "companyCode": "COMP_CODE_123",
  "responsibleName": "John Responsible",
  "responsibleEmail": "john@partner.com",
  "responsibleNik": "9876543210987654",
  "responsibleAddress": "Jalan Responsible No. 456, Jakarta",
  "purpose": "Financial transaction and reporting",
  "startDate": "2026-01-27",
  "endDate": "2027-01-27",
  "twoFactorEnabled": true
}
```

#### Request Validations

- `userType`: Required, must be one of: `PERSONAL`, `COMPANY`, `OTHER`
- `name`: Required, 2-255 characters
- `email`: Required, valid email format, must be unique
- `username`: Required, 4-100 characters, must be unique
- `password`: Required, minimum 8 characters
- `roles`: Required, non-empty list of role IDs
- `nik`: Optional, maximum 50 characters, must be unique if provided
- `npwp`: Optional, maximum 50 characters, must be unique if provided
- `phoneNumber`: Optional
- `photo`: Optional
- `ktpFile`: Optional
- `npwpFile`: Optional
- `address`: Optional
- `companyCode`: Optional
- `responsibleName`: Optional
- `responsibleEmail`: Optional, valid email format if provided
- `responsibleNik`: Optional
- `responsibleAddress`: Optional
- `purpose`: Optional
- `startDate`: Optional, ISO 8601 format (YYYY-MM-DD)
- `endDate`: Optional, ISO 8601 format (YYYY-MM-DD)
- `twoFactorEnabled`: Optional, boolean (default: false)

#### Response (201 Created)

```json
{
  "message": "External user created successfully",
  "status": "SUCCESS",
  "data": {
    "id": 2,
    "userType": "COMPANY",
    "name": "Jane Smith",
    "email": "jane.smith@partner.com",
    "username": "jane_smith",
    "phoneNumber": "+62812345679",
    "photo": "base64_encoded_image_or_url",
    "nik": "1234567890123456",
    "npwp": "12.345.678.9-012.345",
    "ktpFile": "file_path_or_url",
    "npwpFile": "file_path_or_url",
    "address": "Jalan Contoh No. 123, Jakarta",
    "companyCode": "COMP_CODE_123",
    "responsibleName": "John Responsible",
    "responsibleEmail": "john@partner.com",
    "responsibleNik": "9876543210987654",
    "responsibleAddress": "Jalan Responsible No. 456, Jakarta",
    "purpose": "Financial transaction and reporting",
    "startDate": "2026-01-27",
    "endDate": "2027-01-27",
    "twoFactorEnabled": true,
    "roles": [
      {
        "id": 1,
        "name": "EXTERNAL_USER",
        "description": "External user role"
      }
    ],
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
- **409 Conflict**: Duplicate email or username
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 2. Get External User by ID

Retrieves a specific external user by their ID.

**Endpoint**: `GET /external/{id}`  
**Permission**: `setting:user:read`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): User ID (required)

#### Response (200 OK)

```json
{
  "message": "User retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "id": 2,
    "userType": "COMPANY",
    "name": "Jane Smith",
    "email": "jane.smith@partner.com",
    "username": "jane_smith",
    "phoneNumber": "+62812345679",
    "photo": "base64_encoded_image_or_url",
    "nik": "1234567890123456",
    "npwp": "12.345.678.9-012.345",
    "ktpFile": "file_path_or_url",
    "npwpFile": "file_path_or_url",
    "address": "Jalan Contoh No. 123, Jakarta",
    "companyCode": "COMP_CODE_123",
    "responsibleName": "John Responsible",
    "responsibleEmail": "john@partner.com",
    "responsibleNik": "9876543210987654",
    "responsibleAddress": "Jalan Responsible No. 456, Jakarta",
    "purpose": "Financial transaction and reporting",
    "startDate": "2026-01-27",
    "endDate": "2027-01-27",
    "twoFactorEnabled": true,
    "roles": [
      {
        "id": 1,
        "name": "EXTERNAL_USER",
        "description": "External user role"
      }
    ],
    "createdAt": "2026-01-27T10:30:00",
    "updatedAt": "2026-01-27T10:30:00",
    "createdBy": "admin",
    "updatedBy": "admin"
  },
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: User does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 3. List All External Users

Retrieves a paginated list of external users with optional sorting and search.

**Endpoint**: `GET /external`  
**Permission**: `setting:user:list`  
**Authentication**: Required (Bearer Token)

#### Query Parameters

- `page` (int, default: 0): Page number (0-indexed)
- `size` (int, default: 10): Items per page
- `sortKey` (string, default: "id"): Field to sort by (e.g., "id", "name", "email")
- `sortDirection` (string, default: "desc"): Sort direction - "asc" for ascending or "desc" for descending
- `search` (string, optional): Search keyword to filter by name, username, or email
- `role` (Long, optional): Role ID to filter users by assigned role

#### Response (200 OK)

```json
{
  "message": "Users retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 2,
        "userType": "COMPANY",
        "name": "Jane Smith",
        "email": "jane.smith@partner.com",
        "username": "jane_smith",
        "phoneNumber": "+62812345679",
        "photo": "base64_encoded_image_or_url",
        "nik": "1234567890123456",
        "npwp": "12.345.678.9-012.345",
        "ktpFile": "file_path_or_url",
        "npwpFile": "file_path_or_url",
        "address": "Jalan Contoh No. 123, Jakarta",
        "companyCode": "COMP_CODE_123",
        "responsibleName": "John Responsible",
        "responsibleEmail": "john@partner.com",
        "responsibleNik": "9876543210987654",
        "responsibleAddress": "Jalan Responsible No. 456, Jakarta",
        "purpose": "Financial transaction and reporting",
        "startDate": "2026-01-27",
        "endDate": "2027-01-27",
        "twoFactorEnabled": true,
        "roles": [
          {
            "id": 1,
            "name": "EXTERNAL_USER",
            "description": "External user role"
          }
        ],
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

### 4. Update External User

Updates an existing external user's information and role assignments.

**Endpoint**: `PUT /external/{id}`  
**Permission**: `setting:user:update`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): User ID (required)

#### Request

```json
{
  "userType": "COMPANY",
  "name": "Jane Smith",
  "email": "jane.smith@partner.com",
  "username": "jane_smith",
  "password": "NewSecurePass789!",
  "roles": [1, 2],
  "phoneNumber": "+62812345679",
  "photo": "base64_encoded_image_or_url",
  "nik": "1234567890123456",
  "npwp": "12.345.678.9-012.345",
  "ktpFile": "file_path_or_url",
  "npwpFile": "file_path_or_url",
  "address": "Jalan Contoh No. 123, Jakarta",
  "companyCode": "COMP_CODE_123",
  "responsibleName": "John Responsible",
  "responsibleEmail": "john@partner.com",
  "responsibleNik": "9876543210987654",
  "responsibleAddress": "Jalan Responsible No. 456, Jakarta",
  "purpose": "Financial transaction and reporting",
  "startDate": "2026-01-27",
  "endDate": "2027-01-27"
}
```

#### Request Validations (Same as Create)

- All fields are optional for updates
- `email` and `username` must remain unique if changed
- `nik` and `npwp` must remain unique if changed
- `roles`: Required, non-empty list of role IDs
- Validation rules same as Create External User

#### Response (200 OK)

Same structure as Get by ID endpoint.

#### Error Responses

- **400 Bad Request**: Validation errors
- **404 Not Found**: User does not exist
- **409 Conflict**: Duplicate email or username
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

### 5. Delete External User

Deletes an external user by ID.

**Endpoint**: `DELETE /external/{id}`  
**Permission**: `setting:user:delete`  
**Authentication**: Required (Bearer Token)

#### URL Parameters

- `id` (Long): User ID (required)

#### Response (200 OK)

```json
{
  "message": "External user deleted successfully",
  "status": "SUCCESS",
  "data": "User deleted successfully",
  "errors": null
}
```

#### Error Responses

- **404 Not Found**: User does not exist
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions

---

## Required Permissions Summary

| Operation                       | Permission            |
| ------------------------------- | --------------------- |
| Create User (Internal/External) | `setting:user:create` |
| Read User (Get by ID)           | `setting:user:read`   |
| List Users (Pagination)         | `setting:user:list`   |
| Update User                     | `setting:user:update` |
| Update User RKIP Date Limit     | `setting:user:update` |
| Delete User RKIP Date Limit     | `setting:user:update` |
| Delete User                     | `setting:user:delete` |

---

## Authentication

### Bearer Token Format

```
Authorization: Bearer {jwt_token}
```

---

## Data Type Reference

| Type          | Format      | Example                        |
| ------------- | ----------- | ------------------------------ |
| Long          | Integer     | 123456                         |
| String        | Text        | "John Doe"                     |
| Email         | Valid email | "user@domain.com"              |
| NIPP          | String      | "123456"                       |
| LocalDate     | ISO 8601    | "2026-01-27"                   |
| LocalDateTime | ISO 8601    | "2026-01-27T10:30:00"          |
| Boolean       | true/false  | true                           |
| UserType      | String enum | "PERSONAL", "COMPANY", "OTHER" |

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

## Implementation Notes

### Internal Users (ESA Integration)

- Internal user data is **read-only** and sourced from the ESA (Employee System Application)
- Creating an internal user requires only a valid NIPP (validated against ESA) and role assignments
- User details like name, email, organizational hierarchy are automatically enriched from ESA at creation time
- Updating an internal user only allows changing role assignments; other data is managed by ESA
- If organizational or personal details need updating, users should update in ESA first, then delete and recreate
- RKIP (Rencana Kerja dan Indikator Pelaksanaan) date limit can be managed separately via dedicated endpoints:
  - `POST /internal/{id}/rkip-date-limit` - Set or update RKIP input period limit date
  - `DELETE /internal/{id}/rkip-date-limit` - Clear RKIP input period limit date

### External Users (Partner/Third-party)

- External users support three types: `PERSONAL` (individual), `COMPANY` (organization), `OTHER`
- Support for two-factor authentication via `twoFactorEnabled` flag (OTP secret stored but not returned in responses)
- Extensive tracking fields for partner information including responsible person details
- Date range support for access validity (`startDate` and `endDate`)
- All password-related and sensitive fields (password, otpSecret) are never returned in responses

### Security & Audit

- All user records include audit trail: `createdAt`, `updatedAt`, `createdBy`, `updatedBy`
- Passwords are bcrypt-encoded and never returned in any response
- OTP secrets for two-factor authentication are not returned in responses
- Unique constraints enforced on: NIPP and email (internal users), email and username (external users), NIK and NPWP (external users, if provided)

### Role Assignment

- Both internal and external users support role assignment at creation and update
- Roles are passed as a list of role IDs in the request
- Role responses include full role details (id, name, description)
