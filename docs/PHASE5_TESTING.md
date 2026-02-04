# PHASE 5 — Testing

## Why testing matters here
Sanyog’s value proposition is “structured, reliable, predictable timelines”. The app must avoid missing-document loops and ensure status accuracy.

## Manual QA checklist (happy paths)

### A) Backend health
- [ ] `GET /health` returns `{ ok: true }`

### B) Client OTP auth
- [ ] Send OTP with valid mobile → success
- [ ] Verify OTP with correct code → token issued
- [ ] Verify OTP with wrong code → 401
- [ ] OTP expired → 400

### C) Create application
- [ ] Create application with required fields
- [ ] Verify it appears in `GET /applications/my`

### D) Upload documents
- [ ] Upload PDF (<=10MB) succeeds
- [ ] Upload JPG/PNG succeeds
- [ ] Upload disallowed type fails
- [ ] Upload > 5 files fails
- [ ] Verify uploaded docs are downloadable from admin panel

### E) Status updates
- [ ] Admin updates status
- [ ] Client sees updated status on refresh
- [ ] Remarks show to client

### F) Contact expert
- [ ] Client submits callback request
- [ ] Admin sees request
- [ ] Admin changes request status

## Edge cases
- [ ] Token missing/expired → 401
- [ ] Client attempts to upload to another user’s application → 403
- [ ] Large payloads rejected
- [ ] Mongo down → backend fails fast
- [ ] CORS: only configured origins allowed in production

## Failure handling expectations
- Mobile: show friendly error + retry
- Admin: show error banner + keep unsaved drafts
- Backend: consistent `{ error: string }` messages
