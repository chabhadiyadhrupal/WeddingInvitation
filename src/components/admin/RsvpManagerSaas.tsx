'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { deleteRSVPSaas } from '@/app/actions-saas';
import { RSVP } from '@/lib/db';
import { Download, Trash2, ClipboardList } from 'lucide-react';

interface Props {
  slug: string;
}

export default function RsvpManagerSaas({ slug }: Props) {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const loadRsvps = async () => {
      try {
        const res = await fetch(`/api/rsvps/${slug}`);
        const data = await res.json();
        setRsvps(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching RSVPs:', err);
      } finally {
        setLoading(false);
      }
    };
    loadRsvps();
  }, [slug]);

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this RSVP record?')) return;
    
    startTransition(async () => {
      const res = await deleteRSVPSaas(slug, id);
      if (res.success) {
        setRsvps(prev => prev.filter(r => r.id !== id));
      }
    });
  };

  const exportCSV = () => {
    if (rsvps.length === 0) return;
    
    const headers = ['Name', 'Phone', 'Guests Count', 'Attending Status', 'Message', 'Created At'];
    const rows = rsvps.map(r => [
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.phone}"`,
      r.guests_count,
      r.attending ? 'Attending' : 'Declining',
      `"${(r.message || '').replace(/"/g, '""')}"`,
      new Date(r.created_at).toLocaleDateString()
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Wedding_RSVPs_${slug}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const attendingCount = rsvps.filter(r => r.attending).reduce((acc, curr) => acc + curr.guests_count, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 font-outfit">
        <span className="animate-spin h-8 w-8 border-4 border-[#800000] border-t-transparent rounded-full"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-outfit select-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Guest RSVPs</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Track attending guests and export spreadsheet schedules
          </p>
        </div>

        <button
          onClick={exportCSV}
          disabled={rsvps.length === 0}
          className="bg-gold-metallic text-[#4A0E17] font-bold py-2.5 px-6 rounded-xl border border-[#FFE89C] shadow hover:shadow-md cursor-pointer flex items-center justify-center space-x-1.5 self-start transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-2xl font-bold text-gray-900">{rsvps.length}</span>
          <p className="text-xs font-semibold text-gray-400 uppercase mt-0.5">Total Responses</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-2xl font-bold text-emerald-700">{attendingCount}</span>
          <p className="text-xs font-semibold text-gray-400 uppercase mt-0.5">Attending Guests</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-2xl font-bold text-red-600">{rsvps.filter(r => !r.attending).length}</span>
          <p className="text-xs font-semibold text-gray-400 uppercase mt-0.5">Declined Responses</p>
        </div>
      </div>

      {/* Table view */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {rsvps.length === 0 ? (
          <div className="text-center py-16 text-gray-500 italic">
            No RSVP confirmations have been submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6 text-center">Family Count</th>
                  <th className="py-4 px-6">Attending</th>
                  <th className="py-4 px-6">Message</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                {rsvps.map(rsvp => (
                  <tr key={rsvp.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-gray-900">{rsvp.name}</td>
                    <td className="py-4 px-6 font-mono text-xs">{rsvp.phone}</td>
                    <td className="py-4 px-6 text-center font-semibold">{rsvp.guests_count}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        rsvp.attending 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                          : 'bg-red-50 text-red-800 border-red-100'
                      }`}>
                        {rsvp.attending ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-4 px-6 max-w-xs truncate text-xs text-gray-500 italic" title={rsvp.message}>
                      {rsvp.message || '-'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(rsvp.id)}
                        disabled={isPending}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        title="Delete RSVP"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
