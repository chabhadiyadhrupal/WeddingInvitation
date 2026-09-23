import fs from 'fs/promises';
import path from 'path';

export interface WeddingSettings {
  wedding_date: string;
  wedding_time: string;
  venue_name: string;
  venue_address: string;
  maps_link: string;
  music_url: string;
  music_autoplay: boolean;
  theme_colors: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
  };
  seo_title: string;
  seo_description: string;
  qr_code_enabled: boolean;
  cover_photo?: string;
  zoom_link?: string;
  youtube_link?: string;
  instagram_link?: string;
  gift_bank_name?: string;
  gift_account_number?: string;
  gift_account_name?: string;
  theme_layout?: 'traditional' | 'modern-slate';
}

export interface CoupleInfo {
  groom_name_en: string;
  groom_name_gu: string;
  groom_bio: string;
  groom_photo: string;
  bride_name_en: string;
  bride_name_gu: string;
  bride_bio: string;
  bride_photo: string;
  welcome_message: string;
}

export interface WeddingEvent {
  id: string;
  title_en: string;
  title_gu: string;
  date: string;
  time: string;
  venue: string;
  description_en: string;
  description_gu: string;
  icon: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  order: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  side: 'bride' | 'groom';
  photo: string;
}

export interface LoveStoryMilestone {
  id: string;
  title: string;
  date: string;
  description: string;
  photo: string;
}

export interface RSVP {
  id: string;
  name: string;
  phone: string;
  guests_count: number;
  attending: boolean;
  message: string;
  created_at: string;
}

export interface Wish {
  id: string;
  name: string;
  message: string;
  approved: boolean;
  created_at: string;
}

export interface DatabaseSchema {
  settings: WeddingSettings;
  couple: CoupleInfo;
  events: WeddingEvent[];
  gallery: GalleryItem[];
  family: FamilyMember[];
  love_story: LoveStoryMilestone[];
  rsvps: RSVP[];
  wishes: Wish[];
}

const DB_PATH = path.join(process.cwd(), 'src/data/db.json');

// Memory cache for quick reads
let dbCache: DatabaseSchema | null = null;

export async function getDb(): Promise<DatabaseSchema> {
  const firebaseUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;
  if (firebaseUrl) {
    try {
      const cleanUrl = firebaseUrl.endsWith('/') ? firebaseUrl.slice(0, -1) : firebaseUrl;
      const res = await fetch(`${cleanUrl}/db.json`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data) {
          dbCache = data;
          return dbCache!;
        }
      }
    } catch (e) {
      console.error("Firebase read error", e);
    }
  }

  // Try reading from file
  try {
    const fileContent = await fs.readFile(DB_PATH, 'utf-8');
    dbCache = JSON.parse(fileContent);
    return dbCache!;
  } catch (error) {
    console.error('Error reading database file, using fallback empty state:', error);
    // Return a default schema if file doesn't exist
    return {
      settings: {
        wedding_date: "2026-11-20",
        wedding_time: "10:00 AM",
        venue_name: "Venue Name",
        venue_address: "Venue Address",
        maps_link: "",
        music_url: "",
        music_autoplay: true,
        theme_colors: { primary: "#800000", secondary: "#D4AF37", accent: "#9B111E", bg: "#FDFBF7" },
        seo_title: "Wedding Invitation",
        seo_description: "Join us for our wedding",
        qr_code_enabled: true,
        cover_photo: "",
        zoom_link: "",
        youtube_link: "",
        instagram_link: "",
        gift_bank_name: "State Bank of India",
        gift_account_number: "1234567890",
        gift_account_name: "Aarav Patel",
        theme_layout: "traditional"
      },
      couple: {
        groom_name_en: "Groom", groom_name_gu: "વર", groom_bio: "", groom_photo: "",
        bride_name_en: "Bride", bride_name_gu: "કન્યા", bride_bio: "", bride_photo: "",
        welcome_message: ""
      },
      events: [],
      gallery: [],
      family: [],
      love_story: [],
      rsvps: [],
      wishes: []
    };
  }
}

export async function saveDb(data: DatabaseSchema): Promise<boolean> {
  dbCache = data;
  const firebaseUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;
  if (firebaseUrl) {
    try {
      const cleanUrl = firebaseUrl.endsWith('/') ? firebaseUrl.slice(0, -1) : firebaseUrl;
      const res = await fetch(`${cleanUrl}/db.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.ok;
    } catch (e) {
      console.error("Firebase write error", e);
      return false;
    }
  }

  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to database file:', error);
    return false;
  }
}
