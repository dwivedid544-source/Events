import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { ConnectedNetworkBanner } from '../../components/common/ConnectedNetworkBanner';
import {
  Search,
  MapPin,
  Calendar,
  Award,
  ChevronRight,
  ShieldCheck,
  Building2,
  Users,
  Trophy,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Compass,
  Newspaper,
  Shield,
  CheckCircle2,
  Mail,
  User,
  ExternalLink,
  Target,
  Medal,
  Flame,
  ArrowUpRight,
  Layers,
  ChevronDown,
  Check
} from 'lucide-react';

export const HomePage = () => {
  const { events, clubs, states, news, products, sponsors, results, enterEvent, dogs, showToast, selectedCategory, setSelectedCategory } = useApp();
  const [selectedSport, setSelectedSport] = useState('Coonhounds');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Custom Modern Sport Dropdown state
  const [isSportDropdownOpen, setIsSportDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSportDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const SPORTS_OPTIONS = [
    { key: 'Coonhounds',        label: 'Coonhounds',        icon: '🐕', status: 'Active Primary',  badgeClass: 'bg-emerald-500 text-white font-black',                              desc: 'Nite Hunts, Treeing Contests & Water Races' },
    { key: 'Beagles',           label: 'Beagles',           icon: '🐶', status: 'Pack Trials',     badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold', desc: 'Rabbit Pack Trials & Field Contests' },
    { key: 'Squirrel Dogs',     label: 'Squirrel Dogs',     icon: '🐿️', status: 'Timber Trials',   badgeClass: 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold',   desc: 'Timber Squirrel Hunts & Treeing Contests' },
    { key: 'Hog Dogs',          label: 'Hog Dogs',          icon: '🐗', status: 'Bay Contests',    badgeClass: 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold', desc: 'Wild Hog Bay & Catch Contests' },
    { key: 'Bear Dogs',         label: 'Bear Dogs',         icon: '🐻', status: 'Big Game',        badgeClass: 'bg-stone-500/20 text-stone-300 border border-stone-500/40 font-bold',  desc: 'Mountain Bear Tracking & Big Game Hunts' },
    { key: 'Rabbit Dogs',       label: 'Rabbit Dogs',       icon: '🐇', status: 'Rabbit Trials',   badgeClass: 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold', desc: 'Rabbit Chasing, Pack & Solo Trials' },
    { key: 'Retrievers',        label: 'Retrievers',        icon: '🦆', status: 'Water Trials',    badgeClass: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold',    desc: 'Water Retrieves, Hunt Tests & Field Trials' },
    { key: 'Cur & Feist',       label: 'Cur & Feist',       icon: '🌲', status: 'Squirrel/Hog',   badgeClass: 'bg-lime-500/20 text-lime-300 border border-lime-500/40 font-bold',    desc: 'Multi-purpose Cur & Feist Squirrel/Hog Trials' },
    { key: 'Competition Hunts', label: 'Competition Hunts', icon: '🏆', status: 'Championship',   badgeClass: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 font-bold', desc: 'Competitive Night Hunts & Championship Events' },
    { key: 'Bench Shows',       label: 'Bench Shows',       icon: '🎖️', status: 'Conformation',   badgeClass: 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold',   desc: 'Breed Conformation & Bench Show Competitions' },
    { key: 'Field Trials',      label: 'Field Trials',      icon: '🌾', status: 'Field Events',   badgeClass: 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold',   desc: 'All-breed Field & Pack Trials' },
    { key: 'Water Races',       label: 'Water Races',       icon: '💧', status: 'Water Events',   badgeClass: 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold',      desc: 'Coonhound Water Race Speed & Line Trials' },
    { key: 'Other Hound Events',label: 'Other Hound Events',icon: '🎯', status: 'All Breeds',     badgeClass: 'bg-neutral-500/20 text-neutral-300 border border-neutral-500/40 font-bold', desc: 'All Other UHC Sanctioned Hound Events' }
  ];

  const currentSport = SPORTS_OPTIONS.find((s) => s.key === selectedSport) || SPORTS_OPTIONS[0];

  // Interactive USA State Hover state
  const [activeHoverState, setActiveHoverState] = useState(states[0] || null);

  // Newsletter Form State
  const [newsletterName, setNewsletterName] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const navigate = useNavigate();

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedSport) params.append('sport', selectedSport);
    if (searchQuery) params.append('query', searchQuery);
    if (selectedState) params.append('state', selectedState);
    if (selectedEventType) params.append('type', selectedEventType);
    if (selectedDate) params.append('date', selectedDate);

    navigate(`/find-hunt?${params.toString()}`);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showToast(`Thank you ${newsletterName || 'Hunter'}! You have subscribed to National Hunting Platform updates.`, 'success');
    setNewsletterName('');
    setNewsletterEmail('');
  };

  // Group Sponsors by Tier
  const goldSponsors = sponsors.filter((s) => s.tier === 'Gold' || s.tier === 'Premier Partner');
  const silverSponsors = sponsors.filter((s) => s.tier === 'Silver' || s.tier === 'Official Nutrition' || s.tier === 'Sanctioning Body');
  const bronzeSponsors = sponsors.filter((s) => s.tier === 'Bronze');

  return (
    <div className="space-y-20 pb-20 bg-surface">
      {/* 1. Hero Section */}
      <section className="relative bg-forest-950 text-white pt-16 pb-24 px-4 lg:px-8 overflow-hidden border-b border-forest-900">
        {/* Background Overlay & Cinematic Lighting */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1511497584788-876761c11969?w=1600&auto=format&fit=crop&q=80')`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/80 via-forest-900/90 to-forest-950 pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-tan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-6xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-forest-900/90 text-tan-300 border border-tan-500/40 text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-lg">
            <img src="/logo.png" alt="UHC Logo" className="h-10 sm:h-12 w-auto object-contain" />
            <span>Ultimate Hound Club (UHC)</span>
          </div>

          {/* Heading & Subheading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Find Your State. Find Your Club. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-tan-300 via-tan-400 to-tan-200">
              Support the Sport.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-tan-100/90 max-w-3xl mx-auto leading-relaxed font-medium">
            The National UHC gateway connects hunters, state associations, and local clubs. Search upcoming hunts & events, find your state, discover local clubs, join or support a club, view national news, shop merchandise, and learn about hound sports.
          </p>

          {/* Search Card Centered Over Hero */}
          <form
            onSubmit={handleHeroSearch}
            className="bg-forest-900/90 backdrop-blur-2xl p-4 sm:p-5 rounded-2xl shadow-2xl text-charcoal max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 border border-forest-700/80 relative z-30"
          >
            {/* Input 1: Custom Modern Sport Selector Dropdown */}
            <div className="relative lg:col-span-3 text-left z-50" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsSportDropdownOpen(!isSportDropdownOpen)}
                className="w-full px-3 py-3 text-xs bg-surface-lowest hover:bg-surface-low text-charcoal border border-surface-border rounded-xl focus:outline-none font-bold flex items-center justify-between shadow-inner cursor-pointer transition-all active:scale-98"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-base shrink-0">{currentSport.icon}</span>
                  <span className="truncate">Choose Sport: <strong className="text-forest-900 font-black">{currentSport.label}</strong></span>
                </div>
                <ChevronDown className={`w-4 h-4 text-charcoal transition-transform duration-200 shrink-0 ${isSportDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Floating Modern Custom Dropdown Menu */}
              {isSportDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-forest-950 border border-tan-500/40 rounded-2xl shadow-2xl z-[100] p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-tan-400 border-b border-forest-800/80 mb-1">
                    Select Hunting Sport Category
                  </div>

                  {SPORTS_OPTIONS.map((sport) => {
                    const isSelected = selectedSport === sport.key;
                    return (
                      <button
                        key={sport.key}
                        type="button"
                        onClick={() => {
                          setSelectedSport(sport.key);
                          setIsSportDropdownOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start gap-3 cursor-pointer group ${
                          isSelected
                            ? 'bg-tan-500/20 border border-tan-400/60 text-white'
                            : 'hover:bg-forest-900/90 border border-transparent text-tan-100/90 hover:text-white'
                        }`}
                      >
                        <span className="text-2xl shrink-0 mt-0.5">{sport.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-extrabold text-xs text-white group-hover:text-tan-300 transition-colors">
                              {sport.label}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[9px] ${sport.badgeClass}`}>
                              {sport.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-tan-200/70 font-medium truncate mt-0.5">
                            {sport.desc}
                          </p>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-tan-400 shrink-0 self-center" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Input 2: ZIP / City */}
            <div className="relative lg:col-span-3">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-tan-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ZIP Code or City..."
                className="w-full pl-10 pr-3 py-3 text-xs bg-surface-lowest border border-surface-border rounded-xl focus:outline-none focus:border-tan-500 font-semibold shadow-inner text-charcoal"
              />
            </div>

            {/* Input 3: Event Type Dropdown */}
            <div className="relative lg:col-span-2">
              <select
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value)}
                className="w-full px-3 py-3 text-xs bg-surface-lowest border border-surface-border rounded-xl focus:outline-none focus:border-tan-500 font-bold text-charcoal appearance-none cursor-pointer"
              >
                <option value="">All Event Types</option>
                <option value="Nite Hunt">Nite Hunt</option>
                <option value="Championship Hunt">Championship Hunt</option>
                <option value="Water Race">Water Race</option>
                <option value="Treeing Contest">Treeing Contest</option>
                <option value="Field Trial">Field Trial</option>
              </select>
            </div>

            {/* Input 4: State Selection */}
            <div className="relative lg:col-span-2">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-3 text-xs bg-surface-lowest border border-surface-border rounded-xl focus:outline-none focus:border-tan-500 font-bold text-charcoal appearance-none cursor-pointer"
              >
                <option value="">All 50 States</option>
                {states.map((s) => (
                  <option key={s.id} value={s.code}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="lg:col-span-2">
              <button
                type="submit"
                className="w-full h-full py-3 px-4 bg-gradient-to-r from-tan-400 to-tan-600 hover:from-tan-500 hover:to-tan-700 text-forest-950 font-black text-xs rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search Hunts</span>
              </button>
            </div>
          </form>

          {/* Quick Statistics Bar */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-forest-900/60 backdrop-blur-md border border-forest-800 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-tan-500/20 text-tan-400 flex items-center justify-center shrink-0 border border-tan-500/30">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl lg:text-2xl font-black text-white leading-tight">635+</div>
                <div className="text-[10px] text-tan-200 uppercase font-black tracking-wider">Local Clubs</div>
              </div>
            </div>

            <div className="bg-forest-900/60 backdrop-blur-md border border-forest-800 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-tan-500/20 text-tan-400 flex items-center justify-center shrink-0 border border-tan-500/30">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl lg:text-2xl font-black text-white leading-tight">50</div>
                <div className="text-[10px] text-tan-200 uppercase font-black tracking-wider">State Charters</div>
              </div>
            </div>

            <div className="bg-forest-900/60 backdrop-blur-md border border-forest-800 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-tan-500/20 text-tan-400 flex items-center justify-center shrink-0 border border-tan-500/30">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl lg:text-2xl font-black text-white leading-tight">20,000+</div>
                <div className="text-[10px] text-tan-200 uppercase font-black tracking-wider">Active Members</div>
              </div>
            </div>

            <div className="bg-forest-900/60 backdrop-blur-md border border-forest-800 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-tan-500/20 text-tan-400 flex items-center justify-center shrink-0 border border-tan-500/30">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl lg:text-2xl font-black text-white leading-tight">500+</div>
                <div className="text-[10px] text-tan-200 uppercase font-black tracking-wider">Annual Events</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core UHC Philosophy & State / Local Gateway Model */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-8 lg:p-12 border border-forest-800 shadow-2xl relative overflow-hidden space-y-8">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-tan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-tan-500/20 text-tan-300 border border-tan-500/40 text-[10px] font-black uppercase tracking-widest inline-block">
              State & Local Gateway Focus
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              National Gateway Supporting <br className="hidden sm:block" />
              <span className="text-tan-400">State Associations & Local Clubs</span>
            </h2>
            <p className="text-xs sm:text-sm text-tan-100/80 font-medium leading-relaxed">
              The National UHC website is the main entrance to the entire UHC system. We promote participation at the State and Local level and do NOT compete with State Associations or Local Clubs.
            </p>
          </div>

          {/* Visual Gateway Hierarchy Diagram */}
          <div className="bg-forest-900/60 backdrop-blur-md rounded-2xl p-6 border border-forest-800 text-center max-w-3xl mx-auto relative z-10">
            <div className="text-[11px] font-black uppercase tracking-widest text-tan-400 mb-4">
              System Hierarchy & Support Flow
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-3">
              <div className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-forest-950 border border-tan-500/40 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-tan-400" />
                <span>National UHC</span>
              </div>
              <div className="text-tan-400 text-xl font-bold font-mono rotate-90 md:rotate-0">↓</div>
              <div className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-forest-950 border border-tan-500/40 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-tan-400" />
                <span>State Associations</span>
              </div>
              <div className="text-tan-400 text-xl font-bold font-mono rotate-90 md:rotate-0">↓</div>
              <div className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-forest-950 border border-tan-500/40 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2">
                <Building2 className="w-4 h-4 text-tan-400" />
                <span>Local Clubs</span>
              </div>
            </div>
            <p className="text-[11px] text-tan-200/80 font-medium mt-4">
              National UHC acts as the main entrance that helps users discover and support their State Associations and Local Clubs.
            </p>
          </div>

          {/* Growth Chain visual representation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            <div className="bg-forest-900/80 backdrop-blur-md rounded-2xl p-5 border border-forest-800 space-y-2 relative group hover:border-tan-500/50 transition-all">
              <div className="w-8 h-8 rounded-lg bg-tan-500 text-forest-950 font-black text-xs flex items-center justify-center shadow-md">
                1
              </div>
              <h3 className="text-sm font-black text-white">Hunters Participate</h3>
              <p className="text-[11px] text-tan-200/80 font-medium leading-normal">
                Hunters enter events, join local clubs, and participate in sanctioned sporting trials.
              </p>
            </div>

            <div className="bg-forest-900/80 backdrop-blur-md rounded-2xl p-5 border border-forest-800 space-y-2 relative group hover:border-tan-500/50 transition-all">
              <div className="w-8 h-8 rounded-lg bg-tan-500 text-forest-950 font-black text-xs flex items-center justify-center shadow-md">
                2
              </div>
              <h3 className="text-sm font-black text-white">Local Clubs Grow</h3>
              <p className="text-[11px] text-tan-200/80 font-medium leading-normal">
                Increased participation builds active local club memberships and community trial grounds.
              </p>
            </div>

            <div className="bg-forest-900/80 backdrop-blur-md rounded-2xl p-5 border border-forest-800 space-y-2 relative group hover:border-tan-500/50 transition-all">
              <div className="w-8 h-8 rounded-lg bg-tan-500 text-forest-950 font-black text-xs flex items-center justify-center shadow-md">
                3
              </div>
              <h3 className="text-sm font-black text-white">State Associations Grow</h3>
              <p className="text-[11px] text-tan-200/80 font-medium leading-normal">
                Stronger local clubs expand state championships, governance, and regional representation.
              </p>
            </div>

            <div className="bg-forest-900/80 backdrop-blur-md rounded-2xl p-5 border border-forest-800 space-y-2 relative group hover:border-tan-500/50 transition-all">
              <div className="w-8 h-8 rounded-lg bg-tan-500 text-forest-950 font-black text-xs flex items-center justify-center shadow-md">
                4
              </div>
              <h3 className="text-sm font-black text-white">National UHC Thrives</h3>
              <p className="text-[11px] text-tan-200/80 font-medium leading-normal">
                The national organization grows when state associations and local clubs flourish together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Connected Network of Platforms Architecture Section (Section 33 UI) */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <ConnectedNetworkBanner />
      </section>

      {/* 3. The 9 Visitor Actions Gateways */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-tan-700">National UHC Gateway</span>
          <h2 className="text-2xl lg:text-4xl font-extrabold text-forest-950 tracking-tight">Explore UHC Visitor Actions</h2>
          <p className="text-xs text-charcoal-muted font-medium">
            Immediate entrance to events, state charters, local clubs, news, store, results, and hound sports.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Action 1: Find Hunts & Events */}
          <Link
            to="/find-hunt"
            className="group bg-surface-lowest rounded-2xl p-5 border border-surface-border shadow-ambient hover:shadow-2xl hover:border-tan-500/60 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-forest-950 text-tan-400 flex items-center justify-center border border-forest-800 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-tan-700">Action 1</span>
                <h3 className="text-base font-black text-forest-950 group-hover:text-tan-700 transition-colors">
                  Find Hunts & Events
                </h3>
                <p className="text-[11px] text-charcoal-muted leading-relaxed font-medium">
                  Search upcoming field trials, nite hunts, treeing contests, and state championships across America.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-[11px] font-black text-forest-800 group-hover:text-tan-700 gap-1">
              <span>Find Hunts & Events</span>
              <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Action 2: Find Their State */}
          <Link
            to="/states"
            className="group bg-surface-lowest rounded-2xl p-5 border border-surface-border shadow-ambient hover:shadow-2xl hover:border-tan-500/60 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-forest-950 text-tan-400 flex items-center justify-center border border-forest-800 group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-tan-700">Action 2</span>
                <h3 className="text-base font-black text-forest-950 group-hover:text-tan-700 transition-colors">
                  Find Your State
                </h3>
                <p className="text-[11px] text-charcoal-muted leading-relaxed font-medium">
                  Locate State Associations, chartered officers, state hunt schedules, and regional governance.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-[11px] font-black text-forest-800 group-hover:text-tan-700 gap-1">
              <span>Find Your State</span>
              <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Action 3: Find a Local Club */}
          <Link
            to="/clubs"
            className="group bg-surface-lowest rounded-2xl p-5 border border-surface-border shadow-ambient hover:shadow-2xl hover:border-tan-500/60 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-forest-950 text-tan-400 flex items-center justify-center border border-forest-800 group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-tan-700">Action 3</span>
                <h3 className="text-base font-black text-forest-950 group-hover:text-tan-700 transition-colors">
                  Find a Local Club
                </h3>
                <p className="text-[11px] text-charcoal-muted leading-relaxed font-medium">
                  Discover over 635+ chartered local hound clubs active in your city or county.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-[11px] font-black text-forest-800 group-hover:text-tan-700 gap-1">
              <span>Find Local Club</span>
              <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Action 4: Join or Support a Club */}
          <Link
            to="/join"
            className="group bg-surface-lowest rounded-2xl p-5 border border-surface-border shadow-ambient hover:shadow-2xl hover:border-tan-500/60 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-forest-950 text-tan-400 flex items-center justify-center border border-forest-800 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-tan-700">Action 4</span>
                <h3 className="text-base font-black text-forest-950 group-hover:text-tan-700 transition-colors">
                  Join or Support a Club
                </h3>
                <p className="text-[11px] text-charcoal-muted leading-relaxed font-medium">
                  Become an active sporting member or financially support local club grounds and youth trials.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-[11px] font-black text-forest-800 group-hover:text-tan-700 gap-1">
              <span>Join or Support</span>
              <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Action 5: View National Hound News */}
          <Link
            to="/news"
            className="group bg-surface-lowest rounded-2xl p-5 border border-surface-border shadow-ambient hover:shadow-2xl hover:border-tan-500/60 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-forest-950 text-tan-400 flex items-center justify-center border border-forest-800 group-hover:scale-110 transition-transform">
                <Newspaper className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-tan-700">Action 5</span>
                <h3 className="text-base font-black text-forest-950 group-hover:text-tan-700 transition-colors">
                  View National Hound News
                </h3>
                <p className="text-[11px] text-charcoal-muted leading-relaxed font-medium">
                  Read official hunt reports, rulebook updates, conservation efforts, and national feature stories.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-[11px] font-black text-forest-800 group-hover:text-tan-700 gap-1">
              <span>View Hound News</span>
              <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Action 6: Shop Merchandise */}
          <Link
            to="/store"
            className="group bg-surface-lowest rounded-2xl p-5 border border-surface-border shadow-ambient hover:shadow-2xl hover:border-tan-500/60 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-forest-950 text-tan-400 flex items-center justify-center border border-forest-800 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-tan-700">Action 6</span>
                <h3 className="text-base font-black text-forest-950 group-hover:text-tan-700 transition-colors">
                  Shop Merchandise
                </h3>
                <p className="text-[11px] text-charcoal-muted leading-relaxed font-medium">
                  Shop official UHC apparel, canine field supplies, and gear that directly support local clubs.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-[11px] font-black text-forest-800 group-hover:text-tan-700 gap-1">
              <span>Shop Merchandise</span>
              <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Action 7: Find Organizations & Federations */}
          <Link
            to="/sponsors"
            className="group bg-surface-lowest rounded-2xl p-5 border border-surface-border shadow-ambient hover:shadow-2xl hover:border-tan-500/60 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-forest-950 text-tan-400 flex items-center justify-center border border-forest-800 group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-tan-700">Action 7</span>
                <h3 className="text-base font-black text-forest-950 group-hover:text-tan-700 transition-colors">
                  Find Organizations & Federations
                </h3>
                <p className="text-[11px] text-charcoal-muted leading-relaxed font-medium">
                  Discover partner registries, hunting federations, wildlife conservation bodies, and official sponsors.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-[11px] font-black text-forest-800 group-hover:text-tan-700 gap-1">
              <span>Find Organizations</span>
              <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Action 8: View Results */}
          <Link
            to="/results"
            className="group bg-surface-lowest rounded-2xl p-5 border border-surface-border shadow-ambient hover:shadow-2xl hover:border-tan-500/60 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-forest-950 text-tan-400 flex items-center justify-center border border-forest-800 group-hover:scale-110 transition-transform">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-tan-700">Action 8</span>
                <h3 className="text-base font-black text-forest-950 group-hover:text-tan-700 transition-colors">
                  View Results
                </h3>
                <p className="text-[11px] text-charcoal-muted leading-relaxed font-medium">
                  Check official field competition scores, national leaderboards, winner profiles, and champion dogs.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-[11px] font-black text-forest-800 group-hover:text-tan-700 gap-1">
              <span>View Results</span>
              <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Action 9: Learn About Different Hound Sports */}
          <a
            href="#hound-sports"
            className="group bg-surface-lowest rounded-2xl p-5 border border-surface-border shadow-ambient hover:shadow-2xl hover:border-tan-500/60 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-forest-950 text-tan-400 flex items-center justify-center border border-forest-800 group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-tan-700">Action 9</span>
                <h3 className="text-base font-black text-forest-950 group-hover:text-tan-700 transition-colors">
                  Learn About Hound Sports
                </h3>
                <p className="text-[11px] text-charcoal-muted leading-relaxed font-medium">
                  Learn about Coonhounds, Beagles, Squirrel Dogs, Hog Dogs, Nite Hunts, Pack Trials, and Treeing contests.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-[11px] font-black text-forest-800 group-hover:text-tan-700 gap-1">
              <span>Learn Hound Sports</span>
              <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
        </div>
      </section>

      {/* Dedicated Hound Sports Overview Section */}
      <section id="hound-sports" className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
        <div className="bg-surface-lowest border border-surface-border rounded-3xl p-8 lg:p-10 shadow-ambient space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-tan-700">Discipline Guides</span>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-forest-950 tracking-tight">Hound Sport Categories</h2>
              <p className="text-sm text-charcoal-muted mt-1 font-medium">Select a category to explore hunts, clubs, and events near you.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-forest-950 text-tan-300 text-[10px] font-black uppercase tracking-wider self-start sm:self-auto border border-forest-800">
              13 UHC Sanctioned Disciplines
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {SPORTS_OPTIONS.map((sport) => {
              const isActive = (selectedCategory || selectedSport) === sport.key;
              return (
                <div
                  key={sport.key}
                  onClick={() => { setSelectedSport(sport.key); setSelectedCategory(sport.key); }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isActive
                      ? 'bg-forest-950 text-white border-tan-500 shadow-xl scale-[1.02]'
                      : 'bg-surface-low/80 hover:bg-surface-lowest text-forest-950 border-surface-border hover:border-tan-500/50 hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{sport.icon}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] ${sport.badgeClass}`}>
                      {sport.status}
                    </span>
                  </div>
                  <div>
                    <h3 className={`font-black text-sm leading-tight ${isActive ? 'text-tan-300' : 'text-forest-950'}`}>
                      {sport.label}
                    </h3>
                    <p className={`text-[11px] mt-1 leading-relaxed font-medium ${isActive ? 'text-tan-100/80' : 'text-charcoal-muted'}`}>
                      {sport.desc}
                    </p>
                  </div>
                  <div className={`flex items-center text-[9px] font-black uppercase tracking-wider gap-1 ${isActive ? 'text-tan-400' : 'text-forest-700'}`}>
                    <span>{isActive ? '✓ Selected' : 'Explore'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA when a category is selected */}
          {(selectedCategory || selectedSport) && (
            <div className="mt-4 p-4 bg-forest-950/5 border border-forest-950/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-forest-950">
                  Browsing: <span className="text-tan-700">{selectedCategory || selectedSport}</span>
                </p>
                <p className="text-xs text-charcoal-muted font-medium">Find hunts, clubs, and events for this discipline.</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <a href="/find-hunt" className="px-4 py-2 rounded-xl bg-forest-950 text-tan-300 text-xs font-black hover:bg-forest-900 transition-colors">
                  Find Events →
                </a>
                <a href="/clubs" className="px-4 py-2 rounded-xl border border-forest-950 text-forest-950 text-xs font-black hover:bg-forest-950 hover:text-tan-300 transition-colors">
                  Find Clubs →
                </a>
              </div>
            </div>
          )}
        </div>
      </section>


      {/* 4. Infrastructure Support Pillars & Identity Preservation Banner */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        <div className="bg-surface-lowest border border-surface-border rounded-3xl p-8 lg:p-10 shadow-ambient space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-surface-border pb-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-tan-700">Turnkey Technology Suite</span>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-forest-950 tracking-tight">How UHC Empowers Existing Organizations</h2>
            </div>
            <div className="px-4 py-2 rounded-full bg-forest-950 text-tan-300 text-xs font-black uppercase tracking-wider flex items-center gap-2 self-start md:self-auto border border-forest-800">
              <ShieldCheck className="w-4 h-4 text-tan-400" />
              <span>Independent Branding Maintained</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-surface-low/60 border border-surface-border space-y-2">
              <div className="text-tan-700 font-black text-xs uppercase tracking-wider">01. Technology</div>
              <h3 className="text-base font-extrabold text-forest-950">Digital Event & Entry Management</h3>
              <p className="text-xs text-charcoal-muted font-medium leading-relaxed">
                Streamlined mobile check-ins, automated scorekeeping, and digital pedigree verification for club officers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-low/60 border border-surface-border space-y-2">
              <div className="text-tan-700 font-black text-xs uppercase tracking-wider">02. Exposure</div>
              <h3 className="text-base font-extrabold text-forest-950">Nationwide Event Promotion</h3>
              <p className="text-xs text-charcoal-muted font-medium leading-relaxed">
                Local club hunts and state championships are promoted directly to thousands of active hunters nationwide.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-low/60 border border-surface-border space-y-2">
              <div className="text-tan-700 font-black text-xs uppercase tracking-wider">03. Membership Tools</div>
              <h3 className="text-base font-extrabold text-forest-950">Automated Roster & Dues</h3>
              <p className="text-xs text-charcoal-muted font-medium leading-relaxed">
                Digital member ID cards, instant online renewals, and automated dues distribution straight to club accounts.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-low/60 border border-surface-border space-y-2">
              <div className="text-tan-700 font-black text-xs uppercase tracking-wider">04. Event Promotion</div>
              <h3 className="text-base font-extrabold text-forest-950">Pre-Signups & Live Schedules</h3>
              <p className="text-xs text-charcoal-muted font-medium leading-relaxed">
                Hunters pre-register for nite hunts and water races online, reducing registration table chaos.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-low/60 border border-surface-border space-y-2">
              <div className="text-tan-700 font-black text-xs uppercase tracking-wider">05. Merchandise Systems</div>
              <h3 className="text-base font-extrabold text-forest-950">Custom Storefronts</h3>
              <p className="text-xs text-charcoal-muted font-medium leading-relaxed">
                State associations and local clubs get turn-key official apparel & gear online stores without inventory risk.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-low/60 border border-surface-border space-y-2">
              <div className="text-tan-700 font-black text-xs uppercase tracking-wider">06. Income Generation</div>
              <h3 className="text-base font-extrabold text-forest-950">Direct Margin Share Payouts</h3>
              <p className="text-xs text-charcoal-muted font-medium leading-relaxed">
                Wholesale-to-retail margin differences flow back to state associations and local clubs to fund youth events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Upcoming National Events */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-tan-700">Official Field Competitions</span>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-forest-950 tracking-tight">Upcoming Events</h2>
          </div>
          <Link
            to="/find-hunt"
            className="text-xs font-black text-forest-800 hover:text-tan-700 flex items-center gap-1.5 group"
          >
            <span>View All Events</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, 3).map((evt) => (
            <div
              key={evt.id}
              className="group bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:border-forest-800/40 transition-all duration-300"
            >
              <div className="relative h-44 overflow-hidden bg-forest-950">
                <img
                  src={
                    evt.image ||
                    (evt.type === 'Water Race'
                      ? 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&auto=format&fit=crop&q=80'
                      : 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80')
                  }
                  alt=""
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&auto=format&fit=crop&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-transparent to-transparent"></div>
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-forest-950/90 text-tan-300 border border-forest-700 backdrop-blur-md">
                  {evt.type}
                </span>
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[9px] font-black uppercase bg-tan-500 text-forest-950 shadow-md">
                  ${evt.fee} Fee
                </span>
                <div className="absolute bottom-3 left-3 text-white font-bold text-xs flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-tan-400" />
                  <span>{evt.city}, {evt.state}</span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="font-black text-lg text-forest-950 group-hover:text-tan-700 transition-colors leading-snug">
                  {evt.name}
                </h3>

                <div className="space-y-2 text-xs text-charcoal-muted font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-tan-600 shrink-0" />
                    <span>{evt.date} • {evt.startTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-tan-600 shrink-0" />
                    <span>{evt.club}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-surface-low/80 border-t border-surface-border flex items-center justify-between gap-3">
                <Link
                  to={`/find-hunt?event=${evt.id}`}
                  className="w-full text-center py-2.5 rounded-xl text-xs font-black bg-forest-900 hover:bg-forest-950 text-white shadow-md transition-all active:scale-95"
                >
                  Register Button
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* 4. State Associations */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-tan-700">State Governance & Charters</span>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-forest-950 tracking-tight">State Associations</h2>
          </div>
          <Link to="/states" className="text-xs font-black text-forest-800 hover:text-tan-700 flex items-center gap-1.5">
            <span>View All States ({states.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {states.slice(0, 4).map((s) => (
            <div
              key={s.id}
              className="group bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient p-6 flex flex-col justify-between hover:shadow-2xl hover:border-tan-500/60 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-forest-900/10 text-forest-900 flex items-center justify-center font-black text-base border border-surface-border group-hover:scale-105 transition-transform overflow-hidden">
                    {s.logo ? (
                      <img src={s.logo} alt={s.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{s.code}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-tan-100 text-tan-900">
                      {s.code} State Charter
                    </span>
                    <h3 className="font-black text-base text-forest-950 group-hover:text-tan-700 transition-colors mt-0.5">
                      {s.name} Association
                    </h3>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-charcoal-muted font-medium pt-2 border-t border-surface-border">
                  <div className="flex justify-between">
                    <span>Affiliated Clubs:</span>
                    <span className="font-bold text-charcoal">{s.clubsCount} Clubs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Members:</span>
                    <span className="font-bold text-charcoal">{s.membersCount} Members</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Upcoming Events:</span>
                    <span className="font-bold text-forest-800">{s.eventsCount} Events</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  to={`/states/${s.id}`}
                  className="w-full py-2.5 bg-forest-900 hover:bg-forest-950 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1 transition-all"
                >
                  <span>View State</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Featured Clubs */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-tan-700">Nationwide Network</span>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-forest-950 tracking-tight">Featured Clubs</h2>
          </div>
          <Link to="/clubs" className="text-xs font-black text-forest-800 hover:text-tan-700 flex items-center gap-1.5">
            <span>View All Clubs</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {clubs.map((c) => (
            <div
              key={c.id}
              className="group bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient p-6 flex flex-col justify-between hover:shadow-2xl hover:border-tan-500/60 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={c.logo}
                    alt={c.name}
                    className="w-12 h-12 rounded-xl object-cover border border-surface-border group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-tan-100 text-tan-900">
                      {c.stateCode}
                    </span>
                    <h3 className="font-black text-sm text-forest-950 group-hover:text-tan-700 transition-colors mt-0.5">
                      {c.name}
                    </h3>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-charcoal-muted font-medium pt-2 border-t border-surface-border">
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-bold text-charcoal">{c.city}, {c.stateCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Member Count:</span>
                    <span className="font-bold text-charcoal">{c.membersCount} Members</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Upcoming Events:</span>
                    <span className="font-bold text-forest-800">{c.eventsCount} Events</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  to={`/clubs/${c.id}`}
                  className="w-full py-2.5 bg-forest-900 hover:bg-forest-950 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1 transition-all"
                >
                  <span>View Club</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Latest News */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-tan-700">Official Announcements</span>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-forest-950 tracking-tight">Latest News</h2>
          </div>
          <Link to="/news" className="text-xs font-black text-forest-800 hover:text-tan-700 flex items-center gap-1.5">
            <span>Read All News</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="group bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:border-tan-500/60 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden bg-forest-950">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1511497584788-876761c11969?w=600&auto=format&fit=crop&q=80'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 text-[9px] uppercase font-black px-2.5 py-1 rounded-full bg-forest-950/90 text-tan-300 backdrop-blur-md border border-forest-800">
                  {item.category}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="text-[10px] font-bold text-tan-700">{item.date} • By {item.author}</div>
                <h3 className="font-black text-base text-forest-950 group-hover:text-tan-700 transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed font-medium">
                  {item.summary}
                </p>
              </div>

              <div className="p-4 bg-surface-low/80 border-t border-surface-border">
                <Link
                  to="/news"
                  className="inline-flex items-center gap-1.5 text-xs font-black text-forest-800 hover:text-tan-700 group-hover:translate-x-1 transition-all"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. National Competition Results */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-tan-700">Leaderboards & Champions</span>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-forest-950 tracking-tight">National Results</h2>
          </div>
          <Link to="/results" className="text-xs font-black text-forest-800 hover:text-tan-700 flex items-center gap-1.5">
            <span>View All Results</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-forest-950 text-tan-300 font-black uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Event</th>
                  <th className="py-3.5 px-4">Club</th>
                  <th className="py-3.5 px-4">State</th>
                  <th className="py-3.5 px-6">Winner (Dog & Owner)</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border font-medium">
                {results.map((res) => (
                  <tr key={res.id} className="hover:bg-surface-low/80 transition-colors">
                    <td className="py-4 px-6 font-extrabold text-forest-950">{res.eventName}</td>
                    <td className="py-4 px-4 text-charcoal">{res.club}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-tan-100 text-tan-900 border border-tan-300">
                        {res.state}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-black text-forest-900">{res.winnerDog} ({res.score})</div>
                      <div className="text-[10px] text-charcoal-light">Owner: {res.owner} • {res.breed}</div>
                    </td>
                    <td className="py-4 px-4 text-charcoal-muted">{res.date}</td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        to="/results"
                        className="px-3 py-1.5 rounded-lg bg-surface-low hover:bg-forest-900 hover:text-white text-forest-900 font-bold text-[11px] border border-surface-border transition-all"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 8. National Store */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-tan-700">Official Gear & Apparel</span>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-forest-950 tracking-tight">National Store</h2>
          </div>
          <Link to="/store" className="text-xs font-black text-forest-800 hover:text-tan-700 flex items-center gap-1.5">
            <span>Explore Full Store</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="group bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:border-tan-500/60 transition-all duration-300"
            >
              <div className="relative overflow-hidden h-48 bg-surface-low">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 text-[9px] uppercase font-black px-2.5 py-1 rounded-full bg-forest-950/90 text-tan-300 backdrop-blur-md border border-forest-800">
                  {item.category}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-extrabold text-sm text-forest-950 group-hover:text-tan-700 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-charcoal-muted line-clamp-1">{item.description}</p>
                <div className="text-xl font-black text-forest-950">${item.price.toFixed(2)}</div>
              </div>

              <div className="p-4 bg-surface-low/80 border-t border-surface-border flex items-center justify-between">
                <span className="text-[10px] text-charcoal-light font-bold">{item.inStock > 0 ? `${item.inStock} in stock` : 'Out of stock'}</span>
                <button
                  onClick={() => {
                    addToCart(item);
                    navigate('/cart');
                  }}
                  disabled={item.inStock <= 0}
                  className="px-4 py-2 bg-tan-500 hover:bg-tan-600 active:scale-95 text-forest-950 font-black text-xs rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Organizations, Federations & Sponsors */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-tan-700">Registries & Industry Partners</span>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-forest-950 tracking-tight">Organizations & Federations</h2>
          <p className="text-xs text-charcoal-muted font-medium">Connecting with national hunting federations, registries, and official industry partners.</p>
        </div>

        {/* Gold Sponsors */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-tan-700">
            <Medal className="w-4 h-4 text-tan-500" />
            <span>Gold Partners</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {goldSponsors.map((sp) => (
              <a
                key={sp.id}
                href={sp.website || '#'}
                target="_blank"
                rel="noreferrer"
                className="bg-surface-lowest p-6 rounded-2xl border-2 border-tan-400/50 shadow-md hover:shadow-xl transition-all flex items-center gap-4 group"
              >
                <img src={sp.logo} alt={sp.name} className="w-14 h-14 object-cover rounded-xl border border-surface-border" />
                <div>
                  <div className="font-black text-sm text-forest-950 group-hover:text-tan-700 transition-colors">{sp.name}</div>
                  <div className="text-[10px] font-bold text-tan-600 uppercase">{sp.category}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Silver & Bronze Sponsors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Silver Tier */}
          <div className="space-y-3">
            <div className="text-xs font-black uppercase tracking-wider text-charcoal-muted flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-400" />
              <span>Silver Partners</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {silverSponsors.map((sp) => (
                <div key={sp.id} className="bg-surface-lowest p-4 rounded-xl border border-surface-border flex items-center gap-3">
                  <img src={sp.logo} alt={sp.name} className="w-10 h-10 object-cover rounded-lg" />
                  <div>
                    <div className="font-extrabold text-xs text-forest-950">{sp.name}</div>
                    <div className="text-[9px] text-charcoal-light">{sp.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bronze Tier */}
          <div className="space-y-3">
            <div className="text-xs font-black uppercase tracking-wider text-charcoal-muted flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-700" />
              <span>Bronze Partners</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {bronzeSponsors.map((sp) => (
                <div key={sp.id} className="bg-surface-lowest p-4 rounded-xl border border-surface-border flex items-center gap-3">
                  <img src={sp.logo} alt={sp.name} className="w-10 h-10 object-cover rounded-lg" />
                  <div>
                    <div className="font-extrabold text-xs text-forest-950">{sp.name}</div>
                    <div className="text-[9px] text-charcoal-light">{sp.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. Membership Banner */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="relative bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-8 lg:p-14 overflow-hidden border border-forest-800 shadow-2xl">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1544816155-12df9643f363?w=1600&auto=format&fit=crop&q=80')`
            }}
          ></div>

          <div className="relative max-w-3xl space-y-6">
            <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500/20 text-tan-300 border border-tan-500/40">
              National Membership Network
            </span>

            <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Become Part of America's Largest Hunting Community
            </h2>

            <p className="text-xs sm:text-sm text-tan-100/90 leading-relaxed">
              Gain official competition status, register digital canine credentials, compete in national leaderboards, and support wildlife conservation efforts across all 50 State Associations.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/join"
                className="px-8 py-3.5 bg-gradient-to-r from-tan-400 to-tan-600 hover:from-tan-500 hover:to-tan-700 text-forest-950 font-black text-xs rounded-xl shadow-xl transition-all transform active:scale-95 flex items-center gap-2"
              >
                <span>Join Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/clubs"
                className="px-8 py-3.5 bg-forest-900/90 hover:bg-forest-800 border border-forest-700 text-white font-extrabold text-xs rounded-xl transition-all"
              >
                Find a Club
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NATIONAL STORE PRODUCTS SECTION ─── */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
              🏠 National Store
            </span>
            <h2 className="text-2xl lg:text-3xl font-black text-charcoal mt-2">Official UHC National Merchandise</h2>
            <p className="text-xs text-charcoal-muted mt-1 font-medium">Exclusive gear available nationwide — straight from the National Headquarters store.</p>
          </div>
          <Link to="/store" className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-900 text-white font-black text-xs hover:bg-forest-950 transition-all">
            <ShoppingBag className="w-3.5 h-3.5 text-tan-400" />
            <span>Full Store</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.filter((p) => p.scopeChannel === 'NATIONAL').slice(0, 4).map((product) => (
            <div key={product.id} className="bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient overflow-hidden group hover:shadow-xl hover:border-tan-500/50 transition-all duration-300 flex flex-col">
              <div className="relative overflow-hidden h-44 bg-surface-low">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-forest-950/80 text-tan-300 text-[9px] font-black uppercase backdrop-blur-sm">
                  {product.category}
                </span>
              </div>
              <div className="p-4 flex flex-col flex-1 gap-3">
                <div>
                  <h3 className="font-black text-sm text-charcoal leading-snug line-clamp-2">{product.name}</h3>
                  <p className="text-[10px] text-charcoal-muted mt-1 line-clamp-2">{product.description}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2 border-t border-surface-border">
                  <span className="text-lg font-black text-forest-800">${product.price.toLocaleString()}</span>
                  <button
                    onClick={() => { addToCart(product, 1); showToast(`${product.name} added to cart!`, 'success'); }}
                    className="px-3 py-1.5 rounded-lg bg-forest-900 hover:bg-forest-950 text-white text-[10px] font-black flex items-center gap-1 transition-all"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="bg-surface-lowest rounded-3xl p-8 lg:p-12 border border-surface-border shadow-ambient grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-tan-700">Stay Connected</span>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-forest-950 tracking-tight">
              Subscribe to National Hunting Updates
            </h2>
            <p className="text-xs text-charcoal-muted leading-relaxed font-medium">
              Receive major trial announcements, sanction rulebook updates, and state championship dates directly in your inbox.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="lg:col-span-6 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light" />
                <input
                  type="text"
                  value={newsletterName}
                  onChange={(e) => setNewsletterName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full pl-10 pr-4 py-3 text-xs bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-tan-500 font-semibold"
                />
              </div>

              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light" />
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full pl-10 pr-4 py-3 text-xs bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-tan-500 font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-forest-900 hover:bg-forest-950 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-tan-400" />
              <span>Subscribe</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

