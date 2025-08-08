import { NextResponse } from 'next/server';

export async function GET(req) {
  // Forward JWT cookie to backend to get user info
  const jwt = req.cookies.get('jwt');
  if (!jwt) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const res = await fetch('http://localhost:8080/api/v1/users/me', {
    headers: {
      Cookie: `jwt=${jwt}`,
    },
    credentials: 'include',
  });
  if (!res.ok) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
  const user = await res.json();
  return NextResponse.json(user);
}
