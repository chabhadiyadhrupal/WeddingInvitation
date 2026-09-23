'use client';

import React, { useState, useTransition } from 'react';
import { saveEvent, deleteEvent } from '@/app/actions';
import { saveEventSaas, deleteEventSaas } from '@/app/actions-saas';
import { WeddingEvent } from '@/lib/db';
import { Sparkles, CalendarDays, Plus, Trash2, Edit2, X, Clock, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EventsFormProps {
  initialEvents: WeddingEvent[];
  slug?: string;
}

export default function EventsForm({ initialEvents, slug }: EventsFormProps) {
  const router = useRouter();
  const [events, setEvents] = useState<WeddingEvent[]>(initialEvents);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Modal editing states
  const [editId, setEditId] = useState<string | null>(null);
  const [titleEn, setTitleEn] = useState('');
  const [titleGu, setTitleGu] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionGu, setDescriptionGu] = useState('');
  const [icon, setIcon] = useState('sparkles');

  const openModal = (event?: WeddingEvent) => {
    if (event) {
      setEditId(event.id);
      setTitleEn(event.title_en);
      setTitleGu(event.title_gu);
      setDate(event.date);
      setTime(event.time);
      setVenue(event.venue);
      setDescriptionEn(event.description_en || '');
      setDescriptionGu(event.description_gu);
      setIcon(event.icon);
    } else {
      setEditId(null);
      setTitleEn('');
      setTitleGu('');
      setDate('');
      setTime('');
      setVenue('');
      setDescriptionEn('');
      setDescriptionGu('');
      setIcon('sparkles');
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newEvent: WeddingEvent = {
      id: editId || '',
      title_en: titleEn,
      title_gu: titleGu,
      date,
      time,
      venue,
      description_en: descriptionEn,
      description_gu: descriptionGu,
      icon,
    };

    startTransition(async () => {
      const res = slug 
        ? await saveEventSaas(slug, newEvent)
        : await saveEvent(newEvent);
        
      if (res.success) {
        // Re-load list
        if (editId) {
          setEvents(prev => prev.map(e => e.id === editId ? { ...newEvent, id: editId } : e));
        } else {
          window.location.reload();
        }
        closeModal();
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    startTransition(async () => {
      const res = slug 
        ? await deleteEventSaas(slug, id)
        : await deleteEvent(id);
        
      if (res.success) {
        setEvents(prev => prev.filter(e => e.id !== id));
      }
    });
  };

  return (
    <div className="space-y-6 font-outfit select-none">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Wedding Itinerary (Events)</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Manage Garba nights, Mehendi, Lagna and Sangeet celebrations</p>
        </div>

        <button
          onClick={() => openModal()}
          className="bg-gold-metallic text-[#4A0E17] font-bold py-2.5 px-5 rounded-xl border border-[#FFE89C] shadow hover:shadow-md flex items-center space-x-1 transition-all cursor-pointer text-xs md:text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Wedding Event</span>
        </button>
      </div>

      {/* Grid List */}
      {events.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm italic text-gray-500">
          No events created yet. Click &ldquo;Add Wedding Event&rdquo; to build your timeline.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-[#800000] font-gujarati">{event.title_gu}</h3>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{event.title_en}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-50 rounded-full border border-[#D4AF37]/30 text-xs font-semibold text-[#800000]">
                    Icon: {event.icon}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-gray-500 border-b border-dashed border-gray-100 pb-3 mb-3">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#9B111E]" />
                    <span>{event.time} | {new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#9B111E]" />
                    <span className="font-semibold text-gray-700">{event.venue}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-gray-700 font-gujarati leading-relaxed">{event.description_gu}</p>
                  {event.description_en && (
                    <p className="text-gray-400 italic">&ldquo;{event.description_en}&rdquo;</p>
                  )}
                </div>
              </div>

              {/* CRUD Actions */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100 mt-6">
                <button
                  onClick={() => handleDelete(event.id)}
                  disabled={isPending}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openModal(event)}
                  className="py-1.5 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Event</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Editor Form */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-[#D4AF37]/30">
            {/* Header */}
            <div className="bg-[#1F080C] text-[#FDFBF7] p-5 border-b border-[#D4AF37]/20 flex justify-between items-center">
              <span className="font-bold text-sm tracking-wider uppercase font-serif">
                {editId ? 'Edit Event Details' : 'Add New Event'}
              </span>
              <button onClick={closeModal} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase">Title (Gujarati) *</label>
                  <input
                    type="text"
                    required
                    value={titleGu}
                    onChange={e => setTitleGu(e.target.value)}
                    placeholder="મહેંદી રસમ"
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={e => setTitleEn(e.target.value)}
                    placeholder="Mehendi Ceremony"
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase">Time *</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    placeholder="e.g. 04:00 PM"
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase">Venue *</label>
                <input
                  type="text"
                  required
                  value={venue}
                  onChange={e => setVenue(e.target.value)}
                  placeholder="Venue location"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase">Gujarati Description *</label>
                <textarea
                  required
                  value={descriptionGu}
                  onChange={e => setDescriptionGu(e.target.value)}
                  rows={2}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase">English Description</label>
                <textarea
                  value={descriptionEn}
                  onChange={e => setDescriptionEn(e.target.value)}
                  rows={2}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase">Event Icon Identifier</label>
                <select
                  value={icon}
                  onChange={e => setIcon(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
                >
                  <option value="palette">Mehndi Icon (Palette)</option>
                  <option value="music">Garba / Sangeet Icon (Music)</option>
                  <option value="sun">Haldi Icon (Sun)</option>
                  <option value="heart">Lagna Wedding Icon (Heart)</option>
                  <option value="gift">Reception Icon (Gift)</option>
                  <option value="sparkles">Custom/Other (Sparkles)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="py-2 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-[#800000] hover:bg-[#9B111E] text-[#D4AF37] font-semibold py-2 px-5 rounded-lg border border-[#D4AF37]/20 flex items-center space-x-1 cursor-pointer text-xs"
                >
                  {isPending ? (
                    <span className="animate-spin h-4 w-4 border-2 border-[#D4AF37] border-t-transparent rounded-full"></span>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Save Event</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
