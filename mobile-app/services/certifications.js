import { fetchServiceCatalog } from './catalog.ts';

// Legacy export kept for backward compatibility.
// Prefer `fetchServiceCatalog()` via `services/catalog.ts`.
export const CERTIFICATIONS = [];

export async function getCertificationsFromCatalog() {
  const data = await fetchServiceCatalog();
  const flat = [];
  for (const g of data.groups || []) {
    for (const s of g.services || []) {
      flat.push(s.name);
    }
  }
  return flat;
}
