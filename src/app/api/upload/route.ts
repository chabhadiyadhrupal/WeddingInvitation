import { NextRequest, NextResponse } from 'next/server';
import { isMasterAuthenticated, isCoupleAuthenticated } from '@/lib/auth-saas';
import fs from 'fs/promises';
import path from 'path';
import { getRegistry } from '@/lib/db-saas';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  // Verify auth: master admin can upload anything, or a specific couple admin can upload for their own slug
  const isMaster = await isMasterAuthenticated();
  let isAuthorized = isMaster;

  if (!isAuthorized && slug) {
    const isCouple = await isCoupleAuthenticated(slug);
    if (isCouple) {
      isAuthorized = true;
    }
  }

  // Fallback: If no slug query param, inspect if there is any active couple session (e.g. from cookies)
  if (!isAuthorized) {
    const registry = await getRegistry();
    for (const tenant of registry) {
      if (await isCoupleAuthenticated(tenant.slug)) {
        isAuthorized = true;
        break;
      }
    }
  }

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string || 'images'; // 'images' or 'audio'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Define upload folders
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);
    
    // Ensure directories exist
    await fs.mkdir(uploadDir, { recursive: true });

    // Sanitize file name to avoid path traversal
    const safeName = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = path.join(uploadDir, safeName);

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Return local access path
    const fileUrl = `/uploads/${type}/${safeName}`;
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}
