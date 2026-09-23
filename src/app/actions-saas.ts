'use server';

import { getRegistry, saveRegistry, getTenantDb, saveTenantDb, deleteTenantDb, getDefaultTenantSchema, TenantRegistryItem } from '@/lib/db-saas';
import { isCoupleAuthenticated, isMasterAuthenticated, loginCoupleAdmin, logoutCoupleAdmin, loginMasterAdmin, logoutMasterAdmin, hashPassword } from '@/lib/auth-saas';
import { RSVP, Wish, WeddingSettings, CoupleInfo, WeddingEvent, GalleryItem, FamilyMember, LoveStoryMilestone } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const generateId = () => Math.random().toString(36).substring(2, 9);

/* ==========================================
   PUBLIC TENANT ACTIONS
   ========================================== */

export async function submitRSVPSaas(slug: string, data: Omit<RSVP, 'id' | 'created_at'>) {
  const db = await getTenantDb(slug);
  if (!db) return { success: false, error: 'Wedding invitation not found.' };

  // Enforce a maximum guest RSVP count limit of 500 for normal tenants
  if (db.rsvps && db.rsvps.length >= 500) {
    return { success: false, error: 'RSVP guest limit reached for this invitation. Please contact the couple.' };
  }

  const newRsvp: RSVP = {
    ...data,
    id: 'rsvp-' + generateId(),
    created_at: new Date().toISOString()
  };
  
  if (!db.rsvps) db.rsvps = [];
  db.rsvps.push(newRsvp);
  await saveTenantDb(slug, db);
  revalidatePath(`/wedding/${slug}`);
  return { success: true, message: 'RSVP submitted successfully!' };
}

export async function submitWishSaas(slug: string, data: { name: string; message: string }) {
  const db = await getTenantDb(slug);
  if (!db) return { success: false, error: 'Wedding invitation not found.' };

  const newWish: Wish = {
    id: 'wish-' + generateId(),
    name: data.name,
    message: data.message,
    approved: false, // Must be approved by admin
    created_at: new Date().toISOString()
  };
  
  if (!db.wishes) db.wishes = [];
  db.wishes.push(newWish);
  await saveTenantDb(slug, db);
  return { success: true, message: 'Thank you for your blessings! It will appear on the wall once approved.' };
}

/* ==========================================
   COUPLE ADMIN ACTIONS (AUTHENTICATED)
   ========================================== */

async function checkCoupleAuth(slug: string) {
  const isAuth = await isCoupleAuthenticated(slug);
  const isMaster = await isMasterAuthenticated();
  if (!isAuth && !isMaster) {
    throw new Error('Unauthorized');
  }
}

export async function updateSettingsSaas(slug: string, settings: WeddingSettings) {
  await checkCoupleAuth(slug);
  const db = await getTenantDb(slug);
  if (!db) throw new Error('Tenant DB not found');
  
  db.settings = settings;
  await saveTenantDb(slug, db);
  revalidatePath(`/wedding/${slug}`);
  revalidatePath(`/admin/${slug}/dashboard`);
  return { success: true };
}

export async function updateCoupleSaas(slug: string, couple: CoupleInfo) {
  await checkCoupleAuth(slug);
  const db = await getTenantDb(slug);
  if (!db) throw new Error('Tenant DB not found');

  db.couple = couple;
  await saveTenantDb(slug, db);
  revalidatePath(`/wedding/${slug}`);
  revalidatePath(`/admin/${slug}/dashboard`);
  return { success: true };
}

export async function saveEventSaas(slug: string, event: WeddingEvent) {
  await checkCoupleAuth(slug);
  const db = await getTenantDb(slug);
  if (!db) throw new Error('Tenant DB not found');

  if (!db.events) db.events = [];
  const index = db.events.findIndex(e => e.id === event.id);
  
  if (index >= 0) {
    db.events[index] = event;
  } else {
    db.events.push({
      ...event,
      id: event.id || 'event-' + generateId()
    });
  }
  
  await saveTenantDb(slug, db);
  revalidatePath(`/wedding/${slug}`);
  revalidatePath(`/admin/${slug}/dashboard`);
  return { success: true };
}

export async function deleteEventSaas(slug: string, id: string) {
  await checkCoupleAuth(slug);
  const db = await getTenantDb(slug);
  if (!db) throw new Error('Tenant DB not found');

  db.events = (db.events || []).filter(e => e.id !== id);
  await saveTenantDb(slug, db);
  revalidatePath(`/wedding/${slug}`);
  revalidatePath(`/admin/${slug}/dashboard`);
  return { success: true };
}

