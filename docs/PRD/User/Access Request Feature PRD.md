# Access Request Feature - Product Requirements Document

**Date**: April 2026  
**Version**: 2.0 (Denormalized Implementation)  
**Status**: Implemented with Simplified Data Model

---

## Table of Contents

1. [Feature Overview](#feature-overview)
2. [Objectives & Scope](#objectives--scope)
3. [User Stories](#user-stories)
4. [Business Rules](#business-rules)
5. [Workflow & States](#workflow--states)
6. [Notifications](#notifications)
7. [API Reference](#api-reference)
8. [Frontend Requirements](#frontend-requirements)
9. [Technical Architecture](#technical-architecture)
10. [Constraints & Assumptions](#constraints--assumptions)

---

## Feature Overview

The **Access Request Feature** enables internal users without roles to request access to modules. Upon submission, administrators with the `app:access-request:approve` permission review requests and approve/reject them. When approved, the admin explicitly selects role(s) to assign to the user.

### Key Characteristics

- **Self-Service**: Users can independently request module access
- **Flexible Approval**: Admins assign specific roles during approval
- **Multi-Module Requests**: Users can request multiple modules in a single request (stored as comma-separated string)
- **Transparent Workflow**: All parties receive status notifications
- **Audit Trail**: Full audit history via BaseEntity timestamps and audit fields
- **Simplified Data Model**: Denormalized structure for improved performance and simplicity

---

## Objectives & Scope

### Objectives

1. Reduce access management friction for new internal users
2. Provide admins with a centralized dashboard to manage access requests
3. Ensure proper role assignment through explicit admin selection
4. Maintain audit compliance with complete request history
5. Improve user experience with real-time notifications

### Scope

**Included:**

- Access request CRUD operations
- Request submission by internal users
- Admin dashboard for approval/rejection
- Role assignment to users on approval
- Notification system integration
- RESTful API endpoints
- Database schema and migrations

**Excluded:**

- Multi-level approval workflows
- Request expiration/auto-cleanup
- Delegation of approval authority
- Request templates or pre-defined workflows
- Scheduled/batch operations

---

## User Stories

### User: New Internal Employee

**Story**: As a new internal employee without any roles, I want to request access to modules so that I can start using the system.

**Acceptance Criteria:**

- When I log in for the first time without roles, a popup appears
- I can select multiple modules to request access to
- I can submit the request with one click
- I receive a confirmation that my request was submitted
- I can check the status of my request anytime

**Scenario**: A new employee logs in, sees a popup listing all available modules, checks "Finance Module" and "Treasury Module", and submits the request.

---

### User: Administrator/Approver

**Story**: As an administrator with approval authority, I want to review pending access requests and assign appropriate roles so that I can grant necessary permissions to users.

**Acceptance Criteria:**

- I see a dashboard with all pending access requests
- I can filter requests by status and search by user name/NIPP
- For each request, I can view requested modules and available roles
- I can approve a request by selecting a role for each module
- I can reject a request with a rejection reason
- The system creates UserRole entries after my approval
- I receive notifications when new requests come in

**Scenario**: Admin logs into admin dashboard, finds a pending request from John Doe requesting Finance & Treasury access. Admin selects "Finance Analyst" role for Finance module and "Treasury Clerk" for Treasury module, then approves.

---

### User: Requester Notification

**Story**: As a user who submitted an access request, I want to be notified of approval/rejection so that I know the status of my request.

**Acceptance Criteria:**

- I receive an in-app notification when my request is approved
- The notification includes the roles I was assigned
- I receive an in-app notification if rejected with the reason
- Notifications are visible in the notification dropdown
- Notifications persist until I mark them as read

---

## Business Rules

### Access Request Rules

1. **One Active Request Per User**: A user can have only one PENDING access request at a time
   - If a user has a PENDING request, they cannot submit another until it's resolved
   - Status constraint: UNIQUE(user_id) WHERE status='PENDING'

2. **Module Independence**: Each module in a request is independent
   - User can request different sets of roles for different modules
   - Approval/rejection is per-request, not per-module (but roles assigned per-module)

3. **Role Must Exist in Module**: When approving, assigned roles must belong to the requested modules
   - The system validates role-module relationship
   - Admin can only select roles from the requested module's role list

4. **Audit Trail**: All access requests maintain full audit history
   - Created/Updated timestamps via BaseEntity
   - Created/Updated by username via BaseEntity audit fields
   - Approval metadata (approved by, approval date) recorded

### Notification Rules

1. **New Request Notification**
   - **Recipients**: All InternalUsers with `app:access-request:approve` authority
   - **Channel**: IN_APP (extensible to EMAIL, SMS)
   - **Trigger**: When user submits request
   - **Content**: Username, requested modules, link to request details

2. **Approval Notification**
   - **Recipient**: Requesting user only
   - **Channel**: IN_APP
   - **Trigger**: When admin approves request
   - **Content**: Approved status, assigned roles per module

3. **Rejection Notification**
   - **Recipient**: Requesting user only
   - **Channel**: IN_APP
   - **Trigger**: When admin rejects request
   - **Content**: Rejection status, rejection reason

---

## Workflow & States

### Access Request State Machine

```
┌────────────────────────────────────────────┐
│         PENDING (Submitted)                │
│    ↙                              ↖        │
│   /                                \       │
APPROVED                          REJECTED
│  │                                  │
│  └─→ UserRoles Created             └─→ Notification Sent
│      Notification Sent
│      Status Updated
└─────────────────────────────────────────────
```

### State Descriptions

| State    | Meaning                                  | Actions Allowed       |
| -------- | ---------------------------------------- | --------------------- |
| PENDING  | Request submitted, awaiting admin review | View, Approve, Reject |
| APPROVED | Admin approved and assigned roles        | View only             |
| REJECTED | Admin rejected with reason               | View only             |

### Workflow Steps

1. **User Submission** (unauthenticated endpoint)
   - User selects modules
   - System validates: user exists, modules exist
   - Creates AccessRequest with status=PENDING
   - Publishes NotificationCreatedEvent for approvers

2. **Admin Review**
   - Admin sees pending request in dashboard
   - Admin views request details with modules and available roles
   - Admin makes decision

3. **Approval Path**
   - Admin selects role for each requested module
   - System validates role-module relationships
   - Creates UserRole entries for user
   - Updates request status to APPROVED
   - Publishes notification to requester
   - Notification listener distributes via channels

4. **Rejection Path**
   - Admin provides rejection reason
   - System updates request status to REJECTED
   - Publishes notification to requester with reason

---

## Notifications

### Notification Categories

**Category Name**: `ACCESS_REQUEST`  
**Description**: Notifications for access request approvals and status changes

### Notification Templates

#### New Request (Admin)

- **Title**: "New Access Request"
- **Message**: "{UserName} requested access to {ModuleNames}"
- **Metadata**: `requestId`, `userId`, `moduleCount`
- **Channel**: IN_APP

#### Approval (User)

- **Title**: "Access Request Approved"
- **Message**: "Your access request has been approved. Assigned roles: {RoleNames}"
- **Metadata**: `requestId`, `assignedRoles`
- **Channel**: IN_APP

#### Rejection (User)

- **Title**: "Access Request Rejected"
- **Message**: "Your access request was rejected. Reason: {Reason}"
- **Metadata**: `requestId`, `rejectionReason`
- **Channel**: IN_APP

---

## API Reference

See [AccessRequest_API_Contract.md](../contract/AccessRequest_API_Contract.md) for complete API documentation.

### Endpoints Summary

| Method | Endpoint                                   | Purpose                       | Auth Required                |
| ------ | ------------------------------------------ | ----------------------------- | ---------------------------- |
| POST   | `/api/access-requests`                     | Submit new request            | No (internal users only)     |
| GET    | `/api/access-requests`                     | List pending requests (admin) | `app:access-request:approve` |
| GET    | `/api/access-requests/{requestId}`         | Get request details           | Same permission or requester |
| PUT    | `/api/access-requests/{requestId}/approve` | Approve request               | `app:access-request:approve` |
| PUT    | `/api/access-requests/{requestId}/reject`  | Reject request                | `app:access-request:approve` |
| GET    | `/api/access-requests/me/status`           | Check user's request status   | None (called on login)       |

---

## Frontend Requirements

### 1. Login Popup Component

**Trigger**: User logs in with NO roles AND no PENDING access request

**Layout**:

- Modal/dialog overlay
- Title: "Welcome! Request Access"
- Subtitle: "You don't have access to any modules yet. Request access below."
- Module list with checkboxes
- Action buttons: "Request Access" (primary), "Skip" (secondary)

**Behavior**:

- Display all modules from Module table
- Allow multiple selection
- "Request Access" sends POST to `/api/access-requests`
- On success: close modal, show success notification
- "Skip" closes modal (can still request later via UI)

**Accessibility**:

- ARIA labels for checkboxes
- Keyboard navigation support
- Focus management on modal open

---

### 2. Admin Access Request Dashboard

**Route**: `/admin/access-requests`  
**Permission**: `app:access-request:approve`

**Layout**:

- Page title: "Access Requests"
- Search/filter bar
- Pending requests table

**Table Columns**:

- User Name
- NIPP
- Requested Modules
- Requested At
- Status badge
- Actions (View/Approve/Reject)

**Features**:

- Pagination (20 per page)
- Filter by status (PENDING, APPROVED, REJECTED)
- Search by user name or NIPP
- Click row to view details

---

### 3. Request Details Modal

**Opened From**: Admin dashboard "View" action

**Sections**:

#### Request Info

- User name, NIPP, requested date
- Status badge with color coding
- Approval date (if approved)
- Rejection reason (if rejected)

#### Modules Section

- List of requested modules
- For each module: module name, available roles dropdown
- APPROVED: show assigned role (read-only)
- PENDING: show role selector for approval

#### Actions (PENDING only)

- "Approve" button (green): save role selections, approve
- "Reject" button (red): show reject modal
- "Cancel" button: close

#### Reject Modal

- Text input for rejection reason (required)
- "Reject" and "Cancel" buttons

---

## Technical Architecture

### Data Model

The implementation uses a **denormalized, single-table design** for simplified access patterns and improved performance.

**Why Denormalized?**

- Simplifies queries and reduces joins
- Improves read performance for common queries
- Reduces complexity of the data model
- Module names and role information are captured as strings and in application logic
- Audit trail remains complete via created_by/updated_by fields

### Database Schema

**Table**: `access_request` (Single denormalized table)

| Field          | Type         | Notes                                     |
| -------------- | ------------ | ----------------------------------------- |
| id             | BIGSERIAL    | Primary key, auto-increment               |
| user_id        | BIGINT       | Denormalized user reference (no FK)       |
| user_type      | VARCHAR(20)  | INTERNAL or EXTERNAL                      |
| module_names   | VARCHAR(255) | Comma-separated list of requested modules |
| request_notes  | TEXT         | User's reason for request                 |
| status         | VARCHAR(20)  | PENDING, APPROVED, or REJECTED            |
| approved_by    | VARCHAR(100) | Username of approver (denormalized)       |
| response_notes | TEXT         | Admin's approval/rejection reason         |
| created_at     | TIMESTAMP    | Request submission timestamp              |
| updated_at     | TIMESTAMP    | Last update timestamp                     |
| created_by     | VARCHAR(100) | Requester username                        |
| updated_by     | VARCHAR(100) | Last modifier username                    |

**Indexes:**

- idx_access_request_user_id: (user_id)
- idx_access_request_status: (status)
- idx_access_request_approved_by: (approved_by)
- idx_access_request_user_pending: UNIQUE on (user_id) WHERE status='PENDING'

### Entities

- **AccessRequest**: Core entity for request tracking
  - Single table with denormalized fields
  - No ORM relationships (@OneToMany, @ManyToOne)
  - Audit trail via BaseEntity (createdAt, updatedAt, createdBy, updatedBy)
  - Fields: id, userId, userType, moduleNames, requestNotes, status, approvedBy, responseNotes

### Services

- **AccessRequestService**: Business logic for CRUD and workflow
  - Handles request submission, approval, rejection
  - Manages notifications for approvers and requesters
  - No direct role assignment (role selection is handled in approval request body)
- **NotificationService**: Notification creation and distribution

### Repositories

- **AccessRequestRepository**: Data access for requests with query methods for status, user, and search
- **NotificationCategoryRepository**: Fetch/create notification categories

---

## Constraints & Assumptions

### Constraints

1. **Single-Step Approval**: No multi-level approval workflows
2. **One Request Per Status**: User can only have one PENDING request at a time
3. **Explicit Role Assignment**: Admin must select role for each module (no defaults)
4. **No Expiration**: Requests do not expire automatically
5. **No Request Modification**: User cannot modify request after submission (must reject and resubmit)

### Assumptions

1. **Module List is Stable**: All modules are available from the Module table
2. **Role-Module Mapping Exists**: All roles belong to modules
3. **Approver Availability**: Assume at least one user has `app:access-request:approve` permission
4. **Internal Users Only**: Feature applies only to InternalUsers (not ExternalUsers)
5. **Notification System Works**: NotificationService and listeners are fully operational

### Future Enhancements (Out of Scope)

1. Request expiration after N days
2. Auto-assignment based on predefined rules
3. Multi-level approval workflows
4. Bulk import of access requests
5. Request templates
6. Approval delegation
7. Scheduled/batch processing
8. Analytics and reporting

---

## Success Criteria

- [x] Users without roles see popup on login
- [x] Users can request multiple modules
- [x] Admins receive notification of new requests
- [x] Admins can approve with role assignment
- [x] Admins can reject with reason
- [x] Users receive notifications of outcomes
- [x] Full audit trail maintained
- [x] API endpoints secured with proper permissions
- [x] Database migrations run successfully
- [x] Code follows AGENTS.md standards

---

## Document History

| Version | Date     | Changes              | Author   |
| ------- | -------- | -------------------- | -------- |
| 1.0     | Apr 2026 | Initial PRD document | AI Agent |

---

## Related Documents

- [Access Request API Contract](../contract/AccessRequest_API_Contract.md)
- [Modules Documentation](../MODULES.md)
- [Role & Permission Guide](../Role_Permission_Guide.md) (reference)
- [Notification System Guide](../NOTIFICATION_SYSTEM.md) (reference)
