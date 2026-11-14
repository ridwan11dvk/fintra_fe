# Access Request API Contract

**Version**: 2.0  
**Last Updated**: April 2026  
**Base URL**: `/api`  
**Status**: Current Implementation (Denormalized Data Structure)

---

## Overview

The Access Request API provides endpoints for users to request module access and for administrators to manage those requests. All responses follow the standard ApiResponse wrapper format.

The API uses a simplified denormalized data model where:

- Module names are stored as comma-separated strings (not array of objects)
- Request/approval process is streamlined with single endpoint for status changes
- Roles are assigned directly without detailed module-role association

### Standard Response Format

```json
{
  "success": true,
  "data": {
    // endpoint-specific data
  },
  "message": "string",
  "timestamp": "ISO-8601 timestamp"
}
```

### Error Response Format

```json
{
  "success": false,
  "data": null,
  "message": "Error description",
  "timestamp": "ISO-8601 timestamp"
}
```

---

## Authentication & Authorization

- **No Authentication Required**: POST `/api/access-request` (public endpoint for submission)
- **Authentication Required**: All other endpoints
- **Authorization**:
  - GET `/api/access-request` requires `app:access-request:approve` permission
  - GET `/api/access-request/{requestId}` requires `app:access-request:approve` permission
  - PUT `/api/access-request/{requestId}` requires `app:access-request:approve` permission

---

## Endpoints

### 1. Submit Access Request

**POST** `/access-request`

Submit a new access request for module access.

**Authentication**: Not required  
**Authorization**: Any internal user

#### Request Body

```json
{
  "moduleNames": "Finance Module, Treasury Module",
  "requestNotes": "I need access to reconcile monthly financial reports"
}
```

| Field        | Type   | Required | Description                                    |
| ------------ | ------ | -------- | ---------------------------------------------- |
| moduleNames  | String | Yes      | Comma-separated list of module names requested |
| requestNotes | String | No       | User's reason or notes for the request         |

#### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 101,
    "userName": "John Doe",
    "status": "PENDING",
    "moduleNames": "Finance Module, Treasury Module",
    "description": "I need access to reconcile monthly financial reports",
    "requestedAt": "2026-04-27T10:30:00Z",
    "approvedAt": null,
    "rejectionReason": null,
    "approvedBy": null
  },
  "message": "Access request submitted successfully",
  "timestamp": "2026-04-27T10:30:00Z"
}
```

#### Error Cases

| Status | Code             | Message                            |
| ------ | ---------------- | ---------------------------------- |
| 400    | BAD_REQUEST      | Module names cannot be empty       |
| 400    | BAD_REQUEST      | User already has a pending request |
| 400    | VALIDATION_ERROR | Invalid request format             |

#### Example cURL

```bash
curl -X POST http://localhost:8080/api/access-request \
  -H "Content-Type: application/json" \
  -d '{
    "moduleNames": "Finance Module, Treasury Module",
    "requestNotes": "I need access to reconcile monthly financial reports"
  }'
```

---

### 2. Get Pending Access Requests (Admin)

**GET** `/access-request?page=0&size=20&search=john&status=PENDING`

Retrieve pending access requests for admin dashboard. Supports pagination and filtering.

**Authentication**: Required  
**Authorization**: `app:access-request:approve` permission required

#### Query Parameters

| Parameter | Type   | Required | Default | Description                                  |
| --------- | ------ | -------- | ------- | -------------------------------------------- |
| page      | Int    | No       | 0       | Page number (0-indexed)                      |
| size      | Int    | No       | 20      | Page size (max 100)                          |
| search    | String | No       | -       | Search by user name or email                 |
| status    | String | No       | -       | Filter by status (PENDING/APPROVED/REJECTED) |

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "userId": 101,
        "userName": "John Doe",
        "status": "PENDING",
        "moduleNames": "Finance Module, Treasury Module",
        "description": "I need access to reconcile monthly financial reports",
        "requestedAt": "2026-04-27T10:30:00Z",
        "approvedAt": null,
        "rejectionReason": null,
        "approvedBy": null
      },
      {
        "id": 2,
        "userId": 102,
        "userName": "Jane Smith",
        "status": "PENDING",
        "moduleNames": "Tax Module",
        "description": "Needed for Q1 tax filings",
        "requestedAt": "2026-04-27T10:35:00Z",
        "approvedAt": null,
        "rejectionReason": null,
        "approvedBy": null
      }
    ],
    "pageNumber": 0,
    "pageSize": 20,
    "totalElements": 2,
    "totalPages": 1
  },
  "message": "Pending access requests retrieved successfully",
  "timestamp": "2026-04-27T10:40:00Z"
}
```

