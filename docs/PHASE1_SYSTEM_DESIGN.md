# PHASE 1 — System Design (Sanyog Conformity Solutions)

## Why this design
Sanyog’s website messaging emphasizes **regulatory accuracy**, **disciplined execution**, and **dependable timelines**. The system is designed to:
- Minimize rework and missing documents (structured application + document checklist support).
- Provide predictable status updates (clear stage model + audit trail).
- Keep data safe (least-privilege access, secure uploads, token auth).

## 1) Architecture diagram (textual)

```
[Mobile App (Expo, iOS/Android)]
  - OTP login (mobile)
  - Submit application + upload documents
  - Track status + remarks
  - Request callback
        |
        | HTTPS (JSON + multipart)
        v
[Backend API (Node.js + Express)]
  - OTP provider (India-ready pluggable)
  - JWT issuance + refresh strategy (short access, optional refresh)
  - Application lifecycle + audit log
  - Document upload -> Storage abstraction (Local dev / S3 compatible)
  - Admin auth + RBAC
        |
        | MongoDB (Mongoose)
        v
[MongoDB]
  - Users (client)
  - AdminUsers
  - Applications
  - Documents (metadata)
  - ApplicationEvents (audit trail)
  - ContactRequests

[Admin Panel (React + Vite)]
  - Admin login (email/password)
  - List/filter applications
  - Update status/remarks
  - Download documents
  - Manage callback requests
        |
        | HTTPS
        v
[Same Backend API]
```

## 2) Data model (detailed schema)

### 2.1 Client `User`
Purpose: represent a client authenticated via mobile OTP.
- `mobile: string` (E.164 formatted, unique, indexed)
- `isVerified: boolean`
- `lastLoginAt: Date`
- OTP transient fields (dev/mock only): `otpHash`, `otpExpiresAt`, `otpRequestCount`, `otpLastRequestedAt`

### 2.2 `AdminUser`
Purpose: staff accounts with email/password and role-based access.
- `email: string` (unique, indexed)
- `name: string`
- `passwordHash: string`
- `role: 'admin' | 'ops' | 'viewer'`
- `isActive: boolean`
- `lastLoginAt: Date`

### 2.3 `Application`
Purpose: the central “case file” for certification/compliance work.
- `userMobile: string` (indexed)
- `serviceGroup: 'Domestic Certification' | 'International Certification' | 'Testing Services' | 'Inspection Services'`
- `serviceName: string` (e.g., “BIS Certification (ISI Mark / CRS Scheme-X)”, “WPC Certification (ETA Approval)”)
- Applicant/company details:
  - `companyName: string`
  - `applicantName: string`
  - `email: string`
  - `city: string`
  - `description: string`
- Lifecycle:
  - `status: string` (enum-like: `Documents Received`, `Under Review`, `Submitted to Authority`, `Query Raised`, `Approved / Completed`)
  - `remarks: string` (admin-visible to client)
- `documentIds: ObjectId[]`
- timestamps

### 2.4 `Document`
Purpose: metadata for each uploaded file (so we can swap storage providers safely).
- `applicationId: ObjectId` (indexed)
- `uploadedByMobile: string`
- `originalName: string`
- `mimeType: 'application/pdf' | 'image/jpeg' | 'image/png'`
- `sizeBytes: number`
- Storage fields:
  - `storageProvider: 'local' | 's3'`
  - `storageKey: string` (filesystem path or S3 key)
  - `publicUrl: string` (served via backend for local, signed URL for S3)
- timestamps

### 2.5 `ApplicationEvent` (audit trail)
Purpose: immutable history to support “disciplined execution”.
- `applicationId: ObjectId` (indexed)
- `type: 'created' | 'status_changed' | 'remarks_changed' | 'document_uploaded'`
- `actorType: 'client' | 'admin'`
- `actorId: string` (mobile or admin email/id)
- `payload: object`
- timestamps

### 2.6 `ContactRequest`
Purpose: callback requests from clients.
- `userMobile: string`
- `message: string`
- `status: 'Open' | 'In Progress' | 'Closed'`
- timestamps

## 3) API contract (requests/responses)

All responses are JSON unless noted.

### 3.1 Health
- `GET /health` → `{ ok: true }`

### 3.2 Client auth (OTP)
Why: mobile-first onboarding, no passwords.

- `POST /auth/send-otp`
  - Body: `{ mobile: string }`
  - Response: `{ ok: true, provider: 'mock'|'twilio_verify'|'msg91_otp' }`

- `POST /auth/verify-otp`
  - Body: `{ mobile: string, code: string }`
  - Response: `{ ok: true, token: string, mobile: string }`

### 3.3 Services catalog (for mobile dropdown)
Why: ensure app content matches Sanyog website groups.

- `GET /catalog/services`
  - Response: `{ groups: Array<{ groupName: string, services: Array<{ name: string, slug: string }> }> }`

### 3.4 Applications (client)
Auth: `Authorization: Bearer <clientJWT>`

- `POST /applications`
  - Body: `{ serviceGroup, serviceName, companyName, applicantName, email?, city?, description? }`
  - Response: `Application`

- `GET /applications/my`
  - Response: `Application[]`

- `POST /applications/:id/upload` (multipart)
  - Form field: `files` (up to 5)
  - Response: `Application`

### 3.5 Admin auth + RBAC
Why: remove shared-secret keys; enforce accountability + least privilege.

- `POST /admin/auth/login`
  - Body: `{ email: string, password: string }`
  - Response: `{ ok: true, token: string, admin: { email, name, role } }`

- `GET /admin/auth/me` (admin JWT)
  - Response: `{ email, name, role }`

### 3.6 Admin applications
Auth: `Authorization: Bearer <adminJWT>`

- `GET /admin/applications?status=&serviceGroup=&serviceName=`
  - Response: `Application[]`

- `PATCH /admin/applications/:id`
  - Body: `{ status?, remarks? }`
  - Response: `Application`

- `GET /admin/applications/:id/documents`
  - Response: `Document[]`

### 3.7 Contact requests
Client:
- `POST /contact/request` (client JWT)
  - Body: `{ message? }`
  - Response: `{ ok: true, requestId: string }`

Admin:
- `GET /admin/contact` (admin JWT) → `ContactRequest[]`
- `PATCH /admin/contact/:id` → `{ status }`

## 4) Security considerations

### 4.1 Authentication
- Client: OTP + JWT (short-lived access token). Protect endpoints with `auth` middleware.
- Admin: email/password (bcrypt) + admin JWT. Protect endpoints with `adminAuth`.

### 4.2 Authorization (RBAC)
- Roles:
  - `admin`: full access
  - `ops`: update status/remarks + download docs
  - `viewer`: read-only

### 4.3 Input validation
- Use `zod` on all write endpoints.
- Normalize mobile numbers to E.164.

### 4.4 File upload safety
- Restrict mime types (PDF/JPG/PNG), size limit.
- Store metadata in `Document` collection.
- For local storage, serve via backend static path.
- For S3, use private bucket + signed URLs.

### 4.5 Rate limits + abuse prevention
- Rate-limit OTP send endpoints.
- Add IP-based throttles for login.

### 4.6 Secrets & configuration
- All secrets from env vars.
- Separate dev/prod Mongo databases.

### 4.7 Auditability
- Record `ApplicationEvent` for any status/remarks/document changes.
