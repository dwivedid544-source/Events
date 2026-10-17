import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PreSignUpModal } from '../../components/events/PreSignUpModal';
import { Modal } from '../../components/common/Modal';
import {
  Building2,
  MapPin,
  Calendar,
  Users,
  Trophy,
  Award,
  Mail,
  Phone,
  ShieldCheck,
  UserCheck,
  Search,
  ShoppingBag,
  ChevronRight,
  ArrowRight,
  Filter,
  Image as ImageIcon,
  DollarSign,
  Gavel,
  History,
  Info,
  Clock,
  HeartHandshake,
  Send
} from 'lucide-react';

export const PublicClubPage = () => {
  const { clubId } = useParams();
  const { clubs, events, products, news, results, states, addToCart, showToast, submitClaimRequest } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('');
  const [selectedEventForPreSignUp, setSelectedEventForPreSignUp] = useState(null);
  const [activeTab, setActiveTab] = useState('HOME');
  const [selectedMerchCategory, setSelectedMerchCategory] = useState('All');

  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimForm, setClaimForm] = useState({
    applicant: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    submitClaimRequest({
      club: club.name,
      state: club.stateCode || club.state,
      ...claimForm
    });
    setClaimForm({ applicant: '', email: '', phone: '', message: '' });
    setIsClaimModalOpen(false);
  };

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // 11 EXACT CLIENT-REQUIRED LOCAL CLUB NAVIGATION ITEMS
  const clubNavItems = [
    { id: 'HOME', label: 'HOME', href: '#home' },
    { id: 'ABOUT', label: 'ABOUT', href: '#about' },
    { id: 'EVENTS', label: 'EVENTS', href: '#events' },
    { id: 'NEWS', label: 'NEWS', href: '#news' },
    { id: 'RESULTS', label: 'RESULTS', href: '#results' },
    { id: 'MEMBERSHIP', label: 'MEMBERSHIP', href: '#membership' },
    { id: 'MERCHANDISE', label: 'MERCHANDISE', href: '#merchandise' },
    { id: 'DONATIONS', label: 'DONATIONS', href: '#donations' },
    { id: 'OFFICERS', label: 'OFFICERS', href: '#officers' },
    { id: 'PHOTOS', label: 'PHOTOS', href: '#photos' },
    { id: 'CONTACT', label: 'CONTACT', href: '#contact' },
  ];

  // Find club by ID or default to Houston County Coon Hunters Association (or first club)
  const isDedicatedPage = Boolean(clubId);
  const currentClub = clubs.find(
    (c) => c.id === clubId || c.name.toLowerCase().includes(clubId?.toLowerCase())
  );

  const club = currentClub || clubs.find((c) => c.id === 'club-tx-houston') || clubs[0];

  // Scoped Data for this specific local club
  const clubEvents = events.filter((e) => e.club === club.name || e.clubId === club.id);
  const clubProducts = products.filter(
    (p) =>
      (p.scopeChannel === 'LOCAL_CLUB' || p.organizationType === 'CLUB') &&
      (p.scopeEntity === club.name || p.organizationId === club.id)
  );
  const displayProducts = clubProducts.length > 0 ? clubProducts : products.filter((p) => p.scopeChannel === 'LOCAL_CLUB');

  const clubNews = news.filter((n) => n.summary?.includes(club.name) || n.author?.includes(club.name) || n.state === club.state);
  const clubResults = results.filter((r) => r.club === club.name || r.state === club.state);

  const clubLogo = club.logo || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120&auto=format&fit=crop&q=80';

  const clubHistory = club.history || `Founded in ${club.estYear || 1985}, the ${club.name} was established by local houndsmen in ${club.city}, ${club.state} to preserve night hunting traditions, ethical field trials, and youth sporting dog mentorship. Over the past four decades, the association has grown into a premier chartered chapter hosting state-sanctioned night hunts and water races.`;

  const clubLocation = {
    address: club.address || `450 Piney Woods Club Rd`,
    city: club.city || 'Crockett',
    county: club.county || 'Houston County',
    state: club.state || 'Texas',
    zip: club.zip || '75835',
    mapCoordinates: '31.3188° N, 95.4566° W'
  };

  const clubOfficers = [
    { name: club.adminName || 'Marcus Vance', title: 'Club President', term: '2025 - 2027', phone: '(936) 555-0182', email: `president@${club.id || 'houston'}hc.org`, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { name: 'Cody Campbell', title: 'Vice President & Master of Hounds', term: '2026 - 2028', phone: '(936) 555-0193', email: `vpresident@${club.id || 'houston'}hc.org`, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { name: 'Sarah Jenkins', title: 'Secretary & Treasurer', term: '2025 - 2027', phone: '(936) 555-0194', email: `treasurer@${club.id || 'houston'}hc.org`, photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' }
  ];

  const contactInfo = {
    phone: '(936) 555-0182',
    email: `contact@${club.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.org`,
    physicalAddress: `${clubLocation.address}, ${clubLocation.city}, ${clubLocation.state} ${clubLocation.zip}`,
    officeHours: 'Monday - Friday: 8:00 AM - 5:00 PM (CT)'
  };

  const affiliatedFederations = [
    { name: 'UKC (United Kennel Club)', status: 'Officially Chartered', code: 'UKC' },
    { name: 'PKC (Professional Kennel Club)', status: 'Sanctioned Partner', code: 'PKC' },
    { name: 'AKC (American Kennel Club)', status: 'Affiliated Chapter', code: 'AKC' },
    { name: 'UHC (Ultimate Hound Club)', status: 'National Charter Chapter', code: 'UHC' }
  ];

  const clubSponsors = [
    { name: 'East Texas Feed & Grain', category: 'Official Feed Supplier', logo: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=150&auto=format&fit=crop&q=80' },
    { name: 'Crockett Hardware & Supply', category: 'Clubhouse Maintenance Partner', logo: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=150&auto=format&fit=crop&q=80' },
    { name: 'Garmin Outdoor Telemetry', category: 'GPS Tracking Equipment', logo: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=150&auto=format&fit=crop&q=80' },
    { name: 'Filson Heritage Outdoors', category: 'Trial Apparel Partner', logo: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=150&auto=format&fit=crop&q=80' }
  ];

  const clubPhotos = [
    { title: 'Piney Woods Trial Grounds', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&auto=format&fit=crop&q=80', caption: 'Official night hunt course' },
    { title: 'State Championship Winners', url: 'https://images.unsplash.com/photo-1531219432768-9f540ce91ef3?w=500&auto=format&fit=crop&q=80', caption: 'Bench show champion handlers' },
    { title: 'Youth Handling Workshop', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80', caption: 'Junior handlers clinic' },
    { title: 'Creek Water Race Event', url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=500&auto=format&fit=crop&q=80', caption: 'Speed water race line trial' }
  ];

  const clubFundraisers = [
    { title: 'Piney Woods Clubhouse & Kennel Repair Fund', goal: 5000, raised: 3850, desc: 'Raising funds to upgrade outdoor judge stands and night lighting along the trial course.' },
    { title: 'Youth Handler Scholarship & Free Registration Drive', goal: 2500, raised: 2100, desc: 'Covering event entry fees and travel expenses for junior handlers under 18.' }
  ];

  const clubAuctions = [
    { title: 'Handcrafted Engraved Leather Tracking Belt', currentBid: 185, topBidder: 'Austin Sterling', endsIn: '2 days', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&auto=format&fit=crop&q=80' },
    { title: 'Vintage Brass Nite Lite Hunting Lantern (1974 Edition)', currentBid: 240, topBidder: 'Robert Miller', endsIn: '5 days', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&auto=format&fit=crop&q=80' }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    showToast(`Thank you! Your message has been sent to ${club.name}.`, 'success');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  // VIEW 1: Local Clubs Directory Listing (/clubs)
  if (!isDedicatedPage) {
    const filteredClubs = clubs.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.state.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesState = !selectedStateFilter || c.stateCode === selectedStateFilter || c.state === selectedStateFilter;
      return matchesSearch && matchesState;
    });

    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-10">
        <div className="bg-forest-950 text-white rounded-3xl p-8 lg:p-12 border border-forest-800 shadow-2xl space-y-6">
          <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
            Local Club Directory
          </span>
          <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight">
            Local Chartered Clubs
          </h1>
          <p className="text-xs sm:text-sm text-tan-200 max-w-2xl font-medium leading-relaxed">
            Select a local club below to view its dedicated small website with HOME, ABOUT, EVENTS, NEWS, RESULTS, MEMBERSHIP, MERCHANDISE, OFFICERS, PHOTOS, and CONTACT.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search club name, city, or zip..."
                className="w-full pl-10 pr-4 py-3 text-xs bg-surface-lowest text-charcoal border border-surface-border rounded-xl font-semibold focus:outline-none focus:border-tan-500"
              />
            </div>

            <div className="w-full sm:w-48">
              <select
                value={selectedStateFilter}
                onChange={(e) => setSelectedStateFilter(e.target.value)}
                className="w-full px-3 py-3 text-xs bg-surface-lowest border border-surface-border rounded-xl font-bold text-charcoal focus:border-tan-500 cursor-pointer"
              >
                <option value="">All States</option>
                {states.map((s) => (
                  <option key={s.id} value={s.code}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((c) => (
            <div key={c.id} className="group bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient p-6 flex flex-col justify-between hover:shadow-2xl hover:border-tan-500/60 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img src={c.logo} alt={c.name} className="w-14 h-14 rounded-2xl object-cover border border-surface-border shrink-0 shadow" />
                  <div>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-tan-100 text-tan-900">
                      {c.stateCode} Chartered
                    </span>
                    <h3 className="font-black text-base text-forest-950 group-hover:text-tan-700 transition-colors mt-0.5">
                      {c.name}
                    </h3>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-charcoal-muted font-medium pt-2 border-t border-surface-border">
                  <div className="flex justify-between"><span>Location:</span><span className="font-bold text-charcoal">{c.city}, {c.stateCode}</span></div>
                  <div className="flex justify-between"><span>Active Roster:</span><span className="font-bold text-charcoal">{c.membersCount} Members</span></div>
                </div>
              </div>
              <div className="pt-6">
                <Link to={`/clubs/${c.id}`} className="w-full py-2.5 bg-forest-900 hover:bg-forest-950 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1 transition-all">
                  <span>Open Club Page</span>
                  <ChevronRight className="w-4 h-4 text-tan-400" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // VIEW 2: Dedicated Local Club Page (/clubs/:clubId)
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Hierarchy Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-bold text-charcoal-muted">
        <Link to="/" className="hover:text-forest-950 transition-colors">National</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/states/${club.stateId || 'tx'}`} className="hover:text-forest-950 transition-colors">{club.state} State Association</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-forest-950 font-black">{club.name}</span>
      </div>

      {/* 🧭 EXACT 10 CLIENT REQUIRED LOCAL CLUB NAVIGATION ITEMS */}
      {/* HOME, ABOUT, EVENTS, NEWS, RESULTS, MEMBERSHIP, MERCHANDISE, OFFICERS, PHOTOS, CONTACT */}
      <nav className="sticky top-16 z-40 bg-surface-lowest/95 backdrop-blur-md p-1.5 rounded-2xl border border-surface-border shadow-xl overflow-x-auto flex items-center gap-1 scrollbar-none">
        {clubNavItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black tracking-wide whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-forest-950 text-tan-300 shadow-md ring-2 ring-tan-500/50'
                  : 'text-charcoal hover:bg-surface-low hover:text-forest-950'
              }`}
            >
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* 1. HOME SECTION */}
      <section id="home" className="space-y-6">
        <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-tan-500/40 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              {/* Club Logo */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-tan-500/20 border-2 border-tan-400 overflow-hidden shrink-0 shadow-xl flex items-center justify-center">
                <img src={clubLogo} alt={club.name} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
                    Official Local Club Portal
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-forest-900 text-tan-300 border border-forest-700">
                    {club.stateCode} Charter
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                  {club.name}
                </h1>

                <p className="text-xs sm:text-sm text-tan-200 font-medium flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-tan-400" />
                  <span>{clubLocation.address}, {clubLocation.city}, {clubLocation.state} ({clubLocation.zip})</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => setIsClaimModalOpen(true)}
                className="px-5 py-3 bg-forest-900 border border-forest-750 hover:bg-forest-950 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-tan-400" />
                <span>Claim Page</span>
              </button>
              <Link
                to={`/join-club/${club.id}`}
                className="px-5 py-3 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Join {club.name}</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-forest-800 text-center text-xs">
            <div className="p-3 rounded-xl bg-forest-900/80 border border-forest-800">
              <strong className="block font-black text-tan-300 text-lg sm:text-xl">{club.membersCount || 88}</strong>
              <span className="text-[10px] text-tan-200 uppercase font-bold">Active Members</span>
            </div>
            <div className="p-3 rounded-xl bg-forest-900/80 border border-forest-800">
              <strong className="block font-black text-tan-300 text-lg sm:text-xl">{clubEvents.length || 6}</strong>
              <span className="text-[10px] text-tan-200 uppercase font-bold">Annual Hunts</span>
            </div>
            <div className="p-3 rounded-xl bg-forest-900/80 border border-forest-800">
              <strong className="block font-black text-tan-300 text-lg sm:text-xl">{club.entriesCount || 240}</strong>
              <span className="text-[10px] text-tan-200 uppercase font-bold">Total Entries</span>
            </div>
            <div className="p-3 rounded-xl bg-forest-900/80 border border-forest-800">
              <strong className="block font-black text-emerald-400 text-lg sm:text-xl">${club.revenue?.toLocaleString() || '9,200'}</strong>
              <span className="text-[10px] text-tan-200 uppercase font-bold">Club Treasury</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-forest-950 flex items-center gap-2">
            <History className="w-5 h-5 text-tan-600" />
            <span>About {club.name}</span>
          </h2>
          <p className="text-xs sm:text-sm text-charcoal leading-relaxed font-medium">
            {clubHistory}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-surface-border text-xs font-medium">
            <div className="p-3 rounded-xl bg-surface-low border border-surface-border space-y-1">
              <strong className="block font-black text-forest-950">Mission Statement</strong>
              <p className="text-charcoal-muted">Promoting ethical sporting dog trials, night hunts, treeing contests, and youth mentorship across {club.county || club.city}.</p>
            </div>
            <div className="p-3 rounded-xl bg-surface-low border border-surface-border space-y-1">
              <strong className="block font-black text-forest-950">Affiliated Federations</strong>
              <div className="flex flex-wrap gap-1 pt-1">
                {affiliatedFederations.map((fed) => (
                  <span key={fed.code} className="px-2 py-0.5 rounded text-[9px] font-black bg-forest-900 text-tan-300">
                    {fed.code}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Location Info Card */}
        <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-4">
          <h3 className="font-extrabold text-base text-forest-950 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-tan-600" />
            <span>Club Location Details</span>
          </h3>

          <div className="space-y-3 text-xs font-medium">
            <div className="p-3.5 rounded-xl bg-surface-low border border-surface-border space-y-1">
              <span className="text-[10px] font-black uppercase text-tan-800">Trial Grounds Address</span>
              <div className="font-extrabold text-forest-950">{clubLocation.address}</div>
              <div className="text-charcoal-muted">{clubLocation.city}, {clubLocation.state} {clubLocation.zip}</div>
              <div className="text-[10px] text-forest-800 font-mono pt-1">County: {clubLocation.county}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-low border border-surface-border space-y-1">
              <span className="text-[10px] font-black uppercase text-tan-800">GPS Coordinates</span>
              <div className="font-mono text-forest-950 font-bold">{clubLocation.mapCoordinates}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EVENTS SECTION */}
      <section id="events" className="space-y-6">
        <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-forest-950 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-tan-600" />
              <span>Upcoming Club Events ({clubEvents.length})</span>
            </h2>
            <Link to="/find-hunt" className="text-xs font-bold text-forest-800 hover:underline">View All Hunts</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clubEvents.map((evt) => (
              <div key={evt.id} className="p-5 bg-surface-low rounded-2xl border border-surface-border space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-tan-500 text-forest-950">
                      {evt.type}
                    </span>
                    <span className="text-xs font-black text-forest-950">${evt.fee} Entry Fee</span>
                  </div>
                  <h4 className="font-extrabold text-base text-forest-950">{evt.name}</h4>
                  <div className="text-xs text-charcoal-muted font-medium">
                    {evt.date} @ {evt.startTime} • {evt.city}, {evt.state}
                  </div>
                </div>

                <div className="pt-2 border-t border-surface-border flex items-center justify-between">
                  <button
                    onClick={() => setSelectedEventForPreSignUp(evt)}
                    className="px-3.5 py-1.5 bg-tan-500 hover:bg-tan-600 text-forest-950 font-black text-xs rounded-xl shadow cursor-pointer transition-all"
                  >
                    Pre-Sign Up
                  </button>
                  <Link to={`/find-hunt?event=${evt.id}`} className="text-xs font-extrabold text-forest-800 hover:text-tan-700">
                    Event Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. NEWS SECTION */}
      <section id="news" className="space-y-6">
        <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-forest-950 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-tan-600" />
            <span>Club News & Bulletins</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(clubNews.length > 0 ? clubNews : [
              { id: 'cn-1', title: 'Monthly Club Meeting Scheduled for First Tuesday', date: 'Aug 10, 2026', summary: 'All Houston County members invited to discuss fall trial grounds preparation and youth scholarships.' },
              { id: 'cn-2', title: 'Piney Woods Trial Grounds Lighting Upgrade Completed', date: 'Aug 02, 2026', summary: 'Dual LED light bars installed along the cast release grounds for safety during night hunts.' }
            ]).map((n) => (
              <div key={n.id} className="p-4 bg-surface-low rounded-2xl border border-surface-border space-y-1">
                <span className="text-[10px] font-black uppercase text-tan-700 bg-tan-100 px-2 py-0.5 rounded">{n.date}</span>
                <h4 className="font-extrabold text-xs sm:text-sm text-forest-950">{n.title}</h4>
                <p className="text-xs text-charcoal-muted leading-relaxed">{n.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. RESULTS SECTION */}
      <section id="results" className="space-y-6">
        <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-forest-950 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-tan-600" />
              <span>Recent Hunt Results</span>
            </h2>
            <Link to="/results" className="text-xs font-bold text-forest-800 hover:underline">All Results</Link>
          </div>

          <div className="space-y-3">
            {(clubResults.length > 0 ? clubResults : [
              { id: 'res-h1', eventName: 'Houston County Autumn Night Hunt', date: 'Aug 05, 2026', winnerDog: 'Lone Star Rebel', owner: 'Austin Sterling', score: '375+ Circle', placement: '1st Place' },
              { id: 'res-h2', eventName: 'Houston County Speed Water Race', date: 'Jul 22, 2026', winnerDog: 'Timberline Bell', owner: 'Lalit Panchole', score: 'Line & Tree First', placement: '1st Place' }
            ]).map((r) => (
              <div key={r.id} className="p-4 bg-surface-low rounded-2xl border border-surface-border flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-forest-950">{r.eventName}</h4>
                  <div className="text-[11px] text-charcoal-muted mt-0.5">{r.date} • Winner: {r.winnerDog} ({r.owner})</div>
                </div>
                <span className="px-3 py-1 rounded-lg bg-tan-500 text-forest-950 font-black text-xs shrink-0">
                  {r.placement} ({r.score})
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MEMBERSHIP SECTION */}
      <section id="membership" className="space-y-6">
        <div className="bg-forest-950 text-white p-6 sm:p-8 rounded-3xl border-2 border-tan-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950">
              Local Club Membership Signup
            </span>
            <h2 className="text-2xl font-black text-white">Join {club.name}</h2>
            <p className="text-xs text-tan-200 font-medium leading-relaxed">
              Become an official chartered member of {club.name} for $25.00/year to qualify for local hunt entries, voting rights in club officer elections, and access to local trial grounds.
            </p>

            <div className="p-3 rounded-xl bg-forest-900 border border-forest-800 text-xs space-y-1 font-medium">
              <div className="flex justify-between"><span>Annual Dues:</span><strong className="text-tan-400">$25.00/year</strong></div>
              <div className="flex justify-between"><span>Assigned Club:</span><strong className="text-white">{club.name}</strong></div>
              <div className="flex justify-between"><span>Parent State Charter:</span><strong className="text-white">{club.state} Association</strong></div>
            </div>
          </div>

          <Link
            to={`/join-club/${club.id}`}
            className="px-6 py-3.5 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 shrink-0 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Join {club.name}</span>
          </Link>
        </div>
      </section>

      {/* 7. LOCAL CLUB MERCHANDISE STORE SECTION */}
      <section id="merchandise" className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-6">
        {/* Store Title & Ongoing Fundraising System Banner */}
        <div className="border-b border-surface-border pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950">
                Official Local Club Store
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                Ongoing Automated Fundraising System
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-forest-950">
              {club.name.replace(' Association', '')} Store
            </h2>
            <p className="text-xs text-charcoal-muted max-w-2xl font-medium">
              The {club.name} Store provides an ongoing fundraising system to maintain trial grounds, clubhouse facilities, and youth prize pots without constantly asking members for direct donations. 100% of the retail profit margin on every purchase is automatically credited to the {club.name} treasury.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-950/10 border border-emerald-600/30 text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Club Treasury Earned to Date</span>
            <span className="text-xl font-black text-emerald-800">$2,840.00</span>
          </div>
        </div>

        {/* 7 Exact Product Type Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            'All',
            'Club shirts',
            'Club hats',
            'Event shirts',
            'Hunting supplies',
            'Dog products',
            'Sponsor products',
            'UHC marketplace products'
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedMerchCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                selectedMerchCategory === cat
                  ? 'bg-forest-950 text-white shadow-md'
                  : 'bg-surface-low text-charcoal hover:bg-surface-border'
              }`}
            >
              {cat === 'All' ? 'All Products (7 Types)' : cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            // 1. Club shirts
            {
              id: `club-merch-1-${club.id}`,
              name: `${club.name} Official Chapter Logo T-Shirt`,
              category: 'Club shirts',
              price: 26.00,
              wholesaleCost: 12.00,
              profit: 14.00,
              image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80',
              description: `Heavyweight 100% cotton crewneck with official ${club.name} emblem. 100% profit goes to club treasury.`
            },
            // 2. Club hats
            {
              id: `club-merch-2-${club.id}`,
              name: `${club.name} Embroidered Mesh-Back Cap`,
              category: 'Club hats',
              price: 28.00,
              wholesaleCost: 14.00,
              profit: 14.00,
              image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&auto=format&fit=crop&q=80',
              description: `Structured breathable mesh-back hunting cap with custom embroidered ${club.name} patch.`
            },
            // 3. Event shirts
            {
              id: `club-merch-3-${club.id}`,
              name: `${club.state} Autumn Championship Hunt Commemorative Shirt`,
              category: 'Event shirts',
              price: 32.00,
              wholesaleCost: 16.00,
              profit: 16.00,
              image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&auto=format&fit=crop&q=80',
              description: `Official state championship commemorative long-sleeve tee with sanctioned hunt roster on back.`
            },
            // 4. Hunting supplies
            {
              id: `club-merch-4-${club.id}`,
              name: `Southern Timber 4000-Lumen High-Beam LED Spotlight`,
              category: 'Hunting supplies',
              price: 89.00,
              wholesaleCost: 45.00,
              profit: 44.00,
              image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&auto=format&fit=crop&q=80',
              description: `Rechargeable hands-free headlamp spotlight tuned for spotting treeing coonhounds in tall river bottoms.`
            },
            {
              id: `club-merch-4b-${club.id}`,
              name: `Acoustic Brass Treeing Bell & Quick-Release Snap`,
              category: 'Hunting supplies',
              price: 24.00,
              wholesaleCost: 10.00,
              profit: 14.00,
              image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
              description: `Heavy resonant acoustic brass bell tuned for locating dogs in dense thickets.`
            },
            // 5. Dog products
            {
              id: `club-merch-5-${club.id}`,
              name: `Apex BioThane Waterproof Treeing Hound Lead`,
              category: 'Dog products',
              price: 45.00,
              wholesaleCost: 22.00,
              profit: 23.00,
              image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&auto=format&fit=crop&q=80',
              description: `10-foot weatherproof BioThane treeing lead with corrosion-resistant brass snap hardware.`
            },
            {
              id: `club-merch-5b-${club.id}`,
              name: `Padded Strike Tracking Harness for Coonhounds`,
              category: 'Dog products',
              price: 59.00,
              wholesaleCost: 32.00,
              profit: 27.00,
              image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop&q=80',
              description: `Ergonomic padded tracking harness to protect canine chest during tough timber trials.`
            },
            // 6. Sponsor products
            {
              id: `club-merch-6-${club.id}`,
              name: `Garmin Alpha GPS Handheld & TT 15X Tracking Bundle`,
              category: 'Sponsor products',
              price: 799.00,
              wholesaleCost: 590.00,
              profit: 209.00,
              image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&auto=format&fit=crop&q=80',
              description: `Official UHC Gold Sponsor Garmin tracking system with 9-mile range and live hunt statistics.`
            },
            {
              id: `club-merch-6b-${club.id}`,
              name: `Purina Pro Plan Sport Performance 30/20 Formula (37.5 lb)`,
              category: 'Sponsor products',
              price: 74.00,
              wholesaleCost: 48.00,
              profit: 26.00,
              image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&auto=format&fit=crop&q=80',
              description: `Official sponsor canine nutrition formulated to fuel hunting endurance and rapid muscle recovery.`
            },
            // 7. UHC marketplace products
            {
              id: `club-merch-7-${club.id}`,
              name: `UHC National Championship Heavyweight Hoodie`,
              category: 'UHC marketplace products',
              price: 68.00,
              wholesaleCost: 35.00,
              profit: 33.00,
              image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&auto=format&fit=crop&q=80',
              description: `Official UHC national championship pullover hoodie. Portion of sale funds local club treasury.`
            },
            {
              id: `club-merch-7b-${club.id}`,
              name: `Official UHC Woven Iron-On Emblem Patch Pack (5-Pack)`,
              category: 'UHC marketplace products',
              price: 20.00,
              wholesaleCost: 10.00,
              profit: 10.00,
              image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
              description: `Set of 5 embroidered official Ultimate Hound Club national registry patches.`
            }
          ]
            .filter((p) => selectedMerchCategory === 'All' || p.category === selectedMerchCategory)
            .map((p) => (
              <div
                key={p.id}
                className="group bg-surface-low rounded-2xl border border-surface-border overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 bg-surface-lowest overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-forest-950/90 text-tan-300 backdrop-blur-xs">
                    {p.category}
                  </span>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-black text-sm text-forest-950 group-hover:text-tan-700 transition-colors line-clamp-1">
                      {p.name}
                    </h4>
                    <p className="text-xs text-charcoal-muted line-clamp-2 mt-1 leading-relaxed font-medium">
                      {p.description}
                    </p>
                  </div>

                  {/* Club Profit Margin & Retail Price */}
                  <div className="p-2.5 rounded-xl bg-surface-lowest border border-surface-border space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] text-charcoal-muted uppercase font-bold">Price</span>
                      <span className="text-base font-black text-forest-950">${p.price.toFixed(2)}</span>
                    </div>

                    <div className="text-[10px] font-extrabold text-emerald-800 border-t border-surface-border pt-1 flex items-center justify-between">
                      <span>Fundraising Profit:</span>
                      <span>+${p.profit.toFixed(2)} to {club.name}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(p, 1, {
                        originType: 'LOCAL_CLUB',
                        orderSource: `${club.name} Store`,
                        clubName: club.name,
                        profit: p.profit
                      });
                      showToast(
                        `Added ${p.name} to cart. +$${p.profit.toFixed(2)} fundraising profit recorded for ${club.name}!`,
                        'success'
                      );
                    }}
                    className="w-full py-2.5 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart & Fund Club</span>
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* DONATIONS SECTION */}
      <section id="donations" className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-6">
        <div className="border-b border-surface-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-forest-950 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-tan-600" />
              <span>{club.name} Support & Donations</span>
            </h2>
            <p className="text-xs text-charcoal-muted mt-1 font-medium">
              Dedicated donation initiatives supporting {club.name} clubhouse maintenance, youth handler programs, and local trial grounds.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-tan-100 text-tan-900 border border-tan-300 w-fit">
            {club.city}, {club.state} Chapter Fund
          </span>
        </div>

        {/* Local Club Donation Initiatives */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 bg-surface-low rounded-2xl border border-surface-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-forest-900/10 text-forest-900 flex items-center justify-center font-black">
              🏠
            </div>
            <h4 className="font-black text-base text-forest-950">Clubhouse & Kennel Repair</h4>
            <p className="text-xs text-charcoal-muted leading-relaxed font-medium">
              Funds safety repairs, night lighting upgrades, and bench show judging areas for {club.name}.
            </p>
            <div className="pt-2 text-[10px] font-bold text-forest-900 uppercase tracking-wider">
              Local Initiative • {club.city}
            </div>
          </div>

          <div className="p-5 bg-surface-low rounded-2xl border border-surface-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-tan-500/20 text-tan-800 flex items-center justify-center font-black">
              🎯
            </div>
            <h4 className="font-black text-base text-forest-950">Junior Handler Sponsorship</h4>
            <p className="text-xs text-charcoal-muted leading-relaxed font-medium">
              Covers hunt entry fees, safety vests, and travel support for youth houndsmen competing locally.
            </p>
            <div className="pt-2 text-[10px] font-bold text-forest-900 uppercase tracking-wider">
              Youth Program • {club.name}
            </div>
          </div>

          <div className="p-5 bg-surface-low rounded-2xl border border-surface-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-900 flex items-center justify-center font-black">
              🌲
            </div>
            <h4 className="font-black text-base text-forest-950">Trail Access & Safety Equipment</h4>
            <p className="text-xs text-charcoal-muted leading-relaxed font-medium">
              Maintains local hunting grounds, boundary signage, and emergency telemetry gear.
            </p>
            <div className="pt-2 text-[10px] font-bold text-forest-900 uppercase tracking-wider">
              Field Operations • {club.state}
            </div>
          </div>
        </div>

        {/* Local Club Donation Tier Cards (Backend API Integration Ready) */}
        <div className="p-6 rounded-2xl bg-forest-950 text-white border-2 border-tan-500 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-forest-800 pb-3">
            <div>
              <h3 className="font-black text-base text-white">Support {club.name}</h3>
              <p className="text-xs text-tan-200 font-medium">
                Choose a contribution tier to support local club operations. Prepared for future payment integration.
              </p>
            </div>
            <span className="px-3 py-1 bg-tan-500 text-forest-950 text-[10px] font-black uppercase rounded-lg">
              Backend API Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-forest-900 border border-forest-800 space-y-2">
              <div className="font-black text-tan-300 text-sm">Supporter Tier</div>
              <div className="text-xl font-black text-white">$15.00</div>
              <p className="text-[11px] text-tan-200/80">Recognized on {club.name} clubhouse donor board.</p>
            </div>

            <div className="p-4 rounded-xl bg-forest-900 border border-tan-500/60 space-y-2">
              <div className="font-black text-tan-400 text-sm">Club Partner Tier</div>
              <div className="text-xl font-black text-white">$50.00</div>
              <p className="text-[11px] text-tan-200/80">Includes official {club.name} cap patch & hunt event pass.</p>
            </div>

            <div className="p-4 rounded-xl bg-forest-900 border border-forest-800 space-y-2">
              <div className="font-black text-tan-300 text-sm">Legacy Patron Tier</div>
              <div className="text-xl font-black text-white">$150.00+</div>
              <p className="text-[11px] text-tan-200/80">Permanent plaque on club wall & annual hunt dinner invite.</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-tan-300 font-medium border-t border-forest-800/80">
            <span>Future Payment API Endpoint: <code className="font-mono text-white bg-forest-900 px-2 py-0.5 rounded border border-forest-800">POST /api/clubs/{club.id}/donations/pledge</code></span>
            <button
              onClick={() => showToast(`Thank you for supporting ${club.name}! Donation portal will activate with payment gateway integration.`, 'info')}
              className="w-full sm:w-auto px-4 py-2 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black rounded-lg shadow transition-all text-xs"
            >
              Pledge Support
            </button>
          </div>
        </div>
      </section>

      {/* 8. OFFICERS SECTION */}
      <section id="officers" className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-forest-950 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-tan-600" />
          <span>Executive Officers Roster</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {clubOfficers.map((off, idx) => (
            <div key={idx} className="p-5 bg-surface-low rounded-2xl border border-surface-border space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <img src={off.photo} alt={off.name} className="w-16 h-16 rounded-full object-cover border-2 border-tan-400 shadow shrink-0" />
                <div>
                  <h4 className="font-extrabold text-base text-forest-950">{off.name}</h4>
                  <div className="text-xs font-bold text-tan-800">{off.title}</div>
                  <div className="text-[10px] text-charcoal-muted mt-0.5">Term: {off.term}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-border text-xs text-charcoal space-y-1 font-mono">
                <div>{off.phone}</div>
                <div className="truncate text-forest-800 font-sans">{off.email}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. PHOTOS SECTION */}
      <section id="photos" className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-forest-950 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-tan-600" />
          <span>Club Photos Gallery</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {clubPhotos.map((photo, idx) => (
            <div key={idx} className="space-y-1.5 group cursor-pointer">
              <div className="h-36 rounded-2xl overflow-hidden bg-forest-950 border border-surface-border shadow">
                <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="text-xs font-extrabold text-forest-950 truncate">{photo.title}</div>
              <div className="text-[10px] text-charcoal-muted truncate">{photo.caption}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. CONTACT SECTION */}
      <section id="contact" className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-forest-950 flex items-center gap-2">
            <Mail className="w-5 h-5 text-tan-600" />
            <span>Contact {club.name}</span>
          </h2>
          <p className="text-xs text-charcoal-muted mt-1">
            Have questions about upcoming night hunts, trial grounds, or local membership? Contact our club officers directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Details Column */}
          <div className="space-y-4 p-5 rounded-2xl bg-surface-low border border-surface-border text-xs">
            <h4 className="font-black text-sm text-forest-950">Clubhouse Office</h4>
            <div className="space-y-3 text-charcoal font-medium">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-tan-600 shrink-0" />
                <span>{contactInfo.physicalAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-tan-600 shrink-0" />
                <span>{contactInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-tan-600 shrink-0" />
                <span className="truncate">{contactInfo.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-tan-600 shrink-0" />
                <span>{contactInfo.officeHours}</span>
              </div>
            </div>
          </div>

          {/* Direct Contact Form */}
          <form onSubmit={handleContactSubmit} className="lg:col-span-2 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-charcoal mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="e.g. John Walker"
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="e.g. john@example.com"
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Subject</label>
              <input
                type="text"
                required
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder="e.g. Inquiry regarding upcoming Nite Hunt entry"
                className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Message</label>
              <textarea
                rows={4}
                required
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Type your message to the club officers..."
                className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-xs rounded-xl shadow flex items-center gap-2 cursor-pointer transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send Message to {club.name}</span>
            </button>
          </form>
        </div>
      </section>

      {/* Pre-Sign Up Modal rendering */}
      {selectedEventForPreSignUp && (
        <PreSignUpModal
          event={selectedEventForPreSignUp}
          onClose={() => setSelectedEventForPreSignUp(null)}
        />
      )}

      {/* Claim Page Modal */}
      {isClaimModalOpen && (
        <Modal isOpen={true} onClose={() => setIsClaimModalOpen(false)} title={`Claim Official Profile: ${club.name}`}>
          <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs text-charcoal">
            <div className="bg-surface-low p-3.5 rounded-xl border border-surface-border text-charcoal-muted mb-2">
              <p className="font-semibold leading-relaxed">
                If you are an official officer, master of hounds, or authorized representative of <strong>{club.name}</strong>, you can submit a claim to manage this page. Super Admins will review your details.
              </p>
            </div>
            
            <div className="space-y-1.5">
              <label className="block font-bold text-forest-950">Applicant Name</label>
              <input
                type="text"
                required
                value={claimForm.applicant}
                onChange={(e) => setClaimForm({ ...claimForm, applicant: e.target.value })}
                className="w-full p-3 bg-surface-lowest border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
                placeholder="e.g. Robert Miller"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block font-bold text-forest-950">Official Email</label>
                <input
                  type="email"
                  required
                  value={claimForm.email}
                  onChange={(e) => setClaimForm({ ...claimForm, email: e.target.value })}
                  className="w-full p-3 bg-surface-lowest border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
                  placeholder="e.g. name@oakridgehc.org"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block font-bold text-forest-950">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={claimForm.phone}
                  onChange={(e) => setClaimForm({ ...claimForm, phone: e.target.value })}
                  className="w-full p-3 bg-surface-lowest border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
                  placeholder="e.g. (865) 555-0199"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="block font-bold text-forest-950">Statement / Verification Message</label>
              <textarea
                required
                rows={3}
                value={claimForm.message}
                onChange={(e) => setClaimForm({ ...claimForm, message: e.target.value })}
                className="w-full p-3 bg-surface-lowest border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800 resize-none"
                placeholder="Briefly state your role and verification details (e.g. 'I am the club president and want to claim this page to add news and update officer listings.')"
              />
            </div>
            
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-surface-border">
              <button
                type="button"
                onClick={() => setIsClaimModalOpen(false)}
                className="px-4 py-2.5 border border-surface-border rounded-xl font-black text-xs hover:bg-surface-low transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-forest-900 text-white font-black text-xs rounded-xl shadow hover:bg-forest-950 transition-all"
              >
                Submit Claim Request
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
