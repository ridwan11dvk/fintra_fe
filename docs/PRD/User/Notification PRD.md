# Notification - Product Requirements Document (PRD)

## 1. Overview

The **Notification** feature is a user-facing communication module that delivers system information, reminders, and operational messages through multiple channels. The module supports **user-specific notifications** and **global notifications** that are visible to all users. Notifications can be delivered through **IN_APP**, **EMAIL**, and **SMS**, with real-time delivery support for in-app notifications through **Firebase Cloud Messaging (FCM)** and REST fallback.

This module provides capabilities to view notifications, retrieve unread counts, read notification details, mark notifications as read, mark all notifications as read, and delete user-owned notifications. Administrative users can also create single or bulk notifications.

---

## 2. Objectives

- Provide a centralized notification inbox for authenticated users.
- Support global notifications (`user_id = null`) and user-specific notifications (`user_id != null`).
- Deliver in-app notifications in real time via FCM.
- Support multi-channel delivery for operational use cases (IN_APP, EMAIL, SMS).
- Provide unread counters and read-state tracking per user.
- Allow administrative users to create targeted or bulk notifications.
- Support structured metadata for frontend rendering, including links and action buttons.
- Support FCM token registration during login and token validation flows.

---

## 3. User Roles & Permissions

| Permission / Access Rule  | Description                                                                   |
| ------------------------- | ----------------------------------------------------------------------------- |
| Authenticated user        | View own visible notifications and global notifications                       |
| Authenticated user        | View notification detail if the notification belongs to the user or is global |
| Authenticated user        | Mark notifications as read / mark all as read                                 |
| Authenticated user        | Delete own user-specific notifications                                        |
| `app:notification:manage` | Create single notifications                                                   |
| `app:notification:manage` | Create bulk notifications                                                     |

> **Note:** The backend currently enforces authenticated access for read operations and `app:notification:manage` for create/bulk actions. Delete is limited by ownership logic in the service layer. Global notifications cannot be deleted per user.

---

## 4. Database Structure

Refers to the `notification`, `notification_category`, `notification_read`, and `notification_preference` tables.

### 4.1. Main Notification Table (`notification`)

| Column            | Type         | Nullable | Default   | Description                                                |
| ----------------- | ------------ | -------- | --------- | ---------------------------------------------------------- |
| `id`              | BIGSERIAL    | NO       | -         | Auto-increment primary key                                 |
| `category_id`     | BIGINT       | NO       | -         | Foreign key to notification category                       |
| `title`           | VARCHAR(255) | NO       | -         | Notification title                                         |
| `message`         | TEXT         | NO       | -         | Notification body                                          |
| `status`          | VARCHAR(50)  | NO       | `PENDING` | Delivery status                                            |
| `channel`         | VARCHAR(50)  | NO       | -         | Delivery channel                                           |
| `user_id`         | BIGINT       | YES      | NULL      | Target user ID; null means global notification             |
| `user_type`       | VARCHAR(50)  | YES      | NULL      | Target user type; null for global notification             |
| `recipient_email` | VARCHAR(255) | YES      | NULL      | Recipient email for EMAIL channel                          |
| `recipient_phone` | VARCHAR(20)  | YES      | NULL      | Recipient phone for SMS channel                            |
| `scheduled_at`    | TIMESTAMP    | YES      | NULL      | Scheduled send time                                        |
| `sent_at`         | TIMESTAMP    | YES      | NULL      | Actual send time                                           |
| `metadata`        | JSONB        | YES      | `{}`      | Structured metadata for UI and optional template variables |
| `retry_count`     | INTEGER      | NO       | `0`       | Number of send attempts                                    |
| `max_retries`     | INTEGER      | NO       | `3`       | Maximum allowed retries                                    |
| `next_retry_at`   | TIMESTAMP    | YES      | NULL      | Scheduled time for the next retry                          |
| `error_message`   | TEXT         | YES      | NULL      | Last failure reason                                        |
| `created_at`      | TIMESTAMP    | NO       | NOW       | Record creation timestamp                                  |
| `updated_at`      | TIMESTAMP    | NO       | NOW       | Record update timestamp                                    |
| `created_by`      | VARCHAR(100) | YES      | NULL      | User who created the record                                |
| `updated_by`      | VARCHAR(100) | YES      | NULL      | User who last updated the record                           |

