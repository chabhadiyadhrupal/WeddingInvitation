import { cookies } from 'next/headers';
import crypto from 'crypto';
import { getRegistry } from './db-saas';

const JWT_SECRET = process.env.JWT_SECRET || 'wedding-invitation-secret-token-key-2026';
const MASTER_PASSWORD = process.env.MASTER_PASSWORD || 'masterwedding2026';

export function hashPassword(password: string): string {
  return crypto.createHmac('sha256', JWT_SECRET).update(password).digest('hex');
}

// Master Admin Auth
export async function loginMasterAdmin(password: string): Promise<boolean> {
  if (password === MASTER_PASSWORD) {
    const sessionToken = hashPassword(MASTER_PASSWORD + '-' + new Date().toDateString());
    const cookieStore = await cookies();
    cookieStore.set('master_session', sessionToken, {
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

export async function logoutMasterAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('master_session');
}

export async function isMasterAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('master_session')?.value;
  if (!sessionToken) return false;

  const expectedToken = hashPassword(MASTER_PASSWORD + '-' + new Date().toDateString());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const expectedTokenYesterday = hashPassword(MASTER_PASSWORD + '-' + yesterday.toDateString());

  return sessionToken === expectedToken || sessionToken === expectedTokenYesterday;
}

// Couple Admin Auth per slug
export async function loginCoupleAdmin(slug: string, password: string): Promise<boolean> {
  const registry = await getRegistry();
  const tenant = registry.find(t => t.slug === slug);
  if (!tenant || tenant.status === 'suspended') return false;

  // Supports plain text comparison for seeding, or hashed.
  const isMatch = password === tenant.password || hashPassword(password) === tenant.password;
  if (isMatch) {
    const sessionToken = hashPassword(slug + '-' + tenant.password + '-' + new Date().toDateString());
    const cookieStore = await cookies();
    cookieStore.set(`couple_session_${slug}`, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: `/`,
    });
    return true;
  }
  return false;
}

export async function logoutCoupleAdmin(slug: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(`couple_session_${slug}`);
}

export async function isCoupleAuthenticated(slug: string): Promise<boolean> {
  const registry = await getRegistry();
  const tenant = registry.find(t => t.slug === slug);
  if (!tenant || tenant.status === 'suspended') return false;

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(`couple_session_${slug}`)?.value;
  if (!sessionToken) return false;

  const expectedToken = hashPassword(slug + '-' + tenant.password + '-' + new Date().toDateString());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const expectedTokenYesterday = hashPassword(slug + '-' + tenant.password + '-' + yesterday.toDateString());

  return sessionToken === expectedToken || sessionToken === expectedTokenYesterday;
}
