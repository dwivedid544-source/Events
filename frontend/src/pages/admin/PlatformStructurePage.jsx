import React, { useState } from 'react';
import {
  Globe,
  MapPin,
  Building2,
  Calendar,
  Newspaper,
  ShoppingBag,
  Store,
  Users,
  Award,
  Trophy,
  Sliders,
  ExternalLink,
  CheckCircle2,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PlatformStructurePage = () => {
  const [selectedState, setSelectedState] = useState('texas');

  // Exact state list specified by client: Texas, Arkansas, Louisiana, Oklahoma, Missouri, etc.
  const statesList = [
    { id: 'texas', name: 'Texas State Association', code: 'TX' },
    { id: 'arkansas', name: 'Arkansas State Association', code: 'AR' },
    { id: 'louisiana', name: 'Louisiana State Association', code: 'LA' },
    { id: 'oklahoma', name: 'Oklahoma State Association', code: 'OK' },
    { id: 'missouri', name: 'Missouri State Association', code: 'MO' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-tan-500/40 shadow-2xl space-y-4">
        <div className="space-y-2 max-w-3xl">
          <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
            Client Required Platform Architecture
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            UHC 3-Tier Platform Structure Matrix
          </h1>
          <p className="text-xs sm:text-sm text-tan-200 font-medium leading-relaxed">
            Strict hierarchical structure containing the exact client-specified pages and features for <strong>National HQ</strong>, <strong>State Associations</strong>, and <strong>Local Clubs</strong>.
          </p>
        </div>
      </div>

      {/* 3-TIER PLATFORM MATRIX */}
      <div className="space-y-8">
        {/* TIER 1: ULTIMATE HOUND CLUB — NATIONAL (7 ITEMS) */}
        <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border-2 border-tan-500 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-forest-950 text-tan-300 font-black flex items-center justify-center shadow-lg border border-tan-500">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-tan-500 text-forest-950">
                  Tier 1 — National Level
                </span>
                <h2 className="text-xl font-black text-forest-950 mt-0.5">
                  ULTIMATE HOUND CLUB — NATIONAL
                </h2>
              </div>
            </div>
            <span className="px-3 py-1 bg-surface-low text-forest-950 font-black text-xs rounded-xl border border-surface-border">
              Exact 7 National Components
            </span>
          </div>

          {/* 7 National Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-bold">
            <Link to="/national" className="p-4 rounded-2xl bg-surface-low border hover:border-tan-500 transition-all space-y-1 block">
              <div className="flex items-center justify-between text-forest-950">
                <span>1. National Homepage</span>
                <Globe className="w-4 h-4 text-tan-600" />
              </div>
              <span className="text-[10px] text-charcoal-muted font-mono block">/national</span>
            </Link>

            <Link to="/events" className="p-4 rounded-2xl bg-surface-low border hover:border-tan-500 transition-all space-y-1 block">
              <div className="flex items-center justify-between text-forest-950">
                <span>2. Events</span>
                <Calendar className="w-4 h-4 text-tan-600" />
              </div>
              <span className="text-[10px] text-charcoal-muted font-mono block">/events</span>
            </Link>

            <Link to="/news" className="p-4 rounded-2xl bg-surface-low border hover:border-tan-500 transition-all space-y-1 block">
              <div className="flex items-center justify-between text-forest-950">
                <span>3. National News</span>
                <Newspaper className="w-4 h-4 text-tan-600" />
              </div>
              <span className="text-[10px] text-charcoal-muted font-mono block">/news</span>
            </Link>

            <Link to="/marketplace" className="p-4 rounded-2xl bg-surface-low border hover:border-tan-500 transition-all space-y-1 block">
              <div className="flex items-center justify-between text-forest-950">
                <span>4. Marketplace</span>
                <Store className="w-4 h-4 text-tan-600" />
              </div>
              <span className="text-[10px] text-charcoal-muted font-mono block">/marketplace</span>
            </Link>

            <Link to="/states" className="p-4 rounded-2xl bg-surface-low border hover:border-tan-500 transition-all space-y-1 block">
              <div className="flex items-center justify-between text-forest-950">
                <span>5. State Directory</span>
                <MapPin className="w-4 h-4 text-tan-600" />
              </div>
              <span className="text-[10px] text-charcoal-muted font-mono block">/states</span>
            </Link>

            <Link to="/sports" className="p-4 rounded-2xl bg-surface-low border hover:border-tan-500 transition-all space-y-1 block">
              <div className="flex items-center justify-between text-forest-950">
                <span>6. Hound Sports</span>
                <Trophy className="w-4 h-4 text-tan-600" />
              </div>
              <span className="text-[10px] text-charcoal-muted font-mono block">/sports</span>
            </Link>

            <Link to="/join" className="p-4 rounded-2xl bg-surface-low border hover:border-tan-500 transition-all space-y-1 block sm:col-span-2 lg:col-span-2">
              <div className="flex items-center justify-between text-forest-950">
                <span>7. National Membership</span>
                <Users className="w-4 h-4 text-tan-600" />
              </div>
              <span className="text-[10px] text-charcoal-muted font-mono block">/join</span>
            </Link>
          </div>
        </div>

        {/* TIER 2: STATE ASSOCIATIONS (7 ITEMS PER STATE) */}
        <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border-2 border-amber-500/50 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-700 text-white font-black flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
                  Tier 2 — State Associations
                </span>
                <h2 className="text-xl font-black text-amber-950 mt-0.5">
                  STATE ASSOCIATIONS (Texas, Arkansas, Louisiana, Oklahoma, Missouri, etc.)
                </h2>
              </div>
            </div>

            {/* State Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-charcoal-muted">Select State:</span>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-3 py-1.5 bg-surface-low border border-surface-border rounded-xl font-bold text-xs"
              >
                {statesList.map((st) => (
                  <option key={st.id} value={st.id}>{st.name} ({st.code})</option>
                ))}
              </select>
            </div>
          </div>

          {/* 7 State Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-bold">
            <Link to={`/states/${selectedState}`} className="p-4 rounded-2xl bg-surface-low border hover:border-amber-500 transition-all space-y-1 block">
              <div className="flex items-center justify-between text-forest-950">
                <span>1. State Homepage</span>
                <Globe className="w-4 h-4 text-amber-700" />
              </div>
              <span className="text-[10px] text-charcoal-muted font-mono block">/states/{selectedState}</span>
            </Link>

            <Link to={`/states/${selectedState}#events`} className="p-4 rounded-2xl bg-surface-low border hover:border-amber-500 transition-all space-y-1 block">
              <div className="flex items-center justify-between text-forest-950">
                <span>2. State Events</span>
                <Calendar className="w-4 h-4 text-amber-700" />
              </div>
              <span className="text-[10px] text-charcoal-muted font-mono block">/states/{selectedState}#events</span>
            </Link>

            <Link to={`/states/${selectedState}#news`} className="p-4 rounded-2xl bg-surface-low border hover:border-amber-500 transition-all space-y-1 block">
              <div className="flex items-center justify-between text-forest-950">
                <span>3. State News</span>
                <Newspaper className="w-4 h-4 text-amber-700" />
              </div>
              <span className="text-[10px] text-charcoal-muted font-mono block">/states/{selectedState}#news</span>
            </Link>

            <Link to={`/join-${selectedState}`} className="p-4 rounded-2xl bg-surface-low border hover:border-amber-500 transition-all space-y-1 block">
              <div className="flex items-center justify-between text-forest-950">
                <span>4. State Membership</span>
                <Users className="w-4 h-4 text-amber-700" />
              </div>
              <span className="text-[10px] text-charcoal-muted font-mono block">/join-{selectedState}</span>
            </Link>

            <Link to="/store" className="p-4 rounded-2xl bg-surface-low border hover:border-amber-500 transition-all space-y-1 block">
              <div className="flex items-center justify-between text-forest-950">
                <span>5. State Merchandise</span>
                <ShoppingBag className="w-4 h-4 text-amber-700" />
              </div>
              <span className="text-[10px] text-charcoal-muted font-mono block">/store?tier=State</span>
            </Link>

            <Link to={`/states/${selectedState}#clubs`} className="p-4 rounded-2xl bg-surface-low border hover:border-amber-500 transition-all space-y-1 block">
              <div className="flex items-center justify-between text-forest-950">
                <span>6. State Club Directory</span>
                <Building2 className="w-4 h-4 text-amber-700" />
              </div>
              <span className="text-[10px] text-charcoal-muted font-mono block">/states/{selectedState}#clubs</span>
            </Link>

            <Link to="/state-admin" className="p-4 rounded-2xl bg-surface-low border hover:border-amber-500 transition-all space-y-1 block sm:col-span-2 lg:col-span-2">
              <div className="flex items-center justify-between text-forest-950">
                <span>7. State Management Dashboard</span>
                <Sliders className="w-4 h-4 text-amber-700" />
              </div>
              <span className="text-[10px] text-charcoal-muted font-mono block">/state-admin</span>
            </Link>
          </div>
        </div>

        {/* TIER 3: LOCAL CLUBS (7 ITEMS PER CLUB) */}
        <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/50 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white font-black flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                  Tier 3 — Local Clubs
                </span>
                <h2 className="text-xl font-black text-emerald-950 mt-0.5">
                  LOCAL CLUBS (e.g. Houston County Coon Hunters Association)
                </h2>
              </div>
            </div>
            <span className="px-3 py-1 bg-surface-low text-forest-950 font-black text-xs rounded-xl border border-surface-border">
              Exact 7 Club Components
            </span>
          </div>

          {/* 7 Local Club Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-bold">
            <Link to="/clubs/club-tx-houston" className="p-4 rounded-2xl bg-surface-low border hover:border-emerald-500 transition-all space-y-1 block">
              <div className="flex items-center justify-between text-forest-950">
                <span>1. Club Homepage</span>
                <Globe className="w-4 h-4 text-emerald-700" />
              </div>
              <span className="text-[10px] text-charcoal-muted font-mono block">/clubs/club-tx-houston</span>
            </Link>

            <Link to="/clubs/club-tx-houston#events" className="p-4 rounded-2xl bg-surface-low border hover:border-emerald-500 transition-all space-y-1 block">
              <div className="flex items-center justify-between text-forest-950">
                <span>2. Club Events</span>
                <Calendar className="w-4 h-4 text-emerald-700" />
              </div>
              <span className="text-[10px] text-charcoal-muted font-mono block">/clubs/club-tx-houston#events</span>
            </Link>

            <Link to="/clubs/club-tx-houston#news" className="p-4 rounded-2xl bg-surface-low border hover:border-emerald-500 transition-all space-y-1 block">
              <div className="flex items-center justify-between text-forest-950">
                <span>3. Club News</span>
                <Newspaper className="w-4 h-4 text-emerald-700" />
              </div>
              <span className="text-[10px] text-charcoal-muted font-mono block">/clubs/club-tx-houston#news</span>
            </Link>

            <Link to="/join-houston-county" className="p-4 rounded-2xl bg-surface-low border hover:border-emerald-500 transition-all space-y-1 block">
              <div className="flex items-center justify-between text-forest-950">
                <span>4. Club Membership</span>
                <Users className="w-4 h-4 text-emerald-700" />
              </div>
              <span className="text-[10px] text-charcoal-muted font-mono block">/join-houston-county</span>
            </Link>

            <Link to="/clubs/club-tx-houston#merchandise" className="p-4 rounded-2xl bg-surface-low border hover:border-emerald-500 transition-all space-y-1 block">
              <div className="flex items-center justify-between text-forest-950">
                <span>5. Club Merchandise</span>
                <ShoppingBag className="w-4 h-4 text-emerald-700" />
              </div>
              <span className="text-[10px] text-charcoal-muted font-mono block">/clubs/club-tx-houston#merchandise</span>
            </Link>

            <Link to="/clubs/club-tx-houston#results" className="p-4 rounded-2xl bg-surface-low border hover:border-emerald-500 transition-all space-y-1 block">
              <div className="flex items-center justify-between text-forest-950">
                <span>6. Club Results</span>
                <Trophy className="w-4 h-4 text-emerald-700" />
              </div>
              <span className="text-[10px] text-charcoal-muted font-mono block">/clubs/club-tx-houston#results</span>
            </Link>

            <Link to="/club-admin" className="p-4 rounded-2xl bg-surface-low border hover:border-emerald-500 transition-all space-y-1 block sm:col-span-2 lg:col-span-2">
              <div className="flex items-center justify-between text-forest-950">
                <span>7. Club Management Dashboard</span>
                <Sliders className="w-4 h-4 text-emerald-700" />
              </div>
              <span className="text-[10px] text-charcoal-muted font-mono block">/club-admin</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
