// Next.js API route handler for logout
export async function POST() {
  // Gọi backend để xóa cookie
  const res = await fetch('http://localhost:8080/api/v1/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
