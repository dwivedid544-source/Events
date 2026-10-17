import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PreSignUpModal } from '../../components/events/PreSignUpModal';
import { Modal } from '../../components/common/Modal';
import { InteractiveUsMap } from '../../components/common/InteractiveUsMap';
import {
  MapPin,
  Building2,
  Users,
  Calendar,
  Trophy,
  Newspaper,
  ShoppingBag,
  Mail,
  ArrowRight,
  ShieldCheck,
  Search,
  ChevronRight,
  Phone,
  UserCheck,
  Send,
  Info,
  HeartHandshake
} from 'lucide-react';

export const PublicStatePage = () => {
  const { stateId } = useParams();
  const location = useLocation();
  const { states, clubs, events, products, news, results, addToCart, showToast, submitClaimRequest } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [organizationFilter, setOrganizationFilter] = useState('All');
  const [selectedEventForPreSignUp, setSelectedEventForPreSignUp] = useState(null);
  const [activeTab, setActiveTab] = useState('HOME');
  
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
      club: stateTitle,
      state: stateData.code || stateData.name,
      ...claimForm
    });
    setClaimForm({ applicant: '', email: '', phone: '', message: '' });
    setIsClaimModalOpen(false);
  };

  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  // 6 State Events Filters required by Client: Date, Organization, Dog type, Event type, Region, Local club
  const [eventDateFilter, setEventDateFilter] = useState('');
  const [eventOrgFilter, setEventOrgFilter] = useState('ALL');
  const [eventDogTypeFilter, setEventDogTypeFilter] = useState('ALL');
  const [eventTypeFilter, setEventTypeFilter] = useState('ALL');
  const [eventRegionFilter, setEventRegionFilter] = useState('ALL');
  const [eventClubFilter, setEventClubFilter] = useState('ALL');

  // 7 State Club Directory Filters required by Client: City, County, ZIP code, Distance, Dog type, Federation, Event type
  const [clubCityFilter, setClubCityFilter] = useState('');
  const [clubCountyFilter, setClubCountyFilter] = useState('');
  const [clubZipFilter, setClubZipFilter] = useState('');
  const [clubDistanceFilter, setClubDistanceFilter] = useState('ALL');
  const [clubDogTypeFilter, setClubDogTypeFilter] = useState('ALL');
  const [clubFederationFilter, setClubFederationFilter] = useState('ALL');
  const [clubEventTypeFilter, setClubEventTypeFilter] = useState('ALL');

  // Match stateId from URL parameter or direct route path (e.g. /texas or /states/texas)
  const pathSlug = location.pathname.replace(/^\/states\//, '').replace(/^\//, '').toLowerCase();
  const effectiveStateId = stateId || (pathSlug !== 'states' && pathSlug ? pathSlug : null);
  const isDedicatedPage = Boolean(effectiveStateId);
  const currentState = states.find(
    (s) =>
      s.id === effectiveStateId ||
      s.code.toLowerCase() === effectiveStateId?.toLowerCase() ||
      s.name.toLowerCase() === effectiveStateId?.toLowerCase() ||
      s.name.toLowerCase().includes(effectiveStateId?.toLowerCase())
  );

  // Filter states for directory view based on Search Query and Organization filter (supporting multiple associations per state)
  const filteredStates = states.filter((s) => {
    const matchesSearch =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.adminName && s.adminName.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesOrg = true;
    if (organizationFilter !== 'All') {
      if (Array.isArray(s.organizations)) {
        matchesOrg = s.organizations.some((org) => org.toUpperCase() === organizationFilter.toUpperCase());
      } else if (s.organization) {
        matchesOrg = s.organization.toUpperCase().includes(organizationFilter.toUpperCase());
      } else if (s.federation) {
        matchesOrg = s.federation.toUpperCase().includes(organizationFilter.toUpperCase());
      } else {
        matchesOrg = true;
      }
    }

    return matchesSearch && matchesOrg;
  });

  // Data scoped to selected State
  const stateData = currentState || states[0];
  const stateTitle = stateData.name.includes('Association') ? stateData.name : `${stateData.name} State Association`;
  const stateClubs = clubs.filter((c) => c.state === stateData.name || c.stateCode === stateData.code || c.stateId === stateData.id);
  const stateEvents = events.filter((e) => e.state === stateData.name || e.stateCode === stateData.code || e.stateId === stateData.id);

  // Filtered State Events automatically showing all events in that state filtered by 6 criteria
  const filteredStateEvents = stateEvents.filter((evt) => {
    if (eventOrgFilter !== 'ALL' && !evt.federation?.toLowerCase().includes(eventOrgFilter.toLowerCase())) return false;
    if (eventDogTypeFilter !== 'ALL' && evt.dogType !== eventDogTypeFilter && !evt.sport?.toLowerCase().includes(eventDogTypeFilter.toLowerCase())) return false;
    if (eventTypeFilter !== 'ALL' && evt.type !== eventTypeFilter) return false;
    if (eventRegionFilter !== 'ALL' && evt.region !== eventRegionFilter && !evt.city?.toLowerCase().includes(eventRegionFilter.toLowerCase())) return false;
    if (eventClubFilter !== 'ALL' && evt.club !== eventClubFilter) return false;
    if (eventDateFilter && !evt.date?.toLowerCase().includes(eventDateFilter.toLowerCase())) return false;
    return true;
  });

  // Filtered State Clubs based on 7 Client Required Search Criteria (City, County, ZIP code, Distance, Dog type, Federation, Event type)
  const filteredStateClubs = stateClubs.filter((c) => {
    if (clubCityFilter && !c.city?.toLowerCase().includes(clubCityFilter.toLowerCase())) return false;
    if (clubCountyFilter && !c.county?.toLowerCase().includes(clubCountyFilter.toLowerCase())) return false;
    if (clubZipFilter && !c.zip?.includes(clubZipFilter)) return false;
    if (clubDistanceFilter !== 'ALL') {
      const maxDist = Number(clubDistanceFilter);
      const distNum = c.distanceMiles || Number(c.distance?.replace(/[^0-9]/g, '')) || 0;
      if (distNum > maxDist) return false;
    }
    if (clubDogTypeFilter !== 'ALL' && c.dogType !== clubDogTypeFilter) return false;
    if (clubFederationFilter !== 'ALL' && !c.federation?.toLowerCase().includes(clubFederationFilter.toLowerCase())) return false;
    if (clubEventTypeFilter !== 'ALL' && c.eventType !== clubEventTypeFilter) return false;
    return true;
  });

  const stateProducts = products.filter(
    (p) =>
      (p.scopeChannel === 'STATE' || p.organizationType === 'STATE') &&
      (p.scopeEntity === `${stateData.name} State Association` || p.organizationId === stateData.id || p.organizationId === stateData.code)
  );
  const displayProducts = stateProducts.length > 0 ? stateProducts : products.filter((p) => p.scopeChannel === 'STATE');
  const stateNews = news.filter((n) => n.category?.includes('State') || n.summary?.includes(stateData.name));
  const stateResults = results.filter((r) => r.state === stateData.name || r.stateCode === stateData.code);

  const mockOfficers = [
    { name: stateData.adminName || 'Austin Sterling', title: 'State Association Director', term: '2025 - 2027', email: `director@${stateData.code.toLowerCase()}hunting.org`, phone: '(800) 555-0192', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
    { name: 'Marcus Vance', title: 'Vice State Director', term: '2026 - 2028', email: `vice@${stateData.code.toLowerCase()}hunting.org`, phone: '(800) 555-0193', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { name: 'Elena Rostova', title: 'State Secretary & Treasurer', term: '2025 - 2027', email: `treasurer@${stateData.code.toLowerCase()}hunting.org`, phone: '(800) 555-0194', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }
  ];

  const navItems = [
    { id: 'HOME', label: 'HOME' },
    { id: 'ABOUT', label: 'ABOUT' },
    { id: 'NEWS', label: 'NEWS' },
    { id: 'EVENTS', label: 'EVENTS' },
    { id: 'CLUBS', label: 'CLUBS' },
    { id: 'MEMBERSHIP', label: 'MEMBERSHIP' },
    { id: 'RESULTS', label: 'RESULTS' },
    { id: 'MERCHANDISE', label: 'MERCHANDISE' },
    { id: 'DONATIONS', label: 'DONATIONS' },
    { id: 'OFFICERS', label: 'OFFICERS' },
    { id: 'CONTACT', label: 'CONTACT' },
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    showToast(`Thank you! Your message has been sent to ${stateTitle}.`, 'success');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  // -------------------------------------------------------------
  // VIEW 1: State Associations Directory Listing (/states)
  // -------------------------------------------------------------
  if (!isDedicatedPage) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-10">
        <div className="bg-forest-950 text-white rounded-3xl p-8 lg:p-12 border border-forest-800 shadow-2xl space-y-6">
          <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
            State Governance Directory
          </span>
          <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight">
            State Associations
          </h1>
          <p className="text-xs sm:text-sm text-tan-200 max-w-2xl font-medium leading-relaxed">
            Select a state association to view its dedicated public website, officers, affiliated clubs, events, and merchandise.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by state name, code, or director..."
                className="w-full pl-10 pr-4 py-3 text-xs bg-surface-lowest text-charcoal border border-surface-border rounded-xl font-semibold focus:outline-none focus:border-tan-500"
              />
            </div>
            <div className="sm:w-44">
              <select
                value={organizationFilter}
                onChange={(e) => setOrganizationFilter(e.target.value)}
                className="w-full px-3.5 py-3 text-xs bg-surface-lowest text-charcoal border border-surface-border rounded-xl font-semibold focus:outline-none focus:border-tan-500 cursor-pointer"
                aria-label="Organization Filter"
              >
                <option value="All">All</option>
                <option value="UKC">UKC</option>
                <option value="PKC">PKC</option>
              </select>
            </div>
          </div>
        </div>

        <InteractiveUsMap />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStates.map((s) => (
            <div
              key={s.id}
              className="group bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient p-6 flex flex-col justify-between hover:shadow-2xl hover:border-tan-500/60 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-forest-900/10 text-forest-950 font-black text-lg flex items-center justify-center border border-surface-border overflow-hidden shrink-0">
                    {s.logo ? <img src={s.logo} alt={s.name} className="w-full h-full object-cover" /> : s.code}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-tan-100 text-tan-900">
                        {s.code} Charter
                      </span>
                      {s.organizations && Array.isArray(s.organizations) && s.organizations.map((org) => (
                        <span key={org} className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-forest-950/10 text-forest-950 border border-forest-900/20">
                          {org}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-black text-lg text-forest-950 group-hover:text-tan-700 transition-colors mt-0.5">
                      {s.name.includes('Association') ? s.name : `${s.name} Association`}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-charcoal-muted line-clamp-2 font-medium">
                  {s.description || `Official state association charter for ${s.name}.`}
                </p>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-surface-border text-center text-xs">
                  <div className="p-2 rounded-xl bg-surface-low border border-surface-border">
                    <strong className="block font-black text-forest-950">{s.clubsCount}</strong>
                    <span className="text-[10px] text-charcoal-muted">Clubs</span>
                  </div>
                  <div className="p-2 rounded-xl bg-surface-low border border-surface-border">
                    <strong className="block font-black text-forest-950">{s.membersCount}</strong>
                    <span className="text-[10px] text-charcoal-muted">Members</span>
                  </div>
                  <div className="p-2 rounded-xl bg-surface-low border border-surface-border">
                    <strong className="block font-black text-forest-800">{s.eventsCount}</strong>
                    <span className="text-[10px] text-charcoal-muted">Events</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  to={`/states/${s.id}`}
                  className="w-full py-3 bg-forest-900 hover:bg-forest-950 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>View Dedicated State Page</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: Dedicated Public State Association Page
  // -------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Hierarchy Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-bold text-charcoal-muted">
        <Link to="/" className="hover:text-forest-950 transition-colors">National</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/states" className="hover:text-forest-950 transition-colors">State Associations</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-forest-950 font-black">{stateTitle}</span>
      </div>

      {/* 🏛️ REQUIREMENT 2: STATE HEADER */}
      {/* Must contain: Logo, Name, Branding/Colors, Contact Info, Association Officers */}
      <header className="relative bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-tan-500/40 shadow-2xl overflow-hidden space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          {/* Logo & State Association Name */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-6 min-w-0 flex-1">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-tan-500/20 border-2 border-tan-400 flex items-center justify-center overflow-hidden shrink-0 shadow-xl">
              {stateData.logo ? (
                <img src={stateData.logo} alt={stateTitle} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-black text-tan-300">{stateData.code}</span>
              )}
            </div>

            <div className="space-y-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {/* State Branding / Colors Badge */}
                <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
                  Official State Charter ({stateData.code})
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-forest-900 text-tan-300 border border-forest-700">
                  State Colors: Forest & Tan
                </span>
              </div>
              
              {/* State Association Name */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                {stateTitle}
              </h1>

              {/* State Contact Information Header Bar */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-tan-200 font-medium pt-1">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-tan-400" />
                  <span>(800) 555-0192</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-tan-400" />
                  <span>contact@{stateData.code.toLowerCase()}hunting.org</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-tan-400" />
                  <span>State Headquarters, {stateData.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Association Officers Header Summary & Action */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="p-3 rounded-2xl bg-forest-900/90 border border-forest-700 space-y-1.5 text-xs text-left lg:text-right">
              <div className="text-[10px] font-black uppercase text-tan-400 flex items-center gap-1 lg:justify-end">
                <UserCheck className="w-3.5 h-3.5 text-tan-400" />
                <span>Association Officers</span>
              </div>
              <div className="font-extrabold text-white">{stateData.adminName || 'Austin Sterling'} (Director)</div>
              <div className="text-[11px] text-tan-200">Board: 3 Elected State Officers</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIsClaimModalOpen(true)}
                className="px-5 py-3 bg-forest-900 border border-forest-750 hover:bg-forest-950 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-tan-400" />
                <span>Claim Page</span>
              </button>
              <Link
                to={`/join-state/${stateData.id || 'texas'}`}
                className="px-5 py-3 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Join {stateData.name.includes('Texas') ? 'the Texas Hound Association' : stateTitle}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stat Counter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-forest-800 text-center">
          <div className="bg-forest-900/60 p-3 rounded-xl border border-forest-800">
            <strong className="block text-xl sm:text-2xl font-black text-tan-300">{stateData.clubsCount}</strong>
            <span className="text-[10px] uppercase font-bold text-tan-200">Affiliated Clubs</span>
          </div>
          <div className="bg-forest-900/60 p-3 rounded-xl border border-forest-800">
            <strong className="block text-xl sm:text-2xl font-black text-tan-300">{stateData.membersCount}</strong>
            <span className="text-[10px] uppercase font-bold text-tan-200">State Members</span>
          </div>
          <div className="bg-forest-900/60 p-3 rounded-xl border border-forest-800">
            <strong className="block text-xl sm:text-2xl font-black text-tan-300">{stateEvents.length || stateData.eventsCount}</strong>
            <span className="text-[10px] uppercase font-bold text-tan-200">Sanctioned Events</span>
          </div>
          <div className="bg-forest-900/60 p-3 rounded-xl border border-forest-800">
            <strong className="block text-xl sm:text-2xl font-black text-emerald-400">${stateData.revenue?.toLocaleString() || '245,000'}</strong>
            <span className="text-[10px] uppercase font-bold text-tan-200">State Margin</span>
          </div>
        </div>
      </header>

      {/* 🧭 REQUIREMENT 3: EXACT STATE NAVIGATION ITEMS (10 Items) */}
      {/* HOME, ABOUT, NEWS, EVENTS, CLUBS, MEMBERSHIP, RESULTS, MERCHANDISE, OFFICERS, CONTACT */}
      <nav className="sticky top-16 z-40 bg-surface-lowest/95 backdrop-blur-md p-1.5 rounded-2xl border border-surface-border shadow-xl overflow-x-auto flex items-center gap-1 scrollbar-none">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id.toLowerCase()}`}
              onClick={() => setActiveTab(item.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black tracking-wide whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-forest-950 text-tan-300 shadow-md'
                  : 'text-charcoal hover:bg-surface-low hover:text-forest-950'
              }`}
            >
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* SECTION 1: HOME */}
      <section id="home" className="space-y-6">
        <div className="bg-surface-lowest p-6 sm:p-8 rounded-2xl border border-surface-border shadow-ambient space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-tan-100 text-tan-900">
              Welcome to {stateTitle}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-forest-950">
            Official Public Portal of {stateTitle}
          </h2>
          <p className="text-xs sm:text-sm text-charcoal leading-relaxed font-medium">
            {stateData.description ||
              `The ${stateTitle} is the governing state charter responsible for sanctioning field trials, coonhound night hunts, beagle pack trials, and state championships across ${stateData.name}.`}
          </p>
        </div>
      </section>

      {/* SECTION 2: ABOUT */}
      <section id="about" className="space-y-6">
        <div className="bg-surface-lowest p-6 sm:p-8 rounded-2xl border border-surface-border shadow-ambient space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-forest-800 flex items-center gap-2">
            <Info className="w-5 h-5 text-tan-600" />
            <span>About {stateTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-charcoal leading-relaxed font-medium">
            Founded to advance ethical sporting dog trials, wildlife preservation, and youth education programs. {stateTitle} provides leadership to affiliated local clubs and enforces national sanctioning rules.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-surface-border text-xs font-medium">
            <div className="p-4 rounded-xl bg-surface-low border border-surface-border space-y-1">
              <strong className="block font-black text-forest-950 text-sm">Our Mission</strong>
              <p className="text-charcoal-muted">Promoting ethical sporting hound competition, state championship qualifications, and hunter education across {stateData.name}.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-low border border-surface-border space-y-1">
              <strong className="block font-black text-forest-950 text-sm">State Charter Governance</strong>
              <p className="text-charcoal-muted">Governed by elected state officers with full financial transparency and automated local club commission distributions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: STATE NEWS FEED */}
      <section id="news" className="space-y-6">
        <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-surface-border pb-4 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950">
                  Dedicated State Association News Feed
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold text-charcoal-muted bg-surface-low border border-surface-border">
                  Hierarchy: Local News → State News → National News
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-forest-950 flex items-center gap-2 mt-1">
                <Newspaper className="w-5 h-5 text-tan-600" />
                <span>{stateTitle} Official News Feed</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Controlled directly by the {stateData.name} State Association officers and board.
              </p>
            </div>

            <Link
              to="/state-admin/news"
              className="px-4 py-2 bg-forest-950 hover:bg-forest-900 text-tan-300 font-extrabold text-xs rounded-xl shadow flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>State News Control Panel</span>
              <ArrowRight className="w-4 h-4 text-tan-500" />
            </Link>
          </div>

          {/* 8 Supported State News Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(news.filter((n) => n.state === stateData.name || n.stateId === stateData.id || n.stateCode === stateData.code || n.level === 'STATE').length > 0
              ? news.filter((n) => n.state === stateData.name || n.stateId === stateData.id || n.stateCode === stateData.code || n.level === 'STATE')
              : news
            ).map((n) => (
              <div key={n.id} className="p-5 bg-surface-low rounded-2xl border border-surface-border space-y-3 flex flex-col justify-between hover:shadow-lg transition-all">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-tan-500 text-forest-950">
                      {n.category || 'State Hunt announcements'}
                    </span>
                    {n.isPromotedToNational && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                        ★ Promoted to National Feed
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-sm text-forest-950 leading-snug">{n.title}</h4>
                  <p className="text-xs text-charcoal-muted line-clamp-3 leading-relaxed">{n.summary}</p>
                </div>

                <div className="pt-3 border-t border-surface-border flex items-center justify-between text-[11px] text-charcoal font-medium">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-tan-800">
                    <span>{n.level === 'LOCAL' ? 'Local' : 'State'} News</span>
                    <span>→</span>
                    <span>{n.isPromotedToNational ? 'National' : 'State Feed'}</span>
                  </div>
                  <span className="text-[10px] text-charcoal-muted">{n.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: EVENTS - STATE EVENTS PAGE */}
      <section id="events" className="space-y-6">
        <div className="bg-surface-lowest p-6 rounded-2xl border border-surface-border shadow-ambient space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-surface-border pb-4 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950">
                  State Sanctioned Events Directory
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-forest-800 flex items-center gap-2 mt-1">
                <Calendar className="w-5 h-5 text-tan-600" />
                <span>{stateData.name} State Events ({filteredStateEvents.length})</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Automatically displaying all events held in {stateData.name} across all federations, event types, and local clubs.
              </p>
            </div>

            {(eventOrgFilter !== 'ALL' || eventTypeFilter !== 'ALL' || eventDogTypeFilter !== 'ALL' || eventRegionFilter !== 'ALL' || eventClubFilter !== 'ALL' || eventDateFilter) && (
              <button
                onClick={() => {
                  setEventOrgFilter('ALL');
                  setEventTypeFilter('ALL');
                  setEventDogTypeFilter('ALL');
                  setEventRegionFilter('ALL');
                  setEventClubFilter('ALL');
                  setEventDateFilter('');
                }}
                className="px-3 py-1.5 bg-surface-low border border-surface-border text-charcoal hover:bg-tan-100 text-xs font-bold rounded-lg transition-colors self-start sm:self-auto"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* REQUIREMENT 4: 6 FILTER CONTROLS BAR (Date, Organization, Dog type, Event type, Region, Local club) */}
          <div className="p-4 bg-surface-low rounded-2xl border border-surface-border space-y-3 text-xs">
            <div className="text-[11px] font-black uppercase tracking-wider text-forest-950 flex items-center gap-1.5">
              <span>Filter State Events By:</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* 1. Date Filter */}
              <div>
                <label className="block font-extrabold text-charcoal-muted text-[10px] uppercase mb-1">1. Date</label>
                <input
                  type="text"
                  value={eventDateFilter}
                  onChange={(e) => setEventDateFilter(e.target.value)}
                  placeholder="Filter by date (e.g. October, Sep)..."
                  className="w-full px-3 py-2 bg-surface-lowest border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
                />
              </div>

              {/* 2. Organization (Federation) Filter */}
              <div>
                <label className="block font-extrabold text-charcoal-muted text-[10px] uppercase mb-1">2. Organization / Federation</label>
                <select
                  value={eventOrgFilter}
                  onChange={(e) => setEventOrgFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-lowest border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
                >
                  <option value="ALL">All Organizations</option>
                  <option value="UKC">UKC (United Kennel Club)</option>
                  <option value="PKC">PKC (Professional Kennel Club)</option>
                  <option value="AKC">AKC (American Kennel Club)</option>
                  <option value="Independent">Independent (Non-Affiliated)</option>
                  <option value="UHC">UHC (Ultimate Hound Club)</option>
                </select>
              </div>

              {/* 3. Dog Type Filter */}
              <div>
                <label className="block font-extrabold text-charcoal-muted text-[10px] uppercase mb-1">3. Dog Type</label>
                <select
                  value={eventDogTypeFilter}
                  onChange={(e) => setEventDogTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-lowest border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
                >
                  <option value="ALL">All Dog Types & Breeds</option>
                  <option value="Treeing Walker Coonhound">Treeing Walker Coonhound</option>
                  <option value="Black & Tan Coonhound">Black & Tan Coonhound</option>
                  <option value="Beagle Pack">Beagle Pack</option>
                  <option value="Youth Handler (All Breeds)">Youth Handler (All Breeds)</option>
                  <option value="Purebred Coonhounds">Purebred Coonhounds</option>
                  <option value="All Sporting Dogs">All Sporting Dogs</option>
                </select>
              </div>

              {/* 4. Event Type Filter */}
              <div>
                <label className="block font-extrabold text-charcoal-muted text-[10px] uppercase mb-1">4. Event Type</label>
                <select
                  value={eventTypeFilter}
                  onChange={(e) => setEventTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-lowest border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
                >
                  <option value="ALL">All Event Types</option>
                  <option value="UKC Event">UKC Event</option>
                  <option value="PKC Event">PKC Event</option>
                  <option value="Independent Event">Independent Event</option>
                  <option value="State Championship Event">State Championship Event</option>
                  <option value="Youth Event">Youth Event</option>
                  <option value="Bench Show">Bench Show</option>
                  <option value="Field Trial">Field Trial</option>
                  <option value="Club Fundraiser">Club Fundraiser</option>
                </select>
              </div>

              {/* 5. Region Filter */}
              <div>
                <label className="block font-extrabold text-charcoal-muted text-[10px] uppercase mb-1">5. Region / City</label>
                <select
                  value={eventRegionFilter}
                  onChange={(e) => setEventRegionFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-lowest border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
                >
                  <option value="ALL">All Regions in {stateData.name}</option>
                  <option value="Central Texas">Central Texas (Austin/Fredericksburg)</option>
                  <option value="South Texas">South Texas (San Antonio)</option>
                  <option value="East Texas">East Texas (Tyler/Lufkin)</option>
                  <option value="North Texas">North Texas (Waco/Dallas)</option>
                </select>
              </div>

              {/* 6. Local Club Filter */}
              <div>
                <label className="block font-extrabold text-charcoal-muted text-[10px] uppercase mb-1">6. Local Club</label>
                <select
                  value={eventClubFilter}
                  onChange={(e) => setEventClubFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-lowest border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
                >
                  <option value="ALL">All Local Clubs</option>
                  {stateClubs.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* STATE EVENTS GRID */}
          {filteredStateEvents.length === 0 ? (
            <div className="p-8 text-center bg-surface-low rounded-2xl border border-surface-border text-xs text-charcoal-muted space-y-2">
              <div className="font-extrabold text-forest-900 text-sm">No Events Found</div>
              <p>No events match the selected filters. Try broadening your filter selections.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredStateEvents.map((evt) => (
                <div key={evt.id} className="p-5 rounded-2xl border border-surface-border bg-surface-low space-y-3 flex flex-col justify-between hover:shadow-lg transition-all">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-forest-900 text-tan-300">
                        {evt.federation || 'UHC Sanctioned'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-tan-500 text-forest-950">
                        {evt.type}
                      </span>
                      <span className="text-xs font-black text-forest-800 ml-auto">${evt.fee} Fee</span>
                    </div>

                    <h3 className="font-black text-base text-forest-950 leading-tight">{evt.name}</h3>
                    
                    <p className="text-xs text-charcoal-muted line-clamp-2">{evt.description}</p>

                    <div className="text-xs text-charcoal space-y-1 font-medium pt-1 border-t border-surface-border">
                      <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-tan-600" /> {evt.date} @ {evt.startTime}</div>
                      <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-tan-600" /> Location: {evt.city}, {evt.state} ({evt.region || 'Statewide'})</div>
                      
                      {/* REQUIREMENT 5: CONNECTED TO LOCAL HOST CLUB */}
                      <div className="pt-1">
                        <Link
                          to={`/clubs/${evt.clubId || 'club-5'}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-lowest border border-surface-border hover:border-forest-800 text-forest-950 font-black text-xs transition-colors"
                        >
                          <Building2 className="w-3.5 h-3.5 text-tan-600" />
                          <span>Hosted by: {evt.club}</span>
                          <ChevronRight className="w-3 h-3 text-tan-600" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-surface-border flex items-center justify-between gap-3">
                    <button
                      onClick={() => setSelectedEventForPreSignUp(evt)}
                      className="px-4 py-2 bg-tan-500 hover:bg-tan-600 text-forest-950 font-black text-xs rounded-xl shadow cursor-pointer transition-all"
                    >
                      Pre-Sign Up
                    </button>
                    <Link to={`/find-hunt?event=${evt.id}`} className="text-xs font-extrabold text-forest-800 hover:text-tan-700 flex items-center gap-0.5">
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 5: STATE CLUB DIRECTORY */}
      <section id="clubs" className="space-y-6">
        <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-surface-border pb-4 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950">
                  State Local Club Directory
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold text-charcoal-muted bg-surface-low border border-surface-border">
                  {filteredStateClubs.length} Chartered Clubs Displayed
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-forest-950 flex items-center gap-2 mt-1">
                <Building2 className="w-5 h-5 text-tan-600" />
                <span>{stateData.name.includes('Texas') ? 'Texas Local Clubs' : `${stateData.name} Local Clubs`}</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Directory of local chartered hunting clubs in {stateData.name}. Search by City, County, ZIP, Distance, Dog Type, Federation, and Event Type.
              </p>
            </div>

            {(clubCityFilter || clubCountyFilter || clubZipFilter || clubDistanceFilter !== 'ALL' || clubDogTypeFilter !== 'ALL' || clubFederationFilter !== 'ALL' || clubEventTypeFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setClubCityFilter('');
                  setClubCountyFilter('');
                  setClubZipFilter('');
                  setClubDistanceFilter('ALL');
                  setClubDogTypeFilter('ALL');
                  setClubFederationFilter('ALL');
                  setClubEventTypeFilter('ALL');
                }}
                className="px-3.5 py-1.5 bg-surface-low border border-surface-border text-charcoal hover:bg-tan-100 text-xs font-bold rounded-xl transition-colors self-start sm:self-auto"
              >
                Reset Club Filters
              </button>
            )}
          </div>

          {/* REQUIREMENT 3: 7 SEARCH FILTERS BAR (City, County, ZIP code, Distance, Dog type, Federation, Event type) */}
          <div className="p-4 bg-surface-low rounded-2xl border border-surface-border space-y-3 text-xs">
            <div className="text-[11px] font-black uppercase tracking-wider text-forest-950 flex items-center justify-between">
              <span>Search Local Clubs By 7 Criteria:</span>
              <span className="text-[10px] text-charcoal-muted font-normal">Real-time Directory Search</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* 1. Search by City */}
              <div>
                <label className="block font-extrabold text-charcoal-muted text-[10px] uppercase mb-1">1. City</label>
                <input
                  type="text"
                  value={clubCityFilter}
                  onChange={(e) => setClubCityFilter(e.target.value)}
                  placeholder="Search City (e.g. Crockett, Tyler)..."
                  className="w-full px-3 py-2 bg-surface-lowest border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
                />
              </div>

              {/* 2. Search by County */}
              <div>
                <label className="block font-extrabold text-charcoal-muted text-[10px] uppercase mb-1">2. County</label>
                <input
                  type="text"
                  value={clubCountyFilter}
                  onChange={(e) => setClubCountyFilter(e.target.value)}
                  placeholder="Search County (e.g. Houston, Smith)..."
                  className="w-full px-3 py-2 bg-surface-lowest border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
                />
              </div>

              {/* 3. Search by ZIP Code */}
              <div>
                <label className="block font-extrabold text-charcoal-muted text-[10px] uppercase mb-1">3. ZIP Code</label>
                <input
                  type="text"
                  value={clubZipFilter}
                  onChange={(e) => setClubZipFilter(e.target.value)}
                  placeholder="Search ZIP (e.g. 75835, 78701)..."
                  className="w-full px-3 py-2 bg-surface-lowest border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
                />
              </div>

              {/* 4. Search by Distance */}
              <div>
                <label className="block font-extrabold text-charcoal-muted text-[10px] uppercase mb-1">4. Distance</label>
                <select
                  value={clubDistanceFilter}
                  onChange={(e) => setClubDistanceFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-lowest border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
                >
                  <option value="ALL">All Distances</option>
                  <option value="15">Within 15 Miles</option>
                  <option value="30">Within 30 Miles</option>
                  <option value="50">Within 50 Miles</option>
                  <option value="100">Within 100 Miles</option>
                </select>
              </div>

              {/* 5. Search by Dog Type */}
              <div>
                <label className="block font-extrabold text-charcoal-muted text-[10px] uppercase mb-1">5. Dog Type</label>
                <select
                  value={clubDogTypeFilter}
                  onChange={(e) => setClubDogTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-lowest border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
                >
                  <option value="ALL">All Dog Types</option>
                  <option value="Treeing Walker Coonhound">Treeing Walker Coonhound</option>
                  <option value="Black & Tan Coonhound">Black & Tan Coonhound</option>
                  <option value="Beagle Pack">Beagle Pack</option>
                  <option value="English Redtick Coonhound">English Redtick Coonhound</option>
                  <option value="All Sporting Hounds">All Sporting Hounds</option>
                </select>
              </div>

              {/* 6. Search by Federation */}
              <div>
                <label className="block font-extrabold text-charcoal-muted text-[10px] uppercase mb-1">6. Federation</label>
                <select
                  value={clubFederationFilter}
                  onChange={(e) => setClubFederationFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-lowest border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
                >
                  <option value="ALL">All Federations</option>
                  <option value="UKC (United Kennel Club)">UKC (United Kennel Club)</option>
                  <option value="PKC (Professional Kennel Club)">PKC (Professional Kennel Club)</option>
                  <option value="AKC (American Kennel Club)">AKC (American Kennel Club)</option>
                  <option value="Independent">Independent</option>
                  <option value="UHC (Ultimate Hound Club)">UHC (Ultimate Hound Club)</option>
                </select>
              </div>

              {/* 7. Search by Event Type */}
              <div>
                <label className="block font-extrabold text-charcoal-muted text-[10px] uppercase mb-1">7. Event Type</label>
                <select
                  value={clubEventTypeFilter}
                  onChange={(e) => setClubEventTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-lowest border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
                >
                  <option value="ALL">All Event Types</option>
                  <option value="Nite Hunt">Nite Hunt</option>
                  <option value="Field Trial">Field Trial</option>
                  <option value="Water Race">Water Race</option>
                  <option value="Bench Show">Bench Show</option>
                  <option value="State Championship">State Championship</option>
                </select>
              </div>
            </div>
          </div>

          {/* LOCAL CLUBS GRID */}
          {filteredStateClubs.length === 0 ? (
            <div className="p-8 text-center bg-surface-low rounded-2xl border border-surface-border text-xs text-charcoal-muted space-y-2">
              <div className="font-extrabold text-forest-950 text-sm">No Local Clubs Found</div>
              <p>No local clubs match the selected search criteria. Try adjusting your search filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredStateClubs.map((c) => (
                <div key={c.id} className="p-5 bg-surface-low rounded-2xl border border-surface-border space-y-3 flex flex-col justify-between hover:shadow-lg transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <img src={c.logo} alt={c.name} className="w-14 h-14 rounded-2xl object-cover border border-surface-border shrink-0 shadow-md" />
                      <div>
                        <h4 className="font-black text-base text-forest-950 leading-snug">{c.name}</h4>
                        <div className="text-xs font-bold text-tan-800">
                          {c.city}, {c.county || `${c.city} Area`} (ZIP: {c.zip || '78701'})
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-charcoal-muted line-clamp-2 pt-1 font-medium">{c.description}</p>

                    {/* Filter Property Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-bold">
                      <span className="px-2 py-0.5 rounded bg-surface-lowest text-forest-950 border border-surface-border">
                        📍 {c.distance || '15 miles away'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-forest-900 text-tan-300">
                        🐕 {c.dogType || 'Treeing Walker'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-tan-500 text-forest-950">
                        🏆 {c.federation || 'UKC Sanctioned'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-lowest text-charcoal border border-surface-border">
                        🎪 {c.eventType || 'Nite Hunt'}
                      </span>
                    </div>
                  </div>

                  {/* REQUIREMENT 4: OPEN THAT CLUB'S OWN UHC PAGE */}
                  <div className="pt-3 border-t border-surface-border">
                    <Link
                      to={`/clubs/${c.id}`}
                      className="w-full py-2.5 bg-forest-950 hover:bg-forest-900 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>Open Club's Own UHC Page</span>
                      <ChevronRight className="w-4 h-4 text-tan-400" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 6: MEMBERSHIP */}
      <section id="membership" className="space-y-6">
        <div className="bg-forest-950 text-white p-6 sm:p-8 rounded-3xl border border-forest-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950">
              State Membership Charter
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">{stateTitle} Membership</h2>
            <p className="text-xs sm:text-sm text-tan-200 font-medium">
              Join the official {stateTitle} for $35.00/year to qualify for state championship points, voting rights in state officer elections, and merchandise discounts.
            </p>
          </div>
          <Link
            to={`/join-state/${stateData.id || 'texas'}`}
            className="px-6 py-3 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 shrink-0 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Join {stateData.name.includes('Texas') ? 'the Texas Hound Association' : 'State Association'}</span>
          </Link>
        </div>
      </section>

      {/* SECTION 7: RESULTS */}
      <section id="results" className="space-y-6">
        <div className="bg-surface-lowest p-6 rounded-2xl border border-surface-border shadow-ambient space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-forest-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-tan-600" />
              <span>{stateData.name} State Hunt Results</span>
            </h2>
          </div>

          <div className="space-y-3">
            {stateResults.length > 0 ? (
              stateResults.map((r) => (
                <div key={r.id} className="p-4 bg-surface-low rounded-xl border border-surface-border flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-xs sm:text-sm text-forest-950">{r.eventName}</h4>
                    <div className="text-xs text-charcoal-muted mt-0.5">{r.date} • Winner: {r.winnerDog} ({r.owner})</div>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-tan-500 text-forest-950 font-black text-xs">{r.placement} ({r.score})</span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-charcoal-muted bg-surface-low rounded-xl border">
                No official state hunt results archived yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 8: MERCHANDISE */}
      <section id="merchandise" className="space-y-6">
        <div className="bg-surface-lowest p-6 rounded-2xl border border-surface-border shadow-ambient space-y-4">
          <div className="border-b border-surface-border pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-forest-800 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-tan-600" />
                <span>{stateData.name} State Official Merchandise</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">Purchases directly support the {stateTitle} treasury and state championships.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayProducts.map((p) => (
              <div key={p.id} className="bg-surface-low rounded-2xl border border-surface-border overflow-hidden flex flex-col justify-between">
                <div className="relative h-44 bg-surface-lowest">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-forest-950/90 text-tan-300">
                    {p.category}
                  </span>
                </div>
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-black text-sm text-forest-950 line-clamp-1">{p.name}</h4>
                    <p className="text-xs text-charcoal-muted line-clamp-2 mt-1">{p.description}</p>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-surface-border">
                    <span className="text-base font-black text-forest-950">${p.price}</span>
                    <button
                      onClick={() => {
                        addToCart(p);
                        showToast(`Added ${p.name} to cart!`, 'success');
                      }}
                      className="px-3 py-1.5 bg-tan-500 hover:bg-tan-600 text-forest-950 font-black text-xs rounded-lg shadow transition-all flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: DONATIONS */}
      <section id="donations" className="space-y-6">
        <div className="bg-surface-lowest p-6 sm:p-8 rounded-2xl border border-surface-border shadow-ambient space-y-6">
          <div className="border-b border-surface-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-forest-800 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-tan-600" />
                <span>{stateTitle} Support & Donations</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-1 font-medium">
                Dedicated donation initiatives powering {stateData.name} youth trial clinics, hound conservation, and state championship awards.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-tan-100 text-tan-900 border border-tan-300 w-fit">
              {stateData.code} State Endowment Fund
            </span>
          </div>

          {/* State Donation Causes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 bg-surface-low rounded-2xl border border-surface-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-900/10 text-forest-900 flex items-center justify-center font-black">
                🎯
              </div>
              <h4 className="font-black text-base text-forest-950">Youth Trial & Mentorship Fund</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed font-medium">
                Sponsors entry fees, safety gear, and trophies for junior hound handlers competing in {stateData.name}.
              </p>
              <div className="pt-2 text-[10px] font-bold text-forest-900 uppercase tracking-wider">
                State Initiative • {stateData.code} Charter
              </div>
            </div>

            <div className="p-5 bg-surface-low rounded-2xl border border-surface-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-tan-500/20 text-tan-800 flex items-center justify-center font-black">
                🌲
              </div>
              <h4 className="font-black text-base text-forest-950">Trail & Land Preservation</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed font-medium">
                Maintains and protects public hunt grounds and field trial access routes across {stateData.name}.
              </p>
              <div className="pt-2 text-[10px] font-bold text-forest-900 uppercase tracking-wider">
                State Initiative • {stateData.code} Charter
              </div>
            </div>

            <div className="p-5 bg-surface-low rounded-2xl border border-surface-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-900 flex items-center justify-center font-black">
                🏆
              </div>
              <h4 className="font-black text-base text-forest-950">Championship Purse & Awards</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed font-medium">
                Directly funds annual state championship prize purses, belt buckles, and high-point hound recognitions.
              </p>
              <div className="pt-2 text-[10px] font-bold text-forest-900 uppercase tracking-wider">
                State Initiative • {stateData.code} Charter
              </div>
            </div>
          </div>

          {/* Donation Tier Levels (Backend & Payment API Integration Ready) */}
          <div className="p-6 rounded-2xl bg-forest-950 text-white border-2 border-tan-500 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-forest-800 pb-3">
              <div>
                <h3 className="font-black text-base text-white">Support {stateTitle}</h3>
                <p className="text-xs text-tan-200 font-medium">
                  Select a donation tier to review state contribution levels. Prepared for future payment integration.
                </p>
              </div>
              <span className="px-3 py-1 bg-tan-500 text-forest-950 text-[10px] font-black uppercase rounded-lg">
                Backend API Ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-forest-900 border border-forest-800 space-y-2">
                <div className="font-black text-tan-300 text-sm">Supporter Tier</div>
                <div className="text-xl font-black text-white">$25.00</div>
                <p className="text-[11px] text-tan-200/80">Recognized on official {stateData.name} state donor roll.</p>
              </div>

              <div className="p-4 rounded-xl bg-forest-900 border border-tan-500/60 space-y-2">
                <div className="font-black text-tan-400 text-sm">Patron Tier</div>
                <div className="text-xl font-black text-white">$100.00</div>
                <p className="text-[11px] text-tan-200/80">Includes official {stateData.code} state patch & annual report credit.</p>
              </div>

              <div className="p-4 rounded-xl bg-forest-900 border border-forest-800 space-y-2">
                <div className="font-black text-tan-300 text-sm">Benefactor Tier</div>
                <div className="text-xl font-black text-white">$250.00+</div>
                <p className="text-[11px] text-tan-200/80">VIP state championship banquet pass & donor plaque.</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-tan-300 font-medium border-t border-forest-800/80">
              <span>Future Payment API Endpoint: <code className="font-mono text-white bg-forest-900 px-2 py-0.5 rounded border border-forest-800">POST /api/states/{stateData.id || 'texas'}/donations/pledge</code></span>
              <button
                onClick={() => showToast(`Thank you for your interest in supporting ${stateTitle}! Donation portal will activate with payment gateway integration.`, 'info')}
                className="w-full sm:w-auto px-4 py-2 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black rounded-lg shadow transition-all text-xs"
              >
                Pledge Support
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: OFFICERS */}
      <section id="officers" className="space-y-6">
        <div className="bg-surface-lowest p-6 rounded-2xl border border-surface-border shadow-ambient space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-forest-800 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-tan-600" />
            <span>{stateTitle} Officers & Board of Directors</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {mockOfficers.map((off, idx) => (
              <div key={idx} className="p-5 bg-surface-low rounded-2xl border border-surface-border flex items-center gap-4">
                <img src={off.photo} alt={off.name} className="w-14 h-14 rounded-full object-cover border-2 border-tan-400 shrink-0 shadow-md" />
                <div className="space-y-1 min-w-0">
                  <h4 className="font-black text-sm text-forest-950 truncate">{off.name}</h4>
                  <div className="text-xs font-bold text-tan-800 truncate">{off.title}</div>
                  <div className="text-[10px] text-charcoal-muted font-semibold">Term: {off.term}</div>
                  <div className="text-[10px] text-forest-800 font-mono pt-1 truncate">{off.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10: CONTACT */}
      <section id="contact" className="space-y-6">
        <div className="bg-surface-lowest p-6 sm:p-8 rounded-2xl border border-surface-border shadow-ambient space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-forest-800 flex items-center gap-2">
              <Mail className="w-5 h-5 text-tan-600" />
              <span>Contact {stateTitle}</span>
            </h2>
            <p className="text-xs text-charcoal-muted mt-1">
              Have questions regarding state sanctioning rules, club charters, or event schedules? Contact our office directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4 p-5 rounded-2xl bg-surface-low border border-surface-border text-xs">
              <h4 className="font-black text-sm text-forest-950">State Headquarters</h4>
              <div className="space-y-2 text-charcoal font-medium">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-tan-600" />
                  <span>State Office, {stateData.name} State Charter</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-tan-600" />
                  <span>(800) 555-0192</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-tan-600" />
                  <span>contact@{stateData.code.toLowerCase()}hunting.org</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="lg:col-span-2 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Enter your full name"
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
                    placeholder="name@example.com"
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
                  placeholder="Sanctioning rules, membership inquiry, etc."
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">Message</label>
                <textarea
                  rows={3}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Write your message here..."
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-forest-900 hover:bg-forest-950 text-white font-black text-xs rounded-xl shadow flex items-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-tan-400" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
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
        <Modal isOpen={true} onClose={() => setIsClaimModalOpen(false)} title={`Claim Official Profile: ${stateTitle}`}>
          <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs text-charcoal">
            <div className="bg-surface-low p-3.5 rounded-xl border border-surface-border text-charcoal-muted mb-2">
              <p className="font-semibold leading-relaxed">
                If you are an official officer, state director, or authorized representative of the <strong>{stateTitle}</strong>, you can submit a claim to manage this page. Super Admins will review your details.
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
                placeholder="e.g. Austin Sterling"
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
                  placeholder="e.g. name@statehunting.org"
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
                  placeholder="e.g. (800) 555-0192"
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
                placeholder="Briefly state your role and verification details (e.g. 'I am the state association director and need credentials to oversee affiliated clubs and post news.')"
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
