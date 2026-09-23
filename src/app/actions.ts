'use server';

import { getDb, saveDb, RSVP, Wish, WeddingSettings, CoupleInfo, WeddingEvent, GalleryItem, FamilyMember, LoveStoryMilestone } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

/* ==========================================
   PUBLIC ACTIONS
   ========================================== */

// Submit RSVP
export async function submitRSVP(data: Omit<RSVP, 'id' | 'created_at'>) {
  const db = await getDb();
  const newRsvp: RSVP = {
    ...data,
    id: 'rsvp-' + generateId(),
    created_at: new Date().toISOString()
  };
  
  db.rsvps.push(newRsvp);
  await saveDb(db);
  revalidatePath('/');
  return { success: true, message: 'RSVP submitted successfully!' };
}

// Submit a Blessing/Wish
export async function submitWish(data: { name: string; message: string }) {
  const db = await getDb();
  const newWish: Wish = {
    id: 'wish-' + generateId(),
    name: data.name,
    message: data.message,
    approved: false, // Must be approved by admin
    created_at: new Date().toISOString()
  };
  
  db.wishes.push(newWish);
  await saveDb(db);
  return { success: true, message: 'Thank you for your blessings! It will appear on the wall once approved.' };
}

/* ==========================================
   ADMIN ACTIONS (AUTHENTICATED)
   ========================================== */

// Update Settings
export async function updateSettings(settings: WeddingSettings) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');
  const db = await getDb();
  db.settings = settings;
  await saveDb(db);
  revalidatePath('/');
  return { success: true };
}

// Update Couple Info
export async function updateCouple(couple: CoupleInfo) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');
  const db = await getDb();
  db.couple = couple;
  await saveDb(db);
  revalidatePath('/');
  return { success: true };
}

// Add/Update/Delete Events
export async function saveEvent(event: WeddingEvent) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');
  const db = await getDb();
  const index = db.events.findIndex(e => e.id === event.id);
  
  if (index >= 0) {
    db.events[index] = event;
  } else {
    db.events.push({
      ...event,
      id: event.id || 'event-' + generateId()
    });
  }
  
  await saveDb(db);
  revalidatePath('/');
  return { success: true };
}

export async function deleteEvent(id: string) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');
  const db = await getDb();
  db.events = db.events.filter(e => e.id !== id);
  await saveDb(db);
  revalidatePath('/');
  return { success: true };
}

// Add/Delete Gallery Image
export async function saveGalleryItem(item: Omit<GalleryItem, 'id' | 'order'> & { id?: string; order?: number }) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');
  const db = await getDb();
  
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
  
  await saveDb(db);
  revalidatePath('/');
  return { success: true };
}

export async function deleteGalleryItem(id: string) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');
  const db = await getDb();
  db.gallery = db.gallery.filter(g => g.id !== id);
  // Re-adjust ordering
  db.gallery = db.gallery.map((g, idx) => ({ ...g, order: idx + 1 }));
  await saveDb(db);
  revalidatePath('/');
  return { success: true };
}

export async function reorderGallery(orderedIds: string[]) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');
  const db = await getDb();
  const reordered: GalleryItem[] = [];
  
  orderedIds.forEach((id, idx) => {
    const item = db.gallery.find(g => g.id === id);
    if (item) {
      reordered.push({ ...item, order: idx + 1 });
    }
  });
  
  // Append any items that were left out (safeguard)
  db.gallery.forEach(item => {
    if (!orderedIds.includes(item.id)) {
      reordered.push({ ...item, order: reordered.length + 1 });
    }
  });

  db.gallery = reordered;
  await saveDb(db);
  revalidatePath('/');
  return { success: true };
}

// Add/Update/Delete Family Member
export async function saveFamilyMember(member: FamilyMember) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');
  const db = await getDb();
  const index = db.family.findIndex(f => f.id === member.id);
  
  if (index >= 0) {
    db.family[index] = member;
  } else {
    db.family.push({
      ...member,
      id: member.id || 'fam-' + generateId()
    });
  }
  
  await saveDb(db);
  revalidatePath('/');
  return { success: true };
}

export async function deleteFamilyMember(id: string) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');
  const db = await getDb();
  db.family = db.family.filter(f => f.id !== id);
  await saveDb(db);
  revalidatePath('/');
  return { success: true };
}

// Add/Update/Delete Love Story Milestone
export async function saveLoveStory(milestone: LoveStoryMilestone) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');
  const db = await getDb();
  const index = db.love_story.findIndex(l => l.id === milestone.id);
  
  if (index >= 0) {
    db.love_story[index] = milestone;
  } else {
    db.love_story.push({
      ...milestone,
      id: milestone.id || 'story-' + generateId()
    });
  }
  
  await saveDb(db);
  revalidatePath('/');
  return { success: true };
}

export async function deleteLoveStory(id: string) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');
  const db = await getDb();
  db.love_story = db.love_story.filter(l => l.id !== id);
  await saveDb(db);
  revalidatePath('/');
  return { success: true };
}

// Approve/Delete Wishes (Blessings)
export async function approveWish(id: string, approved: boolean = true) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');
  const db = await getDb();
  const index = db.wishes.findIndex(w => w.id === id);
  if (index >= 0) {
    db.wishes[index].approved = approved;
    await saveDb(db);
    revalidatePath('/');
  }
  return { success: true };
}

export async function deleteWish(id: string) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');
  const db = await getDb();
  db.wishes = db.wishes.filter(w => w.id !== id);
  await saveDb(db);
  revalidatePath('/');
  return { success: true };
}

// Delete RSVP
export async function deleteRSVP(id: string) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');
  const db = await getDb();
  db.rsvps = db.rsvps.filter(r => r.id !== id);
  await saveDb(db);
  revalidatePath('/admin/dashboard/rsvps');
  return { success: true };
}

// Admin Auth actions
import { loginAdmin, logoutAdmin } from '@/lib/auth';

export async function adminLoginAction(password: string) {
  const success = await loginAdmin(password);
  return { success };
}

export async function adminLogoutAction() {
  await logoutAdmin();
  return { success: true };
}

