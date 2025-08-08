import { cookies } from 'next/headers';

// Utility to get user info from JWT cookie (client-side safe fallback)
export function getUserFromCookie() {
  // This only works in server components or API routes
  const cookieStore = cookies();
  const jwt = cookieStore.get('jwt')?.value;
  if (!jwt) return null;
  // Optionally: decode JWT here (if public key/secret is available)
  // For security, prefer to validate via backend API
  return { jwt };
}

// Example: fetch user info from backend using JWT cookie
export async function fetchUserInfo() {
  const res = await fetch('http://localhost:8080/api/v1/users/me', {
    credentials: 'include',
  });
  if (!res.ok) return null;
  return res.json();
}