### 4.2. Notification Category Table (`notification_category`)

| Column        | Type         | Nullable | Default | Description                          |
| ------------- | ------------ | -------- | ------- | ------------------------------------ |
| `id`          | BIGSERIAL    | NO       | -       | Auto-increment primary key           |
| `name`        | VARCHAR(100) | NO       | -       | Category display name                |
| `description` | TEXT         | YES      | NULL    | Category description                 |
| `is_active`   | BOOLEAN      | NO       | `TRUE`  | Indicates whether category is active |
| `created_at`  | TIMESTAMP    | NO       | NOW     | Record creation timestamp            |
| `updated_at`  | TIMESTAMP    | NO       | NOW     | Record update timestamp              |
| `created_by`  | VARCHAR(100) | YES      | NULL    | User who created the record          |
| `updated_by`  | VARCHAR(100) | YES      | NULL    | User who last updated the record     |

### 4.3. Notification Read Table (`notification_read`)

| Column            | Type        | Nullable | Default | Description                        |
| ----------------- | ----------- | -------- | ------- | ---------------------------------- |
| `id`              | BIGSERIAL   | NO       | -       | Auto-increment primary key         |
| `notification_id` | BIGINT      | NO       | -       | Foreign key to notification        |
| `user_id`         | BIGINT      | NO       | -       | User receiving read-state tracking |
| `user_type`       | VARCHAR(50) | NO       | -       | User type                          |
| `is_read`         | BOOLEAN     | NO       | `FALSE` | Whether notification has been read |
| `read_at`         | TIMESTAMP   | YES      | NULL    | Time notification was read         |
| `created_at`      | TIMESTAMP   | NO       | NOW     | Record creation timestamp          |
| `updated_at`      | TIMESTAMP   | NO       | NOW     | Record update timestamp            |

### 4.4. Notification Preference Table (`notification_preference`)

| Column        | Type        | Nullable | Default | Description                              |
| ------------- | ----------- | -------- | ------- | ---------------------------------------- |
| `id`          | BIGSERIAL   | NO       | -       | Auto-increment primary key               |
| `user_id`     | BIGINT      | NO       | -       | User ID                                  |
| `user_type`   | VARCHAR(20) | NO       | -       | User type                                |
| `category_id` | BIGINT      | NO       | -       | Notification category                    |
| `enabled`     | BOOLEAN     | NO       | `TRUE`  | Whether category is enabled for the user |
| `created_at`  | TIMESTAMP   | NO       | NOW     | Record creation timestamp                |
| `updated_at`  | TIMESTAMP   | NO       | NOW     | Record update timestamp                  |

### 4.5. Enumerations

#### Notification Status (`status`)

| Value      | Label    | Description                         |
| ---------- | -------- | ----------------------------------- |
| `PENDING`  | Pending  | Notification queued for delivery    |
| `SENT`     | Sent     | Notification delivered successfully |
| `FAILED`   | Failed   | Notification delivery failed        |
| `RETRYING` | Retrying | Notification scheduled for retry    |

#### Notification Channel (`channel`)

| Value    | Label  | Description                    |
| -------- | ------ | ------------------------------ |
| `IN_APP` | In-App | Stored in DB and pushed to UI  |
| `EMAIL`  | Email  | Delivered via SMTP             |
| `SMS`    | SMS    | Delivered through SMS provider |

#### User Type (`user_type`)

| Value      | Label    | Description             |
| ---------- | -------- | ----------------------- |
| `INTERNAL` | Internal | Internal system user    |
| `EXTERNAL` | External | External user / partner |

### 4.6. FCM Session Token Storage (Auth Module)

To support in-app push delivery via FCM, device/session tokens are stored in authenticated user sessions (`user_session.fcm_token`) and used by notification delivery handlers to route IN_APP messages.

