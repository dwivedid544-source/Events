import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  Save,
  Eye,
  Layout,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Megaphone,
  Phone,
  Mail,
  MapPin,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const CmsEditorPage = ({ pageTitle = 'Public Page Content Manager (CMS)' }) => {
  const { showToast, currentUser, getStateCms, updateStateCms } = useApp();

  // Determine current scope: National or State
  const isNational = pageTitle.toLowerCase().includes('national');
  const targetState = isNational ? 'national' : (currentUser?.state || 'Tennessee');
  const cleanTargetState = isNational ? 'National' : targetState.replace(/\s*(State\s*)?Association.*$/i, '').trim();
  const stateDisplayTitle = isNational ? 'National Network' : `${cleanTargetState} State Association`;
  const publicPageSlug = isNational ? '/national' : `/states/${cleanTargetState.toLowerCase().includes('tenn') ? 'tn' : cleanTargetState.toLowerCase().includes('tex') ? 'tx' : 'tn'}`;

  // Load persisted CMS data from AppContext
  const initialCms = getStateCms(targetState);

  const [cmsData, setCmsData] = useState({
    heroTitle: initialCms.heroTitle || 'Official Sanctioned Field Trials & Nite Hunts',
    heroSubtitle: initialCms.heroSubtitle || `Connecting coonhound owners, state associations, and UKC chartered clubs nationwide across ${targetState}.`,
    announcementBanner: initialCms.announcementBanner || '2026 Fall National Championship entries are now officially open!',
    aboutContent: initialCms.aboutContent || `Welcome to the sanctioned ${stateDisplayTitle} portal. We preserve competitive hunting traditions with transparent scoring, digital event entries, and live leaderboard tracking.`,
    contactInfo: initialCms.contactInfo || `Email: contact@${isNational ? 'nationalhunting.org' : 'tnhunting.org'} | Phone: (865) 555-0192 | Headquarters: Nashville, TN`,
    enableBanner: initialCms.enableBanner ?? true,
    bannerBadge: initialCms.bannerBadge || 'NATIONAL ALERT',
    bannerLink: initialCms.bannerLink || '/events',
    heroImage: initialCms.heroImage || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&auto=format&fit=crop&q=80',
    lastPublished: initialCms.lastPublished || 'Oct 17, 2026, 3:45 PM'
  });

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activePreset, setActivePreset] = useState(0);

  // Sync state if currentUser changes
  useEffect(() => {
    const fresh = getStateCms(targetState);
    setCmsData((prev) => ({
      ...prev,
      ...fresh
    }));
  }, [targetState]);

  // Image Presets for Hound & Sporting Trials
  const heroImagePresets = [
    {
      name: 'Autumn Timber Trials',
      url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&auto=format&fit=crop&q=80',
      description: 'Golden forest canopy with field trial hounds'
    },
    {
      name: 'Smoky Mountains Night Hunt',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
      description: 'Misty Appalachian foothills and pine tree line'
    },
    {
      name: 'Champion Coonhound Benchmark',
      url: 'https://images.unsplash.com/photo-1531219432768-9f540ce91ef3?w=1200&auto=format&fit=crop&q=80',
      description: 'Competition champion treeing hound portrait'
    },
    {
      name: 'River Country Speed Trial',
      url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&auto=format&fit=crop&q=80',
      description: 'Water race shoreline and competitive retriever course'
    }
  ];

  const handleSave = (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      const updated = updateStateCms(targetState, cmsData);
      setCmsData((prev) => ({
        ...prev,
        lastPublished: updated.lastPublished
      }));

      showToast(`Published changes to ${stateDisplayTitle} Public Portal!`, 'success');
    } catch (err) {
      console.error('Failed to save CMS data:', err);
      showToast('Error publishing changes. Please try again.', 'error');
    } finally {
      setTimeout(() => setIsSaving(false), 400);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm(`Reset CMS content back to the default charter configuration for ${stateDisplayTitle}?`)) {
      const defaultData = {
        heroTitle: 'Official Sanctioned Field Trials & Nite Hunts',
        heroSubtitle: `Connecting coonhound owners, state associations, and UKC chartered clubs nationwide across ${targetState}.`,
        announcementBanner: '2026 Fall National Championship entries are now officially open!',
        aboutContent: `Welcome to the sanctioned ${stateDisplayTitle} portal. We preserve competitive hunting traditions with transparent scoring, digital event entries, and live leaderboard tracking.`,
        contactInfo: `Email: contact@${isNational ? 'nationalhunting.org' : 'tnhunting.org'} | Phone: (865) 555-0192 | Headquarters: Nashville, TN`,
        enableBanner: true,
        bannerBadge: 'NATIONAL ALERT',
        bannerLink: '/events',
        heroImage: heroImagePresets[0].url,
        lastPublished: 'Just reset to defaults'
      };
      setCmsData(defaultData);
      updateStateCms(targetState, defaultData);
      showToast(`Reset ${stateDisplayTitle} CMS to default configuration.`, 'info');
    }
  };

  return (
    <div className="max-w-5xl space-y-6 pb-12">
      {/* Header Banner & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">{pageTitle}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-forest-900/10 text-forest-900 border border-forest-800/20">
              {cleanTargetState} Scope
            </span>
          </div>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Customize hero messaging, public announcements, rules overview, and contact info for {stateDisplayTitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Live Preview Button */}
          <button
            id="live-preview-btn"
            type="button"
            onClick={() => setIsPreviewModalOpen(true)}
            className="px-3.5 py-2 bg-surface-lowest border border-surface-border hover:bg-surface-low text-forest-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 text-tan-600" />
            <span>Live Preview</span>
          </button>

          {/* Direct link to public state page */}
          <Link
            id="open-public-website-btn"
            to={publicPageSlug}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-surface-low border border-surface-border hover:bg-surface-border/60 text-charcoal font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-forest-800" />
            <span>Open Public Website</span>
          </Link>

          {/* Reset Defaults */}
          <button
            id="reset-cms-defaults-btn"
            type="button"
            onClick={handleResetToDefault}
            title="Reset to default charter content"
            className="p-2 text-charcoal-muted hover:text-red-600 hover:bg-surface-low rounded-xl border border-transparent hover:border-surface-border transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Status Pill & Public URL bar */}
      <div className="bg-surface-lowest border border-surface-border rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-forest-950">Status: Published on Public Portal</span>
          <span className="text-charcoal-muted">•</span>
          <span className="text-charcoal-muted">Last Published: {cmsData.lastPublished}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-charcoal-muted bg-surface-low px-3 py-1 rounded-lg border border-surface-border">
          <Globe className="w-3.5 h-3.5 text-tan-600" />
          <span className="font-mono font-medium">Public URL: {window.location.origin}{publicPageSlug}</span>
        </div>
      </div>

      {/* Main CMS Editor Form */}
      <form onSubmit={handleSave} className="bg-surface-lowest p-6 sm:p-8 rounded-2xl border border-surface-border shadow-ambient space-y-8 text-xs">
        
        {/* ========================================================= */}
        {/* SECTION 1: HEADER ANNOUNCEMENT TICKER */}
        {/* ========================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <h3 className="font-black text-base text-forest-900 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-tan-600" />
              <span>Header Announcement Ticker</span>
            </h3>
            <span className="text-[11px] font-bold text-charcoal-muted">Displays top alert banner on public pages</span>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center justify-between p-4 bg-surface-low rounded-xl border border-surface-border">
            <div>
              <div className="font-extrabold text-forest-950 text-sm">Show Public Header Alert Ticker</div>
              <div className="text-[11px] text-charcoal-muted mt-0.5">
                Display high-priority alert across top navigation bar on {stateDisplayTitle}
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="toggle-header-ticker"
                type="checkbox"
                checked={cmsData.enableBanner}
                onChange={(e) => setCmsData({ ...cmsData, enableBanner: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest-800"></div>
            </label>
          </div>

          {/* Announcement Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <label className="block font-bold text-forest-950 mb-1.5">Alert Badge Tag</label>
              <select
                id="banner-badge-select"
                value={cmsData.bannerBadge}
                onChange={(e) => setCmsData({ ...cmsData, bannerBadge: e.target.value })}
                className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-bold text-forest-950 focus:border-forest-800 focus:outline-none"
              >
                <option value="NATIONAL ALERT">NATIONAL ALERT</option>
                <option value="STATE CHAMPIONSHIP">STATE CHAMPIONSHIP</option>
                <option value="ENTRIES OPEN">ENTRIES OPEN</option>
                <option value="HUNT NOTICE">HUNT NOTICE</option>
                <option value="WEATHER UPDATE">WEATHER UPDATE</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block font-bold text-forest-950 mb-1.5">Banner Announcement Text</label>
              <input
                id="banner-announcement-input"
                type="text"
                value={cmsData.announcementBanner}
                onChange={(e) => setCmsData({ ...cmsData, announcementBanner: e.target.value })}
                placeholder="Enter alert text to display at the top of the portal..."
                className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl focus:border-forest-800 focus:outline-none font-medium text-forest-950 text-xs"
              />
            </div>
          </div>

          {/* Mini Real-time Ticker Preview */}
          {cmsData.enableBanner && (
            <div className="mt-2 p-3 bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-xl border border-tan-500/40 flex items-center justify-between gap-3 text-xs shadow-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-tan-400 animate-pulse shrink-0"></span>
                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-tan-500 text-forest-950 shrink-0">
                  {cmsData.bannerBadge}
                </span>
                <span className="font-semibold truncate text-tan-100">{cmsData.announcementBanner || 'No announcement message specified.'}</span>
              </div>
              <span className="text-[10px] text-tan-300 font-bold shrink-0">Preview Strip</span>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: HERO HEADLINE, SUBTITLE & BACKGROUND */}
        {/* ========================================================= */}
        <div className="space-y-4 pt-4 border-t border-surface-border">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <h3 className="font-black text-base text-forest-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-tan-600" />
              <span>Hero Headline & Mission Statement</span>
            </h3>
            <span className="text-[11px] font-bold text-charcoal-muted">Primary visitor welcome banner</span>
          </div>

          <div>
            <label className="block font-bold text-forest-950 mb-1.5">Main Hero Headline Title</label>
            <input
              id="hero-title-input"
              type="text"
              value={cmsData.heroTitle}
              onChange={(e) => setCmsData({ ...cmsData, heroTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl focus:border-forest-800 focus:outline-none font-black text-forest-950 text-sm"
              placeholder="e.g. Official Sanctioned Field Trials & Nite Hunts"
            />
          </div>

          <div>
            <label className="block font-bold text-forest-950 mb-1.5">Hero Subtitle / Mission Statement</label>
            <textarea
              id="hero-subtitle-input"
              rows={2}
              value={cmsData.heroSubtitle}
              onChange={(e) => setCmsData({ ...cmsData, heroSubtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl focus:border-forest-800 focus:outline-none font-medium text-forest-950 text-xs leading-relaxed"
              placeholder="e.g. Connecting coonhound owners, state associations, and UKC chartered clubs nationwide."
            />
          </div>

          {/* Hero Image Theme Selection */}
          <div className="space-y-2 pt-2">
            <label className="block font-bold text-forest-950">Hero Background Banner Image</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {heroImagePresets.map((preset, index) => (
                <div
                  key={index}
                  id={`hero-preset-${index}`}
                  onClick={() => {
                    setActivePreset(index);
                    setCmsData({ ...cmsData, heroImage: preset.url });
                  }}
                  className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    cmsData.heroImage === preset.url
                      ? 'border-tan-500 ring-2 ring-tan-500/30'
                      : 'border-surface-border hover:border-tan-400'
                  }`}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="p-2 bg-surface-lowest text-[10px]">
                    <span className="font-extrabold text-forest-950 block truncate">{preset.name}</span>
                  </div>
                  {cmsData.heroImage === preset.url && (
                    <div className="absolute top-1.5 right-1.5 bg-tan-500 text-forest-950 p-1 rounded-full shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <label className="block font-bold text-charcoal-muted text-[11px] mb-1">Custom Image URL</label>
              <input
                id="custom-image-url-input"
                type="text"
                value={cmsData.heroImage}
                onChange={(e) => setCmsData({ ...cmsData, heroImage: e.target.value })}
                className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl focus:border-forest-800 focus:outline-none font-mono text-[11px] text-charcoal"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 3: ABOUT & CONTACT INFORMATION */}
        {/* ========================================================= */}
        <div className="space-y-4 pt-4 border-t border-surface-border">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <h3 className="font-black text-base text-forest-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-tan-600" />
              <span>Association Information & Public Contact</span>
            </h3>
            <span className="text-[11px] font-bold text-charcoal-muted">Public rules, about text, and contact footer</span>
          </div>

          <div>
            <label className="block font-bold text-forest-950 mb-1.5">About Section Text</label>
            <textarea
              id="about-content-textarea"
              rows={4}
              value={cmsData.aboutContent}
              onChange={(e) => setCmsData({ ...cmsData, aboutContent: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl focus:border-forest-800 focus:outline-none font-medium text-forest-950 text-xs leading-relaxed"
              placeholder="Explain the mission, history, and sanctioned hunting traditions of your state charter..."
            />
          </div>

          <div>
            <label className="block font-bold text-forest-950 mb-1.5">Public Contact Info Footer</label>
            <input
              id="contact-info-input"
              type="text"
              value={cmsData.contactInfo}
              onChange={(e) => setCmsData({ ...cmsData, contactInfo: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl focus:border-forest-800 focus:outline-none font-medium text-forest-950 text-xs"
              placeholder="e.g. Email: contact@tnhunting.org | Phone: (865) 555-0192 | Headquarters: Nashville, TN"
            />
          </div>
        </div>

        {/* Form Bottom Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-surface-border">
          <div className="flex items-center gap-2 text-charcoal-muted text-[11px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Changes publish immediately to {window.location.origin}{publicPageSlug}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="preview-draft-btn"
              type="button"
              onClick={() => setIsPreviewModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 bg-surface-low hover:bg-surface-border/50 text-forest-950 font-extrabold text-xs rounded-xl border border-surface-border transition-colors cursor-pointer"
            >
              Preview Draft
            </button>
            <button
              id="save-publish-cms-btn"
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2.5 bg-forest-900 hover:bg-forest-950 disabled:opacity-75 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 text-tan-400" />
              <span>{isSaving ? 'Publishing Changes...' : 'Save & Publish Live Page'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* ========================================================= */}
      {/* INTERACTIVE LIVE PREVIEW MODAL */}
      {/* ========================================================= */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-lowest w-full max-w-4xl rounded-3xl shadow-2xl border border-surface-border overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Top Bar */}
            <div className="p-4 bg-forest-950 text-white flex items-center justify-between border-b border-forest-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="font-extrabold text-xs tracking-wide">Live Preview: {stateDisplayTitle}</span>
                <span className="text-[10px] text-tan-300 bg-forest-900 px-2 py-0.5 rounded border border-forest-700">Draft Simulation</span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={publicPageSlug}
                  target="_blank"
                  className="px-3 py-1 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-[11px] rounded-lg flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open Full Page</span>
                </Link>
                <button
                  id="close-preview-modal-btn"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="p-1 text-tan-200 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Realistic Public State Page Layout */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* 1. Announcement Banner Ticker */}
              {cmsData.enableBanner ? (
                <div className="p-3.5 bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-2xl border-2 border-tan-500/40 shadow-md flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-tan-400 animate-pulse"></span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-tan-500 text-forest-950">
                      {cmsData.bannerBadge}
                    </span>
                    <span className="font-bold text-tan-100">{cmsData.announcementBanner}</span>
                  </div>
                  <span className="text-[10px] text-tan-300 font-bold hidden sm:inline">Official Public Notice</span>
                </div>
              ) : (
                <div className="p-3 bg-surface-low rounded-xl border text-center text-xs text-charcoal-muted">
                  [Header Alert Ticker is currently disabled in CMS settings]
                </div>
              )}

              {/* 2. Hero Headline & Background Banner */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-surface-border">
                <img
                  src={cmsData.heroImage}
                  alt="Hero Preview"
                  className="w-full h-56 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/70 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white space-y-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 w-max shadow-sm">
                    {stateDisplayTitle}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {cmsData.heroTitle || 'Official Sanctioned Field Trials & Nite Hunts'}
                  </h2>
                  <p className="text-xs sm:text-sm text-tan-200 max-w-2xl font-medium leading-relaxed">
                    {cmsData.heroSubtitle}
                  </p>
                </div>
              </div>

              {/* 3. About Section Card */}
              <div className="p-6 rounded-2xl bg-surface-low border border-surface-border space-y-3">
                <h3 className="font-extrabold text-base text-forest-950 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-tan-600" />
                  <span>About {stateDisplayTitle}</span>
                </h3>
                <p className="text-xs text-charcoal leading-relaxed font-medium">
                  {cmsData.aboutContent}
                </p>
              </div>

              {/* 4. Public Contact Bar */}
              <div className="p-4 rounded-xl bg-forest-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-tan-300 font-bold">
                  <Mail className="w-4 h-4 text-tan-400" />
                  <span>{cmsData.contactInfo}</span>
                </div>
                <span className="text-[10px] text-tan-400 font-mono">UHC Certified State Charter</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-surface-low border-t border-surface-border flex items-center justify-between">
              <span className="text-xs text-charcoal-muted">Looking good? Click "Save & Publish" in the editor to make it live.</span>
              <button
                id="modal-close-bottom-btn"
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-4 py-2 bg-forest-900 text-white font-bold text-xs rounded-xl hover:bg-forest-950 transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