export async function saveGalleryItemSaas(slug: string, item: Omit<GalleryItem, 'id' | 'order'> & { id?: string; order?: number }) {
  await checkCoupleAuth(slug);
  const db = await getTenantDb(slug);
  if (!db) throw new Error('Tenant DB not found');

  if (!db.gallery) db.gallery = [];
  
  if (item.id) {
    const index = db.gallery.findIndex(g => g.id === item.id);
    if (index >= 0) {
      db.gallery[index] = { ...db.gallery[index], ...item } as GalleryItem;
    }
  } else {
    db.gallery.push({
      id: 'img-' + generateId(),
      url: item.url,
      caption: item.caption,
      order: db.gallery.length + 1
    });
  }
  
  await saveTenantDb(slug, db);
  revalidatePath(`/wedding/${slug}`);
  revalidatePath(`/admin/${slug}/dashboard`);
  return { success: true };
}

export async function deleteGalleryItemSaas(slug: string, id: string) {
  await checkCoupleAuth(slug);
  const db = await getTenantDb(slug);
  if (!db) throw new Error('Tenant DB not found');

  db.gallery = (db.gallery || []).filter(g => g.id !== id);
  // Re-adjust ordering
  db.gallery = db.gallery.map((g, idx) => ({ ...g, order: idx + 1 }));
  await saveTenantDb(slug, db);
  revalidatePath(`/wedding/${slug}`);
  revalidatePath(`/admin/${slug}/dashboard`);
  return { success: true };
}

export async function reorderGallerySaas(slug: string, orderedIds: string[]) {
  await checkCoupleAuth(slug);
  const db = await getTenantDb(slug);
  if (!db) throw new Error('Tenant DB not found');

  const reordered: GalleryItem[] = [];
  const gallery = db.gallery || [];
  
  orderedIds.forEach((id, idx) => {
    const item = gallery.find(g => g.id === id);
    if (item) {
      reordered.push({ ...item, order: idx + 1 });
    }
  });
  
  // Append any items that were left out
  gallery.forEach(item => {
    if (!orderedIds.includes(item.id)) {
      reordered.push({ ...item, order: reordered.length + 1 });
    }
  });

  db.gallery = reordered;
  await saveTenantDb(slug, db);
  revalidatePath(`/wedding/${slug}`);
  revalidatePath(`/admin/${slug}/dashboard`);
  return { success: true };
}

export async function saveFamilyMemberSaas(slug: string, member: FamilyMember) {
  await checkCoupleAuth(slug);
  const db = await getTenantDb(slug);
  if (!db) throw new Error('Tenant DB not found');

  if (!db.family) db.family = [];
  const index = db.family.findIndex(f => f.id === member.id);
  
  if (index >= 0) {
    db.family[index] = member;
  } else {
    db.family.push({
      ...member,
      id: member.id || 'fam-' + generateId()
    });
  }
  
  await saveTenantDb(slug, db);
  revalidatePath(`/wedding/${slug}`);
  revalidatePath(`/admin/${slug}/dashboard`);
  return { success: true };
}

export async function deleteFamilyMemberSaas(slug: string, id: string) {
  await checkCoupleAuth(slug);
  const db = await getTenantDb(slug);
  if (!db) throw new Error('Tenant DB not found');

  db.family = (db.family || []).filter(f => f.id !== id);
  await saveTenantDb(slug, db);
  revalidatePath(`/wedding/${slug}`);
  revalidatePath(`/admin/${slug}/dashboard`);
  return { success: true };
}

export async function saveLoveStorySaas(slug: string, milestone: LoveStoryMilestone) {
  await checkCoupleAuth(slug);
  const db = await getTenantDb(slug);
  if (!db) throw new Error('Tenant DB not found');

  if (!db.love_story) db.love_story = [];
  const index = db.love_story.findIndex(l => l.id === milestone.id);
  
  if (index >= 0) {
    db.love_story[index] = milestone;
  } else {
    db.love_story.push({
      ...milestone,
      id: milestone.id || 'story-' + generateId()
    });
  }
  
  await saveTenantDb(slug, db);
  revalidatePath(`/wedding/${slug}`);
  revalidatePath(`/admin/${slug}/dashboard`);
  return { success: true };
}

export async function deleteLoveStorySaas(slug: string, id: string) {
  await checkCoupleAuth(slug);
  const db = await getTenantDb(slug);
  if (!db) throw new Error('Tenant DB not found');

  db.love_story = (db.love_story || []).filter(l => l.id !== id);
  await saveTenantDb(slug, db);
  revalidatePath(`/wedding/${slug}`);
  revalidatePath(`/admin/${slug}/dashboard`);
  return { success: true };
}