Token registration sources:

- `POST /api/auth/login/internal` with optional `fcmToken`
- `POST /api/auth/login/external` with optional `fcmToken`
- `POST /api/auth/validate-token` with optional `fcmToken`
- `PUT /api/profile/sessions/fcm-token` for fallback/rotation updates

#### Metadata Action Icon (`metadata.actions[].icon`)

| Value        | Description           |
| ------------ | --------------------- |
| `eye`        | View detail           |
| `leftarrow`  | Navigate back         |
| `rightarrow` | Navigate forward      |
| `delete`     | Delete action         |
| `edit`       | Edit action           |
| `send`       | Send action           |
| `sync`       | Sync / refresh action |

### 4.7. Metadata JSON Structure

The `metadata` field supports structured frontend rendering and optional template variables:

```json
{
  "links": [
    {
      "key": "key1",
      "value": "/user/1"
    }
  ],
  "actions": [
    {
      "key": "key1",
      "label": "View",
      "icon": "eye",
      "action": "VIEW",
      "url": "/user/1"
    }
  ],
  "variables": {
    "userName": "John Doe",
    "invoiceNumber": "INV-001"
  }
}
```

**Validation Rules:**

- `links[].key` is required
- `links[].value` is required
- `actions[].key` is required
- `actions[].label` is optional
- `actions[].icon` is optional, but if present must use one of the supported enum values
- `actions[].action` is optional
- `actions[].url` is optional
- `variables` is optional and used for template replacement (`#{variableName}`)

---

## 5. Functional Requirements

### 5.1. Notification List Page

**Description:** Displays visible notifications for the authenticated user in a paginated table or list. Visible notifications consist of:

- User-specific notifications where `user_id = current user`
- Global notifications where `user_id IS NULL`

**List Columns / Fields:**

| No  | Field          | Label       | Sortable | Notes                                           |
| --- | -------------- | ----------- | -------- | ----------------------------------------------- |
| 1   | `categoryName` | Category    | Yes      | Display category name                           |
| 2   | `title`        | Title       | Yes      | Notification title                              |
| 3   | `message`      | Message     | No       | Short preview or truncated message              |
| 4   | `channel`      | Channel     | Yes      | IN_APP / EMAIL / SMS                            |
| 5   | `status`       | Status      | Yes      | Badge or label                                  |
| 6   | `isRead`       | Read Status | Yes      | Read / unread indicator                         |
| 7   | `created_at`   | Created At  | Yes      | Default sort descending                         |
| 8   | -              | Actions     | No       | View detail, Mark as read, Delete (conditional) |

**Filters & Search:**

| Filter      | Input Type        | Description                |
| ----------- | ----------------- | -------------------------- |
| Channel     | Dropdown          | All / IN_APP / EMAIL / SMS |
| Read Status | Dropdown          | All / Read / Unread        |
| Category    | Dropdown          | Filter by category         |
| Date        | Date range picker | Filter by created date     |

**Pagination:**

- Default page size: 10
- Default sort: `created_at` descending

**API Endpoint:** `GET /api/notification`

---

### 5.2. Notification Detail View

**Description:** Displays full detail of a notification visible to the authenticated user. A user may open detail for:

- Their own notification
- A global notification (`user_id IS NULL`)

**Information Displayed:**

**Section: Notification Content**

- Category (`categoryName`)
- Title (`title`)
- Message (`message`)
- Channel (`channel`)
- Status (`status`)

**Section: Delivery Information**

- Recipient Email (`recipientEmail`) — when channel is EMAIL
- Recipient Phone (`recipientPhone`) — when channel is SMS
- Scheduled At (`scheduledAt`) — format: DD/MM/YYYY HH:mm
- Sent At (`sentAt`) — format: DD/MM/YYYY HH:mm
- Retry Count (`retryCount`)
- Max Retries (`maxRetries`)
- Next Retry At (`nextRetryAt`) — format: DD/MM/YYYY HH:mm
- Error Message (`errorMessage`) — if delivery failed