#### Error Cases

| Status | Code         | Message                  |
| ------ | ------------ | ------------------------ |
| 401    | UNAUTHORIZED | Authentication required  |
| 403    | FORBIDDEN    | Insufficient permissions |
| 400    | BAD_REQUEST  | Invalid page or size     |

#### Example cURL

```bash
curl -X GET "http://localhost:8080/api/access-request?page=0&size=20&search=john&status=PENDING" \
  -H "Authorization: Bearer <token>"
```

---

### 3. Get Access Request Details

**GET** `/access-request/{requestId}`

Retrieve full details of a single access request.

**Authentication**: Required  
**Authorization**: Admin with `app:access-request:approve` permission

#### Path Parameters

| Parameter | Type | Required | Description           |
| --------- | ---- | -------- | --------------------- |
| requestId | Long | Yes      | The access request ID |

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 101,
    "userName": "John Doe",
    "status": "PENDING",
    "moduleNames": "Finance Module, Treasury Module",
    "description": "I need access to reconcile monthly financial reports",
    "requestedAt": "2026-04-27T10:30:00Z",
    "approvedAt": null,
    "rejectionReason": null,
    "approvedBy": null
  },
  "message": "Access request details retrieved successfully",
  "timestamp": "2026-04-27T10:40:00Z"
}
```

#### Error Cases

| Status | Code         | Message                       |
| ------ | ------------ | ----------------------------- |
| 401    | UNAUTHORIZED | Authentication required       |
| 403    | FORBIDDEN    | Access denied to this request |
| 404    | NOT_FOUND    | Access request not found      |

#### Example cURL

```bash
curl -X GET "http://localhost:8080/api/access-request/1" \
  -H "Authorization: Bearer <token>"
```

---

### 4. Change Access Request Status (Approve or Reject)

**PUT** `/access-request/{requestId}`

Change the status of an access request (approve or reject). A single unified endpoint for both operations.

**Authentication**: Required  
**Authorization**: `app:access-request:approve` permission required

#### Path Parameters

| Parameter | Type | Required | Description           |
| --------- | ---- | -------- | --------------------- |
| requestId | Long | Yes      | The access request ID |

#### Request Body

**For Approval:**

```json
{
  "status": "APPROVED",
  "roles": [101, 201],
  "responseNotes": "Approved - assigned Finance Analyst and Treasury Clerk roles"
}
```

**For Rejection:**

```json
{
  "status": "REJECTED",
  "roles": [],
  "responseNotes": "User does not meet requirements for module access"
}
```

| Field         | Type   | Required    | Description                                      |
| ------------- | ------ | ----------- | ------------------------------------------------ |
| status        | String | Yes         | New status: "APPROVED" or "REJECTED"             |
| roles         | Long[] | Conditional | Role IDs to assign (required if status=APPROVED) |
| responseNotes | String | No          | Admin's notes/reason for approval or rejection   |

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 101,
    "userName": "John Doe",
    "status": "APPROVED",
    "moduleNames": "Finance Module, Treasury Module",
    "description": "I need access to reconcile monthly financial reports",
    "requestedAt": "2026-04-27T10:30:00Z",
    "approvedAt": "2026-04-27T14:15:00Z",
    "rejectionReason": null,
    "approvedBy": "Admin User"
  },
  "message": "Change access request status successfully",
  "timestamp": "2026-04-27T14:15:00Z"
}
```

#### Error Cases

| Status | Code             | Message                             |
| ------ | ---------------- | ----------------------------------- |
| 401    | UNAUTHORIZED     | Authentication required             |
| 403    | FORBIDDEN        | Insufficient permissions            |
| 404    | NOT_FOUND        | Access request not found            |
| 400    | BAD_REQUEST      | Request is not in PENDING status    |
| 400    | VALIDATION_ERROR | Status must be APPROVED or REJECTED |
| 400    | VALIDATION_ERROR | Roles required for APPROVED status  |

#### Example cURL

**Approval:**

```bash
curl -X PUT "http://localhost:8080/api/access-request/1" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "APPROVED",
    "roles": [101, 201],
    "responseNotes": "Approved - assigned Finance Analyst and Treasury Clerk roles"
  }'
```

**Rejection:**

```bash
curl -X PUT "http://localhost:8080/api/access-request/1" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "REJECTED",
    "roles": [],
    "responseNotes": "User does not meet requirements for module access"
  }'
```

---

## Common HTTP Status Codes

