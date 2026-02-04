# No-Code Version (Practical Options)

You can build a no-code equivalent by splitting features:

## Option 1: Glide (fastest)
- Data: Google Sheets or Airtable
- Auth: phone/email via Glide
- Uploads: built-in file upload
- Admin: Glide app itself

Pros: very fast, mobile-first.
Cons: OTP/SMS provider control is limited.

## Option 2: AppSheet (Google)
- Data: Sheets / SQL
- Forms: application submission
- Uploads: attachments
- Admin: built-in views

Pros: enterprise friendly.
Cons: custom OTP is limited.

## Option 3: Bubble (most flexible)
- Auth: phone OTP via plugins or custom API
- Data: Bubble DB
- Uploads: built-in
- Admin panel: same Bubble app

Pros: highly customizable.
Cons: more complex.

## Hybrid (recommended)
- Keep this backend (OTP + uploads + status tracking)
- Use a no-code frontend (Bubble/Glide) consuming backend REST APIs

If you tell me which no-code platform you prefer, I’ll map each API endpoint to screens/workflows and provide step-by-step build instructions.