**Section: Metadata**

- Links (`metadata.links`) — rendered as clickable links
- Actions (`metadata.actions`) — rendered as action buttons/icons

**Section: Read State**

- Is Read (`isRead`)
- Read At (`readAt`) — format: DD/MM/YYYY HH:mm

**Section: Audit**

- Created By (`createdBy`)
- Created At (`createdAt`) — format: DD/MM/YYYY HH:mm
- Updated By (`updatedBy`)
- Updated At (`updatedAt`) — format: DD/MM/YYYY HH:mm

**Trigger:** Click the notification item or “Detail” action from the notification list.

**API Endpoint:** `GET /api/notification/{id}`

---

### 5.3. Create Single Notification

**Description:** Allows administrative users to create a single notification for either one user or all users.

**Creation Modes:**

- **User-specific:** `userId` and `userType` are set
- **Global:** `userId = null` and `userType = null`

**Fields:**

| No  | Field            | Label           | Input Type             | Validation                            |
| --- | ---------------- | --------------- | ---------------------- | ------------------------------------- |
| 1   | `categoryId`     | Category        | Dropdown               | Required                              |
| 2   | `title`          | Title           | Text input             | Required, non-blank                   |
| 3   | `message`        | Message         | Text area              | Required, non-blank                   |
| 4   | `channel`        | Channel         | Dropdown               | Required                              |
| 5   | `userId`         | Target User     | Number / search select | Optional                              |
| 6   | `userType`       | User Type       | Dropdown               | Optional, required if `userId` is set |
| 7   | `recipientEmail` | Recipient Email | Text input             | Optional, required for EMAIL          |
| 8   | `recipientPhone` | Recipient Phone | Text input             | Optional, required for SMS            |
| 9   | `scheduledAt`    | Scheduled At    | Datetime picker        | Optional                              |
| 10  | `metadata`       | Metadata        | JSON / structured form | Optional                              |
| 11  | `maxRetries`     | Max Retries     | Number input           | Optional                              |

**Behavior:**

- If `scheduledAt` is null, the notification is sent immediately through the event listener.
- If user-specific, a read-tracking row is created immediately.
- If global, read-tracking rows are created lazily when the user reads it.

**API Endpoint:** `POST /api/notification`

---

### 5.4. Create Bulk Notifications

**Description:** Allows administrative users to create notifications for multiple users or broadcast globally in one request.

**Bulk Modes:**

- **Global broadcast:** `userIds = null` or empty
- **Per-user bulk:** `userIds` contains one or more user IDs

**Fields:**

| No  | Field             | Label            | Input Type             | Validation                               |
| --- | ----------------- | ---------------- | ---------------------- | ---------------------------------------- |
| 1   | `categoryId`      | Category         | Dropdown               | Required                                 |
| 2   | `title`           | Title            | Text input             | Required                                 |
| 3   | `message`         | Message          | Text area              | Required                                 |
| 4   | `channels`        | Channels         | Multi-select           | Required                                 |
| 5   | `userIds`         | Target Users     | Multi-select           | Optional                                 |
| 6   | `userType`        | User Type        | Dropdown               | Optional, required if `userIds` provided |
| 7   | `metadata`        | Metadata         | JSON / structured form | Optional                                 |
| 8   | `sendImmediately` | Send Immediately | Toggle                 | Optional                                 |

**Behavior:**

- Creates one notification per channel for global broadcast.
- Creates one notification per target user per channel for per-user bulk.
- Publishes events for immediate send processing.

**API Endpoint:** `POST /api/notification/bulk`

---

### 5.5. Mark Notification as Read

**Description:** Marks a single visible notification as read for the authenticated user.

**Behavior:**

- User can mark their own notification as read.
- User can mark a global notification as read.
- If a global notification does not yet have a `notification_read` row for the user, the system creates it automatically and then marks it as read.

**API Endpoint:** `PUT /api/notification/{id}/read`

---

### 5.6. Mark All Notifications as Read

