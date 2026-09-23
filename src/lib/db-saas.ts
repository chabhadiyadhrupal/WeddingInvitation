import fs from 'fs/promises';
import path from 'path';
import { DatabaseSchema } from './db';

export interface TenantRegistryItem {
  slug: string;
  couple_names: string;
  password: string; // Plaintext or hashed password
  status: 'active' | 'suspended';
  created_at: string;
}

const REGISTRY_PATH = path.join(process.cwd(), 'src/data/registry.json');
const TENANTS_DIR = path.join(process.cwd(), 'src/data/tenants');

let registryCache: TenantRegistryItem[] | null = null;
const tenantCache: Record<string, DatabaseSchema> = {};

export async function getRegistry(): Promise<TenantRegistryItem[]> {
  const firebaseUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;
  if (firebaseUrl) {
    try {
      const cleanUrl = firebaseUrl.endsWith('/') ? firebaseUrl.slice(0, -1) : firebaseUrl;
      const res = await fetch(`${cleanUrl}/registry.json`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data) {
          registryCache = data;
          return registryCache || [];
        }
      }
    } catch (e) {
      console.warn("Firebase registry read error", e);
    }
  }

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const content = await fs.readFile(REGISTRY_PATH, 'utf-8');
      if (!content.trim()) {
        throw new Error('Empty registry file');
      }
      const registry = JSON.parse(content);
      registryCache = registry;
      return registry || [];
    } catch (error) {
      console.warn(`Attempt ${attempt} to read registry failed:`, error);
      if (attempt < 3) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
  }
  if (registryCache) {
    console.log('Returning cached registry fallback after failed read attempts.');
    return registryCache;
  }
  return [];
}

