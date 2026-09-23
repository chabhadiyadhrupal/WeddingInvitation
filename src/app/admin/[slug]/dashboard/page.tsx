import React from 'react';
import { getTenantDb } from '@/lib/db-saas';
import { ClipboardList, Heart, Users, MessageSquareQuote, Calendar } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DashboardOverview(props: Props) {
  const { slug } = await props.params;
  const db = await getTenantDb(slug);
  if (!db) {
    notFound();
  }

  const totalRsvpsCount = db.rsvps?.length || 0;
  const attendingRsvps = db.rsvps?.filter(r => r.attending) || [];
  const totalAttendingGuests = attendingRsvps.reduce((acc, curr) => acc + (curr.guests_count || 1), 0);
  const totalDeclining = totalRsvpsCount - attendingRsvps.length;
  
  const pendingWishesCount = db.wishes?.filter(w => !w.approved).length || 0;
  const totalEventsCount = db.events?.length || 0;

  const stats = [
    { label: 'Total RSVPs Received', value: totalRsvpsCount, icon: <ClipboardList className="w-6 h-6 text-[#800000]" />, desc: 'Confirmation responses' },
    { label: 'Total Attending Guests', value: totalAttendingGuests, icon: <Users className="w-6 h-6 text-emerald-700" />, desc: 'Actual guest count sum' },
    { label: 'Declined Invites', value: totalDeclining, icon: <ClipboardList className="w-6 h-6 text-red-600" />, desc: 'Unable to attend' },
    { label: 'Pending Blessings', value: pendingWishesCount, icon: <MessageSquareQuote className="w-6 h-6 text-amber-600" />, desc: 'Needs moderation approval' },
  ];

  return (
    <div className="space-y-8 font-outfit select-none animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Dashboard Overview</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Wedding invitation summary statistics and metrics</p>
        </div>
        <a 
          href={`/wedding/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gold-metallic text-[#4A0E17] hover:bg-[#FFE89C] border border-[#D4AF37]/50 shadow font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer text-center"
        >
          View Public Invitation Front-end →
        </a>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-gray-100 flex-shrink-0">
              {stat.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links Grid */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">Quick Management Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link
            href={`/admin/${slug}/dashboard/couple`}
            className="p-5 bg-white border border-gray-200 hover:border-[#D4AF37]/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <span className="font-bold text-sm text-[#800000] flex items-center space-x-2">
              <Heart className="w-4 h-4 text-[#9B111E]" />
              <span>Groom & Bride Info</span>
            </span>
            <span className="text-[11px] text-gray-400 mt-2">Edit bios, photos, and welcome quotes</span>
          </Link>

          <Link
            href={`/admin/${slug}/dashboard/events`}
            className="p-5 bg-white border border-gray-200 hover:border-[#D4AF37]/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <span className="font-bold text-sm text-[#800000] flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#9B111E]" />
              <span>Events Schedule ({totalEventsCount})</span>
            </span>
            <span className="text-[11px] text-gray-400 mt-2">Manage Garba, Haldi, Lagna, Reception dates/venues</span>
          </Link>

          <Link
            href={`/admin/${slug}/dashboard/rsvps`}
            className="p-5 bg-white border border-gray-200 hover:border-[#D4AF37]/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <span className="font-bold text-sm text-[#800000] flex items-center space-x-2">
              <ClipboardList className="w-4 h-4 text-[#9B111E]" />
              <span>Guest RSVPs ({totalRsvpsCount})</span>
            </span>
            <span className="text-[11px] text-gray-400 mt-2">View guest presence details and export CSV</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
