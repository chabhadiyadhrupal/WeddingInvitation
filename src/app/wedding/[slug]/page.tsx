import React from 'react';
import { getRegistry, getTenantDb } from '@/lib/db-saas';
import PageContainer from '@/components/PageContainer';
import MandalaBackground from '@/components/MandalaBackground';
import ToranDecoration from '@/components/ToranDecoration';
import { Metadata } from 'next';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const db = await getTenantDb(slug);
  if (!db) {
    return {
      title: 'Invitation Not Found | લગ્ન પત્રિકા',
      description: 'The requested wedding invitation could not be found.',
    };
  }
  return {
    title: db.settings.seo_title || 'Wedding Invitation',
    description: db.settings.seo_description || 'You are cordially invited to celebrate with us.',
  };
}

export default async function DynamicWeddingPage(props: Props) {
  const { slug } = await props.params;
  
  const registry = await getRegistry();
  const tenant = registry.find(t => t.slug === slug);

  if (!tenant) {
    return (
      <div className="relative min-h-screen bg-[#FDFBF7] flex flex-col justify-center items-center px-4 text-center font-outfit select-none">
        <ToranDecoration />
        <MandalaBackground />
        <div className="royal-card max-w-md p-8 bg-[#FDFBF7]/95 relative z-10 border border-[#D4AF37]/30 shadow-xl">
          <span className="text-4xl text-[#800000] mb-4 block">🪔</span>
          <h1 className="text-2xl font-bold font-serif text-[#800000] mb-3">કોઈ કંકોતરી મળી નથી</h1>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            The wedding invitation page you are looking for does not exist or the link might be incorrect.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#800000] text-[#D4AF37] font-semibold text-xs py-2.5 px-6 rounded-full border border-[#D4AF37]/40 shadow hover:bg-[#9B111E] transition-all cursor-pointer"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (tenant.status === 'suspended') {
    return (
      <div className="relative min-h-screen bg-[#FDFBF7] flex flex-col justify-center items-center px-4 text-center font-outfit select-none">
        <ToranDecoration />
        <MandalaBackground />
        <div className="royal-card max-w-md p-8 bg-[#FDFBF7]/95 relative z-10 border border-[#D4AF37]/30 shadow-xl">
          <span className="text-4xl text-[#9B111E] mb-4 block">🚫</span>
          <h1 className="text-2xl font-bold font-serif text-[#800000] mb-3">આમંત્રણ મોકૂફ રાખેલ છે</h1>
          <p className="text-[#800000] text-sm font-semibold mb-3">Invitation Temporarily Suspended</p>
          <p className="text-gray-500 text-xs leading-relaxed mb-6">
            This wedding invitation has been temporarily suspended by the administrator. Please contact the couple or admin for more details.
          </p>
          <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mb-4"></div>
          <p className="text-[10px] text-gray-400">Gujarati Wedding Invitation SaaS Platform</p>
        </div>
      </div>
    );
  }

  const db = await getTenantDb(slug);
  if (!db) {
    return (
      <div className="relative min-h-screen bg-[#FDFBF7] flex flex-col justify-center items-center px-4 text-center font-outfit select-none">
        <ToranDecoration />
        <MandalaBackground />
        <div className="royal-card max-w-md p-8 bg-[#FDFBF7]/95 relative z-10 border border-[#D4AF37]/30 shadow-xl">
          <span className="text-4xl text-[#800000] mb-4 block">🪔</span>
          <h1 className="text-xl font-bold font-serif text-[#800000] mb-3">Error Loading Data</h1>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Failed to load wedding invitation data. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  // Filter only approved wishes for the wall
  const approvedWishes = (db.wishes || []).filter(wish => wish.approved === true);

  return (
    <PageContainer
      settings={db.settings}
      couple={db.couple}
      events={db.events || []}
      gallery={db.gallery || []}
      family={db.family || []}
      loveStory={db.love_story || []}
      wishes={approvedWishes}
      slug={slug}
    />
  );
}