export async function saveRegistry(registry: TenantRegistryItem[]): Promise<boolean> {
  registryCache = registry;
  const firebaseUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;
  if (firebaseUrl) {
    try {
      const cleanUrl = firebaseUrl.endsWith('/') ? firebaseUrl.slice(0, -1) : firebaseUrl;
      const res = await fetch(`${cleanUrl}/registry.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registry)
      });
      return res.ok;
    } catch (e) {
      console.error("Firebase registry write error", e);
      return false;
    }
  }

  try {
    await fs.mkdir(path.dirname(REGISTRY_PATH), { recursive: true });
    const tmpPath = REGISTRY_PATH + '.tmp';
    await fs.writeFile(tmpPath, JSON.stringify(registry, null, 2), 'utf-8');
    await fs.rename(tmpPath, REGISTRY_PATH);
    return true;
  } catch (error) {
    console.error('Error saving registry:', error);
    return false;
  }
}

export async function getTenantDb(slug: string): Promise<DatabaseSchema | null> {
  const firebaseUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;
  if (firebaseUrl) {
    try {
      const cleanUrl = firebaseUrl.endsWith('/') ? firebaseUrl.slice(0, -1) : firebaseUrl;
      const res = await fetch(`${cleanUrl}/tenants/${slug}.json`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data) {
          tenantCache[slug] = data;
          return data;
        }
      }
    } catch (e) {
      console.warn(`Firebase tenant read error for ${slug}`, e);
    }
  }

  const tenantPath = path.join(TENANTS_DIR, `${slug}.json`);
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const content = await fs.readFile(tenantPath, 'utf-8');
      if (!content.trim()) {
        throw new Error(`Empty database file for ${slug}`);
      }
      const data = JSON.parse(content);
      tenantCache[slug] = data;
      return data;
    } catch (error) {
      console.warn(`Attempt ${attempt} to read tenant DB for ${slug} failed:`, error);
      if (attempt < 3) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
  }
  return tenantCache[slug] || null;
}

export async function saveTenantDb(slug: string, data: DatabaseSchema): Promise<boolean> {
  tenantCache[slug] = data;
  const firebaseUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;
  if (firebaseUrl) {
    try {
      const cleanUrl = firebaseUrl.endsWith('/') ? firebaseUrl.slice(0, -1) : firebaseUrl;
      const res = await fetch(`${cleanUrl}/tenants/${slug}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.ok;
    } catch (e) {
      console.error(`Firebase tenant write error for ${slug}`, e);
      return false;
    }
  }

  try {
    const tenantPath = path.join(TENANTS_DIR, `${slug}.json`);
    await fs.mkdir(TENANTS_DIR, { recursive: true });
    const tmpPath = tenantPath + '.tmp';
    await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
    await fs.rename(tmpPath, tenantPath);
    return true;
  } catch (error) {
    console.error(`Error saving tenant DB for ${slug}:`, error);
    return false;
  }
}

export async function deleteTenantDb(slug: string): Promise<boolean> {
  if (tenantCache[slug]) {
    delete tenantCache[slug];
  }

  const firebaseUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;
  if (firebaseUrl) {
    try {
      const cleanUrl = firebaseUrl.endsWith('/') ? firebaseUrl.slice(0, -1) : firebaseUrl;
      const res = await fetch(`${cleanUrl}/tenants/${slug}.json`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (e) {
      console.error(`Firebase tenant delete error for ${slug}`, e);
      return false;
    }
  }

  try {
    const tenantPath = path.join(TENANTS_DIR, `${slug}.json`);
    await fs.unlink(tenantPath);
    return true;
  } catch (error) {
    console.error(`Error deleting tenant DB for ${slug}:`, error);
    return false;
  }
}

export function getDefaultTenantSchema(coupleNames: string): DatabaseSchema {
  const [groom = 'Groom', bride = 'Bride'] = coupleNames.split('&').map(s => s.trim());
  return {
    settings: {
      wedding_date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 120 days from now
      wedding_time: "10:00 AM",
      venue_name: "Gokul Farm & Party Plot",
      venue_address: "Lambhvel Road, Anand - 388001, Gujarat, India",
      maps_link: "https://maps.app.goo.gl/abcdefg",
      music_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      music_autoplay: true,
      theme_colors: { primary: "#2D3748", secondary: "#718096", accent: "#4A5568", bg: "#F7FAFC" },
      seo_title: `${groom} & ${bride}'s Wedding Invitation | લગ્ન કંકોતરી`,
      seo_description: `We cordially invite you to celebrate the wedding of ${groom} and ${bride}. Join us for a beautiful celebration of traditional Gujarati culture.`,
      qr_code_enabled: true,
      cover_photo: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000",
      zoom_link: "https://zoom.us/j/1234567890",
      youtube_link: "https://youtube.com/live/abcdefghijk",
      instagram_link: "https://instagram.com/couple_wedding_live",
      gift_bank_name: "HDFC Bank",
      gift_account_number: "50100234567890",
      gift_account_name: `${groom} Patel & ${bride} Shah`,
      theme_layout: "modern-slate"
    },
    couple: {
      groom_name_en: `${groom} Patel`, groom_name_gu: groom, groom_bio: "A wonderful groom.", groom_photo: "",
      bride_name_en: `${bride} Shah`, bride_name_gu: bride, bride_bio: "A beautiful bride.", bride_photo: "",
      welcome_message: "જય શ્રી ગણેશ. We invite you to join us as we celebrate our love and begin this beautiful journey together."
    },
    events: [
      {
        id: "event-1",
        title_en: "Sangeet & Garba Night",
        title_gu: "રાસ ગરબા",
        date: new Date(Date.now() + 119 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: "07:00 PM",
        venue: "Gokul Farm, Anand",
        description_en: "Join us for an evening of music, dance, and traditional Gujarati Garba.",
        description_gu: "ઢોલના ધબકારે ટ્રેડિશનલ ગરબા અને દાંડિયાની ધમાકેદાર સાંજ.",
        icon: "music"
      },
      {
        id: "event-2",
        title_en: "Wedding Ceremony",
        title_gu: "હસ્તમેળાપ અને મંગલ ફેરા",
        date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: "10:00 AM",
        venue: "Gokul Farm, Anand",
        description_en: "Witness the sacred wedding vows and Mangal Fera.",
        description_gu: "વૈદિક મંત્રોચ્ચાર વચ્ચે પવિત્ર અગ્નિની સાક્ષીએ મંગલ ફેરાની દિવ્ય વિધિ.",
        icon: "heart"
      }
    ],
    gallery: [],
    family: [],
    love_story: [],
    rsvps: [],
    wishes: []
  };
}
