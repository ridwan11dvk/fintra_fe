# Notification API Contract

## Overview

The Notification API provides endpoints for managing notifications across multiple channels (IN_APP, EMAIL, SMS, WHATSAPP). The API supports creating single and bulk notifications, retrieving user notifications with pagination, and managing notification read status.

---

## Base Information

- **Base URL**: `/api/notification`
- **Categories Base URL**: `/api/notification-categories`
- **Authentication**: Bearer JWT Token (Required)
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
  "message": "Notifications retrieved successfully",
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

## Enumerations

### NotificationChannel

Available notification delivery channels:

- `IN_APP` - In-application notifications
- `EMAIL` - Email notifications
- `SMS` - SMS/Text message notifications
- `WHATSAPP` - WhatsApp notifications

### NotificationStatus

Current status of a notification:

- `PENDING` - Awaiting processing
- `SENT` - Successfully sent
- `FAILED` - Failed to send
- `RETRYING` - Currently retrying failed delivery

### UserType

User classification:

- `INTERNAL` - Internal company users
- `EXTERNAL` - External/partner users

---

## Notification Categories

### 1. Get All Notification Categories

Retrieve list of all available notification categories.

**Endpoint**: `GET /notification-categories`  
**Authentication**: Required (Bearer Token)  
**Permission**: None (authenticated users only)

#### Request Parameters

None

#### Response (200 OK)

```json
{
  "message": "Categories retrieved successfully",
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "name": "System Alerts",
      "description": "System-related notifications",
      "isActive": true
    },
    {
      "id": 2,
      "name": "Transaction Updates",
      "description": "Notifications about transaction status",
      "isActive": true
    }
  ],
  "errors": null
}
```

---

## Notifications

### 1. Get User Notifications

Retrieve paginated list of IN_APP notifications for the authenticated user.

**Endpoint**: `GET /notification`  
**Authentication**: Required (Bearer Token)  
**Permission**: None (authenticated users only)

#### Request Parameters

| Parameter  | Type    | Required | Default          | Description                             |
| ---------- | ------- | -------- | ---------------- | --------------------------------------- |
| `userType` | string  | No       | `INTERNAL`       | User type filter (INTERNAL or EXTERNAL) |
| `page`     | integer | No       | `0`              | Page number (0-indexed)                 |
| `size`     | integer | No       | `20`             | Page size                               |
| `sort`     | string  | No       | `createdAt,desc` | Sort criteria                           |

#### Response (200 OK)

```json
{
  "message": "Notifications retrieved successfully",
  "status": "SUCCESS",
  "data": {
    "content": [
      {
        "id": 1,
        "categoryId": 1,
        "categoryName": "System Alerts",
        "title": "Approval Required",
        "message": "Your document requires approval",
        "status": "SENT",
        "channel": "IN_APP",
        "userId": 123,
        "userType": "INTERNAL",
        "recipientEmail": null,
        "recipientPhone": null,
        "scheduledAt": null,
        "sentAt": "2024-04-26T10:30:00",
        "metadata": null,
        "retryCount": 0,
        "maxRetries": 3,
        "nextRetryAt": null,
        "errorMessage": null,
        "isRead": false,
        "readAt": null,
        "createdAt": "2024-04-26T10:30:00",
        "updatedAt": "2024-04-26T10:30:00",
        "createdBy": "SYSTEM",
        "updatedBy": "SYSTEM"
      }
    ],
    "totalElements": 15,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 20,
    "hasNext": false,
    "hasPrevious": false
  },
  "errors": null
}
```

---

### 2. Get Unread Notification Count

Retrieve count of unread notifications for the authenticated user.

**Endpoint**: `GET /notification/unread/count`  
**Authentication**: Required (Bearer Token)  
**Permission**: None (authenticated users only)

#### Request Parameters

| Parameter  | Type   | Required | Default    | Description                             |
| ---------- | ------ | -------- | ---------- | --------------------------------------- |
| `userType` | string | No       | `INTERNAL` | User type filter (INTERNAL or EXTERNAL) |

#### Response (200 OK)

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS",
  "data": 5,
  "errors": null
}
```

---

### 3. Get Notification by ID

Retrieve a specific notification by its ID (user can only retrieve their own notifications).

**Endpoint**: `GET /notification/{id}`  
**Authentication**: Required (Bearer Token)  
**Permission**: None (users can only retrieve their own)

#### Path Parameters

| Parameter | Type | Required | Description     |
| --------- | ---- | -------- | --------------- |
| `id`      | long | Yes      | Notification ID |

#### Request Parameters

| Parameter  | Type   | Required | Default    | Description      |
| ---------- | ------ | -------- | ---------- | ---------------- |
| `userType` | string | No       | `INTERNAL` | User type filter |

#### Response (200 OK)

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "categoryId": 1,
    "categoryName": "System Alerts",
    "title": "Approval Required",
    "message": "Your document requires approval",
    "status": "SENT",
    "channel": "IN_APP",
    "userId": 123,
    "userType": "INTERNAL",
    "recipientEmail": null,
    "recipientPhone": null,
    "scheduledAt": null,
    "sentAt": "2024-04-26T10:30:00",
    "metadata": null,
    "retryCount": 0,
    "maxRetries": 3,
    "nextRetryAt": null,
    "errorMessage": null,
    "isRead": false,
    "readAt": null,
    "createdAt": "2024-04-26T10:30:00",
    "updatedAt": "2024-04-26T10:30:00",
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM"
  },
  "errors": null
}
```