| Status | Meaning               | Use Case                          |
| ------ | --------------------- | --------------------------------- |
| 200    | OK                    | Successful GET, PUT, DELETE       |
| 201    | Created               | Successful POST (new resource)    |
| 400    | Bad Request           | Invalid input, validation error   |
| 401    | Unauthorized          | Missing or invalid authentication |
| 403    | Forbidden             | Valid auth but insufficient perms |
| 404    | Not Found             | Resource does not exist           |
| 500    | Internal Server Error | Unexpected server error           |

---

## Request/Response Headers

### Required Headers

```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>  (except for public endpoints)
```

### Response Headers

```
Content-Type: application/json
Cache-Control: no-cache, no-store, must-revalidate
```

---

## Field Descriptions

### AccessRequestResponseDTO

```json
{
  "id": 1, // Request ID (Long)
  "userId": 101, // Requester user ID (Long)
  "userName": "John Doe", // Requester full name (String)
  "userNipp": "12345678", // Requester NIPP/employee ID (String)
  "status": "PENDING|APPROVED|REJECTED", // Current status (String/Enum)
  "moduleNames": ["Module1", "Module2"], // List of requested module names (String[])
  "requestedAt": "2026-04-27T10:30:00Z", // Request submission timestamp (ISO-8601)
  "approvedAt": "2026-04-27T14:15:00Z", // Approval timestamp, null if pending/rejected (ISO-8601)
  "rejectionReason": "Reason...", // Rejection reason, null if approved/pending (String)
  "approvedByName": "Admin Name" // Approver name, null if pending/rejected (String)
}
```

### AccessRequestDetailDTO

Extends AccessRequestResponseDTO with:

```json
{
  "modules": [
    {
      "moduleId": 1, // Module ID (Long)
      "moduleName": "Finance Module", // Module name (String)
      "availableRoles": [
        // Roles available in this module (RoleDTO[])
        {
          "id": 101,
          "name": "Finance Analyst",
          "description": "Description..."
        }
      ],
      "approvedRoleId": 101 // Approved role ID, null if pending (Long)
    }
  ]
}
```

---

## Error Handling

### Standard Error Response

```json
{
  "success": false,
  "data": null,
  "message": "Detailed error description",
  "timestamp": "2026-04-27T14:20:00Z"
}
```

### Common Errors

| Code             | Message                                     |
| ---------------- | ------------------------------------------- |
| VALIDATION_ERROR | Field validation failed: {details}          |
| NOT_FOUND        | Resource not found                          |
| UNAUTHORIZED     | Authentication required                     |
| FORBIDDEN        | Insufficient permissions for this operation |
| CONFLICT         | User already has a pending access request   |
| INTERNAL_ERROR   | An unexpected error occurred                |

---

## API Integration Examples

### Example: Complete Workflow

#### 1. User submits request

```bash
curl -X POST http://localhost:8080/api/access-requests \
  -H "Content-Type: application/json" \
  -d '{"moduleIds": [1, 2]}'
```

Returns: `requestId: 1`

#### 2. Check status on login

```bash
curl http://localhost:8080/api/access-requests/me/status
```

Returns: `{hasPendingRequest: true, requestId: 1}`

#### 3. Admin fetches pending requests

```bash
curl http://localhost:8080/api/access-requests \
  -H "Authorization: Bearer <admin_token>"
```

Returns: List of pending requests

#### 4. Admin views request details

```bash
curl http://localhost:8080/api/access-requests/1 \
  -H "Authorization: Bearer <admin_token>"
```

Returns: Request with modules and available roles

#### 5. Admin approves with roles

```bash
curl -X PUT http://localhost:8080/api/access-requests/1/approve \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"moduleApprovals": [{"moduleId": 1, "roleId": 101}, {"moduleId": 2, "roleId": 201}]}'
```

---

## Rate Limiting

- No explicit rate limiting configured
- Rely on application-level security and authentication

---

## Pagination

Paginated endpoints support:

- `page`: 0-indexed page number (default: 0)
- `size`: Records per page (default: 20, max: 100)
- `sort`: Not implemented for this feature

Response includes:

- `pageNumber`: Current page
- `pageSize`: Records returned
- `totalElements`: Total records in database
- `totalPages`: Total pages available

---

## Version History

| Version | Date     | Changes              |
| ------- | -------- | -------------------- |
| 1.0     | Apr 2026 | Initial API contract |

---

## Related Documentation

- [Access Request Feature PRD](../PRD/Access%20Request%20Feature%20PRD.md)
- [API Response Standards](../API_Standards.md) (reference)
- [Authentication Guide](../Authentication.md) (reference)
