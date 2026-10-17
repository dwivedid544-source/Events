import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Globe, Save, Eye, Layout, Image as ImageIcon, CheckCircle } from 'lucide-react';

export const CmsEditorPage = ({ pageTitle = 'Public Page Content Manager (CMS)' }) => {
  const { showToast } = useApp();

  const [cmsData, setCmsData] = useState({
    heroTitle: 'Official Sanctioned Field Trials & Nite Hunts',
    heroSubtitle: 'Connecting coonhound owners, state associations, and UKC chartered clubs nationwide.',
    announcementBanner: '2026 Fall National Championship entries are now officially open!',
    aboutContent: 'Welcome to the sanctioned state & national association portal. We preserve competitive hunting traditions with transparent scoring, digital event entries, and live leaderboard tracking.',
    contactInfo: 'Email: support@nationalhunting.org | Phone: (865) 555-0192',
    enableBanner: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    showToast(`Published changes to ${pageTitle}!`, 'success');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">{pageTitle}</h1>
          <p className="text-xs text-charcoal-muted mt-0.5">Customize hero messaging, public announcements, rules overview, and contact info</p>
        </div>
        <button
          onClick={() => showToast('Previewing live public portal page...', 'info')}
          className="px-3.5 py-2 bg-surface-lowest border hover:bg-surface-low text-charcoal font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Eye className="w-4 h-4" /> Live Preview
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-surface-lowest p-6 rounded-xl border shadow-ambient space-y-6 text-xs">
        {/* Banner Announcement */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-base text-forest-800 border-b pb-2 flex items-center gap-2">
            <Layout className="w-4 h-4 text-tan-600" /> Header Announcement Ticker
          </h3>
          <div className="flex items-center justify-between p-3 bg-surface-low rounded-lg border">
            <div>
              <div className="font-extrabold text-charcoal">Show Public Header Alert Ticker</div>
              <div className="text-[11px] text-charcoal-light">Display high-priority alert across top navigation bar</div>
            </div>
            <input
              type="checkbox"
              checked={cmsData.enableBanner}
              onChange={(e) => setCmsData({ ...cmsData, enableBanner: e.target.checked })}
              className="w-4 h-4 accent-forest-800"
            />
          </div>

          <div>
            <label className="block font-bold text-charcoal mb-1">Banner Announcement Text</label>
            <input
              type="text"
              value={cmsData.announcementBanner}
              onChange={(e) => setCmsData({ ...cmsData, announcementBanner: e.target.value })}
              className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
            />
          </div>
        </div>

        {/* Hero Section Content */}
        <div className="space-y-4 pt-2 border-t">
          <h3 className="font-extrabold text-base text-forest-800 border-b pb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-tan-600" /> Hero Headline & Subtitle
          </h3>

          <div>
            <label className="block font-bold text-charcoal mb-1">Main Hero Headline Title</label>
            <input
              type="text"
              value={cmsData.heroTitle}
              onChange={(e) => setCmsData({ ...cmsData, heroTitle: e.target.value })}
              className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium text-sm font-extrabold text-forest-900"
            />
          </div>

          <div>
            <label className="block font-bold text-charcoal mb-1">Hero Subtitle / Mission Statement</label>
            <textarea
              rows={2}
              value={cmsData.heroSubtitle}
              onChange={(e) => setCmsData({ ...cmsData, heroSubtitle: e.target.value })}
              className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
            />
          </div>
        </div>

        {/* About & Contact */}
        <div className="space-y-4 pt-2 border-t">
          <h3 className="font-extrabold text-base text-forest-800 border-b pb-2">Association Information & Contact</h3>
          <div>
            <label className="block font-bold text-charcoal mb-1">About Section Text</label>
            <textarea
              rows={4}
              value={cmsData.aboutContent}
              onChange={(e) => setCmsData({ ...cmsData, aboutContent: e.target.value })}
              className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-charcoal mb-1">Public Contact Info Footer</label>
            <input
              type="text"
              value={cmsData.contactInfo}
              onChange={(e) => setCmsData({ ...cmsData, contactInfo: e.target.value })}
              className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            className="px-5 py-2.5 bg-forest-800 hover:bg-forest-900 text-white font-extrabold rounded-lg shadow flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save & Publish Live Page
          </button>
        </div>
      </form>
    </div>
  );
};
