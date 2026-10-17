import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Save,
  Eye,
  Globe,
  ExternalLink,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  X,
  Image as ImageIcon,
  Megaphone,
  User,
  Dog,
  Award
} from 'lucide-react';

export const ClubAdminClubPage = () => {
  const { clubs = [], updateClub, showToast } = useApp();
  
  // Find Oak Ridge Hunting Club or first club
  const myClub = clubs.find((c) => c.name?.toLowerCase().includes('oak ridge') || c.id === 'club-1') || clubs[0] || {};
  const clubId = myClub.id || 'club-1';

  // Load persisted CMS state or initialize from club data
  const [clubInfo, setClubInfo] = useState(() => {
    const saved = localStorage.getItem(`nh_club_cms_${clubId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      name: myClub.name || 'Oak Ridge Hunting Club',
      city: myClub.city || 'Knoxville',
      state: myClub.state || 'Tennessee',
      stateCode: myClub.stateCode || 'TN',
      zip: myClub.zip || '37901',
      address: myClub.address || '1420 Hunting Ridge Rd',
      estYear: myClub.estYear || 1978,
      dogType: myClub.dogType || 'Treeing Walker Coonhound',
      federation: myClub.federation || 'UKC (United Kennel Club)',
      heroTitle: 'Official Sanctioned Nite Hunts & Field Trials',
      heroSubtitle: 'Preserving Appalachian hound hunting heritage through sanctioned night trials, ethical sportsmanship, and youth mentorship.',
      description: myClub.description || 'Premier hunting club dedicated to competitive trials, sporting dogs, and youth mentorship. Chartered under the United Kennel Club and hosting annual sanctioned night championships.',
      enableAnnouncement: true,
      announcementBadge: 'FALL HUNT REGISTRATION',
      announcementText: 'Pre-signups for the Piney Woods Autumn Hunt are live. Check-in starts at 6:00 PM at the main clubhouse.',
      announcementLink: '/events',
      heroImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&auto=format&fit=crop&q=80',
      logo: myClub.logo || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120&auto=format&fit=crop&q=80',
      president: myClub.adminName || 'Robert Miller',
      masterOfHounds: 'Cody Campbell',
      phone: myClub.phone || '(865) 555-0192',
      email: myClub.email || 'robert.miller@oakridgehc.org',
      meetingSchedule: 'First Tuesday of every month at 7:00 PM (CT)',
      groundsDescription: 'Over 6,500 contiguous timbered acres with lighted cast stations, covered bench pavilions, and GPS telemetry antenna.',
      lastPublished: 'Oct 17, 2026, 6:30 PM'
    };
  });

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activePreset, setActivePreset] = useState(0);

  // Photo Presets for Club Hero
  const heroPresets = [
    {
      name: 'Autumn Timber Trials',
      url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&auto=format&fit=crop&q=80',
      desc: 'Golden Appalachian hardwoods canopy'
    },
    {
      name: 'Smoky Mountains Night Hunt',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
      desc: 'Nocturnal pine ridges and mist'
    },
    {
      name: 'Champion Coonhound Portrait',
      url: 'https://images.unsplash.com/photo-1531219432768-9f540ce91ef3?w=1200&auto=format&fit=crop&q=80',
      desc: 'Sanctioned bench show winner'
    },
    {
      name: 'River Country Speed Trial',
      url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&auto=format&fit=crop&q=80',
      desc: 'Water race and field course'
    }
  ];

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    const timestamp = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ', ' + new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const updatedData = {
      ...clubInfo,
      lastPublished: timestamp
    };

    setClubInfo(updatedData);
    localStorage.setItem(`nh_club_cms_${clubId}`, JSON.stringify(updatedData));

    if (updateClub) {
      await updateClub(clubId, {
        name: updatedData.name,
        city: updatedData.city,
        state: updatedData.state,
        zip: updatedData.zip,
        address: updatedData.address,
        description: updatedData.description,
        adminName: updatedData.president,
        phone: updatedData.phone,
        email: updatedData.email,
        logo: updatedData.logo
      });
    }

    setIsSaving(false);
    if (showToast) {
      showToast(`Published changes to ${updatedData.name} Public Portal!`, 'success');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20 px-2 sm:px-4">
      {/* Header Banner */}
      <div className="bg-forest-950 text-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-forest-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-tan-500 text-forest-950">
              Local Chartered Club CMS
            </span>
            <span className="text-[10px] text-tan-300 font-extrabold uppercase tracking-widest">
              Live Public Portal Editor
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight">
            Public Club Page Content Management (CMS)
          </h1>
          <p className="text-xs text-tan-200 opacity-90 max-w-2xl font-medium leading-relaxed">
            Manage public branding, hero announcements, clubhouse grounds address, and trial contact details for {clubInfo.name}.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-tan-400 font-bold pt-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Last Published: {clubInfo.lastPublished}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsPreviewModalOpen(true)}
            className="px-3.5 py-2.5 bg-forest-900 hover:bg-forest-850 text-tan-300 hover:text-white border border-forest-700 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Eye className="w-4 h-4 text-tan-400" />
            <span>Live Preview</span>
          </button>

          <Link
            to={`/clubs/${clubId}`}
            target="_blank"
            className="px-3.5 py-2.5 bg-forest-900 hover:bg-forest-850 text-tan-300 hover:text-white border border-forest-700 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <ExternalLink className="w-4 h-4 text-tan-400" />
            <span>View Public Page</span>
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 bg-tan-500 hover:bg-tan-600 text-forest-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>{isSaving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: Live Announcement & Alert Ticker */}
        <div className="bg-surface-lowest p-5 sm:p-6 rounded-2xl border border-surface-border shadow-ambient space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-tan-600 shrink-0" />
              <div>
                <h2 className="font-black text-sm sm:text-base text-forest-950">
                  Public Announcement & Hunt Alert Banner
                </h2>
                <p className="text-[11px] text-charcoal-muted">
                  Displays a prominent alert ticker on your club's public homepage.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs font-bold text-charcoal">Enable Banner:</span>
              <input
                type="checkbox"
                checked={clubInfo.enableAnnouncement}
                onChange={(e) => setClubInfo({ ...clubInfo, enableAnnouncement: e.target.checked })}
                className="w-4 h-4 accent-forest-900 rounded cursor-pointer"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-charcoal mb-1">Alert Badge</label>
              <input
                type="text"
                value={clubInfo.announcementBadge}
                onChange={(e) => setClubInfo({ ...clubInfo, announcementBadge: e.target.value })}
                placeholder="e.g. HUNT REGISTRATION ALERT"
                className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-charcoal mb-1">Announcement Message</label>
              <input
                type="text"
                value={clubInfo.announcementText}
                onChange={(e) => setClubInfo({ ...clubInfo, announcementText: e.target.value })}
                placeholder="Announcement headline shown to visitors..."
                className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Hero Presentation & Visual Banner */}
        <div className="bg-surface-lowest p-5 sm:p-6 rounded-2xl border border-surface-border shadow-ambient space-y-5">
          <div className="flex items-center gap-2 border-b border-surface-border pb-3">
            <ImageIcon className="w-5 h-5 text-tan-600 shrink-0" />
            <div>
              <h2 className="font-black text-sm sm:text-base text-forest-950">
                Hero Section Headline & Visual Imagery
              </h2>
              <p className="text-[11px] text-charcoal-muted">
                First impression seen by hound owners and trial competitors visiting your portal.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-charcoal mb-1">Hero Main Headline</label>
              <input
                type="text"
                value={clubInfo.heroTitle}
                onChange={(e) => setClubInfo({ ...clubInfo, heroTitle: e.target.value })}
                className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-bold text-sm focus:outline-none focus:border-forest-800"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Hero Subtitle & Tagline</label>
              <textarea
                rows={2}
                value={clubInfo.heroSubtitle}
                onChange={(e) => setClubInfo({ ...clubInfo, heroSubtitle: e.target.value })}
                className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
              />
            </div>

            {/* Photo Presets Selector */}
            <div>
              <label className="block font-bold text-charcoal mb-2">
                Curated Field Trial Imagery Presets (Click to Select)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {heroPresets.map((preset, idx) => {
                  const isSelected = clubInfo.heroImage === preset.url;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setActivePreset(idx);
                        setClubInfo({ ...clubInfo, heroImage: preset.url });
                      }}
                      className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all group ${
                        isSelected
                          ? 'border-tan-500 shadow-lg ring-2 ring-tan-500/40'
                          : 'border-surface-border hover:border-tan-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex flex-col justify-end">
                        <span className="text-[10px] font-black text-white leading-tight">
                          {preset.name}
                        </span>
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-tan-500 text-forest-950 rounded-full flex items-center justify-center font-bold text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-charcoal mb-1">Custom Banner Image URL</label>
                <input
                  type="text"
                  value={clubInfo.heroImage}
                  onChange={(e) => setClubInfo({ ...clubInfo, heroImage: e.target.value })}
                  className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-mono text-[11px] focus:outline-none focus:border-forest-800"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">Club Logo Badge URL</label>
                <div className="flex items-center gap-2">
                  <img
                    src={clubInfo.logo}
                    alt="Logo preview"
                    className="w-9 h-9 rounded-xl object-cover border border-surface-border shrink-0"
                  />
                  <input
                    type="text"
                    value={clubInfo.logo}
                    onChange={(e) => setClubInfo({ ...clubInfo, logo: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-mono text-[11px] focus:outline-none focus:border-forest-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Club Identity & Historical Charter */}
        <div className="bg-surface-lowest p-5 sm:p-6 rounded-2xl border border-surface-border shadow-ambient space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-border pb-3">
            <ShieldCheck className="w-5 h-5 text-tan-600 shrink-0" />
            <div>
              <h2 className="font-black text-sm sm:text-base text-forest-950">
                Club Identity & Sanctioned Charter Details
              </h2>
              <p className="text-[11px] text-charcoal-muted">
                Official club name, founding heritage, and registered kennel club affiliations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-charcoal mb-1">Official Club Name</label>
              <input
                type="text"
                value={clubInfo.name}
                onChange={(e) => setClubInfo({ ...clubInfo, name: e.target.value })}
                className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-bold focus:outline-none focus:border-forest-800"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Charter Year Established</label>
              <input
                type="number"
                value={clubInfo.estYear}
                onChange={(e) => setClubInfo({ ...clubInfo, estYear: Number(e.target.value) })}
                className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Affiliated Kennel Federations</label>
              <input
                type="text"
                value={clubInfo.federation}
                onChange={(e) => setClubInfo({ ...clubInfo, federation: e.target.value })}
                placeholder="UKC, PKC, AKC"
                className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-bold text-charcoal mb-1">Primary Sporting Dog Breeds</label>
              <input
                type="text"
                value={clubInfo.dogType}
                onChange={(e) => setClubInfo({ ...clubInfo, dogType: e.target.value })}
                placeholder="Treeing Walker Coonhound, Bluetick, English Redtick"
                className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-bold text-charcoal mb-1">About / Historic Club Narrative</label>
              <textarea
                rows={4}
                value={clubInfo.description}
                onChange={(e) => setClubInfo({ ...clubInfo, description: e.target.value })}
                className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Clubhouse Grounds & Meeting Location */}
        <div className="bg-surface-lowest p-5 sm:p-6 rounded-2xl border border-surface-border shadow-ambient space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-border pb-3">
            <MapPin className="w-5 h-5 text-tan-600 shrink-0" />
            <div>
              <h2 className="font-black text-sm sm:text-base text-forest-950">
                Clubhouse Grounds & Trial Meeting Location
              </h2>
              <p className="text-[11px] text-charcoal-muted">
                Physical meeting location, trial bench address, and grounds schedule for handlers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-charcoal mb-1">Physical Clubhouse Address</label>
              <input
                type="text"
                value={clubInfo.address}
                onChange={(e) => setClubInfo({ ...clubInfo, address: e.target.value })}
                className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">City</label>
              <input
                type="text"
                value={clubInfo.city}
                onChange={(e) => setClubInfo({ ...clubInfo, city: e.target.value })}
                className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">State & ZIP</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={clubInfo.state}
                  onChange={(e) => setClubInfo({ ...clubInfo, state: e.target.value })}
                  className="w-1/2 p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
                />
                <input
                  type="text"
                  value={clubInfo.zip}
                  onChange={(e) => setClubInfo({ ...clubInfo, zip: e.target.value })}
                  className="w-1/2 p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-charcoal mb-1">Monthly Meeting Schedule</label>
              <input
                type="text"
                value={clubInfo.meetingSchedule}
                onChange={(e) => setClubInfo({ ...clubInfo, meetingSchedule: e.target.value })}
                placeholder="e.g. First Tuesday of every month at 7:00 PM"
                className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-charcoal mb-1">Trial Grounds Description</label>
              <input
                type="text"
                value={clubInfo.groundsDescription}
                onChange={(e) => setClubInfo({ ...clubInfo, groundsDescription: e.target.value })}
                className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: Leadership & Public Inquiries Contact */}
        <div className="bg-surface-lowest p-5 sm:p-6 rounded-2xl border border-surface-border shadow-ambient space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-border pb-3">
            <User className="w-5 h-5 text-tan-600 shrink-0" />
            <div>
              <h2 className="font-black text-sm sm:text-base text-forest-950">
                Club Leadership & Public Contact Directory
              </h2>
              <p className="text-[11px] text-charcoal-muted">
                Official contact methods shown to public visitors, new members, and trial entrants.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-bold text-charcoal mb-1">Club President</label>
              <input
                type="text"
                value={clubInfo.president}
                onChange={(e) => setClubInfo({ ...clubInfo, president: e.target.value })}
                className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Master of Hounds</label>
              <input
                type="text"
                value={clubInfo.masterOfHounds}
                onChange={(e) => setClubInfo({ ...clubInfo, masterOfHounds: e.target.value })}
                className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Official Contact Phone</label>
              <input
                type="text"
                value={clubInfo.phone}
                onChange={(e) => setClubInfo({ ...clubInfo, phone: e.target.value })}
                className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Official Email Inquiries</label>
              <input
                type="email"
                value={clubInfo.email}
                onChange={(e) => setClubInfo({ ...clubInfo, email: e.target.value })}
                className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
              />
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-surface-lowest rounded-2xl border border-surface-border shadow-md gap-3">
          <div className="text-xs text-charcoal-muted text-center sm:text-left">
            Clicking <strong>Save & Publish</strong> synchronizes data across the public club page and mobile directory.
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(true)}
              className="px-4 py-2 bg-surface-low hover:bg-surface-border text-charcoal font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Preview
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-forest-900 hover:bg-forest-950 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-tan-400 stroke-[2.5]" />
              <span>{isSaving ? 'Publishing...' : 'Update & Publish Public Page'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* LIVE PREVIEW MODAL */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-surface-lowest border border-surface-border rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl space-y-6 p-6 animate-scale-up">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-black text-base text-forest-950">
                  Live Public Club Page Simulation ({clubInfo.name})
                </h3>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-surface-low text-charcoal-muted hover:text-charcoal cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Announcement Alert Simulation */}
            {clubInfo.enableAnnouncement && (
              <div className="p-3 bg-amber-500/15 border border-amber-500/40 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-forest-950 font-black text-[10px] uppercase">
                    {clubInfo.announcementBadge}
                  </span>
                  <span className="font-bold text-forest-950">{clubInfo.announcementText}</span>
                </div>
                <span className="text-tan-800 font-extrabold hover:underline">Learn More →</span>
              </div>
            )}

            {/* Hero Simulation */}
            <div className="relative rounded-2xl overflow-hidden border border-forest-800 shadow-xl bg-forest-950 text-white min-h-[220px] flex flex-col justify-end p-6">
              <img
                src={clubInfo.heroImage}
                alt="Hero banner"
                className="absolute inset-0 w-full h-full object-cover opacity-35"
              />
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-3">
                  <img
                    src={clubInfo.logo}
                    alt="Logo"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-tan-400 shadow"
                  />
                  <div>
                    <span className="text-[10px] font-black uppercase text-tan-400 tracking-wider">
                      {clubInfo.state} Chartered Club • Est. {clubInfo.estYear}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-white">{clubInfo.name}</h1>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-tan-200 max-w-2xl font-medium">
                  {clubInfo.heroSubtitle}
                </p>
                <div className="flex items-center gap-2 text-xs text-tan-300 font-semibold pt-1">
                  <MapPin className="w-3.5 h-3.5 text-tan-400" />
                  <span>
                    {clubInfo.address}, {clubInfo.city}, {clubInfo.state} {clubInfo.zip}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Preview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-surface-low rounded-xl border border-surface-border space-y-2">
                <span className="text-[10px] uppercase font-black text-charcoal-muted tracking-wider">
                  Club Mission & Heritage
                </span>
                <p className="font-medium text-charcoal leading-relaxed">{clubInfo.description}</p>
                <div className="pt-2 border-t border-surface-border text-charcoal-muted text-[11px]">
                  <strong>Sanctioned:</strong> {clubInfo.federation} • <strong>Breeds:</strong> {clubInfo.dogType}
                </div>
              </div>

              <div className="p-4 bg-surface-low rounded-xl border border-surface-border space-y-2">
                <span className="text-[10px] uppercase font-black text-charcoal-muted tracking-wider">
                  Meetings & Field Grounds
                </span>
                <div className="space-y-1.5 text-charcoal">
                  <div className="flex items-center gap-1.5 font-bold text-forest-950">
                    <Calendar className="w-3.5 h-3.5 text-tan-600 shrink-0" />
                    <span>{clubInfo.meetingSchedule}</span>
                  </div>
                  <p className="text-charcoal-muted text-[11px]">{clubInfo.groundsDescription}</p>
                  <div className="pt-2 border-t border-surface-border space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Phone className="w-3 h-3 text-tan-600" />
                      <span>{clubInfo.phone} ({clubInfo.president})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Mail className="w-3 h-3 text-tan-600" />
                      <span>{clubInfo.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-surface-border">
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-4 py-2 bg-surface-low hover:bg-surface-border text-charcoal font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  setIsPreviewModalOpen(false);
                  handleSave();
                }}
                className="px-5 py-2 bg-forest-900 text-white font-black text-xs rounded-xl shadow-md cursor-pointer hover:bg-forest-950"
              >
                Publish Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