export async function approveWishSaas(slug: string, id: string, approved: boolean = true) {
  await checkCoupleAuth(slug);
  const db = await getTenantDb(slug);
  if (!db) throw new Error('Tenant DB not found');

  if (!db.wishes) db.wishes = [];
  const index = db.wishes.findIndex(w => w.id === id);
  if (index >= 0) {
    db.wishes[index].approved = approved;
    await saveTenantDb(slug, db);
    revalidatePath(`/wedding/${slug}`);
    revalidatePath(`/admin/${slug}/dashboard`);
  }
  return { success: true };
}

export async function deleteWishSaas(slug: string, id: string) {
  await checkCoupleAuth(slug);
  const db = await getTenantDb(slug);
  if (!db) throw new Error('Tenant DB not found');

  db.wishes = (db.wishes || []).filter(w => w.id !== id);
  await saveTenantDb(slug, db);
  revalidatePath(`/wedding/${slug}`);
  revalidatePath(`/admin/${slug}/dashboard`);
  return { success: true };
}

export async function deleteRSVPSaas(slug: string, id: string) {
  await checkCoupleAuth(slug);
  const db = await getTenantDb(slug);
  if (!db) throw new Error('Tenant DB not found');

  db.rsvps = (db.rsvps || []).filter(r => r.id !== id);
  await saveTenantDb(slug, db);
  revalidatePath(`/wedding/${slug}`);
  revalidatePath(`/admin/${slug}/dashboard`);
  return { success: true };
}

export async function coupleLoginAction(slug: string, password: string) {
  const success = await loginCoupleAdmin(slug, password);
  return { success };
}

export async function coupleLogoutAction(slug: string) {
  await logoutCoupleAdmin(slug);
  return { success: true };
}

/* ==========================================
   MASTER SUPER ADMIN ACTIONS
   ========================================== */

export async function masterLoginAction(password: string) {
  const success = await loginMasterAdmin(password);
  return { success };
}

export async function masterLogoutAction() {
  await logoutMasterAdmin();
  return { success: true };
}

export async function createTenantAction(slug: string, coupleNames: string, password: string) {
  if (!(await isMasterAuthenticated())) throw new Error('Unauthorized');
  
  const sanitizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
  if (!sanitizedSlug) {
    return { success: false, error: 'Invalid invitation slug name.' };
  }

  const registry = await getRegistry();
  if (registry.some(t => t.slug === sanitizedSlug)) {
    return { success: false, error: 'This wedding URL slug already exists.' };
  }

  // Create Registry Item
  const newTenant: TenantRegistryItem = {
    slug: sanitizedSlug,
    couple_names: coupleNames,
    password: password, // Store password (plaintext or hashed)
    status: 'active',
    created_at: new Date().toISOString()
  };

  registry.push(newTenant);
  await saveRegistry(registry);

  // Initialize tenant DB schema file
  const defaultDb = getDefaultTenantSchema(coupleNames);
  await saveTenantDb(sanitizedSlug, defaultDb);

  revalidatePath('/master-admin');
  return { success: true, slug: sanitizedSlug };
}

export async function updateTenantStatusAction(slug: string, status: 'active' | 'suspended') {
  if (!(await isMasterAuthenticated())) throw new Error('Unauthorized');

  const registry = await getRegistry();
  const index = registry.findIndex(t => t.slug === slug);
  if (index >= 0) {
    registry[index].status = status;
    await saveRegistry(registry);
    revalidatePath('/master-admin');
    revalidatePath(`/wedding/${slug}`);
    return { success: true };
  }
  return { success: false, error: 'Tenant not found.' };
}

export async function updateTenantThemeAction(slug: string, themeColors: { primary: string; secondary: string; accent: string; bg: string }) {
  if (!(await isMasterAuthenticated())) throw new Error('Unauthorized');
  const db = await getTenantDb(slug);
  if (!db) return { success: false, error: 'Tenant DB not found' };

  db.settings.theme_colors = themeColors;
  await saveTenantDb(slug, db);
  revalidatePath(`/wedding/${slug}`);
  revalidatePath('/master-admin');
  return { success: true };
}

export async function deleteTenantAction(slug: string) {
  if (!(await isMasterAuthenticated())) throw new Error('Unauthorized');

  let registry = await getRegistry();
  const exists = registry.some(t => t.slug === slug);
  if (exists) {
    registry = registry.filter(t => t.slug !== slug);
    await saveRegistry(registry);
    await deleteTenantDb(slug);
    revalidatePath('/master-admin');
    return { success: true };
  }
  return { success: false, error: 'Tenant not found.' };
}
