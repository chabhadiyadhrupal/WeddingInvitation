import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'gujaratiwedding2026';
const JWT_SECRET = process.env.JWT_SECRET || 'wedding-invitation-secret-token-key-2026';

export function hashPassword(password: string): string {
  return crypto.createHmac('sha256', JWT_SECRET).update(password).digest('hex');
}

export async function loginAdmin(password: string): Promise<boolean> {
  if (password === ADMIN_PASSWORD) {
    const sessionToken = hashPassword(ADMIN_PASSWORD + '-' + new Date().toDateString());
    const cookieStore = await cookies();
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    return true;
  }
  return false;
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('admin_session')?.value;
  if (!sessionToken) return false;

  const expectedToken = hashPassword(ADMIN_PASSWORD + '-' + new Date().toDateString());
  // Also support matching yesterday's token in case the session crosses midnight
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const expectedTokenYesterday = hashPassword(ADMIN_PASSWORD + '-' + yesterday.toDateString());

  return sessionToken === expectedToken || sessionToken === expectedTokenYesterday;
}
