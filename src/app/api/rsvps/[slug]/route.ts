import { NextRequest, NextResponse } from 'next/server';
import { getTenantDb } from '@/lib/db-saas';
import { isCoupleAuthenticated, isMasterAuthenticated } from '@/lib/auth-saas';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;

  const isAuth = await isCoupleAuthenticated(slug);
  const isMaster = await isMasterAuthenticated();
  if (!isAuth && !isMaster) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getTenantDb(slug);
  if (!db) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }
  
  return NextResponse.json(db.rsvps || []);
}
