import React from 'react';
import { isCoupleAuthenticated, isMasterAuthenticated } from '@/lib/auth-saas';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  Image, 
  BookHeart, 
  HeartHandshake, 
  ClipboardList, 
  MessageSquareQuote, 
  Settings2, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { coupleLogoutAction } from '@/app/actions-saas';
import { getRegistry } from '@/lib/db-saas';

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { slug } = await params;

  // Server-side Route Guard: allows couple session or master session
  const isAuth = await isCoupleAuthenticated(slug);
  const isMaster = await isMasterAuthenticated();

  if (!isAuth && !isMaster) {
    redirect(`/admin/${slug}/login`);
  }

  const registry = await getRegistry();
  const tenant = registry.find(t => t.slug === slug);
  const coupleNameLabel = tenant ? tenant.couple_names : 'Wedding Console';

  // Logout server action callback
  const handleLogout = async () => {
    'use server';
    await coupleLogoutAction(slug);
    redirect(`/admin/${slug}/login`);
  };

  const navItems = [
    { href: `/admin/${slug}/dashboard`, label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: `/admin/${slug}/dashboard/couple`, label: 'Couple Info', icon: <BookHeart className="w-4 h-4" /> },
    { href: `/admin/${slug}/dashboard/events`, label: 'Events Schedule', icon: <CalendarDays className="w-4 h-4" /> },
    { href: `/admin/${slug}/dashboard/gallery`, label: 'Gallery', icon: <Image className="w-4 h-4" /> },
    { href: `/admin/${slug}/dashboard/family`, label: 'Family Members', icon: <Users className="w-4 h-4" /> },
    { href: `/admin/${slug}/dashboard/love-story`, label: 'Love Story', icon: <HeartHandshake className="w-4 h-4" /> },
    { href: `/admin/${slug}/dashboard/rsvps`, label: 'RSVP Manager', icon: <ClipboardList className="w-4 h-4" /> },
    { href: `/admin/${slug}/dashboard/wishes`, label: 'Blessings Wall', icon: <MessageSquareQuote className="w-4 h-4" /> },
    { href: `/admin/${slug}/dashboard/settings`, label: 'SEO & Theme', icon: <Settings2 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-outfit select-none animate-fadeIn">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#1F080C] text-[#FDFBF7] flex-shrink-0 flex flex-col justify-between border-r-2 border-[#D4AF37]">
        <div>
          {/* Dashboard Logo/Header */}
          <div className="h-16 border-b border-[#D4AF37]/20 flex items-center justify-center space-x-2 px-6">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <span className="font-bold text-sm text-gold-metallic tracking-wider uppercase font-serif text-center truncate max-w-[180px]">
              {coupleNameLabel}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold text-amber-100/70 hover:text-amber-100 hover:bg-[#800000]/60 border border-transparent hover:border-[#D4AF37]/20 transition-all duration-200"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-[#D4AF37]/20 flex flex-col gap-2">
          {isMaster && (
            <Link
              href="/master-admin"
              className="text-center w-full text-[10px] text-amber-200/50 hover:text-gold-metallic transition-colors"
            >
              ← Back to Master Admin
            </Link>
          )}
          <form action={handleLogout}>
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-[#800000] text-[#D4AF37] hover:bg-[#9B111E] border border-[#D4AF37]/30 transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
