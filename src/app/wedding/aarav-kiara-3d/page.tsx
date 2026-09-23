import React from 'react';
import { Metadata } from 'next';
import Wedding3DPage from '@/components/3d/Wedding3DPage';

export const metadata: Metadata = {
  title: 'Aarav & Kiara | 3D Professional Luxury Wedding Invitation',
  description: 'Experience the 3D interactive luxury wedding invitation for Aarav & Kiara with scroll-driven camera storytelling.',
};

export default function AaravKiara3DPage() {
  return <Wedding3DPage />;
}
