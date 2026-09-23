import React from 'react';
import { getTenantDb } from '@/lib/db-saas';
import { notFound } from 'next/navigation';

// Import forms
import CoupleForm from '@/components/admin/CoupleForm';
import EventsForm from '@/components/admin/EventsForm';
import FamilyForm from '@/components/admin/FamilyForm';
import GalleryForm from '@/components/admin/GalleryForm';
import LoveStoryForm from '@/components/admin/LoveStoryForm';
import SettingsForm from '@/components/admin/SettingsForm';
import RsvpManagerSaas from '@/components/admin/RsvpManagerSaas';
import WishesModeratorSaas from '@/components/admin/WishesModeratorSaas';

interface Props {
  params: Promise<{ slug: string; module: string }>;
}

export default async function DashboardModulePage(props: Props) {
  const { slug, module } = await props.params;

  const db = await getTenantDb(slug);
  if (!db) {
    notFound();
  }

  switch (module) {
    case 'couple':
      return <CoupleForm initialCouple={db.couple} slug={slug} />;
    case 'events':
      return <EventsForm initialEvents={db.events || []} slug={slug} />;
    case 'family':
      return <FamilyForm initialFamily={db.family || []} slug={slug} />;
    case 'gallery':
      return <GalleryForm initialGallery={db.gallery || []} slug={slug} />;
    case 'love-story':
      return <LoveStoryForm initialLoveStory={db.love_story || []} slug={slug} />;
    case 'settings':
      return <SettingsForm initialSettings={db.settings} slug={slug} />;
    case 'rsvps':
      return <RsvpManagerSaas slug={slug} />;
    case 'wishes':
      return <WishesModeratorSaas slug={slug} initialWishes={db.wishes || []} />;
    default:
      notFound();
  }
}