#### Error Responses

**404 Not Found** - Notification not found or user doesn't have access

```json
{
  "message": "Notification not found",
  "status": "ERROR",
  "data": null,
  "errors": null
}
```

---

### 4. Create Notification

Create a new single notification for a specific user or globally.

**Endpoint**: `POST /notification`  
**Authentication**: Required (Bearer Token)  
**Permission**: `app:notification:manage`

#### Request Body

```json
{
  "categoryId": 1,
  "title": "Payment Received",
  "message": "Payment of $1000 has been received",
  "channel": "IN_APP",
  "userId": 456,
  "userType": "INTERNAL",
  "recipientEmail": "user@company.com",
  "recipientPhone": "+62812345678",
  "scheduledAt": "2024-04-27T10:00:00",
  "metadata": {
    "templateVariables": {
      "amount": "1000",
      "currency": "USD"
    },
    "actionUrl": "/payments/123",
    "iconUrl": "https://example.com/icon.png"
  },
  "maxRetries": 3
}
```

#### Request Validations

- `categoryId`: Required, must exist in system
- `title`: Required, non-blank
- `message`: Required, non-blank
- `channel`: Required, must be valid channel (IN_APP, EMAIL, SMS, WHATSAPP)
- `userId`: Optional; if provided with userType, creates user-specific notification
- `userType`: Optional; used with userId (INTERNAL or EXTERNAL)
- `recipientEmail`: Optional; for EMAIL channel
- `recipientPhone`: Optional; for SMS/WHATSAPP channels
- `scheduledAt`: Optional; if provided, notification is scheduled for future delivery
- `metadata`: Optional; template variables and additional metadata
- `maxRetries`: Optional; default is 3

