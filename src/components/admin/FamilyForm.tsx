'use client';

import React, { useState, useTransition } from 'react';
import { saveFamilyMember, deleteFamilyMember } from '@/app/actions';
import { saveFamilyMemberSaas, deleteFamilyMemberSaas } from '@/app/actions-saas';
import { FamilyMember } from '@/lib/db';
import { Plus, Trash2, Edit2, X, Sparkles } from 'lucide-react';

interface FamilyFormProps {
  initialFamily: FamilyMember[];
  slug?: string;
}

export default function FamilyForm({ initialFamily, slug }: FamilyFormProps) {
  const [family, setFamily] = useState<FamilyMember[]>(initialFamily);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Form states
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [side, setSide] = useState<'bride' | 'groom'>('groom');
  const [photo, setPhoto] = useState('');
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
        setPhoto(data.url);
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

  const openModal = (member?: FamilyMember) => {
    if (member) {
      setEditId(member.id);
      setName(member.name);
      setRelationship(member.relationship);
      setSide(member.side);
      setPhoto(member.photo || '');
    } else {
      setEditId(null);
      setName('');
      setRelationship('');
      setSide('groom');
      setPhoto('');
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newMember: FamilyMember = {
      id: editId || '',
      name,
      relationship,
      side,
      photo,
    };

    startTransition(async () => {
      const res = slug 
        ? await saveFamilyMemberSaas(slug, newMember)
        : await saveFamilyMember(newMember);
        
      if (res.success) {
        if (editId) {
          setFamily(prev => prev.map(f => f.id === editId ? { ...newMember, id: editId } : f));
        } else {
          window.location.reload();
        }
        closeModal();
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this family member record?')) return;

    startTransition(async () => {
      const res = slug 
        ? await deleteFamilyMemberSaas(slug, id)
        : await deleteFamilyMember(id);
        
      if (res.success) {
        setFamily(prev => prev.filter(f => f.id !== id));
      }
    });
  };

  const groomSide = family.filter(f => f.side === 'groom');
  const brideSide = family.filter(f => f.side === 'bride');

  return (
    <div className="space-y-6 font-outfit select-none">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Family Members</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Manage members on the Groom&apos;s and Bride&apos;s sides</p>
        </div>

        <button
          onClick={() => openModal()}
          className="bg-gold-metallic text-[#4A0E17] font-bold py-2.5 px-5 rounded-xl border border-[#FFE89C] shadow hover:shadow-md flex items-center space-x-1 transition-all cursor-pointer text-xs md:text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Groom Side */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#800000] uppercase tracking-wider pb-2 border-b border-gray-100">
            Groom&apos;s Side (વર પક્ષ)
          </h3>
          {groomSide.length === 0 ? (
            <p className="text-gray-400 text-xs italic">No family members added.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {groomSide.map(member => (
                <div key={member.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {member.photo && (
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-50">
                        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">{member.name}</h4>
                      <p className="text-xs text-gray-500">{member.relationship}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1.5">
                    <button
                      onClick={() => openModal(member)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      disabled={isPending}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bride Side */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#800000] uppercase tracking-wider pb-2 border-b border-gray-100">
            Bride&apos;s Side (કન્યા પક્ષ)
          </h3>
          {brideSide.length === 0 ? (
            <p className="text-gray-400 text-xs italic">No family members added.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {brideSide.map(member => (
                <div key={member.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {member.photo && (
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-50">
                        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">{member.name}</h4>
                      <p className="text-xs text-gray-500">{member.relationship}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1.5">
                    <button
                      onClick={() => openModal(member)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      disabled={isPending}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-[#D4AF37]/30">
            <div className="bg-[#1F080C] text-[#FDFBF7] p-5 border-b border-[#D4AF37]/20 flex justify-between items-center">
              <span className="font-bold text-sm tracking-wider uppercase font-serif">
                {editId ? 'Edit Family Member' : 'Add Family Member'}
              </span>
              <button onClick={closeModal} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase">Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase">Relationship *</label>
                <input
                  type="text"
                  required
                  value={relationship}
                  placeholder="e.g. Father, Mother, Brother"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase font-outfit">Side *</label>
                <div className="grid grid-cols-2 gap-4 mt-1">
                  <button
                    type="button"
                    onClick={() => setSide('groom')}
                    className={`py-2 rounded-lg font-semibold text-xs cursor-pointer border ${
                      side === 'groom'
                        ? 'bg-[#800000] text-[#D4AF37] border-[#800000]'
                        : 'bg-white text-gray-600 border-gray-300'
                    }`}
                  >
                    Groom&apos;s Side
                  </button>
                  <button
                    type="button"
                    onClick={() => setSide('bride')}
                    className={`py-2 rounded-lg font-semibold text-xs cursor-pointer border ${
                      side === 'bride'
                        ? 'bg-[#800000] text-[#D4AF37] border-[#800000]'
                        : 'bg-white text-gray-600 border-gray-300'
                    }`}
                  >
                    Bride&apos;s Side
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase">Photo</label>
                <div className="mt-1 flex items-center space-x-3">
                  {photo && (
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 flex-shrink-0 bg-gray-50">
                      <img src={photo} alt="Member preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-[#800000] hover:file:bg-amber-100 cursor-pointer"
                    />
                    {uploading && <span className="text-[10px] text-gray-400 animate-pulse block mt-0.5">Uploading...</span>}
                  </div>
                </div>
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
                      <span>Save Member</span>
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
