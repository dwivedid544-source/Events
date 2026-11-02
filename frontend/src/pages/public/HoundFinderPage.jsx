import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Award,
  ShieldCheck,
  Trophy,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  User,
  HeartHandshake,
  Activity,
  ArrowUpDown,
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';

export const HoundFinderPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedHound, setSelectedHound] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Sample verified hound athletes database based on UHC competition rules
  const houndsData = [
    {
      id: 'hound-1',
      name: 'BOGGY CREEK KOBE',
      photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
      breed: 'Treeing Walker Coonhound',
      sex: 'Male (Sire)',
      dob: 'Mar 12, 2021 (5 Yrs)',
      weight: '64 lbs',
      owner: 'James Wadley',
      handler: 'Cody Campbell',
      kennel: 'Boggy Creek Kennels',
      city: 'Knoxville',
      state: 'TN',
      pkcReg: 'PKC-847291-TN',
      ukcReg: 'UKC-W198274',
      proSportReg: 'PS-38291',
      isVerified: true,
      verificationSource: 'Official UHC Trial System',
      isAvailableAtStud: true,
      studTier: 'Premier Stud',
      studFee: '$500 / Private Treaty',
      rankNational: 1,
      rankState: 1,
      career: {
        hunts: 42,
        wins: 28,
        losses: 10,
        splits: 2,
        withdrawals: 2,
        dw: 0,
        winRate: 66.7,
        finalCasts: 9,
        championships: 3,
        earnings: 18750
      },
      registryWins: {
        pkc: { titles: 'Gold Champion', earnings: '$12,400', majorWins: '2025 PKC Blue Ribbon Slam Cast Winner' },
        ukc: { titles: 'Grand Nite Champion (GRNITECH)', championships: '2025 Autumn Oaks Top 16', majorWins: 'Tennessee State Championship Winner' },
        proSport: { titles: 'ProSport Open Champion', earnings: '$6,350', majorWins: 'Winter Classic Cast Win' }
      },
      offspringStats: {
        registeredOffspring: 42,
        competitionHounds: 18,
        castWinners: 11,
        champions: 4,
        castWinRate: '26%'
      },
      huntHistory: [
        { date: 'Aug 15, 2026', event: 'Tennessee State Championship', state: 'TN', handler: 'Cody Campbell', result: 'Win', castScore: '375+ Pts', earnings: 2500, verified: true },
        { date: 'Jul 22, 2026', event: 'Summer Classic Nite Hunt', state: 'KY', handler: 'Cody Campbell', result: 'Split', castScore: '225+ Pts', earnings: 750, verified: true },
        { date: 'Jun 10, 2026', event: 'Great Smoky Nite Championship', state: 'TN', handler: 'Cody Campbell', result: 'Win', castScore: '450+ Pts', earnings: 3200, verified: true },
        { date: 'May 02, 2026', event: 'Bluegrass Open Invitational', state: 'KY', handler: 'Cody Campbell', result: 'Loss', castScore: '125- Pts', earnings: 0, verified: true },
        { date: 'Apr 18, 2026', event: 'Deep South Spring Classic', state: 'AL', handler: 'Cody Campbell', result: 'Win', castScore: '400+ Pts', earnings: 1800, verified: true }
      ]
    },
    {
      id: 'hound-2',
      name: 'DIXIE RIVER THUNDER',
      photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80',
      breed: 'Black and Tan Coonhound',
      sex: 'Male (Sire)',
      dob: 'Jun 18, 2020 (6 Yrs)',
      weight: '72 lbs',
      owner: 'Robert Miller',
      handler: 'Robert Miller',
      kennel: 'Dixie River Hounds',
      city: 'Oak Ridge',
      state: 'TN',
      pkcReg: 'PKC-910283-TN',
      ukcReg: 'UKC-B482910',
      proSportReg: 'PS-19284',
      isVerified: true,
      verificationSource: 'Official UHC Trial System',
      isAvailableAtStud: true,
      studTier: 'Featured Stud',
      studFee: '$400',
      rankNational: 2,
      rankState: 2,
      career: {
        hunts: 36,
        wins: 22,
        losses: 9,
        splits: 3,
        withdrawals: 2,
        dw: 0,
        winRate: 61.1,
        finalCasts: 7,
        championships: 2,
        earnings: 14200
      },
      registryWins: {
        pkc: { titles: 'Silver Champion', earnings: '$9,100', majorWins: 'Dixie Classic Winner' },
        ukc: { titles: 'Nite Champion (NITECH)', championships: 'Southeastern Championship Finalist', majorWins: 'State Hunt Cast Winner' },
        proSport: { titles: 'ProSport Cast Winner', earnings: '$5,100', majorWins: 'Appalachian Cup Winner' }
      },
      offspringStats: {
        registeredOffspring: 28,
        competitionHounds: 12,
        castWinners: 7,
        champions: 2,
        castWinRate: '25%'
      },
      huntHistory: [
        { date: 'Aug 14, 2026', event: 'Oak Ridge Nite Hunt', state: 'TN', handler: 'Robert Miller', result: 'Win', castScore: '325+ Pts', earnings: 1200, verified: true },
        { date: 'Jul 19, 2026', event: 'Kentucky Mountain Derby', state: 'KY', handler: 'Robert Miller', result: 'Win', castScore: '400+ Pts', earnings: 2100, verified: true },
        { date: 'Jun 28, 2026', event: 'Mid-South Open Trial', state: 'AL', handler: 'Robert Miller', result: 'Loss', castScore: '50- Pts', earnings: 0, verified: true }
      ]
    },
    {
      id: 'hound-3',
      name: 'LONE STAR REBEL ROUSER',
      photo: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&auto=format&fit=crop&q=80',
      breed: 'Bluetick Coonhound',
      sex: 'Male (Sire)',
      dob: 'Sep 04, 2022 (4 Yrs)',
      weight: '68 lbs',
      owner: 'Austin Sterling',
      handler: 'Austin Sterling',
      kennel: 'Lone Star Bluetick Kennels',
      city: 'Crockett',
      state: 'TX',
      pkcReg: 'PKC-481920-TX',
      ukcReg: 'UKC-BL91823',
      proSportReg: 'PS-84729',
      isVerified: true,
      verificationSource: 'Official UHC Trial System',
      isAvailableAtStud: true,
      studTier: 'Featured Stud',
      studFee: '$450',
      rankNational: 3,
      rankState: 1,
      career: {
        hunts: 29,
        wins: 19,
        losses: 7,
        splits: 2,
        withdrawals: 1,
        dw: 0,
        winRate: 65.5,
        finalCasts: 6,
        championships: 2,
        earnings: 11800
      },
      registryWins: {
        pkc: { titles: 'Gold Champion', earnings: '$7,200', majorWins: 'Texas State Championship Winner' },
        ukc: { titles: 'Nite Champion', championships: 'Southwest Classic 1st Place', majorWins: 'Piney Woods Cast Win' },
        proSport: { titles: 'Open Cast Winner', earnings: '$4,600', majorWins: 'Texas Pro Classic' }
      },
      offspringStats: {
        registeredOffspring: 16,
        competitionHounds: 7,
        castWinners: 4,
        champions: 1,
        castWinRate: '25%'
      },
      huntHistory: [
        { date: 'Aug 10, 2026', event: 'Texas Coonhound State Championship', state: 'TX', handler: 'Austin Sterling', result: 'Win', castScore: '425+ Pts', earnings: 2800, verified: true },
        { date: 'Jul 15, 2026', event: 'Gulf Coast Night Trial', state: 'TX', handler: 'Austin Sterling', result: 'Win', castScore: '350+ Pts', earnings: 1500, verified: true }
      ]
    },
    {
      id: 'hound-4',
      name: 'CUMBERLAND COPPER LADY',
      photo: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80',
      breed: 'Redbone Coonhound',
      sex: 'Female (Dam)',
      dob: 'Jan 22, 2022 (4 Yrs)',
      weight: '58 lbs',
      owner: 'Thomas Shelby',
      handler: 'Thomas Shelby',
      kennel: 'Cumberland Redbone Kennels',
      city: 'Middlesboro',
      state: 'KY',
      pkcReg: 'PKC-102938-KY',
      ukcReg: 'UKC-R819284',
      proSportReg: 'PS-55421',
      isVerified: true,
      verificationSource: 'Official UHC Trial System',
      isAvailableAtStud: false,
      studTier: 'Hound Profile (Free)',
      studFee: 'N/A',
      rankNational: 4,
      rankState: 1,
      career: {
        hunts: 24,
        wins: 15,
        losses: 6,
        splits: 2,
        withdrawals: 1,
        dw: 0,
        winRate: 62.5,
        finalCasts: 5,
        championships: 1,
        earnings: 8900
      },
      registryWins: {
        pkc: { titles: 'Champion', earnings: '$4,500', majorWins: 'Cumberland Derby Winner' },
        ukc: { titles: 'Nite Champion', championships: 'Kentucky Derby Top Cast', majorWins: 'Bluegrass Classic' },
        proSport: { titles: 'ProSport Winner', earnings: '$4,400', majorWins: 'Appalachian Derby' }
      },
      offspringStats: {
        registeredOffspring: 12,
        competitionHounds: 5,
        castWinners: 3,
        champions: 1,
        castWinRate: '25%'
      },
      huntHistory: [
        { date: 'Aug 02, 2026', event: 'Kentucky Summer Night Hunt', state: 'KY', handler: 'Thomas Shelby', result: 'Win', castScore: '300+ Pts', earnings: 1400, verified: true }
      ]
    }
  ];

  const breeds = ['All', 'Treeing Walker Coonhound', 'Black and Tan Coonhound', 'Bluetick Coonhound', 'Redbone Coonhound', 'English Coonhound', 'Plott Hound'];
  const states = ['All', 'TN', 'KY', 'TX', 'AL', 'GA', 'NC', 'SC', 'MO', 'AR'];

  const filteredHounds = houndsData.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.handler.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.kennel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.pkcReg.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.ukcReg.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBreed = selectedBreed === 'All' || h.breed === selectedBreed;
    const matchesState = selectedState === 'All' || h.state === selectedState;
    const matchesVerified = !verifiedOnly || h.isVerified;

    return matchesSearch && matchesBreed && matchesState && matchesVerified;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-tan-500/40 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Official Canine Athletic Registry
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              UHC Hound Finder
            </h1>
            <p className="text-xs sm:text-sm text-tan-200 font-medium leading-relaxed">
              The permanent competitive statistics system for canine athletes across the United States. Search verified career records, hunt histories, titles, and breeding genetics.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              to="/stud-dogs"
              className="px-5 py-3 rounded-xl bg-tan-500 hover:bg-tan-400 text-forest-950 text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 text-center"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Stud Dog Directory ($49/yr)</span>
            </Link>
            <Link
              to="/join"
              className="px-5 py-3 rounded-xl bg-forest-800/80 hover:bg-forest-800 border border-forest-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 text-center"
            >
              <ShieldCheck className="w-4 h-4 text-tan-400" />
              <span>Register Hound ($25)</span>
            </Link>
          </div>
        </div>

        {/* Quick Career Record Notation Bar */}
        <div className="pt-4 border-t border-forest-800/80 flex flex-wrap items-center gap-4 text-[11px] text-tan-200/80">
          <span className="font-bold text-white uppercase text-[10px] tracking-widest">UHC Record Format:</span>
          <span className="bg-forest-900/90 px-2.5 py-1 rounded-md border border-forest-700"><strong>W:</strong> Wins</span>
          <span className="bg-forest-900/90 px-2.5 py-1 rounded-md border border-forest-700"><strong>L:</strong> Losses</span>
          <span className="bg-forest-900/90 px-2.5 py-1 rounded-md border border-forest-700"><strong>S:</strong> Splits</span>
          <span className="bg-forest-900/90 px-2.5 py-1 rounded-md border border-forest-700"><strong>WD:</strong> Withdrawals</span>
          <span className="bg-forest-900/90 px-2.5 py-1 rounded-md border border-forest-700"><strong>DW:</strong> Disqualified Wins</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-lowest p-5 rounded-2xl border border-surface-border shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light" />
            <input
              type="text"
              placeholder="Search by Hound Name, Owner, Handler, Kennel, PKC #, UKC #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-surface-low border border-surface-border rounded-xl focus:outline-none focus:border-forest-800 font-medium"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedBreed}
              onChange={(e) => setSelectedBreed(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-surface-border rounded-xl focus:outline-none focus:border-forest-800 font-medium"
            >
              {breeds.map((b) => (
                <option key={b} value={b}>{b === 'All' ? 'All Breeds' : b}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-surface-border rounded-xl focus:outline-none focus:border-forest-800 font-medium"
            >
              {states.map((s) => (
                <option key={s} value={s}>{s === 'All' ? 'All States' : `State: ${s}`}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex items-center justify-center">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-forest-900 bg-surface-low px-3 py-2 rounded-xl border border-surface-border w-full justify-center">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded text-forest-800 focus:ring-forest-800"
              />
              <span>✓ Verified Only</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-charcoal-muted pt-2 border-t border-surface-border">
          <span>Showing <strong>{filteredHounds.length}</strong> registered hound athletes</span>
          <span className="text-[11px]">Rankings updated weekly from verified trial scorecards</span>
        </div>
      </div>

      {/* Hounds Athtlete Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredHounds.map((hound) => (
          <div
            key={hound.id}
            className="bg-surface-lowest rounded-2xl border border-surface-border shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Card Header & Photo */}
              <div className="p-5 flex gap-4 items-start">
                <img
                  src={hound.photo}
                  alt={hound.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border border-surface-border shrink-0"
                />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {hound.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> UHC Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-charcoal-muted bg-surface-low border border-surface-border px-2 py-0.5 rounded-full">
                        Owner Submitted
                      </span>
                    )}

                    {hound.isAvailableAtStud && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-tan-800 bg-tan-50 border border-tan-300 px-2 py-0.5 rounded-full">
                        <HeartHandshake className="w-3 h-3 text-tan-600" /> At Stud
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-forest-950 truncate">{hound.name}</h3>
                  <div className="text-xs text-charcoal font-semibold">{hound.breed} • {hound.sex}</div>
                  <div className="text-[11px] text-charcoal-muted flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-forest-700" /> {hound.city}, {hound.state} • {hound.kennel}
                  </div>
                </div>
              </div>

              {/* Career Record Badge Bar (W - L - S - WD - DW) */}
              <div className="bg-forest-950 text-white px-5 py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-tan-300 uppercase font-black tracking-wider">Career Record</div>
                  <div className="font-mono text-sm font-black tracking-wide">
                    {hound.career.wins}W - {hound.career.losses}L - {hound.career.splits}S - {hound.career.withdrawals}WD
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-tan-300 uppercase font-black tracking-wider">Win Rate</div>
                  <div className="text-sm font-black text-tan-400">{hound.career.winRate}%</div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-tan-300 uppercase font-black tracking-wider">UHC Earnings</div>
                  <div className="text-sm font-black text-emerald-400">${hound.career.earnings.toLocaleString()}</div>
                </div>
              </div>

              {/* Registry Accomplishments */}
              <div className="p-5 space-y-2.5 text-xs">
                <div className="font-extrabold text-charcoal text-[11px] uppercase tracking-wider">Registry Credentials</div>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-surface-low border border-surface-border">
                    <div className="font-black text-forest-900">PKC</div>
                    <div className="text-[10px] text-charcoal-muted truncate">{hound.pkcReg}</div>
                    <div className="font-bold text-tan-700 mt-1">{hound.registryWins.pkc.titles}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-low border border-surface-border">
                    <div className="font-black text-forest-900">UKC</div>
                    <div className="text-[10px] text-charcoal-muted truncate">{hound.ukcReg}</div>
                    <div className="font-bold text-tan-700 mt-1">{hound.registryWins.ukc.titles}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-low border border-surface-border">
                    <div className="font-black text-forest-900">ProSport</div>
                    <div className="text-[10px] text-charcoal-muted truncate">{hound.proSportReg}</div>
                    <div className="font-bold text-tan-700 mt-1">{hound.registryWins.proSport.titles}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-5 py-3.5 bg-surface-low border-t border-surface-border flex items-center justify-between">
              <span className="text-[11px] font-bold text-charcoal">
                National Rank: <strong className="text-forest-900">#{hound.rankNational}</strong> (State #{hound.rankState})
              </span>
              <button
                type="button"
                onClick={() => setSelectedHound(hound)}
                className="px-3.5 py-1.5 rounded-lg bg-forest-900 hover:bg-forest-950 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Full Career & Pedigree</span>
                <ChevronRight className="w-3.5 h-3.5 text-tan-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full Hound Detail Modal */}
      {selectedHound && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-lowest text-charcoal w-full max-w-4xl rounded-3xl shadow-2xl border border-surface-border overflow-hidden my-8 space-y-6">
            {/* Modal Header */}
            <div className="bg-forest-950 text-white p-6 sm:p-8 flex items-start justify-between relative">
              <div className="flex gap-5 items-center">
                <img
                  src={selectedHound.photo}
                  alt={selectedHound.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-tan-500/50 shadow-md shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-forest-950 uppercase tracking-wider">
                      ✓ UHC Verified Athlete
                    </span>
                    {selectedHound.isAvailableAtStud && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-tan-500 text-forest-950 uppercase tracking-wider">
                        {selectedHound.studTier}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">{selectedHound.name}</h2>
                  <p className="text-xs text-tan-200">
                    {selectedHound.breed} • Owner: <strong>{selectedHound.owner}</strong> • Handler: <strong>{selectedHound.handler}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedHound(null)}
                className="text-tan-300 hover:text-white p-2 rounded-xl bg-forest-900 border border-forest-800 text-sm font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Comprehensive Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-surface-low border border-surface-border text-center">
                  <div className="text-[10px] text-charcoal-muted uppercase font-extrabold">Total Hunts</div>
                  <div className="text-xl font-black text-forest-900">{selectedHound.career.hunts}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-low border border-surface-border text-center">
                  <div className="text-[10px] text-charcoal-muted uppercase font-extrabold">Career Record (W-L-S)</div>
                  <div className="text-xl font-black text-forest-900">{selectedHound.career.wins}-{selectedHound.career.losses}-{selectedHound.career.splits}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-low border border-surface-border text-center">
                  <div className="text-[10px] text-charcoal-muted uppercase font-extrabold">Final Casts Made</div>
                  <div className="text-xl font-black text-tan-700">{selectedHound.career.finalCasts}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-low border border-surface-border text-center">
                  <div className="text-[10px] text-charcoal-muted uppercase font-extrabold">UHC Earnings</div>
                  <div className="text-xl font-black text-emerald-700">${selectedHound.career.earnings.toLocaleString()}</div>
                </div>
              </div>

              {/* Breeding & Offspring Genetics Section (James's Request) */}
              {selectedHound.isAvailableAtStud && (
                <div className="p-4 rounded-2xl bg-tan-50 border border-tan-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-forest-900 flex items-center gap-1.5">
                      <HeartHandshake className="w-4 h-4 text-tan-700" /> Breeding Genetics & Offspring Record
                    </span>
                    <span className="text-xs font-black text-forest-950">Stud Fee: {selectedHound.studFee}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                    <div className="bg-white p-2 rounded-lg border border-tan-200">
                      <span className="text-[10px] text-charcoal-muted block">Registered Offspring:</span>
                      <strong className="text-forest-950">{selectedHound.offspringStats.registeredOffspring} Dogs</strong>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-tan-200">
                      <span className="text-[10px] text-charcoal-muted block">Competition Hounds:</span>
                      <strong className="text-forest-950">{selectedHound.offspringStats.competitionHounds} Active</strong>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-tan-200">
                      <span className="text-[10px] text-charcoal-muted block">Cast Winners Sired:</span>
                      <strong className="text-forest-950">{selectedHound.offspringStats.castWinners} Winners</strong>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-tan-200">
                      <span className="text-[10px] text-charcoal-muted block">Offspring Win Rate:</span>
                      <strong className="text-emerald-700">{selectedHound.offspringStats.castWinRate}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Chronological Competition Hunt History Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-forest-950 uppercase tracking-wide">
                    Chronological Verified Hunt History
                  </h4>
                  <span className="text-[11px] text-charcoal-muted">✓ Locked from owner modification</span>
                </div>

                <div className="overflow-x-auto border border-surface-border rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-surface-low border-b border-surface-border text-charcoal font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">Event Name</th>
                        <th className="p-3">State</th>
                        <th className="p-3">Handler</th>
                        <th className="p-3">Cast Score</th>
                        <th className="p-3">Result</th>
                        <th className="p-3 text-right">Earnings</th>
                        <th className="p-3 text-center">Verified</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {selectedHound.huntHistory.map((hunt, idx) => (
                        <tr key={idx} className="hover:bg-surface-low/50">
                          <td className="p-3 font-medium text-charcoal-muted">{hunt.date}</td>
                          <td className="p-3 font-bold text-forest-950">{hunt.event}</td>
                          <td className="p-3 font-bold">{hunt.state}</td>
                          <td className="p-3 text-charcoal">{hunt.handler}</td>
                          <td className="p-3 font-mono font-bold">{hunt.castScore}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                              hunt.result === 'Win' ? 'bg-emerald-100 text-emerald-800' :
                              hunt.result === 'Split' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {hunt.result}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-right text-emerald-700">
                            {hunt.earnings > 0 ? `$${hunt.earnings.toLocaleString()}` : '—'}
                          </td>
                          <td className="p-3 text-center">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-charcoal-muted">
                  Official registry records are permanently archived under UHC Sanctioning Bylaws.
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => alert(`Contacting ${selectedHound.owner} for stud service inquiry regarding ${selectedHound.name}.`)}
                    className="px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-950 text-white text-xs font-bold transition-all"
                  >
                    Contact Owner / Inquire Stud
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedHound(null)}
                    className="px-4 py-2 rounded-xl bg-surface-low border border-surface-border text-charcoal text-xs font-bold"
                  >
                    Back to Directory
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoundFinderPage;