#### Response (201 Created)

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS",
  "data": {
    "id": 100,
    "categoryId": 1,
    "categoryName": "Payment",
    "title": "Payment Received",
    "message": "Payment of $1000 has been received",
    "status": "SENT",
    "channel": "IN_APP",
    "userId": 456,
    "userType": "INTERNAL",
    "recipientEmail": "user@company.com",
    "recipientPhone": null,
    "scheduledAt": "2024-04-27T10:00:00",
    "sentAt": "2024-04-26T10:30:00",
    "metadata": {
      "templateVariables": {
        "amount": "1000",
        "currency": "USD"
      },
      "actionUrl": "/payments/123",
      "iconUrl": "https://example.com/icon.png"
    },
    "retryCount": 0,
    "maxRetries": 3,
    "nextRetryAt": null,
    "errorMessage": null,
    "isRead": false,
    "readAt": null,
    "createdAt": "2024-04-26T10:30:00",
    "updatedAt": "2024-04-26T10:30:00",
    "createdBy": "ADMIN_USER",
    "updatedBy": "ADMIN_USER"
  },
  "errors": null
}
```

#### Error Responses

**400 Bad Request** - Invalid request parameters

```json
{
  "message": "Request validation failed",
  "status": "ERROR",
  "data": null,
  "errors": [
    {
      "field": "categoryId",
      "message": "Category ID cannot be null"
    },
    {
      "field": "title",
      "message": "Title cannot be blank"
    }
  ]
}
```

**403 Forbidden** - Insufficient permissions

```json
{
  "message": "Access denied: app:notification:manage permission required",
  "status": "ERROR",
  "data": null,
  "errors": null
}
```

---

### 5. Create Bulk Notifications

Create and send notifications to multiple users at once. If `userIds` is empty, notification is sent to all users.

**Endpoint**: `POST /notification/bulk`  
**Authentication**: Required (Bearer Token)  
**Permission**: `app:notification:manage`

#### Request Body

```json
{
  "categoryId": 1,
  "title": "System Maintenance",
  "message": "System maintenance scheduled for 2024-04-28",
  "channels": ["IN_APP", "EMAIL"],
  "userIds": [123, 456, 789],
  "userType": "INTERNAL",
  "metadata": {
    "templateVariables": {
      "maintenanceTime": "2024-04-28 22:00:00",
      "estimatedDuration": "2 hours"
    }
  },
  "sendImmediately": true
}
```

#### Request Validations

- `categoryId`: Required, must exist in system
- `title`: Required, non-blank
- `message`: Required, non-blank
- `channels`: Required, non-empty list of valid channels (IN_APP, EMAIL, SMS, WHATSAPP)
- `userIds`: Optional; if empty/null, sends to all users
- `userType`: Optional; filter for user type (INTERNAL or EXTERNAL)
- `metadata`: Optional; template variables and additional metadata
- `sendImmediately`: Optional; if false, sets notification status to PENDING for manual trigger

#### Response (202 Accepted)

```json
{
  "message": "Request processed successfully",
  "status": "SUCCESS",
  "data": null,
  "errors": null
}
```

#### Notes

- Bulk notification creation is asynchronous
- Response status 202 indicates the request is accepted and being processed
- Notifications will be sent to specified users or all users if userIds is empty
- Multiple channels can be specified for each user

#### Error Responses

**400 Bad Request** - Invalid request parameters

```json
{
  "message": "Request validation failed",
  "status": "ERROR",
  "data": null,
  "errors": [
    {
      "field": "channels",
      "message": "Channels cannot be null"
    }
  ]
}
```

**403 Forbidden** - Insufficient permissions

```json
{
  "message": "Access denied: app:notification:manage permission required",
  "status": "ERROR",
  "data": null,
  "errors": null
}
```

---

### 6. Mark Notification as Read

Mark a specific notification as read for the authenticated user.

**Endpoint**: `PUT /notification/{id}/read`  
**Authentication**: Required (Bearer Token)  
**Permission**: None (users can only update their own notifications)

#### Path Parameters

| Parameter | Type | Required | Description     |
| --------- | ---- | -------- | --------------- |
| `id`      | long | Yes      | Notification ID |

#### Request Parameters

| Parameter  | Type   | Required | Default    | Description      |
| ---------- | ------ | -------- | ---------- | ---------------- |
| `userType` | string | No       | `INTERNAL` | User type filter |

#### Response (204 No Content)

Empty response body on success.

#### Error Responses

**404 Not Found** - Notification not found or user doesn't have access

```json
{
  "message": "Notification not found",
  "status": "ERROR",
  "data": null,
  "errors": null
}
```

---

### 7. Mark All Notifications as Read

Mark all notifications as read for the authenticated user.

**Endpoint**: `PUT /notification/read-all`  
**Authentication**: Required (Bearer Token)  
**Permission**: None (users can only update their own notifications)

#### Request Parameters

| Parameter  | Type   | Required | Default    | Description      |
| ---------- | ------ | -------- | ---------- | ---------------- |
| `userType` | string | No       | `INTERNAL` | User type filter |

#### Response (204 No Content)

Empty response body on success.

---

### 8. Delete Notification

Delete a specific notification. Users can delete their own notifications; admins can delete any notification.

**Endpoint**: `DELETE /notification/{id}`  
**Authentication**: Required (Bearer Token)  
**Permission**: None (users can delete own, admins can delete any)

#### Path Parameters

| Parameter | Type | Required | Description     |
| --------- | ---- | -------- | --------------- |
| `id`      | long | Yes      | Notification ID |

#### Request Parameters

| Parameter  | Type   | Required | Default    | Description      |
| ---------- | ------ | -------- | ---------- | ---------------- |
| `userType` | string | No       | `INTERNAL` | User type filter |

#### Response (204 No Content)

Empty response body on success.

#### Error Responses

**404 Not Found** - Notification not found or user doesn't have access

```json
{
  "message": "Notification not found",
  "status": "ERROR",
  "data": null,
  "errors": null
}
```

---

## Authentication

All endpoints require Bearer JWT authentication via the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

---

## Authorization

| Endpoint                       | Permission                | Who Can Access                          |
| ------------------------------ | ------------------------- | --------------------------------------- |
| GET /notification-categories   | None                      | Authenticated users                     |
| GET /notification              | None                      | Authenticated users (own notifications) |
| GET /notification/unread/count | None                      | Authenticated users                     |
| GET /notification/{id}         | None                      | Authenticated users (own notification)  |
| POST /notification             | `app:notification:manage` | Admin users only                        |
| POST /notification/bulk        | `app:notification:manage` | Admin users only                        |
| PUT /notification/{id}/read    | None                      | Authenticated users (own notification)  |
| PUT /notification/read-all     | None                      | Authenticated users                     |
| DELETE /notification/{id}      | None                      | Authenticated users (own) or admins     |

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- User ID in request context is extracted from JWT token
- Pagination uses Spring Data's Pageable interface (page, size, sort)
- Empty userId in notification response indicates global/system notification
- Bulk notifications are processed asynchronously; 202 response indicates acceptance
- Scheduled notifications are processed at scheduled time or via cron job
- Retry logic automatically retries failed notifications up to maxRetries limit
