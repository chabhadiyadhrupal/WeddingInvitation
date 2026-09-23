import React from 'react';
import { isMasterAuthenticated } from '@/lib/auth-saas';
import { getRegistry, getTenantDb, TenantRegistryItem } from '@/lib/db-saas';
import MasterLoginClient from './MasterLoginClient';
import MasterDashboardClient from './MasterDashboardClient';

export const dynamic = 'force-dynamic';

interface ExtendedTenantRegistryItem extends TenantRegistryItem {
  theme_colors: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
  };
}

export default async function MasterAdminPage() {
  const isAuth = await isMasterAuthenticated();

  if (!isAuth) {
    return <MasterLoginClient />;
  }

  const registry = await getRegistry();
  
  // Calculate SaaS-wide statistics
  let totalRsvps = 0;
  let totalAttending = 0;
  let totalWishes = 0;
  const registryWithThemes: ExtendedTenantRegistryItem[] = [];

  for (const tenant of registry) {
    const db = await getTenantDb(tenant.slug);
    let theme_colors = { primary: "#800000", secondary: "#D4AF37", accent: "#9B111E", bg: "#FDFBF7" };
    if (db) {
      const rsvps = db.rsvps || [];
      totalRsvps += rsvps.length;
      totalAttending += rsvps
        .filter(r => r.attending)
        .reduce((acc, curr) => acc + (curr.guests_count || 1), 0);
      totalWishes += (db.wishes || []).length;
      if (db.settings?.theme_colors) {
        theme_colors = db.settings.theme_colors;
      }
    }
    registryWithThemes.push({
      ...tenant,
      theme_colors
    });
  }

  const stats = {
    totalWeddings: registry.length,
    totalRsvps,
    totalAttending,
    totalWishes,
  };

  return (
    <MasterDashboardClient registry={registryWithThemes} stats={stats} />
  );
}
