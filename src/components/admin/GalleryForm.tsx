'use client';

import React, { useState, useTransition } from 'react';
import { saveGalleryItem, deleteGalleryItem } from '@/app/actions';
import { saveGalleryItemSaas, deleteGalleryItemSaas } from '@/app/actions-saas';
import { GalleryItem } from '@/lib/db';
import { Trash2, Plus, Sparkles, Image as ImageIcon } from 'lucide-react';

interface GalleryFormProps {
  initialGallery: GalleryItem[];
  slug?: string;
}

export default function GalleryForm({ initialGallery, slug }: GalleryFormProps) {
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'images');

    try {
      const uploadUrl = slug ? `/api/upload?slug=${slug}` : '/api/upload';
      const res = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setUrl(data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setStatus(null);

    startTransition(async () => {
      try {
        const payload = { url, caption };
        const res = slug 
          ? await saveGalleryItemSaas(slug, payload)
          : await saveGalleryItem(payload);

        if (res.success) {
          setStatus({ success: true, message: 'Image added successfully!' });
          setUrl('');
          setCaption('');
          window.location.reload();
        } else {
          setStatus({ success: false, message: 'Failed to add image.' });
        }
      } catch (err) {
        console.error(err);
        setStatus({ success: false, message: 'An error occurred.' });
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    setStatus(null);

    startTransition(async () => {
      try {
        const res = slug 
          ? await deleteGalleryItemSaas(slug, id)
          : await deleteGalleryItem(id);

        if (res.success) {
          setGallery(prev => prev.filter(g => g.id !== id));
          setStatus({ success: true, message: 'Image deleted successfully.' });
        }
      } catch (err) {
        console.error(err);
        setStatus({ success: false, message: 'Error deleting image.' });
      }
    });
  };

  const sortedGallery = [...gallery].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6 font-outfit select-none">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Photo Gallery</h1>
        <p className="text-gray-500 text-xs md:text-sm mt-1">Manage couple photos, mehndi details, and ceremony snaps</p>
      </div>

      {status && (
        <div
          className={`p-3 rounded-xl text-sm font-semibold text-center border ${
            status.success
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {status.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Image Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 sticky top-6">
            <h3 className="text-sm font-bold text-[#800000] uppercase tracking-wider flex items-center space-x-2 pb-2 border-b border-gray-100">
              <ImageIcon className="w-4 h-4 text-[#9B111E]" />
              <span>Add Image</span>
            </h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full mt-1 text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-[#800000] hover:file:bg-amber-100 cursor-pointer"
                />
                {uploading && <span className="text-[10px] text-gray-400 animate-pulse block mt-1">Uploading image...</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase">Or Image URL *</label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase">Caption</label>
                <input
                  type="text"
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  placeholder="e.g. Pre-wedding Shoot"
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#800000] hover:bg-[#9B111E] text-[#D4AF37] font-bold py-2.5 rounded-xl border border-[#D4AF37]/20 shadow flex items-center justify-center space-x-1.5 transition-colors cursor-pointer text-xs md:text-sm"
              >
                {isPending ? (
                  <span className="animate-spin h-5 w-5 border-2 border-[#D4AF37] border-t-transparent rounded-full"></span>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Gallery</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Gallery Preview Grid */}
        <div className="lg:col-span-2">
          {sortedGallery.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm italic text-gray-500">
              No photos in gallery. Add photo links on the left to start.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {sortedGallery.map(img => (
                <div key={img.id} className="relative group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                    
                    {/* Delete hover overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleDelete(img.id)}
                        disabled={isPending}
                        className="p-3 bg-red-600 rounded-full text-white hover:bg-red-700 cursor-pointer shadow-md transition-colors"
                        title="Delete Image"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  {img.caption && (
                    <div className="p-2 border-t border-gray-100 text-xs font-semibold text-gray-700 truncate">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
