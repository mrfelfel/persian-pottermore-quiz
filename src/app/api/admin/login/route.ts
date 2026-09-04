import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { adminUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  const hashToVerify = crypto.scryptSync(password, salt, 64).toString('hex');
  return hash === hashToVerify;
}

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'نام کاربری و رمز عبور الزامی است' }, { status: 400 });
  }

  const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));

  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    return NextResponse.json({ error: 'نام کاربری یا رمز عبور اشتباه است' }, { status: 401 });
  }

  // Create session token
  const token = crypto.randomBytes(32).toString('hex');
  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 86400, // 24 hours
    path: '/',
  });
  // Store token mapping in a simple way — for MVP, use the username as the token value
  response.cookies.set('admin_user', username, {
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    maxAge: 86400,
    path: '/',
  });

  return response;
}
