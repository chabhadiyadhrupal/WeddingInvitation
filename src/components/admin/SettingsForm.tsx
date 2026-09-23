'use client';

import React, { useState, useTransition } from 'react';
import { updateSettings } from '@/app/actions';
import { updateSettingsSaas } from '@/app/actions-saas';
import { WeddingSettings } from '@/lib/db';
import { Sparkles, Settings2, ShieldCheck, Music, Palette } from 'lucide-react';
import { WEDDING_THEMES } from '@/lib/themes';

interface SettingsFormProps {
  initialSettings: WeddingSettings;
  slug?: string;
}

export default function SettingsForm({ initialSettings, slug }: SettingsFormProps) {
  const [weddingDate, setWeddingDate] = useState(initialSettings.wedding_date || '');
  const [weddingTime, setWeddingTime] = useState(initialSettings.wedding_time || '');
  const [venueName, setVenueName] = useState(initialSettings.venue_name || '');
  const [venueAddress, setVenueAddress] = useState(initialSettings.venue_address || '');
  const [mapsLink, setMapsLink] = useState(initialSettings.maps_link || '');
  
  const [musicUrl, setMusicUrl] = useState(initialSettings.music_url || '');
  const [musicAutoplay, setMusicAutoplay] = useState(initialSettings.music_autoplay ?? true);
  
  const [seoTitle, setSeoTitle] = useState(initialSettings.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(initialSettings.seo_description || '');

  const [themeColors, setThemeColors] = useState(initialSettings.theme_colors || { primary: '#800000', secondary: '#D4AF37', accent: '#9B111E', bg: '#FDFBF7' });

  // Find if current theme colors match a preset theme
  const matchedTheme = WEDDING_THEMES.find(t => 
    t.colors.primary.toLowerCase() === (themeColors.primary || '').toLowerCase()
  );
  const [selectedThemeId, setSelectedThemeId] = useState(matchedTheme ? matchedTheme.id : 'custom');

  const handleThemeChange = (val: string) => {
    setSelectedThemeId(val);
    if (val !== 'custom') {
      const theme = WEDDING_THEMES.find(t => t.id === val);
      if (theme) {
        setThemeColors(theme.colors);
      }
    }
  };

  const PRESET_SONGS = [
    { title: 'શરણાઈ મંગલ ધૂન (Traditional Shehnai Dhun)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { title: 'પ્રેમમય વાંસળી સૂર (Romantic Flute Tune)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { title: 'શાહી સિતાર ધૂન (Royal Sitar Harmony)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { title: 'શુભ સંગમ વાદ્ય સૂર (Auspicious Wedding Instrumental)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' }
  ];

  // Find if current url is a preset
  const initialPreset = PRESET_SONGS.find(s => s.url === initialSettings.music_url) ? initialSettings.music_url : 'custom';
  const [selectedSongType, setSelectedSongType] = useState(initialPreset);

  const handleSongChange = (val: string) => {
    setSelectedSongType(val);
    if (val !== 'custom') {
      setMusicUrl(val);
    } else {
      setMusicUrl('');
    }
  };

  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    startTransition(async () => {
      try {
        const payload: WeddingSettings = {
          wedding_date: weddingDate,
          wedding_time: weddingTime,
          venue_name: venueName,
          venue_address: venueAddress,
          maps_link: mapsLink,
          music_url: musicUrl,
          music_autoplay: musicAutoplay,
          theme_colors: themeColors,
          seo_title: seoTitle,
          seo_description: seoDescription,
          qr_code_enabled: initialSettings.qr_code_enabled ?? true
        };

        const res = slug
          ? await updateSettingsSaas(slug, payload)
          : await updateSettings(payload);

        if (res.success) {
          setStatus({ success: true, message: 'Settings saved successfully!' });
        } else {
          setStatus({ success: false, message: 'Failed to save settings.' });
        }
      } catch (err) {
        console.error(err);
        setStatus({ success: false, message: 'An error occurred while saving.' });
      }
    });
  };

  return (
    <div className="space-y-6 font-outfit select-none">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Wedding Settings</h1>
        <p className="text-gray-500 text-xs md:text-sm mt-1">Configure invitation countdown timers, location links, music tracks, and metadata</p>
      </div>

      {status && (
        <div
          className={`p-3.5 rounded-xl text-sm font-semibold text-center border ${
            status.success
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Date & Venue info */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#800000] uppercase tracking-wider flex items-center space-x-2 pb-2 border-b border-gray-100">
            <Settings2 className="w-4 h-4 text-[#9B111E]" />
            <span>Ceremony & Venue Settings</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase">Wedding Date *</label>
              <input
                type="date"
                required
                value={weddingDate}
                onChange={e => setWeddingDate(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase">Auspicious Time (Muhurat) *</label>
              <input
                type="text"
                required
                value={weddingTime}
                onChange={e => setWeddingTime(e.target.value)}
                placeholder="e.g. 10:00 AM"
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase">Venue Name *</label>
              <input
                type="text"
                required
                value={venueName}
                onChange={e => setVenueName(e.target.value)}
                placeholder="e.g. Royal Palace Ground"
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase">Google Maps Navigation URL</label>
              <input
                type="url"
                value={mapsLink}
                onChange={e => setMapsLink(e.target.value)}
                placeholder="e.g. https://maps.app.goo.gl/..."
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase">Venue Address *</label>
            <input
              type="text"
              required
              value={venueAddress}
              onChange={e => setVenueAddress(e.target.value)}
              placeholder="Full venue address..."
              className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
            />
          </div>
        </div>

        {/* Music Settings */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#800000] uppercase tracking-wider flex items-center space-x-2 pb-2 border-b border-gray-100">
            <Music className="w-4 h-4 text-[#9B111E]" />
            <span>Music Settings</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase">Select Love Song / Shehnai Track</label>
              <select
                value={selectedSongType}
                onChange={e => handleSongChange(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
              >
                {PRESET_SONGS.map((song, sIdx) => (
                  <option key={sIdx} value={song.url}>{song.title}</option>
                ))}
                <option value="custom">કસ્ટમ ઓડિયો લિંક (Custom MP3 URL)</option>
              </select>
            </div>

            {selectedSongType === 'custom' && (
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase">Custom MP3 Audio URL</label>
                <input
                  type="url"
                  required
                  value={musicUrl}
                  onChange={e => setMusicUrl(e.target.value)}
                  placeholder="https://example.com/audio.mp3"
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <input
              type="checkbox"
              id="autoplay"
              checked={musicAutoplay}
              onChange={e => setMusicAutoplay(e.target.checked)}
              className="w-4 h-4 text-[#800000] border-gray-300 rounded focus:ring-[#800000] cursor-pointer"
            />
            <label htmlFor="autoplay" className="text-xs font-bold text-gray-700 uppercase cursor-pointer">
              Enable Auto-Play on Entering Invitation
            </label>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#800000] uppercase tracking-wider flex items-center space-x-2 pb-2 border-b border-gray-100">
            <Palette className="w-4 h-4 text-[#9B111E]" />
            <span>Design Color Theme</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase">Select Preset Color Palette</label>
              <select
                value={selectedThemeId}
                onChange={e => handleThemeChange(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
              >
                {selectedThemeId === 'custom' && (
                  <option value="custom">Custom Theme Colors</option>
                )}
                {WEDDING_THEMES.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Colors Preview */}
            <div className="flex items-center space-x-4 border border-gray-200 bg-[#FDFBF7] p-3 rounded-xl">
              <span className="text-xs font-semibold text-gray-500">Theme Colors Preview:</span>
              <div className="flex space-x-2">
                <div className="flex flex-col items-center">
                  <span className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: themeColors.primary }}></span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase mt-1">Primary</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: themeColors.secondary }}></span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase mt-1">Accent 1</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: themeColors.accent }}></span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase mt-1">Accent 2</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: themeColors.bg }}></span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase mt-1">Background</span>
                </div>
              </div>
            </div>
          </div>

          {selectedThemeId === 'custom' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase">Primary Color</label>
                <input
                  type="color"
                  value={themeColors.primary}
                  onChange={e => setThemeColors(prev => ({ ...prev, primary: e.target.value }))}
                  className="w-full mt-1 h-10 border border-gray-300 rounded-xl cursor-pointer bg-transparent p-0"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase">Secondary Color</label>
                <input
                  type="color"
                  value={themeColors.secondary}
                  onChange={e => setThemeColors(prev => ({ ...prev, secondary: e.target.value }))}
                  className="w-full mt-1 h-10 border border-gray-300 rounded-xl cursor-pointer bg-transparent p-0"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase">Accent Color</label>
                <input
                  type="color"
                  value={themeColors.accent}
                  onChange={e => setThemeColors(prev => ({ ...prev, accent: e.target.value }))}
                  className="w-full mt-1 h-10 border border-gray-300 rounded-xl cursor-pointer bg-transparent p-0"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase">Background Color</label>
                <input
                  type="color"
                  value={themeColors.bg}
                  onChange={e => setThemeColors(prev => ({ ...prev, bg: e.target.value }))}
                  className="w-full mt-1 h-10 border border-gray-300 rounded-xl cursor-pointer bg-transparent p-0"
                />
              </div>
            </div>
          )}
        </div>

        {/* SEO Customization */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#800000] uppercase tracking-wider flex items-center space-x-2 pb-2 border-b border-gray-100">
            <ShieldCheck className="w-4 h-4 text-[#9B111E]" />
            <span>SEO & Invitation Sharing Settings</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase">Website Tab Title (SEO Title)</label>
            <input
              type="text"
              required
              value={seoTitle}
              onChange={e => setSeoTitle(e.target.value)}
              className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase">Invitation Share Meta Description</label>
            <textarea
              required
              value={seoDescription}
              onChange={e => setSeoDescription(e.target.value)}
              rows={3}
              className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7] resize-none"
            />
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="bg-[#800000] hover:bg-[#9B111E] text-[#D4AF37] font-bold py-3 px-8 rounded-xl border border-[#D4AF37]/30 shadow-md cursor-pointer flex items-center space-x-2 transition-colors duration-200 text-sm"
          >
            {isPending ? (
              <span className="animate-spin h-5 w-5 border-2 border-[#D4AF37] border-t-transparent rounded-full"></span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}