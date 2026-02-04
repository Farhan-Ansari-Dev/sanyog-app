export const ADMIN_TOKEN_STORAGE = 'sanyog_admin_token';

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_STORAGE) || '';
}

export function setAdminToken(token) {
  localStorage.setItem(ADMIN_TOKEN_STORAGE, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_STORAGE);
}
