// Next.js API route handler for refresh token
export async function POST() {
  // Gọi backend để cấp lại access token
  const res = await fetch('http://localhost:8080/api/v1/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  });
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
