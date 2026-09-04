import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { adminUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export async function POST(req: NextRequest) {
  const { newPassword } = await req.json();

  if (!newPassword || newPassword.length < 4) {
    return NextResponse.json({ error: 'رمز عبور باید حداقل ۴ کاراکتر باشد' }, { status: 400 });
  }

  // Check admin session
  const sessionUser = req.cookies.get('admin_user')?.value;
  if (!sessionUser) {
    return NextResponse.json({ error: 'غیرمجاز' }, { status: 401 });
  }

  const passwordHash = hashPassword(newPassword);
  await db.update(adminUsers)
    .set({ passwordHash })
    .where(eq(adminUsers.username, sessionUser));

  return NextResponse.json({ success: true });
}
