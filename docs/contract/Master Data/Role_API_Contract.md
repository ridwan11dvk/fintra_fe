# Role API Contract ⚙️

## Overview

This document describes the Role Management REST API (paths under `/api/master/role`) based on the current `RoleController` and DTO definitions. It includes endpoints, permissions, request/response schemas, validation rules, and examples.

---

## Authentication & Authorization 🔒

- All endpoints require authentication.
- Method-level authorization uses Spring Security @PreAuthorize expressions.
- Required authorities per endpoint are listed in each endpoint section.

---

## Common Response Wrapper

All endpoints that return structured data use the `ApiResponse<T>` wrapper:

```json
{
  "message": "string",
  "status": "SUCCESS|ERROR|WARNING",
  "data": <T|null>,
  "errors": [ /* optional list of error items */ ]
}
```

Paginated endpoints use `PaginationResponse<T>` inside `ApiResponse`:

```json
{
  "data": {
    "content": [
      /* list of items */
    ],
    "pagination": {
      "total": 123,
      "limit": 20,
      "offset": 0,
      "totalPages": 7,
      "currentPage": 1,
      "from": 1,
      "to": 20
    }
  }
}
```

---

## Endpoints 📚

### 1) Get all roles

- Method: GET
- Path: `/api/master/role`
- Permission: `hasAuthority('setting:role:list')`
- Query parameters:
  - `search` (optional) — string search
  - `moduleId` (optional) — long
  - Spring `page`, `size`, `sort` (optional)
- Response: `ApiResponse<PaginationResponse<RoleResponseDTO>>` (200 OK)

Example response data (excerpt):

```json
{
  "content": [
    {
      "id": 1,
      "name": "ADMIN",
      "description": "Administrator role",
      "moduleId": 10,
      "module": { "id": 10, "name": "User Management" },
      "permissions": [{ "id": 100, "name": "user:create", "resource": "user" }],
      "createdAt": "2025-12-01T10:00:00",
      "updatedAt": "2025-12-02T10:00:00",
      "createdBy": "system",
      "updatedBy": "admin"
    }
  ],
  "pagination": {
    /* see common pagination structure */
  }
}
```

---

### 2) Get role by ID

- Method: GET
- Path: `/api/master/role/{id}`
- Permission: `hasAuthority('setting:role:read')`
- Path param: `id` (Long)
- Response: `ApiResponse<RoleDetailResponseDTO>` (200 OK)

`RoleDetailResponseDTO` includes the role's `module` (ModuleResponseDTO) and `permissions` (list of PermissionResponseDTO).

Example (data field):

```json
{
  "id": 1,
  "name": "ADMIN",
  "description": "Administrator role",
  "module": { "id": 10, "name": "User Management" },
  "permissions": [{ "id": 100, "name": "user:create", "resource": "user" }],
  "createdAt": "2025-12-01T10:00:00",
  "updatedAt": "2025-12-02T10:00:00",
  "createdBy": "system",
  "updatedBy": "admin"
}
```

---

### 3) Get role by name

- Method: GET
- Path: `/api/master/role/name/{name}`
- Permission: `hasAuthority('setting:role:read')`
- Path param: `name` (String)
- Response: `ApiResponse<RoleDetailResponseDTO>` (200 OK)

---

### 4) Create a role

- Method: POST
- Path: `/api/master/role`
- Permission: `hasAuthority('setting:role:create')`
- Request body: `RoleRequestDTO` (JSON)
  - name: string (required, 2-100 chars)
  - moduleId: long (required)
  - description: string (optional, max 500 chars)
- Response: `ApiResponse<RoleResponseDTO>` (201 Created)

Request example:

```json
{
  "name": "MANAGER",
  "moduleId": 10,
  "description": "Manages users and teams"
}
```

---

### 5) Update a role

- Method: PUT
- Path: `/api/master/role/{id}`
- Permission: `hasAuthority('setting:role:update')`
- Path param: `id` (Long)
- Request body: `RoleRequestDTO` (same validations as create)
- Response: `ApiResponse<RoleResponseDTO>` (200 OK)

---

### 6) Delete a role

- Method: DELETE
- Path: `/api/master/role/{id}`
- Permission: `hasAuthority('setting:role:delete')`
- Path param: `id` (Long)
- Response: `ApiResponse<Void>` (200 OK) — message indicates successful deletion

---

### 7) Assign permissions to a role

- Method: POST
- Path: `/api/master/role/{id}/permissions`
- Permission: `hasAuthority('setting:role:update')`
- Path param: `id` (Long)
- Request body: `RolePermissionRequestDTO`:
  - permissionIds: array of Long (required, not empty)
- Response: `ApiResponse<RoleDetailResponseDTO>` (200 OK)

Request example:

```json
{
  "permissionIds": [100, 101, 102]
}
```

---

### 8) Remove permissions from a role

- Method: DELETE
- Path: `/api/master/role/{id}/permissions`
- Permission: `hasAuthority('setting:role:update')`
- Path param: `id` (Long)
- Request body: `RolePermissionRequestDTO` (same as assign)
- Response: `ApiResponse<RoleDetailResponseDTO>` (200 OK)

---

### 9) Get permissions for a role

- Method: GET
- Path: `/api/master/role/{id}/permissions`
- Permission: `hasAuthority('setting:role:read')`
- Path param: `id` (Long)
- Response: `ApiResponse<List<PermissionResponseDTO>>` (200 OK)

`PermissionResponseDTO` fields:

- id: Long
- name: String
- resource: String
- description: String
- createdAt, updatedAt: LocalDateTime
- createdBy, updatedBy: String

---

## DTO Schemas & Validation ✅

RoleRequestDTO

- name: string, required, 2..100 characters
- moduleId: long, required
- description: string, optional, max 500 characters

RoleResponseDTO

- id: long
- name: string
- description: string
- moduleId: long
- module: `ModuleResponseDTO` (object: `id`, `name`) — _optional, may be included to provide module details alongside the id_
- createdAt, updatedAt: ISO timestamp
- createdBy, updatedBy: string

RoleDetailResponseDTO

- id, name, description
- module: ModuleResponseDTO (id, name)
- permissions: list of PermissionResponseDTO
- createdAt, updatedAt, createdBy, updatedBy

RolePermissionRequestDTO

- permissionIds: array<long>, not empty

---

## Status Codes & Errors

- 200 OK — Successful request (GET, PUT, DELETE where applicable)
- 201 Created — Successful POST creating a resource
- 400 Bad Request — Validation failures (invalid/missing fields)
- 401 Unauthorized — Not authenticated
- 403 Forbidden — Missing required authority
- 404 Not Found — Role or permission not found
- 500 Internal Server Error — Unexpected error

Error response example:

```json
{
  "message": "Validation failed",
  "status": "ERROR",
  "data": null,
  "errors": [{ "field": "name", "message": "Role name cannot be blank" }]
}
```

---

## Notes & Implementation Details 💡

- Search and `moduleId` filtering are combined using JPA Specifications in `RoleSpecification`.
- Pagination uses Spring `Pageable` with standard `page`, `size`, `sort` query params.
- Validation annotations are present on DTOs and will result in 400 responses when violated.
- Permissions are assigned/removed by passing explicit `permissionIds` — server handles existence checks and returns `RoleDetailResponseDTO` after mutation.

---

If you'd like, I can also add example cURL requests for each endpoint or generate an OpenAPI snippet for these operations. 👍