**Description:** Marks all visible unread IN_APP notifications as read for the authenticated user.

**Behavior:**

- Includes user-specific IN_APP notifications
- Includes global IN_APP notifications
- For global notifications without prior read-state rows, the system creates rows lazily before marking them as read

**API Endpoint:** `PUT /api/notification/read-all`

---

### 5.7. Delete Notification

**Description:** Allows a user to delete a user-specific notification that belongs to them.

**Delete Conditions:**

- User may delete only notifications they own.
- Global notifications cannot be deleted per user.

**API Endpoint:** `DELETE /api/notification/{id}`

---

### 5.8. Unread Count Widget

**Description:** Provides a total count of unread visible IN_APP notifications for the authenticated user.

**Behavior:**

- Counts unread user-specific notifications
- Counts unread global notifications not yet marked as read by the user

**API Endpoint:** `GET /api/notification/unread/count`

---

### 5.9. Category Master Retrieval

**Description:** Returns the list of notification categories for frontend rendering and admin notification creation.

**API Endpoint:** `GET /api/notification-categories`

---

### 5.10. FCM Token Registration During Authentication

**Description:** Frontend should attach FCM token to authentication requests when available, so notification delivery can target active user sessions immediately.

**Behavior:**

- `fcmToken` is optional on login and validate-token APIs.
- Authentication must not fail if token is unavailable at login time.
- If token is not available during login, frontend updates the active session token afterward using profile session endpoint.
- If Firebase rotates token, frontend must re-register the latest token for the current session.

**API Endpoints:**

- `POST /api/auth/login/internal`
- `POST /api/auth/login/external`
- `POST /api/auth/validate-token`
- `PUT /api/profile/sessions/fcm-token`

---

## 6. Non-Functional Requirements

| Aspect        | Requirement                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------------- |
| Performance   | Notification list and unread count should load in < 2 seconds for paginated requests under normal operational load. |
| Security      | All endpoints require JWT authentication; create and bulk actions require `app:notification:manage`.                |
| Real-Time     | IN_APP notifications should be pushed through FCM with fallback polling support on the frontend.                    |
| Reliability   | Failed notification delivery must support retry with exponential backoff.                                           |
| Audit Trail   | Creation and updates should preserve `created_at`, `updated_at`, `created_by`, and `updated_by`.                    |
| Extensibility | Metadata must support structured links and actions for future UI enhancements.                                      |
| Compatibility | Metadata must remain JSONB-backed and serializable/deserializable cleanly in API requests and responses.            |

---

## 7. Business Rules

| No  | Rule                                                                                                        |
| --- | ----------------------------------------------------------------------------------------------------------- |
| 1   | A notification is considered **global** when `user_id` is null.                                             |
| 2   | A notification is considered **user-specific** when both `user_id` and `user_type` are set.                 |
| 3   | Users can view both their own notifications and global notifications.                                       |
| 4   | Users cannot view notifications belonging to other users.                                                   |
| 5   | Only users with `app:notification:manage` can create single or bulk notifications.                          |
| 6   | Read-state is tracked per user in `notification_read`.                                                      |
| 7   | For global notifications, read-state rows are created lazily when needed.                                   |
| 8   | Global notifications cannot be deleted per user.                                                            |
| 9   | Template substitution supports `#{variableName}` placeholders using `metadata.variables`.                   |
| 10  | `metadata.links[].key` and `metadata.links[].value` are mandatory.                                          |
| 11  | `metadata.actions[].key` is mandatory.                                                                      |
| 12  | `metadata.actions[].icon`, if provided, must use a supported enum value.                                    |
| 13  | EMAIL notifications require `recipient_email`.                                                              |
| 14  | SMS notifications require `recipient_phone`.                                                                |
| 15  | `fcmToken` on auth requests is optional and must not block authentication when unavailable.                 |
| 16  | Frontend should call `/api/profile/sessions/fcm-token` when token becomes available after login or rotates. |

---

## 8. API Endpoints Summary

