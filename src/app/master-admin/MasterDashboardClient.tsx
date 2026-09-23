'use client';

import React, { useState, useTransition } from 'react';
import { createTenantAction, updateTenantStatusAction, deleteTenantAction, masterLogoutAction, updateTenantThemeAction } from '@/app/actions-saas';
import { TenantRegistryItem } from '@/lib/db-saas';
import { Plus, Trash2, Sparkles, LogOut, ExternalLink, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WEDDING_THEMES } from '@/lib/themes';

interface ExtendedTenantRegistryItem extends TenantRegistryItem {
  theme_colors: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
  };
}

interface Props {
  registry: ExtendedTenantRegistryItem[];
  stats: {
    totalWeddings: number;
    totalRsvps: number;
    totalAttending: number;
    totalWishes: number;
  };
}

export default function MasterDashboardClient({ registry, stats }: Props) {
  const [couples, setCouples] = useState<ExtendedTenantRegistryItem[]>(registry);
  const [slug, setSlug] = useState('');
  const [coupleNames, setCoupleNames] = useState('');
  const [password, setPassword] = useState('');

  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const router = useRouter();

  const handleLogout = async () => {
    await masterLogoutAction();
    router.refresh();
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!slug.trim() || !coupleNames.trim() || !password.trim()) {
      setFormError('Please fill out all fields.');
      return;
    }

    startTransition(async () => {
      try {
        const res = await createTenantAction(slug, coupleNames, password);
        if (res.success) {
          setFormSuccess(`Wedding invitation "/wedding/${res.slug}" created successfully!`);
          setSlug('');
          setCoupleNames('');
          setPassword('');
          
          router.refresh();
          setCouples(prev => [
            ...prev,
            {
              slug: res.slug!,
              couple_names: coupleNames,
              password,
              status: 'active',
              created_at: new Date().toISOString(),
              theme_colors: { primary: "#800000", secondary: "#D4AF37", accent: "#9B111E", bg: "#FDFBF7" }
            }
          ]);
        } else {
          setFormError(res.error || 'Failed to create wedding invite.');
        }
      } catch (err) {
        console.error(err);
        setFormError('An error occurred. Please try again.');
      }
    });
  };

  const handleToggleStatus = (slugToToggle: string, currentStatus: 'active' | 'suspended') => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    startTransition(async () => {
      const res = await updateTenantStatusAction(slugToToggle, nextStatus);
      if (res.success) {
        setCouples(prev =>
          prev.map(c => (c.slug === slugToToggle ? { ...c, status: nextStatus } : c))
        );
        router.refresh();
      }
    });
  };

  const handleDelete = (slugToDelete: string) => {
    if (!confirm(`Are you absolutely sure you want to delete "${slugToDelete}"?\nThis will permanently delete their database file and all uploaded media.`)) return;

    startTransition(async () => {
      const res = await deleteTenantAction(slugToDelete);
      if (res.success) {
        setCouples(prev => prev.filter(c => c.slug !== slugToDelete));
        router.refresh();
      }
    });
  };

  const handleThemeChange = (slugToChange: string, selectedThemeId: string) => {
    const theme = WEDDING_THEMES.find(t => t.id === selectedThemeId);
    if (!theme) return;

    startTransition(async () => {
      const res = await updateTenantThemeAction(slugToChange, theme.colors);
      if (res.success) {
        setCouples(prev =>
          prev.map(c => (c.slug === slugToChange ? { ...c, theme_colors: theme.colors } : c))
        );
        router.refresh();
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-outfit select-none animate-fadeIn">
      {/* Top Navbar */}
      <header className="bg-[#1F080C] text-[#FDFBF7] border-b-2 border-[#D4AF37] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <h1 className="font-serif font-bold text-sm sm:text-base tracking-widest text-gold-metallic">
              SaaS WEDDING invitation SYSTEM
            </h1>
            <span className="text-[10px] bg-red-900/50 text-[#D4AF37] px-2 py-0.5 rounded-full border border-[#D4AF37]/30 uppercase font-bold tracking-wider hidden sm:inline-block">
              Super Admin
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 px-4 py-1.5 bg-[#800000] text-[#D4AF37] hover:bg-[#9B111E] border border-[#D4AF37]/30 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Panel Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Aggregated Stats Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-3xl font-extrabold text-[#800000]">{stats.totalWeddings}</span>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Total Weddings</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-3xl font-extrabold text-emerald-700">{stats.totalAttending}</span>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Attending Guests</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-3xl font-extrabold text-gray-900">{stats.totalRsvps}</span>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Total RSVPs</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-3xl font-extrabold text-amber-600">{stats.totalWishes}</span>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Blessings Left</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Couple Creator Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit">
            <h3 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center space-x-1.5 font-serif">
              <Plus className="w-5 h-5 text-[#800000]" />
              <span>Create Wedding Folder</span>
            </h3>

            {formError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4 mt-4 text-sm font-outfit">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Wedding Title Names</label>
                <input
                  type="text"
                  required
                  value={coupleNames}
                  onChange={e => setCoupleNames(e.target.value)}
                  placeholder="e.g., Aarav & Diya"
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">URL Slug identifier</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="e.g., aarav-diya"
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">Output: /wedding/{slug || 'slug'}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Admin Access Password</label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter login password"
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#800000] hover:bg-[#9B111E] text-[#D4AF37] font-bold py-3 rounded-xl border border-[#D4AF37]/30 shadow-md cursor-pointer transition-all duration-200 flex items-center justify-center space-x-1.5 text-sm mt-6"
              >
                {isPending ? (
                  <span className="animate-spin h-5 w-5 border-2 border-[#D4AF37] border-t-transparent rounded-full"></span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Initialize Wedding invite</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Couples Registry Management Table */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center space-x-1.5 font-serif mb-4">
                <Settings className="w-5 h-5 text-[#800000]" />
                <span>Wedding Folders Registry</span>
              </h3>

              {couples.length === 0 ? (
                <div className="text-center py-16 text-gray-400 italic">No registered couples found. Initialize your first invitation folder.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Couple Names / URL</th>
                        <th className="py-3 px-4">Passkey</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Theme Selection</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100 text-gray-700">
                      {couples.map(couple => {
                        const matchedTheme = WEDDING_THEMES.find(t => 
                          t.colors.primary.toLowerCase() === (couple.theme_colors?.primary || '').toLowerCase()
                        );
                        const activeThemeId = matchedTheme ? matchedTheme.id : 'custom';

                        return (
                          <tr key={couple.slug} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 px-4">
                              <span className="font-bold text-gray-900 block">{couple.couple_names}</span>
                              <a
                                href={`/wedding/${couple.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#800000] hover:text-[#9B111E] font-mono flex items-center space-x-0.5 mt-0.5"
                              >
                                <span>/wedding/{couple.slug}</span>
                                <ExternalLink className="w-3 h-3 inline" />
                              </a>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-mono text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">{couple.password}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase border ${
                                couple.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-red-50 text-red-800 border-red-200'
                              }`}>
                                {couple.status}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-1.5">
                                <span 
                                  className="w-3.5 h-3.5 rounded-full border border-gray-300 inline-block flex-shrink-0" 
                                  style={{ backgroundColor: couple.theme_colors?.primary || '#800000' }}
                                  title={`Primary Color: ${couple.theme_colors?.primary || '#800000'}`}
                                ></span>
                                <select
                                  value={activeThemeId}
                                  disabled={isPending}
                                  onChange={(e) => handleThemeChange(couple.slug, e.target.value)}
                                  className="text-xs border border-gray-300 rounded-xl px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] bg-[#FDFBF7] text-gray-800 font-medium cursor-pointer max-w-[150px] truncate"
                                >
                                  {activeThemeId === 'custom' && (
                                    <option value="custom">Custom Color Theme</option>
                                  )}
                                  {WEDDING_THEMES.map((theme) => (
                                    <option key={theme.id} value={theme.id}>
                                      {theme.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right space-x-2">
                              <a
                                href={`/admin/${couple.slug}/dashboard`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block py-1 px-2.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
                              >
                                Console
                              </a>
                              <button
                                onClick={() => handleToggleStatus(couple.slug, couple.status)}
                                className={`py-1 px-2 rounded text-xs font-bold border transition-colors cursor-pointer ${
                                  couple.status === 'active'
                                    ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200'
                                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200'
                                }`}
                              >
                                {couple.status === 'active' ? 'Suspend' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleDelete(couple.slug)}
                                className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                                title="Delete folder permanently"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
