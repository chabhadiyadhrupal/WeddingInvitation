import React from 'react';
import { getRegistry } from '@/lib/db-saas';
import CoupleLoginClient from './CoupleLoginClient';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CoupleLoginPage(props: PageProps) {
  const { slug } = await props.params;
  const registry = await getRegistry();
  const tenant = registry.find(t => t.slug === slug);
  
  if (!tenant) {
    notFound();
  }

  return (
    <CoupleLoginClient slug={slug} coupleNames={tenant.couple_names} />
  );
}