| No  | Method | Endpoint                         | Description                                           | Permission                |
| --- | ------ | -------------------------------- | ----------------------------------------------------- | ------------------------- |
| 1   | GET    | `/api/notification`              | List visible notifications for the authenticated user | Authenticated user        |
| 2   | GET    | `/api/notification/unread/count` | Get unread notification count                         | Authenticated user        |
| 3   | GET    | `/api/notification/{id}`         | Get notification detail by ID                         | Authenticated user        |
| 4   | POST   | `/api/notification`              | Create a single notification                          | `app:notification:manage` |
| 5   | POST   | `/api/notification/bulk`         | Create bulk notifications                             | `app:notification:manage` |
| 6   | PUT    | `/api/notification/{id}/read`    | Mark a notification as read                           | Authenticated user        |
| 7   | PUT    | `/api/notification/read-all`     | Mark all visible IN_APP notifications as read         | Authenticated user        |
| 8   | DELETE | `/api/notification/{id}`         | Delete a user-owned notification                      | Authenticated user        |
| 9   | GET    | `/api/notification-categories`   | Get all notification categories                       | Authenticated user        |

### Related Auth/Session Endpoints for FCM Registration

| No  | Method | Endpoint                          | Description                                   | Permission         |
| --- | ------ | --------------------------------- | --------------------------------------------- | ------------------ |
| 10  | POST   | `/api/auth/login/internal`        | Internal login with optional `fcmToken`       | Public             |
| 11  | POST   | `/api/auth/login/external`        | External login with optional `fcmToken`       | Public             |
| 12  | POST   | `/api/auth/validate-token`        | ESA token validation with optional `fcmToken` | Public             |
| 13  | PUT    | `/api/profile/sessions/fcm-token` | Register/update FCM token for current session | Authenticated user |

---

## 9. Acceptance Criteria

### AC-1: Notification List

- [ ] User can open the notification list and see paginated data.
- [ ] User can see both user-specific notifications and global notifications.
- [ ] Notification list is sorted by latest created date by default.
- [ ] Unread/read state is visible in the list.

### AC-2: Notification Detail

- [ ] User can open notification detail for a visible notification.
- [ ] User cannot open detail for another user’s private notification.
- [ ] Detail view displays metadata links and actions if provided.

### AC-3: Mark as Read

- [ ] User can mark one visible notification as read.
- [ ] User can mark a global notification as read.
- [ ] Read timestamp is recorded when marking as read.

### AC-4: Mark All as Read

- [ ] User can mark all visible unread IN_APP notifications as read.
- [ ] Global IN_APP notifications are included in the mark-all-read process.

### AC-5: Create Notifications

- [ ] Admin can create a single notification.
- [ ] Admin can create bulk notifications.
- [ ] System supports both global and user-specific creation modes.
- [ ] System validates required fields per channel.

### AC-6: Metadata Rendering

- [ ] Metadata links require `key` and `value`.
- [ ] Metadata actions require `key`.
- [ ] Metadata action icons only accept supported enum values.
- [ ] Metadata is returned as structured JSON in API responses.

### AC-7: Real-Time Delivery

- [ ] IN_APP notifications are available through REST API.
- [ ] IN_APP notifications can be pushed to frontend through FCM.
- [ ] Unread counter reflects global and user-specific unread notifications.

### AC-8: Security

- [ ] All endpoints require JWT authentication.
- [ ] Only `app:notification:manage` users can create notifications.
- [ ] Users cannot delete notifications that do not belong to them.

### AC-9: FCM Token Registration

- [ ] Frontend sends optional `fcmToken` on login and validate-token request payloads.
- [ ] Authentication still succeeds when `fcmToken` is unavailable.
- [ ] Frontend updates FCM token using `/api/profile/sessions/fcm-token` after login when needed.
- [ ] Frontend re-registers FCM token when Firebase token rotates.

---

## 10. Out of Scope

- Notification analytics dashboard
- Advanced notification search DSL / complex filtering UI
- Notification template management UI
- End-user preference management UI endpoints beyond currently implemented backend services
- SMS provider production integration details
- Rich file attachments inside notifications
